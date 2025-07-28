'use server';

import { getPersonalizedRecommendations } from '@/ai/flows/personalized-recommendations';
import type { PersonalizedRecommendationsInput, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
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
