import InventoryNavigation from './InventoryNavigation'
import ProductAIChat from '@/components/ProductAIChat'
import { LogoutButton } from '@/app/login/components/Logout'

export default function InventoryLayout({ children }) {
  return (
    <div className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-10 max-w-full md:max-w-5xl xl:max-w-7xl">
      <ProductAIChat />
      <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
        <div className="absolute inset-0 bg-slate-50"></div>
      </div>

      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Inventory Management</h1>
            <p className="text-sm text-slate-600">
              Track your household products, stock levels, and spending
            </p>
          </div>
          <div className="shrink-0">
            <LogoutButton />
          </div>
        </div>
        <InventoryNavigation />
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">{children}</div>
    </div>
  )
}
