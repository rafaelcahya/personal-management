'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import CommandPalette from './CommandPalette'

const NavShellCtx = createContext(null)

export function NavShellProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <NavShellCtx.Provider value={{ mobileOpen, setMobileOpen, paletteOpen, setPaletteOpen }}>
      {children}
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </NavShellCtx.Provider>
  )
}

export function useNavShell() {
  const ctx = useContext(NavShellCtx)
  if (!ctx) throw new Error('useNavShell must be used within NavShellProvider')
  return ctx
}
