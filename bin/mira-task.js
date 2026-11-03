#!/usr/bin/env node
import { taskSnapshot } from '../lib/task.js'

const HELP = `Usage: mira-task inspect <uichat-mira/repo> <issue-number> [--branch <ref>]

Read-only task inspection for DeepSeek Harness / Super Agent workers.
Only accesses live GitHub API via gh CLI; never starts work or changes repository state.`

function parse(args) {
  if (args.length === 0 || ['-h', '--help', 'help'].includes(args[0])) return null
  if (args[0] !== 'inspect') throw new Error('Expected the inspect subcommand')
  if (args.length !== 3 && args.length !== 5) throw new Error('Expected repository, issue number and optional --branch')
  const [_, repo, issue, flag, branch] = args
  if (args.length === 5 && flag !== '--branch') throw new Error('Unknown option; expected --branch')
  if (!/^[1-9][0-9]*$/.test(issue)) throw new Error('Issue must be a positive integer')
  return { repo, issue: Number(issue), branch: branch ?? 'dev' }
}

try {
  const params = parse(process.argv.slice(2))
  if (!params) {
    process.stdout.write(HELP + '\n')
  } else {
    const snapshot = await taskSnapshot(params)
    process.stdout.write(JSON.stringify(snapshot, null, 2) + '\n')
    if (snapshot.decision.state === 'needs_investigation') process.exitCode = 2
  }
} catch (error) {
  process.stderr.write('mira-task: ' + String(error?.message || error) + '\n' + HELP + '\n')
  process.exitCode = 2
}
