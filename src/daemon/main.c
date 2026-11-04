/*
 * ReStore - PS5 12.40 Resident Background Service & Standalone App Host (#38)
 *
 * Responsibilities:
 * 1. CPU-only CRT startup & 4-step verified credential/rootdir elevation.
 * 2. Single-instance takeover (terminates older restore.elf instance cleanly).
 * 3. Registers RSTR00001 standalone app (with official ReStore 512x512 icon
 *    and deeplinkUri http://127.0.0.1:9090/) onto the PS5 12.40 home screen.
 * 4. Serves the Phase 1 UI and local JSON API (/api/status, /api/state) on
 *    port 9090 while remaining resident after foreground apps close.
 */

#include <arpa/inet.h>
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
#define RESTORE_PORT 9090
#define RESTORE_DATA_DIR "/data/restore"
#define RESTORE_STATE_FILE "/data/restore/state.json"
#define RESTORE_STATE_TMP "/data/restore/state.json.tmp"
#define RESTORE_LOG_FILE "/data/restore/daemon.log"
#define RESTORE_AUTHID 0x4801000000000013ULL

#define INCASSET(name, file)                                                   \
  __asm__(".section .rodata\n"                                                 \
          ".global " #name "\n"                                                \
          ".global " #name "_end\n"                                            \
          ".global " #name "_size\n"                                           \
          ".align 16\n" #name ":\n"                                            \
          ".incbin \"" file "\"\n" #name "_end:\n" #name "_size:\n"            \
          ".quad " #name "_end - " #name "\n"                                  \
          ".previous\n");                                                      \
  extern const uint8_t name[];                                                 \
  extern const size_t name##_size;

INCASSET(asset_param_json, "../../assets/app/param.json");
INCASSET(asset_icon0_png, "../../assets/app/icon0.png");
INCASSET(asset_index_html, "../ui/index.html");
INCASSET(asset_styles_css, "../ui/styles.css");
INCASSET(asset_app_js, "../ui/app.js");
INCASSET(asset_motion_js, "../ui/motion.js");
INCASSET(asset_bg_jpg, "../ui/assets/ps5-showcase-crop.jpg");

typedef struct notify_request {
  char useless1[45];
  char message[3075];
} notify_request_t;

int sceKernelSendNotificationRequest(int, notify_request_t *, size_t, int);
int sceAppInstUtilInitialize(void);
int sceAppInstUtilAppInstallAll(void *);
int sceUserServiceInitialize(void *);
void sceUserServiceTerminate(void);

static time_t g_start_time = 0;
static bool g_app_registered = false;
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
 * 4-Step Verified Privilege & RootVnode Escape (ps5-1240-runtime-safety.md)
 */
typedef struct cred_backup {
  pid_t pid;
  uint64_t orig_authid;
  intptr_t orig_rootdir;
  intptr_t orig_jaildir;
  uint32_t changed_mask;
} cred_backup_t;

#define CRED_CHANGED_AUTHID (1u << 0)
#define CRED_CHANGED_ROOTDIR (1u << 1)
#define CRED_CHANGED_JAILDIR (1u << 2)

static bool elevate_and_verify(cred_backup_t *out) {
  memset(out, 0, sizeof(*out));
  pid_t pid = getpid();
  out->pid = pid;

  intptr_t ucred = kernel_get_proc_ucred(pid);
  intptr_t fdesc = kernel_get_proc_filedesc(pid);
  intptr_t rootvnode = KERNEL_ADDRESS_ROOTVNODE;
  if (!ucred || !fdesc || !rootvnode) {
    klog_printf("[ReStore] elevate aborted: ucred=%p fdesc=%p rootvnode=%p\n",
                (void *)ucred, (void *)fdesc, (void *)rootvnode);
    return false;
  }

  out->orig_authid = kernel_get_ucred_authid(pid);
  if (out->orig_authid != RESTORE_AUTHID) {
    if (kernel_set_ucred_authid(pid, RESTORE_AUTHID) != 0 ||
        kernel_get_ucred_authid(pid) != RESTORE_AUTHID) {
      klog_printf("[ReStore] authid read-back verification failed\n");
      return false;
    }
    out->changed_mask |= CRED_CHANGED_AUTHID;
  }

  out->orig_rootdir = kernel_get_proc_rootdir(pid);
  if (out->orig_rootdir != rootvnode) {
    if (kernel_set_proc_rootdir(pid, rootvnode) != 0 ||
        kernel_get_proc_rootdir(pid) != rootvnode) {
      klog_printf("[ReStore] rootdir read-back verification failed\n");
      return false;
    }
    out->changed_mask |= CRED_CHANGED_ROOTDIR;
  }

  out->orig_jaildir = kernel_get_proc_jaildir(pid);
  if (out->orig_jaildir != 0) {
    if (kernel_set_proc_jaildir(pid, 0) != 0 ||
        kernel_get_proc_jaildir(pid) != 0) {
      klog_printf("[ReStore] jaildir read-back verification failed\n");
      return false;
    }
    out->changed_mask |= CRED_CHANGED_JAILDIR;
  }

  return true;
}

