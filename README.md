
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
    *   **Email:** `stylemaverikclothing@gmail.com` (Type this exactly)
    *   **Password:** `@admin.stylemaverik2021` (This is your access code)
    *   Click **Add User**.

---

## 📦 How to See Recent Changes

1.  **Code Changes:** If you updated the UI (buttons, text), wait ~3 minutes for the build to finish.
2.  **Product Changes:** Your site is now **Live**. 
    *   Go to `/admin/dashboard`
    *   Login with `@admin.stylemaverik2021`
    *   Go to **Inventory Goods**
    *   Click **Initialize Defaults** (if first time) or **Add Goods** to see them instantly on the site.

---

## 📊 Using the Dashboard

From the dashboard at `/admin/dashboard`, you can:
*   **Track Revenue:** See the GH₵ total for all orders.
*   **Manage Inventory:** Add, edit, or delete items instantly.
*   **Track Stock:** Set stock levels to automatically mark items as "Out of Stock".
*   **Manage Logistics:** Update order status (Pending → Processing → Shipped -> Delivered).

---
*Style Maverik INC. - Redefining Modern Elegance*
