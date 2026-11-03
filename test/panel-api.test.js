import test from 'node:test'
import assert from 'node:assert/strict'
import { registerPanelApi } from '../lib/panel-api.js'

const HOST = '127.0.0.1:3099'
function harness({ host = '127.0.0.1', inspect = async ({ repo, issue, branch }) => ({ repo, issue, branch }) } = {}) {
  let handler
  let disposed = false
  const logs = []
  const ctx = {
    webServer: { host, port: 3099, register: input => {
      assert.equal(input.kind, 'prefix')
      assert.equal(input.path, '/mira-supa')
      handler = input.handler
      return () => { disposed = true }
    } },
    logger: { warn: (...args) => logs.push(args) },
  }
  const dispose = registerPanelApi(ctx, inspect)
  async function request(url, { headers = {}, method = 'GET' } = {}) {
    assert.ok(handler, 'route handler registered')
    let status, body
    const res = { writeHead: code => { status = code }, end: text => { body = text } }
    const req = {
      url,
      method,
      headers: { host: HOST, 'x-mira-supa-request': '1', ...headers },
    }
    await handler(req, res)
    return { status, value: JSON.parse(body) }
  }
  return { request, dispose, logs, get disposed() { return disposed }, hasHandler: Boolean(handler) }
}

test('health and task reads are loopback and GET-only', async () => {
  const t = harness()
  assert.deepEqual((await t.request('/mira-supa/api/health')).value, {
    ok: true, name: 'Mira 速趴工头', version: '0.3.0', mode: 'read-only',
    project_status: 'not-connected', superagent: 'not-connected',
  })
  const query = await t.request('/mira-supa/api/task?repo=uichat-mira%2Ffolio&issue=124&branch=dev')
  assert.equal(query.status, 200)
  assert.deepEqual(query.value, { repo: 'uichat-mira/folio', issue: 124, branch: 'dev' })
  assert.equal((await t.request('/mira-supa/api/task', { method: 'POST' })).status, 404)
  t.dispose()
  assert.equal(t.disposed, true)
})
test('rejects CSRF cross-origin, wrong host and missing panel header', async () => {
  const t = harness()
  for (const headers of [
    { host: 'attacker.invalid' },
    { origin: 'https://attacker.invalid' },
    { 'x-mira-supa-request': undefined },
  ]) assert.equal((await t.request('/mira-supa/api/health', { headers })).status, 403)
})
test('rejects invalid args before any GitHub I/O', async () => {
  let queried = 0
  const t = harness({ inspect: async () => { queried++; return {} } })
  for (const url of [
    '/mira-supa/api/task?repo=evil%2Frepo&issue=124',
    '/mira-supa/api/task?repo=uichat-mira%2Ffolio&issue=-1',
    '/mira-supa/api/task?repo=uichat-mira%2Ffolio&issue=124&branch=..%2Fprod',
    '/mira-supa/api/task?repo=uichat-mira%2Ffolio&issue=124&branch=%2Fprod',
  ]) assert.equal((await t.request(url)).status, 400)
  assert.equal(queried, 0)
})
test('backend lookup errors do not echo host exception details', async () => {
  const t = harness({ inspect: async () => { throw new Error('token SECRET-DO-NOT-LEAK') } })
  const r = await t.request('/mira-supa/api/task?repo=uichat-mira%2Ffolio&issue=124')
  assert.equal(r.status, 502)
  assert.doesNotMatch(JSON.stringify(r.value), /SECRET-DO-NOT-LEAK/)
})
test('non-loopback DSH host does not expose a management API', () => {
  const t = harness({ host: '0.0.0.0' })
  assert.equal(t.hasHandler, false)
  t.dispose()
})
