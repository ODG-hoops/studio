'use server';

import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { initializePayment } from '@/ai/flows/payment-flow';
import type { InitializePaymentInput, InitializePaymentOutput } from '@/ai/flows/payment-flow';
import { sendOrderToOwner } from '@/ai/flows/send-order-flow';
import type { SendOrderInput, SendOrderOutput } from '@/ai/flows/send-order-flow';
import { verifyPayment } from '@/ai/flows/verify-payment-flow';
import type { VerifyPaymentInput, VerifyPaymentOutput } from '@/ai/flows/verify-payment-flow';
import { products } from '@/lib/data';

// This is a mock implementation because the genkit flow cannot be executed here.
// In a real environment, this would call the actual AI service.
async function getMockRecommendations(input: PersonalizedRecommendationsInput): Promise<PersonalizedRecommendationsOutput> {
  const allProductIds = products.map(p => p.id);
  // Simple logic: recommend products that are not in the browsing history.
  const recommendations = allProductIds.filter(id => !input.browsingHistory.includes(id));
  
  // Return a random subset of recommendations to simulate variability.
  const shuffled = recommendations.sort(() => 0.5 - Math.random());
  return Promise.resolve({ recommendations: shuffled.slice(0, 4) });
}


export async function fetchRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  try {
    // The actual AI call is commented out to allow the app to run without a live Genkit environment.
    // In a real deployment, you would uncomment this line and remove the mock call.
    return await getPersonalizedRecommendations(input);

    // return await getMockRecommendations(input);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    // Fallback to mock on error
    return getMockRecommendations(input);
  }
}

export async function handlePaymentInitialization(input: InitializePaymentInput): Promise<{ checkoutUrl: string | null; error: string | null; reference: string | null; }> {
    try {
        const response = await initializePayment(input);
        if (response && response.authorization_url) {
            return { checkoutUrl: response.authorization_url, error: null, reference: response.reference };
        }
        return { checkoutUrl: null, error: 'Failed to get authorization URL.', reference: null };
    } catch (error) {
        console.error('Payment Initialization Error:', error);
        return { checkoutUrl: null, error: (error as Error).message || 'Failed to initialize payment.', reference: null };
    }
}

export async function handlePaymentVerification(input: VerifyPaymentInput): Promise<VerifyPaymentOutput> {
    try {
        const result = await verifyPayment(input);
        return result;
    } catch (error) {
        console.error('Payment Verification Error:', error);
        return { success: false, message: (error as Error).message || 'Failed to verify payment.' };
    }
}


export async function handleSendOrder(
    input: SendOrderInput
  ): Promise<SendOrderOutput> {
    try {
      console.log("Sending order to owner:", input);
      const result = await sendOrderToOwner(input);
      console.log("Send order result:", result);
      return result;
    } catch (error) {
      console.error('Error sending order notification:', error);
      return {
        success: false,
        message: 'Failed to send order notification.',
      };
    }
  }
