# ShadowMountPlus 目录与镜像部署调查

## 项目提示

[ShadowMountPlus README](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/README.md)提示，挂载镜像可能造成关机问题和内部存储数据损坏。文档未明确说明该提示是否适用于直接部署的应用目录。

## 目录部署

[扫描代码](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_scan.c#L198-L249)发现应用目录并读取标题信息。[安装代码](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_install.c#L191-L389)准备元数据、调用 `mount_title_nullfs` 并登记标题。

[ProsperoStore 安装说明](https://github.com/darkxex/ProsperoStore#install)提供将原生应用目录放入 ShadowMountPlus 扫描位置并登记到主界面的实例。

## 镜像部署

[扫描代码](https://github.com/drakmor/ShadowMountPlus/blob/30c5a2b791ada7a78ccbda92f4bc3b1fa1cf27dd/src/sm_scan.c#L546-L597)在需要时先调用 `maybe_mount_image_file` 处理镜像，再扫描其中的应用目录；后续进入标题挂载与登记流程。

## 对 ReStore 的影响

原生应用目录不需要先将镜像文件附加为设备，但目录部署仍会进行 `nullfs` 挂载及登记。项目提示所述问题的具体原因及其与目录路径的关系尚未确认；ReStore 的候选启动链需要在固件 12.40 实机对照。
