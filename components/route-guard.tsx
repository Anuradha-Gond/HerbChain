"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "@/lib/icon-fallbacks"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  redirectTo?: string
}

export function RouteGuard({ children, allowedRoles, redirectTo }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      console.log("[v0] RouteGuard checking authorization for user:", user)
      console.log("[v0] Allowed roles:", allowedRoles)

      if (!user) {
        console.log("[v0] No user found, redirecting to auth page")
        // User not logged in, redirect to appropriate auth page
        const role = allowedRoles[0] // Use first allowed role for redirect
        const authUrl = redirectTo || `/auth/${role}`
        console.log("[v0] Redirecting to auth URL:", authUrl)
        router.push(authUrl)
        return
      }

      if (!allowedRoles.includes(user.role)) {
        console.log("[v0] User role not allowed, redirecting to appropriate dashboard")
        // User doesn't have required role, redirect to their appropriate dashboard or home
        switch (user.role) {
          case "farmer":
            console.log("[v0] Redirecting farmer to /farmer")
            router.push("/farmer")
            break
          case "manufacturer":
            router.push("/manufacturer")
            break
          case "distributor":
            router.push("/distributor")
            break
          case "regulator":
            router.push("/regulator")
            break
          default:
            router.push("/")
        }
        return
      }

      console.log("[v0] User authorized, setting isAuthorized to true")
      setIsAuthorized(true)
    }
  }, [user, loading, allowedRoles, router, redirectTo])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600 mb-4" />
            <p className="text-gray-600">Redirecting...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}
