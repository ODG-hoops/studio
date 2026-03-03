
# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Email Notification:** An automated order details email is sent to you via **Resend**. 
4. **Data Captured:** You receive the customer's **email**, **delivery location**, and **specific items (Size, Color, Quantity)**.

### 🕵️ How to See Order Details NOW (Vercel Logs)
Until you set up the email API key, or if you just want to double-check, you can see every order detail in your Vercel Dashboard:
1. Go to your project on [Vercel](https://vercel.com).
2. Click on the **"Logs"** tab at the top.
3. Look for entries containing the order details and items.

### 📧 Setting Up Real Email Notifications
To receive these details directly in your inbox, add these variables to your Vercel Environment Variables:

* `PAYSTACK_SECRET_KEY`: Your live secret key from the Paystack dashboard.
* `OWNER_EMAIL`: The email where you want to receive orders (e.g., `stylemaverikclothing@gmail.com`).
* `RESEND_API_KEY`: Get a free key from [Resend.com](https://resend.com).
* `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`: Your public key from Paystack.

**Important Note on Resend:** 
By default, Resend only allows sending emails to the address you signed up with. To send to any address, you must verify your domain (e.g., `stylemaverik.com`) in the Resend dashboard.

## 🚀 Deployment Checklist (How to Update the Site)

Whenever we make changes to the products or prices in the code, use these commands in your terminal to push them live:

1. `git add .`
2. `git commit -m "Update products and enable email notifications"`
3. `git push`

Vercel will detect the push and update the live site within 1-2 minutes.

---
*Style Maverik INC. - Redefining Modern Elegance*
