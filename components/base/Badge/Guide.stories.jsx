import { Star, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react'
import { Badge } from './Badge'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Badge',
}

export default meta

export const Docs = {
  name: 'Docs',
  render: () => (
    <div className="flex flex-col gap-10 w-full max-w-3xl py-6 px-2">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900">Badge</h1>
        <p className="text-base text-gray-500 leading-relaxed">
          A small inline label used to highlight status, category, or metadata. Supports four
          semantic variants, five sizes, and three border-radius options.
        </p>
      </div>

      {/* Overview */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Overview</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">Active</Badge>
          <Badge variant="secondary">Draft</Badge>
          <Badge variant="destructive">Error</Badge>
          <Badge variant="outline">Pending</Badge>
          <Badge variant="default">
            <CheckCircle2 />
            Verified
          </Badge>
          <Badge size="lg" variant="secondary">
            Large
          </Badge>
          <Badge radius="md" variant="outline">
            Rounded
          </Badge>
        </div>
        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`import { Badge } from '@/components/base/Badge/Badge'

<Badge variant="default">Active</Badge>
<Badge variant="secondary">Draft</Badge>
<Badge size="lg" radius="md">Large Rounded</Badge>`}</code>
        </pre>
      </section>

      {/* Anatomy */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Anatomy</h2>
        <div className="overflow-x-auto w-full">
          <div className="min-w-max py-4">
            {/* Badge outer box */}
            <div className="relative inline-flex items-center gap-2 border-2 border-dashed border-gray-400 rounded px-4 py-3 pt-9">
              <span className="absolute top-1.5 left-2.5 text-[10px] font-mono text-gray-500">
                Badge
              </span>

              {/* Left icon */}
              <div className="relative flex items-center justify-center border-2 border-dashed border-violet-400 rounded p-2 pt-6 min-w-[58px]">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                  icon (opt)
                </span>
                <Star size={14} className="text-gray-400" />
              </div>

              {/* Label */}
              <div className="relative border-2 border-dashed border-blue-400 rounded px-3 py-1.5 pt-6">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-blue-500 whitespace-nowrap">
                  label
                </span>
                <span className="text-xs font-medium text-gray-700">Badge</span>
              </div>

              {/* Right icon */}
              <div className="relative flex items-center justify-center border-2 border-dashed border-violet-400 rounded p-2 pt-6 min-w-[58px]">
                <span className="absolute top-1 left-1.5 text-[10px] font-mono text-violet-500 whitespace-nowrap">
                  icon (opt)
                </span>
                <X size={14} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium w-32">
                Part
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">Badge</td>
              <td className="py-2.5 text-gray-600 text-xs">
                The outer container — a <code className="bg-gray-100 px-1 rounded">span</code> by
                default, or the child element when{' '}
                <code className="bg-gray-100 px-1 rounded">asChild</code> is used.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">icon (optional)</td>
              <td className="py-2.5 text-gray-600 text-xs">
                Any SVG placed before or after the label. Auto-sized to 12px via{' '}
                <code className="bg-gray-100 px-1 rounded">[&gt;svg]:size-3</code>.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">label</td>
              <td className="py-2.5 text-gray-600 text-xs">
                Text content inside the badge. Keep it short — 1 to 3 words.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Variants */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Variants</h2>
        <p className="text-sm text-gray-500">
          Four semantic variants map to different levels of emphasis and meaning.
        </p>

        <div className="flex flex-col gap-5">
          {[
            {
              variant: 'default',
              desc: 'Primary emphasis — active states, success, or the primary category.',
              labels: ['Active', 'Published', 'New'],
            },
            {
              variant: 'secondary',
              desc: 'Low emphasis — neutral states, drafts, or supplemental info.',
              labels: ['Draft', 'Archived', 'Beta'],
            },
            {
              variant: 'destructive',
              desc: 'Danger or error — failed states, critical warnings.',
              labels: ['Error', 'Failed', 'Expired'],
            },
            {
              variant: 'outline',
              desc: 'Minimal emphasis — pending states, optional info, or tags.',
              labels: ['Pending', 'Review', 'Optional'],
            },
          ].map(({ variant, desc, labels }) => (
            <div key={variant} className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {variant}
                </code>
                <span className="text-xs text-gray-500">{desc}</span>
              </div>
              <div className="flex flex-wrap gap-2 pl-1">
                {labels.map((label) => (
                  <Badge key={label} variant={variant}>
                    {label}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Size</h2>
        <p className="text-sm text-gray-500">
          Five sizes control padding and font size. Default is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">md</code>.
        </p>

        <div className="flex flex-col gap-4">
          {[
            { size: 'xs', classes: 'px-1.5 py-0 text-[10px]' },
            { size: 'sm', classes: 'px-2 py-px text-xs' },
            { size: 'md', classes: 'px-2 py-0.5 text-xs — default' },
            { size: 'lg', classes: 'px-2.5 py-0.5 text-sm' },
            { size: 'xl', classes: 'px-3 py-1 text-sm' },
          ].map(({ size, classes }) => (
            <div key={size} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded w-8">
                  {size}
                </code>
                <span className="text-xs text-gray-400">{classes}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-1">
                <Badge size={size} variant="default">
                  Active
                </Badge>
                <Badge size={size} variant="secondary">
                  Draft
                </Badge>
                <Badge size={size} variant="destructive">
                  Error
                </Badge>
                <Badge size={size} variant="outline">
                  Pending
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`<Badge size="xs">Active</Badge>
<Badge size="sm">Active</Badge>
<Badge size="md">Active</Badge>   {/* default */}
<Badge size="lg">Active</Badge>
<Badge size="xl">Active</Badge>`}</code>
        </pre>
      </section>

      {/* Radius */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Radius</h2>
        <p className="text-sm text-gray-500">
          Seven radius options ranging from sharp corners to a pill shape. Default is{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">full</code>.
        </p>

        <div className="flex flex-col gap-4">
          {[
            { radius: 'none', desc: 'rounded-none — sharp corners' },
            { radius: 'xs', desc: 'rounded-sm — 2px' },
            { radius: 'sm', desc: 'rounded — 4px' },
            { radius: 'base', desc: 'rounded-md — 6px' },
            { radius: 'md', desc: 'rounded-lg — 8px' },
            { radius: 'lg', desc: 'rounded-xl — 12px' },
            { radius: 'full', desc: 'rounded-full — pill shape (default)' },
          ].map(({ radius, desc }) => (
            <div key={radius} className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <code className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded w-10">
                  {radius}
                </code>
                <span className="text-xs text-gray-400">{desc}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 pl-1">
                <Badge radius={radius} variant="default">
                  Active
                </Badge>
                <Badge radius={radius} variant="secondary">
                  Draft
                </Badge>
                <Badge radius={radius} variant="outline">
                  Pending
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`<Badge radius="none">Active</Badge>
<Badge radius="xs">Active</Badge>
<Badge radius="sm">Active</Badge>
<Badge radius="base">Active</Badge>
<Badge radius="md">Active</Badge>
<Badge radius="lg">Active</Badge>
<Badge radius="full">Active</Badge>  {/* default */}`}</code>
        </pre>
      </section>

      {/* With Icon */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">With Icon</h2>
        <p className="text-sm text-gray-500">
          Drop any SVG icon as a sibling of the label text. Icons are auto-sized to{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">12px</code> and spaced via{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">gap-1</code>.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">icon left</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                <CheckCircle2 />
                Active
              </Badge>
              <Badge variant="secondary">
                <Clock />
                Pending
              </Badge>
              <Badge variant="destructive">
                <AlertCircle />
                Error
              </Badge>
              <Badge variant="outline">
                <Star />
                Saved
              </Badge>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-gray-400">icon right</span>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="default">
                Active
                <CheckCircle2 />
              </Badge>
              <Badge variant="secondary">
                Close
                <X />
              </Badge>
              <Badge variant="destructive">
                Remove
                <X />
              </Badge>
              <Badge variant="outline">
                Saved
                <Star />
              </Badge>
            </div>
          </div>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`<Badge variant="default"><CheckCircle2 />Active</Badge>
<Badge variant="secondary">Close<X /></Badge>`}</code>
        </pre>
      </section>

      {/* asChild */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">As Child</h2>
        <p className="text-sm text-gray-500">
          Pass <code className="font-mono bg-gray-100 px-1 rounded text-xs">asChild</code> to merge
          badge styles onto the child element. Useful for rendering a badge as a link or button
          without losing semantics.
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge asChild variant="default">
            <a href="#">View Details</a>
          </Badge>
          <Badge asChild variant="secondary">
            <a href="#">Learn More</a>
          </Badge>
          <Badge asChild variant="outline">
            <button type="button">Dismiss</button>
          </Badge>
        </div>

        <pre className="bg-gray-900 rounded-lg px-5 py-4 text-xs text-green-400 overflow-x-auto leading-relaxed">
          <code>{`<Badge asChild variant="default">
  <a href="/details">View Details</a>
</Badge>

<Badge asChild variant="destructive">
  <button type="button" onClick={handleRemove}>Remove</button>
</Badge>`}</code>
        </pre>
      </section>

      {/* Props */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Props</h2>
        <p className="text-sm text-gray-500">
          All props are on the single{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">Badge</code> component. It
          also forwards all native{' '}
          <code className="font-mono bg-gray-100 px-1 rounded text-xs">span</code> props.
        </p>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Prop
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Type
              </th>
              <th className="text-left py-2 pr-4 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Default
              </th>
              <th className="text-left py-2 text-xs uppercase tracking-wide text-gray-500 font-medium">
                Description
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">variant</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                default | secondary | destructive | outline
              </td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">default</td>
              <td className="py-2.5 text-xs text-gray-600">
                Controls the color and semantic meaning.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">size</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                xs | sm | md | lg | xl
              </td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">md</td>
              <td className="py-2.5 text-xs text-gray-600">Controls padding and font size.</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">radius</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">
                none | xs | sm | base | md | lg | full
              </td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">full</td>
              <td className="py-2.5 text-xs text-gray-600">Controls the border-radius style.</td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">asChild</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">boolean</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">false</td>
              <td className="py-2.5 text-xs text-gray-600">
                Merges badge styles onto the child element.
              </td>
            </tr>
            <tr>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-700">className</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-500">string</td>
              <td className="py-2.5 pr-4 font-mono text-xs text-gray-400">—</td>
              <td className="py-2.5 text-xs text-gray-600">
                Additional CSS classes merged via{' '}
                <code className="bg-gray-100 px-1 rounded">cn()</code>.
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Usage Examples */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Usage Examples</h2>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">
              Status indicator in a table row
            </span>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    { name: 'iPhone 15 Pro', qty: 12, status: 'active', variant: 'default' },
                    { name: 'AirPods Pro', qty: 0, status: 'out of stock', variant: 'destructive' },
                    { name: 'iPad mini', qty: 5, status: 'low stock', variant: 'secondary' },
                  ].map((row) => (
                    <tr key={row.name}>
                      <td className="px-4 py-3 text-gray-800">{row.name}</td>
                      <td className="px-4 py-3 text-gray-500">{row.qty} units</td>
                      <td className="px-4 py-3">
                        <Badge variant={row.variant}>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-700">Tags on a card</span>
            <div className="border rounded-xl p-4 max-w-sm flex flex-col gap-3">
              <p className="font-medium text-gray-800">Portfolio Rebalance</p>
              <p className="text-xs text-gray-500">
                Quarterly review of asset allocation across all positions.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge radius="md" variant="secondary">
                  Investing
                </Badge>
                <Badge radius="md" variant="secondary">
                  Q2 2024
                </Badge>
                <Badge radius="md" variant="outline">
                  In Progress
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* When to Use */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">When to Use</h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {['Use Badge when…', 'Consider an alternative when…'].map((h) => (
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
              <tr>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      You need a short, non-interactive status label (e.g. Active, Draft, Error)
                      next to an item in a list or table.
                    </li>
                    <li>
                      You want to display a numeric count or notification indicator on an icon or
                      nav item (e.g. "3 new", "12 unread").
                    </li>
                    <li>
                      You need to decorate a card or heading with a category or metadata label that
                      users read but do not click.
                    </li>
                  </ul>
                </td>
                <td className="px-3 py-2 border border-gray-200 text-xs text-gray-700 align-top">
                  <ul className="flex flex-col gap-1.5">
                    <li>
                      Use <strong>Tag</strong> when the label is clickable and used to filter or
                      navigate to a category.
                    </li>
                    <li>
                      Use <strong>Spinner</strong> or <strong>Skeleton</strong> when the state you
                      want to communicate is that content is still loading — not a settled status.
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Dos and Don'ts */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dos & Don'ts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-3 p-4 rounded-lg border border-green-100 bg-green-50">
            <span className="text-sm font-semibold text-green-700">Do</span>
            <ul className="flex flex-col gap-2 text-xs text-green-800 list-disc list-inside">
              <li>Use for short status labels — 1 to 3 words max.</li>
              <li>Pair icons with labels to reinforce meaning at a glance.</li>
              <li>
                Pick a variant that matches the semantic intent (destructive for errors, secondary
                for neutral).
              </li>
              <li>
                Use <code className="bg-green-100 px-1 rounded">asChild</code> when the badge needs
                to be a link or button.
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-3 p-4 rounded-lg border border-red-100 bg-red-50">
            <span className="text-sm font-semibold text-red-700">Don't</span>
            <ul className="flex flex-col gap-2 text-xs text-red-800 list-disc list-inside">
              <li>Don't use long text — badges are not paragraphs.</li>
              <li>
                Don't use badge as a primary action button; use{' '}
                <code className="bg-red-100 px-1 rounded">Button</code> instead.
              </li>
              <li>Don't stack many badges vertically — use a list or table.</li>
              <li>Don't rely on color alone to convey meaning; pair with text or icon.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  ),
}
