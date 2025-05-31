'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Sidebar from '@/components/sidebar'
import { useCart } from '../../context/CartContext'

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string | null
  category: {
    name: string
  }
}

export default function HomePage() {
  const [recentProducts, setRecentProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const { totalItems } = useCart()

  useEffect(() => {
    // Fetch recent products
    fetch('/api/products?sortBy=createdAt&limit=4')
      .then(res => res.json())
      .then(data => setRecentProducts(data))
      .catch(error => console.error('Error fetching recent products:', error))

    // Fetch featured products (you might want to add a 'featured' flag to products in the future)
    fetch('/api/products?limit=3')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data))
      .catch(error => console.error('Error fetching featured products:', error))
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome to FarmGrow</h1>
          <p className="text-gray-600">Your one-stop shop for fresh, local produce</p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Cart Items</h3>
            <p className="text-3xl font-bold text-green-600">{totalItems}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Available Categories</h3>
            <p className="text-3xl font-bold text-green-600">10</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Active Orders</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link href="/catalogue">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {product.image && (
                  <div className="relative h-48">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                  <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Products */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recently Added</h2>
            <Link href="/catalogue">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {recentProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {product.image && (
                  <div className="relative h-40">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category.name}</p>
                  <p className="text-lg font-bold text-green-600">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
} 