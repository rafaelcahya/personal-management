import { AlertCircle, PackageOpen, Plus, ShoppingCart } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import Button from '../../Button'
import SectionCard from '../../SectionCard'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Section/Usage',
}

export default meta

export const Loading = {
  name: 'Loading State',
  render: () => (
    <SectionCard icon={ShoppingCart} title="Products" description="All active items">
      <div className="animate-pulse" aria-label="Loading data">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-slate-100 last:border-0">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </SectionCard>
  ),
}

export const Empty = {
  name: 'Empty State',
  render: () => (
    <SectionCard
      icon={ShoppingCart}
      title="Products"
      description="All active items"
      action={
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <PackageOpen className="size-10 text-slate-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">No items yet</p>
          <p className="text-xs text-slate-500">Add your first item to get started</p>
        </div>
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          Add Item
        </Button>
      </div>
    </SectionCard>
  ),
}

export const Error = {
  name: 'Error State',
  render: () => (
    <SectionCard icon={ShoppingCart} title="Products" description="All active items">
      <div
        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">Failed to load data</p>
          <p className="text-xs text-slate-500">Check your connection and try again</p>
        </div>
        <Button variant="outline" size="md" className="min-w-11">
          Try again
        </Button>
      </div>
    </SectionCard>
  ),
}

export const Data = {
  name: 'Data State',
  render: () => (
    <SectionCard
      icon={ShoppingCart}
      title="Products"
      description="All active items"
      action={
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                Product
              </th>
              <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                Stock
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'Moisturizer', stock: 3 },
              { name: 'Vitamin C Serum', stock: 1 },
              { name: 'Shampoo', stock: 8 },
            ].map((row) => (
              <tr key={row.name} className="border-b border-slate-100 last:border-0">
                <td className="px-5 py-3.5 font-medium text-slate-900">{row.name}</td>
                <td className="px-5 py-3.5 text-right text-slate-700">{row.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  ),
}

export const LoadingTransparent = {
  name: 'Loading State — Transparent',
  render: () => (
    <SectionCard
      variant="transparent"
      icon={ShoppingCart}
      title="Summary"
      description="Current inventory at a glance"
    >
      <div className="grid grid-cols-3 gap-3 animate-pulse" aria-label="Loading data">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </SectionCard>
  ),
}

export const EmptyTransparent = {
  name: 'Empty State — Transparent',
  render: () => (
    <SectionCard
      variant="transparent"
      icon={ShoppingCart}
      title="Summary"
      description="Current inventory at a glance"
      action={
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
        <PackageOpen className="size-10 text-slate-300" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">No items yet</p>
          <p className="text-xs text-slate-500">Add your first item to get started</p>
        </div>
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          Add Item
        </Button>
      </div>
    </SectionCard>
  ),
}

export const ErrorTransparent = {
  name: 'Error State — Transparent',
  render: () => (
    <SectionCard
      variant="transparent"
      icon={ShoppingCart}
      title="Summary"
      description="Current inventory at a glance"
    >
      <div
        className="flex flex-col items-center justify-center py-16 gap-4 text-center"
        role="alert"
        aria-live="assertive"
      >
        <AlertCircle className="size-10 text-slate-400" aria-hidden="true" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-slate-700">Failed to load data</p>
          <p className="text-xs text-slate-500">Check your connection and try again</p>
        </div>
        <Button variant="outline" size="md" className="min-w-11">
          Try again
        </Button>
      </div>
    </SectionCard>
  ),
}

export const DataTransparent = {
  name: 'Data State — Transparent',
  render: () => (
    <SectionCard
      variant="transparent"
      icon={ShoppingCart}
      title="Summary"
      description="Current inventory at a glance"
      action={
        <Button
          size="md"
          useIcon={<Plus className="size-4" aria-hidden="true" />}
          className="bg-violet-600 hover:bg-violet-700 min-w-11"
        >
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
        </Button>
      }
    >
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
    </SectionCard>
  ),
}
