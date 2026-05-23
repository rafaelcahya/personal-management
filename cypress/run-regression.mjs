// cypress/run-regression.mjs
// Runs 4 test groups sequentially, shows output live, saves logs.
// Usage: npm run cy:regression

import { spawn } from 'child_process'
import { mkdirSync, writeFileSync, createWriteStream } from 'fs'
import { join } from 'path'

const logDir = 'cypress/reports/logs'
mkdirSync(logDir, { recursive: true })

const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')
writeFileSync(join(logDir, 'run-timestamp.txt'), timestamp, 'utf8')

const groups = [
  { name: 'api-auth',  spec: 'cypress/e2e/api-auth/**/*.cy.js' },
  { name: 'auth',      spec: 'cypress/e2e/auth/**/*.cy.js' },
  { name: 'dashboard', spec: 'cypress/e2e/inventory_management/dashboard/**/*.cy.js' },
  { name: 'product',   spec: 'cypress/e2e/inventory_management/product/**/*.cy.js' },
  { name: 'running',   spec: 'cypress/e2e/running/**/*.cy.js' },
]

function runGroup(group) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(44)}`)
    console.log(`  GROUP: ${group.name.toUpperCase()}`)
    console.log(`${'─'.repeat(44)}\n`)

    const log = createWriteStream(join(logDir, `${group.name}.log`), { encoding: 'utf8' })
    const proc = spawn('npx', ['cypress', 'run', '--spec', group.spec], {
      shell: true,
      stdio: ['inherit', 'pipe', 'pipe'],
    })

    proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); log.write(chunk) })
    proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); log.write(chunk) })

    proc.on('close', (code) => {
      log.end()
      const label = code === 0 ? '✓ PASSED' : '✗ HAS FAILURES'
      console.log(`\n  ${group.name}: ${label}`)
      resolve()
    })
  })
}

console.log(`\n${'='.repeat(44)}`)
console.log(`  REGRESSION RUN — ${timestamp}`)
console.log(`${'='.repeat(44)}`)

for (const group of groups) {
  await runGroup(group)
}

console.log(`\n${'='.repeat(44)}`)
console.log(`  DONE. Paste results into Claude:`)
console.log(`  ! npm run cy:summary`)
console.log(`${'='.repeat(44)}\n`)
