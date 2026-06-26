import { Plus, ShoppingCart, Tag } from 'lucide-react'
import Button from '../../Button'
import SectionCard from '../../SectionCard'
import PageHeader from '@/app/main/components/PageHeader'

/** @type {import('@storybook/nextjs').Meta} */
const meta = {
  title: 'Layout/Section/Usage',
}

export default meta

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AddButton = () => (
  <Button
    size="md"
    useIcon={<Plus className="size-4" aria-hidden="true" />}
    className="bg-violet-600 hover:bg-violet-700 min-w-11"
  >
    <span className="hidden sm:inline">Add Product</span>
    <span className="sm:hidden">Add</span>
  </Button>
)

const ProductTable = () => (
  <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 bg-slate-50">
          <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
            Product
          </th>
          <th className="px-5 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
            Category
          </th>
          <th className="px-5 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
            Stock
          </th>
        </tr>
      </thead>
      <tbody>
        {[
          { name: 'Moisturizer Cetaphil', category: 'Skincare', stock: 3 },
          { name: 'Vitamin C Serum', category: 'Skincare', stock: 1 },
          { name: 'Shampoo Dove', category: 'Hair Care', stock: 8 },
        ].map((row) => (
          <tr key={row.name} className="border-b border-slate-100 last:border-0">
            <td className="px-5 py-3.5 font-medium text-slate-900">{row.name}</td>
            <td className="px-5 py-3.5 text-slate-500">{row.category}</td>
            <td className="px-5 py-3.5 text-right text-slate-700">{row.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

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

// ─── Default (Shell) ──────────────────────────────────────────────────────────

export const SingleSection = {
  name: 'Single Section',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Product List"
        description="Manage your inventory items"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product List' }]}
      />
      <SectionCard
        icon={ShoppingCart}
        title="Products"
        description="All active items in your inventory"
        action={<AddButton />}
      >
        <ProductTable />
      </SectionCard>
    </div>
  ),
}

export const MultipleSections = {
  name: 'Multiple Sections',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Product List"
        description="Manage your inventory items"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product List' }]}
      />
      <SectionCard
        icon={ShoppingCart}
        title="Products"
        description="All active items in your inventory"
        action={<AddButton />}
      >
        <ProductTable />
      </SectionCard>
      <SectionCard icon={Tag} title="Categories" description="Product categories in use">
        <div className="px-5 py-4 text-sm text-slate-500">Skincare · Hair Care · Body Care</div>
      </SectionCard>
    </div>
  ),
}

export const NoBreadcrumbs = {
  name: 'No Breadcrumbs',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader title="Dashboard" description="Overview of your data" />
      <SectionCard icon={ShoppingCart} title="Products" description="All active items">
        <div className="px-5 py-4 text-sm text-slate-500">— content —</div>
      </SectionCard>
    </div>
  ),
}

export const NoDescription = {
  name: 'No Description',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Product List"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Product List' }]}
      />
      <SectionCard icon={ShoppingCart} title="Products" description="All active items">
        <div className="px-5 py-4 text-sm text-slate-500">— content —</div>
      </SectionCard>
    </div>
  ),
}

export const NoPageHeader = {
  name: 'No Page Header',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <SectionCard icon={ShoppingCart} title="Products" description="All active items">
        <div className="px-5 py-4 text-sm text-slate-500">— content —</div>
      </SectionCard>
    </div>
  ),
}

// ─── Transparent ──────────────────────────────────────────────────────────────

export const TransparentSingleSection = {
  name: 'Transparent — Single Section',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Inventory Dashboard"
        description="Overview of your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Dashboard' }]}
      />
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="Summary"
        description="Current inventory at a glance"
      >
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const TransparentMultipleSections = {
  name: 'Transparent — Multiple Sections',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Inventory Dashboard"
        description="Overview of your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Dashboard' }]}
      />
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="Summary"
        description="Current inventory at a glance"
      >
        <StatGrid />
      </SectionCard>
      <SectionCard
        variant="transparent"
        icon={Tag}
        title="By Category"
        description="Stock breakdown per category"
      >
        <StatGrid />
      </SectionCard>
    </div>
  ),
}

export const TransparentMixed = {
  name: 'Transparent — Mixed with Shell',
  render: () => (
    <div className="p-6 max-w-4xl space-y-6">
      <PageHeader
        title="Inventory Dashboard"
        description="Overview of your inventory"
        breadcrumbs={[{ label: 'Inventory', href: '/main/inventory' }, { label: 'Dashboard' }]}
      />
      <SectionCard
        variant="transparent"
        icon={ShoppingCart}
        title="Summary"
        description="Current inventory at a glance"
      >
        <StatGrid />
      </SectionCard>
      <SectionCard
        icon={Tag}
        title="Product List"
        description="All active items"
        action={<AddButton />}
      >
        <ProductTable />
      </SectionCard>
    </div>
  ),
}
