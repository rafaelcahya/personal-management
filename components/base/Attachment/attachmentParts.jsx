'use client'

import { clsx } from 'clsx'
import {
  File,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  Download,
  Trash2,
  RefreshCw,
  ChevronDown,
  Upload,
  Paperclip,
} from 'lucide-react'

// ─── Helpers ───────────────────────────────────────────────────────────────────

export function formatFileSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function getFileCategory(type = '') {
  if (type.startsWith('image/')) return 'image'
  if (type === 'application/pdf') return 'pdf'
  if (type.includes('word') || type.includes('document')) return 'doc'
  if (type.includes('sheet') || type.includes('excel') || type.includes('csv')) return 'sheet'
  if (type.startsWith('video/')) return 'video'
  if (type.startsWith('audio/')) return 'audio'
  return 'file'
}

const STATUS_TEXT = {
  idle: null,
  uploading: 'Uploading...',
  done: 'Uploaded',
  error: 'Upload failed',
}

const ICON_CONFIG = {
  image: { Icon: FileImage, color: 'text-violet-500', bg: 'bg-violet-50' },
  pdf: { Icon: FileText, color: 'text-red-500', bg: 'bg-red-50' },
  doc: { Icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
  sheet: { Icon: FileText, color: 'text-green-500', bg: 'bg-green-50' },
  video: { Icon: FileVideo, color: 'text-orange-500', bg: 'bg-orange-50' },
  audio: { Icon: FileAudio, color: 'text-pink-500', bg: 'bg-pink-50' },
  file: { Icon: File, color: 'text-gray-400', bg: 'bg-gray-100' },
}

// ─── AttachmentIcon ────────────────────────────────────────────────────────────

export function AttachmentIcon({ file }) {
  const type = file?.type ?? ''
  const category = getFileCategory(type)
  const { Icon, color, bg } = ICON_CONFIG[category]

  return (
    <div className={clsx('size-10 rounded flex items-center justify-center shrink-0', bg)}>
      <Icon className={clsx('size-5', color)} />
    </div>
  )
}

// ─── AttachmentInfo ────────────────────────────────────────────────────────────

export function AttachmentInfo({ children, className }) {
  return <div className={clsx('flex-1 min-w-0', className)}>{children}</div>
}

// ─── AttachmentContent ─────────────────────────────────────────────────────────

export function AttachmentContent({ children, className }) {
  return <div className={clsx('flex items-center gap-3 flex-1 min-w-0', className)}>{children}</div>
}

// ─── AttachmentActions ─────────────────────────────────────────────────────────

export function AttachmentActions({
  file,
  status,
  onRemove,
  onRetry,
  onTogglePreview,
  isPreviewOpen,
}) {
  const url = file?.url ?? null
  const type = file?.type ?? ''
  const isImage = getFileCategory(type) === 'image'
  const canPreview = isImage && url

  return (
    <div className="flex items-center gap-0.5 shrink-0 ml-2">
      {status === 'error' && onRetry && (
        <button
          type="button"
          onClick={onRetry}
          title="Retry upload"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <RefreshCw className="size-3.5" />
        </button>
      )}
      {status === 'done' && url && (
        <a
          href={url}
          download
          title="Download"
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <Download className="size-3.5" />
        </a>
      )}
      {canPreview && onTogglePreview && (
        <button
          type="button"
          onClick={onTogglePreview}
          title={isPreviewOpen ? 'Hide preview' : 'Show preview'}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
        >
          <ChevronDown
            className={clsx(
              'size-3.5 transition-transform duration-200',
              isPreviewOpen && 'rotate-180'
            )}
          />
        </button>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          title="Remove"
          className="p-1.5 rounded hover:bg-red-50 transition-colors text-gray-400 hover:text-red-500"
        >
          <Trash2 className="size-3.5" />
        </button>
      )}
    </div>
  )
}

// ─── AttachmentProgress ────────────────────────────────────────────────────────

export function AttachmentProgress({ progress = 0 }) {
  return (
    <div className="mt-2 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-violet-500 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
    </div>
  )
}

// ─── AttachmentPreview ─────────────────────────────────────────────────────────

export function AttachmentPreview({ file }) {
  const url = file?.url ?? null
  if (!url) return null
  return (
    <div className="mt-2 rounded-md overflow-hidden border border-gray-100 bg-gray-50">
      <img src={url} alt={file?.name ?? ''} className="w-full max-h-48 object-contain" />
    </div>
  )
}

// ─── AttachmentError ───────────────────────────────────────────────────────────

export function AttachmentError({ title = 'Upload failed', description }) {
  return (
    <div className="mt-2 rounded-md bg-red-50 border border-red-100 px-3 py-2">
      <p className="text-xs font-medium text-red-700">{title}</p>
      {description && <p className="text-xs text-red-500 mt-0.5">{description}</p>}
    </div>
  )
}

// ─── AttachmentTrigger ─────────────────────────────────────────────────────────

const DEFAULT_DROPZONE_LABEL = (
  <>
    Drop files here or <span className="text-violet-600">browse</span>
  </>
)

const DEFAULT_BUTTON_LABEL = 'Attach files'

export function AttachmentTrigger({
  variant = 'dropzone',
  label,
  accept,
  sizeHint,
  onClick,
  onDrop,
  onDragOver,
}) {
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 rounded-md border border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-colors w-fit"
      >
        <Paperclip className="size-3.5" />
        {label ?? DEFAULT_BUTTON_LABEL}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-lg border-2 border-dashed border-gray-200 hover:border-violet-300 hover:bg-violet-50/40 transition-colors cursor-pointer text-gray-400 hover:text-violet-500"
    >
      <Upload className="size-5" />
      <div className="text-center">
        <p className="text-sm font-medium">{label ?? DEFAULT_DROPZONE_LABEL}</p>
        {(accept || sizeHint) && (
          <p className="text-xs mt-0.5 text-gray-400">
            {[accept, sizeHint].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </button>
  )
}
