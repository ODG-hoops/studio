
# Style Maverik INC. - Management Guide

This project is now fully configured with a private Admin Portal and automated order tracking.

## 🔑 Your Admin Credentials

**Portal Location:** `[Your Domain]/admin/login`

*   **Access Code:** `@admin.stylemaverik2021`

### ⚠️ IMPORTANT: Final Activation Step
To enable the login system, you **must** perform these steps in your Firebase Console:

1.  **Enable Auth Provider:**
    *   Go to the **Firebase Console** -> **Authentication**.
    *   Click the **Sign-in method** tab.
    *   Click **Add new provider** and select **Email/Password**.
    *   Ensure it is **Enabled** and click **Save**.

2.  **Create Management User:**
    *   Go to the **Users** tab (still within Authentication).
    *   Click **Add User**.
    *   **Email:** `management@stylemaverik.com`
    *   **Password:** `@admin.stylemaverik2021`

---

## 📦 How Orders Are Received

When a customer completes a purchase:
1.  **Payment:** Verified instantly via Paystack.
2.  **Database:** The order (items, total, location) is saved to your private Firestore database.
3.  **Notification:** An automated email is sent to you via **Resend**.
4.  **Dashboard:** The order appears instantly in your Management Dashboard.

## 📊 Using the Dashboard

From the dashboard at `/admin/dashboard`, you can:
*   **Track Revenue:** See the GH₵ total for all orders.
*   **Manage Logistics:** Update order status (Pending → Processing → Shipped -> Delivered).
*   **View Details:** See exactly what items, sizes, and colors were ordered, and where they need to be delivered.

---
*Style Maverik INC. - Redefining Modern Elegance*
