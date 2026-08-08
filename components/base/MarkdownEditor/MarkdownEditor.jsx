'use client'

import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import {
  Bold,
  Italic,
  Strikethrough,
  Heading,
  Code,
  List,
  ListOrdered,
  Link,
  Quote,
  ChevronDown,
  Minus,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useFieldContentContext } from '../Field/FieldContent'
import Button from '../Button/Button'
import { Separator } from '../Separator/Separator'
import { Tabs, TabsList, TabsTrigger } from '../Tabs/Tabs'
import { Tooltip, TooltipTrigger, TooltipContent } from '../Tooltip/Tooltip'

const TABS = ['write', 'preview']

const HEADING_LEVELS = [
  { label: 'H1', linePrefix: '# ' },
  { label: 'H2', linePrefix: '## ' },
  { label: 'H3', linePrefix: '### ' },
  { label: 'H4', linePrefix: '#### ' },
  { label: 'H5', linePrefix: '##### ' },
  { label: 'H6', linePrefix: '###### ' },
]

const FORMATS = [
  { key: 'bold', icon: Bold, title: 'Bold', wrap: ['**', '**'], sample: 'bold text' },
  { key: 'italic', icon: Italic, title: 'Italic', wrap: ['*', '*'], sample: 'italic text' },
  {
    key: 'strikethrough',
    icon: Strikethrough,
    title: 'Strikethrough',
    wrap: ['~~', '~~'],
    sample: 'text',
  },
  { key: 'sep1' },
  { key: 'heading', icon: Heading, title: 'Heading', type: 'dropdown' },
  { key: 'quote', icon: Quote, title: 'Blockquote', linePrefix: '> ' },
  { key: 'sep2' },
  { key: 'ul', icon: List, title: 'Bullet list', linePrefix: '- ' },
  { key: 'ol', icon: ListOrdered, title: 'Ordered list', linePrefix: '1. ' },
  { key: 'sep3' },
  { key: 'code', icon: Code, title: 'Inline code', wrap: ['`', '`'], sample: 'code' },
  { key: 'link', icon: Link, title: 'Link', wrap: ['[', '](url)'], sample: 'link text' },
  { key: 'sep4' },
  { key: 'hr', icon: Minus, title: 'Line break', insert: '\n\n---\n\n' },
]