static pid_t find_other_pid_by_name(const char *name) {
  int mib[4] = {1, 14, 8, 0};
  pid_t mypid = getpid();
  pid_t found = -1;
  size_t buf_size = 0;

  if (sysctl(mib, 4, NULL, &buf_size, NULL, 0) != 0 || buf_size == 0)
    return -1;

  uint8_t *buf = malloc(buf_size);
  if (!buf)
    return -1;

  if (sysctl(mib, 4, buf, &buf_size, NULL, 0) == 0) {
    for (uint8_t *ptr = buf; ptr < buf + buf_size;) {
      int ki_structsize = *(int *)ptr;
      if (ki_structsize <= 0)
        break;
      pid_t ki_pid = *(pid_t *)&ptr[72];
      const char *ki_tdname = (const char *)&ptr[447];
      if (strcmp(name, ki_tdname) == 0 && ki_pid != mypid) {
        found = ki_pid;
      }
      ptr += ki_structsize;
    }
  }
  free(buf);
  return found;
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

static bool file_matches_size(const char *path, size_t expected_size) {
  struct stat st;
  if (stat(path, &st) != 0)
    return false;
  return (size_t)st.st_size == expected_size;
}

static int call_install_app(const char *title_id, const char *dir) {
  int (*sceAppInstUtilAppInstallTitleDir)(const char *, const char *, void *) =
      NULL;
  const char *nid = "Wudg3Xe3heE";
  uint32_t handle = 0;

  if (!kernel_dynlib_handle(-1, "libSceAppInstUtil.sprx", &handle)) {
    sceAppInstUtilAppInstallTitleDir =
        (void *)kernel_dynlib_resolve(-1, handle, nid);
  }
  if (sceAppInstUtilAppInstallTitleDir) {
    return sceAppInstUtilAppInstallTitleDir(title_id, dir, NULL);
  }
  return sceAppInstUtilAppInstallAll(NULL);
}

static bool is_title_in_app_db(const char *title_id) {
  FILE *fp = fopen("/system_data/priv/mms/app.db", "rb");
  if (!fp)
    return false;
  if (fseek(fp, 0, SEEK_END) != 0) {
    fclose(fp);
    return false;
  }
  long sz = ftell(fp);
  if (sz <= 0 || sz > 16 * 1024 * 1024) {
    fclose(fp);
    return false;
  }
  rewind(fp);
  uint8_t *buf = malloc((size_t)sz);
  if (!buf) {
    fclose(fp);
    return false;
  }
  size_t rd = fread(buf, 1, (size_t)sz, fp);
  fclose(fp);

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

static bool register_restore_app(void) {
  const char *app_dir = "/user/app/" RESTORE_TITLE_ID;
  const char *sce_sys_dir = "/user/app/" RESTORE_TITLE_ID "/sce_sys";
  const char *param_path = "/user/app/" RESTORE_TITLE_ID "/sce_sys/param.json";
  const char *icon_path = "/user/app/" RESTORE_TITLE_ID "/sce_sys/icon0.png";
  const char *meta_dir = "/user/appmeta/" RESTORE_TITLE_ID;
  const char *meta_param = "/user/appmeta/" RESTORE_TITLE_ID "/param.json";
  const char *meta_icon = "/user/appmeta/" RESTORE_TITLE_ID "/icon0.png";

  bool already_registered =
      file_matches_size(meta_param, asset_param_json_size) &&
      file_matches_size(meta_icon, asset_icon0_png_size) &&
      is_title_in_app_db(RESTORE_TITLE_ID);

  mkdir("/user/app", 0755);
  mkdir(app_dir, 0755);
  mkdir(sce_sys_dir, 0755);

  if (!write_file_atomic(param_path, asset_param_json, asset_param_json_size)) {
    daemon_log("failed to write %s: %s", param_path, strerror(errno));
    return false;
  }
  if (!write_file_atomic(icon_path, asset_icon0_png, asset_icon0_png_size)) {
    daemon_log("failed to write %s: %s", icon_path, strerror(errno));
    return false;
  }

  if (already_registered) {
    daemon_log("%s already registered in appmeta and app.db", RESTORE_TITLE_ID);
    return true;
  }

  int init_rc = sceAppInstUtilInitialize();
  daemon_log("sceAppInstUtilInitialize rc=0x%08x", (unsigned)init_rc);

  int inst_rc = call_install_app(RESTORE_TITLE_ID, "/user/app/");
  daemon_log("call_install_app(%s) rc=0x%08x", RESTORE_TITLE_ID,
             (unsigned)inst_rc);

  mkdir("/user/appmeta", 0755);
  mkdir(meta_dir, 0755);
  (void)write_file_atomic(meta_param, asset_param_json, asset_param_json_size);
  (void)write_file_atomic(meta_icon, asset_icon0_png, asset_icon0_png_size);

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
      "\"registered\":%s"
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
      g_app_registered ? "true" : "false", uid_hex, username,
      activated ? "true" : "false", (unsigned long long)free_gb,
      (unsigned long long)total_gb, used_pct, (unsigned long long)free_gb,
      (unsigned long long)total_gb, persisted_json);

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

static bool try_serve_disk_override(int fd, const char *rel_path,
                                    const char *content_type) {
  char full_path[PATH_MAX];
  snprintf(full_path, sizeof(full_path), "%s/ui/%s", RESTORE_DATA_DIR,
           rel_path);
  FILE *fp = fopen(full_path, "rb");
  if (!fp)
    return false;
  if (fseek(fp, 0, SEEK_END) != 0) {
    fclose(fp);
    return false;
  }
  long sz = ftell(fp);
  if (sz < 0 || sz > 8 * 1024 * 1024) {
    fclose(fp);
    return false;
  }
  rewind(fp);
  uint8_t *buf = malloc((size_t)sz);
  if (!buf) {
    fclose(fp);
    return false;
  }
  size_t rd = fread(buf, 1, (size_t)sz, fp);
  fclose(fp);
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

  /* Strip query string (?...) from URI */
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

  if (strcmp(uri, "/api/status") == 0) {
    handle_api_status(fd);
  } else if (strcmp(uri, "/") == 0 || strcmp(uri, "/index.html") == 0) {
    if (!try_serve_disk_override(fd, "index.html",
                                 "text/html; charset=utf-8")) {
      send_http_response(fd, 200, "OK", "text/html; charset=utf-8",
                         asset_index_html, asset_index_html_size);
    }
  } else if (strcmp(uri, "/styles.css") == 0) {
    if (!try_serve_disk_override(fd, "styles.css", "text/css; charset=utf-8")) {
      send_http_response(fd, 200, "OK", "text/css; charset=utf-8",
                         asset_styles_css, asset_styles_css_size);
    }
  } else if (strcmp(uri, "/app.js") == 0) {
    if (!try_serve_disk_override(fd, "app.js",
                                 "application/javascript; charset=utf-8")) {
      send_http_response(fd, 200, "OK",
                         "application/javascript; charset=utf-8", asset_app_js,
                         asset_app_js_size);
    }
  } else if (strcmp(uri, "/motion.js") == 0) {
    if (!try_serve_disk_override(fd, "motion.js",
                                 "application/javascript; charset=utf-8")) {
      send_http_response(fd, 200, "OK",
                         "application/javascript; charset=utf-8",
                         asset_motion_js, asset_motion_js_size);
    }
  } else if (strcmp(uri, "/assets/restore-logo.png") == 0 ||
             strcmp(uri, "/assets/restore-logo-full.png") == 0 ||
             strcmp(uri, "/icon0.png") == 0) {
    send_http_response(fd, 200, "OK", "image/png", asset_icon0_png,
                       asset_icon0_png_size);
  } else if (strcmp(uri, "/assets/ps5-showcase-crop.jpg") == 0) {
    send_http_response(fd, 200, "OK", "image/jpeg", asset_bg_jpg,
                       asset_bg_jpg_size);
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
  syscall(SYS_thr_set_name, -1, "restore.elf");
  g_start_time = time(NULL);

  cred_backup_t cred;
  if (!elevate_and_verify(&cred)) {
    return EXIT_FAILURE;
  }

  mkdir(RESTORE_DATA_DIR, 0777);
  daemon_log("starting ReStore resident daemon (pid=%d, fw=0x%08x)",
             (int)getpid(), kernel_get_fw_version());

  /* Terminate any older restore.elf instance cleanly before binding */
  for (int attempt = 0; attempt < 5; attempt++) {
    pid_t old_pid = find_other_pid_by_name("restore.elf");
    if (old_pid <= 0)
      break;
    daemon_log("stopping previous restore.elf instance pid=%d", (int)old_pid);
    kill(old_pid, SIGKILL);
    usleep(200000);
  }

  (void)sceUserServiceInitialize(NULL);
  g_app_registered = register_restore_app();
  daemon_log("standalone app %s registration status=%d", RESTORE_TITLE_ID,
             g_app_registered ? 1 : 0);

  int srv_fd = socket(AF_INET, SOCK_STREAM, 0);
  if (srv_fd < 0) {
    daemon_log("socket() failed: %s", strerror(errno));
    return EXIT_FAILURE;
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
    return EXIT_FAILURE;
  }

  if (listen(srv_fd, 64) != 0) {
    daemon_log("listen(:%d) failed: %s", RESTORE_PORT, strerror(errno));
    close(srv_fd);
    return EXIT_FAILURE;
  }

  daemon_log("listening on 0.0.0.0:%d (deeplink http://127.0.0.1:%d/)",
             RESTORE_PORT, RESTORE_PORT);
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
  return EXIT_SUCCESS;
}
