// cypress/coverage-report.mjs
// API coverage gaps per module: route.js -> registered in app-constants? -> has a Cypress command? -> used in a spec?
// Usage: npm run cy:coverage                 summary table + unregistered routes
//        node cypress/coverage-report.mjs --gaps       also list routes with no command / no test
//        node cypress/coverage-report.mjs --it-counts  also print it() count per spec (API vs UI)
//        node cypress/coverage-report.mjs --strict     exit 1 when any route is unregistered
//
// Matching is by path with dynamic segments removed ([id] in routes, :id in constants),
// so /product/[id] and "/api/inventory/v1/product" count as the same endpoint. A command
// is linked to a route through the constants it references (direct, via a const alias,
// or via a destructured group); a test is any spec that calls such a command or
// references the constant directly. It is a heuristic: read "no test" as "worth checking".

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, relative } from 'path'

const args = new Set(process.argv.slice(2))
const root = process.cwd()
const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

function walk(dir, match, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, match, out)
    else if (match(p)) out.push(p)
  }
  return out
}

const posix = (p) => relative(root, p).replace(/\\/g, '/')
const normalize = (url) =>
  url
    .split('?')[0]
    .split('/')
    .filter((s) => s && !s.startsWith('[') && !s.startsWith(':'))
    .join('/')

// ---- routes
const routes = walk(join(root, 'app/api'), (p) => p.endsWith('route.js')).map((file) => {
  const src = readFileSync(file, 'utf8')
  const url = '/' + posix(file).replace(/^app\//, '').replace(/\/route\.js$/, '')
  const methods = new Set()
  for (const m of METHODS) {
    if (new RegExp(`export\\s+(?:async\\s+)?function\\s+${m}\\b|export\\s+const\\s+${m}\\b`).test(src)) methods.add(m)
  }
  for (const block of src.matchAll(/export\s*\{([^}]*)\}/g)) {
    for (const m of METHODS) if (new RegExp(`\\b${m}\\b`).test(block[1])) methods.add(m)
  }
  return { url, norm: normalize(url), methods: [...methods], module: url.split('/')[2] }
})

// ---- constants
const constants = JSON.parse(readFileSync(join(root, 'cypress/fixtures/app-constants.json'), 'utf8')).endpoints
const constByNorm = new Map() // norm -> ['group.key']
const normOfConst = new Map() // 'group.key' -> norm
for (const [group, keys] of Object.entries(constants)) {
  if (typeof keys !== 'object') continue
  for (const [key, value] of Object.entries(keys)) {
    if (typeof value !== 'string' || !value.startsWith('/api')) continue
    const norm = normalize(value)
    normOfConst.set(`${group}.${key}`, norm)
    if (!constByNorm.has(norm)) constByNorm.set(norm, [])
    constByNorm.get(norm).push(`${group}.${key}`)
  }
}

// ---- constant references inside one source text
function constantRefs(text, declText = text) {
  const refs = new Set()
  const add = (g, k) => { if (normOfConst.has(`${g}.${k}`)) refs.add(`${g}.${k}`) }

  for (const m of text.matchAll(/endpoints\.(\w+)\.(\w+)/g)) add(m[1], m[2])

  const groupAlias = new Map() // alias -> group
  const keyAlias = new Map() // alias -> 'group.key'
  for (const m of declText.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\w+\.)?(?:constants\.)?endpoints\.(\w+)(?:\.(\w+))?\s*(?:[;,]|\r?\n|$)/g)) {
    if (m[3]) keyAlias.set(m[1], `${m[2]}.${m[3]}`)
    else groupAlias.set(m[1], m[2])
  }
  for (const m of declText.matchAll(/(?:const|let|var)\s*\{([^}]*)\}\s*=\s*(?:constants\.)?endpoints\.(\w+)\s*(?:;|\r?\n|$)/g)) {
    for (const part of m[1].split(',')) {
      const [k, alias] = part.split(':').map((s) => s.trim())
      if (k) keyAlias.set(alias || k, `${m[2]}.${k}`)
    }
  }
  for (const [alias, ref] of keyAlias) {
    const declLine = new RegExp(`^\\s*(?:const|let|var)\\s+${alias}\\b.*$`, 'gm')
    if (new RegExp(`\\b${alias}\\b`).test(text.replace(declLine, ''))) refs.add(ref)
  }
  for (const [alias, group] of groupAlias) {
    for (const m of text.matchAll(new RegExp(`\\b${alias}\\.(\\w+)`, 'g'))) add(group, m[1])
    for (const m of text.matchAll(new RegExp(`\\b${alias}\\[\\s*['"](\\w+)['"]\\s*\\]`, 'g'))) add(group, m[1])
  }
  return refs
}

