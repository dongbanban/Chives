## Parent

[代码质量基线补全](/Users/i104/Chives/docs/prd/0001-codebase-polish.md)

## What to build

收窄 Post.category 类型为字面量联合，并从该类型派生 CATEGORY_LABELS 的键。同时补全 hooks/index.ts barrel 导出，让所有 hooks 经统一入口 import。

端到端效果：

- 类型层面：用非法的 category 字符串赋值给 Post.category 在编译期报错；CATEGORY_LABELS 新增 category 时必须同步加 label，否则 tsc 失败。
- 调用层面：Dashboard 页面 `import { useDashboardQuery } from "@/hooks"` 替代 `from "@/hooks/dashboard"`。

### 类型形状

```ts
const CATEGORIES = ["tech", "life", "design"] as const;
type Category = (typeof CATEGORIES)[number];
// Post.category: Category
// CATEGORY_LABELS: Record<Category, string>
```

## Acceptance criteria

- [ ] `types/post.ts` 导出 CATEGORIES const 和 Category 类型
- [ ] `Post.category` 从 `string` 改为 `Category`
- [ ] `CATEGORY_LABELS` 从 `Record<string, string>` 改为 `Record<Category, string>`
- [ ] 非 "tech" | "life" | "design" 的 category 赋值在编译期报错
- [ ] `hooks/index.ts` 导出 `useDashboardQuery`
- [ ] Dashboard 页面 import 从 `@/hooks/dashboard` 改为 `@/hooks`
- [ ] Posts 列表和详情页 Badge 正常渲染分类标签
- [ ] `tsc --noEmit` 通过
- [ ] `vitest run` 通过

## Blocked by

None — can start immediately
