'use client'

import { usePathname } from 'next/navigation'

const ROUTE_LABELS = [
  ['/main/inventory', 'Inventory'],
  ['/main/trading', 'Trading'],
  ['/main/running', 'Running'],
  ['/main/notifications', 'Notifications'],
  ['/main/security', 'Security'],
]

function labelFor(pathname) {
  const match = ROUTE_LABELS.find(
    ([prefix]) => pathname === prefix || pathname.startsWith(prefix + '/')
  )
  return match ? match[1] : 'Personal Management'
}

export default function ActiveSectionLabel() {
  const pathname = usePathname()
  return (
    <span id="activeSectionLabel_navbar" className="truncate text-sm font-semibold text-foreground">
      {labelFor(pathname)}
    </span>
  )
}
