/*
 * ReStore - PS5 12.40 后台常驻守护服务与独立应用登记底座 (#38)
 *
 * 核心职责：
 * 1. 保持精简 ELF 体积（不将数百 KB 静态资源塞入 .rodata，统一从
 *    /data/restore/ui 与 /data/restore/app 按需读取）。
 * 2. 遵循 PS5 12.40 载荷生命周期安全约束：严禁强杀或直接退出已执行 crt1.o
 *    重叠 IPv6 Socket 初始化的进程，防止内核重复释放 ip6_pktopts 引发崩溃。
 * 3. 先在 9099 端口绑定本地 HTTP 服务（/api/status、/api/state、
 *    /api/register 与前端静态资源），再向 PS5 主界面登记 RSTR00001。
 */

#include <arpa/inet.h>
#include <dlfcn.h>
#include <errno.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <pthread.h>
#include <signal.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mount.h>
#include <sys/param.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/syscall.h>
#include <sys/sysctl.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

#include <ps5/kernel.h>
#include <ps5/klog.h>

#define RESTORE_TITLE_ID "RSTR00001"
#define RESTORE_PORT 9099
#define RESTORE_DATA_DIR "/data/restore"
#define RESTORE_APP_DIR "/data/restore/app"
#define RESTORE_UI_DIR "/data/restore/ui"
#define RESTORE_STATE_FILE "/data/restore/state.json"
#define RESTORE_LOG_FILE "/data/restore/daemon.log"
#define RESTORE_AUTHID 0x4801000000000013ULL

typedef struct notify_request {
  char useless1[45];
  char message[3075];
} notify_request_t;

int sceKernelSendNotificationRequest(int, notify_request_t *, size_t, int);
int sceUserServiceInitialize(void *);
void sceUserServiceTerminate(void);

static time_t g_start_time = 0;
static bool g_app_registered = false;
static int g_last_install_rc = -999;
static pthread_mutex_t g_state_mutex = PTHREAD_MUTEX_INITIALIZER;

static void daemon_log(const char *fmt, ...) {
  char buf[1024];
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(buf, sizeof(buf), fmt, ap);
  va_end(ap);

  klog_printf("[ReStore] %s\n", buf);

  FILE *fp = fopen(RESTORE_LOG_FILE, "a");
  if (fp) {
    time_t now = time(NULL);
    struct tm tmv;
    gmtime_r(&now, &tmv);
    fprintf(fp, "[%04d-%02d-%02dT%02d:%02d:%02dZ] %s\n", tmv.tm_year + 1900,
            tmv.tm_mon + 1, tmv.tm_mday, tmv.tm_hour, tmv.tm_min, tmv.tm_sec,
            buf);
    fclose(fp);
  }
}

static void send_ps5_notification(const char *fmt, ...) {
  notify_request_t req;
  memset(&req, 0, sizeof(req));
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(req.message, sizeof(req.message) - 1, fmt, ap);
  va_end(ap);
  sceKernelSendNotificationRequest(0, &req, sizeof(req), 0);
}

/*
 * 安全提权：仅设置进程 authid 与全量权限位（与实测稳定的 ps5loop.elf 一致），
 * 不额外修改已由 elfldr.elf 初始化完成的 rootdir / jaildir。
 */
static void elevate_privileges(void) {
  pid_t pid = getpid();
  uint64_t orig_authid = kernel_get_ucred_authid(pid);
  const uint8_t all_caps[16] = {0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
                                0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff};
  int rc_auth = kernel_set_ucred_authid(pid, RESTORE_AUTHID);
  int rc_caps = kernel_set_ucred_caps(pid, all_caps);
  uint64_t new_authid = kernel_get_ucred_authid(pid);
  daemon_log("elevate pid=%d authid 0x%llx -> 0x%llx (rc=%d, caps_rc=%d)",
             (int)pid, (unsigned long long)orig_authid,
             (unsigned long long)new_authid, rc_auth, rc_caps);
}

/*
 * 原地休眠挂起而不退出进程：
 * ps5-payload-sdk 的 crt1.o (__kernel_init) 会重叠两个 IPv6 Socket 的
 * ip6_pktopts 指针；若进程退出关闭文件描述符表，内核会二次释放同一结构体导致崩溃。
 */
static void park_forever(const char *reason) {
  daemon_log("parking process pid=%d forever (%s)", (int)getpid(), reason);
  for (;;) {
    sleep(3600);
  }
}

