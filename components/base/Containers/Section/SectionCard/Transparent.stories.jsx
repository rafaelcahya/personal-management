import { Plus, ShoppingCart, Tag } from 'lucide-react'
import Button from '../../../Button'
import SectionCard from '../../../SectionCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Section/SectionCard/Transparent',
}

export default meta

const StatGrid = () => (
  <div className="grid grid-cols-3 gap-3">
    {[
      { label: 'Total Products', value: '48' },
      { label: 'Active', value: '42' },
      { label: 'Low Stock', value: '6' },
    ].map((stat) => (
      <div
        key={stat.label}
        className="bg-white rounded-xl border border-slate-200 shadow-sm px-4 py-4"
      >
        <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
        <p className="text-2xl font-semibold text-slate-900">{stat.value}</p>
      </div>
    ))}
  </div>
)

const AddButton = () => (
  <Button
    size="md"
    useIcon={<Plus className="size-4" aria-hidden="true" />}
    className="bg-violet-600 hover:bg-violet-700 min-w-11"
  >
    <span className="hidden sm:inline">Add Item</span>
    <span className="sm:hidden">Add</span>
  </Button>
)

export const WithButton = {
  name: 'With Button',
  render: () => (
    <div className="p-6 max-w-2xl space-y-4">
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="1 Button"
        description="Single action"
        action={<AddButton />}
      >
        <StatGrid />
      </SectionCard>
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="2 Buttons"
        description="Primary + secondary action"
        action={
          <div className="flex items-center gap-2">
            <Button size="md" variant="outline" className="min-w-11">
              Export
            </Button>
            <AddButton />
          </div>
        }
      >
        <StatGrid />
      </SectionCard>
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="3 Buttons"
        description="Full action group"
        action={
          <div className="flex items-center gap-2">
            <Button size="md" variant="ghost" className="min-w-11">
              Filter
            </Button>
            <Button size="md" variant="outline" className="min-w-11">
              Export
            </Button>
            <AddButton />
          </div>
        }
      >
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const WithoutButton = {
  name: 'Without Button',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard
        variant="transparent"
        icon={Tag}
        title="Section Title"
        description="Short description of what this section shows"
      >
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const NoIcon = {
  name: 'No Icon',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard
        variant="transparent"
        title="Section Title"
        description="Short description of what this section shows"
      >
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const TitleOnly = {
  name: 'Title Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard variant="transparent" title="Section Title">
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const DescriptionOnly = {
  name: 'Description Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard variant="transparent" description="Short description of what this section shows">
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const ButtonOnly = {
  name: 'Button Only',
  render: () => (
    <div className="p-6 max-w-2xl space-y-4">
      <SectionCard variant="transparent" actionAlign="left" action={<AddButton />}>
        <StatGrid />
      </SectionCard>
      <SectionCard variant="transparent" actionAlign="center" action={<AddButton />}>
        <StatGrid />
      </SectionCard>
      <SectionCard variant="transparent" action={<AddButton />}>
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const NoHeader = {
  name: 'No Header',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard variant="transparent">
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const HeaderOnly = {
  name: 'Header Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="Section Title"
        description="Short description of what this section shows"
        action={<AddButton />}
      />
    </div>
  ),
}
