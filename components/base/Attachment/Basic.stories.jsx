import { useState } from 'react'
import AttachmentGroup from './AttachmentGroup'
import Attachment from './Attachment'
import { AttachmentTrigger } from './attachmentParts'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Input/Attachment/Basic',
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

export const Basic = {
  name: 'Basic',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Default dropzone trigger. Click or drag files onto the area to add them. Parent receives{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">File[]</code> via{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onFilesAdd</code> and manages the file
        list, status, and upload logic.
      </span>

      <div className="flex flex-col gap-3">
        <GroupDemo />
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Pair AttachmentGroup with Attachment — parent owns state',
                body: 'AttachmentGroup fires onFilesAdd; parent holds the file list, status, and progress. Attachment renders each row. Never embed upload logic inside the components.',
              },
              {
                title: 'Start upload immediately in onFilesAdd',
                body: 'Begin the upload as soon as files arrive and set status to "uploading". Users expect instant feedback — do not wait for a form submit to start the request.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Always pass onRemove so users can cancel',
                body: 'Attach onRemove to every Attachment row. Even mid-upload, users may change their mind. Abort the in-flight request in the handler before removing the item from state.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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

export const TriggerTypes = {
  name: 'Trigger Types',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">trigger="dropzone"</code> shows a
        dashed drop area — best for primary upload sections.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">trigger="button"</code> shows a compact
        button — best for inline fields or comment boxes.
      </span>

      <div className="flex flex-col gap-6">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use dropzone for primary upload areas',
                body: 'A dashed drop area signals drag-and-drop support clearly. Use it as the main upload zone on dedicated upload screens or form sections where files are a primary input.',
              },
              {
                title: 'Use button for compact or inline contexts',
                body: 'A button trigger takes far less space and fits naturally in comment boxes, side panels, or inline form fields where a large drop area would dominate the layout.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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

export const CustomLabel = {
  name: 'Custom Label',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        Use <code className="font-mono bg-gray-100 px-1 rounded">AttachmentTrigger</code> directly
        with the <code className="font-mono bg-gray-100 px-1 rounded">label</code> prop to override
        the default text. Accepts a plain string or any ReactNode.
      </span>

      <div className="flex flex-col gap-4">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Override the label when the default text does not match your context',
                body: 'The default "Drop files here or browse" is English and generic. Override it when the app is localized, the accepted file type is specific (e.g. "Upload your ID photo"), or the tone needs to match the product voice.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Mention the accepted type or size in the label or sizeHint',
                body: 'Users should not discover format restrictions by hitting an error. If only PDFs are accepted, say so in the label or via the accept + maxSize hints shown in the dropzone subtitle.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
        <code>{`import { AttachmentTrigger } from '@/components/base/Attachment/attachmentParts'

{/* String label */}
<AttachmentTrigger
  variant="dropzone"
  label="Upload your documents here"
  onClick={() => inputRef.current?.click()}
/>

{/* JSX label */}
<AttachmentTrigger
  variant="dropzone"
  label={<>Drag & drop atau <span className="text-violet-600">pilih file</span></>}
  onClick={() => inputRef.current?.click()}
/>

{/* Button trigger */}
<AttachmentTrigger
  variant="button"
  label="Upload lampiran"
  onClick={() => inputRef.current?.click()}
/>`}</code>
      </pre>
    </div>
  ),
}

export const Constraints = {
  name: 'Constraints',
  render: () => (
    <div className="flex flex-col gap-10 p-8 max-w-2xl w-full">
      <span className="text-xs text-gray-400">
        <code className="font-mono bg-gray-100 px-1 rounded">accept</code> filters the native file
        picker and shows a hint in the dropzone.{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">maxFiles</code> hides the trigger once
        the limit is reached. <code className="font-mono bg-gray-100 px-1 rounded">maxSize</code>{' '}
        silently filters oversized files before{' '}
        <code className="font-mono bg-gray-100 px-1 rounded">onFilesAdd</code> fires.
      </span>

      <div className="flex flex-col gap-6">
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

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: 'Use accept to filter at the native picker level',
                body: 'Filtering at the browser picker prevents users from even selecting the wrong file type — cleaner than validating after selection and showing an error.',
              },
              {
                title: 'Use maxFiles=1 + showTriggerAlways=false for single-file replacement',
                body: 'Combine maxFiles with showTriggerAlways={false} so the trigger disappears once a file is selected. The user must remove the current file before they can add another.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Notify users when maxSize silently filters their file',
                body: 'maxSize drops oversized files without feedback. If users could reasonably select large files, show a toast or error message explaining why their file was not accepted.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full">
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
