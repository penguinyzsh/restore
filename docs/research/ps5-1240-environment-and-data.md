# PS5 12.40 环境配置、账号激活与桌面数据实机基线

## 背景

本文件整理 PS5 12.40 目标主机在实机验证中已取得的四项基础证据：
1. Y2JB / Autoloader 启动链、后台服务驻留与 ELF 插件/载荷配置文件清单；
2. 本地账号离线激活与原生 16 KB 注册表配置修复；
3. 系统设置注册表（`libSceRegMgr`）读写实证；
4. 游戏桌面展示元数据与外置存储挂载结构。

---

## 一、折腾环境、ELF 插件与载荷配置清单

### 1. 自动加载链与后台驻留验证
在 12.40 主机上完成 Y2JB 与离线账号登录配置后，重启主机并打开 YouTube 入口，Payload Manager 自动加载链（`/data/pldmgr/autoload.txt`）连续完成 6 个载荷的加载（`done: 6 / total: 6`）：
- `nanodns.elf`
- `syslang-zh-Hans-v0.3.elf`
- `OnionHEN.elf`
- `ftpsrv-ps5.elf`
- `klogsrv-ps5.elf`
- `ps5loop.elf`

**退出入口后的后台驻留实证**：在 PS5 主界面手动关闭（退出）YouTube 应用后，实测以下 6 个后台服务端口全部保持正常连通：
- `8084`（Payload Manager Web UI / API）
- `1337`（OnionHEN FTP 插件服务）
- `2121`（独立 `ftpsrv-ps5.elf` 服务）
- `12800`（OnionHEN Direct Package Installer `DPIV00001` 插件服务）
- `9112`（DevLoop 虚拟手柄与画面采集服务）
- `3232`（`klogsrv` 内核日志流服务）

### 2. 核心配置文件、ELF 插件与独立载荷路径
实机采集并完成 USB 往返校验的环境文件共 **35 个文件（16,481,000 字节）**，按职责归类如下：

| 类别 | 主机路径 | 说明与恢复要求 |
| --- | --- | --- |
| **OnionHEN 宿主配置** | `/data/OnionHEN/config.ini` | 保存宿主设置（如 `[home_screen] show_title_ids` 等）。 |
| **OnionHEN ELF 插件** | `/data/OnionHEN/plugins/<ID>.elf`<br>`/data/OnionHEN/plugins/<ID>.elf.auto_start` | 实机包含 `DPIV00001.elf`、`FTPS00001.elf` 及其 0 字节 `.auto_start` 自启标记。OnionHEN 通过 `kqueue` 监听该目录，部署时应先写临时文件名再原子重命名为 `.elf`。 |
| **OnionHEN 独立载荷** | `/data/OnionHEN/payloads/<name>.elf`<br>`/data/OnionHEN/payloads/<name>.elf.auto_start` | 实机包含 `shadowmountplus.elf`（含 `.auto_start`）与 `ps5-save-cli.elf`。 |
| **Payload Manager 配置与载荷库** | `/data/pldmgr/pldmgr_config.txt`<br>`/data/pldmgr/autoload.txt`<br>`/data/pldmgr/payloads/<name>/<name>.elf(.json)` | 管理入口启动后的自动加载顺序（`delay=5`，`KILL_DISC_PLAYER_ON_STARTUP=true`）及各独立 ELF 载荷包。 |
| **ShadowMountPlus 配置** | `/data/shadowmount/config.ini`<br>`/data/shadowmount/manual.lst` | 配置游戏与自制应用目录扫描路径及手动挂载列表。 |
| **DNS 屏蔽配置** | `/data/nanodns/nanodns.ini` | 本机 DNS 屏蔽与解析规则配置。 |

> **FTP 传输协议注意事项**：实机运行于 1337 端口的 FTP 服务对 `DELE`（删除文件）和 `RNTO`（重命名目标）成功时均返回状态码 `226`（如 `226 File deleted`、`226 Path renamed`），客户端不能仅将 `250` 视为成功应答。

---

## 二、账号离线激活与原生 16 KB 配置结构

