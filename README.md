# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Notification:** An automated "Order Flow" is triggered. 
4. **Data Captured:** You receive the customer's **email**, **delivery location**, and **specific items (Size, Color, Quantity)**.

### 🕵️ How to See Order Details NOW (Vercel Logs)
Until you set up a dedicated email service, you can see every order detail in your Vercel Dashboard:
1. Go to your project on [Vercel](https://vercel.com).
2. Click on the **"Logs"** tab at the top.
3. When an order is placed, a log entry starting with `--- Sending Email ---` will appear.
4. Click it to see the full list of items, sizes, colors, and the customer's location.

### 📧 Setting Up Real Email Notifications
To receive these details directly in your inbox (e.g., Gmail) instead of checking logs, you must add these variables to your Vercel Environment Variables:

* `PAYSTACK_SECRET_KEY`: Your live secret key from the Paystack dashboard.
* `OWNER_EMAIL`: The email address where you want to receive new order alerts (e.g., `stylemaverikclothing@gmail.com`).
* `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your public key from Paystack.

## 🚀 Deployment Checklist (How to Update the Site)

Whenever we make changes to the products or prices in the code, use these commands in your terminal to push them live:

1. `git add .`
2. `git commit -m "Update products and prices"`
3. `git push` (If you get an error, use `git push --force`)

Vercel will detect the push and update the live site within 1-2 minutes.

---
*Style Maverik INC. - Redefining Modern Elegance*
