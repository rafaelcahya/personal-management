import { Plus } from 'lucide-react'
import Button from '../Button'

/** @type {import('@storybook/nextjs').Meta<typeof Button>} */
const meta = {
  title: 'Input/Button/Link',
  component: Button,
}

export default meta

export const Normal = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="link" size="xs">
        XSmall
      </Button>
      <Button variant="link" size="sm">
        Small
      </Button>
      <Button variant="link" size="base">
        Base
      </Button>
      <Button variant="link" size="md">
        Medium
      </Button>
      <Button variant="link" size="lg">
        Large
      </Button>
      <Button variant="link" size="xl">
        XLarge
      </Button>
    </div>
  ),
}

export const Disabled = {
  render: () => (
    <div className="flex flex-wrap gap-3 items-center">
      <Button variant="link" size="xs" disabled>
        XSmall
      </Button>
      <Button variant="link" size="sm" disabled>
        Small
      </Button>
      <Button variant="link" size="base" disabled>
        Base
      </Button>
      <Button variant="link" size="md" disabled>
        Medium
      </Button>
      <Button variant="link" size="lg" disabled>
        Large
      </Button>
      <Button variant="link" size="xl" disabled>
        XLarge
      </Button>
    </div>
  ),
}

export const WithIcon = {
  name: 'With Icon',
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="link" size="xs" useIcon={<Plus />}>
          XSmall
        </Button>
        <Button variant="link" size="sm" useIcon={<Plus />}>
          Small
        </Button>
        <Button variant="link" size="base" useIcon={<Plus />}>
          Base
        </Button>
        <Button variant="link" size="md" useIcon={<Plus />}>
          Medium
        </Button>
        <Button variant="link" size="lg" useIcon={<Plus />}>
          Large
        </Button>
        <Button variant="link" size="xl" useIcon={<Plus />}>
          XLarge
        </Button>
      </div>
      <div className="flex flex-wrap gap-3 items-center">
        <Button variant="link" size="xs" useIcon={<Plus />} iconPosition="right">
          XSmall
        </Button>
        <Button variant="link" size="sm" useIcon={<Plus />} iconPosition="right">
          Small
        </Button>
        <Button variant="link" size="base" useIcon={<Plus />} iconPosition="right">
          Base
        </Button>
        <Button variant="link" size="md" useIcon={<Plus />} iconPosition="right">
          Medium
        </Button>
        <Button variant="link" size="lg" useIcon={<Plus />} iconPosition="right">
          Large
        </Button>
        <Button variant="link" size="xl" useIcon={<Plus />} iconPosition="right">
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
      <Button variant="link" fullWidth>
        Link
      </Button>
      <Button variant="link" fullWidth useIcon={<Plus />}>
        With Icon
      </Button>
      <Button variant="link" fullWidth disabled>
        Disabled
      </Button>
    </div>
  ),
}
