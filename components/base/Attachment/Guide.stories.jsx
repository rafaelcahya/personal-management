import { useState } from 'react'
import AttachmentGroup from './AttachmentGroup'
import Attachment from './Attachment'
import { AttachmentTrigger } from './attachmentParts'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Attachment',
}

export default meta

// ─── Primitives ───────────────────────────────────────────────────────────────

const Section = ({ title, description, children }) => (
  <div className="mb-12">
    <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
    {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
    <hr className="mb-5 border-gray-200" />
    {children}
  </div>
)

const SubSection = ({ title, description, children }) => (
  <div className="mb-8">
    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">{title}</h3>
    {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}
    {children}
  </div>
)

const Preview = ({ children, className }) => (
  <div
    className={`flex flex-col gap-3 p-6 bg-gray-50 border border-gray-200 rounded-lg mb-3 ${className ?? ''}`}
  >
    {children}
  </div>
)

const Code = ({ children }) => (
  <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto mb-4 leading-relaxed">
    <code>{children}</code>
  </pre>
)

const Tag = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-600',
    violet: 'bg-violet-100 text-violet-700',
    green: 'bg-green-100 text-green-700',
  }
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-medium ${colors[color]}`}
    >
      {children}
    </span>
  )
}

const ApiTable = ({ headers, rows }) => (
  <div className="overflow-x-auto mb-4">
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h) => (
            <th
              key={h}
              className="text-left px-3 py-2 border border-gray-200 font-semibold text-gray-700 text-xs uppercase tracking-wide"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="even:bg-gray-50">
            {row.map((cell, j) => (
              <td
                key={j}
                className={`px-3 py-2 border border-gray-200 text-xs ${
                  j === 0
                    ? 'font-mono text-violet-700'
                    : j <= 2
                      ? 'font-mono text-gray-500'
                      : 'text-gray-700'
                }`}
              >
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

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

// ─── Mock data ────────────────────────────────────────────────────────────────

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

const FILE_IMAGE = { name: 'photo.jpg', size: 2_400_000, type: 'image/jpeg', url: PLACEHOLDER_IMG }
const FILE_PDF = { name: 'contract.pdf', size: 1_024_000, type: 'application/pdf', url: null }
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
const FILE_VIDEO = { name: 'demo.mp4', size: 18_000_000, type: 'video/mp4', url: null }
const FILE_AUDIO = { name: 'recording.mp3', size: 3_200_000, type: 'audio/mpeg', url: null }
const FILE_OTHER = { name: 'archive.zip', size: 4_100_000, type: 'application/zip', url: null }

// ─── Stateful helpers ─────────────────────────────────────────────────────────

function DropzoneDemo(props) {
  const [files, setFiles] = useState([])
  const handleAdd = (newFiles) =>
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: Math.random(), file: f, status: 'idle', progress: 0 })),
    ])
  const handleRemove = (id) => setFiles((prev) => prev.filter((f) => f.id !== id))

  return (
    <AttachmentGroup trigger="dropzone" onFilesAdd={handleAdd} {...props}>
      {files.map((f) => (
        <Attachment
          key={f.id}
          file={f.file}
          status={f.status}
          progress={f.progress}
          onRemove={() => handleRemove(f.id)}
        />
      ))}
    </AttachmentGroup>
  )
}

function ButtonDemo(props) {
  const [files, setFiles] = useState([])
  const handleAdd = (newFiles) =>
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: Math.random(), file: f, status: 'idle', progress: 0 })),
    ])
  const handleRemove = (id) => setFiles((prev) => prev.filter((f) => f.id !== id))

  return (
    <AttachmentGroup trigger="button" onFilesAdd={handleAdd} {...props}>
      {files.map((f) => (
        <Attachment
          key={f.id}
          file={f.file}
          status={f.status}
          progress={f.progress}
          onRemove={() => handleRemove(f.id)}
        />
      ))}
    </AttachmentGroup>
  )
}

// ─── Story ────────────────────────────────────────────────────────────────────

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="p-8 max-w-4xl font-sans text-gray-900">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Attachment</h1>
          <Tag color="violet">Base Component</Tag>
        </div>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          File upload component with support for multiple files, file type icons, upload progress,
          inline image preview, and error states.{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">AttachmentGroup</code>{' '}
          provides the upload trigger (dropzone or button).{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-sm">Attachment</code> renders a
          single file row. Parent manages the file list and upload logic.
        </p>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <span className="text-[10px] font-mono text-violet-700 mb-2 block">Before upload</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <AttachmentGroup onFilesAdd={() => {}}>{[]}</AttachmentGroup>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-violet-700 mb-2 block">After upload</span>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <AttachmentGroup onFilesAdd={() => {}}>
                <Attachment file={FILE_PDF} status="idle" onRemove={() => {}} />
                <Attachment
                  file={FILE_IMAGE}
                  status="uploading"
                  progress={65}
                  onRemove={() => {}}
                />
                <Attachment file={FILE_DOC} status="done" onRemove={() => {}} />
                <Attachment
                  file={FILE_SHEET}
                  status="error"
                  errorTitle="Upload failed"
                  errorDescription="File size exceeds 10 MB limit."
                  onRemove={() => {}}
                  onRetry={() => {}}
                />
              </AttachmentGroup>
            </div>
          </div>
        </div>
      </Section>

      {/* Anatomy */}
      <Section
        title="Anatomy"
        description="AttachmentGroup owns the upload trigger and wraps the file list. Each Attachment row is built from composable parts."
      >
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl mb-4 overflow-x-auto">
          <div className="flex gap-16">
            {/* AttachmentGroup diagram */}
            <div className="flex flex-col gap-2 shrink-0 w-80">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                AttachmentGroup
              </span>
              <div className="relative px-4 pt-6 pb-4 border-2 border-dashed border-violet-400 rounded-xl">
                <span className="absolute -top-2.5 left-3 bg-gray-50 px-1 text-xs font-mono font-semibold text-violet-600">
                  AttachmentGroup
                </span>

                <div className="relative px-3 pt-5 pb-3 border border-dashed border-blue-300 rounded mb-3">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-blue-500">
                    AttachmentTrigger
                  </span>
                  <div className="flex flex-col items-center gap-1 py-2 rounded border-2 border-dashed border-gray-200 text-gray-300">
                    <span className="text-lg">↑</span>
                    <span className="text-[10px] font-mono">Drop files or browse</span>
                  </div>
                </div>

                <div className="relative px-3 pt-6 pb-3 border border-dashed border-green-300 rounded">
                  <span className="absolute -top-2.5 left-2 bg-gray-50 px-0.5 text-xs font-mono text-green-500">
                    Attachment
                  </span>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1 flex items-center gap-2 px-2 pt-5 pb-2 border border-dashed border-orange-300 rounded">
                      <span className="absolute -top-2.5 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-orange-400">
                        AttachmentContent
                      </span>
                      <div className="size-6 rounded bg-violet-100 shrink-0 border border-dashed border-orange-200 flex items-center justify-center">
                        <span className="text-[8px] font-mono text-orange-400">Icon</span>
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1">
                        <div className="h-2 bg-gray-300 rounded w-24" />
                        <div className="h-1.5 bg-gray-200 rounded w-14" />
                        <span className="text-[8px] font-mono text-orange-400">Info</span>
                      </div>
                    </div>
                    <div className="relative px-1.5 pt-5 pb-1 border border-dashed border-pink-300 rounded shrink-0">
                      <span className="absolute -top-2.5 left-0 bg-gray-50 px-0.5 text-[10px] font-mono text-pink-400">
                        Actions
                      </span>
                      <div className="flex gap-0.5">
                        <div className="size-4 rounded bg-gray-100" />
                        <div className="size-4 rounded bg-gray-100" />
                      </div>
                    </div>
                  </div>

                  <div className="relative mt-2 px-2 pt-4 pb-2 border border-dashed border-sky-300 rounded">
                    <span className="absolute -top-2.5 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-sky-400">
                      AttachmentProgress
                    </span>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full w-2/3 bg-violet-400 rounded-full" />
                    </div>
                  </div>

                  <div className="relative mt-2 px-2 pt-4 pb-2 border border-dashed border-teal-300 rounded">
                    <span className="absolute -top-2.5 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-teal-400">
                      AttachmentPreview
                    </span>
                    <div className="h-10 bg-violet-50 rounded flex items-center justify-center">
                      <span className="text-[10px] font-mono text-violet-300">image inline</span>
                    </div>
                  </div>

                  <div className="relative mt-2 px-2 pt-4 pb-2 border border-dashed border-red-300 rounded">
                    <span className="absolute -top-2.5 left-1 bg-gray-50 px-0.5 text-[10px] font-mono text-red-400">
                      AttachmentError
                    </span>
                    <div className="h-6 bg-red-50 rounded flex items-center px-2">
                      <span className="text-[10px] font-mono text-red-300">
                        title · description
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parts table */}
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wide mb-1">
                Parts
              </span>
              <table className="text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    {['Part', 'Visible when'].map((h) => (
                      <th
                        key={h}
                        className="text-left px-3 py-1.5 border border-gray-200 font-semibold text-gray-600 uppercase tracking-wide text-[10px]"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AttachmentGroup', 'Always — wraps trigger + list'],
                    ['AttachmentTrigger', 'showTriggerAlways=true or no files yet'],
                    ['AttachmentIcon', 'Always — auto-detect from MIME type'],
                    ['AttachmentInfo', 'Always — name · size · status text'],
                    ['AttachmentActions', 'Always — buttons adapt to status'],
                    ['AttachmentProgress', 'status="uploading"'],
                    ['AttachmentPreview', 'User toggles, image files with URL only'],
                    ['AttachmentError', 'status="error"'],
                  ].map(([part, when]) => (
                    <tr key={part} className="even:bg-gray-50">
                      <td className="px-3 py-1.5 border border-gray-200 font-mono text-violet-700 whitespace-nowrap text-xs">
                        {part}
                      </td>
                      <td className="px-3 py-1.5 border border-gray-200 text-gray-600 text-xs">
                        {when}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Code>{`import AttachmentGroup from '@/components/base/Attachment/AttachmentGroup'
