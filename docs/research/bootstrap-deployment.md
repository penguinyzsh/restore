# ReStore 引导载荷部署调查

## 目标

在 PS5 建立折腾环境后，研究由引导载荷取得 ReStore 原生应用、部署应用文件并启动的路径。

## 开源依据

1. [PS5 Payload SDK 示例](https://github.com/ps5-payload-dev/sdk/tree/master/samples)包含 `http2_get` 和 `install_app`。前者展示载荷中的 HTTP 请求；后者展示已有标题目录的登记。它们分别提供联网和登记的参考，还需要将文件下载、保存和部署串接起来。
2. [ProsperoStore 安装工作器](https://github.com/darkxex/ProsperoStore/blob/main/src/install/worker.cpp)通过独立工作器处理安装请求和进度；其 [ZIP 处理代码](https://github.com/darkxex/ProsperoStore/blob/main/src/install/archive.cpp)使用 miniz 读取和解包 ZIP。该项目的[安装说明](https://github.com/darkxex/ProsperoStore#install)描述了将原生应用目录放入 ShadowMountPlus 扫描位置，由其登记到主界面。ProsperoStore 自身是应用及工作器组成的方案，不能直接等同于独立引导载荷。
3. [ShadowMountPlus](https://github.com/drakmor/ShadowMountPlus)声明需要已越狱环境和 kstuff-lite v1.07 及以上。其配置说明指出固件 12.00 及以上的默认逐标题登记路径使用 SceShellCore TitleDir bridge。
4. [PS5 Native App Boilerplate](https://github.com/leolobato/prospero-foundation)提供生成原生标题目录的公开构建流程，并说明可通过 ShadowMountPlus 部署。

## ReStore 候选流程

折腾环境就绪 → 加载引导载荷 → 下载 ReStore 应用文件 → 解包并写入扫描位置 → ShadowMountPlus 登记 → 用户从主界面启动 ReStore。

SDK、ProsperoStore 和 ShadowMountPlus 分别提供上述环节的参考。需要继续确认独立引导载荷的网络访问、文件写入权限、解包及与 ShadowMountPlus 的衔接；固件 12.40 上的整条链路留待实机对照。
