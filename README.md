# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Notification:** An automated "Order Flow" is triggered. 
4. **Delivery:** You receive the customer's **email**, **delivery location**, and **order items**.

### Setting Up Real Email Notifications
To receive actual emails (instead of just logs), you must add these variables to your Vercel Environment Variables:

* `PAYSTACK_SECRET_KEY`: Your live secret key from the Paystack dashboard.
* `OWNER_EMAIL`: The email address where you want to receive new order alerts (e.g., `yourname@gmail.com`).
* `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your public key from Paystack.

## 🚀 Deployment Checklist

Whenever we make changes to the products or prices, use these commands in your terminal:

1. `git add .`
2. `git commit -m "Describe your changes here"`
3. `git push`

Vercel will detect the push and update the live site within 1-2 minutes.

---
*Style Maverik INC. - Redefining Modern Elegance*
