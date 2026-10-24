// Runs the Next dev server and the Inngest Dev Server together, so background jobs work locally.
// Plain Node on purpose: no extra dependency, and it works the same on Windows, macOS and Linux.
import { spawn, spawnSync } from 'node:child_process'

const isWindows = process.platform === 'win32'

const processes = [
  { name: 'next', command: 'npm run dev' },
  { name: 'inngest', command: 'npx inngest-cli@latest dev -u http://localhost:3000/api/inngest' },
]

const children = processes.map(({ name, command }) => {
  // detached gives each child its own process group on POSIX so the whole tree can be killed
  const child = spawn(command, { shell: true, stdio: 'inherit', detached: !isWindows })
  child.on('exit', (code) => {
    console.log(`[dev:all] ${name} stopped${code ? ` (exit ${code})` : ''}`)
    shutdown(code ?? 0)
  })
  return child
})

let stopping = false

function killTree(child) {
  if (child.exitCode !== null || child.pid === undefined) return
  if (isWindows) {
    spawnSync('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' })
  } else {
    try {
      process.kill(-child.pid, 'SIGTERM')
    } catch {
      // already gone
    }
  }
}

function shutdown(code) {
  if (stopping) return
  stopping = true
  children.forEach(killTree)
  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
