"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useCart } from "../../../context/CartContext"; // <-- Import useCart
import { Product } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function CategoryPage() {
  const { category } = useParams();
  const { addToCart } = useCart(); // <-- Use the hook
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert kebab-case to proper case (e.g., "fresh-produce" -> "Fresh Produce")
  const formatCategoryName = (kebabCase: string) => {
    return kebabCase
      .split('-')
      .map(word => {
        // Convert "and" to "&" for database matching
        if (word === 'and') return '&';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const formattedCategory = formatCategoryName(category as string);
        const response = await fetch(`/api/products?category=${encodeURIComponent(formattedCategory)}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch products');
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response format');
        }

        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error instanceof Error ? error.message : 'Failed to load products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = (product: Product) => {
    try {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        unitQuantity: product.unit_quantity,
        image_url: product.image_url,
        quantity: 1
      });
      toast.success(`${product.name} added to cart`, {
        description: `${product.unit_quantity} ${product.unit} at $${product.price.toFixed(2)} per ${product.unit}`,
        duration: 2000,
      });
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 sm:py-8">
      {/* Category Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 capitalize">
          {formatCategoryName(category as string)}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          {products.length} {products.length === 1 ? 'product' : 'products'} available
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {products.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        ) : (
          products.map((product) => (
            <Card 
              key={product.id} 
              className="overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Product Image */}
              {product.image_url && (
                <div className="relative w-full aspect-square">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                    priority={false}
                  />
                </div>
              )}

              {/* Product Details */}
              <CardContent className="p-4">
                <h3 className="font-semibold text-base md:text-lg text-gray-900 line-clamp-1 mb-1">
                  {product.name}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-auto pt-2">
                  <div className="mb-2">
                    <p className="text-lg md:text-xl font-bold text-green-600 leading-tight">
                      ${product.price.toFixed(2)}
                    </p>
                    <p className="text-xs md:text-sm font-semibold text-gray-700 mt-1">
                      per {product.unit_quantity > 1 ? `${product.unit_quantity} ${product.unit}s` : product.unit}
                    </p>
                  </div>
                  <Button 
                    className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}