'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Home } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  if (!token || !email) {
    return (
      <div className="relative min-h-screen w-full">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/hero-bg.jpg")',
            filter: 'brightness(0.7)',
          }}
        />
        <div className="relative container flex h-screen w-screen flex-col items-center justify-center">
          <Card className="bg-white/95 backdrop-blur-sm max-w-md w-full">
            <CardHeader>
              <CardTitle>Invalid Reset Link</CardTitle>
              <CardDescription>
                This password reset link is invalid or has expired.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full" 
                onClick={() => router.push('/auth/forgot-password')}
              >
                Request New Reset Link
              </Button>
              <Link 
                href="/auth"
                className="text-center text-sm text-green-600 hover:text-green-700 transition-colors"
              >
                Back to Login
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to reset password')
      }

      setIsSuccess(true)
      toast.success('Password reset successful')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to reset password')
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
          backgroundImage: 'url("/hero-bg.jpg")',
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
              <CardTitle>Reset Password</CardTitle>
              <CardDescription>
                {isSuccess 
                  ? "Your password has been reset successfully"
                  : "Enter your new password below"
                }
              </CardDescription>
            </CardHeader>
            {!isSuccess ? (
              <form onSubmit={handleResetPassword}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
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
                    Reset Password
                  </Button>
                  <Link 
                    href="/auth"
                    className="text-center text-sm text-green-600 hover:text-green-700 transition-colors"
                  >
                    Back to Login
                  </Link>
                </CardFooter>
              </form>
            ) : (
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/auth')}
                >
                  Go to Login
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