'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product } from '@/types'

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

interface CachedProducts {
  data: Product[]
  timestamp: number
  params: string
}

export function useProducts(params: {
  search?: string
  categoryId?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  limit?: number
} = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getProductsFromCache = useCallback((): Product[] | null => {
    const paramsString = JSON.stringify(params)
    const cached = sessionStorage.getItem('products')
    if (!cached) return null

    const { data, timestamp, params: cachedParams }: CachedProducts = JSON.parse(cached)
    if (
      Date.now() - timestamp > CACHE_DURATION ||
      paramsString !== cachedParams
    ) {
      sessionStorage.removeItem('products')
      return null
    }

    return data
  }, [params])

  const setProductsWithCache = useCallback((products: Product[]) => {
    setProducts(products)
    const cacheData: CachedProducts = {
      data: products,
      timestamp: Date.now(),
      params: JSON.stringify(params)
    }
    sessionStorage.setItem('products', JSON.stringify(cacheData))
  }, [params])

  const fetchProducts = useCallback(async () => {
    try {
      // Try cache first
      const cachedProducts = getProductsFromCache()
      if (cachedProducts) {
        setProducts(cachedProducts)
        setLoading(false)
        return
      }

      // Build query params
      const queryParams = new URLSearchParams()
      if (params.search) queryParams.append('search', params.search)
      if (params.categoryId) queryParams.append('categoryId', params.categoryId)
      if (params.sortBy) queryParams.append('sort', params.sortBy)
      if (params.sortOrder) queryParams.append('order', params.sortOrder)
      if (params.limit) queryParams.append('limit', params.limit.toString())

      const response = await fetch(`/api/products?${queryParams}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProductsWithCache(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [params, getProductsFromCache, setProductsWithCache])

  useEffect(() => {
    const debounceTimer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(debounceTimer)
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
} 