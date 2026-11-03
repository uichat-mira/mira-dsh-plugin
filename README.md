# Mira 速趴工头 · Mira Supa Foreman

**DeepSeek Harness 的工程协作工作台**。当前版本 v0.3.0 是可运行的**只读 UI 预览**，不是 DeepSeek 官方产品，也没有自动施工能力。

## v0.3.0 已实现

- **原生 DSH UI**：左侧「速趴工头」入口，任务概览、验收证据、连接与限制三个页面。
- **任务查询**：输入 `uichat-mira/*` 仓库、Issue 号、目标分支，实时读取组织与仓库约束、Issue、GitHub 关联 PR、检查及 Review。
- **任务判断**：已有 Draft PR、CI 问题、Review 待办、并行 PR、缺失证据等情况给出保守建议；不重复派工。
- **PR 证据**：显示当前 HEAD SHA、base、成功/失败/跳过/等待中的检查数、已提交 Review 与当前 HEAD 批准数。
- **只读 Host API**：`GET /mira-supa/api/health`、`GET /mira-supa/api/task`。仅限 loopback，同源且附带面板请求头；**没有任何写入 API**。
- 仍保留 DSH 对话工具 `mira_task`、`mira_issue_contract`、`mira_pr_evidence` 与 Shell CLI `mira-task inspect`。

**不能做的事**：派工、暂停、恢复、合并 PR、关闭 Issue、发布、调整 GitHub Project。GitHub Project 正式 Status 和 Super Agent Executor 运行状态均未接入；面板明确标示「未连接」，不会借 GitHub 活动推断它们。

## 开发与验证

要求：Node.js 22.19+ 或 24+、pnpm、DSH 0.2.1 兼容版本、可只读访问对应仓库的 `gh` CLI。

```bash
pnpm install --frozen-lockfile
pnpm run check
```

`check` 包括 TypeScript 类型校验、构建 DSH 浏览器模块、Node 测试、主入口语法检查。

> 浏览器模块通过 DSH 的 `window.__ModuleLoader__` 加载，导出 `./client`，利用 DSH 的 `sidebar.panellist` 与 `main` Slots 注册。React 由 DSH 客户端提供，CSS 使用 DSH 主题变量。不要将其当作普通静态 HTML 网站。

**隔离环境验收**（不要触碰正在施工的 Desktop Profile）：

```bash
export DSH_HOME="$HOME/.dsh-supa-poc"
dsh --profile mira-supa-poc --from-default-profile web --dump-config >/dev/null
dsh plugin --profile mira-supa-poc add "link:$PWD"
dsh --profile mira-supa-poc --no-open --port 3113
```

上面的 `--from-default-profile` 只用于首次创建新的隔离 Profile；不能对已有 Profile 重复执行，否则会覆盖其配置。

启动后在该隔离 Web 界面中打开「速趴工头」，输入 `uichat-mira/folio`、Issue `124`、分支 `dev`；应看到 PR #139（依赖当时的实时状态）。真实运行测试不应修改 GitHub。

## 安全与工程边界

- 始终从当前 `uichat-mira/.github@main/AGENTS.md` 读取组织规则，不用本地缓存冒充当前规则。
- Issue 是任务契约，GitHub Project Status 是管理状态，CI 与 Review 是证据；这些不能互相代替。
- Header 校验阻止普通跨站调用；本机服务仅监听 `127.0.0.1`；所有 API 响应 `no-store`。
- 无 GitHub Token 写入浏览器或插件文件，不持久化任务快照。
- 缺少 GitHub 权限、失败的请求、不可用的历史信息均显示明确缺口。
- 安装在已有 Desktop 前，请先结束当前运行的 Agent Session；本分支从未重启或热改正在工作的 Desktop。

## 路线图

- **v0.3**：可审查的原生只读 UI（本分支）。
- **v0.4**：独立 Profile + 授权的 Super Agent Router/Worker 状态与恢复。需要专用 GitHub Agent 身份和权限隔离，未交付。
- **正式发行**：用户确定的包名 `@uichat-mira/dsh-mira-supa-foreman` 及 GitHub 仓库迁移计划另行执行；当前技术包名保留以避免干扰正在使用的 DSH 链接安装。

当前插件仍标记 `private: true`，没有发布 npm，没有启用自动施工。
