import { taskSnapshot } from './task.js'

const PREFIX = '/mira-supa/api/'
const REPO = /^uichat-mira\/[a-zA-Z0-9_.-]+$/

function allowed(headers, port) {
  const host = headers.host
  return (host === 'localhost:' + port || host === '127.0.0.1:' + port)
    && headers['x-mira-supa-request'] === '1'
    && (headers.origin === undefined || headers.origin === 'http://' + host)
}

function response(res, status, body) {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
  })
  res.end(JSON.stringify(body))
}

/** Registers only loopback, same-origin, GET-only panel reads. No mutation routes exist. */
export function registerPanelApi(ctx, inspect = taskSnapshot) {
  if (ctx.webServer.host !== '127.0.0.1') {
    ctx.logger.warn('Mira Supa panel disabled: DSH Web server must bind to 127.0.0.1')
    return () => {}
  }
  return ctx.webServer.register({
    kind: 'prefix',
    path: '/mira-supa',
    handler: async (req, res) => {
      if (!allowed(req.headers, ctx.webServer.port)) {
        response(res, 403, { error: 'Same-origin DSH panel request required' })
        return
      }
      const url = new URL(req.url || '/', 'http://localhost')
      if (req.method !== 'GET' || !url.pathname.startsWith(PREFIX)) {
        response(res, 404, { error: 'Unknown read-only endpoint' })
        return
      }
      if (url.pathname === PREFIX + 'health') {
        response(res, 200, { ok: true, name: 'Mira 速趴工头', version: '0.3.0', mode: 'read-only',
          project_status: 'not-connected', superagent: 'not-connected' })
        return
      }
      if (url.pathname !== PREFIX + 'task') {
        response(res, 404, { error: 'Unknown read-only endpoint' })
        return
      }
      const repo = url.searchParams.get('repo')
      const issue = url.searchParams.get('issue')
      const branch = url.searchParams.get('branch') || 'dev'
      if (!repo || !REPO.test(repo) || !issue || !/^[1-9][0-9]{0,8}$/.test(issue) ||
          !/^[a-zA-Z0-9._/-]{1,100}$/.test(branch) || (branch.includes('..') || branch.startsWith('/') || branch.endsWith('/'))) {
        response(res, 400, { error: 'Enter a valid Mira repository, Issue number and target branch' })
        return
      }
      try {
        const snapshot = await inspect({ repo, issue: Number(issue), branch })
        response(res, 200, snapshot)
      } catch (err) {
        ctx.logger.warn('Mira Supa panel query failed: %s', String(err?.message || err))
        response(res, 502, { error: 'GitHub read failed; check the host logs, account permissions and Organization rules' })
      }
    },
  })
}
