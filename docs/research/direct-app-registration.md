# PS5 原生应用直接登记调查

## SDK 直接登记示例

[PS5 Payload SDK 的 install_app 示例](https://github.com/ps5-payload-dev/sdk/blob/a7685ce8e97ce1f8a4f38253a41d54241c9124f1/samples/install_app/payload.c#L20-L35)初始化 AppInstUtil 后，直接调用 `sceAppInstUtilAppInstallTitleDir` 登记标题目录，没有调用 `nullfs`。

[示例构建和部署步骤](https://github.com/ps5-payload-dev/sdk/blob/a7685ce8e97ce1f8a4f38253a41d54241c9124f1/samples/install_app/Makefile#L29-L84)将标题元数据和可执行文件放在不同的系统位置，并要求相应写入权限。该示例提供了 ReStore 研究直接登记的起点。

## PS5Library

[PS5Library 安装器](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/installer/main.cpp#L19-L42)直接登记自己的标题，但当固件版本达到 12.00 时将该路径标记为未验证。它的[入口页面](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/assets/launch.html#L8-L15)通过 Homebrew Launcher 加载 ELF。

## 固件 12.40 的登记参考

[ShadowMountPlus 登记代码](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_install.c#L35-L82)对固件 12 以上使用 ShellCore 登记桥；其[偏移表](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_shellcore_offsets.inc#L410-L440)包含 12.40。ShadowMountPlus 自己的[应用处理流程](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_install.c#L236-L285)仍会进行 `nullfs` 挂载。

## ReStore 在 12.40 上的实机验证方案（#36 / #38）

在 `192.168.0.111`（PS5 12.40）实机上直接解析 `/system_data/priv/mms/app.db -> tbl_contentinfo` 与 `/user/app/` 目录，确认当前系统已运行 4 个采用 **`deeplinkUri` 本地 WebView 容器 + 后台常驻 `.elf` 服务** 的自制独立应用：
- `FAKE10101`（`Shadow Mount+`）：`deeplinkUri = 'http://127.0.0.1:10101/'`，`categoryType = 65536`
- `FMGR88888`（`文件管理器网页`）：`deeplinkUri = 'http://127.0.0.1:8888/'`，`categoryType = 66048`
- `PKGM00001`（`PKG Manager`）：`deeplinkUri = 'http://127.0.0.1:8844/'`，`categoryType = 65536`
- `PLDM00001`（`Payload Manager`）：`deeplinkUri = 'http://127.0.0.1:8084/'`，`categoryType = 65536`

### 1. `#38` 阶段过渡验证（`deeplinkUri` 网页容器 + 后台 `.elf` 服务）
- **磁盘目录结构**：
  - `/user/app/RSTR00001/sce_sys/param.json`（含 `"titleId": "RSTR00001"`、`"deeplinkUri": "http://127.0.0.1:9099/"` 与 `localizedParameters`）
  - `/user/app/RSTR00001/sce_sys/icon0.png`（ReStore 官方 Logo 图标，`512x512` 8-bit RGB 无透明通道 PNG）
  - `/user/appmeta/RSTR00001/param.json` 与 `icon0.png`
- **`app.db -> tbl_contentinfo` 实机登记结果（#38 实测验证）**：
  - 调用 `sceAppInstUtilAppInstallTitleDir("RSTR00001", "/user/app/", NULL)` 返回 `0x00000000`（`SCE_OK`）；
  - 系统自动在 `tbl_contentinfo` 写入 `titleId = 'RSTR00001'`、`titleName = 'ReStore'`、`metaDataPath = '/user/app/RSTR00001/sce_sys'`、`viewCategory = 'game'`、`categoryType = 65536`、`pprDeeplinkUri = 'http://127.0.0.1:9099/'`、`pprHubAppUri = 'psmediahub:main?titleId=RSTR00001'`、`icon0Info = '/user/app/RSTR00001/sce_sys/icon0.png?ts=...'`；
  - **关键动态库依赖**：`libSceAppInstUtil.sprx` 内部依赖 `libSceIpmi.sprx` 的符号（如 `_ZN4IPMI6Client6Config7getNameEv`）。禁止直接在编译期把 `-lSceAppInstUtil` 放进 ELF `DT_NEEDED`（否则宿主进程 `rtld` 启动阶段会因未预载 `libSceIpmi.sprx` 直接触发 `ud2` 陷入 `mDBG` 挂起），必须在运行期按顺序调用 `dlopen("/system/common/lib/libSceIpmi.sprx", RTLD_NOW | RTLD_GLOBAL)` 与 `dlopen("/system/common/lib/libSceAppInstUtil.sprx", RTLD_NOW | RTLD_GLOBAL)`。

### 2. 架构约束与演进目标：必须采用纯正 PS5 原生应用（禁止停留在网页容器）
- **明确产品要求（#38 实机验收反馈）**：
  - `deeplinkUri`（`psmediahub` 网页容器）虽然在 `#38` 中跑通了主界面图标登记与前后台通信，但其本质仍是**网页应用（WebView 容器）**，带有浏览器顶栏/网页交互痕迹，不符合 ReStore 的最终形态要求。
  - ReStore 前台必须演进为**真正的 PS5 原生独立应用**（参考 `OffAct` / `PS5-Payload-SDK install_app` 原生 `eboot.bin` / `SDL2` + `libScePad` + 原生图形渲染路径），不经过任何浏览器或网页容器，详见 `docs/adr/0001-native-app-over-webview-container.md`。
