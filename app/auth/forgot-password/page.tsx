'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to send reset email')
      }

      setEmailSent(true)
      toast.success('Password reset email sent')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send reset email')
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
          backgroundImage: 'url("images/hero-bg.jpg")',
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
              Reset your password
            </p>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                {emailSent 
                  ? "Check your email for a password reset link"
                  : "Enter your email address and we'll send you a link to reset your password"
                }
              </CardDescription>
            </CardHeader>
            {!emailSent ? (
              <form onSubmit={handleResetPassword}>
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
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                  </Button>
                  <div className="flex flex-col space-y-2 text-center">
                    <Link 
                      href="/auth"
                      className="flex items-center justify-center text-sm text-green-600 hover:text-green-700 transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Link>
                    <p className="text-sm text-gray-600">
                      Remember your password?{' '}
                      <Link 
                        href="/auth"
                        className="text-green-600 hover:text-green-700 font-medium transition-colors"
                      >
                        Login here
                      </Link>
                    </p>
                  </div>
                </CardFooter>
              </form>
            ) : (
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/auth')}
                >
                  Return to Login
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Send Another Link
                </Button>
                <Link 
                  href="/"
                  className="text-center text-sm text-gray-600 hover:text-gray-700 transition-colors"
                >
                  Back to Home
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
} 