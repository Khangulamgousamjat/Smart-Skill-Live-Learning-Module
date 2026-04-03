# SSLLM Deployment & Repository Guide

This guide provides step-by-step instructions to push your latest changes to GitHub and redeploy the platform to Vercel (Frontend) and Render (Backend).

---

## 1. Push Each and Everything to GitHub

To ensure your repository is up-to-date with all recent UI and build fixes:

1.  **Open terminal** in the project root: `d:\WORK\final SSSLM`
2.  **Add all changes**:
    ```bash
    git add .
    ```
3.  **Commit the changes**:
    ```bash
    git commit -m "Final Finish: Sidebar light mode fix, build resolution, and UI polish"
    ```
4.  **Push to your repository**:
    ```bash
    git push origin main
    ```

---

## 2. Redeploy Frontend to Vercel

Since you are already using Vercel (as seen in your screenshot), you have two main ways to redeploy:

### Option A: Automatic Deployment (Recommended)
If your Vercel project is connected to your GitHub repository:
- Push the code as shown in Section 1.
- Vercel will automatically detect the push and start a new build.
- You can monitor this in your [Vercel Dashboard](https://vercel.com/dashboard).

### Option B: Manual Deployment (via CLI)
If you have the Vercel CLI installed:
1.  Navigate to the frontend folder: `cd app_frontend`
2.  Run the deployment command:
    ```bash
    vercel --prod
    ```

---

## 3. Redeploy Backend to Render

If your backend is hosted on Render:

1.  **Update GitHub**: Ensure you've pushed the `backend` folder changes (done in Section 1).
2.  **Manual Deploy**:
    - Go to your [Render Dashboard](https://dashboard.render.com).
    - Select your **Web Service** (e.g., `ssllm-backend`).
    - Click **Manual Deploy** -> **Clear Build Cache & Deploy**.
3.  **Environment Variables**: Double-check that your `DATABASE_URL` and `JWT_SECRET` in Render match your local `.env`.

---

## 4. Verification Check

After redeploying, verify the following:
- [ ] **Sidebar Visibility**: Toggle light mode and confirm the sidebar is white/light-gray with dark text.
- [ ] **Dashboards**: Check Student, Manager, HR, and Teacher roles for consistency.
- [ ] **Messaging**: Confirm chat bubbles are readable in both themes.

> [!TIP]
> If you encounter any "Module not found" errors during build, ensure your `package.json` in `app_frontend` is correct and run `npm install` locally before pushing.

---
**Authored by Antigravity AI**
