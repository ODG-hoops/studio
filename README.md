
# Style Maverik INC. - Admin & Deployment Guide

This is your professional elegant clothing store. Below is everything you need to know about managing orders and keeping the site live.

## 📦 How Orders Are Received

When a customer completes a purchase, the following happens:

1. **Payment:** Handled securely via Paystack.
2. **Verification:** The app verifies the payment immediately.
3. **Database:** The order is saved to your private Firestore database.
4. **Email Notification:** An automated order details email is sent to you via **Resend**. 

### 🔐 How to Access the Admin Portal
Your management dashboard is located at `/admin/login`.

1. **Access Code:** The code is `@admin.stylemaverik2021`.
2. **Setup Required:** To make this code work, you MUST create a user in your Firebase Console:
   * Go to **Authentication** -> **Users**.
   * Click **Add User**.
   * **Email:** `management@stylemaverik.com`
   * **Password:** `@admin.stylemaverik2021`

Once this user is created, simply type your code into the admin login page to see all your orders.

### 📧 Setting Up Your Email Notifications
To receive orders in your inbox, you MUST add your credentials to Vercel:

1. **Vercel Settings:** Go to your project on [Vercel](https://vercel.com).
2. **Environment Variables:** Click **Settings** -> **Environment Variables**.
3. **Add These Variables:**
   * `RESEND_API_KEY`: Paste the key you got from Resend.
   * `OWNER_EMAIL`: The email you used to sign up for Resend (where you want to get orders).
   * `PAYSTACK_SECRET_KEY`: Your secret key from the Paystack dashboard.
4. **Redeploy:** Go to the **Deployments** tab in Vercel, click the dots on your latest build, and select **Redeploy**.

---
*Style Maverik INC. - Redefining Modern Elegance*
