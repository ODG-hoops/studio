// src/ai/flows/personalized-recommendations.ts
'use server';
/**
 * @fileOverview Provides personalized product recommendations based on a user's browsing history.
 *
 * - getPersonalizedRecommendations - A function that takes a user's browsing history and returns personalized product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z
    .array(z.string())
    .describe('An array of product IDs representing the user\'s browsing history.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of product IDs recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const personalizedRecommendationsPrompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {
    schema: PersonalizedRecommendationsInputSchema,
  },
  output: {
    schema: PersonalizedRecommendationsOutputSchema,
  },
  prompt: `You are a personal shopping assistant for Style Maverik INC., an elegant clothing brand. Based on the customer's past browsing history, provide personalized product recommendations. Only recommend products that are available on Style Maverik INC.

Browsing History: {{browsingHistory}}

Recommendations:`, // Ensure it's 