'use client'

import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'
import Button from '@/components/base/Button/Button'
import { fetchEventTags } from '@/lib/api/event'

const MAX_TAGS = 10
const MAX_TAG_LENGTH = 30

export default function EventTagsInput({ value = [], onChange, id }) {
  const [input, setInput] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [allTags, setAllTags] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    fetchEventTags()
      .then(setAllTags)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const addTag = (raw) => {
    const tag = raw.toLowerCase().trim()
    if (!tag || tag.length > MAX_TAG_LENGTH) return
    if (value.includes(tag)) return
    if (value.length >= MAX_TAGS) return
    onChange([...value, tag])
    setInput('')
    setShowSuggestions(false)
  }

  const removeTag = (tag) => {
    onChange(value.filter((t) => t !== tag))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const handleInputChange = (e) => {
    const val = e.target.value.replace(',', '')
    setInput(val)
    if (val.trim()) {
      const filtered = allTags.filter(
        (t) => t.includes(val.toLowerCase().trim()) && !value.includes(t)
      )
      setSuggestions(filtered.slice(0, 6))
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }

  const remaining = MAX_TAGS - value.length

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <Label className="font-medium text-sm">
        Tags
        <span className="text-slate-400 ml-1 font-normal text-xs">(optional)</span>
      </Label>

      <div
        className="flex flex-wrap gap-1.5 min-h-[40px] rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-violet-200 focus-within:border-violet-600 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-violet-100 text-violet-700 text-xs font-medium rounded-md px-2 py-0.5"
          >
            {tag}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={(e) => {
                e.stopPropagation()
                removeTag(tag)
              }}
              className="hover:text-violet-900 transition-colors"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="size-3" />
            </Button>
          </span>
        ))}
        {remaining > 0 && (
          <input
            ref={inputRef}
            id={id}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => input && setShowSuggestions(suggestions.length > 0)}
            placeholder={value.length === 0 ? 'Type a tag and press Enter' : ''}
            className="flex-1 min-w-[120px] bg-transparent outline-none text-sm font-medium selection:bg-violet-500"
          />
        )}
      </div>

      {showSuggestions && (
        <div className="border border-slate-200 rounded-md bg-white shadow-md z-10 overflow-hidden">
          {suggestions.map((tag) => (
            <Button
              key={tag}
              variant="ghost"
              fullWidth
              onMouseDown={(e) => {
                e.preventDefault()
                addTag(tag)
              }}
              className="justify-start px-3 py-1.5 text-sm hover:bg-violet-50 font-medium"
            >
              {tag}
            </Button>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">
        Press Enter or comma to add. {remaining}/{MAX_TAGS} tags remaining.
      </p>
    </div>
  )
}
