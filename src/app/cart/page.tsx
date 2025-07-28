// src/app/cart/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { products } from '@/lib/data';
import type { Product } from '@/lib/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PaymentOptions } from '@/components/payment-options';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

// Mock cart data for demonstration
const initialCartItems = [
  { ...products.find(p => p.id === 'p1')!, quantity: 1 },
  { ...products.find(p => p.id === 'p5')!, quantity: 2 },
  { ...products.find(p => p.id === 'p7')!, quantity: 1 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const router = useRouter();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Remove item if quantity is less than 1
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 50; // Example shipping cost
  const total = subtotal + shipping;

  const handlePaymentSuccess = () => {
    // In a real app, you would handle payment processing here.
    // On success, you would then redirect.
    // For this demo, we'll just redirect to a confirmation page.
    localStorage.setItem('cart', JSON.stringify({ items: cartItems, total }));
    router.push('/confirmation');
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Shopping Cart</h1>
      </div>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6">
            <Link href="/collections">Continue Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <ul className="divide-y divide-border">
                  {cartItems.map(item => (
                    <li key={item.id} className="flex items-center p-4 sm:p-6">
                      <Image
                        src={item.image}
                        alt={item.name}
                        data-ai-hint={item.imageHint}
                        width={100}
                        height={100}
                        className="rounded-md object-cover mr-6"
                      />
                      <div className="flex-grow">
                        <Link href="#" className="font-semibold hover:text-primary">{item.name}</Link>
                        <p className="text-sm text-muted-foreground">GH₵{item.price.toFixed(2)}</p>
                         <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <Input type="number" value={item.quantity} readOnly className="h-8 w-14 text-center" />
                             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 sticky top-24">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>GH₵{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>GH₵{shipping.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>GH₵{total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                 <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full" size="lg">Confirm my purchase</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Select Payment Method</AlertDialogTitle>
                    </AlertDialogHeader>
                    <PaymentOptions onPaymentSuccess={handlePaymentSuccess} />
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
