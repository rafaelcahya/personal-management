'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getUser } from '@/lib/api/user'

const UserProfileCtx = createContext(null)

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    getUser()
      .then(setProfile)
      .catch((err) => setError(err.message || 'Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateAvatar = useCallback((avatar) => {
    setProfile((prev) => (prev ? { ...prev, avatar } : prev))
  }, [])

  return (
    <UserProfileCtx.Provider
      value={{ profile, loading, error, refetch: load, setProfile, updateAvatar }}
    >
      {children}
    </UserProfileCtx.Provider>
  )
}

export function useUserProfile() {
  const ctx = useContext(UserProfileCtx)
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider')
  return ctx
}
