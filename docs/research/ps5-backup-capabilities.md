# PS5 折腾环境的备份与恢复能力调查

## 目标与现状

ReSpawn 旨在尽量恢复游戏、存档、系统设置、插件及配置，重建原有使用体验。
当前目标 PS5 已初始化；实机验证从当前机器环境和新建测试数据开始。

## 开源项目初步结论

### 折腾入口与载荷

[Y2JB](https://github.com/Gezine/Y2JB) 使用 PS5 YouTube 应用取得用户态代码执行，项目列出至少 4.03 的固件要求以及不同固件对应的 YouTube 版本。
其 Lapse 载荷注明支持至固件 10.01；用户态入口与内核权限是不同环节。
[elfldr](https://github.com/ps5-payload-dev/elfldr) 提供 PS5 ELF 载荷加载服务。
实际可用的利用链和访问权限取决于主机固件及所用组件，需要在目标机器上确认。

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

1. 记录初始化后 PS5 的型号、固件、账号状态与可用折腾入口。
2. 在可用环境中记录载荷及插件版本，确认 FTP 和存档挂载工具能否启动。
3. 创建一份测试游戏存档，记录游戏内状态；备份后修改进度，再恢复并核对游戏读取结果。
4. 创建测试插件配置，备份后修改并恢复，比较配置和插件行为。
5. 测试 USB 与本地网络传输，记录文件大小、哈希和耗时。
6. 使用电脑或 NAS 将测试备份上传云端并取回，对照文件内容。
7. 按实际可用的软件和数据，逐步检查游戏安装、媒体和系统设置恢复。

每项记录环境、操作、备份前状态、恢复结果和与开源资料的差异。

## 后续决策

依据实测结果定义恢复内容、完整度、自动备份方式和存储组合。
