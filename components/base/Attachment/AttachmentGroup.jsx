'use client'

import { useRef } from 'react'
import { clsx } from 'clsx'
import { formatFileSize, AttachmentTrigger } from './attachmentParts'

export default function AttachmentGroup({
  trigger = 'dropzone',
  showTriggerAlways = true,
  accept,
  multiple = true,
  maxFiles,
  maxSize,
  onFilesAdd,
  children,
  className,
}) {
  const inputRef = useRef(null)

  const childCount = Array.isArray(children) ? children.filter(Boolean).length : children ? 1 : 0
  const limitReached = maxFiles != null && childCount >= maxFiles
  const showTrigger = showTriggerAlways ? !limitReached : childCount === 0

  const handleFiles = (files) => {
    let list = Array.from(files)
    if (maxFiles != null) list = list.slice(0, Math.max(0, maxFiles - childCount))
    if (maxSize != null) list = list.filter((f) => f.size <= maxSize)
    if (list.length > 0) onFilesAdd?.(list)
  }

  const handleInputChange = (e) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files)
      e.target.value = ''
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files)
  }
  const handleDragOver = (e) => e.preventDefault()

  const sizeHint = maxSize ? `Max ${formatFileSize(maxSize)} per file` : null

  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
      />

      {showTrigger && (
        <AttachmentTrigger
          variant={trigger}
          accept={accept}
          sizeHint={sizeHint}
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        />
      )}

      {childCount > 0 && <div className="flex flex-col gap-2">{children}</div>}
    </div>
  )
}

AttachmentGroup.displayName = 'AttachmentGroup'
