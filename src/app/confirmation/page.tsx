// src/app/confirmation/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from '@/components/receipt';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

type CartItem = Product & { quantity: number };

export default function ConfirmationPage() {
  const [order, setOrder] = useState<{ items: CartItem[]; total: number, location: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedOrder = localStorage.getItem('order_confirmation');
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder));
      // Optionally clear the stored order after displaying it
      localStorage.removeItem('order_confirmation');
    } else {
      // If no order data, maybe they landed here by mistake.
      // Redirect to home if no order data is found
      router.push('/');
    }
  }, [router]);

  // This useEffect will run when the page is visited, which happens after Paystack redirects back.
  // We can finalize the process here if needed, like clearing the main cart.
  useEffect(() => {
    localStorage.removeItem('cart');
    // Dispatch a storage event to update the header cart count to 0
    window.dispatchEvent(new Event('storage'));
  }, []);

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <p>Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Thank You For Your Purchase!</CardTitle>
          <p className="text-muted-foreground pt-2">
            Your order has been confirmed. A receipt has been sent to your email.
          </p>
        </CardHeader>
        <CardContent>
          <Receipt items={order.items} total={order.total} location={order.location} />
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={() => router.push('/collections')}>Continue Shopping</Button>
            <Button variant="outline" onClick={() => window.print()}>Print Receipt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
