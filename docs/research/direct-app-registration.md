# PS5 原生应用直接登记调查

## SDK 直接登记示例

[PS5 Payload SDK 的 install_app 示例](https://github.com/ps5-payload-dev/sdk/blob/a7685ce8e97ce1f8a4f38253a41d54241c9124f1/samples/install_app/payload.c#L20-L35)初始化 AppInstUtil 后，直接调用 `sceAppInstUtilAppInstallTitleDir` 登记标题目录，没有调用 `nullfs`。

[示例构建和部署步骤](https://github.com/ps5-payload-dev/sdk/blob/a7685ce8e97ce1f8a4f38253a41d54241c9124f1/samples/install_app/Makefile#L29-L84)将标题元数据和可执行文件放在不同的系统位置，并要求相应写入权限。该示例提供了 ReStore 研究直接登记的起点。

## PS5Library

[PS5Library 安装器](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/installer/main.cpp#L19-L42)直接登记自己的标题，但当固件版本达到 12.00 时将该路径标记为未验证。它的[入口页面](https://github.com/rdiol12/PS5Library/blob/aaea687800a882234d78ff546483b48b7a144d20/frontend/ps5/assets/launch.html#L8-L15)通过 Homebrew Launcher 加载 ELF。

## 固件 12.40 的登记参考

[ShadowMountPlus 登记代码](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_install.c#L35-L82)对固件 12 以上使用 ShellCore 登记桥；其[偏移表](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_shellcore_offsets.inc#L410-L440)包含 12.40。ShadowMountPlus 自己的[应用处理流程](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_install.c#L236-L285)仍会进行 `nullfs` 挂载。

## ReStore 候选方向

在已建立折腾环境后，研究将 ReStore 标题所需文件放入系统可访问的位置，并使用适配 12.40 的登记机制创建主界面入口。SDK 示例提供直接登记的参考；12.40 上直接登记并启动原生应用的完整路径需要实机对照。
