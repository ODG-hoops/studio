
# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Email Notification:** An automated order details email is sent to you via **Resend**. 
4. **Data Captured:** You receive the customer's **email**, **delivery location**, and **specific items (Size, Color, Quantity)**.

### 📧 Setting Up Your Email Notifications (Final Steps)
To receive orders in your inbox, you MUST add your credentials to Vercel:

1. **Vercel Settings:** Go to your project on [Vercel](https://vercel.com).
2. **Environment Variables:** Click **Settings** -> **Environment Variables**.
3. **Add These Three Variables:**
   * `RESEND_API_KEY`: Paste the key you got from Resend.
   * `OWNER_EMAIL`: The email you used to sign up for Resend (e.g., your personal Gmail).
   * `PAYSTACK_SECRET_KEY`: Your secret key from the Paystack dashboard.
4. **Redeploy:** Go to the **Deployments** tab in Vercel, click the dots on your latest build, and select **Redeploy**.

**Note on Resend Free Tier:** Until you verify a custom domain, Resend will only deliver emails to your own inbox. This is perfect for receiving your own orders!

### 🕵️ How to See Order Details in Logs
If your email isn't set up yet, you can still see every order:
1. Go to your project on [Vercel](https://vercel.com).
2. Click on the **"Logs"** tab.
3. Look for "Sending order to owner" to see the full breakdown of what was bought.

## 🚀 How to Update the Site (New Products/Prices)

Whenever we change something in the code here, use these commands in your terminal to push them live:

1. `git add .`
2. `git commit -m "Final configuration for automated orders"`
3. `git push`

---
*Style Maverik INC. - Redefining Modern Elegance*
