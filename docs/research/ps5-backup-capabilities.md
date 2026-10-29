# PS5 折腾环境的备份与恢复能力调查

## 目标与现状

ReSpawn 旨在尽量恢复游戏、存档、系统设置、插件及配置，重建原有使用体验。
当前目标 PS5 已初始化，固件为 **12.40**。
实机验证从当前机器环境和新建测试数据开始。

## 开源项目初步结论

### 折腾入口与载荷

针对固件 12.40，优先验证 **Y2JB → P2JB → ELF 加载器 → 独立 FTP → 存档挂载**。

| 组件 | 核对到的项目说明 | 对应验证 |
| --- | --- | --- |
| [Y2JB](https://github.com/Gezine/Y2JB/blob/79c1be475ef89d437ea52c6afd6dcb5e700d2875/README.md) | 通过 YouTube 应用取得用户态执行；4.03–12.40 对应 `Y2JB_backup_1.6(4.03)` 预制备份。 | 从初始化主机恢复预制备份，检查入口能否启动。 |
| [P2JB-Y2JB-Porting](https://github.com/matem6/P2JB-Y2JB-Porting/blob/9175334589363b67932b45e2f836f7aa9ea5893b/README.md) | 作者声明支持 9.00–12.40，取得内核读写与进程提权，并启动监听 9021 的加载器；默认四核心过程约 50 分钟。 | 记录目标机器上的完成日志、耗时和加载器连接结果。 |
| [elfldr](https://github.com/ps5-payload-dev/elfldr/blob/2a8da002e5292481ea964daa7342bbf4855f4c33/README.md) | 独立项目描述了新建后台进程、游戏期间运行和休眠恢复。 | 检查实际使用的加载器及载荷在这些场景中的生命周期。 |
| [ftpsrv](https://github.com/ps5-payload-dev/ftpsrv/blob/35bae1312b14840c0f95fab93be73d6daaa93bae/README.md) | 通过 ELF 加载器运行，监听 2121，提供文件访问。 | 验证目录访问与测试文件传输。 |
| [Save Mounter](https://github.com/n0llptr/Playstation-5-Save-Mounter/blob/1a0281ea9794afadc2e2da345ca0b66e5db45bc7/README.md) | 声明支持可越狱 PS5 固件和 PS5、PS4 等存档，使用 elfldr 与 FTP。 | 对新建测试存档执行挂载、复制、修改、恢复和游戏内读取。 |
| [etaHEN](https://github.com/etaHEN/etaHEN/releases/tag/2.5B) | 本轮查询最新发布为 2.5B；[2.4B](https://github.com/etaHEN/etaHEN/releases/tag/2.4B)记载修复 8.40–10.01 支持。核对的说明未列出 12.40 支持。 | 将 12.40 插件、Toolbox 和配置恢复记为继续调查与实测项目。 |

Y2JB 文档中的 Lapse 支持至 10.01；本轮为 12.40 选择 P2JB 作为候选。
上述兼容性结论来自开源项目说明，目标主机的实际测试记录将另行对照。

### 后台运行与恢复耗时

[P2JB 移植说明](https://github.com/matem6/P2JB-Y2JB-Porting/blob/9175334589363b67932b45e2f836f7aa9ea5893b/README.md)称其加载器位于 YouTube 进程内，关闭应用会结束加载器及经其运行的载荷。
[独立 elfldr 说明](https://github.com/ps5-payload-dev/elfldr/blob/2a8da002e5292481ea964daa7342bbf4855f4c33/README.md)描述了独立后台运行的机制。
实测时记录具体载荷文件与版本，分别检查 YouTube 关闭、游戏启动及休眠唤醒后的存活情况。

我的初步判断是：先验证独立 FTP 和存档工具，再确认能支撑游戏期间自动备份的后台执行方式。
恢复体验分别记录环境重新建立、备份取回、数据写回和游戏重新读取的耗时。

### 游戏存档

[Playstation-5-Save-Mounter](https://github.com/n0llptr/Playstation-5-Save-Mounter) 声称支持挂载 PS5、PS4 等游戏存档，并通过 FTP 读取或替换挂载后的文件。
项目要求操作后卸载存档，并警告替换 `sce_sys` 文件可能损坏存档。
其[载荷源码](https://github.com/n0llptr/Playstation-5-Save-Mounter/blob/main/mounter_payload/main.c)包含存档目录扫描、密钥材料和挂载逻辑。
将现有存档挂载、复制并恢复是值得验证的候选方案；游戏是否接受恢复结果需要实测。

### 游戏、插件与配置

[etaHEN](https://github.com/etaHEN/etaHEN) 提供游戏转储、FPKG、安装服务及插件相关功能，并使用配置文件。
[ps5-db-backup](https://github.com/jeroendev-one/ps5-db-backup) 展示了备份游戏相关数据库的方案；其适用固件及恢复行为需按具体版本验证。
游戏内容、安装登记、插件文件和配置需要分别验证，才能判断恢复后的使用体验。

### 官方备份与其他数据

[PlayStation 官方 USB 备份文档](https://www.playstation.com/en-us/support/hardware/back-up-ps5-data-USB/)列出游戏和应用、存档、截图、视频和设置，并说明奖杯不包含在备份中。
账号、主机和存档的恢复关系应结合官方文档与实际使用环境验证。

### 存储位置

[ftpsrv](https://github.com/ps5-payload-dev/ftpsrv) 提供越狱 PS5 的 FTP 服务，可作为本地网络传输候选。
USB 可以作为备份目标；本地网络设备可用于接收备份；云端可以先通过电脑或 NAS 中转验证。
以上路径的自动化方式、访问权限与恢复能力需要结合实际环境确定。

## 实机对照清单

1. 以已确认的 12.40 固件为基线，记录初始化后主机的型号与账号状态。
2. 验证 Y2JB 入口、P2JB 完成日志、9021 加载器和 2121 FTP，记录所用版本及耗时。
3. 创建一份测试游戏存档，记录游戏内状态；备份后修改进度，再恢复并核对游戏读取结果。
4. 创建测试插件配置，备份后修改并恢复，比较配置和插件行为。
5. 测试 USB 与本地网络传输，记录文件大小、哈希和耗时。
6. 使用电脑或 NAS 将测试备份上传云端并取回，对照文件内容。
7. 对照 YouTube 关闭、游戏启动和休眠唤醒前后的加载器及 FTP 状态，记录后台服务是否持续运行。
8. 按实际可用的软件和数据，逐步检查游戏安装、媒体和系统设置恢复。
9. 分别记录重启后环境重新建立、备份取回、数据写回和游戏重新读取的耗时。

每项记录环境、操作、备份前状态、恢复结果和与开源资料的差异。

## 后续决策

依据实测结果定义恢复内容、完整度、自动备份方式和存储组合。
