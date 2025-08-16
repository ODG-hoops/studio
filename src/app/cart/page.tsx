// src/app/cart/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Product } from '@/lib/types';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, AlertDialogDescription, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { PaymentOptions } from '@/components/payment-options';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export type CartItem = Product & { quantity: number; size: string; color: string; };

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        if(Array.isArray(parsedCart.items)) {
           setCartItems(parsedCart.items);
        }
      } catch (error) {
        console.error("Failed to parse cart from localStorage", error);
        setCartItems([]);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  const updateCart = (newCartItems: CartItem[]) => {
    setCartItems(newCartItems);
    const cartToStore = { items: newCartItems };
    localStorage.setItem('cart', JSON.stringify(cartToStore));
     // Dispatch a storage event to update the header
    window.dispatchEvent(new Event('storage'));
  };

  const handleQuantityChange = (productId: string, size: string, color: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(productId, size, color);
    } else {
      const newCartItems = cartItems.map(item =>
        item.id === productId && item.size === size && item.color === color ? { ...item, quantity: newQuantity } : item
      );
      updateCart(newCartItems);
    }
  };

  const removeItem = (productId: string, size: string, color: string) => {
    const newCartItems = cartItems.filter(item => !(item.id === productId && item.size === size && item.color === color));
    updateCart(newCartItems);
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(e.target.value);
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const prepareForPayment = (email: string, reference: string) => {
    const pendingOrder = { items: cartItems, total, location, customerEmail: email };
    localStorage.setItem(`pending_order_${reference}`, JSON.stringify(pendingOrder));
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
                    <li key={`${item.id}-${item.size}-${item.color}`} className="flex items-center p-4 sm:p-6">
                      <Image
                        src={item.image}
                        alt={item.name}
                        data-ai-hint={item.imageHint}
                        width={100}
                        height={100}
                        className="rounded-md object-cover mr-6"
                      />
                      <div className="flex-grow">
                        <Link href={`/products/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                        <p className="text-sm text-muted-foreground">GH₵{item.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Size: {item.size}, Color: {item.color}</p>
                         <div className="flex items-center gap-2 mt-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity - 1)}>
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-medium w-8 text-center">{item.quantity}</span>
                             <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleQuantityChange(item.id, item.size, item.color, item.quantity + 1)}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">GH₵{(item.price * item.quantity).toFixed(2)}</p>
                        <Button variant="ghost" size="icon" className="mt-2 text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.id, item.size, item.color)}>
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
                 <div className="space-y-2">
                    <Label htmlFor="location">Delivery Location</Label>
                    <Input id="location" placeholder="e.g., East Legon, Accra" value={location} onChange={handleLocationChange} />
                    <p className="text-xs text-muted-foreground">Delivery fee will be calculated and paid later.</p>
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
                    <Button className="w-full" size="lg" disabled={!location || cartItems.length === 0}>Confirm my purchase</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Purchase</AlertDialogTitle>
                       <AlertDialogDescription>
                        To complete your purchase, please provide your email address and proceed to the secure payment page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <PaymentOptions 
                      amount={total * 100} // Paystack expects amount in pesewas
                      onPrepareForPayment={prepareForPayment} 
                    />
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
