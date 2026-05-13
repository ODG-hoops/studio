
'use server';

import { z } from 'zod';
import { headers } from 'next/headers';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import { initializePayment } from '@/ai/flows/payment-flow';
import { sendOrderToOwner } from '@/ai/flows/send-order-flow';
import { verifyPayment } from '@/ai/flows/verify-payment-flow';
import { products } from '@/lib/data';
import { checkRateLimit } from '@/lib/rate-limit';

// Security Consts
const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024; // 1MB

// Validation Schemas
const RecommendationsSchema = z.object({
  browsingHistory: z.array(z.string()).max(50),
});

const PaymentInitSchema = z.object({
  email: z.string().email(),
  amount: z.number().positive(),
  callback_url: z.string().url(),
});

const PaymentVerifySchema = z.object({
  reference: z.string().min(1).max(100),
});

const SendOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
    size: z.string(),
    color: z.string(),
  })),
  total: z.number(),
  location: z.string().min(1).max(500),
  customerEmail: z.string().email(),
});

// Helper for payload size check
function checkSize(data: any) {
  const size = Buffer.byteLength(JSON.stringify(data));
  if (size > MAX_PAYLOAD_SIZE) {
    throw new Error('Payload too large.');
  }
}

// Helper to get client ID (IP)
async function getClientId() {
  const heads = await headers();
  return heads.get('x-forwarded-for') || 'unknown';
}

export async function fetchRecommendations(input: any) {
  try {
    checkSize(input);
    const validated = RecommendationsSchema.parse(input);
    return await getPersonalizedRecommendations(validated);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    const allProductIds = products.map(p => p.id);
    const recommendations = allProductIds.sort(() => 0.5 - Math.random()).slice(0, 4);
    return { recommendations };
  }
}

export async function handlePaymentInitialization(input: any) {
    try {
        checkSize(input);
        const validated = PaymentInitSchema.parse(input);
        const clientId = await getClientId();

        // Rate Limit: 10 per minute per IP for payments
        const rl = await checkRateLimit(`pay_${clientId}`, { maxAttempts: 10, windowMinutes: 1, blockMinutes: 5 });
        if (!rl.allowed) return { checkoutUrl: null, error: rl.error || 'Too many requests.', reference: null };

        const response = await initializePayment(validated);
        if (response && response.authorization_url) {
            return { checkoutUrl: response.authorization_url, error: null, reference: response.reference };
        }
        return { checkoutUrl: null, error: 'Failed to get authorization URL.', reference: null };
    } catch (error) {
        console.error('Payment Initialization Error:', error);
        return { checkoutUrl: null, error: (error as any).message || 'Validation failed.', reference: null };
    }
}

export async function handlePaymentVerification(input: any) {
    try {
        checkSize(input);
        const validated = PaymentVerifySchema.parse(input);
        return await verifyPayment(validated);
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return { success: false, message: 'Invalid verification request.' };
    }
}

export async function handleSendOrder(input: any) {
    try {
      checkSize(input);
      const validated = SendOrderSchema.parse(input);
      return await sendOrderToOwner(validated);
    } catch (error) {
      console.error('Error sending order notification:', error);
      return { success: false, message: 'Failed to send order notification.' };
    }
}

/**
 * Specifically for Admin Login Rate Limiting
 */
export async function checkLoginBlock() {
  const clientId = await getClientId();
  // 5 attempts per 10 minutes
  const rl = await checkRateLimit(`login_${clientId}`, { maxAttempts: 5, windowMinutes: 10, blockMinutes: 15 });
  return rl;
}