static bool write_file_atomic(const char *path, const uint8_t *data,
                              size_t size) {
  char tmp_path[PATH_MAX];
  snprintf(tmp_path, sizeof(tmp_path), "%s.tmp", path);

  int fd = open(tmp_path, O_WRONLY | O_CREAT | O_TRUNC, 0755);
  if (fd < 0)
    return false;

  size_t off = 0;
  while (off < size) {
    ssize_t n = write(fd, data + off, size - off);
    if (n <= 0) {
      close(fd);
      unlink(tmp_path);
      return false;
    }
    off += (size_t)n;
  }
  fsync(fd);
  close(fd);

  if (rename(tmp_path, path) != 0) {
    unlink(tmp_path);
    return false;
  }
  return true;
}

static uint8_t *read_disk_file(const char *path, size_t *size_out) {
  *size_out = 0;
  FILE *fp = fopen(path, "rb");
  if (!fp)
    return NULL;
  if (fseek(fp, 0, SEEK_END) != 0) {
    fclose(fp);
    return NULL;
  }
  long sz = ftell(fp);
  if (sz <= 0 || sz > 16 * 1024 * 1024) {
    fclose(fp);
    return NULL;
  }
  rewind(fp);
  uint8_t *buf = malloc((size_t)sz);
  if (!buf) {
    fclose(fp);
    return NULL;
  }
  size_t rd = fread(buf, 1, (size_t)sz, fp);
  fclose(fp);
  if (rd != (size_t)sz) {
    free(buf);
    return NULL;
  }
  *size_out = rd;
  return buf;
}

static bool copy_file_atomic(const char *src_path, const char *dst_path) {
  size_t sz = 0;
  uint8_t *buf = read_disk_file(src_path, &sz);
  if (!buf || sz == 0) {
    free(buf);
    return false;
  }
  bool ok = write_file_atomic(dst_path, buf, sz);
  free(buf);
  return ok;
}

static bool files_match_size_on_disk(const char *path_a, const char *path_b) {
  struct stat sta, stb;
  if (stat(path_a, &sta) != 0 || stat(path_b, &stb) != 0)
    return false;
  return sta.st_size > 0 && sta.st_size == stb.st_size;
}

static int call_install_app(const char *title_id, const char *dir) {
  void *ipmi =
      dlopen("/system/common/lib/libSceIpmi.sprx", RTLD_NOW | RTLD_GLOBAL);
  if (!ipmi) {
    ipmi = dlopen("libSceIpmi.sprx", RTLD_NOW | RTLD_GLOBAL);
  }
  void *appinst = dlopen("/system/common/lib/libSceAppInstUtil.sprx",
                         RTLD_NOW | RTLD_GLOBAL);
  if (!appinst) {
    appinst = dlopen("libSceAppInstUtil.sprx", RTLD_NOW | RTLD_GLOBAL);
  }
  daemon_log("dlopen libSceIpmi=%p libSceAppInstUtil=%p", ipmi, appinst);
  if (!appinst) {
    return -1;
  }

  int (*fn_init)(void) =
      (int (*)(void))dlsym(appinst, "sceAppInstUtilInitialize");
  if (fn_init) {
    int init_rc = fn_init();
    daemon_log("sceAppInstUtilInitialize rc=0x%08x", (unsigned)init_rc);
  }

  int (*sceAppInstUtilAppInstallTitleDir)(const char *, const char *, void *) =
      (int (*)(const char *, const char *, void *))dlsym(
          appinst, "sceAppInstUtilAppInstallTitleDir");
  if (!sceAppInstUtilAppInstallTitleDir) {
    const char *nid = "Wudg3Xe3heE";
    uint32_t handle = 0;
    if (!kernel_dynlib_handle(-1, "libSceAppInstUtil.sprx", &handle)) {
      sceAppInstUtilAppInstallTitleDir =
          (void *)kernel_dynlib_resolve(-1, handle, nid);
    }
  }
  if (sceAppInstUtilAppInstallTitleDir) {
    return sceAppInstUtilAppInstallTitleDir(title_id, dir, NULL);
  }

  int (*fn_install_all)(void *) =
      (int (*)(void *))dlsym(appinst, "sceAppInstUtilAppInstallAll");
  if (fn_install_all) {
    return fn_install_all(NULL);
  }
  return -2;
}

