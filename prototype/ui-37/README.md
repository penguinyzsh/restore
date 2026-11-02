# ReStore 高保真可交互 UI 原型（PROTOTYPE — #37）

> **PROTOTYPE — Throwaway UI Prototype for [#37](https://github.com/penguinyzsh/restore/issues/37)**
> 本目录遵循 `prototype` 规范保存在独立分支 `prototype/restore-ui-37` 上，探索 **Apple tvOS Liquid Glass × PlayStation 5 主机界面** 的深度融合方案，提供三套结构变体（`?variant=A|B|C`）与底部悬浮切换器。

## 一键运行

在仓库根目录执行：

```sh
python3 -m http.server 8788 --bind 127.0.0.1 --directory prototype/ui-37
```

## 三套 Apple × PS5 融合变体（`?variant=A|B|C`）

- **变体 A（`tvOS 液态玻璃画境`）**：<http://127.0.0.1:8788/?variant=A&view=home>
  - 左上开放式品牌字标 + 上中左右分栏无交互概览（主机快照体积与右侧三层液态玻璃存储设备条）+ 底部全宽同心曲率毛玻璃托盘包裹四张纯图标宽屏磁贴。
- **变体 B（`Bento 空间控制坞`）**：<http://127.0.0.1:8788/?variant=B&view=home>
  - 上中对称 Bento 空间仪表盘（PS5 分段式存储光谱条 + Apple 环形容量仪表盘）+ 底部居中常驻四图标控制坞（进入子页面时自动收窄常驻底部并支持 FLIP 过渡）。
- **变体 C（`PS5 极简全画幅光域`）**：<http://127.0.0.1:8788/?variant=C&view=home>
  - 上中居中巨幅状态标题与全景四联横置仪器舱 + 底部无外框四张独立悬浮水晶大磁贴 + 随焦点流转的背景氛围光。

## 子页面与特殊场景直达链接

- **恢复（位置/恢复点胶囊 + 5 张统一大圆角步骤卡）**：<http://127.0.0.1:8788/?variant=A&view=restore>
- **软件（底层卡片 + 液态毛玻璃预览锁遮罩）**：<http://127.0.0.1:8788/?variant=A&view=apps>
- **商店（底层封面网格 + 液态毛玻璃预览锁遮罩）**：<http://127.0.0.1:8788/?variant=A&view=store>
- **其他（2×2 高密度四模块玻璃工作台）**：<http://127.0.0.1:8788/?variant=A&view=other>
- **首次引导全屏覆盖层**：<http://127.0.0.1:8788/?variant=A&view=onboarding>
- **全屏专注恢复进度锁（断点续做示例）**：<http://127.0.0.1:8788/?variant=A&lock=resumed>

## 核心结构与快捷键约束

- **右上角胶囊**：仅展示当前时间与圆形头像。
- **上中概览展示区**：纯环境信息展示（主机内置存储、USB 与 WebDAV 容量及在线/同步状态），完全无交互焦点。
- **最下方四个纯 ICON 卡片**：依次为 **恢复、软件、商店、其他**，卡片内部仅保留立体图形图标；全站卡片严格统一使用 `30rem` 大圆角（外层托盘采用同心曲率）。
- **键盘 / 手柄快捷键**：
  - `↑` `↓` `←` `→`：十字键空间焦点流转
  - `Enter`：对应右下角 `✕ 确认`
  - `Esc` / `Backspace`：对应右下角 `◯ 返回`（从子页面返回主界面或关闭弹窗）
  - `T`：对应右下角 `△ 备份`
  - `F` / `R`：对应右下角 `□ 恢复`
  - `[` / `]`（或 `Shift + ←` / `Shift + →`）：循环切换底部悬浮栏 `A / B / C` 设计变体
