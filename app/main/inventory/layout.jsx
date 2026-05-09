import ProductAIChat from '@/components/ProductAIChat'

export default function InventoryLayout({ children }) {
  return (
    <div className="relative">
      <ProductAIChat />
      <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 py-6 xl:py-8">{children}</div>
    </div>
  )
}
