import { Slash } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Breadcrumb/Custom Separator',
}

export default meta

const BestPractices = ({ items }) => (
  <div className="flex flex-col gap-8 w-full max-w-2xl">
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

export const CustomSeparator = {
  name: 'Custom Separator',
  render: () => (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">BreadcrumbSeparator</code>{' '}
        defaults to a{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">ChevronRight</code> icon. Pass
        any icon or text character as{' '}
        <code className="font-mono bg-gray-100 px-1 rounded text-xs">children</code> to override it.
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">default — ChevronRight</span>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Running</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Activities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">Slash icon</span>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Running</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Activities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">text "/"</span>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Running</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Activities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-gray-400">dot "·"</span>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>·</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Running</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>·</BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Activities</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <BestPractices
        items={[
          {
            heading: 'When to use',
            cards: [
              {
                title: "Use a custom separator to match your app's visual language",
                body: 'ChevronRight (default) works for most apps. Use Slash or "/" for file path–style navigation like a document editor or file browser where "/" is the conventional path delimiter.',
              },
            ],
          },
          {
            heading: 'When not to use',
            cards: [
              {
                title: "Don't mix separator styles across pages",
                body: 'Pick one separator and use it everywhere. Mixing ChevronRight on some pages and "/" on others creates visual inconsistency that makes the breadcrumb feel like different components.',
              },
            ],
          },
          {
            heading: 'Accessibility',
            cards: [
              {
                title:
                  'BreadcrumbSeparator is aria-hidden="true" by default — don\'t add it manually',
                body: 'Screen readers skip the separator automatically regardless of which character or icon you pass as children. No extra aria attributes are needed for any separator style.',
              },
            ],
          },
          {
            heading: 'Advice',
            cards: [
              {
                title: 'Prefer ChevronRight over "/" for most product UIs',
                body: 'ChevronRight visually implies forward direction and reads as navigation. "/" implies a file path, which can feel too technical in a product UI. Only switch if the context genuinely calls for it.',
              },
            ],
          },
        ]}
      />

      <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed w-full max-w-2xl">
        <code>{`{/* Default */}
<BreadcrumbSeparator />

{/* Custom icon */}
<BreadcrumbSeparator>
  <Slash />
</BreadcrumbSeparator>

{/* Text character */}
<BreadcrumbSeparator>/</BreadcrumbSeparator>`}</code>
      </pre>
    </div>
  ),
}