static bool is_title_in_app_db(const char *title_id) {
  size_t rd = 0;
  uint8_t *buf = read_disk_file("/system_data/priv/mms/app.db", &rd);
  if (!buf)
    return false;

  size_t needle_len = strlen(title_id);
  bool found = false;
  if (rd >= needle_len) {
    for (size_t i = 0; i <= rd - needle_len; i++) {
      if (memcmp(buf + i, title_id, needle_len) == 0) {
        found = true;
        break;
      }
    }
  }
  free(buf);
  return found;
}

static bool register_restore_app(bool force_reinstall) {
  const char *src_param = RESTORE_APP_DIR "/param.json";
  const char *src_icon = RESTORE_APP_DIR "/icon0.png";
  const char *app_dir = "/user/app/" RESTORE_TITLE_ID;
  const char *sce_sys_dir = "/user/app/" RESTORE_TITLE_ID "/sce_sys";
  const char *param_path = "/user/app/" RESTORE_TITLE_ID "/sce_sys/param.json";
  const char *icon_path = "/user/app/" RESTORE_TITLE_ID "/sce_sys/icon0.png";
  const char *meta_dir = "/user/appmeta/" RESTORE_TITLE_ID;
  const char *meta_param = "/user/appmeta/" RESTORE_TITLE_ID "/param.json";
  const char *meta_icon = "/user/appmeta/" RESTORE_TITLE_ID "/icon0.png";

  bool already_registered =
      !force_reinstall &&
      files_match_size_on_disk(meta_param, src_param) &&
      files_match_size_on_disk(meta_icon, src_icon) &&
      is_title_in_app_db(RESTORE_TITLE_ID);

  mkdir("/user/app", 0755);
  mkdir(app_dir, 0755);
  mkdir(sce_sys_dir, 0755);

  if (!copy_file_atomic(src_param, param_path)) {
    daemon_log("failed to copy %s -> %s: %s", src_param, param_path,
               strerror(errno));
    return false;
  }
  if (!copy_file_atomic(src_icon, icon_path)) {
    daemon_log("failed to copy %s -> %s: %s", src_icon, icon_path,
               strerror(errno));
    return false;
  }

  if (already_registered) {
    g_last_install_rc = 0;
    daemon_log("%s already registered in appmeta and app.db", RESTORE_TITLE_ID);
    return true;
  }

  int inst_rc = call_install_app(RESTORE_TITLE_ID, "/user/app/");
  g_last_install_rc = inst_rc;
  daemon_log("call_install_app(%s) rc=0x%08x", RESTORE_TITLE_ID,
             (unsigned)inst_rc);

  mkdir("/user/appmeta", 0755);
  mkdir(meta_dir, 0755);
  (void)copy_file_atomic(src_param, meta_param);
  (void)copy_file_atomic(src_icon, meta_icon);

  return is_title_in_app_db(RESTORE_TITLE_ID) || inst_rc == 0;
}

static void read_active_user_info(char *uid_hex_out, size_t uid_hex_sz,
                                  char *username_out, size_t username_sz,
                                  bool *activated_out) {
  snprintf(uid_hex_out, uid_hex_sz, "unknown");
  snprintf(username_out, username_sz, "PS5 User");
  *activated_out = false;

  FILE *uf = fopen("/system_data/priv/home/user_list.dat", "rb");
  if (!uf)
    return;
  uint32_t uid = 0;
  if (fread(&uid, sizeof(uid), 1, uf) != 1 || uid == 0) {
    fclose(uf);
    return;
  }
  fclose(uf);

  snprintf(uid_hex_out, uid_hex_sz, "%08x", uid);

  char cfg_path[128];
  snprintf(cfg_path, sizeof(cfg_path), "/system_data/priv/home/%08x/config.dat",
           uid);
  FILE *cf = fopen(cfg_path, "rb");
  if (!cf)
    return;

  uint8_t buf[0x120];
  memset(buf, 0, sizeof(buf));
  size_t rd = fread(buf, 1, sizeof(buf), cf);
  fclose(cf);

  if (rd >= 0x110) {
    char name_tmp[18];
    memcpy(name_tmp, buf + 0x04, 17);
    name_tmp[17] = '\0';
    if (name_tmp[0] != '\0') {
      snprintf(username_out, username_sz, "%s", name_tmp);
    }
    uint64_t acct_id = 0;
    memcpy(&acct_id, buf + 0x100, sizeof(acct_id));
    *activated_out = (acct_id != 0);
  }
}

static bool send_all(int fd, const void *buf, size_t len) {
  const uint8_t *p = (const uint8_t *)buf;
  size_t off = 0;
  while (off < len) {
    ssize_t n = send(fd, p + off, len - off, 0);
    if (n <= 0)
      return false;
    off += (size_t)n;
  }
  return true;
}

