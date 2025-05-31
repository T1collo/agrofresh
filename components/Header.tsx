'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'
import { PiFarmBold } from "react-icons/pi"
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

// Auth buttons component that loads asynchronously
function AuthButtons() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex items-center space-x-4">
        <Loader2 className="h-4 w-4 animate-spin text-green-500" />
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={signOut}
            className="text-red-600 hover:text-red-700"
          >
            Logout
          </Button>
        </>
      ) : (
        <>
          <Link href="/auth">
            <Button variant="ghost" size="sm" className='text-black' >Sign In</Button>
          </Link>
          <Link href="/auth?tab=signup">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              Sign Up
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}

// Main header component that loads immediately
export default function Header() {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <PiFarmBold className='text-4xl text-green-400'/>
            <div className='font-semibold text-2xl text-black'>
              farm <span className='text-green-500'>grow...</span>
            </div>
          </Link>

          {/* Navigation - Loads immediately */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/') ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/catalogue" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/catalogue') ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              Catalogue
            </Link>
            <Link 
              href="/about" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/about') ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm font-medium transition-colors hover:text-green-600 ${
                isActive('/contact') ? 'text-green-600' : 'text-gray-600'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Auth Buttons - Loads asynchronously */}
          <Suspense fallback={
            <div className="flex items-center space-x-4">
              <Loader2 className="h-4 w-4 animate-spin text-green-500" />
            </div>
          }>
            <AuthButtons />
          </Suspense>
        </div>
      </div>
    </header>
  )
} 