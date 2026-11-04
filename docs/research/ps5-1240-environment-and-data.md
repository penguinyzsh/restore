# PS5 12.40 环境配置、账号激活与桌面数据实机基线

## 背景

本文件整理 PS5 12.40 目标主机在实机验证与 [#36](https://github.com/penguinyzsh/restore/issues/36) 探查收口中取得的六项核心证据：
1. Y2JB / Autoloader 启动链、后台服务驻留与 ELF 插件/载荷配置文件清单；
2. 本地账号离线激活与原生 16 KB 注册表配置结构；
3. 系统设置注册表（`libSceRegMgr`）落盘文件、17 大分类扫描与可恢复白名单；
4. 游戏与自制应用桌面展示元数据（`app.db` / `appinfo.db`）及外置存储挂载结构；
5. 媒体画廊（截图/录像）物理目录与 `av_content.db` / `av_content_bg.db` 数据库登记结构；
6. 全类型数据落盘变化规律与高稳定性后台监听策略。

---

## 一、折腾环境、ELF 插件与载荷配置清单

### 1. 自动加载链与后台驻留验证
在 12.40 主机上完成 Y2JB 与离线账号登录配置后，重启主机并打开 YouTube 入口，Payload Manager 自动加载链（`/data/pldmgr/autoload.txt`）按配置顺序自动加载核心载荷。在当前主力测试机（`192.168.0.111`，用户 `1066f6d7` `"Peng"`）上，实机运行结构如下：
- `/data/pldmgr/autoload.txt` 入口链：`nanodns.elf` → `syslang-zh-Hans-v0.3.elf` → `OnionHEN.elf`
- `/data/OnionHEN/plugins/` 常驻插件：`FTPS00001.elf`（`.auto_start`）、`DPIV00001.elf`（`.auto_start`）
- `/data/OnionHEN/payloads/` 自动拉起载荷：`shadowmountplus.elf`、`web-file-mgr-v1.11b.elf`、`pkg-manager_v1.5.1.elf`、`title-editor_0.2.elf`、`garlic-savemgr_v1.14.elf`（均配对 0 字节 `.auto_start` 标记文件）

**退出入口后的后台驻留实证**：在 PS5 主界面手动关闭（退出）YouTube 应用或正常游玩大型 PS5 游戏期间，后台服务端口保持稳定连通：
- `1337`（OnionHEN `FTPS00001.elf` FTP 服务）
- `8084`（Payload Manager Web UI / API，`PLDM00001`）
- `8844`（PKG Manager Web 服务，`PKGM00001`）
- `8888`（Web File Manager 服务，`FMGR88888`）
- `10101`（ShadowMountPlus Web 服务，`FAKE10101`）
- `12800`（OnionHEN Direct Package Installer `DPIV00001` 插件服务）
- 按需加载调试端口：`2121`（独立 `ftpsrv-ps5.elf`）、`9112`（DevLoop 虚拟手柄与画面采集）、`3232`（`klogsrv` 内核日志流）

### 2. 核心配置文件、ELF 插件与独立载荷路径
实机环境文件按职责归类如下：

| 类别 | 主机路径 | 说明与恢复要求 |
| --- | --- | --- |
| **OnionHEN 宿主配置** | `/data/OnionHEN/config.ini` | 保存宿主设置（如 `[home_screen] show_title_ids` 等）。 |
| **OnionHEN ELF 插件** | `/data/OnionHEN/plugins/<ID>.elf`<br>`/data/OnionHEN/plugins/<ID>.elf.auto_start` | 实机包含 `DPIV00001.elf`、`FTPS00001.elf` 及其 0 字节 `.auto_start` 自启标记。OnionHEN 通过 `kqueue`（`EVFILT_VNODE`，`150ms` 防抖）监听该目录，部署时应先写临时文件名再原子重命名为 `.elf`。 |
| **OnionHEN 独立载荷** | `/data/OnionHEN/payloads/<name>.elf`<br>`/data/OnionHEN/payloads/<name>.elf.auto_start` | 实机包含 `shadowmountplus.elf`、`web-file-mgr-v1.11b.elf`、`pkg-manager_v1.5.1.elf`、`title-editor_0.2.elf`、`garlic-savemgr_v1.14.elf` 及各自 `.auto_start`。 |
| **Payload Manager 配置与载荷库** | `/data/pldmgr/pldmgr_config.txt`<br>`/data/pldmgr/autoload.txt`<br>`/data/pldmgr/payloads/<name>/<name>.elf(.json)` | 管理入口启动后的自动加载顺序（`delay=5`，`KILL_DISC_PLAYER_ON_STARTUP=true`）及各独立 ELF 载荷包。 |
| **ShadowMountPlus 与工具配置** | `/data/shadowmount/config.ini`、`manual.lst`<br>`/data/wfm/wfm-7zip-helper.elf`<br>`/data/pkgmgr/` | 配置游戏与自制应用目录扫描路径、手动挂载列表及配套辅助程序。 |
| **DNS 屏蔽配置** | `/data/nanodns/nanodns.ini` | 本机 DNS 屏蔽与解析规则配置。 |

> **FTP 传输协议注意事项**：实机运行于 1337 端口的 FTP 服务对 `DELE`（删除文件）和 `RNTO`（重命名目标）成功时均返回状态码 `226`（如 `226 File deleted`、`226 Path renamed`），客户端不能仅将 `250` 视为成功应答。

---

## 二、账号离线激活与原生 16 KB 配置结构

### 1. 8 KB 模板截断问题与 16 KB 原生修复
- **问题现象**：PS5 原生用户配置表 `/system_data/priv/home/<uid>/config.dat` 为 **16,384 字节（16 KB）**，同时 `/system_data/priv/home/user_list.dat`（**1,024 字节**）记录全部 16 个用户槽位的 Profile ID。文件头 4 字节为小端序的当前本地用户 ID（如 `192.168.0.111` 上的用户 `1066f6d7` 对应十进制 `275183319`，用户名 `"Peng"`，离线激活 `account_id = 0xea53d6993286bdfc`；前序测试机用户 `17dfdf4e` 同理）。部分旧版账号激活工具使用内置的 8,192 字节（8 KB）模板并以 `O_TRUNC` 覆盖写入，会把文件截断为 8 KB 并将头部用户 ID 覆写为 `10000000`。
- **12.40 实机修复与验证**：
  - 以当前用户原生 16,384 字节 `config.dat` 为基底，完整保留头部用户 ID 与区域语言字段，仅就地更新与离线激活及本地登录相关的字段，并配合 1,200 字节的 `np/auth.dat`。
  - 修复并正常重启主机后，YouTube 不再弹出“请登录 PlayStation Network”拦截提示，可直接进入 Y2JB 入口，且新创建的存档 `param.sfo` 中 `ACCOUNT_ID` 正常写入非零激活账号 ID。

### 2. 用户配置关键偏移参考
| 偏移 | 长度 | 含义 |
| --- | --- | --- |
| `0x0000` | 4 字节 | 本地用户 Profile ID（小端序，如 `0x1066f6d7` 或 `0x17dfdf4e`） |
| `0x0004` | 17 字节 | 本地用户名（`username`，如 `"Peng"`） |
| `0x0100` | 8 字节 | PSN / 离线激活 `account_id`（小端序，如 `0xea53d6993286bdfc`） |
| `0x0108` / `0x1100` | 65 字节 | 登录邮箱（格式 `<username>@a8.<country>.np.playstation.net`） |
| `0x0177` | 17 字节 | NP 环境标识（`np_env`，如 `np`） |
| `0x01ad` | 17 字节 | 在线 ID（`online_id`） |
| `0x01be` / `0x01c1` / `0x01c7` | 3 / 6 / 36 字节 | 国家（`country`）、语言（`language`）、区域（`locale`） |
| `0x01f8` | 4 字节 | 登录状态标志 |

---

## 三、系统设置注册表（`libSceRegMgr`）落盘文件与分类白名单

### 1. 读写接口与底层落盘文件
- **调用接口**：通过 `libSceRegMgr.sprx` 的 `sceRegMgrGetInt` / `sceRegMgrGetStr` / `sceRegMgrGetBin` 及对应 `Set` 接口可在后台直接按 32 位键 ID 读写系统设置。
- **底层物理落盘路径**：实机探查确认注册表持久化文件位于 `/system_data/settings/`：
  - `sysreg.000`（`3,072` 字节）
  - `sysreg.001`（`163,840` 字节）及备份 `sysreg.001.bup`
  - `sysreg.002`（`655,360` 字节）及备份 `sysreg.002.bup`
  - `sysreg.003`（`6,144` 字节）
- **12.40 实机读写验证**：对「设置 → 屏幕和视频 → 视频输出 → 120 Hz 输出」对应的键 `0x0a240000`（`VIDEOOUT_hfr`：`0` 自动，`1` 关闭）执行 `GET` → `SET(1)` → `GET` → `SET(0)` 往返验证，全部返回 `rc=0` 且立即生效。

### 2. 全量注册表分类梳理与可恢复设置白名单（基于 `ps5-payload-dev/regdump` 837 项键表）
排除硬件唯一标识、底层网卡状态与蓝牙手柄配对信息后，ReStore 系统设置备份与恢复的分类白名单与黑名单边界如下：

| 策略分档 | 注册表分类与键范围 | 包含设置项说明 |
| --- | --- | --- |
| **默认纳入备份与恢复（白名单）** | • `SYSTEM`（`0x01010000` ~ `0x02860100`）<br>• `DATE`（`0x08010000` ~ `0x08020400`）<br>• `ACCESSIBILITY`（`0x16010000` ~ `0x16030300`）<br>• `SHARECREATE`（`0x17020000` ~ `0x17820200`）<br>• `VIDEOOUT` / `AUDIOOUT` / `AUDIOIN`（`0x04020000` ~ `0x050b0000`） | 系统语言（`SYSTEM_LANGUAGE`）、省电不待机/休眠计时器、HDMI 设备联动、主机名称（`SYSTEM_NICKNAME`）、时区（`DATE_TIME_ZONE`）与时间格式、无障碍缩放与按键自定义映射、Share 截图/录像格式与分辨率、视频输出（分辨率/HDR/VRR/ALLM/120Hz）与音频输出格式。 |
| **账号映射层（按需绑定）** | • `USER`（`0x07000000` ~ `0x07811400`，支持 1..16 用户槽位，步长 `0x10000`）<br>• `/system_data/priv/home/<uid>/config.dat`（16 KB）与 `np/auth.dat`（1,200 B） | 离线账号激活字段（`account_id`、`online_id`、`np_env`、登录标志）。恢复时必须保留当前目标主机的本地 `user_id`（如 `0x1066f6d7`），仅注入激活字段，禁止用异机槽位 ID 直接覆盖 `user_list.dat`。 |
| **恢复黑名单（严禁覆盖）** | • `BT`（蓝牙配对键）<br>• `NET`（网络接口与 DHCP 状态）<br>• `SECURITY`（家长控制与主机锁）<br>• 硬件/主机唯一序列号与 MAC 相关项 | 防止恢复后导致当前 DualSense 手柄蓝牙断联失控、局域网断网或触发系统安全锁死。 |

---

## 四、游戏与自制应用桌面展示元数据（`app.db` / `appinfo.db`）

在 `192.168.0.111` 实机上直接解析 `/system_data/priv/mms/app.db`（`user_version = 20554`）与 `appinfo.db`（`user_version = 20023`），确认 `tbl_contentinfo`（72 列）中全部 **12 个非系统应用/游戏** 的登记形态可分为三类：

| 类型 | 实机 `titleId` 与名称 | 關鍵列特征（`tbl_contentinfo`） | 磁盘目录结构（`/user/app/<TITLE_ID>/`） |
| --- | --- | --- | --- |
| **1. 自制 Web 快捷方式应用（4 项）** | • `FAKE10101`：`Shadow Mount+`（`:10101`）<br>• `FMGR88888`：`文件管理器网页`（`:8888`）<br>• `PKGM00001`：`PKG Manager`（`:8844`）<br>• `PLDM00001`：`Payload Manager`（`:8084`） | `categoryType = 65536`（或 `66048`）、`contentLocation = 2`、`dispLocation = 188`、`capableOfMove = 64`、`deeplinkUri = 'http://127.0.0.1:<port>/'`、`localConceptId = 'cid:local:<TITLE_ID>'` | 仅含 `sce_sys/param.json` 与 `sce_sys/icon0.png`（及 `/user/appmeta/<TITLE_ID>/`），**无 `eboot.bin`、无 `mount.lnk`**。 |
| **2. 标准安装应用（1 项）** | • `PPSA01650`：`YouTube` | `categoryType = 0`、`contentLocation = 2`、`dispLocation = 138`、`metaDataPath = '/user/appmeta/PPSA01650'` | `/user/app/PPSA01650/app.pkg` + `/user/appmeta/PPSA01650/`。 |
| **3. ShadowMount 挂载游戏（7 项）** | • `PPSA02796`：`破晓传奇`<br>• `PPSA03396`：`The Last of Us™ Part I`<br>• `PPSA04452`：`Warhammer 40,000: Space Marine 2`<br>• `PPSA23012`：`Call of Duty® Modern Warfare 2`<br>• `PPSA26344`：`Ghost of Yōtei`<br>• `PPSA30117`：`空之轨迹 the 1st`<br>• `PPSA30304`：`莱莎的炼金工房 ～常暗女王与秘密藏身处～ DX` | `categoryType = 0`、`contentLocation = 2`、`dispLocation = 138`、`capableOfMove = 80`、`metaDataPath = '/user/app/<TITLE_ID>/sce_sys'`、`pprDeeplinkUri = 'psgm:play?id=<TITLE_ID>'`、`localConceptId = 'cid:local:<TITLE_ID>'` | 仅含 `sce_sys/`（`param.json`、`icon0.png` 等）与文本文件 `mount.lnk`（指向 `/mnt/usb1/homebrew/<TITLE_ID>-app` 或内置 `/data/homebrew/PPSA30117-app`）。 |

- **对 ReStore“仅备份游戏桌面展示”的支撑**：
  - 无需拷贝数十 GB 的游戏本体、补丁（`/user/patch`）或 DLC（`/user/addcont`）；
  - 备份时仅采集 `/user/app/<TITLE_ID>/` 下的 `sce_sys/`、`mount.lnk`、`/user/appmeta/<TITLE_ID>/` 以及 `app.db -> tbl_contentinfo` 与 `appinfo.db -> tbl_appinfo` 中对应的元数据行；
  - 恢复时还原上述轻量目录并将元数据行写回 `app.db` / `appinfo.db`，即可在 PS5 主界面立即恢复全部游戏与自制应用的桌面图标展示。

---

## 五、媒体画廊（截图/录像）数据库与物理存储结构

在 `192.168.0.111` 实机上解析 `/system_data/priv/mms/av_content.db`（`user_version = 10011`）与 `av_content_bg.db`（`user_version = 10010`），并从 `av_content.db` 数据页还原出《空之轨迹 the 1st》（`PPSA30117`）的 2 条完整拍摄记录：

1. **物理文件与缩略图路径规律**：
   - 截图与录像文件位于 `/user/av_contents/photo/<GENERATOR_ID>/<TITLE_ID>/<SUBDIR>/*.jxr|*.png|*.jpg` 与 `/user/av_contents/video/<GENERATOR_ID>/<TITLE_ID>/<SUBDIR>/*.webm|*.mp4`；
   - 缩略图位于 `/user/av_contents/thumbnails/{photo,video}/<GENERATOR_ID>/<TITLE_ID>/<SUBDIR>/*.jxr`；
   - 数据库 `content_path` 与 `icon_path` 字段存储**相对于 `/user` 的路径**：
     - 实机样本 1（HDR 截图，`rowid=1`）：`content_path = '/av_contents/photo/NPXS40087/PPSA30117/326/20261103_231816_00161080.jxr'`，`icon_path = '/av_contents/thumbnails/photo/NPXS40087/PPSA30117/326/20261103_231816_00161080.jxr.jxr'`，`title = '空之轨迹 the 1st_20261103231815'`，`width = 3840`，`height = 2160`，`mime_type = 131098`，`content_type = 1`，`size = 345635`，`size_on_storage = 531545`。
     - 实机样本 2（WebM 录像，`rowid=2`）：`content_path = '/av_contents/video/NPXS40087/PPSA30117/32a/20261103_232013_00889418.webm'`，`icon_path = '/av_contents/thumbnails/video/NPXS40087/PPSA30117/32a/20261103_232013_00889418.webm.jxr'`，`title = '空之轨迹 the 1st_20261103231855'`，`duration = 14`，`duration_ms = 14647`，`width = 1920`，`height = 1080`，`mime_type = 262157`，`content_type = 2`，`size = 32440320`，`size_on_storage = 32673786`。
2. **数据库表与触发器联动**：
   - `av_content.db` 核心表为 `tbl_PhotoVideo`（67 列）、`tbl_Account`（3 列，将本地用户 ID `275183319` 映射为 `position_of_account = 1`，对应 `tbl_PhotoVideo.account1 = 1`）、`tbl_ApplicationId`（1 列）与 `tbl_UpdateSquence`（3 列）；
   - 插入 `tbl_PhotoVideo` 时，内置触发器 `trggr_insert_photovideo_application` 自动向 `tbl_ApplicationId` 注册 `appli_title_id`，`trggr_insert_photovideo` 自动递增 `tbl_UpdateSquence.sequence`；
   - `av_content_bg.db` 核心表为 `tbl_PhotoVideo_Bg`（60 列）与 `tbl_Total`（2 列）。
3. **免重建恢复流程**：
   - 恢复时将备份的媒体文件与缩略图还原至 `/user/av_contents/` 对应子目录，根据目标主机 `tbl_Account` 的 `position_of_account` 对齐 `account<N>` 列后，将元数据行 `INSERT OR REPLACE` 回 `tbl_PhotoVideo` 与 `tbl_PhotoVideo_Bg` 并更新 `tbl_Total`，媒体画廊即可直接展示所有截图、录像及其原游戏分类标签。

---

## 六、全类型数据落盘变化规律与高稳定性后台监听策略

综合 `OnionHEN`（`plugin_directory_watcher.cpp`、`app_lifecycle_runtime.cpp`）、`ShadowMountPlus`（`sm_config_mount.c`、`sm_appdb.c`）源码与 12.40 实机落盘规律，ReStore 后台常驻服务采用以下分层监听与静默防抖策略：

| 数据域 | 实机落盘变化特征 | 后台监听与安全触发策略 |
| --- | --- | --- |
| **1. 游戏存档** | 游戏保存时先挂载写入 `/user/home/<uid>/savedata_prospero/<title_id>/sdimg_<slot>`，卸载提交后同步更新 `/system_data/savedata_prospero/<uid>/db/user/savedata.db`（`mtime` 与槽位行 `mtime` 字段）。 | **禁止在游戏正在写入容器时直接复制 `sdimg_*`**。后台结合大应用生命周期事件（`BigAppStarted` / `BigAppExited`）与 `savedata.db` 的 `st_mtim` 轮询：当检测到 `savedata.db` 更新且经过静默防抖窗口（或游戏退出后）、目标槽位未被挂载写锁定时，再执行副本挂载或容器备份。 |
| **2. ELF 插件、载荷与环境配置** | 位于 `/data/OnionHEN/{plugins,payloads,config.ini}`、`/data/pldmgr/`、`/data/shadowmount/`、`/data/nanodns/`，仅在用户安装/更新插件或修改配置时发生文件增删改。 | 对上述配置与插件目录使用 FreeBSD `kqueue`（`EVFILT_VNODE`：`NOTE_WRITE \| NOTE_EXTEND \| NOTE_ATTRIB \| NOTE_RENAME \| NOTE_DELETE`）配合文件 `stat` 指纹（`inode`、`size`、`mtime`）与防抖窗口，变化稳定后触发环境备份。 |
| **3. 系统设置与离线账号** | 修改系统设置时，内核/Shell 更新 `/system_data/settings/sysreg.000` ~ `sysreg.003` 的 `mtime`；账号配置位于 `/system_data/priv/home/<uid>/config.dat` 与 `np/auth.dat`。 | 监听 `/system_data/settings/sysreg.000..003` 与 `config.dat` 的 `st_mtim`；检测到变化并静默稳定后，调用 `sceRegMgrGet*` 扫描白名单键表生成可读 JSON 快照并与前次快照比对，仅在白名单键值实际变化时生成新恢复点。 |
| **4. 媒体画廊（截图/录像）** | 按下 Share 键截图或结束录像落盘后，文件写入 `/user/av_contents/{photo,video,thumbnails}`，同时 `av_content.db` 的 `tbl_UpdateSquence.sequence` 递增且数据库 `mtime` 更新。 | 监听 `/system_data/priv/mms/av_content.db` 的 `st_mtim` 及 `tbl_UpdateSquence.sequence` 序号；当序号递增且对应 `/user/av_contents/` 目标文件写入完成（`file_status == 0` 且文件大小稳定）后，触发新增媒体增量备份。 |
| **5. 游戏桌面展示元数据** | 新增或重新挂载游戏时，`/user/app/<TITLE_ID>/`（`sce_sys/`、`mount.lnk`）与 `/system_data/priv/mms/app.db` 的 `tbl_contentinfo` 行更新。 | 监听 `/system_data/priv/mms/app.db` 的 `st_mtim` 及 `tbl_contentinfo` 集合变化，静默稳定后同步备份轻量桌面元数据。 |