### 1. 8 KB 模板截断问题与 16 KB 原生修复
- **问题现象**：PS5 原生用户配置表为 **16,384 字节（16 KB）**，文件头 4 字节为小端序的当前本地用户 ID（如用户 `17dfdf4e` 对应 `4e df df 17`）。部分旧版账号激活工具使用内置的 8,192 字节（8 KB）模板并以 `O_TRUNC` 覆盖写入，会把文件截断为 8 KB 并将头部用户 ID 覆写为 `10000000`。
- **12.40 实机修复与验证**：
  - 以当前用户原生 16,384 字节配置为基底，完整保留头部用户 ID（`17dfdf4e`）与区域语言字段（`jp / ja / ja-JP`），仅就地更新与离线激活及本地登录相关的 176 字节字段，并配合 1,200 字节的 `np/auth.dat`。
  - 修复并正常重启主机后，YouTube 不再弹出“请登录 PlayStation Network”拦截提示，可直接进入 Y2JB 入口，且新创建的存档 `param.sfo` 中 `ACCOUNT_ID` 正常写入非零激活账号 ID。

### 2. 用户配置关键偏移参考
| 偏移 | 长度 | 含义 |
| --- | --- | --- |
| `0x0000` | 4 字节 | 本地用户 Profile ID（小端序，如 `0x17dfdf4e`） |
| `0x0004` | 17 字节 | 本地用户名（`username`） |
| `0x0100` | 8 字节 | PSN / 离线激活 `account_id`（小端序） |
| `0x0108` / `0x1100` | 65 字节 | 登录邮箱（格式 `<username>@a8.<country>.np.playstation.net`） |
| `0x0177` | 17 字节 | NP 环境标识（`np_env`，如 `np`） |
| `0x01ad` | 17 字节 | 在线 ID（`online_id`） |
| `0x01be` / `0x01c1` / `0x01c7` | 3 / 6 / 36 字节 | 国家（`country`）、语言（`language`）、区域（`locale`） |
| `0x01f8` | 4 字节 | 登录状态标志 |

---

## 三、系统设置注册表（`libSceRegMgr`）读写实证

- **调用接口**：通过链接或解析 `libSceRegMgr` 的 `sceRegMgrGetInt(long key, int *value)` 与 `sceRegMgrSetInt(long key, int value)`（以及对应 `Str` / `Bin` 接口）可在后台载荷中直接读写系统注册表项。
- **12.40 实机首项验证**：对「设置 → 屏幕和视频 → 视频输出 → 120 Hz 输出」对应的注册表键 `0x0a240000`（`VIDEOOUT_hfr`，整型：`0` 自动，`1` 关闭）执行实机读写：
  - 初始读取 `GET_HFR` 返回 `rc=0, value=0`；
  - 调用 `SET_HFR(1)` 返回 `rc=0`，立即回读 `GET_HFR` 返回 `value=1`；
  - 再次调用 `SET_HFR(0)` 恢复原值并回读确认。
- **后续探查衔接**：在 [#36](https://github.com/penguinyzsh/restore/issues/36) 中将基于 `ps5-payload-dev/regdump` 键表完成 12.40 主机可读设置项的全量扫描与分类白名单梳理。

---

## 四、游戏桌面展示元数据与外置挂载结构

在 12.40 实机上盘点了位于外置 USB 存储（`USB1` homebrew 目录）的 6 款测试游戏（《使命召唤：现代战争2》`PPSA23012`、《战锤40K：星际战士2》`PPSA04452`、《羊蹄山之魂》`PPSA26344`、《最后生还者 Part I》`PPSA03396`、《莱莎的炼金工房 DX》`PPSA30304`、《破晓传奇》`PPSA02796`）：
- **内部存储轻量登记结构**：每个已登记游戏在内置存储 `/user/app/<TITLE_ID>/` 下仅占用极小空间，包含：
  - `sce_sys/`（含 `param.json` 等标题元数据）
  - `icon0.png`（桌面封面图标，约 36 KB ～ 546 KB）
  - `mount.lnk`（32 字节挂载链接信息，指向外置存储实际游戏目录）
- **对 ReStore“仅备份游戏桌面展示”的支撑**：
  - ReStore 无需备份数十 GB 的游戏本体、补丁（`/user/patch`）或 DLC（`/user/addcont`）；
  - 仅需备份游戏的轻量桌面展示元数据（`sce_sys`、`icon0.png`、`mount.lnk` 及系统 `app.db` / `appinfo.db` 登记记录）与 `ShadowMountPlus` 配置，即可在恢复后立即于 PS5 主界面还原所有游戏图标展示；外置盘或 M.2 上文件仍在的游戏经挂载后可直接启动。