static void send_http_response(int fd, int status_code, const char *status_text,
                               const char *content_type, const void *body,
                               size_t body_len) {
  char hdr[512];
  int hdr_len = snprintf(
      hdr, sizeof(hdr),
      "HTTP/1.1 %d %s\r\n"
      "Content-Type: %s\r\n"
      "Content-Length: %zu\r\n"
      "Cache-Control: no-store, no-cache, must-revalidate\r\n"
      "Access-Control-Allow-Origin: *\r\n"
      "Access-Control-Allow-Methods: GET, POST, OPTIONS\r\n"
      "Access-Control-Allow-Headers: Content-Type\r\n"
      "Connection: close\r\n\r\n",
      status_code, status_text, content_type, body_len);
  if (hdr_len > 0) {
    (void)send_all(fd, hdr, (size_t)hdr_len);
  }
  if (body && body_len > 0) {
    (void)send_all(fd, body, body_len);
  }
}

static void handle_api_status(int fd) {
  struct statfs sfs;
  uint64_t free_gb = 218;
  uint64_t total_gb = 825;
  int used_pct = 74;

  if (statfs("/user", &sfs) == 0 && sfs.f_blocks > 0) {
    uint64_t total_bytes = (uint64_t)sfs.f_blocks * (uint64_t)sfs.f_bsize;
    uint64_t avail_bytes = (uint64_t)sfs.f_bavail * (uint64_t)sfs.f_bsize;
    total_gb = total_bytes / (1000ULL * 1000ULL * 1000ULL);
    free_gb = avail_bytes / (1000ULL * 1000ULL * 1000ULL);
    if (total_bytes > 0) {
      used_pct =
          (int)(((total_bytes - avail_bytes) * 100ULL) / total_bytes);
    }
  }

  char uid_hex[32];
  char username[64];
  bool activated = false;
  read_active_user_info(uid_hex, sizeof(uid_hex), username, sizeof(username),
                        &activated);

  char persisted_json[4096];
  snprintf(persisted_json, sizeof(persisted_json), "null");
  pthread_mutex_lock(&g_state_mutex);
  FILE *sf = fopen(RESTORE_STATE_FILE, "rb");
  if (sf) {
    size_t rd = fread(persisted_json, 1, sizeof(persisted_json) - 1, sf);
    fclose(sf);
    persisted_json[rd] = '\0';
    if (rd == 0 || persisted_json[0] != '{') {
      snprintf(persisted_json, sizeof(persisted_json), "null");
    }
  }
  pthread_mutex_unlock(&g_state_mutex);

  time_t now = time(NULL);
  long uptime = (g_start_time > 0 && now >= g_start_time)
                    ? (long)(now - g_start_time)
                    : 0;

  bool in_db = is_title_in_app_db(RESTORE_TITLE_ID);

  char json[8192];
  int len = snprintf(
      json, sizeof(json),
      "{"
      "\"ok\":true,"
      "\"daemon\":{"
      "\"running\":true,"
      "\"pid\":%d,"
      "\"uptime_sec\":%ld,"
      "\"title_id\":\"%s\","
      "\"port\":%d,"
      "\"registered\":%s,"
      "\"in_app_db\":%s,"
      "\"last_install_rc\":%d"
      "},"
      "\"user\":{"
      "\"user_id_hex\":\"%s\","
      "\"username\":\"%s\","
      "\"account_activated\":%s"
      "},"
      "\"host_storage\":{"
      "\"free_gb\":%llu,"
      "\"total_gb\":%llu,"
      "\"used_percent\":%d,"
      "\"free_text\":\"%llu GB\","
      "\"total_text\":\"%llu GB\""
      "},"
      "\"persisted_state\":%s"
      "}",
      (int)getpid(), uptime, RESTORE_TITLE_ID, RESTORE_PORT,
      g_app_registered ? "true" : "false", in_db ? "true" : "false",
      g_last_install_rc, uid_hex, username, activated ? "true" : "false",
      (unsigned long long)free_gb, (unsigned long long)total_gb, used_pct,
      (unsigned long long)free_gb, (unsigned long long)total_gb,
      persisted_json);

  if (len < 0)
    len = 0;
  send_http_response(fd, 200, "OK", "application/json; charset=utf-8", json,
                     (size_t)len);
}

