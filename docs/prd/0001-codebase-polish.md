## Problem Statement

当前各 Demo 页面存在 5 个代码质量缺陷，影响可维护性、类型安全、数据可验证性和用户体验：

1. API 请求逻辑分散在 hooks 内部，与 api/ 占位层脱节。接入真实后端时每个 hook 逐一改动，违背"一处变更"原则。
2. Dashboard 页面主角（ECharts 图表）每次生成随机 mock 数据，同一查询参数下重复渲染拿到不同数据，无法验证 TanStack Query 缓存是否生效。
3. Post.category 类型为 `string`，CATEGORY_LABELS 为 `Record<string,string>`，允许不合法的 category 值透传，缺失编译期保护。
4. hooks/index.ts 未导出 dashboard hook，调用方直接 import 内部模块路径，破坏统一的模块出口。
5. 路由层缺少 loader 预取，所有数据在组件挂载后才发起请求，产生一帧空白内容。对带 URL 参数的 Demo 页面（如 /posts/$id）影响尤为明显。

## Solution

从架构分层、类型安全、数据确定性和首屏体验四个维度，系统性地补全代码质量基线。改动不引入新 Demo 页面，不更换已有页面主角，不影响现有技术栈选型。

## User Stories

1. As a 前端开发者，I want 所有 API 请求经统一 HTTP 客户端发送 to 保证错误处理、base URL、拦截器一致，接入真实后端时只改配置不改业务代码。
2. As a 前端开发者，I want hooks 层只负责 TanStack Query 封装 to 让数据请求逻辑和 React 绑定职责分离，修改 API 请求行为不影响 hook 调用方。
3. As a 前端开发者，I want Dashboard mock 数据在给定 metric 和 timeRange 下始终一致 to 能通过查看 Network 面板或 Query Devtools 确认缓存去重机制确实生效。
4. As a 前端开发者，I want Post.category 类型收窄为字面量联合 to 让编译器阻止非法 category 值，避免运行时 `CATEGORY_LABELS[post.category]` 静默 resolve 为 undefined。
5. As a 前端开发者，I want CATEGORY_LABELS 的类型键从 category 联合类型派生 to 保证新增 category 时 labels 映射不遗漏。
6. As a 前端开发者，I want hooks/index.ts 提供完整的统一导出 to 调用方只需 `import { ... } from "@/hooks"`，不暴露内部模块结构。
7. As a 终端用户，I want 页面切换后第一帧就有数据 to 不会看到空白加载态闪烁，尤其在带有 URL 参数的帖子详情页。
8. As a 前端开发者，I want loader 和 hook 共享同一 queryOptions 定义 to 避免 queryKey 漂移导致缓存不一致，且修改 staleTime 等配置只需改一处。
9. As a 前端开发者，I want API 层函数不含任何 React 依赖 to 可以独立单元测试，不依赖组件渲染或 hook 环境。
10. As a 前端开发者，I want Dashboard mock fixture 替换掉 Math.random() to 测试中可以断言给定参数始终返回同一数据，消除随机因素。
11. As a 前端开发者，I want 类型层面的改动通过 `tsc --noEmit` 可检测 to 不引入新的运行时错误类别，纯编译期保护。
12. As a 前端开发者，I want TanStack Router 的 loader 预取覆盖所有有数据依赖的路由 to Dashboard、Posts 列表、Posts 详情三个页面全部受益。

## Implementation Decisions

- **统一 HTTP 客户端**：新增 axios 实例作为共享请求层，封装 baseURL 和统一错误处理。放弃 ky/ofetch/wretch，选择 axios——生态成熟，拦截器模式通用，MSW 兼容无问题。
- **API 层职责边界**：api/ 目录下每个资源模块导出纯函数（返回 Promise），零 React 依赖。api/http-client 提供共享 axios 实例。
- **queryOptions 工厂**：hooks/ 目录下导出 `queryOptions()` 工厂函数，包含 queryKey、queryFn、staleTime。loader 用 `queryClient.ensureQueryData(queryOptions(...))` 预取，hook 用 `useQuery(queryOptions(...))` 消费。queryKey 和 staleTime 单点定义。
- **Dashboard mock 确定性化**：generateMockData 删除 Math.random()，改为 6 组硬编码 fixture（2 metric × 3 timeRange）。每组数据固定不变，便于缓存验证。
- **Category 类型设计**：导出 `const CATEGORIES = ['tech','life','design'] as const`，派生出 `type Category = (typeof CATEGORIES)[number]`。Post.category 和 CATEGORY_LABELS 均锚定该类型。
- **hooks 统一出口**：hooks/index.ts 补全所有 public hook 的 re-export，dashboard 页面改为从 @/hooks 导入。
- **Loader 预取路由**：/posts/、/posts/$id、/dashboard 三个路由定义中增加 loader，通过 Router context 获取 queryClient 调用 ensureQueryData。
- **Router context 扩展**：在 createRouter 时将 queryClient 注入 routerContext，供 loader 访问。

## Testing Decisions

- **测试原则**：只验证外部行为，不测试实现细节。所有测试通过 MSW 在 fetch 层拦截，组件和 hook 对 mock 无感。
- **API 层测试**：在 api/ 函数边界测试——MSW 拦截 → 调用 API 函数 → 断言响应体结构和错误路径。不渲染 React 组件。
- **确定性 mock 测试**：在 Query 缓存行为边界测试——渲染 Dashboard 组件 → 切换 metric/timeRange → 断言同一 queryKey 未触发第二次 MSW handler 调用。
- **类型安全测试**：`tsc --noEmit` 覆盖 Category 类型收窄和 hooks 统一导入。
- **Loader 预取测试**：在 Route + Query 缓存边界测试——MSW setup → 导航到路由 → 断言 query cache 在组件挂载前已有数据，组件首渲 isSuccess=true。
- **已有测试风格参考**：项目配置 Vitest + @testing-library/react + MSW（见 ADR-0001），所有新增测试遵循同样配置，不引入新测试框架。

## Out of Scope

- 不新增 Demo 页面或替换现有页面主角
- 不修改技术栈选型（不引入新依赖，axios 除外）
- 不涉及 E2E / Playwright 测试
- 不修改 Zustand store 的结构或接口
- 不修改 shadcn/ui 组件
- 不引入 SSR

## Further Notes

- CONTEXT.md 无需更新——本次改动不引入新领域术语，全部属于通用编程实践（API 层、HTTP 客户端、loader 预取）。
- ADR 无需新增——所有改动均易逆向（纯重构性质），不构成锁定型架构决策。
- 改动顺序建议：API 层分离（Item 1）作为基础先行，后续 hooks 重构、loader 预取均依赖该层；Category 类型收窄（Item 3）和 hooks 导出（Item 4）为独立项，可与 Item 1 并行；Dashboard mock 确定性化（Item 2）独立无依赖；Router loader 预取（Item 5）依赖 Item 1 和 TanStack Query 集成，放在最后。
