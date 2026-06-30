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
        'rounded-lg border bg-white px-3 py-2.5 transition-colors',
        status === 'error' ? 'border-red-200' : 'border-gray-200',
        className
      )}
    >
      <div className="flex items-center">
        <AttachmentContent>
          <AttachmentIcon file={file} />
          <AttachmentInfo>
            <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {size > 0 && <span className="text-xs text-gray-400">{formatFileSize(size)}</span>}
              {statusText && (
                <>
                  {size > 0 && <span className="text-gray-300">·</span>}
                  <span
                    className={clsx(
                      'text-xs',
                      status === 'error'
                        ? 'text-red-500'
                        : status === 'done'
                          ? 'text-green-600'
                          : 'text-gray-400'
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
