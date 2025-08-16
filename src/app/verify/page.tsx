// src/app/verify/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { handlePaymentVerification, handleSendOrder } from '@/app/actions';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';

type CartItem = Product & { quantity: number; size: string; color: string; };

interface OrderDetails {
  items: CartItem[];
  total: number;
  location: string;
  customerEmail: string;
}

function Verify() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [message, setMessage] = useState('Verifying your payment, please wait...');

  useEffect(() => {
    const reference = searchParams.get('reference');
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found. Your order cannot be verified.');
      return;
    }

    const verify = async () => {
      const verificationResult = await handlePaymentVerification({ reference });

      if (verificationResult.success) {
        setStatus('success');
        setMessage('Payment successful! Finalizing your order...');

        // Retrieve pending order from localStorage
        const pendingOrderString = localStorage.getItem(`pending_order_${reference}`);
        if (!pendingOrderString) {
          setStatus('failed');
          setMessage('Could not find pending order details. Please contact support.');
          return;
        }

        const orderDetails: OrderDetails = JSON.parse(pendingOrderString);

        // Send order notification email and store the result for the confirmation page
        const notificationResult = await handleSendOrder(orderDetails);
        if (notificationResult.success) {
            localStorage.setItem('notification_status', 'sent');
        } else {
            localStorage.setItem('notification_status', 'failed');
        }
        
        // Prepare for confirmation page
        localStorage.setItem('order_confirmation', JSON.stringify(orderDetails));
        
        // Clean up
        localStorage.removeItem(`pending_order_${reference}`);
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('storage')); // Update header cart count

        // Redirect to confirmation page
        router.push('/confirmation');

      } else {
        setStatus('failed');
        setMessage(verificationResult.message || 'Payment verification failed. Your order was not completed. Please try again.');
        // Also clean up the failed pending order
        localStorage.removeItem(`pending_order_${reference}`);
      }
    };

    verify();
  }, [router, searchParams]);

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center" style={{ minHeight: '60vh' }}>
      <div className="max-w-md w-full text-center">
        {status === 'verifying' && <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />}
        {status === 'failed' && <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />}
        {status === 'success' && <CheckCircle className="h-12 w-12 mx-auto text-green-500" />}
        <p className="mt-4 text-lg text-muted-foreground">{message}</p>
        {status === 'failed' && (
            <Button onClick={() => router.push('/cart')} className="mt-6">
                Return to Cart
            </Button>
        )}
      </div>
    </div>
  );
}


export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center" style={{ minHeight: '60vh' }}>
                <div className="max-w-md w-full text-center">
                    <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary" />
                    <p className="mt-4 text-lg text-muted-foreground">Loading verification...</p>
                </div>
            </div>
        }>
            <Verify />
        </Suspense>
    )
}
