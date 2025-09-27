"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">🌿</span>
            </div>
            <span className="text-xl font-bold text-foreground">HerbChain</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "#features", label: "Features" },
              { href: "#how-it-works", label: "How It Works" },
              { href: "#roles", label: "Roles" },
            ].map((item, index) => (
              <div
                key={item.href}
                className="animate-in fade-in slide-in-from-right-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <Badge variant="secondary" className="mb-6">
              Blockchain-Powered Transparency
            </Badge>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Trust Ayurveda with <span className="text-primary">Blockchain</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            Ensuring authentic, traceable Ayurvedic herbs from farm to consumer through immutable blockchain records, AI
            verification, and complete supply chain transparency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            <div className="hover:scale-105 transition-transform duration-200">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="/get-started">Get Started</Link>
              </Button>
            </div>
            <div className="hover:scale-105 transition-transform duration-200">
              <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose HerbChain?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionary technology meets traditional wisdom to create the most trusted Ayurvedic supply chain
              platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🛡️",
                title: "Immutable Records",
                description:
                  "Blockchain technology ensures tamper-proof documentation of every step in the herb's journey from cultivation to consumer.",
              },
              {
                icon: "📍",
                title: "Geo-Tagged Origins",
                description:
                  "Precise location tracking with Google Maps integration verifies exact farm locations and collection points.",
              },
              {
                icon: "✅",
                title: "AI-Powered Verification",
                description:
                  "Advanced AI algorithms detect fraud patterns, duplicate entries, and potential adulteration attempts.",
              },
              {
                icon: "📱",
                title: "QR Code Traceability",
                description:
                  "Consumers can instantly verify product authenticity and view complete lifecycle information with a simple scan.",
              },
              {
                icon: "👥",
                title: "Multi-Stakeholder Platform",
                description:
                  "Seamlessly connects farmers, manufacturers, distributors, regulators, and consumers in one unified ecosystem.",
              },
              {
                icon: "🌍",
                title: "Global Export Ready",
                description:
                  "Meets international standards and builds trust for India's Ayurvedic exports on the global market.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 hover:-translate-y-2 transition-transform duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="border-0 shadow-lg h-full">
                  <CardHeader>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How HerbChain Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, transparent process that ensures authenticity at every step
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🌿",
                title: "1. Cultivation",
                description: "Farmers register herbs with geo-tagged locations and cultivation details",
              },
              {
                icon: "✅",
                title: "2. Processing",
                description: "Manufacturers verify batches and upload lab reports to the blockchain",
              },
              {
                icon: "🚛",
                title: "3. Distribution",
                description: "Distributors track shipments and update delivery status in real-time",
              },
              {
                icon: "📱",
                title: "4. Verification",
                description: "Consumers scan QR codes to view complete product history and authenticity",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 hover:scale-105 transition-transform duration-200"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{step.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section id="roles" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Role</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Access tailored dashboards designed for your specific needs in the supply chain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🌿",
                title: "Farmer",
                description: "Register herbs, upload cultivation data, and generate QR codes for your batches",
                href: "/farmer",
                buttonText: "Access Farmer Dashboard",
              },
              {
                icon: "✅",
                title: "Manufacturer",
                description: "Verify batches, upload lab reports, and track processing status",
                href: "/manufacturer",
                buttonText: "Access Manufacturer Dashboard",
              },
              {
                icon: "🚛",
                title: "Distributor",
                description: "Manage shipments, track deliveries, and update export documentation",
                href: "/distributor",
                buttonText: "Access Distributor Dashboard",
              },
              {
                icon: "🛡️",
                title: "Regulator",
                description: "Monitor compliance, approve certifications, and access analytics dashboard",
                href: "/regulator",
                buttonText: "Access Regulator Dashboard",
              },
              {
                icon: "📱",
                title: "Consumer",
                description: "Scan QR codes to verify product authenticity and view complete history",
                href: "/verify",
                buttonText: "Verify Product",
              },
              {
                icon: "👥",
                title: "Join the Network",
                description: "New to HerbChain? Register and become part of the trusted network",
                href: "/register",
                buttonText: "Register Now",
                variant: "outline",
              },
            ].map((role, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 hover:-translate-y-3 transition-transform duration-200"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer h-full">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">{role.icon}</span>
                    </div>
                    <CardTitle className="mb-2">{role.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{role.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="hover:scale-105 transition-transform duration-200">
                      <Button
                        className="w-full py-3 px-4 text-sm font-medium"
                        variant={(role.variant as any) || "default"}
                        size="lg"
                        asChild
                      >
                        <Link href={role.href}>{role.buttonText}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border animate-in fade-in duration-700">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">🌿</span>
              </div>
              <span className="text-xl font-bold">HerbChain</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2024 HerbChain. Empowering Ayurveda with Blockchain Technology.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
