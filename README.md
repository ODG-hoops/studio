
# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Email Notification:** An automated order details email is sent to you via **Resend**. 
4. **Data Captured:** You receive the customer's **email**, **delivery location**, and **specific items (Size, Color, Quantity)**.

### 📧 Setting Up Your Email Notifications (Crucial)
To receive orders in your inbox, follow these steps:

1. **Sign Up:** Create a free account at [Resend.com](https://resend.com). You can use any email (e.g., your Gmail).
2. **Get API Key:** Copy the "API Key" from your Resend dashboard.
3. **Add to Vercel:** Go to your Vercel Project Settings -> **Environment Variables** and add these:
   * `RESEND_API_KEY`: The key you just copied.
   * `OWNER_EMAIL`: The email you used to sign up for Resend (e.g., `stylemaverikclothing@gmail.com`).
   * `PAYSTACK_SECRET_KEY`: Your live secret key from Paystack.
   * `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your public key from Paystack.

**Note on Resend Free Tier:** Until you verify a custom domain (like `stylemaverik.com`), Resend will only deliver emails to the address you signed up with. This is perfect for receiving your own orders!

### 🕵️ How to See Order Details in Logs
If your email isn't set up yet, you can still see every order:
1. Go to your project on [Vercel](https://vercel.com).
2. Click on the **"Logs"** tab.
3. Look for "Sending order to owner" to see the full breakdown of what was bought.

## 🚀 How to Update the Site (New Products/Prices)

Whenever we change something in the code here, use these commands in your terminal to push them live:

1. `git add .`
2. `git commit -m "Update store details"`
3. `git push`

---
*Style Maverik INC. - Redefining Modern Elegance*
