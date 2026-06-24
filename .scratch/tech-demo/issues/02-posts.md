# 列表+详情页 (Posts)

## Parent

PRD: 前端技术融合 Demo 项目初始化 (../PRD.md)

## What to build

构建博客文章列表和详情两个页面。列表页展示文章标题/摘要，支持分页；详情页通过路由参数加载单篇文章。主演示 TanStack Router 的 file-based 路由和 TanStack Query 的缓存/去重机制，配合 shadcn Table/Card/Skeleton 组件。

## Acceptance criteria

- [ ] `/posts` 列表页渲染文章列表，数据来自 MSW mock
- [ ] 文章列表支持分页，Query 缓存去重生效（同一页不重复请求）
- [ ] `/posts/$id` 详情页根据路由参数加载文章，Query key 包含 id
- [ ] 详情页使用 Skeleton 组件展示加载态
- [ ] 列表页切到详情页再返回，列表数据从缓存读取，不发新请求
- [ ] shadcn Table/Card/Badge 组件正常渲染

## Blocked by

- 项目骨架搭建
EOF
