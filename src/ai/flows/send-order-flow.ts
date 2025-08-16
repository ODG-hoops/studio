// src/ai/flows/send-order-flow.ts
'use server';
/**
 * @fileOverview Handles sending order confirmation emails to the store owner.
 *
 * - sendOrderToOwner - A function that takes order details and sends an email.
 * - SendOrderInput - The input type for the sendOrderToOwner function.
 * - SendOrderOutput - The return type for the sendOrderToOwner function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { products } from '@/lib/data';

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
  customerEmail: z.string().email().describe("The customer's email address, included in the original payment request."),
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

// This is a mock email sending function.
// In a real application, you would integrate with an email service like SendGrid, Resend, or Nodemailer.
// For this example, we will just log the email content to the console.
async function sendEmail(to: string, subject: string, body: string) {
    console.log("--- Sending Email ---");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${body}`);
    console.log("--- Email Sent (Mock) ---");

    // In a real scenario, you would have logic here to handle success/failure from your email provider
    return { success: true, message: "Email sent successfully (mock)." };
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
      const errorMessage = 'OWNER_EMAIL is not set in the .env file. Cannot send order notification.';
      console.error(errorMessage);
      return { success: false, message: errorMessage };
    }
    
    // Construct email body
    const itemsList = input.items.map(item => 
        `- ${item.name} (Size: ${item.size}, Color: ${item.color}) x ${item.quantity} @ GH₵${item.price.toFixed(2)} each`
    ).join('\n');

    const emailBody = `
You have a new order from Style Maverik INC.!

Customer Email: ${input.customerEmail}
Delivery Location: ${input.location}

Order Details:
${itemsList}

-----------------------------------
Total Amount Paid: GH₵${input.total.toFixed(2)}
-----------------------------------

Please prepare the order for delivery.
`;

    const subject = `New Order Notification - Total: GH₵${input.total.toFixed(2)}`;

    // Send the email
    const result = await sendEmail(ownerEmail, subject, emailBody);
    
    return result;
  }
);
