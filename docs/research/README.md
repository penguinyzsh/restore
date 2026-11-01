# ReStore 研究资料索引

本目录汇总 ReStore 在 PS5 固件 12.40 基线上的开源项目机制对比与实机排障证据，为 [#34 产品与架构规格](https://github.com/penguinyzsh/restore/issues/34) 下的实机探查收口（[#36](https://github.com/penguinyzsh/restore/issues/36)）及各纵向切片开发提供可追溯依据。

---

## 1. PS5 12.40 实机排障与核心数据机制

| 文档 | 核心内容 | 关联工单 |
| --- | --- | --- |
| [12.40 后台载荷启动安全与权限恢复实证](ps5-1240-runtime-safety.md) | 定位 SDK 默认 CRT 中 `kernel_find_iommu_softc` 内核堆扫描导致的启动死机（`CE-108262-9`），给出 CPU-only CRT 修复方案与进程凭据（authid/caps/rootdir/jaildir）先读后改、回读校验的安全规范。 | #6, #34, #38 |
| [12.40 全游戏通用存档备份与恢复机制](ps5-save-universal-mechanism.md) | 对比 Save Mounter、PS5Save、PSCloud 源码与 12.40 实机《最后生还者 Part I》实验，剖析 PS5 存档三层结构（PFS 加密容器、`savedata_prospero_meta`、`savedata.db`）与 `param.sfo` 通用字段规律，确立支持“已有槽覆盖”与“初始化后无槽直接建槽”的跨账号通用恢复流程及同目录 `rename` 提交方案。 | #6, #18, #40 |
| [12.40 环境配置、账号激活与桌面数据实机基线](ps5-1240-environment-and-data.md) | 记录 Y2JB 自动加载链、关闭 YouTube 后 6 项后台服务驻留结果、35 个环境与 ELF 插件/载荷配置文件清单、原生 16 KB 账号离线激活修复、`libSceRegMgr` 设置读写实证及 `/user/app/<TITLE_ID>` 轻量游戏桌面展示结构。 | #6, #15, #39, #41, #42 |

---

## 2. 既有开源能力与方案调研

| 文档 | 核心内容 | 关联工单 |
| --- | --- | --- |
| [PS5 折腾环境的备份与恢复能力调查](ps5-backup-capabilities.md) | 折腾入口（Y2JB / Relapse / WebKit Autoloader）、后台加载器、存档导出、HEN 配置、官方备份范围及实机对照框架总览。 | #1, #2, #6 |
| [PS5 用户指南入口的 DNS 与 HTTPS](public-dns-entry.md) | `manuals.playstation.net` 的 DNS 应答与 HTTPS 指南入口映射机制，以及非目标域名转发需求。 | #7, #31, #44 |
| [ReStore 引导载荷部署调查](bootstrap-deployment.md) | 引导载荷下载应用包、miniz 解包、写入扫描目录并衔接登记与启动的候选链路。 | #7, #30, #44 |
| [PS5 原生应用直接登记调查](direct-app-registration.md) | SDK `sceAppInstUtilAppInstallTitleDir` 直接登记示例与 ShadowMountPlus 12.40 ShellCore TitleDir 登记桥对比。 | #17, #33, #38 |
| [ShadowMountPlus 目录与镜像部署调查](shadowmount-directory.md) | 原生应用目录与镜像文件的扫描、`nullfs` 挂载及 TitleDir 登记流程分析。 | #32, #38, #42 |
| [GitHub 开源软件版本与安装调查](github-software-workflow.md) | GitHub Releases 资源获取及独立应用、OnionHEN 插件、独立载荷三类产物的安装参考（第一版仅用于商店外观预览参考）。 | #20, #25, #26, #27, #37 |
| [网盘游戏资源获取与处理调查](cloud-game-workflow.md) | 百度网盘、夸克 TV 扫码授权与多格式游戏资源处理参考（第一版仅用于商店外观预览参考）。 | #21, #22, #23, #24, #28, #37 |

---

## 3. 已明确剔除的废弃方案（不纳入工程实现）

为避免前序探索中的错误尝试污染后续开发，以下方案已根据 [#34](https://github.com/penguinyzsh/restore/issues/34) 明确废弃并从正式资料中剔除：
1. **魔改 `ShadowMountPlus` 注入 `SceShellCore` 拦截进程创建（原 `launch-protection`）**：侵入第三方载荷且极易引发系统崩溃；恢复期间改为采用 ReStore 应用内全屏专注进度锁 + 温和警告提示 + 后台写前检查冲突进程。
2. **盲目调用未公开参数的 `libSceContentExport.sprx`（`sceContentExportFromFile`）**：因缺少未公开结构体字段语义与 PRX 动态重定位上下文，直接调用会触发 `0xa0020101`（未解析 PRX 函数）并导致 `ShellUI` / `JSCd` 冻结；媒体图库恢复改为采用 `/user/av_contents` 媒体文件还原加 `/system_data/priv/mms/` 媒体数据库登记方案。
3. **无意义的“双读字节 SHA256 哈希对比”**：所有备份与恢复验收统一以解包状态及 PS5 实机端到端实际运行效果为准。
