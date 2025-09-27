// General registration page for new users
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { ArrowLeft, UserPlus, Leaf } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    phone: "",
    address: "",
    aadhaarId: "",
    licenseNumber: "",
    organizationName: "",
    acceptTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.acceptTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })

      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to HerbChain! Redirecting to your dashboard...",
        })

        // Redirect based on role
        switch (formData.role) {
          case "farmer":
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
      } else {
        toast({
          title: "Registration Failed",
          description: "Please check your information and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Registration Error",
        description: "An error occurred during registration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case "farmer":
        return "Register herbs, track cultivation, and generate QR codes for your batches"
      case "manufacturer":
        return "Verify batches, upload lab reports, and manage processing workflows"
      case "distributor":
        return "Manage shipments, track deliveries, and handle export documentation"
      case "regulator":
        return "Monitor compliance, approve certifications, and access analytics"
      default:
        return "Select your role to see description"
    }
  }

  const getRoleRequirements = (role: string) => {
    switch (role) {
      case "farmer":
        return ["Valid Aadhaar ID", "Farm location details", "Cultivation experience"]
      case "manufacturer":
        return ["Manufacturing license", "Quality certification", "Processing facility details"]
      case "distributor":
        return ["Transport license", "Logistics experience", "Export documentation"]
      case "regulator":
        return ["Government authorization", "Regulatory experience", "Compliance certification"]
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">HerbChain</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Join the Network</h2>
          <p className="text-gray-600">Create your account and become part of the trusted Ayurvedic supply chain</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Register New Account
            </CardTitle>
            <CardDescription>Fill in your details to create your HerbChain account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role in Supply Chain *</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">🌿 Farmer</SelectItem>
                    <SelectItem value="manufacturer">🏭 Manufacturer</SelectItem>
                    <SelectItem value="distributor">🚛 Distributor</SelectItem>
                    <SelectItem value="regulator">🛡️ Regulator</SelectItem>
                  </SelectContent>
                </Select>

                {formData.role && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 mb-2">{getRoleDescription(formData.role)}</p>
                    <div className="text-xs text-blue-600">
                      <p className="font-medium mb-1">Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {getRoleRequirements(formData.role).map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar ID</Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="Enter Aadhaar number"
                    value={formData.aadhaarId}
                    onChange={(e) => setFormData({ ...formData, aadhaarId: e.target.value })}
                  />
                </div>
              </div>

              {(formData.role === "manufacturer" ||
                formData.role === "distributor" ||
                formData.role === "regulator") && (
                <div className="space-y-2">
                  <Label htmlFor="license">License/Registration Number</Label>
                  <Input
                    id="license"
                    type="text"
                    placeholder="Enter your license or registration number"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/farmer" className="text-green-600 hover:text-green-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
