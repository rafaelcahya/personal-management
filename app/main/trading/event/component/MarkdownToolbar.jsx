'use client'

import { Bold, Italic, Table, Heading2, List, ListOrdered, Link, Eye, EyeOff } from 'lucide-react'

const TOOLS = [
  { icon: Bold, label: 'Bold', prefix: '**', suffix: '**', placeholder: 'bold text' },
  { icon: Italic, label: 'Italic', prefix: '*', suffix: '*', placeholder: 'italic text' },
  {
    icon: Heading2,
    label: 'Heading',
    prefix: '## ',
    suffix: '',
    placeholder: 'Heading',
    linePrefix: true,
  },
  {
    icon: List,
    label: 'Bullet list',
    prefix: '- ',
    suffix: '',
    placeholder: 'List item',
    linePrefix: true,
  },
  {
    icon: ListOrdered,
    label: 'Numbered list',
    prefix: '1. ',
    suffix: '',
    placeholder: 'List item',
    linePrefix: true,
  },
  { icon: Link, label: 'Link', prefix: '[', suffix: '](url)', placeholder: 'link text' },
  {
    icon: Table,
    label: 'Table',
    template: '| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |',
  },
]

export default function MarkdownToolbar({
  textareaRef,
  value,
  onChange,
  previewMode,
  onTogglePreview,
}) {
  const applyFormat = (tool) => {
    const el = textareaRef?.current
    if (!el) return

    el.focus()
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)

    if (tool.template) {
      const before = value.slice(0, start)
      const after = value.slice(end)
      const needsBefore = before.length > 0 && !before.endsWith('\n')
      const needsAfter = after.length > 0 && !after.startsWith('\n')
      const insert = (needsBefore ? '\n' : '') + tool.template + (needsAfter ? '\n' : '')
      el.setSelectionRange(start, end)
      document.execCommand('insertText', false, insert)
      const tStart = start + (needsBefore ? 1 : 0)
      requestAnimationFrame(() => el.setSelectionRange(tStart, tStart + tool.template.length))
      return
    }

    if (tool.linePrefix) {
      const before = value.slice(0, start)
      const lineStart = before.lastIndexOf('\n') + 1
      if (selected) {
        const lines = value.slice(lineStart, end).split('\n')
        const prefixed = lines.map((l) => tool.prefix + l).join('\n')
        el.setSelectionRange(lineStart, end)
        document.execCommand('insertText', false, prefixed)
        requestAnimationFrame(() =>
          el.setSelectionRange(lineStart + tool.prefix.length, lineStart + prefixed.length)
        )
      } else {
        el.setSelectionRange(lineStart, start)
        document.execCommand('insertText', false, tool.prefix + tool.placeholder)
        const newStart = lineStart + tool.prefix.length
        requestAnimationFrame(() =>
          el.setSelectionRange(newStart, newStart + tool.placeholder.length)
        )
      }
      return
    }

    // Wrap tools (Bold, Italic, Link)
    const text = selected || tool.placeholder
    el.setSelectionRange(start, end)
    document.execCommand('insertText', false, tool.prefix + text + tool.suffix)
    requestAnimationFrame(() =>
      el.setSelectionRange(start + tool.prefix.length, start + tool.prefix.length + text.length)
    )
  }

  return (
    <div className="flex items-center border border-slate-200 rounded-t-md bg-slate-50 px-2 py-1.5 border-b-0">
      <div className="flex items-center gap-0.5 flex-1">
        {TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <button
              key={tool.label}
              type="button"
              title={tool.label}
              disabled={previewMode}
              onMouseDown={(e) => {
                e.preventDefault()
                applyFormat(tool)
              }}
              className="p-1.5 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <Icon className="size-3.5" />
            </button>
          )
        })}
      </div>

      {onTogglePreview && (
        <button
          type="button"
          title={previewMode ? 'Edit' : 'Preview'}
          onMouseDown={(e) => {
            e.preventDefault()
            onTogglePreview()
          }}
          className={`p-1.5 rounded transition-colors ml-1 ${
            previewMode
              ? 'text-violet-600 bg-violet-100 hover:bg-violet-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
          }`}
        >
          {previewMode ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
        </button>
      )}
    </div>
  )
}
