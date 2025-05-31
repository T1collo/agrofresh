'use client';

import { useCart } from '@/app/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string | null;
  unit: string;
  unitQuantity: number;
  stock: number;
  category: {
    name: string;
  };
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      unitQuantity: product.unitQuantity,
      image: product.image_url ?? '',
      quantity: 1
    });
    toast.success(`${product.name} added to cart`, {
      description: `${product.unitQuantity} ${product.unit} at $${product.price.toFixed(2)} per ${product.unit}`,
      duration: 2000,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // First, get the category ID from the slug
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) throw new Error('Failed to fetch categories');
        const categories = await categoriesResponse.json();
        
        const category = categories.find((cat: any) => 
          cat.name.toLowerCase().replace(/[& ]/g, '-') === params.slug.toLowerCase()
        );

        if (!category) {
          setError('Category not found');
          setLoading(false);
          return;
        }

        // Then fetch products for this category
        const productsResponse = await fetch(`/api/products?categoryId=${category.id}`);
        if (!productsResponse.ok) throw new Error('Failed to fetch products');
        const data = await productsResponse.json();
        setProducts(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-1/4 mb-6" />
        </div>
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 rounded-lg px-6 py-4 bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg capitalize">
          {params.slug.replace(/-/g, ' ').replace(/and/g, '&')}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={product.image_url || '/images/no-image.png'}
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
                className="w-full"
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No products found</h3>
          <p className="text-gray-500">This category is currently empty</p>
        </div>
      )}
    </div>
  );
} 