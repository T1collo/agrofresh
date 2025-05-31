'use client'

import Sidebar from '@/components/sidebar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { CartProvider } from "../context/CartContext"
import { Toaster } from "sonner"

// Loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-green-500" />
    </div>
  )
}

// Auth check component
function AuthCheck({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    router.push('/auth')
    return null
  }

  return <>{children}</>
}

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <AuthCheck>
          <div className="flex min-h-screen">
            {/* Sidebar - Fixed width and full height */}
            <div className="w-64 fixed h-full">
              <Sidebar />
            </div>
            
            {/* Main content - Offset by sidebar width */}
            <div className="flex-1 ml-64">
              <Suspense fallback={<LoadingSpinner />}>
                {children}
              </Suspense>
            </div>
          </div>
        </AuthCheck>
      </Suspense>
      <Toaster />
    </CartProvider>
  )
} 