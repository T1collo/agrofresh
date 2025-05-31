'use client'

import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FiFacebook, FiTwitter, FiInstagram, FiMail } from "react-icons/fi"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Shipping Policy', href: '/shipping' },
    ],
    categories: [
      { name: 'Fresh Produce', href: '/catalogue/fresh-produce' },
      { name: 'Dairy Products', href: '/catalogue/dairy' },
      { name: 'Baked Goods', href: '/catalogue/baked-goods' },
      { name: 'Organic Products', href: '/catalogue/organic' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
              FarmGrow
            </Link>
            <p className="mt-4 text-sm">
              Bringing farm-fresh produce directly to your doorstep. Quality, organic products for a healthier lifestyle.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="hover:text-white transition-colors">
                <FiFacebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <FiMail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        {/* <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-white font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-sm mb-4">Stay updated with our latest products and offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              <Button className="bg-green-600 hover:bg-green-700">
                Subscribe
              </Button>
            </div>
          </div>
        </div> */}

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
          <p>&copy; {currentYear} FarmGrow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 