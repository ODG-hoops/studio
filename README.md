
# Style Maverik INC. - Management Guide

This project is now fully configured with a private Admin Portal and automated order tracking.

## 🔑 Your Admin Credentials

**Portal Location:** `[Your Domain]/admin/login`

*   **Access Code:** `@admin.stylemaverik2021`

### ⚠️ CRITICAL: Final Setup Steps
The login will fail with "Invalid Credential" until you perform these 2 steps in your Firebase Console:

1.  **Enable Email/Password Provider**:
    *   Go to **Authentication** -> **Sign-in method**.
    *   Click **Add new provider** and select **Email/Password**.
    *   Ensure it is toggled to **Enabled** and click **Save**.

2.  **Create the Admin User Record**:
    *   Go to the **Users** tab (still within Authentication).
    *   Click **Add User**.
    *   **Email:** `admin@stylemaverik.com` (Type this exactly)
    *   **Password:** `@admin.stylemaverik2021` (This is your access code)
    *   Click **Add User**.

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
