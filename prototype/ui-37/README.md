# ReStore 高保真可交互 UI 原型（PROTOTYPE — #37 初版）

> **PROTOTYPE — Throwaway UI Prototype for [#37](https://github.com/penguinyzsh/restore/issues/37)**
> 本目录为遵循 `prototype` 规范保存在独立分支 `prototype/restore-ui-37` 上的第一阶段 UI 原型，供后续继续迭代打磨界面细节。

## 一键运行

在仓库根目录执行：

```sh
python3 -m http.server 8788 --bind 127.0.0.1 --directory prototype/ui-37
```

随后在浏览器打开：

- **默认入口（Variant A · 2026 PS5 Welcome 磁贴轨 + 三栏矩阵）**：<http://127.0.0.1:8788/?variant=A&view=home>
- **Variant B（PS5 Project 巨幅主视觉 + 横向五对象看板）**：<http://127.0.0.1:8788/?variant=B&view=home>
- **Variant C（PS5 控制中心双栏工作台 + 恢复点时间轴）**：<http://127.0.0.1:8788/?variant=C&view=home>
- **首次引导页（含 WebDAV 手柄输入法弹窗与有/无恢复点双分支）**：<http://127.0.0.1:8788/?variant=A&view=onboarding>
- **数据恢复页（位置 → 恢复点 → 五类核心对象 & 依赖顺序流水线）**：<http://127.0.0.1:8788/?variant=A&view=restore>
- **应用内全屏专注恢复进度锁（含温和警告、冲突检测、断电重启续做）**：<http://127.0.0.1:8788/?variant=A&lock=resumed>
- **软件商店（底层卡片 + 顶层半透明预览锁定遮罩）**：<http://127.0.0.1:8788/?variant=A&view=store-apps>
- **网盘游戏（底层封面网格 + 顶层半透明预览锁定遮罩）**：<http://127.0.0.1:8788/?variant=A&view=store-games>
- **系统设置页**：<http://127.0.0.1:8788/?variant=A&view=settings>

## 键盘 / 手柄快捷键

- `↑` `↓` `←` `→`：十字键空间焦点高亮流转
- `Q` / `E`：模拟手柄 `L1` / `R1` 顶部页面切换
- `[` / `]`：快速切换 `Variant A / B / C` 三套结构变体
- `Enter`：模拟 `✕ 确认`
- `Esc` / `Backspace`：模拟 `◯ 返回`
- `T`：模拟 `△ 选项（立即手动备份）`
- `F`：模拟 `□ 操作（进入全屏恢复锁 / 锁定保护恢复点）`
