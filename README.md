
# Style Maverik INC. - Management Guide

This project is now fully configured with a private Admin Portal and automated order tracking.

## 🔑 Your Admin Credentials

**Portal Location:** `[Your Domain]/admin/login`

*   **Access Code:** `@admin.stylemaverik2021`

### ⚠️ IMPORTANT: One-Time Setup
To activate your access code, follow these 2 simple steps in your Firebase Console:

1.  **Enable Provider**:
    *   Go to **Authentication** -> **Sign-in method**.
    *   Click **Add new provider** and select **Email/Password**.
    *   Click **Save**.

2.  **Create Admin User**:
    *   Go to the **Users** tab (still within Authentication).
    *   Click **Add User**.
    *   **Email:** `admin@stylemaverik.com` (Use this exact ID)
    *   **Password:** `@admin.stylemaverik2021` (This is your access code)

---

## 📦 How Orders Are Received

When a customer completes a purchase:
1.  **Payment:** Verified instantly via Paystack.
2.  **Database:** The order (items, total, location) is saved to your private Firestore database.
3.  **Dashboard:** The order appears instantly in your Management Dashboard.

## 📊 Using the Dashboard

From the dashboard at `/admin/dashboard`, you can:
*   **Track Revenue:** See the GH₵ total for all orders.
*   **Manage Logistics:** Update order status (Pending → Processing → Shipped -> Delivered).
*   **View Details:** See exactly what items, sizes, and colors were ordered, and where they need to be delivered.

---
*Style Maverik INC. - Redefining Modern Elegance*