function applyFormat(fmt, value, onChange, textareaEl) {
  if (!textareaEl) return

  const start = textareaEl.selectionStart
  const end = textareaEl.selectionEnd
  const selected = value.slice(start, end)

  let newValue, nextStart, nextEnd

  if (fmt.wrap) {
    const [before, after] = fmt.wrap
    const text = selected || fmt.sample
    newValue = value.slice(0, start) + before + text + after + value.slice(end)
    nextStart = start + before.length
    nextEnd = nextStart + text.length
  } else if (fmt.linePrefix) {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const line = value.slice(lineStart, end)

    // Remove any existing heading prefix before applying new one
    const existingHeading = line.match(/^#{1,6} /)
    const cleanLine = existingHeading ? line.slice(existingHeading[0].length) : line
    const alreadyHasThis = line.startsWith(fmt.linePrefix) && !existingHeading?.length

    let newLine
    if (existingHeading && !alreadyHasThis) {
      newLine = fmt.linePrefix + cleanLine
    } else if (line.startsWith(fmt.linePrefix)) {
      newLine = cleanLine
    } else {
      newLine = fmt.linePrefix + line
    }

    const delta = newLine.length - line.length
    newValue = value.slice(0, lineStart) + newLine + value.slice(end)
    nextStart = Math.max(lineStart, start + delta)
    nextEnd = nextStart
  } else if (fmt.insert) {
    newValue = value.slice(0, start) + fmt.insert + value.slice(end)
    nextStart = start + fmt.insert.length
    nextEnd = nextStart
  } else {
    return
  }

  onChange?.(newValue)
  requestAnimationFrame(() => {
    textareaEl.focus()
    textareaEl.setSelectionRange(nextStart, nextEnd)
  })
}

function HeadingDropdown({ value, onChange, textareaRef, isDisabled }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <Button
        variant="ghost"
        size="xs"
        aria-label="Heading"
        disabled={isDisabled}
        onMouseDown={(e) => {
          e.preventDefault()
          setOpen((prev) => !prev)
        }}
        className={cn(
          'gap-0.5 px-1 text-muted-foreground hover:text-foreground hover:bg-accent',
          open && 'bg-accent text-foreground'
        )}
      >
        <Heading className="size-3.5" />
        <ChevronDown className="size-2.5" />
      </Button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[11rem]">
          {HEADING_LEVELS.map((h) => (
            <button
              key={h.label}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                applyFormat({ linePrefix: h.linePrefix }, value, onChange, textareaRef.current)
                setOpen(false)
              }}
              className="w-full flex items-center px-3 py-2 text-xs font-medium text-foreground hover:bg-accent transition-colors"
            >
              <span className="font-mono text-muted-foreground w-6">{h.label}</span>
              <span
                className="text-foreground"
                style={{
                  fontSize: `${Math.max(0.65, 1 - (parseInt(h.label[1]) - 1) * 0.07)}rem`,
                  fontWeight: 600,
                }}
              >
                Heading {h.label[1]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MarkdownEditor({
  value = '',
  onChange,
  placeholder = 'Write markdown here...',
  minHeight = '120px',
  maxHeight,
  variant: variantProp,
  disabled: disabledProp,
  className,
}) {
  const { id, descriptionId, errorId, hasError, disabled: ctxDisabled } = useFieldContentContext()

  const isDisabled = ctxDisabled || disabledProp || variantProp === 'disabled'
  const resolvedVariant = variantProp ?? (hasError ? 'error' : isDisabled ? 'disabled' : 'default')

  const [activeTab, setActiveTab] = useState('write')
  const textareaRef = useRef(null)

  return (
    <div
      className={cn(
        'relative rounded-md border bg-background text-foreground transition-[color,box-shadow,border-color] duration-150 outline-none',
        resolvedVariant === 'default' && 'border-input',
        resolvedVariant === 'error' && 'border-destructive',
        resolvedVariant === 'disabled' &&
          'border-input opacity-50 cursor-not-allowed pointer-events-none bg-muted',
        className
      )}
    >
      {/* Floating card — tabs + formatting toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 bg-card border border-border rounded-lg shadow-sm mx-2 mt-2 px-1.5 py-1.5">
        <Tabs value={activeTab} onValueChange={isDisabled ? undefined : setActiveTab}>
          <TabsList variant="pill" size="xs">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} disabled={isDisabled} className="capitalize">
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Formatting toolbar — only on Write tab */}
        {activeTab === 'write' && (
          <div className="flex items-center flex-wrap gap-0.5 ml-auto">
            {FORMATS.map((fmt) => {
              if (fmt.key.startsWith('sep')) {
                return <Separator key={fmt.key} orientation="vertical" className="h-3.5 mx-0.5" />
              }
              if (fmt.type === 'dropdown') {
                return (
                  <HeadingDropdown
                    key={fmt.key}
                    value={value}
                    onChange={onChange}
                    textareaRef={textareaRef}
                    isDisabled={isDisabled}
                  />
                )
              }
              const Icon = fmt.icon
              return (
                <Tooltip key={fmt.key} delayDuration={600}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      aria-label={fmt.title}
                      disabled={isDisabled}
                      className="text-muted-foreground hover:text-foreground hover:bg-accent"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        applyFormat(fmt, value, onChange, textareaRef.current)
                      }}
                    >
                      <Icon className="size-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={4}>
                    {fmt.title}
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        )}
      </div>

      {/* Write tab */}
      {activeTab === 'write' && (
        <textarea
          ref={textareaRef}
          id={id}
          disabled={isDisabled}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          aria-describedby={[descriptionId, errorId].filter(Boolean).join(' ') || undefined}
          aria-invalid={hasError || undefined}
          style={{ minHeight, maxHeight, resize: maxHeight ? 'none' : 'vertical' }}
          className={cn(
            'w-full block bg-transparent text-sm font-medium px-3 py-2.5',
            'placeholder:text-muted-foreground outline-none'
          )}
        />
      )}

      {/* Preview tab */}
      {activeTab === 'preview' && (
        <div
          role="tabpanel"
          style={{ minHeight }}
          className="px-3 py-2.5 text-sm prose prose-sm max-w-none
            prose-headings:font-semibold prose-headings:text-foreground
            prose-p:text-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-em:text-foreground
            prose-code:text-foreground prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-md prose-pre:p-3
            prose-ul:text-foreground prose-ol:text-foreground
            prose-li:text-foreground
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-border prose-blockquote:text-muted-foreground
            prose-hr:border-border prose-hr:my-3"
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-muted-foreground italic">{placeholder}</p>
          )}
        </div>
      )}
    </div>
  )
}
