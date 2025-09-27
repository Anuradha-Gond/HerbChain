"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { authAPI, setAuthToken, clearAuthToken, getAuthToken } from "@/lib/api"

interface User {
  _id: string
  name: string
  email: string
  role: "farmer" | "manufacturer" | "distributor" | "regulator" | "consumer"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>
  register: (userData: {
    name: string
    email: string
    password: string
    role: string
  }) => Promise<{ success: boolean; user?: User; message?: string }>
  logout: () => void
  loading: boolean
  getDashboardUrl: (role: string) => string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAuthToken()
      if (token) {
        try {
          // Decode token to get user info (basic validation)
          const payload = JSON.parse(atob(token.split(".")[1]))
          if (payload.exp * 1000 > Date.now()) {
            // Token is still valid, set user from token
            setUser({
              _id: payload.userId,
              name: payload.name || "",
              email: payload.email,
              role: payload.role,
              createdAt: new Date().toISOString(),
            })
          } else {
            // Token expired, clear it
            clearAuthToken()
          }
        } catch (error) {
          console.error("Token validation error:", error)
          clearAuthToken()
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      console.log("[v0] Starting login process for:", email)
      const response = await authAPI.login({ email, password })
      console.log("[v0] Login API response:", response)

      if (response.success && response.data) {
        console.log("[v0] Login successful, setting token and user")
        setAuthToken(response.data.token)
        setUser(response.data.user)
        console.log("[v0] User set:", response.data.user)
        return { success: true, user: response.data.user }
      }

      console.log("[v0] Login failed - API returned error:", response.message)
      return { success: false, message: response.message || "Invalid credentials" }
    } catch (error) {
      console.error("[v0] Login error:", error)
      return { success: false, message: "Unable to connect to server. Please try again." }
    }
  }

  const register = async (userData: {
    name: string
    email: string
    password: string
    role: string
  }): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const response = await authAPI.register(userData)

      if (response.success && response.data) {
        setAuthToken(response.data.token)
        setUser(response.data.user)
        return { success: true, user: response.data.user }
      }

      return { success: false, message: response.message || "Registration failed" }
    } catch (error) {
      console.error("Register error:", error)
      return { success: false, message: "Unable to connect to server. Please try again." }
    }
  }

  const logout = () => {
    clearAuthToken()
    setUser(null)
  }

  const getDashboardUrl = (role: string): string => {
    console.log("[v0] Getting dashboard URL for role:", role)
    switch (role) {
      case "farmer":
        console.log("[v0] Returning farmer dashboard URL: /farmer")
        return "/farmer"
      case "manufacturer":
        return "/manufacturer"
      case "distributor":
        return "/distributor"
      case "regulator":
        return "/regulator"
      case "consumer":
        return "/consumer"
      default:
        console.log("[v0] Unknown role, returning home URL")
        return "/"
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getDashboardUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
