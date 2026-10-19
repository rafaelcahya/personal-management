// cypress/run-regression.mjs
// Runs every spec group sequentially (headed Chrome), shows output live, saves logs.
// Usage: npm run cy:regression            full run
//        node cypress/run-regression.mjs --dry-run   print groups + spec counts, launch nothing
//
// RATE LIMIT: the Running specs hit the sync rate-limit tier (15 requests per
// hour per user, kept in dev-server memory). Do one full run per hour at most;
// a second run inside the hour fails with 429s that are not real regressions.

import { spawn } from 'child_process'
import { mkdirSync, writeFileSync, createWriteStream, globSync } from 'fs'
import { join } from 'path'

const dryRun = process.argv.includes('--dry-run')

const logDir = 'cypress/reports/logs'
const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ')

const groups = [
  { name: 'auth', spec: 'cypress/e2e/auth/**/*.cy.js' },
  { name: 'home', spec: 'cypress/e2e/home/**/*.cy.js' },
  { name: 'inventory-management', spec: 'cypress/e2e/inventory-management/**/*.cy.js' },
  { name: 'landing-page', spec: 'cypress/e2e/landing_page/**/*.cy.js' },
  { name: 'notifications', spec: 'cypress/e2e/notifications/**/*.cy.js' },
  { name: 'running', spec: 'cypress/e2e/running/**/*.cy.js' },
  { name: 'settings', spec: 'cypress/e2e/settings/**/*.cy.js' },
  { name: 'trading', spec: 'cypress/e2e/trading/**/*.cy.js' },
  { name: 'trading-management', spec: 'cypress/e2e/trading_management/**/*.cy.js' },
]

for (const group of groups) {
  group.files = globSync(group.spec).map((f) => f.replace(/\\/g, '/'))
}

const empty = groups.filter((g) => g.files.length === 0)

// Catches a new spec folder that nobody added to `groups`.
const covered = new Set(groups.flatMap((g) => g.files))
const orphans = globSync('cypress/e2e/**/*.cy.js')
  .map((f) => f.replace(/\\/g, '/'))
  .filter((f) => !covered.has(f))

function printPlan() {
  console.log('\nGroup                  Specs')
  console.log('-'.repeat(32))
  for (const g of groups) {
    console.log(`${g.name.padEnd(22)} ${String(g.files.length).padStart(5)}${g.files.length === 0 ? '   <-- NO MATCH' : ''}`)
  }
  console.log('-'.repeat(32))
  console.log(`${'total'.padEnd(22)} ${String(covered.size).padStart(5)}`)
  for (const g of empty) {
    console.error(`\nERROR: group "${g.name}" matched 0 spec files for pattern ${g.spec}`)
  }
  for (const f of orphans) {
    console.error(`ERROR: spec not covered by any group: ${f}`)
  }
}

function runGroup(group) {
  return new Promise((resolve) => {
    console.log(`\n${'─'.repeat(44)}`)
    console.log(`  GROUP: ${group.name.toUpperCase()}  (${group.files.length} specs)`)
    console.log(`${'─'.repeat(44)}\n`)

    const log = createWriteStream(join(logDir, `${group.name}.log`), { encoding: 'utf8' })
    const proc = spawn(
      'npx',
      [
        'cypress', 'run',
        '--config-file=cypress.config.js',
        '--headed',
        '--browser', 'chrome',
        '--spec', `"${group.spec}"`,
      ],
      { shell: true, stdio: ['inherit', 'pipe', 'pipe'] },
    )

    proc.stdout.on('data', (chunk) => { process.stdout.write(chunk); log.write(chunk) })
    proc.stderr.on('data', (chunk) => { process.stderr.write(chunk); log.write(chunk) })

    proc.on('close', (code) => {
      log.end()
      const label = code === 0 ? '✓ PASSED' : '✗ HAS FAILURES'
      console.log(`\n  ${group.name}: ${label}`)
      resolve(code === 0)
    })
  })
}

console.log(`\n${'='.repeat(44)}`)
console.log(`  REGRESSION ${dryRun ? 'DRY RUN' : 'RUN'} — ${timestamp}`)
console.log(`${'='.repeat(44)}`)
printPlan()

if (dryRun) {
  process.exit(empty.length > 0 || orphans.length > 0 ? 1 : 0)
}

mkdirSync(logDir, { recursive: true })
writeFileSync(join(logDir, 'run-timestamp.txt'), timestamp, 'utf8')

let failed = empty.length > 0 || orphans.length > 0
for (const group of groups) {
  if (group.files.length === 0) continue
  if (!(await runGroup(group))) failed = true
}

console.log(`\n${'='.repeat(44)}`)
console.log(failed ? '  DONE WITH PROBLEMS (failures or unmatched patterns above).' : '  DONE. All groups passed.')
console.log(`  Paste results into Claude:`)
console.log(`  ! npm run cy:summary`)
console.log(`${'='.repeat(44)}\n`)

process.exit(failed ? 1 : 0)
