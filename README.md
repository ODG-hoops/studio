
# Style Maverik INC. - Admin

This project is now fully configured with a private Admin panel and automated order tracking.

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

## 🚀 How to Deploy Changes to the Live Site

1.  **Apply Code Changes**: Click the "Apply" or "Commit" button in your development interface. This triggers the Vercel/Firebase build.
2.  **Wait for Build**: The live site will take approximately **3-5 minutes** to rebuild and reflect your changes.
3.  **Sync Database**: If your products are not showing, go to `/admin/dashboard` -> **Inventory Goods** and click **Initialize Live Inventory**.

---

## 📊 Using the Admin Section

From the dashboard at `/admin/dashboard`, you can:
*   **Track Revenue:** See the GH₵ total for all orders.
*   **Manage Inventory:** Add, edit, or delete items instantly.
*   **Track Stock:** Set stock levels to automatically mark items as "Out of Stock".
*   **Manage Logistics:** Update order status (Pending → Processing → Shipped -> Delivered).

---
*Style Maverik INC. - Redefining Modern Elegance*
