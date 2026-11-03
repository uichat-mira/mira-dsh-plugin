import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig } from 'tsdown'

// Match DSH's browser module-loader contract and keep React provided by the DSH client.
const raw = {
  name: 'raw',
  resolveId: (source: string, importer?: string) => source.endsWith('?raw') && importer
    ? resolve(dirname(importer), source) : undefined,
  load: (id: string) => id.endsWith('?raw')
    ? { code: 'export default ' + JSON.stringify(readFileSync(id.slice(0, -4), 'utf8')), moduleType: 'js' as const }
    : undefined,
}

export default defineConfig({
  entry: { client: 'src/client/index.tsx' },
  outDir: 'lib',
  format: 'cjs',
  platform: 'browser',
  dts: false,
  clean: false,
  plugins: [raw],
  deps: { neverBundle: ['react', 'react/jsx-runtime', 'react-dom'] },
  outputOptions: {
    entryFileNames: 'client.js',
    banner: 'window.__ModuleLoader__.load({ id: "mira-dsh-plugin", factory: (require) => {',
    footer: 'return module.exports; } });',
    intro: 'var module = { exports: {} }; var exports = module.exports;',
  },
})
