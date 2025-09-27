import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground">🌿</span>
            </div>
            <span className="text-xl font-bold text-foreground">HerbChain</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/#roles" className="text-muted-foreground hover:text-foreground transition-colors">
              Roles
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            Choose Your Role
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
            Get Started with <span className="text-primary">HerbChain</span>
          </h1>
          <p className="text-xl text-muted-foreground text-balance mb-12 max-w-2xl mx-auto">
            Select your role in the Ayurvedic supply chain to access your personalized dashboard and start building
            trust through blockchain transparency.
          </p>
        </div>
      </section>

      {/* Role Selection Section */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Farmer Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <span className="text-2xl text-green-600">🌿</span>
                </div>
                <CardTitle className="text-green-700">Farmer</CardTitle>
                <CardDescription>
                  Register herbs, upload cultivation data, and generate QR codes for your batches with geo-tagged
                  locations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700" asChild>
                  <Link href="/auth/farmer">Start as Farmer</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Manufacturer Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl text-blue-600">✅</span>
                </div>
                <CardTitle className="text-blue-700">Manufacturer</CardTitle>
                <CardDescription>
                  Verify batches, upload lab reports, track processing status, and ensure quality standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/auth/manufacturer">Start as Manufacturer</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Distributor Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                  <span className="text-2xl text-orange-600">🚛</span>
                </div>
                <CardTitle className="text-orange-700">Distributor</CardTitle>
                <CardDescription>
                  Manage shipments, track deliveries, update export documentation, and handle global distribution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-orange-600 hover:bg-orange-700" asChild>
                  <Link href="/auth/distributor">Start as Distributor</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Regulator Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <span className="text-2xl text-purple-600">🛡️</span>
                </div>
                <CardTitle className="text-purple-700">Regulator</CardTitle>
                <CardDescription>
                  Monitor compliance, approve certifications, access analytics dashboard, and oversee quality standards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" asChild>
                  <Link href="/auth/regulator">Start as Regulator</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Consumer Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-200 transition-colors">
                  <span className="text-2xl text-teal-600">📱</span>
                </div>
                <CardTitle className="text-teal-700">Consumer</CardTitle>
                <CardDescription>
                  Scan QR codes to verify product authenticity and view complete supply chain history.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                  <Link href="/verify">Verify Product</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Join Network Card */}
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                  <span className="text-2xl text-gray-600">👥</span>
                </div>
                <CardTitle className="text-gray-700">Join the Network</CardTitle>
                <CardDescription>
                  New to HerbChain? Learn more about our platform and become part of the trusted network.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent border-gray-300 hover:bg-gray-50" asChild>
                  <Link href="/#features">Learn More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose HerbChain?</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">🛡️</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Blockchain Security</h3>
              <p className="text-muted-foreground">
                Immutable records ensure complete transparency and prevent fraud in the supply chain.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Verification</h3>
              <p className="text-muted-foreground">
                Simple QR code scanning provides instant access to complete product history and authenticity.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">👥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Trusted Network</h3>
              <p className="text-muted-foreground">
                Connect with verified stakeholders across the entire Ayurvedic supply chain ecosystem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link href="/" className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground">🌿</span>
              </div>
              <span className="text-xl font-bold">HerbChain</span>
            </Link>
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
