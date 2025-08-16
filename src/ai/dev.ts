import { config } from 'dotenv';
config();

import '@/ai/flows/personalized-recommendations.ts';
import '@/ai/flows/payment-flow.ts';
import '@/ai/flows/send-order-flow.ts';
import '@/ai/flows/verify-payment-flow.ts';
