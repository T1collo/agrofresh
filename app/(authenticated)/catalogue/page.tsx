'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  unit: string;
  unitQuantity: number;
  image: string | null;
  category: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function CataloguePage() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({
          search: searchQuery,
          sort: sortBy,
          order: sortOrder,
        });

        if (selectedCategoryId) {
          params.append('categoryId', selectedCategoryId);
        }

        const response = await fetch(`/api/products?${params}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCategoryId, sortBy, sortOrder]);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitQuantity: product.unitQuantity,
      image_url: product.image,
      quantity: 1
    });
    toast.success(`${product.name} added to cart`, {
      description: `${product.unitQuantity} ${product.unit} at $${product.price.toFixed(2)} per ${product.unit}`,
      duration: 2000,
    });
  };

  return (
    <div className="flex-1 p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 rounded-lg px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg">
          Product Catalogue
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Categories</h3>
                    <div className="space-y-2">
                      <Button
                        variant={selectedCategoryId === null ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedCategoryId(null);
                          setIsFilterOpen(false);
                        }}
                      >
                        All Categories
                      </Button>
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategoryId === category.id ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => {
                            setSelectedCategoryId(category.id);
                            setIsFilterOpen(false);
                          }}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {selectedCategoryId && (
        <div className="mb-4 flex gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            Category: {categories.find(c => c.id === selectedCategoryId)?.name}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0"
              onClick={() => setSelectedCategoryId(null)}
            >
              ×
            </Button>
          </Badge>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="aspect-square w-full" />
              </CardHeader>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <CardHeader className="p-0">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || '/images/placeholder-product.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={false}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-600">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    {product.unitQuantity} {product.unit}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}