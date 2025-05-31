"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, Truck, Users, Heart } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden mb-12">
        <Image
          src="/images/about-hero.jpg"
          alt="Fresh produce from local farms"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">About Farm Grow</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto">
              Connecting local farmers with conscious consumers
            </p>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-green-400 inline-block px-8 py-2 rounded-lg mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-black-900">Our Story</h2>
            </div>
            <p className="text-gray-600 mb-4">
              AgroFresh was born from a simple idea: to make fresh, locally-grown produce accessible to everyone while supporting our community's farmers. What started as a small farmers' market stall has grown into a trusted platform connecting local growers with conscious consumers.
            </p>
            <p className="text-gray-600">
              Today, we work with over 50 local farms across the region, bringing you the freshest seasonal produce while ensuring fair prices for our farmers and sustainable practices for our environment.
            </p>
          </div>
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            <Image
              src="/images/farm-story.jpg"
              alt="Local farm story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="mb-16">
        <div className="bg-green-400 inline-block px-4 py-2 rounded-lg mb-8 mx-auto block text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-black-900">Our Mission & Values</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-2 border-green-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainability</h3>
              <p className="text-gray-600">
                Committed to eco-friendly practices and reducing our environmental footprint.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">
                Supporting local farmers and building stronger community connections.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Freshness</h3>
              <p className="text-gray-600">
                Delivering farm-fresh produce within 24 hours of harvest.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">
                Ensuring the highest quality standards in everything we do.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Impact Section */}
      <section className="mb-16 bg-green-50 rounded-xl p-8 md:p-12">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</h3>
            <p className="text-gray-600">Local Farms Supported</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">10k+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-green-600 mb-2">24h</h3>
            <p className="text-gray-600">Farm to Table Delivery</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Join Our Journey
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience the difference of farm-fresh produce delivered to your doorstep. Support local farmers and enjoy the best quality ingredients.
        </p>
        <Link href="/auth/login">
          <Button size="lg" className="group">
            Get Started
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </section>
    </div>
  )
} 