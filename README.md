# 🚀 SSLLM ERP Platform
**Smart Skill & Live Learning Module (SSLLM)**

A comprehensive, cutting-edge Enterprise Resource Planning (ERP) platform designed for **NRC INNOVATE-X**. This application is built with a modern tech stack and a stunning **glassmorphic design system** to manage interns, track skill progression, orchestrate live learning sessions, and seamlessly integrate state-of-the-art AI coaching.

---

## 🌟 Key Features

*   **🔒 Role-Based Access Control (RBAC)**: Secure routing and API endpoints for 5 distinct roles: `Student`, `Expert`, `Manager`, `HR Admin`, and `Super Admin`.
*   **🧠 Gemini AI Integration**: Fully integrated Google Gemini 2.5 Flash API for automated resume building, skill gap analysis, lecture pre-briefs, and real-time chat mentoring.
*   **📊 Insightful Dashboards**: Beautiful radar charts, statistical cards, and progress bars powered by Recharts to keep interns motivated and managers informed.
*   **👥 Comprehensive Management Modules**: Includes robust Super Admin controls (Department CRUD, Platform Settings), HR tools (Attendance, Onboarding Journeys), and Manager tools (Project Workflows, Performance Evaluations).
*   **✨ Premium Glassmorphic UI**: High-end visuals using Tailwind CSS, featuring subtle glows, blurred backdrops, and interactive animations for maximum user engagement.

---

## 🏗️ Technology Stack

**Frontend**
*   **React 18** (Vite)
*   **Tailwind CSS** (for styling and glassmorphism)
*   **Recharts** (Data visualization)
*   **Lucide React** (Consistent iconography)
*   **Redux Toolkit & Context API** (Global state management)

**Backend**
*   **Node.js & Express.js**
*   **PostgreSQL** (Hosted via Supabase)
*   **Google Gen AI** (`@google/genai` SDK)
*   **JWT & bcryptjs** (Authentication & Security)

---

## 🛠️ Local Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Khangulamgousamjat/Smart-Skill-Live-Learning-Module.git
cd Smart-Skill-Live-Learning-Module
```

### 2. Backend Setup
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following keys:
```env
PORT=5000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db_name>
JWT_ACCESS_SECRET=your_super_secret_jwt_key
SENDGRID_API_KEY=your_sendgrid_key_or_dummy_key
FROM_EMAIL=noreply@nrcinnovatex.com
FROM_NAME=NRC INNOVATE-X
# Your Google Gemini AI Key
GEMINI_API_KEY=your_gemini_api_key
```

Execute the database schema setup (ensure your PostgreSQL is running):
```bash
# Execute initial schema script inside /backend/migrations/001_initial_schema.sql
# You can do this via psql or your Supabase SQL editor.
```

Start the backend server:
```bash
npm run dev
```
*The server should now be running on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd app_frontend
npm install
```

Create a `.env` file in the `app_frontend` folder to point to your local API:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the Vite development server:
```bash
npm run dev -- --port 5173
```
*The frontend should now be running on `http://localhost:5173`*

---

## 🔑 Test Credentials 

Upon running the provided database seed script `backend/seed_users.js`, you can safely log in using these roles to explore the application:

*   **Super Admin**: `admin@nrcinnovatex.com` / `adminpass`
*   **HR Admin**: `hr@nrcinnovatex.com` / `HrAdmin@12`
*   **Manager**: `manager@nrcinnovatex.com` / `Manager@12`

> **Note**: For Students and Experts, you can create a test account via the frontend `/register` and `/staff-register` portals, then approve them from the Super Admin dashboard.

---

## 🚀 Deployment Instructions

### Backend (Render / Railway / Heroku)
1. Deposit your environment variables securely in your host's interface.
2. Ensure the node start command points to `node src/server.js` or `npm start`.

### Frontend (Vercel / Netlify)
1. Point your host to the `app_frontend` folder.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Make sure to set `VITE_API_BASE_URL` to your newly hosted backend URL (e.g., `https://my-backend.onrender.com/api`).

---
📝 *Crafted with precision for NRC INNOVATE-X.*
