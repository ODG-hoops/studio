// src/ai/flows/payment-flow.ts
'use server';
/**
 * @fileOverview Handles payment processing using Paystack.
 *
 * - initializePayment - A function that takes payment details and returns a payment URL.
 * - InitializePaymentInput - The input type for the initializePayment function.
 * - InitializePaymentOutput - The return type for the initializePayment function.
 */
import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const InitializePaymentInputSchema = z.object({
  email: z.string().email().describe("The customer's email address."),
  amount: z.number().positive().describe('The amount to be paid in the lowest currency unit (e.g., pesewas).'),
  callback_url: z.string().url().describe('The URL to redirect to after payment attempt.'),
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
      const errorMessage = 'Payment service is not configured. The API key is missing.';
      console.error(errorMessage, 'Please check your .env file and restart the server.');
      throw new Error(errorMessage);
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
          callback_url: input.callback_url,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.status) {
        console.error('Paystack API Error:', responseData);
        // Throw the specific message from Paystack if available
        throw new Error(responseData.message || 'Failed to initialize payment with Paystack.');
      }
      
      return {
        authorization_url: responseData.data.authorization_url,
        access_code: responseData.data.access_code,
        reference: responseData.data.reference,
      };
    } catch (error) {
      console.error('Paystack request failed:', error);
      // Re-throw the original error to be caught by the action handler
      throw error;
    }
  }
);
