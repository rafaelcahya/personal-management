import { useState } from 'react'
import AttachmentGroup from './AttachmentGroup'
import Attachment from './Attachment'
import { AttachmentTrigger } from './attachmentParts'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Attachment/Basic',
}

export default meta

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GroupDemo({ trigger = 'dropzone', ...props }) {
  const [files, setFiles] = useState([])
  const handleAdd = (newFiles) =>
    setFiles((prev) => [
      ...prev,
      ...newFiles.map((f) => ({ id: Math.random(), file: f, status: 'idle' })),
    ])
  const handleRemove = (id) => setFiles((prev) => prev.filter((f) => f.id !== id))

  return (
    <AttachmentGroup trigger={trigger} onFilesAdd={handleAdd} {...props}>
      {files.map((f) => (
        <Attachment
          key={f.id}
          file={f.file}
          status={f.status}
          onRemove={() => handleRemove(f.id)}
        />
      ))}
    </AttachmentGroup>
  )
}

// ─── Basic ────────────────────────────────────────────────────────────────────

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Default dropzone trigger. Click or drag files onto the area to add them. Parent receives{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">File[]</code> via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onFilesAdd</code> and manages
        the file list and upload logic.
      </p>

      <div className="w-full max-w-lg">
        <GroupDemo />
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`const [files, setFiles] = useState([])

const handleAdd = (newFiles) => {
  setFiles(prev => [
    ...prev,
    ...newFiles.map(f => ({ id: crypto.randomUUID(), file: f, status: 'idle', progress: 0 })),
  ])
}

const handleRemove = (id) => setFiles(prev => prev.filter(f => f.id !== id))

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
</AttachmentGroup>`}</code>
      </pre>
    </div>
  ),
}

// ─── TriggerTypes ─────────────────────────────────────────────────────────────

export const TriggerTypes = {
  name: 'Trigger Types',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">trigger="dropzone"</code> shows
        a dashed drop area — best for primary upload areas.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">trigger="button"</code> shows a
        compact button — best for inline fields or comment boxes.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            trigger="dropzone" (default)
          </span>
          <GroupDemo trigger="dropzone" />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">trigger="button"</span>
          <GroupDemo trigger="button" />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`<AttachmentGroup trigger="dropzone" onFilesAdd={handleAdd}>
  ...
</AttachmentGroup>

<AttachmentGroup trigger="button" onFilesAdd={handleAdd}>
  ...
</AttachmentGroup>`}</code>
      </pre>
    </div>
  ),
}

// ─── CustomLabel ──────────────────────────────────────────────────────────────

export const CustomLabel = {
  name: 'Custom Label',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        Use <code className="font-mono bg-gray-100 px-1 rounded text-xs">AttachmentTrigger</code>{' '}
        directly with the <code className="font-mono bg-gray-100 px-1 rounded text-xs">label</code>{' '}
        prop to override the default text. Accepts a plain string or any ReactNode.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-lg">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">string label</span>
          <AttachmentTrigger
            variant="dropzone"
            label="Upload your documents here"
            onClick={() => {}}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">ReactNode label</span>
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
          <span className="text-[10px] font-mono text-violet-700">button + label</span>
          <AttachmentTrigger variant="button" label="Upload lampiran" onClick={() => {}} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`import { AttachmentTrigger } from '@/components/base/Attachment/attachmentParts'

<AttachmentTrigger
  variant="dropzone"
  label="Upload your documents here"
  onClick={() => inputRef.current?.click()}
/>

<AttachmentTrigger
  variant="dropzone"
  label={<>Drag & drop atau <span className="text-violet-600">pilih file</span></>}
  onClick={() => inputRef.current?.click()}
/>

<AttachmentTrigger
  variant="button"
  label="Upload lampiran"
  onClick={() => inputRef.current?.click()}
/>`}</code>
      </pre>
    </div>
  ),
}

// ─── Constraints ──────────────────────────────────────────────────────────────

export const Constraints = {
  name: 'Constraints',
  render: () => (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl text-center">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">accept</code> filters the
        native file picker and shows a hint in the dropzone.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">maxFiles</code> hides the
        trigger once the limit is reached.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">maxSize</code> silently filters
        oversized files before{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">onFilesAdd</code> fires.
      </p>

      <div className="flex flex-col gap-6 w-full max-w-lg">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            accept="image/*, .pdf" maxFiles=3 maxSize=5MB
          </span>
          <GroupDemo accept="image/*, .pdf" maxFiles={3} maxSize={5 * 1024 * 1024} />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-violet-700">
            single file only (maxFiles=1 showTriggerAlways=false)
          </span>
          <GroupDemo trigger="button" maxFiles={1} showTriggerAlways={false} />
        </div>
      </div>

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Multiple with constraints */}
<AttachmentGroup
  accept="image/*, .pdf"
  maxFiles={3}
  maxSize={5 * 1024 * 1024}
  onFilesAdd={handleAdd}
>
  ...
</AttachmentGroup>

{/* Single file only */}
<AttachmentGroup
  trigger="button"
  multiple={false}
  maxFiles={1}
  showTriggerAlways={false}
  onFilesAdd={handleAdd}
>
  ...
</AttachmentGroup>`}</code>
      </pre>
    </div>
  ),
}
