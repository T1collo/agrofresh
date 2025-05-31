'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { FiArrowRight, FiClock, FiTruck, FiFeather } from "react-icons/fi"
import { useEffect, useState } from 'react'

const heroImages = [
  {
    src: "/images/hero-bg.jpg",
    alt: "Farm fresh produce",
    title: "Fresh from Farm to Your Table",
    description: "Discover the finest selection of organic produce, dairy products, and artisanal goods, all delivered fresh from our farm to your doorstep."
  },
  {
    src: "/images/hero-bg2.jpg",
    alt: "Organic farming",
    title: "100% Organic Farming",
    description: "Experience the difference with our naturally grown produce, cultivated with care and respect for the environment."
  },
  {
    src: "/images/hero-bg3.jpg",
    alt: "Farm delivery",
    title: "Direct Farm Delivery",
    description: "Get farm-fresh products delivered straight to your doorstep, ensuring maximum freshness and quality."
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 7000) // Change slide every 5 seconds

    return () => clearInterval(timer)
  }, [])

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroImages.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)
  }

  const features = [
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Fresh Daily",
      description: "Harvested and delivered fresh to your doorstep every day"
    },
    {
      icon: <FiTruck className="w-6 h-6" />,
      title: "Fast Delivery",
      description: "Quick and reliable delivery within 24 hours"
    },
    {
      icon: <FiFeather className="w-6 h-6" />,
      title: "100% Organic",
      description: "Grown naturally without harmful chemicals"
    }
  ]

  const featuredCategories = [
    {
      name: "Fresh Produce",
      image: "/images/fresh-produce.jpg",
      description: "Seasonal fruits and vegetables",
      url: "/catalogue/fresh-produce"
    },
    {
      name: "Dairy Products",
      image: "/images/dairy.jpg",
      description: "Farm-fresh dairy products",
      url: "/catalogue/dairy-products"
    },
    {
      name: "Baked Goods",
      image: "/images/baked.jpg",
      description: "Artisanal bread and pastries",
      url: "/catalogue/baked-goods"
    }
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Slider */}
      <section className="relative h-[80vh] min-h-[600px] max-h-[800px] flex items-center overflow-hidden">
        {/* Slides */}
        {heroImages.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-cover brightness-50"
              priority={index === 0}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}

        {/* Content */}
        <div className="container relative z-10 mx-auto px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 transition-all duration-1000 transform">
              {heroImages[currentSlide].title}
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 transition-all duration-1000 transform max-w-2xl">
              {heroImages[currentSlide].description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/catalogue" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700 text-lg px-8">
                  Shop Now
                  <FiArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full text-white border-white hover:bg-white/10 text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-green-600 mb-6 p-4 bg-green-50 rounded-full">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {featuredCategories.map((category, index) => (
              <Link 
                key={index} 
                href={category.url}
                className="group relative h-[400px] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                  <div className="absolute bottom-0 p-8 text-white">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-3">{category.name}</h3>
                    <p className="text-base md:text-lg opacity-90">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Farm Fresh Community</h2>
          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Subscribe to our newsletter and be the first to know about seasonal products, special offers, and farm events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-6 py-3 rounded-lg text-gray-900 flex-1 text-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose FarmGrow?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-4">100%</div>
              <p className="text-gray-600 text-lg">Organic Products</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-4">24h</div>
              <p className="text-gray-600 text-lg">Fast Delivery</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-4">1000+</div>
              <p className="text-gray-600 text-lg">Happy Customers</p>
            </div>
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="text-4xl md:text-5xl font-bold text-green-600 mb-4">50+</div>
              <p className="text-gray-600 text-lg">Product Varieties</p>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}