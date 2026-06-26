import { Trash2 } from 'lucide-react'
import Button from '../Button'

/** @type {import('@storybook/nextjs').Meta<typeof Button>} */
const meta = {
  title: 'Input/Button/Destructive',
  component: Button,
}

export default meta

export const Normal = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="destructive" size="xs">
        XSmall
      </Button>
      <Button variant="destructive" size="sm">
        Small
      </Button>
      <Button variant="destructive" size="base">
        Base
      </Button>
      <Button variant="destructive" size="md">
        Medium
      </Button>
      <Button variant="destructive" size="lg">
        Large
      </Button>
      <Button variant="destructive" size="xl">
        XLarge
      </Button>
    </div>
  ),
}

export const Disabled = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="destructive" size="xs" disabled>
        XSmall
      </Button>
      <Button variant="destructive" size="sm" disabled>
        Small
      </Button>
      <Button variant="destructive" size="base" disabled>
        Base
      </Button>
      <Button variant="destructive" size="md" disabled>
        Medium
      </Button>
      <Button variant="destructive" size="lg" disabled>
        Large
      </Button>
      <Button variant="destructive" size="xl" disabled>
        XLarge
      </Button>
    </div>
  ),
}

export const Loading = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="destructive" size="xs" isLoading>
        XSmall
      </Button>
      <Button variant="destructive" size="sm" isLoading>
        Small
      </Button>
      <Button variant="destructive" size="base" isLoading>
        Base
      </Button>
      <Button variant="destructive" size="md" isLoading>
        Medium
      </Button>
      <Button variant="destructive" size="lg" isLoading>
        Large
      </Button>
      <Button variant="destructive" size="xl" isLoading>
        XLarge
      </Button>
    </div>
  ),
}

export const LoadingWithIcon = {
  name: 'Loading With Icon',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="destructive" size="xs" useIcon={<Trash2 />} isLoading>
          XSmall
        </Button>
        <Button variant="destructive" size="sm" useIcon={<Trash2 />} isLoading>
          Small
        </Button>
        <Button variant="destructive" size="base" useIcon={<Trash2 />} isLoading>
          Base
        </Button>
        <Button variant="destructive" size="md" useIcon={<Trash2 />} isLoading>
          Medium
        </Button>
        <Button variant="destructive" size="lg" useIcon={<Trash2 />} isLoading>
          Large
        </Button>
        <Button variant="destructive" size="xl" useIcon={<Trash2 />} isLoading>
          XLarge
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="destructive" size="xs" useIcon={<Trash2 />} iconPosition="right" isLoading>
          XSmall
        </Button>
        <Button variant="destructive" size="sm" useIcon={<Trash2 />} iconPosition="right" isLoading>
          Small
        </Button>
        <Button
          variant="destructive"
          size="base"
          useIcon={<Trash2 />}
          iconPosition="right"
          isLoading
        >
          Base
        </Button>
        <Button variant="destructive" size="md" useIcon={<Trash2 />} iconPosition="right" isLoading>
          Medium
        </Button>
        <Button variant="destructive" size="lg" useIcon={<Trash2 />} iconPosition="right" isLoading>
          Large
        </Button>
        <Button variant="destructive" size="xl" useIcon={<Trash2 />} iconPosition="right" isLoading>
          XLarge
        </Button>
      </div>
    </div>
  ),
}

export const IconOnly = {
  name: 'Icon Only',
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="destructive" size="icon-xs" useIcon={<Trash2 />} aria-label="Delete" />
      <Button variant="destructive" size="icon-sm" useIcon={<Trash2 />} aria-label="Delete" />
      <Button variant="destructive" size="icon-base" useIcon={<Trash2 />} aria-label="Delete" />
      <Button variant="destructive" size="icon-md" useIcon={<Trash2 />} aria-label="Delete" />
      <Button variant="destructive" size="icon-lg" useIcon={<Trash2 />} aria-label="Delete" />
      <Button variant="destructive" size="icon-xl" useIcon={<Trash2 />} aria-label="Delete" />
    </div>
  ),
}

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="destructive" size="xs" useIcon={<Trash2 />}>
          XSmall
        </Button>
        <Button variant="destructive" size="sm" useIcon={<Trash2 />}>
          Small
        </Button>
        <Button variant="destructive" size="base" useIcon={<Trash2 />}>
          Base
        </Button>
        <Button variant="destructive" size="md" useIcon={<Trash2 />}>
          Medium
        </Button>
        <Button variant="destructive" size="lg" useIcon={<Trash2 />}>
          Large
        </Button>
        <Button variant="destructive" size="xl" useIcon={<Trash2 />}>
          XLarge
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="destructive" size="xs" useIcon={<Trash2 />} iconPosition="right">
          XSmall
        </Button>
        <Button variant="destructive" size="sm" useIcon={<Trash2 />} iconPosition="right">
          Small
        </Button>
        <Button variant="destructive" size="base" useIcon={<Trash2 />} iconPosition="right">
          Base
        </Button>
        <Button variant="destructive" size="md" useIcon={<Trash2 />} iconPosition="right">
          Medium
        </Button>
        <Button variant="destructive" size="lg" useIcon={<Trash2 />} iconPosition="right">
          Large
        </Button>
        <Button variant="destructive" size="xl" useIcon={<Trash2 />} iconPosition="right">
          XLarge
        </Button>
      </div>
    </div>
  ),
}

export const FullWidth = {
  name: 'Full Width',
  render: () => (
    <div className="flex flex-col gap-3 w-72">
      <Button variant="destructive" fullWidth>
        Destructive
      </Button>
      <Button variant="destructive" fullWidth useIcon={<Trash2 />}>
        Delete item
      </Button>
      <Button variant="destructive" fullWidth isLoading>
        Deleting
      </Button>
    </div>
  ),
}
