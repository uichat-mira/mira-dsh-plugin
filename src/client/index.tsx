import { useEffect, useRef, useState, type FormEvent, type CSSProperties } from 'react'
import STYLE from './panel.css?raw'

type Checks = { available: boolean; total?: number; successful?: number; skipped?: string[]; failed?: string[]; pending?: string[]; error?: string }
type Reviews = { available: boolean; submitted?: number; approvals?: number; changes_requested?: number; approvals_on_head?: number; error?: string }
type RelatedPr = { url: string; pr: { number: number; title: string; state: string; draft: boolean; merged: boolean; head_sha: string; base: string }; checks: Checks; reviews: Reviews }
type Snapshot = {
  checked_at: string
  repository: string
  issue: { number: number; title: string; url: string; state: string }
  policy: { org_sha: string; repo_sha: string | null; branch: string }
  decision: { state: string; action: string }
  related_prs: RelatedPr[]
  warnings: string[]
  dispatch_allowed: false
}
type Health = { ok: boolean; version: string; mode: string; project_status: string; superagent: string }

const PANEL = 'mira-supa-foreman'
const STATE: Record<string, { label: string; hint: string }> = {
  draft_pr_exists: { label: '已有 Draft PR', hint: '继续现有实现与审查；禁止重复派工。' },
  review_pending: { label: '等待审查', hint: '已有 PR，独立审查尚未完成。' },
  pr_needs_attention: { label: '需要处理', hint: '检查失败项或已提出的修改要求。' },
  ci_pending: { label: '检查进行中', hint: '等待现有 PR 的检查结果。' },
  maintainer_assessment: { label: '等待维护者判断', hint: '审查证据不等于验收，仍需独立核对。' },
  multiple_open_prs: { label: '多个 PR', hint: '先处理并行 PR 的归属与冲突。' },
  merged_pr_issue_open: { label: 'PR 已合并', hint: '核对工作项结果，不要再次施工。' },
  only_closed_prs: { label: '只有已关闭的 PR', hint: '先核实历史处理结果。' },
  no_linked_pr: { label: '未找到关联 PR', hint: '仍不能推断可以自动施工。' },
  needs_investigation: { label: '证据不完整', hint: '检查数据源、权限和关联关系。' },
  issue_not_open: { label: 'Issue 非开放', hint: '不得未经新授权重复施工。' },
}
const terms = { task: '任务概览', evidence: '验收证据', settings: '连接与限制' } as const

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, { method: 'GET', headers: { 'x-mira-supa-request': '1' }, signal })
  const value = await response.json() as T & { error?: string }
  if (!response.ok) throw new Error(value?.error || '查询失败（HTTP ' + response.status + '）')
  return value
}
function ForemanIcon({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 14.5a8 8 0 0 1 16 0M8 14V9.2m8 4.8V9.2M3 15h18v2H3zM8 20h8" />
  </svg>
}
function Chip({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: 'neutral' | 'warn' | 'good' }) {
  return <span className={'msf-chip msf-' + tone}>{children}</span>
}
function StatusText({ state }: { state: string }) {
  const item = STATE[state]
  return <span>{item?.label ?? state}</span>
}
function Info({ label, value }: { label: string; value: string | number }) {
  return <div className="msf-metric"><div className="msf-muted msf-mini">{label}</div><div className="msf-value">{value}</div></div>
}
function ShortSha({ value }: { value?: string | null }) {
  return <code title={value ?? undefined}>{value ? value.slice(0, 8) : '未知'}</code>
}
function ActionBar({ snapshot }: { snapshot: Snapshot }) {
  const state = STATE[snapshot.decision.state]
  return <section className="msf-action" aria-label="建议操作">
    <div className="msf-kicker">NEXT ACTION / 建议操作</div>
    <div className="msf-action-title">{state?.label ?? snapshot.decision.state}</div>
    <p>{snapshot.decision.action}</p>
    <p className="msf-muted">{state?.hint ?? '请核对真实任务契约。'}</p>
    <div className="msf-actions">
      <a href={snapshot.issue.url} target="_blank" rel="noopener noreferrer" className="msf-btn msf-btn-primary">打开 Issue</a>
      {snapshot.related_prs[0] && <a href={snapshot.related_prs[0].pr.number ? snapshot.related_prs[0].url : snapshot.issue.url}
        target="_blank" rel="noopener noreferrer" className="msf-btn">查看关联 PR</a>}
    </div>
  </section>
}
function Evidence({ snapshot }: { snapshot: Snapshot }) {
  return <div className="msf-stack">
    <div className="msf-headline"><h2>证据不是验收</h2><p>提交、检查与 Review 必须绑定到具体 PR；最终由维护者判断。</p></div>
    {snapshot.related_prs.length === 0 ? <div className="msf-empty">当前可见的 GitHub 时间线中未找到关联 PR。未找到不代表已授权新施工。</div> :
      snapshot.related_prs.map(item => <section className="msf-paper" key={item.pr.number}>
        <div className="msf-flex msf-between msf-wrap">
          <div>
            <div className="msf-kicker">PULL REQUEST #{item.pr.number}</div>
            <h3><a href={item.url} target="_blank" rel="noopener noreferrer">{item.pr.title}</a></h3>
          </div>
          <Chip tone={item.pr.draft ? 'warn' : 'neutral'}>{item.pr.draft ? 'Draft' : item.pr.state}</Chip>
        </div>
        <div className="msf-facts">
          <div><span>目标分支</span><b>{item.pr.base}</b></div>
          <div><span>当前 Head</span><ShortSha value={item.pr.head_sha} /></div>
          <div><span>正式 Review</span><b>{item.reviews.available ? (item.reviews.submitted ?? 0) : '不可用'}</b></div>
          <div><span>当前 Head 批准</span><b>{item.reviews.available ? (item.reviews.approvals_on_head ?? 0) : '不可用'}</b></div>
        </div>
        <div className="msf-checks">
          <div className="msf-kicker">CI / CHECK RUNS</div>
          {item.checks.available ? <>
            <div className="msf-flex msf-wrap msf-gap-sm">
              <Chip tone="good">{item.checks.successful ?? 0} 通过</Chip>
              <Chip>{item.checks.skipped?.length ?? 0} 跳过</Chip>
              {(item.checks.failed?.length ?? 0) > 0 && <Chip tone="warn">{item.checks.failed?.length} 失败</Chip>}
              {(item.checks.pending?.length ?? 0) > 0 && <Chip>{item.checks.pending?.length} 运行中</Chip>}
            </div>
            {(item.checks.failed?.length ?? 0) > 0 && <p className="msf-alert">失败检查：{item.checks.failed?.join('、')}</p>}
            {(item.checks.skipped?.length ?? 0) > 0 && <details><summary>查看跳过的检查</summary><p>{item.checks.skipped?.join('、')}</p></details>}
          </> : <p className="msf-alert">检查数据不可用：{item.checks.error}</p>}
          {!item.reviews.available && <p className="msf-alert">Review 数据不可用：{item.reviews.error}</p>}
          <p className="msf-muted msf-mini">Skipped 不自动视为缺陷；绿灯不代表代码验收。这是 PR Head 的实时证据快照。</p>
        </div>
      </section>)}
  </div>
}
function ProjectStatus() {
  return <div className="msf-facts msf-facts-full">
    <div><span>GitHub Project Status</span><b>未连接 · 不推断</b></div>
    <div><span>Super Agent Worker</span><b>未连接 · 不显示假进度</b></div>
    <div><span>写入与派工</span><b>尚未启用</b></div>
  </div>
}
function ForemanPanel() {
  const [page, setPage] = useState<keyof typeof terms>('task')
  const [repo, setRepo] = useState('uichat-mira/folio')
  const [issue, setIssue] = useState('')
  const [branch, setBranch] = useState('dev')
  const [busy, setBusy] = useState(false)
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [error, setError] = useState('')
  const [health, setHealth] = useState<Health | null>(null)
  const [healthError, setHealthError] = useState('')
  const active = useRef<AbortController | null>(null)
  useEffect(() => () => active.current?.abort(), [])

  async function inspect(event?: FormEvent) {
    event?.preventDefault()
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setBusy(true); setError(''); setSnapshot(null)
    try {
      const params = new URLSearchParams({ repo: repo.trim(), issue: issue.trim(), branch: branch.trim() })
      const result = await getJson<Snapshot>('/mira-supa/api/task?' + params.toString(), controller.signal)
      if (active.current === controller) { setSnapshot(result); setPage('task') }
    } catch (err) {
      if (active.current === controller && !controller.signal.aborted) setError(err instanceof Error ? err.message : String(err))
    } finally {
      if (active.current === controller) setBusy(false)
    }
  }

  useEffect(() => {
    if (page !== 'settings') return
    const controller = new AbortController()
    setHealthError('')
    getJson<Health>('/mira-supa/api/health', controller.signal).then(setHealth).catch(err => {
      if (!controller.signal.aborted) setHealthError(String(err))
    })
    return () => controller.abort()
  }, [page])

  return <div className="msf-root">
    <style>{STYLE}</style>
    <div className="msf-inner">
      <header className="msf-header">
        <div className="msf-brand">
          <div className="msf-brand-icon"><ForemanIcon size={23} /></div>
          <div><div className="msf-kicker">MIRA / SUPA FOREMAN</div><h1>速趴工头</h1></div>
        </div>
        <Chip>只读 · v0.3</Chip>
      </header>
      <div className="msf-intro">任务有来处，施工有去向，交付有证据。</div>
      <nav className="msf-tabs" aria-label="速趴工头">
        {(Object.keys(terms) as Array<keyof typeof terms>).map(key => <button type="button" key={key}
          className={page === key ? 'msf-tab msf-active' : 'msf-tab'} aria-current={page === key ? 'page' : undefined}
          onClick={() => setPage(key)}>{terms[key]}</button>)}
      </nav>

      {page === 'task' && <div className="msf-stack">
        <section className="msf-paper">
          <div className="msf-kicker">INSPECT / 查询任务</div>
          <p className="msf-muted">从 GitHub Issue 出发，自动查找关联 PR 和当前证据。不创建新的任务台账。</p>
          <form className="msf-query" onSubmit={inspect}>
            <label>仓库<input value={repo} onChange={e => setRepo(e.target.value)} required placeholder="uichat-mira/folio" /></label>
            <label>Issue 编号<input value={issue} onChange={e => setIssue(e.target.value)} required
              inputMode="numeric" pattern="[1-9][0-9]*" placeholder="例如 124" /></label>
            <label>分支<input value={branch} onChange={e => setBranch(e.target.value)} required placeholder="dev" /></label>
            <button type="submit" className="msf-btn msf-btn-primary" disabled={busy || !issue.trim()}>{busy ? '正在查询…' : '检查任务'}</button>
          </form>
        </section>
        {error && <div className="msf-alert" role="alert">{error}</div>}
        {snapshot ? <>
          <section className="msf-paper">
            <div className="msf-flex msf-between msf-wrap">
              <div><div className="msf-kicker">ISSUE #{snapshot.issue.number} · {snapshot.issue.state.toUpperCase()}</div><h2>{snapshot.issue.title}</h2></div>
              <Chip tone={snapshot.decision.state.includes('attention') || snapshot.decision.state.includes('investigation') ? 'warn' : 'neutral'}>
                <StatusText state={snapshot.decision.state} />
              </Chip>
            </div>
            <div className="msf-metrics">
              <Info label="关联 PR" value={snapshot.related_prs.length} />
              <Info label="当前分支" value={snapshot.policy.branch} />
              <Info label="Org 规则" value={snapshot.policy.org_sha.slice(0, 8)} />
            </div>
            <p className="msf-muted msf-mini">读取时间：{new Date(snapshot.checked_at).toLocaleString()} · 仓库规则：<ShortSha value={snapshot.policy.repo_sha} /></p>
          </section>
          <ActionBar snapshot={snapshot} />
          {snapshot.warnings.length > 0 && <div className="msf-alert" role="status"><strong>证据缺口</strong><ul>{snapshot.warnings.map((v, i) => <li key={i}>{v}</li>)}</ul></div>}
          <section className="msf-paper"><div className="msf-kicker">SOURCE OF TRUTH / 状态边界</div><ProjectStatus /></section>
          <button className="msf-text-button" type="button" onClick={() => setPage('evidence')}>查看 PR、CI 与 Review 证据 →</button>
        </> : !busy && !error && <div className="msf-empty"><ForemanIcon size={32} /><h2>先给工头一张任务卡</h2><p>输入仓库与 Issue 编号，看看活儿进行到哪一步。现阶段只读，不会派牛马。</p></div>}
      </div>}
      {page === 'evidence' && (snapshot ? <Evidence snapshot={snapshot} /> :
        <div className="msf-empty"><h2>先读取一张任务卡</h2><p>切到「任务概览」查询 Issue，才能看到真实 PR 证据。</p></div>)}
      {page === 'settings' && <div className="msf-stack">
        <section className="msf-paper"><div className="msf-kicker">CONNECTION / 当前连接</div>
          <h2>只读工程伴侣</h2>
          <p className="msf-muted">UI 通过本机 DSH Host 查询 GitHub，不在浏览器保存 Token、密钥或任务副本。</p>
          <div className="msf-facts msf-facts-full">
            <div><span>Host API</span><b>{health ? '已连接 · ' + health.version : healthError ? '不可用' : '检查中'}</b></div>
            <div><span>执行权限</span><b>只读</b></div>
            <div><span>GitHub Project / Super Agent</span><b>未接入</b></div>
          </div>
          {healthError && <p className="msf-alert">{healthError}</p>}
        </section>
        <section className="msf-paper"><div className="msf-kicker">SAFE BY DESIGN / 能力边界</div>
          <ul className="msf-list"><li>任务状态由 Issue / PR / GitHub 规则产生，不猜测 Project Status。</li>
            <li>CI / Review 是证据，不自动算维护者验收。</li>
            <li>没有自动施工、会话暂停、恢复、合并或关闭功能。</li>
            <li>现有 DSH 会话不会因打开此面板被操作。</li></ul>
        </section>
      </div>}
      <footer className="msf-footer">Mira 速趴 · 工头只负责认清现场，真正施工留给后续安全接入。</footer>
    </div>
  </div>
}
export const inject = ['slots']
export function apply(ctx: any): void {
  ctx.slots.inject('main', () => ctx.slots.register({ name: 'main', key: PANEL, inject: () => ({}) },
    () => <ForemanPanel />))
  ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({ name: 'sidebar.panellist', id: PANEL,
    order: 15, label: () => '速趴工头' }, ForemanIcon))
}
