'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

interface UserContextValue {
  name: string
  setName: (n: string) => void
  displayName: string
}

const UserContext = createContext<UserContextValue | null>(null)

export function UserProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState('')
  const displayName = name.trim() || 'Friend of Wellspring'
  return (
    <UserContext.Provider value={{ name, setName, displayName }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
