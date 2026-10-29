# 问题追踪器：GitHub

本项目的问题和规格存放在 GitHub Issues 中。
使用 `gh` CLI 操作。

## 常用操作

- 创建：`gh issue create --title "..." --body "..."`
- 查看：`gh issue view <number> --json number,title,body,labels,comments`
- 列出：`gh issue list --state open`
- 评论：`gh issue comment <number> --body "..."`
- 添加标签：`gh issue edit <number> --add-label "..."`
- 移除标签：`gh issue edit <number> --remove-label "..."`
- 关闭：`gh issue close <number> --comment "..."`

在本地仓库中运行时，`gh` 根据 Git 远程地址识别仓库。

## 将拉取请求作为分类入口

**将 PR 作为需求入口：否。**

## 发布与读取

- 技能要求发布到问题追踪器时：创建 GitHub Issue。
- 技能要求读取相关工单时：查看对应 GitHub Issue。

## Wayfinding 操作

- 地图是带 `wayfinder:map` 标签的 Issue。
- 决策工单是地图的 GitHub 子工单，使用 `wayfinder:<type>` 标签。
- 认领工单时，先将工单分配给当前用户。
- 工单依赖使用 GitHub 原生依赖关系。
- 查询前沿时，筛选地图中未关闭、未认领且没有未关闭阻塞项的子工单。
- 完成工单时，发表结论评论、关闭工单，并在地图中追加带链接的结论索引。
- 如果子工单或原生依赖不可用，使用地图任务列表和工单正文记录关系。
