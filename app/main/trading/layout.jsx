import TradingFooter from './TradingFooter'
import TradeAIChat from '@/components/TradeAIChat'

export default function TradingManagementLayout({ children }) {
  return (
    <div className="relative">
      <TradeAIChat />
      <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 pb-6 lg:py-8">{children}</div>
      <TradingFooter />
    </div>
  )
}
