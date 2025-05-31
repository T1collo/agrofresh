'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Home, MapPin } from 'lucide-react'
import Link from 'next/link'
import { LocationPicker } from '@/components/LocationPicker'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLocationPickerOpen, setIsLocationPickerOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number; address: string } | null>(null)

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      await signIn(email, password)
      router.push('/')
    } catch (error) {
      // Error is already handled by the auth hook
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!selectedLocation) {
      toast.error('Please select a delivery location')
      setIsLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          password,
          firstName,
          lastName,
          phone,
          location: selectedLocation
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to sign up')
      }

      toast.success('Account created successfully')
      setActiveTab('login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign up')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/hero-bg.jpg")',
          filter: 'brightness(0.7)',
        }}
      />
      
      {/* Home Link */}
      <Link 
        href="/"
        className="absolute top-4 left-4 flex items-center text-white hover:text-white/90 transition-colors"
      >
        <Home className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">Back to Home</span>
      </Link>

      {/* Content */}
      <div className="relative container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <Link href="/" className="text-3xl font-bold tracking-tight text-white hover:text-white/90 transition-colors">
              AgroFresh
            </Link>
            <p className="text-sm text-white/90">
              Your one-stop shop for fresh produce
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link 
                          href="/auth/forgot-password" 
                          className="text-sm text-green-600 hover:text-green-700 transition-colors"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Login
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Don't have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Sign up
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="bg-white/95 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Enter your details to create a new account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder="John"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder="Doe"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Location</Label>
                      <div className="space-y-2">
                        {selectedLocation ? (
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                <span className="text-sm">{selectedLocation.address}</span>
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setIsLocationPickerOpen(true)}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsLocationPickerOpen(true)}
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            Choose Location
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button className="w-full" type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign Up
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => setActiveTab('login')}
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Login
                      </button>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <LocationPicker
        isOpen={isLocationPickerOpen}
        onClose={() => setIsLocationPickerOpen(false)}
        onLocationSelect={setSelectedLocation}
        initialLocation={selectedLocation || undefined}
      />
    </div>
  )
} 