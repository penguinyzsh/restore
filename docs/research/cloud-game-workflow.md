# 网盘游戏资源获取与处理调查

## 目标

ReStore 参考 OpenList 的网盘挂载体验，浏览国内外网盘资源，将所选内容下载到 PS5 本地，并根据格式安装，或解压后准备挂载。

## 网盘接入

[OpenList](https://github.com/OpenListTeam/OpenList)将多个存储来源统一为文件列表，提供浏览、下载和 WebDAV 等能力；其驱动列表涵盖国内外多种网盘。
[驱动接口](https://github.com/OpenListTeam/OpenList/blob/main/internal/driver/driver.go)可作为统一存储接入的设计参考。
项目采用 AGPL-3.0，复用其代码时需结合实际使用方式处理许可。

[ezRemote Client](https://github.com/cy33hc/ps5-ezremote-client)提供 PS5 上的 FTP、SFTP、SMB、NFS、WebDAV 和 HTTP 文件访问，项目也列出了部分分享链接和后台下载功能。
它是 PS5 本机浏览与下载的参考；国内网盘账户的具体接入方式需要分别研究。

### PS5 本机直连

ReStore 的方向是由 PS5 本机连接网盘，统一完成登录、目录浏览与文件下载。
[OpenList 阿里云盘驱动](https://github.com/OpenListTeam/OpenList/blob/main/drivers/aliyundrive_open/driver.go)展示了获取账户信息、列目录和获取下载地址的流程；[百度网盘驱动](https://github.com/OpenListTeam/OpenList/blob/main/drivers/baidu_netdisk/driver.go)也提供账户、目录与下载处理参考。
[Google Drive 授权文档](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)和 [Microsoft Graph 文件列表接口](https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0)提供国外网盘的接入依据。

OpenList 驱动使用 Go 并依赖其内部组件；[PS5 Payload SDK](https://github.com/ps5-payload-dev/sdk)提供 PS5 ELF 载荷的开发环境。
两者在 PS5 上如何配合，以及各网盘的授权和下载流程，仍需继续验证。
可以先以 PS5 原生网盘适配器研究统一接口，再逐项验证具体网盘。

### 百度网盘与夸克网盘

当前先研究百度网盘和夸克网盘。

[百度网盘开放平台](https://pan.baidu.com/union/doc/)列出文件管理、上传和下载能力。
[OpenList 百度驱动](https://github.com/OpenListTeam/OpenList/blob/main/drivers/baidu_netdisk/util.go)提供账户凭据刷新、分页列目录和获取下载地址的实现参考；其本地刷新方式使用客户端标识、客户端密钥和 refresh token。

[OpenList 夸克开放接口驱动](https://github.com/OpenListTeam/OpenList/blob/main/drivers/quark_open/util.go)提供请求签名和分页列目录的实现参考；[驱动配置](https://github.com/OpenListTeam/OpenList/blob/main/drivers/quark_open/meta.go)包含应用标识、签名密钥和令牌。
该驱动当前使用在线服务刷新令牌；夸克官方开放平台的首次授权和应用接入方式仍需核实。

两家的首次授权、分享链接处理及 PS5 本机运行情况需要继续调查和验证。

## 文件处理

| 内容 | 候选处理方式 | 开源参考 |
| --- | --- | --- |
| PKG | 下载到 PS5 本地后交给安装服务 | [ezRemote Client](https://github.com/cy33hc/ps5-ezremote-client)、[etaHEN](https://github.com/etaHEN/etaHEN) |
| ZIP、7z、RAR | 解压后识别得到的文件或目录，再进入对应处理流程 | [ezRemote Client](https://github.com/cy33hc/ps5-ezremote-client) |
| 游戏目录及受支持的镜像 | 放入配置的游戏扫描位置，准备挂载和登记 | [ShadowMountPlus](https://github.com/drakmor/ShadowMountPlus) |

ShadowMountPlus 列出 `.ffpkg`、`.exfat`、`.ffpfs` 和 `.ffpfsc` 等镜像格式；不同格式的处理情况见[项目说明](https://github.com/drakmor/ShadowMountPlus)。
安装、解压和挂载的实际结果需要在固件 12.40 的目标主机验证。

## 候选流程

```text
连接网盘 → 浏览资源 → 下载到 PS5 本地
→ 识别文件格式 → 安装，或解压并准备挂载
```

网盘接入、下载任务和格式处理可以作为协作部分设计；PS5 应用负责手柄操作，后台载荷负责下载和处理任务。
具体网盘登录、OpenList 兼容方式和工具集成方式继续讨论与验证。
