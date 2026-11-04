# ADR 0001: ReStore 前台必须采用真正 PS5 原生应用而非网页容器

## 状态

已采纳（2026-11-05，源于 `#38` 实机验收反馈）

## 背景

在 `#38`（贯通最小原生独立应用及后台服务驻留底座）中，我们通过 `sceAppInstUtilAppInstallTitleDir("RSTR00001", "/user/app/", NULL)` 配合 `param.json` 的 `deeplinkUri: "http://127.0.0.1:9099/"` 在 PS5 12.40 主屏幕成功登记了带有官方 Logo 的 `ReStore` 图标，并与后台常驻服务 `restore.elf` 跑通了状态同步。

但实机打开后发现，`deeplinkUri` 会通过系统 `psmediahub` 打开内置浏览器/网页容器，表现为**网页应用**而非真正的 PS5 原生应用。

## 决策

1. **`#38` 仅将 `deeplinkUri` 作为过渡验证底座**：当前已验证通过的 `sceAppInstUtilAppInstallTitleDir` 主界面登记链路与 `restore.elf` 后台常驻服务底座予以保留，先完成 `#38` 收口。
2. **正式前台界面必须演进为真正的 PS5 原生应用**：
   - 后续开发必须将 `RSTR00001` 的前台载体从 `deeplinkUri` 网页容器替换为**真正的 PS5 原生可执行应用**（如 `/user/app/RSTR00001/eboot.bin` + `/system_ex/app/RSTR00001/eboot.bin` 或 `nullfs` 挂载、基于 `libSceVideoOut` / `SDL2` / `OpenGL ES` 与 `libScePad` 的原生全屏渲染进程），彻底去除浏览器外壳与网页感。
   - 原生应用视觉与交互必须严格复刻第一阶段已定稿的 12 列主机栅格、PS5 蓝宝石毛玻璃质感与 DualSense 手柄导航体验，并继续通过本机回环接口与后台常驻服务 `restore.elf` 协同工作。

## 影响

- 在 GitHub Issues 中新增专门工单跟踪“将 `RSTR00001` 前台从 `deeplinkUri` 网页容器升级为真正 PS5 原生渲染应用（`eboot.bin`）”。
- 后续所有涉及前台应用的架构设计与验收均以**非网页容器的原生应用**为最终标准。