import Attachment from '@/components/base/Attachment/Attachment'

{/* Pre-assembled — default name / size / status layout */}
<AttachmentGroup onFilesAdd={handleAdd}>
  {files.map(f => (
    <Attachment
      key={f.id}
      file={f.file}
      status={f.status}
      progress={f.progress}
      onRemove={() => handleRemove(f.id)}
    />
  ))}
</AttachmentGroup>

{/* Composable — custom AttachmentInfo content */}
import { AttachmentIcon, AttachmentInfo, AttachmentContent, AttachmentActions } from '@/components/base/Attachment/attachmentParts'

<AttachmentContent>
  <AttachmentIcon file={file} />
  <AttachmentInfo>
    <p className="text-sm font-medium">{file.name}</p>
    <span className="text-xs text-gray-400">Uploaded by John · 2 min ago</span>
  </AttachmentInfo>
</AttachmentContent>`}</Code>
      </Section>

      {/* Trigger Types */}
      <Section title="Trigger Types">
        <SubSection
          title="Dropzone"
          description='trigger="dropzone" (default) — dashed drop area. Click or drag files onto it.'
        >
          <Preview>
            <DropzoneDemo />
          </Preview>
          <Code>{`<AttachmentGroup
  trigger="dropzone"
  accept="image/*, .pdf"
  maxSize={10 * 1024 * 1024}
  onFilesAdd={handleAdd}
