import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { runInNewContext } from 'node:vm'

test('compiled DSH client exports sidebar and main-slot registrations', () => {
  const bundle = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
  let registration
  const window = { __ModuleLoader__: { load: spec => { registration = spec } } }
  runInNewContext(bundle, { window }, { timeout: 1500 })
  assert.equal(registration.id, 'mira-dsh-plugin')
  const fakeRequire = name => {
    if (name === 'react') return {}
    if (name === 'react/jsx-runtime') return { jsx: () => ({}), jsxs: () => ({}) }
    throw new Error('Unexpected browser import ' + name)
  }
  const plugin = registration.factory(fakeRequire)
  assert.deepEqual(Array.from(plugin.inject), ['slots'])
  const seats = []
  plugin.apply({ slots: {
    inject: (_name, mount) => mount(),
    register: (spec, component) => { seats.push({ spec, component }); return () => {} },
  } })
  assert.equal(seats.length, 2)
  assert.equal(seats.find(x => x.spec.name === 'main')?.spec.key, 'mira-supa-foreman')
  assert.equal(seats.find(x => x.spec.name === 'sidebar.panellist')?.spec.id, 'mira-supa-foreman')
  assert.equal(seats.find(x => x.spec.name === 'sidebar.panellist')?.spec.label(), '速趴工头')
  assert.match(bundle, /msf-root/)
})
