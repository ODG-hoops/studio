// src/ai/flows/verify-payment-flow.ts
'use server';
/**
 * @fileOverview Verifies a Paystack transaction.
 *
 * - verifyPayment - A function that takes a transaction reference and verifies its status.
 * - VerifyPaymentInput - The input type for the verifyPayment function.
 * - VerifyPaymentOutput - The return type for the verifyPayment function.
 */
import { config } from 'dotenv';
config();

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VerifyPaymentInputSchema = z.object({
  reference: z.string().describe('The transaction reference from Paystack.'),
});
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentInputSchema>;

const VerifyPaymentOutputSchema = z.object({
  success: z.boolean().describe('Whether the payment was successful.'),
  message: z.string().describe('The status message.'),
  data: z.any().optional().describe('The transaction data from Paystack if successful.'),
});
export type VerifyPaymentOutput = z.infer<typeof VerifyPaymentOutputSchema>;

export async function verifyPayment(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
  return verifyPaymentFlow(input);
}

const verifyPaymentFlow = ai.defineFlow(
  {
    name: 'verifyPaymentFlow',
    inputSchema: VerifyPaymentInputSchema,
    outputSchema: VerifyPaymentOutputSchema,
  },
  async (input) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      const errorMessage = 'Payment service is not configured. The API key is missing.';
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${input.reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.status) {
        console.error('Paystack Verification Error:', responseData);
        return { success: false, message: responseData.message || 'Failed to verify payment.' };
      }

      if (responseData.data.status === 'success') {
        return { success: true, message: 'Payment verified successfully.', data: responseData.data };
      } else {
        return { success: false, message: `Payment not successful. Status: ${responseData.data.status}` };
      }
    } catch (error) {
      console.error('Paystack verification request failed:', error);
      throw error;
    }
  }
);
