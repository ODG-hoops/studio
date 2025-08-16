// src/app/confirmation/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Receipt } from '@/components/receipt';
import type { Product } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { handleSendOrder } from '@/app/actions';

type CartItem = Product & { quantity: number; size: string; color: string; };

interface OrderDetails {
  items: CartItem[];
  total: number;
  location: string;
  customerEmail: string;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<'sending' | 'sent' | 'failed'>('sending');
  const router = useRouter();

  const sendOrderNotification = useCallback(async (orderDetails: OrderDetails) => {
    // This function is already called from the verify page.
    // We are just checking the result here.
    const notificationResult = localStorage.getItem('notification_status');
    if (notificationResult === 'sent') {
      setNotificationStatus('sent');
    } else if (notificationResult === 'failed') {
      setNotificationStatus('failed');
    }
    localStorage.removeItem('notification_status');
  }, []);


  useEffect(() => {
    const storedOrder = localStorage.getItem('order_confirmation');
    if (storedOrder) {
      try {
        const parsedOrder: OrderDetails = JSON.parse(storedOrder);
        setOrder(parsedOrder);
        sendOrderNotification(parsedOrder);
        
        // Cleanup is now handled in verify page, but we ensure it's gone here too.
        localStorage.removeItem('order_confirmation');
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage')); // Update header cart count
      } catch (error) {
        console.error("Failed to parse order from localStorage", error);
        router.push('/');
      }
    } else {
      // If no order data, redirect to home. This can happen on page reload.
      router.push('/');
    }
  }, [router, sendOrderNotification]);


  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 md:py-24 text-center flex justify-center items-center" style={{ minHeight: '60vh' }}>
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
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
           {notificationStatus === 'failed' && (
             <div className="mt-4 flex items-center justify-center gap-2 text-destructive text-sm p-3 bg-destructive/10 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                <p>There was an issue notifying the store owner. Please contact them directly with your order details.</p>
             </div>
           )}
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
