import test from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'

const entry = new URL('../bin/mira-task.js', import.meta.url).pathname
function cli(...args) {
  return spawnSync(process.execPath, [entry, ...args], { encoding: 'utf8', timeout: 5000 })
}
test('CLI reports read-only usage', () => {
  const r = cli('--help')
  assert.equal(r.status, 0)
  assert.match(r.stdout, /read-only/i)
  assert.match(r.stdout, /inspect/)
})
test('CLI rejects unauthorized organization before any GitHub call', () => {
  const r = cli('inspect', 'unrelated/repo', '124')
  assert.equal(r.status, 2)
  assert.match(r.stderr, /Only explicitly named/)
})
test('CLI rejects invalid argument shapes', () => {
  assert.equal(cli('inspect', 'uichat-mira/folio', '-1').status, 2)
  assert.equal(cli('inspect', 'uichat-mira/folio', '124', '--unknown', 'dev').status, 2)
})
