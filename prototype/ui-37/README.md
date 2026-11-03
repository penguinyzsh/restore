# ReStore 高保真可交互 UI 原型（PROTOTYPE — #37 / #45 / #46）

> **PROTOTYPE — Throwaway UI Prototype for [ReStore 本机界面各页面的粗框架结构如何排布](https://github.com/penguinyzsh/restore/issues/45)、[ReStore 本机界面的固定交互逻辑与设计如何规定](https://github.com/penguinyzsh/restore/issues/46) & [交付融合 ReStore 官方 Logo 的高保真可交互 UI 原型（含商店锁定遮罩外观）](https://github.com/penguinyzsh/restore/issues/37)**
> 本目录遵循 `prototype` 规范保存在独立分支 `prototype/restore-ui-37` 上，采用 **Apple Bento 空间矩阵 × PlayStation 5 常驻双图标控制坞（恢复、其他）** 融合方案，并锁定 **方案 A（Apple tvOS 极速跟随 + 全站统一圆勾 BDD 交互与视觉规格）**。
> **第二阶段页面归档说明**：「软件（`?view=apps`）」「商店（`?view=store`）」「搜索（`?view=search`）」完整可交互版本已归档保存在提交 [`4f9954b`](https://github.com/penguinyzsh/restore/commit/4f9954b)，待第二阶段开发商店与搜索功能时直接调取启用。

## 一键运行

在仓库根目录执行（推荐使用支持 HTTP/1.1 Keep-Alive 与高并发队列的启动命令）：

```sh
python3 -c '
import functools, http.server
class H(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
class S(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    allow_reuse_address = True
handler = functools.partial(H, directory="prototype/ui-37")
S(("127.0.0.1", 8788), handler).serve_forever()
'
```

## 核心页面直达链接

- **主界面（上中无交互 Bento 存储概览 + 底部居中单排双纯图标控制坞「恢复 / 其他」）**：<http://127.0.0.1:8788/?view=home>
- **恢复页（2 列 × 3 行横向大圆角卡片，右下第 6 张集成恢复源与执行总控）**：<http://127.0.0.1:8788/?view=restore>
  - **恢复页 · 原地执行进度态（2×3 矩阵内展示单项进度 + 右下总进度 + 底部单行警告）**：<http://127.0.0.1:8788/?lock=normal>
  - **恢复页 · 原地完成汇总态（2×3 矩阵内展示已恢复/待处理/未完成 + 右下汇总与一键重试）**：<http://127.0.0.1:8788/?lock=done>
- **其他页（左导右景聚焦舞台：左侧四级导航轨 + 右侧聚焦毛玻璃工作舞台）**：<http://127.0.0.1:8788/?view=other>
- **首次引导分步向导（Step 1 → Step 2 → Step 3 单步推进，已有恢复点分支）**：<http://127.0.0.1:8788/?view=onboarding&step=1>
- **首次引导分步向导（无恢复点首次全量备份分支）**：<http://127.0.0.1:8788/?view=onboarding&branch=empty-rp&step=1>
- **WebDAV 软键盘模态弹窗**：<http://127.0.0.1:8788/?view=other&modal=webdav-osk>

## 已锁定的 6 大同类归并 BDD 交互与视觉规格（方案 A）

1. **全局焦点路由与手柄四大金刚键（Global Focus & Controller Keys）**：
   - 全站唯一落焦态：内层 `3rem` 纯白高亮环 + 外层 `8rem` 星际蓝柔光晕 + 景深阴影；
   - 初始落焦：进入恢复页/引导页直达右下角主推进按钮；进入其他页落焦左侧当前分类项；退回主页精确还原刚才离开的底坞图标焦点。
2. **导航轨与 Tab 栏切换（Nav Rail & Dock）**：
   - 主页底坞按 `← / →` 仅移动焦点与背景光晕，按 `✕ 确认` 才展开子页；
   - 子页内导航（其他页左侧 4 项分类轨 & 底部紧凑控制坞）采用 **落焦即切页（`Selection Follows Focus`）**，移入内容区后保留深蓝选中底（`Selected`）并褪去白色落焦环（`Focused`）。
3. **多选开关卡片（Multi-Select Toggle Card — 全站 4 处统一）**：
   - 恢复页前 5 张对象卡、引导页备份范围 5 张卡、其他页备份范围 5 张卡、其他页/引导页 3 张存储位置卡，全部统一为 **整张大卡落焦 + 按 `✕ 确认` 直接切换选中/启用态 + 右上角统一为 Apple 圆形打勾 `.check-indicator`**（WebDAV 卡底部保留独立次级按钮打开软键盘）。
4. **单选切换器（Single-Select Radio Item — 全站 3 处统一）**：
   - 恢复页第 6 张卡内「位置/时间点」胶囊组、引导页恢复点大卡片、引导页顶部步骤进度胶囊，均采用落焦后按 `✕ 确认` 单选互斥切换。
5. **恢复页 2×3 原地三态流转与防丢焦（In-Place Stage & CTA Pills）**：
   - 常态 → 执行进度态 → 完成汇总态全程在 `2×3` 矩阵内原地流转；当条件按钮（「全选 5 项」「一键重试未完成项」）点击后消失时，焦点自动顺移至相邻主按钮（「立即恢复」或「完成」）。
6. **模态弹窗与软键盘输入流（WebDAV OSK Modal）**：
   - 焦点严格限制在 `.modal` 内；顶部「服务器地址 / 账号 / 密码」3 个字段框支持方向键落焦并按 `✕ 确认` 切换当前输入目标（显示蓝框、蓝色徽标与光标）；软键盘按键按 `✕` 连续输入字符且焦点稳留当前键。
