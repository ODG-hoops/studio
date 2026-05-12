
# Style Maverik INC. - Management Guide

This project is now fully configured with a private Admin Portal and automated order tracking.

## 📦 How Orders Are Received

When a customer completes a purchase:
1. **Payment:** Verified instantly via Paystack.
2. **Database:** The order (items, total, location) is saved to your private Firestore database.
3. **Notification:** An automated email is sent to you via **Resend**.
4. **Dashboard:** The order appears instantly in your Management Dashboard.

## 🔐 How to Access the Admin Portal

Your management portal is located at: `[Your Domain]/admin/login`

1. **Access Code:** `@admin.stylemaverik2021`
2. **Activation Required:** To enable this code, ensure you have created the management user in your Firebase Console:
   * **Location:** Authentication -> Users
   * **Email:** `management@stylemaverik.com`
   * **Password:** `@admin.stylemaverik2021`

## 📊 Using the Dashboard

From the dashboard at `/admin/dashboard`, you can:
* **Track Revenue:** See the GH₵ total for all orders.
* **Manage Logistics:** Update order status (Pending → Processing → Shipped -> Delivered).
* **View Details:** See exactly what items, sizes, and colors were ordered, and where they need to be delivered.

---
*Style Maverik INC. - Redefining Modern Elegance*