>
  {files.map(f => <Attachment key={f.id} {...f} onRemove={...} />)}
</AttachmentGroup>`}</Code>
        </SubSection>

        <SubSection
          title="Button"
          description='trigger="button" — compact attach button. Useful in comment boxes or inline form fields.'
        >
          <Preview>
            <ButtonDemo />
          </Preview>
          <Code>{`<AttachmentGroup trigger="button" onFilesAdd={handleAdd}>
  {files.map(f => <Attachment key={f.id} {...f} onRemove={...} />)}
</AttachmentGroup>`}</Code>
        </SubSection>

        <SubSection
          title="Custom Label"
          description="AttachmentTrigger accepts a label prop (string or ReactNode) to override the default text."
        >
          <Preview>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-violet-700">label — string</span>
                <AttachmentTrigger
                  variant="dropzone"
                  label="Upload your documents here"
                  onClick={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-violet-700">label — ReactNode</span>
                <AttachmentTrigger
                  variant="dropzone"
                  label={
                    <>
                      Drag & drop atau <span className="text-violet-600">pilih file</span>
                    </>
                  }
                  onClick={() => {}}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-mono text-violet-700">
                  trigger="button" + label
                </span>
                <AttachmentTrigger variant="button" label="Upload lampiran" onClick={() => {}} />
              </div>
            </div>
          </Preview>
          <Code>{`import { AttachmentTrigger } from '@/components/base/Attachment/attachmentParts'

