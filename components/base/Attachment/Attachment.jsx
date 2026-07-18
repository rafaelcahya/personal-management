'use client'

import { useState } from 'react'
import { clsx } from 'clsx'
import {
  AttachmentIcon,
  AttachmentInfo,
  AttachmentContent,
  AttachmentActions,
  AttachmentProgress,
  AttachmentPreview,
  AttachmentError,
  formatFileSize,
} from './attachmentParts'

const STATUS_TEXT = {
  idle: null,
  uploading: 'Uploading...',
  done: 'Uploaded',
  error: 'Upload failed',
}

export default function Attachment({
  file,
  status = 'idle',
  progress = 0,
  errorTitle = 'Upload failed',
  errorDescription,
  onRemove,
  onRetry,
  className,
}) {
  const [previewOpen, setPreviewOpen] = useState(false)

  const name = file?.name ?? ''
  const size = file?.size ?? 0
  const statusText = STATUS_TEXT[status]

  return (
    <div
      className={clsx(
        'rounded-lg border bg-card px-3 py-2.5 transition-colors',
        status === 'error' ? 'border-destructive/40' : 'border-border',
        className
      )}
    >
      <div className="flex items-center">
        <AttachmentContent>
          <AttachmentIcon file={file} />
          <AttachmentInfo>
            <p className="text-sm font-medium text-foreground truncate">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {size > 0 && (
                <span className="text-xs text-muted-foreground">{formatFileSize(size)}</span>
              )}
              {statusText && (
                <>
                  {size > 0 && <span className="text-muted-foreground/40">·</span>}
                  <span
                    className={clsx(
                      'text-xs',
                      status === 'error'
                        ? 'text-destructive'
                        : status === 'done'
                          ? 'text-success'
                          : 'text-muted-foreground'
                    )}
                  >
                    {statusText}
                  </span>
                </>
              )}
            </div>
          </AttachmentInfo>
        </AttachmentContent>
        <AttachmentActions
          file={file}
          status={status}
          onRemove={onRemove}
          onRetry={onRetry}
          onTogglePreview={() => setPreviewOpen((v) => !v)}
          isPreviewOpen={previewOpen}
        />
      </div>

      {status === 'uploading' && <AttachmentProgress progress={progress} />}

      {previewOpen && <AttachmentPreview file={file} />}

      {status === 'error' && <AttachmentError title={errorTitle} description={errorDescription} />}
    </div>
  )
}

Attachment.displayName = 'Attachment'
