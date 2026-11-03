import { assertRepo, assertNumber, assertBranch, ghApi, issueContract, prEvidence } from './github.js'

const FAILS = new Set(['failure', 'timed_out', 'cancelled', 'action_required', 'startup_failure'])
const DIRECT_REVIEW = new Set(['APPROVED', 'CHANGES_REQUESTED'])

function reviewSummary(reviews, headSha) {
  if (!Array.isArray(reviews)) return { available: false, error: reviews?.unavailable || 'review lookup failed' }
  const latestByUser = new Map()
  for (const review of reviews) {
    if (!DIRECT_REVIEW.has(review.state) || !review.actor) continue
    const prev = latestByUser.get(review.actor)
    if (!prev || (review.submitted_at || '') > (prev.submitted_at || '')) latestByUser.set(review.actor, review)
  }
  const current = [...latestByUser.values()]
  return {
    available: true,
    submitted: reviews.length,
    approvals: current.filter(x => x.state === 'APPROVED').length,
    changes_requested: current.filter(x => x.state === 'CHANGES_REQUESTED').length,
    // A submitted review against an older SHA is not proof of review on current code.
    approvals_on_head: current.filter(x => x.state === 'APPROVED' && x.commit_id === headSha).length,
  }
}

function checksSummary(checks) {
  if (!Array.isArray(checks)) return { available: false, error: checks?.unavailable || 'checks lookup failed' }
  return {
    available: true, total: checks.length,
    successful: checks.filter(x => x.conclusion === 'success').length,
    skipped: checks.filter(x => x.conclusion === 'skipped').map(x => x.name),
    failed: checks.filter(x => FAILS.has(x.conclusion)).map(x => x.name),
    pending: checks.filter(x => x.status !== 'completed').map(x => x.name),
  }
}

function decision(issueState, refs, warnings) {
  if (issueState !== 'open') return { state: 'issue_not_open', action: 'Issue is not open; do not dispatch work without a new explicit contract.' }
  if (warnings.length) return { state: 'needs_investigation', action: 'Association or evidence retrieval is incomplete; inspect GitHub before dispatching.' }
  const active = refs.filter(x => x.pr.state === 'open')
  if (active.length > 1) return { state: 'multiple_open_prs', action: 'Reconcile concurrent PRs; do not create another worker.' }
  if (active.length === 1) {
    const item = active[0]
    if (!item.checks.available || !item.reviews.available) return { state: 'needs_investigation', action: 'Existing PR evidence is incomplete; inspect it before acting.' }
    if (item.checks.failed.length || item.reviews.changes_requested > 0) return { state: 'pr_needs_attention', action: 'Inspect failed checks or requested changes on the existing PR; do not dispatch a duplicate.' }
    if (item.pr.draft) return { state: 'draft_pr_exists', action: 'Continue/review the existing Draft PR; do not restart implementation.' }
    if (item.checks.pending.length) return { state: 'ci_pending', action: 'Wait for/check active CI on the existing PR; do not dispatch.' }
    if (item.reviews.approvals_on_head === 0) return { state: 'review_pending', action: 'Request independent review on existing PR; do not equate green CI with acceptance.' }
    return { state: 'maintainer_assessment', action: 'Review actual diff, test logs and issue acceptance criteria; maintainer still decides acceptance.' }
  }
  const merged = refs.filter(x => x.pr.merged)
  if (merged.length) return { state: 'merged_pr_issue_open', action: 'A linked PR is merged but Issue remains open; verify outcome, do not restart work.' }
  const closed = refs.filter(x => x.pr.state === 'closed')
  if (closed.length) return { state: 'only_closed_prs', action: 'Inspect why the previous PRs were closed before any new dispatch.' }
  return { state: 'no_linked_pr', action: 'No linked PR found in available GitHub timeline; confirm prerequisites and explicit implementation authorization before dispatch.' }
}

export async function taskSnapshot({ repo, issue, branch = 'dev' }, api = ghApi) {
  const name = assertRepo(repo)
  const number = assertNumber(issue, 'issue')
  const ref = assertBranch(branch)
  const contract = await issueContract({ repo: name, issue: number, branch: ref }, api)
  const warnings = [...contract.warnings]
  let timeline
  try {
    timeline = await api('repos/' + name + '/issues/' + number + '/timeline?per_page=100')
    if (!Array.isArray(timeline)) throw new Error('timeline response was not a list')
  } catch (e) {
    return {
      checked_at: contract.checked_at, repository: name, issue: contract.task,
      policy: { org_sha: contract.org_policy.sha, repo_sha: contract.repo_policy?.sha ?? null, branch: ref },
      related_prs: [], decision: decision(contract.task.state, [], ['Timeline unavailable']),
      warnings: [...warnings, 'GitHub timeline unavailable: ' + e.message],
      dispatch_allowed: false,
    }
  }
  if (timeline.length === 100) warnings.push('Timeline reached 100 events; linkage may be incomplete')
  const numbers = [...new Set(timeline
    .filter(x => x.event === 'cross-referenced' && x.source?.issue?.pull_request)
    .filter(x => x.source.issue.repository?.full_name === name)
    .map(x => x.source.issue.number)
    .filter(x => Number.isSafeInteger(x) && x > 0))]
  if (numbers.length > 10) warnings.push('More than 10 related PRs found; bounded inspection only')
  const results = await Promise.all(numbers.slice(0, 10).map(async pr => {
    try { return await prEvidence({ repo: name, pr }, api) }
    catch (e) { warnings.push('PR #' + pr + ' evidence unavailable: ' + e.message); return null }
  }))
  const prs = results.filter(Boolean).map(e => ({
    pr: e.pr, linked_by: 'GitHub cross-reference event', checks: checksSummary(e.checks),
    reviews: reviewSummary(e.reviews, e.pr.head_sha),
    url: e.pr.url,
  }))
  const result = decision(contract.task.state, prs, warnings)
  return {
    checked_at: new Date().toISOString(),
    repository: name,
    issue: { number, title: contract.task.title, state: contract.task.state, url: contract.task.url },
    policy: { org_sha: contract.org_policy.sha, repo_sha: contract.repo_policy?.sha ?? null, branch: ref },
    related_prs: prs,
    decision: result,
    warnings,
    dispatch_allowed: false,
    instructions: 'Read-only assessment; use mira_issue_contract for full Issue/AGENTS texts. Do not treat this result as implementation, merge, review, release, or closure authorization.',
  }
}
