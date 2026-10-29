# PS5 折腾环境的备份与恢复能力调查

## 目标与现状

ReSpawn 旨在尽量恢复游戏、存档、系统设置、插件及配置，重建原有使用体验。
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
[WebKit Autoloader](https://github.com/itsPLK/ps5-webkit-autoloader) 安装后提供主界面入口，并可自动加载配置的载荷；这条链可作为重启后恢复 ReSpawn 运行环境的优先候选。
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

其[关闭游戏监视逻辑](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/dashboard.c#L2950-L2988)检查游戏与存档状态；[运行中导出路径](https://github.com/JakeBusler/PS5-Cloud-Save/blob/b85b99c082243212e613b68790736348c75d448e/ps5/common/sharing.c#L495-L510)复制存档镜像并挂载副本。
实测需比较游戏关闭后和运行中取样的恢复结果。

PSCloud 是 ReSpawn 游戏存档功能的参考；游戏安装、系统设置、媒体、插件与配置仍是 ReSpawn 的调查对象。

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

## PS5 本机界面

ReSpawn 日常在 PS5 本机通过手柄查看备份、选择恢复点和发起恢复。

[OnionHEN 插件界面接口](https://github.com/aydencharles/onionHEN/blob/main/source/libonion_plugin_ui/include/onion/plugin_ui.hpp)定义页面、列表、按钮、输入和事件绑定；[界面桥接接口](https://github.com/aydencharles/onionHEN/blob/main/source/libonion_plugin_bridge/include/onion/plugin_ui_bridge.hpp)定义界面快照和操作事件。
这些接口可作为 PS5 工具箱界面与后台服务交互的参考。

[Itemzflow](https://github.com/LightningMods/Itemzflow)提供独立手柄界面及后台通信参考。[构建文件](https://github.com/LightningMods/Itemzflow/blob/main/itemzflow/Makefile)使用 PS4 SDK；其[IPC 客户端](https://github.com/LightningMods/Itemzflow/blob/main/itemzflow/include/ipc_client.hpp)使用 Unix domain socket 与后台服务通信。
这两条路线的 12.40 界面运行与后台协作需要实机对照。

## 初始化后的站点引导与 WebKit 入口

ReSpawn 在 PS5 上提供主要的备份与恢复操作；PS5 无法直接使用时，通过独立域名站点获取引导和下载工具。
固件 12.40 的现有首次引导流程使用局域网 Mac Host、PS5 手动 DNS、用户指南、Relapse 和 WebKit Autoloader。
本地 Host 对 `manuals.playstation.net` 返回 Host 地址，并将用户指南 HTTPS 路径映射到入口页面。

[PS5 WebKit Autoloader](https://github.com/itsPLK/ps5-webkit-autoloader) 可作为 fork 对象，研究界面和逻辑优化；项目采用 GPL-3.0。
独立域名用于 ReSpawn 引导站点；PS5 DNS 设置需要的是 DNS 服务器 IP，实际用户指南请求仍需由 DNS 和 HTTPS 服务共同处理。
WebKit Autoloader 项目提到通过互联网上的 DNS 服务器加载 WebKit 入口；自有公网 DNS 与 HTTPS 服务在目标 12.40 主机上的完整表现需要实机验证。

初始化后的恢复流程候选为：站点提供引导和工具下载 → 配置 DNS → 用户指南 WebKit 入口 → Relapse → 启动 PS5 上的 ReSpawn 工具 → 选择备份和恢复内容 → 完成恢复。

## 实机对照清单

1. 以已确认的 12.40 固件为基线，记录初始化后主机的型号与账号状态。
2. 对照 Y2JB 与 Y2JB Autoloader 入口，分别记录 P2JB 或 Relapse、加载器和 FTP 的版本及耗时。
3. 创建一份测试游戏存档，记录游戏内状态；备份后修改进度，再恢复并核对游戏读取结果。
   对照 PSCloud 游戏关闭后自动备份与运行中导出的恢复结果。
4. 创建测试插件配置，备份后修改并恢复，比较配置和插件行为。
5. 测试 USB 与本地网络传输，记录文件大小、哈希和耗时。
6. 使用电脑或 NAS 将测试备份上传云端并取回，对照文件内容。
7. 对照 YouTube 关闭、游戏启动和休眠唤醒前后的加载器及 FTP 状态，记录后台服务是否持续运行。
8. 检查游戏安装、媒体和系统设置恢复；如主机保留外接盘或 M.2 游戏文件，对照验证重新登记及游戏启动。
   对照 etaHEN Unified 的载荷、配置与插件恢复效果。
9. 分别记录重启后进入主界面、启动入口、利用链执行、载荷加载、备份取回、数据写回和游戏重新读取的耗时，以及失败与重试次数。
10. 对照局域网 Host 与自有公网 DNS 的用户指南入口，记录 DNS、HTTPS、页面和载荷环境的实际结果。
11. 对照 PS5 工具箱和独立应用的手柄操作、恢复点展示及后台服务交互。

每项记录环境、操作、备份前状态、恢复结果和与开源资料的差异。

## 后续决策

依据实测结果定义恢复内容、完整度、自动备份方式和存储组合。