<AttachmentTrigger variant="dropzone" label="Upload your documents here" onClick={...} />

<AttachmentTrigger
  variant="dropzone"
  label={<>Drag & drop atau <span className="text-violet-600">pilih file</span></>}
  onClick={...}
/>

<AttachmentTrigger variant="button" label="Upload lampiran" onClick={...} />`}</Code>
        </SubSection>
      </Section>

      {/* Status */}
      <Section
        title="Status"
        description="Each Attachment row has four states. Parent owns status and updates it as the upload progresses."
      >
        <Preview>
          <div className="flex flex-col gap-3">
            {[
              { label: 'status="idle"', file: FILE_PDF, status: 'idle', props: {} },
              {
                label: 'status="uploading"',
                file: FILE_IMAGE,
                status: 'uploading',
                props: { progress: 65 },
              },
              { label: 'status="done"', file: FILE_DOC, status: 'done', props: {} },
              {
                label: 'status="error"',
                file: FILE_SHEET,
                status: 'error',
                props: {
                  errorTitle: 'Upload failed',
                  errorDescription: 'File size exceeds the 10 MB limit.',
                },
              },
            ].map(({ label, file, status, props }) => (
              <div key={status}>
                <span className="text-[10px] font-mono text-violet-700 mb-1 block">{label}</span>
                <Attachment
                  file={file}
                  status={status}
                  onRemove={() => {}}
                  onRetry={() => {}}
                  {...props}
                />
              </div>
            ))}
          </div>
        </Preview>
        <Code>{`{/* idle — no progress or error */}
<Attachment file={file} status="idle" onRemove={handleRemove} />

{/* uploading — shows progress bar */}
<Attachment file={file} status="uploading" progress={65} onRemove={handleRemove} />

{/* done — shows download button (when file.url is set) */}
<Attachment file={file} status="done" onRemove={handleRemove} />

{/* error — shows AttachmentError + retry button */}
<Attachment
  file={file}
  status="error"
  errorTitle="Upload failed"
  errorDescription="File size exceeds the 10 MB limit."
  onRemove={handleRemove}
  onRetry={handleRetry}
/>`}</Code>
      </Section>

      {/* File Type Icons */}
      <Section
        title="File Type Icons"
        description="AttachmentIcon auto-detects the file category from the MIME type and always shows an icon — no thumbnail."
      >
        <Preview>
          <div className="flex flex-col gap-2">
            {[
              { label: 'image', file: FILE_IMAGE },
              { label: 'pdf', file: FILE_PDF },
              { label: 'doc', file: FILE_DOC },
              { label: 'sheet', file: FILE_SHEET },
              { label: 'video', file: FILE_VIDEO },
              { label: 'audio', file: FILE_AUDIO },
              { label: 'other (generic)', file: FILE_OTHER },
            ].map(({ label, file }) => (
              <div key={label}>
                <span className="text-[10px] font-mono text-violet-700 mb-1 block">{label}</span>
                <Attachment file={file} status="done" onRemove={() => {}} />
              </div>
            ))}
          </div>
        </Preview>
        <Code>{`// Icon is determined by MIME type — no thumbnail
