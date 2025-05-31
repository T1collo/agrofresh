'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { IoHome } from "react-icons/io5"
import { MdOutlineCategory } from "react-icons/md"
import { TbTruckDelivery } from "react-icons/tb"
import { BsInfoCircleFill } from "react-icons/bs"
import { PiFarmBold } from "react-icons/pi"
import { Menu, LogOut } from "lucide-react"
import { FiShoppingCart } from "react-icons/fi"
import { CgProfile } from "react-icons/cg"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ChevronDown } from "lucide-react"
import { usePathname } from 'next/navigation'
import { useCart } from '../app/context/CartContext'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const links = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: <IoHome />,
    hoverColor: "hover:text-green-600",
    roles: ['CUSTOMER', 'ADMIN']
  },
  {
    name: "Catalogue",
    url: "/catalogue",
    icon: <MdOutlineCategory />,
    hoverColor: "hover:text-blue-600",
    roles: ['CUSTOMER', 'ADMIN'],
    children: [
      { name: "Fresh Produce", url: "/catalogue/fresh-produce" },
      { name: "Meat & Poultry", url: "/catalogue/meat-and-poultry" },
      { name: "Dairy Products", url: "/catalogue/dairy-products" },
      { name: "Eggs", url: "/catalogue/eggs" },
      { name: "Baked Goods", url: "/catalogue/baked-goods" },
      { name: "Honey & Bee Products", url: "/catalogue/honey-and-bee-products" },
      { name: "Preserves & Jams", url: "/catalogue/preserves-and-jams" },
      { name: "Herbal Products", url: "/catalogue/herbal-products" },
      { name: "Flowers & Plants", url: "/catalogue/flowers-and-plants" },
      { name: "Crafts & Artisan Goods", url: "/catalogue/crafts-and-artisan-goods" },
    ]
  },
  {
    name: "Cart",
    url: "/cart",
    icon: <FiShoppingCart />,
    hoverColor: "hover:text-red-600",
    roles: ['CUSTOMER', 'ADMIN']
  },
  {
    name: "Delivery",
    url: "/delivery",
    icon: <TbTruckDelivery />,
    hoverColor: "hover:text-orange-600",
    roles: ['CUSTOMER', 'ADMIN']
  },
  {
    name: "Profile",
    url: "/profile",
    icon: <CgProfile />,
    hoverColor: "hover:text-indigo-600",
    roles: ['CUSTOMER', 'ADMIN']
  },
  {
    name: "Admin Dashboard",
    url: "/admin",
    icon: <BsInfoCircleFill />,
    hoverColor: "hover:text-purple-600",
    roles: ['ADMIN']
  },
]

const Sidebar = () => {
  const [isCartalogueOpen, setCartalogueOpen] = useState(false)
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  // Prefetch routes on mount
  useEffect(() => {
    // Prefetch main routes
    router.prefetch('/dashboard')
    router.prefetch('/catalogue')
    router.prefetch('/orders')
    router.prefetch('/profile')
    
    // Prefetch category routes
    router.prefetch('/catalogue/vegetables')
    router.prefetch('/catalogue/fruits')
    router.prefetch('/catalogue/dairy')
  }, [router])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      toast.success('Logged out successfully')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Failed to logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    )
  }

  if (!user) {
    useEffect(() => {
      router.push('/auth')
    }, [])
    return null
  }

  const userRole = user.role || 'CUSTOMER'
  const filteredLinks = links.filter(link => link.roles.includes(userRole))

  const toggleCartalogue = () => {
    setCartalogueOpen(prev => !prev)
  }

  const isActive = (path: string) => pathname === path

  const SidebarContent = () => (
    <div className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col shadow-lg z-40">
      <Link 
        href="/" 
        className="flex items-center gap-3 px-6 py-7 border-b border-gray-100"
        onMouseEnter={() => router.prefetch('/')}
      >
        <PiFarmBold className="text-4xl text-green-500" />
        <span className="font-bold text-2xl leading-tight text-gray-800">
          farm <br />
          <span className="text-green-600">grow...</span>
        </span>
      </Link>

      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 mb-1">Welcome,</p>
        <p className="font-semibold text-base text-gray-900 truncate">{user.name || user.email}</p>
        <span className="text-xs text-gray-400 capitalize">{userRole}</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="flex flex-col gap-2">
          {filteredLinks.map((link, index) => (
            <li key={index}>
              <div>
                <Link
                  href={link.url}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-base text-gray-700 font-medium transition-colors duration-200 hover:bg-green-50 hover:text-green-700 ${link.hoverColor} ${isActive(link.url) ? 'bg-green-100 text-green-700' : ''}`}
                  onClick={link.name === "Catalogue" ? (e) => { e.preventDefault(); toggleCartalogue(); } : undefined}
                  onMouseEnter={() => {
                    // Prefetch the route and its children
                    router.prefetch(link.url)
                    if (link.children) {
                      link.children.forEach(child => router.prefetch(child.url))
                    }
                  }}
                >
                  <span className="text-xl">{link.icon}</span>
                  <span>{link.name}</span>
                  {link.name === "Catalogue" && (
                    <ChevronDown className={`ml-auto transition-transform duration-200 ${isCartalogueOpen ? "rotate-180" : ""}`} size={18} />
                  )}
                </Link>
                {link.children && isCartalogueOpen && link.name === "Catalogue" && (
                  <ul className="ml-8 mt-1 flex flex-col gap-1 border-l border-gray-100 pl-3">
                    {link.children.map((sub, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={sub.url}
                          className="block py-1.5 px-2 rounded text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
                          onClick={() => isMobile && setIsOpen(false)}
                          onMouseEnter={() => router.prefetch(sub.url)}
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <span>Logout</span>
          )}
        </Button>
      </div>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 md:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-[280px] sm:w-[320px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <SidebarContent />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <>
      <SidebarContent />
      <div className="hidden md:block w-56" />
    </>
  )
}

export default Sidebar
