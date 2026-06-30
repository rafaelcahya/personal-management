import { Plus } from 'lucide-react'
import Button from './Button'

/** @type {import('@storybook/nextjs').Meta<typeof Button>} */
const meta = {
  title: 'Input/Button/Secondary',
  component: Button,
}

export default meta

export const Normal = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="secondary" size="xs">
        XSmall
      </Button>
      <Button variant="secondary" size="sm">
        Small
      </Button>
      <Button variant="secondary" size="base">
        Base
      </Button>
      <Button variant="secondary" size="md">
        Medium
      </Button>
      <Button variant="secondary" size="lg">
        Large
      </Button>
      <Button variant="secondary" size="xl">
        XLarge
      </Button>
    </div>
  ),
}

export const Disabled = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="secondary" size="xs" disabled>
        XSmall
      </Button>
      <Button variant="secondary" size="sm" disabled>
        Small
      </Button>
      <Button variant="secondary" size="base" disabled>
        Base
      </Button>
      <Button variant="secondary" size="md" disabled>
        Medium
      </Button>
      <Button variant="secondary" size="lg" disabled>
        Large
      </Button>
      <Button variant="secondary" size="xl" disabled>
        XLarge
      </Button>
    </div>
  ),
}

export const Loading = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="secondary" size="xs" isLoading>
        XSmall
      </Button>
      <Button variant="secondary" size="sm" isLoading>
        Small
      </Button>
      <Button variant="secondary" size="base" isLoading>
        Base
      </Button>
      <Button variant="secondary" size="md" isLoading>
        Medium
      </Button>
      <Button variant="secondary" size="lg" isLoading>
        Large
      </Button>
      <Button variant="secondary" size="xl" isLoading>
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
        <Button variant="secondary" size="xs" useIcon={<Plus />} isLoading>
          XSmall
        </Button>
        <Button variant="secondary" size="sm" useIcon={<Plus />} isLoading>
          Small
        </Button>
        <Button variant="secondary" size="base" useIcon={<Plus />} isLoading>
          Base
        </Button>
        <Button variant="secondary" size="md" useIcon={<Plus />} isLoading>
          Medium
        </Button>
        <Button variant="secondary" size="lg" useIcon={<Plus />} isLoading>
          Large
        </Button>
        <Button variant="secondary" size="xl" useIcon={<Plus />} isLoading>
          XLarge
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="secondary" size="xs" useIcon={<Plus />} iconPosition="right" isLoading>
          XSmall
        </Button>
        <Button variant="secondary" size="sm" useIcon={<Plus />} iconPosition="right" isLoading>
          Small
        </Button>
        <Button variant="secondary" size="base" useIcon={<Plus />} iconPosition="right" isLoading>
          Base
        </Button>
        <Button variant="secondary" size="md" useIcon={<Plus />} iconPosition="right" isLoading>
          Medium
        </Button>
        <Button variant="secondary" size="lg" useIcon={<Plus />} iconPosition="right" isLoading>
          Large
        </Button>
        <Button variant="secondary" size="xl" useIcon={<Plus />} iconPosition="right" isLoading>
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
      <Button variant="secondary" size="icon-xs" useIcon aria-label="Add" />
      <Button variant="secondary" size="icon-sm" useIcon aria-label="Add" />
      <Button variant="secondary" size="icon-base" useIcon aria-label="Add" />
      <Button variant="secondary" size="icon-md" useIcon aria-label="Add" />
      <Button variant="secondary" size="icon-lg" useIcon aria-label="Add" />
      <Button variant="secondary" size="icon-xl" useIcon aria-label="Add" />
    </div>
  ),
}

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="secondary" size="xs" useIcon={<Plus />}>
          XSmall
        </Button>
        <Button variant="secondary" size="sm" useIcon={<Plus />}>
          Small
        </Button>
        <Button variant="secondary" size="base" useIcon={<Plus />}>
          Base
        </Button>
        <Button variant="secondary" size="md" useIcon={<Plus />}>
          Medium
        </Button>
        <Button variant="secondary" size="lg" useIcon={<Plus />}>
          Large
        </Button>
        <Button variant="secondary" size="xl" useIcon={<Plus />}>
          XLarge
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="secondary" size="xs" useIcon={<Plus />} iconPosition="right">
          XSmall
        </Button>
        <Button variant="secondary" size="sm" useIcon={<Plus />} iconPosition="right">
          Small
        </Button>
        <Button variant="secondary" size="base" useIcon={<Plus />} iconPosition="right">
          Base
        </Button>
        <Button variant="secondary" size="md" useIcon={<Plus />} iconPosition="right">
          Medium
        </Button>
        <Button variant="secondary" size="lg" useIcon={<Plus />} iconPosition="right">
          Large
        </Button>
        <Button variant="secondary" size="xl" useIcon={<Plus />} iconPosition="right">
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
      <Button variant="secondary" fullWidth>
        Secondary
      </Button>
      <Button variant="secondary" fullWidth useIcon={<Plus />}>
        With Icon
      </Button>
      <Button variant="secondary" fullWidth isLoading>
        Loading
      </Button>
    </div>
  ),
}
