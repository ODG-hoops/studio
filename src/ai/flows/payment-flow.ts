// src/ai/flows/payment-flow.ts
'use server';
/**
 * @fileOverview Handles payment processing using Paystack.
 *
 * - initializePayment - A function that takes payment details and returns a payment URL.
 * - InitializePaymentInput - The input type for the initializePayment function.
 * - InitializePaymentOutput - The return type for the initializePayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InitializePaymentInputSchema = z.object({
  email: z.string().email().describe("The customer's email address."),
  amount: z.number().positive().describe('The amount to be paid in the lowest currency unit (e.g., pesewas).'),
});
export type InitializePaymentInput = z.infer<typeof InitializePaymentInputSchema>;

const InitializePaymentOutputSchema = z.object({
  authorization_url: z.string().url().describe('The URL for the customer to complete the payment.'),
  access_code: z.string().describe('The access code for the transaction.'),
  reference: z.string().describe('The unique reference for the transaction.'),
});
export type InitializePaymentOutput = z.infer<typeof InitializePaymentOutputSchema>;

export async function initializePayment(
  input: InitializePaymentInput
): Promise<InitializePaymentOutput> {
  return initializePaymentFlow(input);
}

const initializePaymentFlow = ai.defineFlow(
  {
    name: 'initializePaymentFlow',
    inputSchema: InitializePaymentInputSchema,
    outputSchema: InitializePaymentOutputSchema,
  },
  async (input) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!secretKey) {
        console.error('Paystack secret key is not set. Please set PAYSTACK_SECRET_KEY in your .env file.');
        throw new Error('Payment service is not configured. The API key is missing.');
    }

    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secretKey}`,
        },
        body: JSON.stringify({
          email: input.email,
          amount: input.amount, // Paystack API expects amount in the lowest currency unit (e.g., pesewas)
          currency: 'GHS',
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.status) {
        console.error('Paystack API Error:', responseData);
        throw new Error(responseData.message || 'Failed to initialize payment.');
      }
      
      return {
        authorization_url: responseData.data.authorization_url,
        access_code: responseData.data.access_code,
        reference: responseData.data.reference,
      };
    } catch (error) {
      console.error('Paystack request failed:', error);
      throw new Error('Failed to communicate with the payment gateway.');
    }
  }
);
