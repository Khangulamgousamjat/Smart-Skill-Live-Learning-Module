# SSLLM COMPLETE MASTER UPDATE PLAN
Smart Skill & Live Learning Module — Gous org

## PLAN 1 — LANDING PAGE [COMPLETED]
- [x] Update `App.jsx`: `/` -> `LandingPage`
- [x] Create `frontend/src/pages/public/LandingPage.jsx`
- [x] Implement Navbar (Sticky, Glassmorphism)
- [x] Implement Hero Section (Animated bg, Sora font)
- [x] Implement Features Section (6 cards)
- [x] Implement "What You Will Learn" Section (Animated tags)
- [x] Implement "How It Works" Section (3 steps)
- [x] Implement "For Every Role" Section (4 roles)
- [x] Implement Footer (Gous Khan info)
- [x] Verify visually and navigationally
- [x] Push to GitHub

## PLAN 2 — MULTI-LANGUAGE SYSTEM (5 LANGUAGES) [COMPLETED]
- [x] Create `frontend/src/utils/translations.js` (EN, HI, MR, FR, RU)
- [x] Create `frontend/src/contexts/LanguageContext.jsx`
- [x] Update `frontend/src/main.jsx` with `LanguageProvider`
- [x] Update ALL components to use `t()` function (Landing, Login, Student, Manager, HR, Expert, Admin Dashboards)
- [x] Create `frontend/src/pages/shared/SettingsPage.jsx` (Centralized UI)
- [x] Implement Appearance Tab (Light/Dark)
- [x] Implement Language Tab (5 languages)
- [x] Add routes in `App.jsx` and sidebar links in `DashboardLayout.jsx`

## PLAN 3 — SETTINGS PAGE [COMPLETED]
- [x] UI/UX built with premium glassmorphism
- [x] Integrated with `LanguageContext` and Redux `uiSlice`
- [x] Toast notifications for preferences updated

## PLAN 4 — PROFILE SYSTEM [PENDING]
- [ ] Implement Profile Completion Modal (First login)
- [ ] Create reusable `ProfilePage` component
- [ ] Implement profile pages for all roles (Student, Manager, HR, Teacher)
- [ ] Add backend routes for profile updates and photo upload
- [ ] Update database schema (Users table columns)

## PLAN 5 — RENAME EXPERT -> TEACHER + TEACHER DASHBOARD [PENDING]
- [ ] Global Rename: Expert -> Teacher (UI only)
- [ ] Build Full Teacher Dashboard
- [ ] Implement Teacher Video Management (Upload/Edit/Delete)
- [ ] Implement Student Video View (Learning Videos tab)
- [ ] Add `teacher_videos` database table

## PLAN 6 — APPROVAL CHAIN + NEW ROUTES [PENDING]
- [ ] Update registration approval logic (Teacher/HR -> Manager, Manager -> Admin)
- [ ] Update `role_requests` table with `approver_role`
- [ ] Create Manager Approval Page

## PLAN 7 — STUDENT DASHBOARD FULL UPDATE [PENDING]
- [ ] Build "My Projects" page (CRUD functionality)
- [ ] Build "My Skill Gap" page (Radar charts)
- [ ] Build "Learning Path" page (AI recommendations)
- [ ] Build "My Certificates" page
- [ ] Build AI Chatbot (Floating button + Panel)
- [ ] Build Language Learning Section (Topics modal + Roadmaps)
- [ ] Add `student_projects` and `learning_languages` tables

## PLAN 8 — HR DASHBOARD ALL FEATURES [PENDING]
- [ ] Complete Dashboard Stats & Charts
- [ ] Complete Intern Management (Transfer/CSV Export)
- [ ] Complete Department Comparison
- [ ] Complete Certificate Issuance
- [ ] Complete Evaluations View

## PLAN 9 — MANAGER DASHBOARD ALL FEATURES [PENDING]
- [ ] Complete Team Progress Table & Charts
- [ ] Complete Project Management (Assign/Review)
- [ ] Complete Lecture Scheduling
- [ ] Complete Skill Heat Map

## PLAN 10 — ADMIN DASHBOARD CLEANUP [PENDING]
- [ ] Remove Profile & Certificate links
- [ ] Complete User/Department/Skill Management
- [ ] Complete Announcements System
- [ ] Complete System Logs

## PLAN 11 — BACKEND ROUTES & DB TABLES [PENDING]
- [ ] finalize `server.js` `setupDatabase()`
- [ ] Implementation of all API routes (Projects, Videos, AI, Languages)
- [ ] Controller logic for all new features

## PLAN 12 — FINAL RULES & DEPLOY CHECKLIST [PENDING]
- [ ] Final UI/UX Polish (Loading/Error/Empty states)
- [ ] Dark Mode verification everywhere
- [ ] Mobile Responsiveness verification
- [ ] Final GitHub Push & Deployment
