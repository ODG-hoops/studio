// src/components/payment-options.tsx
'use client';

import { useState } from 'react';
import { Button } from "./ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { handlePaymentInitialization } from '@/app/actions';

export function PaymentOptions({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handlePayment = async () => {
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address to proceed.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await handlePaymentInitialization({ email, amount });

      if (result.error) {
        // Use the specific error from the server action
        throw new Error(result.error);
      }

      if (result.checkoutUrl) {
        // Before redirecting, we can call onPaymentSuccess to prepare the confirmation page data
        onPaymentSuccess();
        // Redirect to Paystack's checkout page
        router.push(result.checkoutUrl);
      } else {
        throw new Error('Could not retrieve checkout URL.');
      }

    } catch (error) {
      console.error("Payment failed", error);
      toast({
        title: "Payment Failed",
        description: (error as Error).message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <Button className="w-full" onClick={handlePayment} disabled={isLoading || !email}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Proceed to Pay GH₵{(amount / 100).toFixed(2)}
          </>
        )}
      </Button>
    </div>
  );
}
