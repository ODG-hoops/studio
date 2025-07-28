// src/components/payment-options.tsx
'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { CreditCard, Landmark, Phone, Wallet } from "lucide-react";

export function PaymentOptions() {
  const bankLogos = {
    'Ghana Commercial Bank': 'https://placehold.co/100x40.png',
    'Ecobank': 'https://placehold.co/100x40.png',
    'Universal Merchant Bank': 'https://placehold.co/100x40.png',
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
        <AccordionContent className="p-4 bg-muted/50 rounded-md">
          <p>Please follow the instructions on your phone to complete the payment.</p>
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
            <p>Select your bank:</p>
            <div className="flex flex-wrap gap-2">
               {Object.entries(bankLogos).map(([bank, logo]) => (
                 <Button key={bank} variant="outline" className="h-12">
                   {/* In a real app, you'd use actual logos */}
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
            <Button className="w-full">Proceed with PayPal</Button>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="card">
        <AccordionTrigger>
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5" />
            <span>Credit/Debit Card</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-4 bg-muted/50 rounded-md">
          <p>Please enter your card details on the next page.</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
