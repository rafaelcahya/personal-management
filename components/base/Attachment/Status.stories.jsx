import { useState } from 'react'
import Attachment from './Attachment'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Attachment/Status',
}

export default meta

const PLACEHOLDER_IMG =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ede9fe"/>
        <stop offset="100%" style="stop-color:#c4b5fd"/>
      </linearGradient>
    </defs>
    <rect width="400" height="200" fill="url(#g)"/>
    <text x="200" y="100" font-family="sans-serif" font-size="14" fill="#7c3aed" text-anchor="middle" dominant-baseline="middle">photo.jpg</text>
  </svg>`
  )

const FILE_PDF = { name: 'contract.pdf', size: 1_024_000, type: 'application/pdf', url: null }
const FILE_IMAGE = { name: 'photo.jpg', size: 2_400_000, type: 'image/jpeg', url: PLACEHOLDER_IMG }
const FILE_DOC = {
  name: 'proposal.docx',
  size: 512_000,
  type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  url: null,
}
const FILE_SHEET = {
  name: 'report.xlsx',
  size: 320_000,
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  url: null,
}

// ─── Idle ─────────────────────────────────────────────────────────────────────

export const Idle = {
  name: 'Idle',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Initial state after a file is picked. No progress bar, no error. Only the remove button is
        shown in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentActions</code>.
        Typically the parent starts the upload immediately and transitions to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">"uploading"</code>.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-lg">
        <Attachment file={FILE_PDF} status="idle" onRemove={() => {}} />
        <Attachment file={FILE_IMAGE} status="idle" onRemove={() => {}} />
        <Attachment file={FILE_DOC} status="idle" onRemove={() => {}} />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Attachment file={file} status="idle" onRemove={handleRemove} />`}</code>
      </pre>
    </div>
  ),
}

// ─── Uploading ────────────────────────────────────────────────────────────────

function UploadingDemo() {
  const [progress, setProgress] = useState(30)

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <Attachment file={FILE_PDF} status="uploading" progress={progress} onRemove={() => {}} />
      <Attachment file={FILE_IMAGE} status="uploading" progress={72} onRemove={() => {}} />
      <Attachment file={FILE_DOC} status="uploading" progress={100} onRemove={() => {}} />

      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-gray-500 shrink-0">progress:</span>
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
          className="flex-1 accent-violet-600"
        />
        <span className="text-xs font-mono text-violet-700 w-8 text-right">{progress}%</span>
      </div>
    </div>
  )
}

export const Uploading = {
  name: 'Uploading',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Shows <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentProgress</code>{' '}
        below the file row. Pass{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">progress</code> (0–100) from
        your upload handler. Drag the slider to preview the bar movement.
      </p>

      <UploadingDemo />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<Attachment
  file={file}
  status="uploading"
  progress={65}
  onRemove={handleRemove}
/>`}</code>
      </pre>
    </div>
  ),
}

// ─── Done ─────────────────────────────────────────────────────────────────────

export const Done = {
  name: 'Done',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Upload complete. Progress bar is hidden. When{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">file.url</code> is set, a
        download button appears in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentActions</code>. For
        image files with a URL, a chevron button lets the user expand the inline preview.
      </p>

      <div className="flex flex-col gap-2 w-full max-w-lg">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">done — no URL (no download)</span>
          <Attachment file={{ ...FILE_PDF, url: null }} status="done" onRemove={() => {}} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            done — with URL (download button visible)
          </span>
          <Attachment
            file={{ ...FILE_DOC, url: '/uploads/proposal.docx' }}
            status="done"
            onRemove={() => {}}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            done — image with URL (image icon + preview toggle)
          </span>
          <Attachment file={FILE_IMAGE} status="done" onRemove={() => {}} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* No download button (url not set) */}
<Attachment file={{ name: 'contract.pdf', size: 1024000, type: 'application/pdf', url: null }} status="done" onRemove={handleRemove} />

{/* Download button visible */}
<Attachment file={{ name: 'proposal.docx', url: '/uploads/proposal.docx', ... }} status="done" onRemove={handleRemove} />

{/* Image — preview toggle visible */}
<Attachment file={{ name: 'photo.jpg', type: 'image/jpeg', url: '/uploads/photo.jpg', ... }} status="done" onRemove={handleRemove} />`}</code>
      </pre>
    </div>
  ),
}

// ─── Error ────────────────────────────────────────────────────────────────────

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Shows <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentError</code>{' '}
        with a title and optional description below the row. A retry button appears in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentActions</code> when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onRetry</code> is provided.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-lg">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">error — title only</span>
          <Attachment
            file={FILE_PDF}
            status="error"
            errorTitle="Upload failed"
            onRemove={() => {}}
            onRetry={() => {}}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">error — title + description</span>
          <Attachment
            file={FILE_SHEET}
            status="error"
            errorTitle="Upload failed"
            errorDescription="File size exceeds the 10 MB limit. Please compress the file and try again."
            onRemove={() => {}}
            onRetry={() => {}}
          />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-violet-700">
            error — no retry (onRetry not provided)
          </span>
          <Attachment
            file={FILE_DOC}
            status="error"
            errorTitle="Unsupported file type"
            errorDescription="Only PDF and image files are allowed."
            onRemove={() => {}}
          />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* With retry button */}
<Attachment
  file={file}
  status="error"
  errorTitle="Upload failed"
  errorDescription="File size exceeds the 10 MB limit."
  onRemove={handleRemove}
  onRetry={handleRetry}
/>

{/* No retry button */}
<Attachment
  file={file}
  status="error"
  errorTitle="Unsupported file type"
  errorDescription="Only PDF and image files are allowed."
  onRemove={handleRemove}
/>`}</code>
      </pre>
    </div>
  ),
}
