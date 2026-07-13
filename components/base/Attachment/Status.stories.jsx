import { useState } from 'react'
import Attachment from './Attachment'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Attachment/Status',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full">
    {items.map(({ heading, cards }) => (
      <div key={heading}>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          {heading}
        </p>
        <div className="flex flex-col gap-3">
          {cards.map(({ title, body }) => (
            <div
              key={title}
              className="flex gap-3 p-4 rounded-lg border border-violet-100 bg-violet-50"
            >
              <span className="mt-0.5 shrink-0 size-4 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
              <div>
                <p className="text-xs font-semibold text-violet-800 mb-0.5">{title}</p>
                <p className="text-xs text-violet-700 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

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

export const Idle = {
  name: 'Idle',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Initial state after a file is picked. No progress bar, no error. Only the remove button
        appears in <code className="font-mono bg-gray-100 px-1 rounded">AttachmentActions</code>.
        Typically the parent starts the upload immediately and transitions to{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">"uploading"</code>.
      </span>

      <div className="flex flex-col gap-2">
        <Attachment file={FILE_PDF} status="idle" onRemove={() => {}} />
        <Attachment file={FILE_IMAGE} status="idle" onRemove={() => {}} />
        <Attachment file={FILE_DOC} status="idle" onRemove={() => {}} />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Transition out of idle immediately — do not leave files stuck here',
                body: 'Idle is a transient state between file selection and upload start. Start the upload in onFilesAdd and move status to "uploading" right away so users see progress.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Use idle as an intermediary when batch-confirming before upload',
                body: 'If the form requires an explicit submit before uploading (e.g. a bulk operation), idle is acceptable as a holding state. Make it clear to users that the upload has not started.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`<Attachment file={file} status="idle" onRemove={handleRemove} />`}</code>
      </pre>
    </div>
  ),
}

function UploadingDemo() {
  const [progress, setProgress] = useState(30)

  return (
    <div className="flex flex-col gap-4">
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
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Shows <code className="font-mono bg-gray-100 px-1 rounded">AttachmentProgress</code> below
        the file row. Pass <code className="font-mono bg-gray-100 px-1 rounded">progress</code>{' '}
        (0–100) from your upload handler. Drag the slider to preview the bar movement.
      </span>

      <UploadingDemo />

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always pass a live progress value — not just 0 or 100',
                body: 'Update progress from XHR onprogress or fetchs ReadableStream as the upload proceeds. A bar stuck at 0% until it jumps to 100% is worse than no bar at all.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reset progress to 0 before retrying a failed upload',
                body: 'When the user retries, set status back to "uploading" and reset progress to 0. The previous partial progress value should not carry over.',
              },
              {
                title: 'Allow removing while uploading — abort the request in onRemove',
                body: 'Pass onRemove even in the uploading state. If the user removes the row, cancel the in-flight XHR or AbortController signal before removing the item from state.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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

export const Done = {
  name: 'Done',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Upload complete. Progress bar is hidden. When{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">file.url</code> is set, a download
        button appears in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">AttachmentActions</code>. For image
        files with a URL, a chevron button lets the user expand the inline preview.
      </span>

      <div className="flex flex-col gap-3">
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
            done — image with URL (preview toggle visible)
          </span>
          <Attachment file={FILE_IMAGE} status="done" onRemove={() => {}} />
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Set file.url after upload completes to unlock download and preview',
                body: 'The download button and image preview toggle appear only when file.url is set. Update the file object in state with the URL returned by the upload API after the response arrives.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Do not auto-remove the row on done — let users review and remove manually',
                body: 'Users need confirmation that their file was accepted. Keeping the row visible (with the green "Uploaded" label) gives that signal. Auto-removal can feel like data loss.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* No download button (url not set) */}
<Attachment
  file={{ name: 'contract.pdf', size: 1024000, type: 'application/pdf', url: null }}
  status="done"
  onRemove={handleRemove}
/>

{/* Download button visible */}
<Attachment
  file={{ name: 'proposal.docx', url: '/uploads/proposal.docx', ... }}
  status="done"
  onRemove={handleRemove}
/>

{/* Image — preview toggle visible */}
<Attachment
  file={{ name: 'photo.jpg', type: 'image/jpeg', url: '/uploads/photo.jpg', ... }}
  status="done"
  onRemove={handleRemove}
/>`}</code>
      </pre>
    </div>
  ),
}

export const ErrorState = {
  name: 'Error State',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Shows <code className="font-mono bg-gray-100 px-1 rounded">AttachmentError</code> with a
        title and optional description below the row. A retry button appears in{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">AttachmentActions</code> when{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onRetry</code> is provided.
      </span>

      <div className="flex flex-col gap-3">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Always include errorDescription — never leave users guessing',
                body: 'The red border and "Upload failed" title signal failure, but users need to know why and what to do next. Always pass an errorDescription with an actionable message.',
              },
              {
                title: 'Provide onRetry for transient failures (network, timeout)',
                body: 'Network errors are often temporary. Pass onRetry so users can retry without having to re-select the file. Omit it only when the failure is permanent (e.g. unsupported type).',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Reset status to "uploading" when retry starts',
                body: 'In the onRetry handler, set status back to "uploading" and progress to 0 before re-issuing the request. The error UI should disappear immediately when the retry begins.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`{/* With retry button */}
<Attachment
  file={file}
  status="error"
  errorTitle="Upload failed"
  errorDescription="File size exceeds the 10 MB limit."
  onRemove={handleRemove}
  onRetry={handleRetry}
/>

{/* No retry button — permanent failure */}
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
