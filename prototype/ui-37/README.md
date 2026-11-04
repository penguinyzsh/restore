# ReStore 高保真可交互 UI 原型（PROTOTYPE — #37 / #45 / #46 / #47）

> **PROTOTYPE — Throwaway UI Prototype for [ReStore 本机界面各页面的粗框架结构如何排布](https://github.com/penguinyzsh/restore/issues/45)、[ReStore 本机界面的固定交互逻辑与设计如何规定](https://github.com/penguinyzsh/restore/issues/46)、[ReStore 本机界面如何完成精细化交互与设计落地](https://github.com/penguinyzsh/restore/issues/47) & [交付融合 ReStore 官方 Logo 的第一阶段高保真可交互 UI 原型](https://github.com/penguinyzsh/restore/issues/37)**
> 本目录遵循 `prototype` 规范保存在独立分支 `prototype/restore-ui-37` 上，采用 **1920×1080 标准 12 列主机栅格（`1680rem × 648rem`）× PlayStation 5 蓝宝石毛玻璃卡片 × 底部常驻双图标控制坞（恢复、其他）** 体系。
> **第二阶段页面归档说明**：「软件（`?view=apps`）」「商店（`?view=store`）」「搜索（`?view=search`）」完整可交互版本已归档保存在提交 [`4f9954b`](https://github.com/penguinyzsh/restore/commit/4f9954b)，待第二阶段开发商店与搜索功能时直接调取启用。

## 一键运行

在仓库根目录执行（推荐使用支持 HTTP/1.1 Keep-Alive 与高并发队列的启动命令）：

```sh
python3 -c '
import functools, http.server
class H(http.server.SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()
class S(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    allow_reuse_address = True
handler = functools.partial(H, directory="prototype/ui-37")
S(("127.0.0.1", 8788), handler).serve_forever()
'
```

## 核心页面直达链接（支持追加 `&grid=1` 开启 12 列可视化参考线）

- **主界面（`8+4 / 4+4+4` Bento 存储概览 + 底部 `Cols 05..08` 双纯图标控制坞「恢复 / 其他」）**：<http://127.0.0.1:8788/?view=home>（栅格参考线：<http://127.0.0.1:8788/?view=home&grid=1>）
- **恢复页（`6+6 × 3行` 横向卡片，右下第 6 张集成恢复源与执行总控）**：<http://127.0.0.1:8788/?view=restore>（栅格参考线：<http://127.0.0.1:8788/?view=restore&grid=1>）
  - **恢复页 · 原地执行进度态**：<http://127.0.0.1:8788/?lock=normal>
  - **恢复页 · 原地完成汇总态**：<http://127.0.0.1:8788/?lock=done>
- **其他页（左侧 `Cols 01..03 × 4行` 导航卡 + 右侧 `Cols 04..12` 栅格卡片）**：
  - **备份存储位置（`3+3+3 × 1行`）**：<http://127.0.0.1:8788/?view=other&tab=locations>（栅格参考线：<http://127.0.0.1:8788/?view=other&tab=locations&grid=1>）
  - **自动备份内容范围（`3+3+3 × 2行`）**：<http://127.0.0.1:8788/?view=other&tab=scope>（栅格参考线：<http://127.0.0.1:8788/?view=other&tab=scope&grid=1>）
  - **恢复点保留与锁定（`3+3+3 × 1行`）**：<http://127.0.0.1:8788/?view=other&tab=protect>
  - **后台服务与自启控制（`3+3+3 × 1行`）**：<http://127.0.0.1:8788/?view=other&tab=daemon>
- **首次引导分步向导（`12列` 顶部步骤栏 + `4+4+4` 三列舞台卡片）**：<http://127.0.0.1:8788/?view=onboarding&step=1>（栅格参考线：<http://127.0.0.1:8788/?view=onboarding&step=1&grid=1>）
- **首次引导分步向导（无恢复点首次全量备份分支）**：<http://127.0.0.1:8788/?view=onboarding&branch=empty-rp&step=1>
- **WebDAV 软键盘模态弹窗**：<http://127.0.0.1:8788/?view=other&modal=webdav-osk>

## 1920×1080 12 列主机栅格体系（#47）

1. **横向 12 列基准（`X: 120rem .. 1800rem`，总宽 `1680rem`）**：
   - 左右安全边距固定 `120rem`，列间距（Gutter）固定 `24rem`，每列净宽精确为 `118rem`（`12 × 118 + 11 × 24 = 1680rem`）。
   - 顶栏左侧标题左边缘与全站第 1 列左边缘（`120rem`）严格对齐，顶栏右侧时钟胶囊右边缘与全站第 12 列右边缘（`1800rem`）严格对齐。
2. **纵向 `648rem` 谐波舞台高度（`Y: 168rem .. 816rem`）**：
   - 顶栏高 `108rem` + 顶栏下间距 `60rem` → 主内容舞台统一从 `Y = 168rem` 开始，总高固定 `648rem`（`Y = 816rem` 结束）：
     - **1 行满高**：`1 × 648rem`（其他页 3 列满高卡片）
     - **2 行等分**：`2 × 312rem + 1 × 24rem = 648rem`（主页 Bento 2 行、其他页「自动备份内容范围」`3×2` 卡片）
     - **3 行等分**：`3 × 200rem + 2 × 24rem = 648rem`（恢复页 `2×3` 卡片）
     - **4 行等分**：`4 × 144rem + 3 × 24rem = 648rem`（其他页左侧 4 张分类导航卡；且前 2 张 `144 + 24 + 144 = 312rem`，横向中缝与右侧 2 行卡片的横向中缝严丝合缝对齐）

## 已锁定的 6 类手柄操作规则与 PS5 蓝毛玻璃视觉规范（#46）

1. **全局焦点路由与手柄四大金刚键（Global Focus & Controller Keys）**：
   - 全站唯一落焦态：内层 `3rem` 纯白高亮环 + 外层 `8rem` 星际蓝柔光晕 + 景深阴影；
   - 初始落焦：进入恢复页/引导页直达右下角主推进按钮；进入其他页落焦左侧当前分类项；退回主页精确还原刚才离开的底坞图标焦点。
2. **导航轨与 Tab 栏切换（Nav Rail & Dock）**：
   - 主页底坞按 `← / →` 仅移动焦点与背景光晕，按 `✕ 确认` 才展开子页；
   - 子页内导航（其他页左侧 4 项分类轨 & 底部紧凑控制坞）采用 **落焦即切页（`Selection Follows Focus`）**，移入内容区后保留深蓝选中底（`Selected`）并褪去白色落焦环（`Focused`）。
3. **多选开关卡片与蓝毛玻璃 + 四色胶囊规范（Multi-Select Toggle Card — 全站 5 处统一）**：
   - 恢复页前 5 张对象卡、引导页备份范围 5 张卡、其他页备份范围 5 张卡、其他页/引导页 3 张存储位置卡、其他页 3 张恢复点锁定卡，全部保持 **PS5 蓝宝石毛玻璃底色**（选中态为明亮冰蓝毛玻璃 + 左侧冰白竖条，未选态为深邃午夜蓝毛玻璃）；
   - **四色仅用于左下角 2～4 字状态胶囊（`.badge`）**：蓝（默认信息）、绿（`已勾选 / 已开启 / 已连接 / 已恢复`）、黄（`仅图标 / 待重进 / 空间紧`）、红（`未完成 / 断连`）；
   - 步骤与卡片序号不放胶囊，统一做成卡片右侧背景的斜体大号数字水印（`.card-bg-num`，`1..5`）。
4. **单选切换器（Single-Select Radio Item — 全站 3 处统一）**：
   - 恢复页第 6 张卡内「位置/时间点」胶囊组、引导页恢复点大卡片、引导页顶部步骤进度胶囊，均采用落焦后按 `✕ 确认` 单选互斥切换。
5. **恢复页 2×3 原地三态流转与防丢焦（In-Place Stage & CTA Pills）**：
   - 常态 → 执行进度态 → 完成汇总态全程在 `2×3` 矩阵内原地流转；当条件按钮（「全选 5 项」「一键重试未完成项」）点击后消失时，焦点自动顺移至相邻主按钮（「立即恢复」或「完成」）。
6. **模态弹窗与软键盘输入流（WebDAV OSK Modal）**：
   - 焦点严格限制在 `.modal` 内；顶部「服务器地址 / 账号 / 密码」3 个字段框支持方向键落焦并按 `✕ 确认` 切换当前输入目标（显示蓝框、蓝色徽标与光标）；软键盘按键按 `✕` 连续输入字符且焦点稳留当前键。
