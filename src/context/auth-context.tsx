'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  clearSession,
  getSession,
  getUserById,
  login,
  register,
  saveSession,
  type Role,
  type StoredUser,
} from '@/lib/local-auth'

type AuthContextValue = {
  user: StoredUser | null
  loading: boolean
  signUp: (data: { email: string; password: string; name: string; role: Role }) => boolean
  signIn: (email: string, password: string) => boolean
  signOut: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const session = getSession()
    if (session) {
      setUser(getUserById(session.userId))
    }
    setLoading(false)
  }, [])

  const signUp = (data: { email: string; password: string; name: string; role: Role }): boolean => {
    setError(null)
    try {
      const newUser = register(data)
      saveSession(newUser.id)
      setUser(newUser)
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    }
  }

  const signIn = (email: string, password: string): boolean => {
    setError(null)
    try {
      const found = login(email, password)
      saveSession(found.id)
      setUser(found)
      return true
    } catch (e) {
      setError((e as Error).message)
      return false
    }
  }

  const signOut = () => {
    clearSession()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
