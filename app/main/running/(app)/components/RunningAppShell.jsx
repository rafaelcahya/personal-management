'use client'

import { useStravaStatus } from '@/app/main/hooks/useStravaStatus'
import StravaReconnectBanner from './StravaReconnectBanner'

export default function RunningAppShell({ children }) {
  const { needsReconnect } = useStravaStatus()

  return (
    <div className="relative">
      <StravaReconnectBanner needsReconnect={needsReconnect} />
      <div className="w-full max-w-5xl xl:max-w-7xl mx-auto px-4 pb-6 lg:py-8">
        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