const imageFile = { name: 'photo.jpg', size: 2400000, type: 'image/jpeg', url: '/uploads/photo.jpg' }
// → shows FileImage icon (violet)`}</Code>
      </Section>

      {/* Image Preview */}
      <Section
        title="Image Preview"
        description="For image files with a URL, a chevron button appears in AttachmentActions. Clicking it expands an inline preview below the row."
      >
        <Preview>
          <Attachment file={FILE_IMAGE} status="done" onRemove={() => {}} />
          <p className="text-xs text-gray-400">← Click the chevron button to expand the preview</p>
        </Preview>
        <Code>{`// Preview toggle appears automatically when:
// file.type starts with "image/" AND file.url is set AND status is "done"

<Attachment
  file={{ name: 'photo.jpg', size: 2400000, type: 'image/jpeg', url: '/uploads/photo.jpg' }}
  status="done"
  onRemove={handleRemove}
/>`}</Code>
      </Section>

      {/* Constraints */}
      <Section
        title="Constraints"
        description="accept filters the native file picker. maxFiles hides the trigger when the limit is reached. maxSize silently filters oversized files before calling onFilesAdd."
      >
        <SubSection title="accept + maxFiles + maxSize">
          <Preview>
            <DropzoneDemo accept="image/*, .pdf" maxFiles={3} maxSize={5 * 1024 * 1024} />
          </Preview>
          <Code>{`<AttachmentGroup
  accept="image/*, .pdf"      // shown as hint in dropzone
  maxFiles={3}                // trigger hidden after 3 files
  maxSize={5 * 1024 * 1024}  // 5 MB — oversized files filtered silently
  onFilesAdd={handleAdd}
>
  ...
</AttachmentGroup>`}</Code>
        </SubSection>

        <SubSection
          title="showTriggerAlways"
          description="Controls whether the upload trigger remains visible after files are added. Default true. Set false to hide the trigger once files are present."
        >
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-[10px] font-mono text-violet-700 mb-2 block">
                showTriggerAlways=true (default)
              </span>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col items-center gap-1 py-3 rounded border-2 border-dashed border-gray-200 text-gray-300">
                    <span className="text-sm">↑</span>
                    <span className="text-[10px] font-mono">Drop files or browse</span>
                  </div>
                  <Attachment file={FILE_PDF} status="done" onRemove={() => {}} />
                </div>
              </div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-violet-700 mb-2 block">
                showTriggerAlways=false
              </span>
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <Attachment file={FILE_PDF} status="done" onRemove={() => {}} />
              </div>
            </div>
          </div>
          <Code>{`{/* Trigger stays visible after files added (default) */}
<AttachmentGroup showTriggerAlways onFilesAdd={handleAdd}>
  ...
</AttachmentGroup>

{/* Trigger hides once files are present */}
<AttachmentGroup showTriggerAlways={false} onFilesAdd={handleAdd}>
  ...
</AttachmentGroup>`}</Code>
        </SubSection>

        <SubSection
          title="Single File"
          description="Use multiple={false} + maxFiles={1} + showTriggerAlways={false} to enforce a single-file replacement pattern."
        >
          <Preview>
            <ButtonDemo multiple maxFiles={1} showTriggerAlways={false} />
          </Preview>
          <Code>{`<AttachmentGroup
  trigger="button"
  multiple={false}
  maxFiles={1}
  showTriggerAlways={false}
  onFilesAdd={handleAdd}
>
  ...
</AttachmentGroup>`}</Code>
        </SubSection>
      </Section>

      {/* react-hook-form */}
      <Section
        title="With react-hook-form"
        description="Use a controlled state alongside setValue/watch. Collect file URLs after upload completes and pass them to the form payload."
      >
        <Code>{`import { useForm } from 'react-hook-form'

const { setValue, watch } = useForm()
const attachments = watch('attachments', [])

const handleAdd = (files) => {
  const items = files.map(f => ({ id: crypto.randomUUID(), file: f, status: 'idle', progress: 0 }))
  setValue('attachments', [...attachments, ...items])
}

const handleRemove = (id) => {
  setValue('attachments', attachments.filter(f => f.id !== id))
}

<AttachmentGroup onFilesAdd={handleAdd}>
  {attachments.map(att => (
    <Attachment
      key={att.id}
      file={att.file}
      status={att.status}
      progress={att.progress}
      errorTitle={att.errorTitle}
      errorDescription={att.errorDescription}
      onRemove={() => handleRemove(att.id)}
      onRetry={() => retryUpload(att.id)}
    />
  ))}
</AttachmentGroup>

{/* Extract URLs after upload for API payload */}
const urls = attachments.filter(a => a.status === 'done').map(a => a.file.url)`}</Code>
      </Section>

      {/* API Reference */}
      <Section title="API Reference">
        <SubSection title="AttachmentGroup">
          <ApiTable
            headers={['Prop', 'Type', 'Default', 'Description']}
            rows={[
              ['trigger', '"dropzone" | "button"', '"dropzone"', 'Upload trigger style.'],
              [
                'showTriggerAlways',
                'boolean',
                'true',
                'Keep trigger visible after files are added. Hides automatically when maxFiles is reached.',
              ],
              [
                'accept',
                'string',
                '—',
                'Native file picker filter. Also shown as a hint in the dropzone subtitle.',
              ],
              [
                'multiple',
                'boolean',
                'true',
                'Allow picking multiple files at once in the file picker.',
              ],
              [
                'maxFiles',
                'number',
                '—',
                'Maximum total files. Trigger hidden when limit is reached.',
              ],
              [
                'maxSize',
                'number',
                '—',
                'Max bytes per file. Oversized files are filtered before onFilesAdd is called.',
              ],
              [
                'onFilesAdd',
                '(files: File[]) => void',
                '—',
                'Fires with an array of valid File objects. Parent manages upload logic.',
              ],
              ['children', 'ReactNode', '—', 'Attachment rows.'],
              ['className', 'string', '—', 'Additional classes on the wrapper.'],
            ]}
          />
        </SubSection>

        <SubSection title="AttachmentTrigger">
          <ApiTable
            headers={['Prop', 'Type', 'Default', 'Description']}
            rows={[
              ['variant', '"dropzone" | "button"', '"dropzone"', 'Visual style of the trigger.'],
              [
                'label',
                'ReactNode | string',
                '"Drop files here or browse"',
                'Override the default trigger label. Accepts plain text or JSX.',
              ],
              ['accept', 'string', '—', 'Shown as a subtitle hint below the dropzone label.'],
              ['sizeHint', 'string', '—', 'Shown as a subtitle hint (e.g. "Max 10 MB per file").'],
              ['onClick', '() => void', '—', 'Fires when the trigger is clicked.'],
              ['onDrop', 'DragEventHandler', '—', 'Fires when files are dropped (dropzone only).'],
              [
                'onDragOver',
                'DragEventHandler',
                '—',
                'Fires on drag-over to prevent default browser behavior (dropzone only).',
              ],
            ]}
          />
        </SubSection>

        <SubSection title="Attachment">
          <ApiTable
            headers={['Prop', 'Type', 'Default', 'Description']}
            rows={[
              [
                'file',
                '{ name, size, type, url? } | File',
                '—',
                'File metadata. Pass url after upload to enable download and image preview.',
              ],
              [
                'status',
                '"idle" | "uploading" | "done" | "error"',
                '"idle"',
                'Controls which parts are visible: progress bar, error block, action buttons.',
              ],
              [
                'progress',
                'number',
                '0',
                '0–100. Used by AttachmentProgress when status="uploading".',
              ],
              [
                'errorTitle',
                'string',
                '"Upload failed"',
                'Heading shown in AttachmentError when status="error".',
              ],
              ['errorDescription', 'string', '—', 'Detail message shown below errorTitle.'],
              [
                'onRemove',
                '() => void',
                '—',
                'Fires when the trash button is clicked. Parent removes the item from state.',
              ],
              [
                'onRetry',
                '() => void',
                '—',
                'Fires when the retry button is clicked. Shown only when status="error".',
              ],
              ['className', 'string', '—', 'Additional classes on the row wrapper.'],
            ]}
          />
        </SubSection>
      </Section>

      {/* Best Practices */}
      <Section title="Best Practices">
        <BestPractices
          items={[
            {
              heading: 'When to use',
              cards: [
                {
                  title: 'Use AttachmentGroup + Attachment for all file upload flows',
                  body: 'AttachmentGroup handles the trigger and file picking. Attachment handles the row UI. Never build a custom file row from scratch — compose with these instead.',
                },
                {
                  title: 'Use dropzone for primary upload, button for inline fields',
                  body: 'A dashed drop area emphasizes the upload as a key action. Reserve the button trigger for compact contexts where a large drop area would dominate the layout.',
                },
                {
                  title: 'Always set accept and maxSize to set clear expectations',
                  body: 'Users should not discover file restrictions by hitting an error. Surface type and size limits in the dropzone subtitle before they pick a file.',
                },
              ],
            },
            {
              heading: 'Advice',
              cards: [
                {
                  title: 'Start upload in onFilesAdd — do not wait for form submit',
                  body: 'Users expect immediate feedback when they select files. Begin uploading and set status to "uploading" right away. Attach the resulting URL to the file object and let the form submit collect it.',
                },
                {
                  title: 'Always provide onRetry for network errors',
                  body: 'Network failures are temporary. A retry button lets users recover without re-selecting the file. Omit onRetry only when the failure is permanent (e.g. invalid file type).',
                },
                {
                  title: 'Never auto-remove rows on done — keep them visible',
                  body: 'The "Uploaded" label in done state is the user\'s confirmation. Auto-removing the row on success removes that feedback and can feel like the file was lost.',
                },
              ],
            },
          ]}
        />
      </Section>
    </div>
  ),
}
