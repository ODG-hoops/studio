import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins = [];

// Vercel build can fail if GEMINI_API_KEY is not set.
// This allows the build to pass. Features will fail gracefully at runtime
// until the key is added in Vercel's environment variables.
if (process.env.GEMINI_API_KEY) {
  plugins.push(googleAI());
} else {
  console.warn("GEMINI_API_KEY is not set. AI features will not work on the deployed site until the key is provided.");
}

export const ai = genkit({
  plugins: plugins,
  model: plugins.length > 0 ? 'googleai/gemini-2.0-flash' : undefined,
});
