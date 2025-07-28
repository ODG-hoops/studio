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
import * as Paystack from 'paystack-sdk';

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

// IMPORTANT: You must add your Paystack secret key to your .env file
// as PAYSTACK_SECRET_KEY to enable real transactions.
const paystack = new (Paystack as any)(process.env.PAYSTACK_SECRET_KEY || 'YOUR_PAYSTACK_SECRET_KEY');


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
    try {
      const response = await paystack.transaction.initialize({
        email: input.email,
        amount: input.amount.toString(), // Paystack expects amount as a string
        // currency: 'GHS', // Optional: Specify currency if not using the default from your Paystack account
      });
      
      if (!response.status || !response.data) {
        throw new Error(response.message || 'Failed to initialize payment.');
      }

      return {
        authorization_url: response.data.authorization_url,
        access_code: response.data.access_code,
        reference: response.data.reference,
      };
    } catch (error) {
      console.error('Paystack API Error:', error);
      throw new Error('Failed to communicate with the payment gateway.');
    }
  }
);
