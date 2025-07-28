// src/components/payment-options.tsx
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { CreditCard, Landmark, Phone, Wallet } from "lucide-react";
import { AlertDialogFooter, AlertDialogCancel } from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function PaymentOptions({ onPaymentSuccess }: { onPaymentSuccess: () => void }) {
  const bankLogos = {
    'Ghana Commercial Bank': 'https://placehold.co/100x40.png',
    'Ecobank': 'https://placehold.co/100x40.png',
    'Universal Merchant Bank': 'https://placehold.co/100x40.png',
  };

  const handlePayment = (method: string) => {
    console.log(`Processing payment with ${method}`);
    // Simulate API call
    setTimeout(() => {
      onPaymentSuccess();
    }, 1000);
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="momo">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
             <Phone className="h-5 w-5" />
             <span>Mobile Money (MTN, Telecel)</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted/50 rounded-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="momo-number">Phone Number</Label>
            <Input id="momo-number" placeholder="024 123 4567" />
          </div>
          <Button className="w-full" onClick={() => handlePayment('Mobile Money')}>Pay with MoMo</Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="bank-transfer">
        <AccordionTrigger>
           <div className="flex items-center gap-3">
            <Landmark className="h-5 w-5" />
            <span>Bank Transfer</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted/50 rounded-md space-y-4">
            <p className="text-sm">Select your bank and follow the instructions to complete the transfer.</p>
            <div className="flex flex-wrap gap-2">
               {Object.entries(bankLogos).map(([bank, logo]) => (
                 <Button key={bank} variant="outline" className="h-12 flex-grow" onClick={() => handlePayment(bank)}>
                   <span>{bank}</span>
                 </Button>
               ))}
            </div>
        </AccordionContent>
      </AccordionItem>
       <AccordionItem value="paypal">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5" />
            <span>PayPal</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted/50 rounded-md">
            <Button className="w-full" onClick={() => handlePayment('PayPal')}>Proceed with PayPal</Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="card">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <span>Credit/Debit Card</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted/50 rounded-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="**** **** **** ****" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
           <Button className="w-full" onClick={() => handlePayment('Credit Card')}>Pay Now</Button>
        </AccordionContent>
      </AccordionItem>
      <AlertDialogFooter className="mt-4">
        <AlertDialogCancel>Cancel</AlertDialogCancel>
      </AlertDialogFooter>
    </Accordion>
  );
}