static void handle_api_state_post(int fd, const char *body, size_t body_len) {
  while (body_len > 0 && (*body == ' ' || *body == '\n' || *body == '\r' ||
                          *body == '\t')) {
    body++;
    body_len--;
  }
  if (body_len < 2 || body[0] != '{' || body_len > 3800) {
    const char *err = "{\"ok\":false,\"error\":\"invalid json object\"}";
    send_http_response(fd, 400, "Bad Request",
                       "application/json; charset=utf-8", err, strlen(err));
    return;
  }

  pthread_mutex_lock(&g_state_mutex);
  bool ok = write_file_atomic(RESTORE_STATE_FILE, (const uint8_t *)body,
                              body_len);
  pthread_mutex_unlock(&g_state_mutex);

  if (!ok) {
    const char *err = "{\"ok\":false,\"error\":\"write failed\"}";
    send_http_response(fd, 500, "Internal Server Error",
                       "application/json; charset=utf-8", err, strlen(err));
    return;
  }

  const char *resp = "{\"ok\":true}";
  send_http_response(fd, 200, "OK", "application/json; charset=utf-8", resp,
                     strlen(resp));
}

static bool serve_disk_file(int fd, const char *full_path,
                            const char *content_type) {
  size_t rd = 0;
  uint8_t *buf = read_disk_file(full_path, &rd);
  if (!buf)
    return false;
  send_http_response(fd, 200, "OK", content_type, buf, rd);
  free(buf);
  return true;
}

static void *handle_client_thread(void *arg) {
  int fd = (int)(intptr_t)arg;

  struct timeval tv;
  tv.tv_sec = 5;
  tv.tv_usec = 0;
  setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &tv, sizeof(tv));
  setsockopt(fd, SOL_SOCKET, SO_SNDTIMEO, &tv, sizeof(tv));

  char req[8192];
  ssize_t total = 0;
  ssize_t hdr_end = -1;
  while (total < (ssize_t)sizeof(req) - 1) {
    ssize_t n = recv(fd, req + total, sizeof(req) - 1 - (size_t)total, 0);
    if (n <= 0)
      break;
    total += n;
    req[total] = '\0';
    char *sep = strstr(req, "\r\n\r\n");
    if (sep) {
      hdr_end = (sep - req) + 4;
      break;
    }
  }

  if (total <= 0) {
    close(fd);
    return NULL;
  }

  char method[16] = {0};
  char uri[256] = {0};
  if (sscanf(req, "%15s %255s", method, uri) != 2) {
    close(fd);
    return NULL;
  }

  /* 剥离 URI 中的查询参数 (?...) */
  char *q = strchr(uri, '?');
  if (q)
    *q = '\0';

  if (strcmp(method, "OPTIONS") == 0) {
    send_http_response(fd, 204, "No Content", "text/plain", NULL, 0);
    close(fd);
    return NULL;
  }

  if (strcmp(method, "POST") == 0 && strcmp(uri, "/api/state") == 0) {
    size_t content_len = 0;
    const char *cl = strcasestr(req, "Content-Length:");
    if (cl) {
      content_len = (size_t)strtoul(cl + 15, NULL, 10);
    }
    const char *body_ptr = (hdr_end > 0) ? (req + hdr_end) : "";
    size_t have_body =
        (hdr_end > 0 && total >= hdr_end) ? (size_t)(total - hdr_end) : 0;
    while (have_body < content_len &&
           total < (ssize_t)sizeof(req) - 1) {
      ssize_t n = recv(fd, req + total, sizeof(req) - 1 - (size_t)total, 0);
      if (n <= 0)
        break;
      total += n;
      req[total] = '\0';
      have_body = (size_t)(total - hdr_end);
    }
    handle_api_state_post(fd, body_ptr,
                          content_len > 0 && content_len <= have_body
                              ? content_len
                              : have_body);
    close(fd);
    return NULL;
  }

  if (strcmp(method, "POST") == 0 && strcmp(uri, "/api/register") == 0) {
    g_app_registered = register_restore_app(true);
    handle_api_status(fd);
    close(fd);
    return NULL;
  }

  if (strcmp(uri, "/api/status") == 0) {
    handle_api_status(fd);
  } else if (strcmp(uri, "/") == 0 || strcmp(uri, "/index.html") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/index.html",
                         "text/html; charset=utf-8")) {
      const char *fallback =
          "<!doctype html><html><body><h1>ReStore daemon running</h1></body></html>";
      send_http_response(fd, 200, "OK", "text/html; charset=utf-8", fallback,
                         strlen(fallback));
    }
  } else if (strcmp(uri, "/styles.css") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/styles.css",
                         "text/css; charset=utf-8")) {
      send_http_response(fd, 404, "Not Found", "text/plain", "missing", 7);
    }
  } else if (strcmp(uri, "/app.js") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/app.js",
                         "application/javascript; charset=utf-8")) {
      send_http_response(fd, 404, "Not Found", "text/plain", "missing", 7);
    }
  } else if (strcmp(uri, "/motion.js") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/motion.js",
                         "application/javascript; charset=utf-8")) {
      send_http_response(fd, 404, "Not Found", "text/plain", "missing", 7);
    }
  } else if (strcmp(uri, "/assets/restore-logo.png") == 0 ||
             strcmp(uri, "/assets/restore-logo-full.png") == 0 ||
             strcmp(uri, "/icon0.png") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/assets/restore-logo.png",
                         "image/png") &&
        !serve_disk_file(fd, RESTORE_APP_DIR "/icon0.png", "image/png")) {
      send_http_response(fd, 404, "Not Found", "text/plain", "missing", 7);
    }
  } else if (strcmp(uri, "/assets/ps5-showcase-crop.jpg") == 0) {
    if (!serve_disk_file(fd, RESTORE_UI_DIR "/assets/ps5-showcase-crop.jpg",
                         "image/jpeg")) {
      send_http_response(fd, 404, "Not Found", "text/plain", "missing", 7);
    }
  } else {
    const char *not_found = "{\"ok\":false,\"error\":\"not found\"}";
    send_http_response(fd, 404, "Not Found",
                       "application/json; charset=utf-8", not_found,
                       strlen(not_found));
  }

  close(fd);
  return NULL;
}

