'use client';

import { useCart } from '../../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link 
            href="/catalogue" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 border-b py-4">
              <div className="relative w-24 h-24 flex-shrink-0">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No image</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.unitQuantity} {item.unit} per unit
                </p>
                <p className="text-green-600 font-semibold">
                  ${item.price.toFixed(2)} per {item.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 border rounded-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
              onClick={() => alert('Checkout functionality coming soon!')}
            >
              Proceed to Checkout
            </button>
            <Link
              href="/catalogue"
              className="block text-center text-green-600 mt-4 hover:underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 