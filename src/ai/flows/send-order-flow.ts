// src/ai/flows/send-order-flow.ts
'use server';
/**
 * @fileOverview Handles sending order confirmation emails to the store owner using Resend.
 *
 * - sendOrderToOwner - A function that handles the order notification process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Resend } from 'resend';

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number(),
  size: z.string(),
  color: z.string(),
});

const SendOrderInputSchema = z.object({
  items: z.array(CartItemSchema).describe("The items in the customer's order."),
  total: z.number().describe('The total amount paid by the customer.'),
  location: z.string().describe("The customer's delivery location."),
  customerEmail: z.string().email().describe("The customer's email address."),
});
export type SendOrderInput = z.infer<typeof SendOrderInputSchema>;

const SendOrderOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendOrderOutput = z.infer<typeof SendOrderOutputSchema>;

export async function sendOrderToOwner(input: SendOrderInput): Promise<SendOrderOutput> {
  return sendOrderFlow(input);
}

/**
 * Sends a formatted email to the store owner.
 */
async function sendEmail(to: string, subject: string, body: string) {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_RESEND_API_KEY_HERE') {
        console.warn("RESEND_API_KEY is missing. Falling back to logs.");
        console.log(`--- NEW ORDER NOTIFICATION (MOCK) ---`);
        console.log(`To: ${to}\nSubject: ${subject}\nBody:\n${body}`);
        console.log(`-------------------------------------`);
        return { success: false, message: "Resend API key missing. Order captured in logs." };
    }

    try {
        const resend = new Resend(apiKey);
        const { data, error } = await resend.emails.send({
            from: 'Style Maverik <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            text: body,
        });

        if (error) {
            console.error('Resend Error:', error);
            return { success: false, message: error.message };
        }

        return { success: true, message: 'Email sent successfully via Resend.' };
    } catch (err) {
        console.error('Email processing failed:', err);
        return { success: false, message: 'Unexpected email error.' };
    }
}

const sendOrderFlow = ai.defineFlow(
  {
    name: 'sendOrderFlow',
    inputSchema: SendOrderInputSchema,
    outputSchema: SendOrderOutputSchema,
  },
  async (input) => {
    const ownerEmail = process.env.OWNER_EMAIL;

    if (!ownerEmail) {
      console.error('OWNER_EMAIL is not set. Cannot notify owner.');
      return { success: false, message: 'Owner email not configured.' };
    }
    
    const itemsList = input.items.map(item => 
        `- ${item.name} (Size: ${item.size}, Color: ${item.color}) x ${item.quantity} @ GH₵${item.price.toFixed(2)}`
    ).join('\n');

    const emailBody = `
You have a new order from Style Maverik INC.!

Customer Details:
Email: ${input.customerEmail}
Delivery Location: ${input.location}

Order Summary:
${itemsList}

-----------------------------------
Total Paid: GH₵${input.total.toFixed(2)}
-----------------------------------

Please check your Paystack dashboard to confirm payment and prepare the order for delivery.
`;

    const subject = `Style Maverik Order: GH₵${input.total.toFixed(2)} from ${input.customerEmail}`;

    const result = await sendEmail(ownerEmail, subject, emailBody);
    
    return result;
  }
);
