import { promisify } from 'node:util'
import { execFile } from 'node:child_process'
import { existsSync } from 'node:fs'

const exec = promisify(execFile)
const ghBinary = process.platform === 'darwin' && existsSync('/opt/homebrew/bin/gh') ? '/opt/homebrew/bin/gh' : 'gh'
const ORG = 'uichat-mira'

export function assertRepo(repo) {
  if (typeof repo !== 'string' || !/^uichat-mira\/[A-Za-z0-9_.-]+$/.test(repo)) {
    throw new Error('Only explicitly named uichat-mira repositories are allowed')
  }
  return repo
}

export function assertNumber(number, kind = 'item') {
  const parsed = Number(number)
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error('Invalid ' + kind + ' number')
  return parsed
}

export function assertBranch(branch) {
  if (typeof branch !== 'string' || !/^[A-Za-z0-9._/-]{1,100}$/.test(branch) || branch.includes('..') || branch.startsWith('/') || branch.endsWith('/')) {
    throw new Error('Invalid branch/ref')
  }
  return branch
}

export async function ghApi(path) {
  if (typeof path !== 'string' || !path.startsWith('repos/uichat-mira/')) throw new Error('Disallowed GitHub API request')
  try {
    const { stdout } = await exec(ghBinary, ['api', path], {
      encoding: 'utf8', timeout: 20000, maxBuffer: 5 * 1024 * 1024,
      env: { ...process.env, GH_PROMPT_DISABLED: '1', GIT_TERMINAL_PROMPT: '0' },
    })
    return JSON.parse(stdout)
  } catch (error) {
    const status = /404|Not Found/.test(String(error?.stderr || error?.message)) ? '404' : 'request_failed'
    throw new Error('GitHub API ' + status + ' for ' + path.split('?')[0])
  }
}

export async function getContent(api, repo, path, ref) {
  try {
    const payload = await api('repos/' + repo + '/contents/' + path + '?ref=' + encodeURIComponent(ref))
    if (payload.type !== 'file' || payload.encoding !== 'base64' || typeof payload.content !== 'string') {
      throw new Error('Unsupported content encoding')
    }
    return { path, ref, sha: payload.sha, text: Buffer.from(payload.content.replace(/\s/g, ''), 'base64').toString('utf8') }
  } catch (error) {
    if (/404/.test(String(error.message))) return null
    throw error
  }
}

function limited(text, chars = 40000) {
  return text.length <= chars ? text : text.slice(0, chars) + '\n[TRUNCATED; review source directly]'
}

export async function issueContract({ repo, issue, branch = 'dev' }, api = ghApi) {
  assertRepo(repo)
  const issueNo = assertNumber(issue, 'issue')
  const ref = assertBranch(branch)
  const [org, local, item] = await Promise.all([
    getContent(api, ORG + '/.github', 'AGENTS.md', 'main'),
    getContent(api, repo, 'AGENTS.md', ref),
    api('repos/' + repo + '/issues/' + issueNo),
  ])
  if (!org) throw new Error('Organization AGENTS.md unavailable; stop rather than fall back to memory')
  if (item.pull_request) throw new Error('This number is a PR, not an Issue')
  return {
    checked_at: new Date().toISOString(),
    source: 'live GitHub API (read-only)',
    repository: repo,
    task: { number: item.number, url: item.html_url, title: item.title, state: item.state, body: limited(item.body ?? '') },
    org_policy: { url: 'https://github.com/uichat-mira/.github/blob/main/AGENTS.md', sha: org.sha, body: limited(org.text) },
    repo_policy: local ? { url: 'https://github.com/' + repo + '/blob/' + encodeURIComponent(ref) + '/AGENTS.md', ref, sha: local.sha, body: limited(local.text) } : null,
    warnings: local ? [] : ['Repository AGENTS.md not found at target ref; check applicable instructions before implementation'],
    authority: 'Read-only context. No permission to create issues, merge, close, deploy, release or self-accept is implied.',
  }
}

export async function prEvidence({ repo, pr }, api = ghApi) {
  assertRepo(repo)
  const number = assertNumber(pr, 'PR')
  const p = await api('repos/' + repo + '/pulls/' + number)
  const [runs, reviews] = await Promise.all([
    api('repos/' + repo + '/commits/' + p.head.sha + '/check-runs?per_page=100').catch(e => ({ error: e.message })),
    api('repos/' + repo + '/pulls/' + number + '/reviews?per_page=100').catch(e => ({ error: e.message })),
  ])
  return {
    checked_at: new Date().toISOString(),
    repository: repo,
    pr: { number, url: p.html_url, title: p.title, state: p.state, draft: p.draft, merged: Boolean(p.merged_at), base: p.base.ref, base_sha: p.base.sha, head: p.head.ref, head_sha: p.head.sha },
    checks: runs.error ? { unavailable: runs.error } : (runs.check_runs ?? []).map(x => ({ name: x.name, status: x.status, conclusion: x.conclusion, html_url: x.html_url })),
    reviews: reviews.error ? { unavailable: reviews.error } : reviews.map(x => ({ actor: x.user?.login, state: x.state, submitted_at: x.submitted_at, commit_id: x.commit_id })),
    verdict: 'NOT_EVALUATED — checks and reviews are evidence, not maintainer acceptance',
  }
}
