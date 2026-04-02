'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiPost } from '@/lib/api'
import { type User, type UserLevel } from '@/lib/mock-data'

const STORAGE_KEY = 'urbanpulse_token'

interface BackendUser {
  id: string
  email: string
  display_name: string
  role: 'citizen' | 'admin'
  points: number
  level: number
}

interface AuthResponse {
  token: string
  user: BackendUser
}

interface AuthState {
  user: User | null
  token: string | null
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, displayName: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

function mapUser(b: BackendUser): User {
  return {
    id: b.id,
    email: b.email,
    displayName: b.display_name,
    role: b.role,
    points: b.points,
    level: b.level as UserLevel,
    createdAt: new Date().toISOString(),
  }
}

function parseJwt(token: string): (BackendUser & { exp: number }) | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      const payload = parseJwt(token)
      if (payload && payload.exp * 1000 > Date.now()) {
        setState({ user: mapUser(payload), token })
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const { token, user } = await apiPost<AuthResponse>('/api/auth/login', { email, password })
    localStorage.setItem(STORAGE_KEY, token)
    setState({ user: mapUser(user), token })
  }

  async function register(email: string, password: string, displayName: string) {
    const { token, user } = await apiPost<AuthResponse>('/api/auth/register', {
      email,
      password,
      display_name: displayName,
    })
    localStorage.setItem(STORAGE_KEY, token)
    setState({ user: mapUser(user), token })
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setState({ user: null, token: null })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
