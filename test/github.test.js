import test from 'node:test'
import assert from 'node:assert/strict'
import { assertRepo, assertNumber, assertBranch, issueContract, prEvidence } from '../lib/github.js'

const file = text => ({ type: 'file', encoding: 'base64', content: Buffer.from(text).toString('base64'), sha: 'abc123' })
const api = async path => {
  if (path === 'repos/uichat-mira/.github/contents/AGENTS.md?ref=main') return file('# Org live')
  if (path === 'repos/uichat-mira/folio/contents/AGENTS.md?ref=dev') return file('# Repo live')
  if (path === 'repos/uichat-mira/folio/issues/23') return { number: 23, title: 'Task', state: 'open', body: 'Acceptance', html_url: 'https://github.com/uichat-mira/folio/issues/23' }
  if (path === 'repos/uichat-mira/folio/pulls/7') return { html_url: 'https://github.com/uichat-mira/folio/pull/7', title: 'P', state: 'open', draft: true, merged_at: null, base: { ref: 'dev', sha: 'bsha' }, head: { ref: 'feat/a', sha: 'hsha' } }
  if (path.includes('/check-runs?')) return { check_runs: [{ name: 'test', status: 'completed', conclusion: 'success', html_url: 'https://example.test' }] }
  if (path.includes('/reviews?')) return [{ user: { login: 'reviewer' }, state: 'APPROVED', submitted_at: '2026-11-03', commit_id: 'hsha' }]
  throw new Error('unexpected path: ' + path)
}

test('strict repository and reference validation', () => {
  assert.equal(assertRepo('uichat-mira/folio'), 'uichat-mira/folio')
  for (const r of ['other/repo', 'uichat-mira/foo/bar', 'uichat-mira/foo; echo bad']) assert.throws(() => assertRepo(r))
  for (const b of ['../main', 'bad?ref=prod', '', 'foo bar']) assert.throws(() => assertBranch(b))
  for (const n of [-1, 0, 'abc', 1.5]) assert.throws(() => assertNumber(n))
})
test('issue tool loads live org and repository policy at selected refs', async () => {
  const result = await issueContract({ repo: 'uichat-mira/folio', issue: 23, branch: 'dev' }, api)
  assert.match(result.org_policy.body, /Org live/)
  assert.match(result.repo_policy.body, /Repo live/)
  assert.equal(result.task.state, 'open')
  assert.match(result.authority, /No permission/)
})
test('missing org policy fails closed', async () => {
  await assert.rejects(issueContract({ repo: 'uichat-mira/folio', issue: 23 }, async path => {
    if (path.includes('/.github/contents/')) throw new Error('GitHub API 404')
    return api(path)
  }), /Organization AGENTS/)
})
test('PR checks never count as maintainer acceptance', async () => {
  const result = await prEvidence({ repo: 'uichat-mira/folio', pr: 7 }, api)
  assert.equal(result.checks[0].conclusion, 'success')
  assert.equal(result.pr.head_sha, 'hsha')
  assert.match(result.verdict, /NOT_EVALUATED/)
})
