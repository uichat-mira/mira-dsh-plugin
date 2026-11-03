import test from 'node:test'
import assert from 'node:assert/strict'
import { taskSnapshot } from '../lib/task.js'

const repo = 'uichat-mira/folio'
const base = 'repos/' + repo
const encoded = text => ({ type: 'file', encoding: 'base64', content: Buffer.from(text).toString('base64'), sha: 'sha-' + text.length })
function mock({ timeline = [139], prs = {}, checks = [], reviews = [], issueState = 'open', timelineError = false, missingPolicy = false } = {}) {
  return async path => {
    if (path === 'repos/uichat-mira/.github/contents/AGENTS.md?ref=main') return encoded('org rules')
    if (path === base + '/contents/AGENTS.md?ref=dev') {
      if (missingPolicy) throw new Error('GitHub API 404')
      return encoded('repo rules')
    }
    if (path === base + '/issues/124') return { number: 124, title: 'Task', state: issueState, html_url: 'https://github.com/' + repo + '/issues/124', body: 'Work contract' }
    if (path === base + '/issues/124/timeline?per_page=100') {
      if (timelineError) throw new Error('API timeout')
      return timeline.map(n => ({ event: 'cross-referenced', source: { issue: { number: n, repository: { full_name: repo }, pull_request: { url: 'https://api.github.com/' + base + '/pulls/' + n } } } }))
    }
    const pull = path.match(/^repos\/uichat-mira\/folio\/pulls\/(\d+)$/)
    if (pull) {
      const no = Number(pull[1])
      const options = prs[no] || {}
      return { number: no, title: 'PR ' + no, state: options.state ?? 'open', draft: options.draft ?? true,
        merged_at: options.merged ? '2026-11-03' : null, html_url: 'https://github.com/' + repo + '/pull/' + no,
        base: { ref: 'dev', sha: 'basesha' }, head: { ref: 'feat/x', sha: 'headsha-' + no } }
    }
    if (path.includes('/check-runs?')) return { check_runs: checks }
    if (path.includes('/reviews?')) return reviews
    throw new Error('Unexpected URL ' + path)
  }
}

test('Existing Draft PR prevents duplicate implementation', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock())
  assert.equal(x.decision.state, 'draft_pr_exists')
  assert.equal(x.related_prs[0].pr.number, 139)
  assert.equal(x.related_prs[0].pr.head_sha, 'headsha-139')
  assert.equal(x.dispatch_allowed, false)
})
test('Multiple open PRs require reconciliation', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({ timeline: [130, 139, 130] }))
  assert.equal(x.decision.state, 'multiple_open_prs')
  assert.equal(x.related_prs.length, 2)
})
test('Missing timeline cannot be interpreted as no PR', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({ timelineError: true }))
  assert.equal(x.decision.state, 'needs_investigation')
  assert.match(x.warnings.join(' '), /timeline unavailable/i)
  assert.equal(x.dispatch_allowed, false)
})
test('No PR remains a read-only assessment, not permission to dispatch', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({ timeline: [] }))
  assert.equal(x.decision.state, 'no_linked_pr')
  assert.equal(x.dispatch_allowed, false)
})
test('Failed check on existing PR takes precedence over draft', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({ checks: [{ name: 'tests', status: 'completed', conclusion: 'failure' }] }))
  assert.equal(x.decision.state, 'pr_needs_attention')
})
test('Ready PR with passing CI and review on head still requires maintainer', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({
    prs: { 139: { draft: false } },
    checks: [{ name: 'tests', status: 'completed', conclusion: 'success' }],
    reviews: [{ actor: undefined, user: { login: 'reviewer' }, state: 'APPROVED', commit_id: 'headsha-139', submitted_at: '2026-11-03' }],
  }))
  assert.equal(x.decision.state, 'maintainer_assessment') // even an approved current-head PR still needs maintainer acceptance
})
test('Missing repo policy is a verification blocker', async () => {
  const x = await taskSnapshot({ repo, issue: 124 }, mock({ missingPolicy: true }))
  assert.equal(x.decision.state, 'needs_investigation')
})
