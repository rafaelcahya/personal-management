'use client'

import { createContext, useContext, useState } from 'react'

const NavShellCtx = createContext(null)

export function NavShellProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <NavShellCtx.Provider value={{ mobileOpen, setMobileOpen }}>{children}</NavShellCtx.Provider>
  )
}

export function useNavShell() {
  const ctx = useContext(NavShellCtx)
  if (!ctx) throw new Error('useNavShell must be used within NavShellProvider')
  return ctx
}
