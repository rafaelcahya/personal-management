'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusIcon, Trash2, LinkIcon } from 'lucide-react'

export default function EventLinksInput({ value = [], onChange, error }) {
  const [hyperlink, setHyperlink] = useState('')
  const [link, setLink] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleAdd = () => {
    const errors = {}
    if (!hyperlink.trim()) errors.hyperlink = 'Hyperlink text is required'
    if (!link.trim()) {
      errors.link = 'URL is required'
    } else {
      try {
        new URL(link.trim())
      } catch {
        errors.link = 'Must be a valid URL'
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    setFieldErrors({})
    onChange([...value, { hyperlink: hyperlink.trim(), link: link.trim() }])
    setHyperlink('')
    setLink('')
  }

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Label className="font-medium text-sm">
        Reference Links
        <span className="text-rose-500 ml-1">*</span>
      </Label>

      {/* Existing links list */}
      {value.length > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-slate-200 p-2 max-h-36 overflow-y-auto">
          {value.map((entry, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1.5 bg-slate-50 rounded-md group"
            >
              <LinkIcon className="size-3 text-violet-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{entry.hyperlink}</p>
                <p className="text-xs text-slate-400 truncate">{entry.link}</p>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="size-5 flex items-center justify-center rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                aria-label="Remove link"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add new link entry */}
      <div className="flex flex-col gap-2 border border-dashed border-slate-300 rounded-lg p-3">
        <div className="grid grid-cols-1 gap-2">
          <div className="flex flex-col gap-1">
            <Input
              value={hyperlink}
              onChange={(e) => {
                setHyperlink(e.target.value)
                if (fieldErrors.hyperlink) setFieldErrors((p) => ({ ...p, hyperlink: undefined }))
              }}
              onKeyDown={handleKeyDown}
              placeholder="Display text (e.g. Reuters article)"
              id="linkHyperlinkInput_eventPage"
              className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 h-8 ${fieldErrors.hyperlink ? 'border-rose-500' : ''}`}
            />
            {fieldErrors.hyperlink && (
              <p className="text-xs text-rose-500 font-medium">{fieldErrors.hyperlink}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Input
              value={link}
              onChange={(e) => {
                setLink(e.target.value)
                if (fieldErrors.link) setFieldErrors((p) => ({ ...p, link: undefined }))
              }}
              onKeyDown={handleKeyDown}
              placeholder="URL (e.g. https://reuters.com/...)"
              id="linkUrlInput_eventPage"
              className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 h-8 ${fieldErrors.link ? 'border-rose-500' : ''}`}
            />
            {fieldErrors.link && (
              <p className="text-xs text-rose-500 font-medium">{fieldErrors.link}</p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          id="addLinkBtn_eventPage"
          className="self-start text-violet-600 border-violet-200 hover:bg-violet-50 h-7 text-xs font-medium"
        >
          <PlusIcon className="size-3 mr-1" />
          Add Link
        </Button>
      </div>

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  )
}