// hardcoded '/api/...' strings (older commands and some specs skip app-constants)
function urlLiterals(text) {
  const out = new Set()
  for (const m of text.matchAll(/['"`](\/api\/[^'"`\s]*)['"`]/g)) {
    const norm = normalize(m[1].replace(/\$\{[^}]*\}/g, ':x'))
    if (norm) out.add(norm)
  }
  return out
}
const normsOf = (refs) => new Set([...refs].map((r) => normOfConst.get(r)))

// ---- commands
const commandFiles = walk(join(root, 'cypress/support'), (p) => p.endsWith('.js') || p.endsWith('.ts'))
const commands = [] // { name, file, refs:Set }
for (const file of commandFiles) {
  const text = readFileSync(file, 'utf8')
  const starts = [...text.matchAll(/Cypress\.Commands\.add\(\s*['"`](\w+)['"`]/g)]
  starts.forEach((m, i) => {
    const body = text.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : text.length)
    const refs = constantRefs(body, text.slice(0, starts[0].index))
    const norms = normsOf(refs)
    for (const n of urlLiterals(body)) norms.add(n)
    commands.push({ name: m[1], file: posix(file), norms })
  })
}

// ---- specs
const specFiles = walk(join(root, 'cypress/e2e'), (p) => p.endsWith('.cy.js'))
const specTexts = specFiles.map((f) => ({ file: posix(f), text: readFileSync(f, 'utf8') }))
const calledCommands = new Set()
const specNorms = new Set()
for (const { text } of specTexts) {
  for (const m of text.matchAll(/cy\.(\w+)\s*\(/g)) calledCommands.add(m[1])
  for (const n of normsOf(constantRefs(text))) specNorms.add(n)
  for (const n of urlLiterals(text)) specNorms.add(n)
}

const commandedNorms = new Set()
const testedNorms = new Set(specNorms)
for (const c of commands) {
  for (const n of c.norms) {
    commandedNorms.add(n)
    if (calledCommands.has(c.name)) testedNorms.add(n)
  }
}

// ---- per route
for (const r of routes) {
  r.registered = constByNorm.has(r.norm)
  r.hasCommand = commandedNorms.has(r.norm)
  r.hasTest = testedNorms.has(r.norm)
}

// ---- output
const byModule = new Map()
for (const r of routes) {
  if (!byModule.has(r.module)) byModule.set(r.module, [])
  byModule.get(r.module).push(r)
}

const rows = [...byModule.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([module, list]) => ({
  module,
  routes: list.length,
  registered: list.filter((r) => r.registered).length,
  command: list.filter((r) => r.hasCommand).length,
  test: list.filter((r) => r.hasTest).length,
}))
const total = rows.reduce((a, r) => ({
  module: 'TOTAL', routes: a.routes + r.routes, registered: a.registered + r.registered,
  command: a.command + r.command, test: a.test + r.test,
}), { module: 'TOTAL', routes: 0, registered: 0, command: 0, test: 0 })

console.log('\nAPI coverage per module (route.js count / registered / has command / has test)\n')
console.log(`${'module'.padEnd(22)}${'routes'.padStart(8)}${'registered'.padStart(12)}${'command'.padStart(9)}${'test'.padStart(7)}`)
console.log('-'.repeat(58))
for (const r of [...rows, total]) {
  if (r === total) console.log('-'.repeat(58))
  console.log(`${r.module.padEnd(22)}${String(r.routes).padStart(8)}${String(r.registered).padStart(12)}${String(r.command).padStart(9)}${String(r.test).padStart(7)}`)
}

const unregistered = routes.filter((r) => !r.registered)
console.log(`\nUnregistered routes (${unregistered.length}) — add to cypress/fixtures/app-constants.json`)
for (const r of unregistered.sort((a, b) => a.url.localeCompare(b.url))) {
  console.log(`  ${r.url}  [${r.methods.join(',') || '?'}]`)
}

if (args.has('--gaps')) {
  for (const [label, key] of [['No command', 'hasCommand'], ['No test', 'hasTest']]) {
    const list = routes.filter((r) => r.registered && !r[key])
    console.log(`\n${label} but registered (${list.length})`)
    for (const r of list.sort((a, b) => a.url.localeCompare(b.url))) console.log(`  ${r.url}  [${r.methods.join(',')}]`)
  }
}

if (args.has('--it-counts')) {
  const isUi = (f) => /-ui\.cy\.js$|\/ui\//.test(f)
  const counts = specTexts.map(({ file, text }) => ({
    file,
    kind: isUi(file) ? 'ui' : 'api',
    its: (text.match(/^\s*(?:it|it\.only)\s*\(/gm) || []).length,
    skipped: (text.match(/^\s*(?:it\.skip|xit)\s*\(/gm) || []).length,
  }))
  console.log('\nit() counts per spec (kind, active, skipped)')
  for (const c of counts) console.log(`  ${c.kind}  ${String(c.its).padStart(4)}  ${String(c.skipped).padStart(3)}  ${c.file}`)
  for (const kind of ['api', 'ui']) {
    const l = counts.filter((c) => c.kind === kind)
    console.log(`  ${kind.toUpperCase()} total: ${l.length} specs, ${l.reduce((s, c) => s + c.its, 0)} it(), ${l.reduce((s, c) => s + c.skipped, 0)} skipped`)
  }
}

console.log('')
if (args.has('--strict') && unregistered.length > 0) process.exit(1)
