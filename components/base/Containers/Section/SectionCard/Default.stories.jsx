import { Plus, ShoppingCart, Tag } from 'lucide-react'
import Button from '../../../Button'
import SectionCard from '../../../SectionCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Section/SectionCard/Default',
}

export default meta

const body = (
  <div className="px-5 py-6 text-sm text-slate-400 italic">— body content goes here —</div>
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
        icon={ShoppingCart}
        title="1 Button"
        description="Single action"
        action={<AddButton />}
      >
        {body}
      </SectionCard>
      <SectionCard
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
        {body}
      </SectionCard>
      <SectionCard
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
        {body}
      </SectionCard>
    </div>
  ),
}

export const WithoutButton = {
  name: 'Without Button',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard
        icon={Tag}
        title="Section Title"
        description="Short description of what this section shows"
      >
        {body}
      </SectionCard>
    </div>
  ),
}

export const NoIcon = {
  name: 'No Icon',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard title="Section Title" description="Short description of what this section shows">
        {body}
      </SectionCard>
    </div>
  ),
}

export const TitleOnly = {
  name: 'Title Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard title="Section Title">{body}</SectionCard>
    </div>
  ),
}

export const DescriptionOnly = {
  name: 'Description Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard description="Short description of what this section shows">{body}</SectionCard>
    </div>
  ),
}

export const ButtonOnly = {
  name: 'Button Only',
  render: () => (
    <div className="p-6 max-w-2xl space-y-4">
      <SectionCard actionAlign="left" action={<AddButton />}>
        {body}
      </SectionCard>
      <SectionCard actionAlign="center" action={<AddButton />}>
        {body}
      </SectionCard>
      <SectionCard action={<AddButton />}>{body}</SectionCard>
    </div>
  ),
}

export const NoHeader = {
  name: 'No Header',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard>{body}</SectionCard>
    </div>
  ),
}

export const HeaderOnly = {
  name: 'Header Only',
  render: () => (
    <div className="p-6 max-w-2xl">
      <SectionCard
        icon={ShoppingCart}
        title="Section Title"
        description="Short description of what this section shows"
        action={<AddButton />}
      />
    </div>
  ),
}
