export function parseQuickTags(content) {
  if (!content) return []
  const match = content.match(/## Quick Tags\n([^\n]+)/)
  if (!match) return []
  return match[1]
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 4)
}

export function stripQuickTags(content) {
  if (!content) return content
  return content.replace(/\n## Quick Tags[\s\S]*$/, '')
}

export function parseInline(text) {
  if (typeof text !== 'string') return text
  const result = []
  let remaining = text
  let key = 0
  while (remaining.length > 0) {
    const start = remaining.indexOf('**')
    if (start === -1) {
      result.push(remaining)
      break
    }
    if (start > 0) result.push(remaining.slice(0, start))
    const end = remaining.indexOf('**', start + 2)
    if (end === -1) {
      result.push(remaining.slice(start))
      break
    }
    result.push(
      <strong key={key++} className="font-semibold text-slate-700">
        {remaining.slice(start + 2, end)}
      </strong>
    )
    remaining = remaining.slice(end + 2)
  }
  return result
}

export function renderMarkdown(content) {
  if (!content) return null

  const sections = content.split(/\n(?=## )/)

  return sections.map((section, i) => {
    const lines = section.split('\n')
    const firstLine = lines[0]
    const isHeader = firstLine.startsWith('## ')
    const header = isHeader ? firstLine.replace(/^## /, '') : null
    const bodyLines = isHeader ? lines.slice(1) : lines

    const bodyParts = []
    let listItems = []

    for (const line of bodyLines) {
      if (line.trim() === '') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        continue
      }
      if (line.trim() === '---') {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        bodyParts.push({ type: 'hr' })
        continue
      }
      if (line.trim().startsWith('- ')) {
        listItems.push(line.trim().slice(2))
      } else {
        if (listItems.length > 0) {
          bodyParts.push({ type: 'list', items: [...listItems] })
          listItems = []
        }
        if (line.trim()) bodyParts.push({ type: 'p', text: line.trim() })
      }
    }
    if (listItems.length > 0) bodyParts.push({ type: 'list', items: listItems })

    return (
      <div key={i} className="mb-3 last:mb-0">
        {header && (
          <p className="text-xs font-semibold uppercase tracking-wide text-violet-600 mt-3 mb-1.5 first:mt-0">
            {header}
          </p>
        )}
        {bodyParts.map((part, j) =>
          part.type === 'hr' ? (
            <hr key={j} className="border-slate-200 my-2" />
          ) : part.type === 'list' ? (
            <ul key={j} className="list-disc list-inside space-y-0.5 mb-1">
              {part.items.map((item, k) => (
                <li key={k} className="text-sm text-slate-600">
                  {parseInline(item)}
                </li>
              ))}
            </ul>
          ) : (
            <p key={j} className="text-sm text-slate-600 mb-1">
              {parseInline(part.text)}
            </p>
          )
        )}
      </div>
    )
  })
}
