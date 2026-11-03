import { defineTool } from '@deepseek-ai/dsh-tools'
import { issueContract, prEvidence } from './lib/github.js'
import { taskSnapshot } from './lib/task.js'

export const name = 'mira-dsh-contract'
export const inject = ['tools']

const textTool = (name, description, parameters, execute) => defineTool({
  name, description, parameters,
  output: { schema: { type: 'string' }, render: (_args, value) => [{ type: 'text', text: value }] },
  async execute(args) {
    try { return JSON.stringify(await execute(args), null, 2) }
    catch (e) { return JSON.stringify({ ok: false, error: String(e?.message || e) }) }
  },
})

export function apply(ctx) {
  ctx.tools.register(textTool('mira_task',
    'Inspect a Mira Issue with live Organization/repository policies, GitHub cross-referenced PRs, their CI and reviews; choose a safe next action. Read-only; NEVER dispatch a worker or assume permission to merge/close.',
    { repo: { type: 'string', required: true, description: 'Full repo, e.g. uichat-mira/folio' },
      issue: { type: 'number', required: true, description: 'GitHub Issue number' },
      branch: { type: 'string', description: 'Target branch/ref; defaults to dev' } },
    taskSnapshot))
  ctx.tools.register(textTool('mira_issue_contract',
    'Read a uichat-mira GitHub Issue and the CURRENT main organization AGENTS.md plus the target repository AGENTS.md. Read-only. Use before engineering decisions; never infer mutation permissions.',
    { repo: { type: 'string', required: true, description: 'Full repo, e.g. uichat-mira/folio' },
      issue: { type: 'number', required: true, description: 'GitHub Issue number' },
      branch: { type: 'string', description: 'Target branch/ref; defaults to dev' } },
    issueContract))
  ctx.tools.register(textTool('mira_pr_evidence',
    'Read current PR commit, check runs, and submitted reviews for a uichat-mira repository. Evidence only; NOT acceptance, merge, or closure authority.',
    { repo: { type: 'string', required: true, description: 'Full repo, e.g. uichat-mira/folio' },
      pr: { type: 'number', required: true, description: 'Pull request number' } },
    prEvidence))
  ctx.logger.info('mira-dsh-contract read-only tools registered')
}
