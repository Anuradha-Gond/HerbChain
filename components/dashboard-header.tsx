"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Simple icon components
const UserIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
)

const LogOutIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
)

const HomeIcon = ({ className = "", ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
)

interface DashboardHeaderProps {
  title: string
  description: string
  icon: React.ReactNode
}

export function DashboardHeader({ title, description, icon }: DashboardHeaderProps) {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "farmer":
        return "bg-green-100 text-green-800 border-green-200"
      case "manufacturer":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "distributor":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "regulator":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </Link>
            <div className="w-px h-6 bg-border" />
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">{icon}</div>
              <div>
                <h1 className="text-xl font-bold text-foreground">{title}</h1>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Badge variant="outline" className={getRoleColor(user?.role || "")}>
                {user?.role}
              </Badge>
            </div>

            <div className="w-px h-6 bg-border" />

            <div className="flex items-center gap-2">
              <Link href="/verify">
                <Button variant="ghost" size="sm" className="text-sm">
                  Consumer Portal
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 bg-transparent"
              >
                <LogOutIcon className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
