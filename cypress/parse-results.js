// cypress/parse-results.js
// Reads log files and prints compact markdown summary for Claude.
// Usage: ! npm run cy:summary  (the ! sends output into the conversation)

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const logDir = 'cypress/reports/logs'
const groups = ['api-auth', 'auth', 'dashboard', 'product', 'running']

function stripAnsi(text) {
  return text.replace(/\x1B\[[\d;]*[A-Za-z]/g, '').replace(/\x1B\][\d;]*[^\x07]*\x07/g, '')
}

function getStat(lines, label) {
  const match = lines.find((l) => new RegExp(`^\\s*${label}:\\s+(\\d+)`).test(l))
  const m = match?.match(/(\d+)/)
  return m ? parseInt(m[1]) : 0
}

const tsFile = join(logDir, 'run-timestamp.txt')
const runDate = existsSync(tsFile)
  ? readFileSync(tsFile, 'utf8').trim()
  : new Date().toISOString().slice(0, 16).replace('T', ' ')

const out = [
  '# Cypress Regression Run',
  `**Date:** ${runDate}`,
  '**Scope:** api-auth, auth, dashboard, product, running',
  '',
  '---',
  '',
]

let grandTotal = 0,
  grandPassed = 0,
  grandFailed = 0,
  grandSkipped = 0

for (const group of groups) {
  out.push(`## GROUP: ${group.toUpperCase()}`, '')

  const logFile = join(logDir, `${group}.log`)
  if (!existsSync(logFile)) {
    out.push(`_Log not found — run \`npm run cy:regression\` first._`, '', '---', '')
    continue
  }

  const lines = readFileSync(logFile, 'utf8').split('\n').map(stripAnsi)

  // ── Spec results table ──────────────────────────────────────────────────
  const table = []
  let inTable = false
  for (const line of lines) {
    if (/Run Finished|Spec\s+Tests\s+Passing/.test(line)) inTable = true
    if (inTable) {
      table.push(line)
      if (table.length > 2 && /All specs passed|spec.*failed|\d+\s+passing/.test(line)) {
        table.push('')
        break
      }
    }
  }
  if (table.length) out.push('### Spec Results', '```', ...table, '```', '')

  // ── Summary numbers ─────────────────────────────────────────────────────
  const tests = getStat(lines, 'Tests')
  const passing = getStat(lines, 'Passing')
  const failing = getStat(lines, 'Failing')
  const pending = getStat(lines, 'Pending')
  const skipped = getStat(lines, 'Skipped')
  const rate = tests > 0 ? ((passing / tests) * 100).toFixed(1) : '0'
  const status = failing === 0 ? '✅ PASS' : '❌ FAIL'

  out.push(
    '### Summary',
    '| Tests | Passed | Failed | Pending | Skipped | Pass% | Status |',
    '|-------|--------|--------|---------|---------|-------|--------|',
    `| ${tests} | ${passing} | ${failing} | ${pending} | ${skipped} | ${rate}% | ${status} |`,
    ''
  )

  grandTotal += tests
  grandPassed += passing
  grandFailed += failing
  grandSkipped += skipped

  // ── Failure details ─────────────────────────────────────────────────────
  if (failing > 0) {
    const failLines = []
    let inFail = false,
      count = 0
    for (const line of lines) {
      if (/^\s+\d+\)\s+\S/.test(line)) {
        inFail = true
        count++
        if (count <= 30) failLines.push(line)
      } else if (inFail) {
        if (
          /(AssertionError|CypressError|Error:|expected |Timed out|TypeError|not a function|Cannot read)/.test(
            line
          )
        ) {
          if (count <= 30) failLines.push(line)
        } else if (!line.trim()) {
          inFail = false
          if (count <= 30) failLines.push('')
        }
      }
    }
    if (count > 30)
      failLines.push(`... (${count - 30} more — see cypress/reports/logs/${group}.log)`)
    out.push('### Failures', '```', ...failLines, '```', '')
  }

  out.push('---', '')
}

// ── Grand total ─────────────────────────────────────────────────────────────
const grandRate = grandTotal > 0 ? ((grandPassed / grandTotal) * 100).toFixed(1) : '0'
const grandStatus = grandFailed === 0 ? '✅ ALL PASS' : '⚠️ HAS FAILURES'

out.push(
  '## GRAND TOTAL',
  '',
  '| Tests | Passed | Failed | Skipped | Pass% | Status |',
  '|-------|--------|--------|---------|-------|--------|',
  `| ${grandTotal} | ${grandPassed} | ${grandFailed} | ${grandSkipped} | ${grandRate}% | ${grandStatus} |`,
  '',
  '_Logs: cypress/reports/logs/{group}.log_'
)

console.log(out.join('\n'))
