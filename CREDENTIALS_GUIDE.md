# Complete Skill Developer API Key & Services Guide

Please follow this guide to acquire all necessary credentials for your `backend/.env` file. Once you have them, paste them directly into `d:\WORK\final Skill-Developer\backend\.env`.

> [!TIP]
> **Gemini 2.5 Flash** is highly recommended and fully supported! We've already added the placeholder for `GEMINI_API_KEY` in your `.env` file since your frontend codebase natively uses it for the AI Mentor.

---

## 1. PostgreSQL Database (Supabase) 🐘
*Required for: Storing Users, Roles, JWT Tokens, and Dashboards.*

1. Go to [Supabase](https://supabase.com/).
2. Click **New Project** and select your organization.
3. Enter `Skill Developer Database`, create a strong Database Password, and click **Create New Project**.
4. In your project dashboard, navigate on the left to **Settings (Gear Icon) -> Database**.
5. Scroll down to the **Connection String** panel and click the **URI** tab.
6. Copy the URL. It looks like: 
   `postgresql://postgres.xxx:YOUR_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`
7. Replace `[YOUR-PASSWORD]` with the password you made in step 3. 
8. Paste it into your `.env` file for **`DATABASE_URL`**.

---

## 2. Redis Caching (Upstash or Railway) 🚀
*Required for: OTP temporary storage, Fast Session memory, and Rate-Limiting.*

1. Go to [Upstash](https://upstash.com/).
2. Create an account and click **Create Database** under the Redis section.
3. Name it `Skill-Developer-Redis`, select a region, and choose the Free tier.
4. Once created, scroll down to the **Connect to your database** section.
5. Select the **Node.js** tab. You'll see an `ioredis` string starting with `rediss://`.
6. Copy just the URI string (e.g., `rediss://default:xxxxxx@region.upstash.io:32456`).
7. Paste it into your `.env` file for **`REDIS_URL`**.

---

## 3. Email Delivery (SendGrid) 📧
*Required for: Delivering Student/Staff OTP Verification codes and account status notifications.*

1. Go to [SendGrid](https://sendgrid.com/) and create a free account.
2. In the left menu, select **Settings -> API Keys**.
3. Click **Create API Key** in the top right corner.
4. Name it `Skill Developer Backend`, select **Full Access**, and click **Create & View**.
5. Copy the generated key (it starts with `SG.`).
6. Paste it into your `.env` file for **`SENDGRID_API_KEY`**.
7. Navigate to **Settings -> Sender Authentication** and register your email address. Provide this same email in the `.env` file under **`FROM_EMAIL`**.

---

## 4. Image/File Storage (Cloudinary) ☁️
*Required for: Uploading Intern Profile Pictures, Resumes, Certificates, and Lecture PDFs.*

1. Go to [Cloudinary](https://cloudinary.com/) and sign up for a free plan.
2. Go to your **Dashboard**. 
3. At the top of your dashboard, you will see your **Cloud Name**, **API Key**, and **API Secret**.
4. Copy and paste them into your `.env` file under:
   - **`CLOUDINARY_CLOUD_NAME`**
   - **`CLOUDINARY_API_KEY`**
   - **`CLOUDINARY_API_SECRET`**

---

## 5. AI Chatbots & Tutors (Gemini & OpenAI) 🤖
*Required for: AI Lecture prep, Daily standup generation, Project boilerplate, and Chatbot.*

### A. Gemini 2.5 Flash (Preferred)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Login with your Google Account and click **Create API Key**.
3. Create an API key in a new project.
4. Copy the long string and paste it into `.env` for **`GEMINI_API_KEY`**.

### B. OpenAI (Fallback/Backend analysis)
1. Go to the [OpenAI Platform](https://platform.openai.com/).
2. Navigate to **API Keys** on the left menu.
3. Click **Create new secret key**, name it `Skill Developer`, and copy the key (starts with `sk-proj...`).
4. Paste it into `.env` for **`OPENAI_API_KEY`**.

---

### Verification
Once you have pasted everything into `d:\WORK\final Skill-Developer\backend\.env`, your file should be completely populated. 

Let me know when you've finished providing the keys, and we can proceed with executing the **Phase 2 Implementation Plan**!
