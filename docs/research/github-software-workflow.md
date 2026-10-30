# GitHub 开源软件版本与安装调查

## 目标

ReStore 软件商店提供可浏览的开源软件目录，并允许添加 GitHub 仓库。
ReStore 自动检查更新，由用户选择何时安装。

## GitHub 版本与资源

[GitHub Releases API](https://docs.github.com/en/rest/releases/releases)提供项目发布版本；[Release Assets API](https://docs.github.com/en/rest/releases/assets)提供资源名称、大小及下载地址。
项目可以在同一版本中发布多个资源，源码归档与发布者上传的资源是不同的内容。

[ezRemote Client 的 GitHub 客户端](https://github.com/cy33hc/ps5-ezremote-client/blob/master/source/clients/github.cpp)将项目发布版本和资源展示为可浏览内容。
其[发布版本](https://github.com/cy33hc/ps5-ezremote-client/releases/tag/2.17)同时包含 ZIP、ELF、PKG 和版本文本；[安装说明](https://github.com/cy33hc/ps5-ezremote-client)描述了这些资源的不同用途。

## 软件商店的候选流程

1. 浏览目录或添加 GitHub 仓库。
2. 查询项目版本与发布资源。
3. 结合项目的安装说明，确定软件所需资源及处理方式。
4. 用户选择安装，由 PS5 本机下载安装和配置相关文件。
5. 后续检查项目版本变化，向用户展示可安装的更新。

目录可记录项目地址、所需资源及安装方式，供 ReStore 处理。
用户添加仓库时，ReStore 可展示该项目的版本与资源，并结合项目信息确定安装步骤。

## PS5 安装参考

[ezRemote Client](https://github.com/cy33hc/ps5-ezremote-client)提供 PS5 上的远程文件浏览和安装参考。
不同项目的 PKG、ELF 和 ZIP 可能承担不同作用；固件 12.40 的实际安装与运行需要后续验证。