int main(void) {
  signal(SIGPIPE, SIG_IGN);
  g_start_time = time(NULL);

  mkdir(RESTORE_DATA_DIR, 0777);
  mkdir(RESTORE_APP_DIR, 0777);
  mkdir(RESTORE_UI_DIR, 0777);
  mkdir(RESTORE_UI_DIR "/assets", 0777);

  daemon_log("starting ReStore resident daemon (pid=%d, fw=0x%08x)",
             (int)getpid(), kernel_get_fw_version());

  elevate_privileges();
  (void)sceUserServiceInitialize(NULL);

  int srv_fd = socket(AF_INET, SOCK_STREAM, 0);
  if (srv_fd < 0) {
    daemon_log("socket() failed: %s", strerror(errno));
    park_forever("socket failed");
  }

  int opt = 1;
  setsockopt(srv_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));

  struct sockaddr_in addr;
  memset(&addr, 0, sizeof(addr));
  addr.sin_family = AF_INET;
  addr.sin_addr.s_addr = htonl(INADDR_ANY);
  addr.sin_port = htons(RESTORE_PORT);

  if (bind(srv_fd, (struct sockaddr *)&addr, sizeof(addr)) != 0) {
    daemon_log("bind(:%d) failed: %s", RESTORE_PORT, strerror(errno));
    close(srv_fd);
    park_forever("bind failed - another instance is already listening");
  }

  if (listen(srv_fd, 64) != 0) {
    daemon_log("listen(:%d) failed: %s", RESTORE_PORT, strerror(errno));
    close(srv_fd);
    park_forever("listen failed");
  }

  daemon_log("listening on 0.0.0.0:%d (deeplink http://127.0.0.1:%d/)",
             RESTORE_PORT, RESTORE_PORT);

  g_app_registered = register_restore_app(false);
  daemon_log("standalone app %s registration status=%d (rc=0x%08x)",
             RESTORE_TITLE_ID, g_app_registered ? 1 : 0,
             (unsigned)g_last_install_rc);
  send_ps5_notification("ReStore 服务已驻留 (:%d)", RESTORE_PORT);

  pthread_attr_t attr;
  pthread_attr_init(&attr);
  pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_DETACHED);

  while (true) {
    int client_fd = accept(srv_fd, NULL, NULL);
    if (client_fd < 0) {
      if (errno == EINTR)
        continue;
      usleep(50000);
      continue;
    }

    pthread_t tid;
    if (pthread_create(&tid, &attr, handle_client_thread,
                       (void *)(intptr_t)client_fd) != 0) {
      handle_client_thread((void *)(intptr_t)client_fd);
    }
  }

  close(srv_fd);
  sceUserServiceTerminate();
  park_forever("main loop exited");
  return EXIT_SUCCESS;
}
