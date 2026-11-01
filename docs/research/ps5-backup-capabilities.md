# PS5 折腾环境的备份与恢复能力调查

## 目标与现状

ReStore 旨在尽量恢复游戏、存档、系统设置、插件及配置，重建原有使用体验。
当前目标 PS5 已初始化，固件为 **12.40**。
实机验证从当前机器环境和新建测试数据开始。

## 开源项目初步结论

### 折腾入口与载荷

针对固件 12.40，对照验证 **Y2JB → P2JB** 与 **Y2JB Autoloader → Relapse** 两条候选入口，再验证 ELF 加载器、FTP 和存档挂载。

| 组件 | 核对到的项目说明 | 对应验证 |
| --- | --- | --- |
| [Y2JB](https://github.com/Gezine/Y2JB/blob/79c1be475ef89d437ea52c6afd6dcb5e700d2875/README.md) | 通过 YouTube 应用取得用户态执行；4.03–12.40 对应 `Y2JB_backup_1.6(4.03)` 预制备份。 | 从初始化主机恢复预制备份，检查入口能否启动。 |
| [P2JB-Y2JB-Porting](https://github.com/matem6/P2JB-Y2JB-Porting/blob/9175334589363b67932b45e2f836f7aa9ea5893b/README.md) | 作者声明支持 9.00–12.40，取得内核读写与进程提权，并启动监听 9021 的加载器；默认四核心过程约 50 分钟。 | 记录目标机器上的完成日志、耗时和加载器连接结果。 |
| [Y2JB Autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader) | 项目声明支持 4.03–13.60；[v1.1.0 发布说明](https://github.com/itsPLK/ps5-y2jb-autoloader/releases/tag/v1.1.0-ba879c8)记录使用 Relapse，并提供按 `autoload.txt` 自动加载载荷。 | 在 12.40 对照实际启动过程、耗时及载荷自动加载情况。 |
| [elfldr](https://github.com/ps5-payload-dev/elfldr/blob/2a8da002e5292481ea964daa7342bbf4855f4c33/README.md) | 独立项目描述了新建后台进程、游戏期间运行和休眠恢复。 | 检查实际使用的加载器及载荷在这些场景中的生命周期。 |
| [ftpsrv](https://github.com/ps5-payload-dev/ftpsrv/blob/35bae1312b14840c0f95fab93be73d6daaa93bae/README.md) | 通过 ELF 加载器运行，监听 2121，提供文件访问。 | 验证目录访问与测试文件传输。 |
| [Save Mounter](https://github.com/n0llptr/Playstation-5-Save-Mounter/blob/1a0281ea9794afadc2e2da345ca0b66e5db45bc7/README.md) | 声明支持可越狱 PS5 固件和 PS5、PS4 等存档，使用 elfldr 与 FTP。 | 对新建测试存档执行挂载、复制、修改、恢复和游戏内读取。 |
| [etaHEN Unified 社区移植版](https://github.com/GronedWaffel/etahen-11.00-13.60) | 基于 etaHEN 2.5B，列出 12.40 配置并记录社区启动反馈。 | 验证当前主机上的 Toolbox、插件和配置恢复。 |

Y2JB 文档中的 Lapse 支持至 10.01；12.40 的候选方案包括 P2JB 和 Y2JB Autoloader 使用的 Relapse。
P2JB 项目给出的约 50 分钟属于该路径的说明，不用于代表 Relapse 的耗时。

[Relapse](https://github.com/soniciso1/relapse) 作者明确列出支持固件 12.40。
[WebKit Autoloader](https://github.com/itsPLK/ps5-webkit-autoloader) 安装后提供主界面入口，并可自动加载配置的载荷；这条链可作为重启后恢复 ReStore 运行环境的优先候选。
本轮未找到作者公布的 12.40 执行耗时或成功率，需在目标主机记录。
上述兼容性结论来自开源项目说明，目标主机的实际测试记录将另行对照。

### 后台运行与恢复耗时

[P2JB 移植说明](https://github.com/matem6/P2JB-Y2JB-Porting/blob/9175334589363b67932b45e2f836f7aa9ea5893b/README.md)称其加载器位于 YouTube 进程内，关闭应用会结束加载器及经其运行的载荷。
[独立 elfldr 说明](https://github.com/ps5-payload-dev/elfldr/blob/2a8da002e5292481ea964daa7342bbf4855f4c33/README.md)描述了独立后台运行的机制。
实测时记录具体载荷文件与版本，分别检查 YouTube 关闭、游戏启动及休眠唤醒后的存活情况。

我的初步判断是：先验证独立 FTP 和存档工具，再确认能支撑游戏期间自动备份的后台执行方式。
恢复体验分别记录环境重新建立、备份取回、数据写回和游戏重新读取的耗时。
[Y2JB Autoloader](https://github.com/itsPLK/ps5-y2jb-autoloader)可在入口运行后按配置启动载荷；实测要分别记录开机后的入口操作、利用链以及备份服务恢复的过程。

### 游戏存档

[Playstation-5-Save-Mounter](https://github.com/n0llptr/Playstation-5-Save-Mounter) 声称支持挂载 PS5、PS4 等游戏存档，并通过 FTP 读取或替换挂载后的文件。
项目要求操作后卸载存档，并警告替换 `sce_sys` 文件可能损坏存档。
其[载荷源码](https://github.com/n0llptr/Playstation-5-Save-Mounter/blob/main/mounter_payload/main.c)包含存档目录扫描、密钥材料和挂载逻辑。
将现有存档挂载、复制并恢复是值得验证的候选方案；游戏是否接受恢复结果需要实测。

### PSCloud 自动存档备份

[PSCloud](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/README.md) 是运行于 PS5 的 ELF 载荷，提供游戏关闭后自动备份、定时备份、USB 和 WebDAV。
项目报告在 7.00 与 11.40 主机测试了备份、上传和游戏关闭后备份；12.40 的主机表现需要实测。
项目文档说明当前尚不支持 PS4 游戏存档。

其[关闭游戏监视逻辑](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/dashboard.c#L2950-L2988)检查游戏与存档状态；[运行中导出路径](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/common/sharing.c#L492-L541)复制存档镜像、挂载副本，并检查导出期间源文件是否变化。
[接口代码](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/dashboard.c#L2186-L2215)将 `closed=live` 用于导出；现有自动监控在游戏运行时等待关闭。

ReStore 的候选方向是将变化检测接入游戏运行中的副本导出，并将结果纳入恢复点及同步流程。
实测需要用游戏内进度对照导出和恢复结果，验证副本的一致性及 12.40 上的表现。

PSCloud 是 ReStore 游戏存档功能的参考；游戏安装、系统设置、媒体、插件与配置仍是 ReStore 的调查对象。

### 持续检测与同步

ReStore 的独立应用负责交互，后台载荷负责检测数据变化、创建备份并同步。
[独立 elfldr](https://github.com/ps5-payload-dev/elfldr/blob/2a8da002e5292481ea964daa7342bbf4855f4c33/README.md)描述载荷运行在独立进程；目标主机关闭界面、运行游戏和休眠后的载荷状态需要实测。

[PSCloud 的监视线程](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/dashboard.c#L2950-L2988)默认约每 10 秒扫描存档变化，其关闭游戏后备份流程会等待游戏关闭及存档稳定。
[OnionHEN 的插件目录监听器](https://github.com/aydencharles/onionHEN/blob/6148af91bdb24899d44ad386db4cc5189b97f43e/source/daemon/source/plugin_directory_watcher.cpp#L98-L160)使用 `kqueue` 文件事件监听目录变化。

候选流程为：后台载荷检测变化 → 取得可恢复的数据版本 → 更新恢复点 → 同步到选定的存储位置。
目录事件能否用于各类数据、游戏运行中能否取得一致的存档，以及各阶段的实际延迟，都需要对照验证。

### 游戏、插件与配置

[etaHEN](https://github.com/etaHEN/etaHEN) 提供游戏转储、FPKG、安装服务及插件相关功能，并使用配置文件。
[etaHEN Unified 社区移植版](https://github.com/GronedWaffel/etahen-11.00-13.60)列出 12.40 配置和社区启动反馈，其配置位于 `/data/etaHEN/config-multifw-experimental.ini`，插件位于 `/data/etaHEN/plugins/` 和 `/data/etaHEN/game_plugins/<TITLEID>/`。
恢复时可先保存实际使用的载荷、配置和插件，再在重建环境后验证加载情况。

[PS5 FPKG Restore](https://github.com/thanhsondev/PS5-FPKG-RESTORE)扫描保留的已安装游戏文件并通过系统安装服务重新登记，使游戏重新出现在游戏库。
作者报告在固件 10.01 上完成游戏登记；12.40 和登记后启动效果需要实测。
该项目不支持已格式化的盘、独立 DLC 和更新包。

[ps5-db-backup](https://github.com/jeroendev-one/ps5-db-backup) 展示了备份游戏相关数据库的方案；其适用固件及恢复行为需按具体版本验证。
游戏内容、安装登记、插件文件和配置需要分别验证，才能判断恢复后的使用体验。

### 官方备份与其他数据

[PlayStation 官方 USB 备份文档](https://www.playstation.com/en-us/support/hardware/back-up-ps5-data-USB/)列出游戏和应用、存档、截图、视频和设置，并说明奖杯不包含在备份中。
官方备份不包含外置 USB 扩展存储和 M.2 SSD 中的游戏；恢复备份会清除主机当前数据。
账号、主机和存档的恢复关系应结合官方文档与实际使用环境验证。

### 存储位置

[ftpsrv](https://github.com/ps5-payload-dev/ftpsrv) 提供越狱 PS5 的 FTP 服务，可作为本地网络传输候选。
USB 可以作为备份目标；本地网络设备可用于接收备份；云端可以先通过电脑或 NAS 中转验证。
以上路径的自动化方式、访问权限与恢复能力需要结合实际环境确定。

## 整机数据的自动备份依据

| 数据 | 已有实现 | 继续验证 |
| --- | --- | --- |
| 系统与用户设置 | [官方 USB 备份](https://www.playstation.com/en-us/support/hardware/back-up-ps5-data-USB/)包含设置；备份和恢复过程均涉及主机重启。 | ReStore 自动检测设置变化、保存并逐项恢复的方式。 |
| 截图和视频 | 官方整机备份包含媒体；[媒体库](https://www.playstation.com/en-us/support/games/ps5-media-gallery-view-screenshots/)支持手动复制到 USB。 | 自动增量备份和写回后在媒体库中的显示。 |
| 游戏、更新和 DLC | [PS5 App Dumper](https://github.com/EchoStretch/ps5-app-dumper)提供运行中游戏文件导出到 USB；[PS5 FPKG Restore](https://github.com/thanhsondev/PS5-FPKG-RESTORE)尝试重新登记保留的游戏文件。 | 12.40 上游戏导出、更新及 DLC 恢复、游戏启动和自动增量。 |
| 插件与配置 | [OnionHEN](https://github.com/aydencharles/onionHEN)公布了配置、插件、载荷及自动启动标记的位置。 | 从初始化状态恢复后验证插件加载和配置生效。 |

现有资料提供了整机备份与数据访问的基础；系统设置和媒体的自动增量及逐项恢复仍需研究与实测。

## PS5 本机界面

ReStore 日常在 PS5 本机通过手柄查看备份、选择恢复点和发起恢复。

[OnionHEN 插件界面接口](https://github.com/aydencharles/onionHEN/blob/main/source/libonion_plugin_ui/include/onion/plugin_ui.hpp)定义页面、列表、按钮、输入和事件绑定；[界面桥接接口](https://github.com/aydencharles/onionHEN/blob/main/source/libonion_plugin_bridge/include/onion/plugin_ui_bridge.hpp)定义界面快照和操作事件。
这些接口可作为 PS5 工具箱界面与后台服务交互的参考。

[Itemzflow](https://github.com/LightningMods/Itemzflow)提供独立手柄界面及后台通信参考。[构建文件](https://github.com/LightningMods/Itemzflow/blob/main/itemzflow/Makefile)使用 PS4 SDK；其[IPC 客户端](https://github.com/LightningMods/Itemzflow/blob/main/itemzflow/include/ipc_client.hpp)使用 Unix domain socket 与后台服务通信。
这两条路线的 12.40 界面运行与后台协作需要实机对照。

[PS5Library](https://github.com/rdiol12/PS5Library) 提供 PS5 原生手柄界面与独立 agent 的参考。[构建配置](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/CMakeLists.txt)链接 SDL2 与 `ScePad`；[本机通信代码](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/common/client.cpp#L508-L558)使用本机 TCP。
[项目构建说明](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/README.md)说明公开构建流程生成应用、agent 和安装器 ELF；生成原生应用包需要另外取得打包前提。
该路线适合研究 ReStore 前台与后台分离；安装、手柄操作和界面关闭后的后台驻留需要在 12.40 实机验证。

## 初始化后的站点引导与 WebKit 入口

ReStore 在 PS5 上提供主要的备份与恢复操作；PS5 无法直接使用时，通过独立域名站点获取引导和下载工具。
固件 12.40 的现有首次引导流程使用局域网 Mac Host、PS5 手动 DNS、用户指南、Relapse 和 WebKit Autoloader。
本地 Host 对 `manuals.playstation.net` 返回 Host 地址，并将用户指南 HTTPS 路径映射到入口页面。

[PS5 WebKit Autoloader](https://github.com/itsPLK/ps5-webkit-autoloader) 可作为 fork 对象，研究界面和逻辑优化；项目采用 GPL-3.0。
独立域名用于 ReStore 引导站点；PS5 DNS 设置需要的是 DNS 服务器 IP，实际用户指南请求仍需由 DNS 和 HTTPS 服务共同处理。
WebKit Autoloader 项目提到通过互联网上的 DNS 服务器加载 WebKit 入口；自有公网 DNS 与 HTTPS 服务在目标 12.40 主机上的完整表现需要实机验证。

初始化后的恢复流程候选为：站点提供引导和工具下载 → 配置 DNS → 用户指南 WebKit 入口 → Relapse → 启动 PS5 上的 ReStore 工具 → 选择备份和恢复内容 → 完成恢复。

## 实机对照进展与分卷归档

本调查中的候选路线已在 PS5 12.40 主机开展实机验证，已取得的实证与排障结论归档于以下分卷文档：

1. [12.40 后台载荷启动安全与权限恢复实证](ps5-1240-runtime-safety.md)：CPU-only CRT 启动修复与进程凭据读写校验。
2. [12.40 全游戏通用存档备份与恢复机制](ps5-save-universal-mechanism.md)：存档三层结构、`param.sfo` 通用规律、跨账号合成与同目录 `rename` 提交实证。
3. [12.40 环境配置、账号激活与桌面数据实机基线](ps5-1240-environment-and-data.md)：Y2JB 自动加载链、关闭 YouTube 后 6 项后台服务持续驻留、35 个环境与 ELF 插件/载荷配置文件清单、原生 16 KB 账号离线激活修复、系统设置注册表读写及游戏桌面展示轻量元数据结构。

剩余实机探查项（存档列表展示同步与无槽建槽验收、可读系统设置全集扫描、媒体图库数据库恢复、全类型数据落盘变化监听规律）统一在 [#36](https://github.com/penguinyzsh/restore/issues/36) 中完成并以实际运行效果验收（不再进行无意义的字节哈希比对）。
