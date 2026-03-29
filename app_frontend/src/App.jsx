import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { AppProvider, useAppContext } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { AllModals } from './components/modals/AllModals';
import { Chatbot } from './components/chatbot/Chatbot';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import StaffRegisterPage from './pages/auth/StaffRegisterPage';
import OTPVerifyPage from './pages/auth/OTPVerifyPage';
import PendingApprovalPage from './pages/auth/PendingApprovalPage';

// Role-Specific Dashboard Pages
import { SuperAdminDashboard } from './pages/dashboard/SuperAdminDashboard';
import { HRAdminDashboard } from './pages/dashboard/HRAdminDashboard';
import { ManagerDashboard } from './pages/dashboard/ManagerDashboard';
import { ExpertDashboard } from './pages/dashboard/ExpertDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';

// Student Pages (Phase 3)
import SkillsPage       from './pages/student/SkillsPage';
import ProjectsPage     from './pages/student/ProjectsPage';
import LecturesPage     from './pages/student/LecturesPage';
import ProgressPage     from './pages/student/ProgressPage';
import CertificatesPage from './pages/student/CertificatesPage';

// Admin Pages (Phase 4)
import ApprovalsPage   from './pages/admin/ApprovalsPage';
import UsersPage       from './pages/admin/UsersPage';
import AnalyticsPage   from './pages/admin/AnalyticsPage';
import DepartmentsPage from './pages/admin/DepartmentsPage';
import SettingsPage    from './pages/admin/SettingsPage';

// HR & Manager Pages (Phase 5)
import InternsPage          from './pages/hr/InternsPage';
import AttendancePage       from './pages/hr/AttendancePage';
import OnboardingPage       from './pages/hr/OnboardingPage';
import TeamPage             from './pages/manager/TeamPage';
import EvaluationsPage      from './pages/manager/EvaluationsPage';
import ManagerProjectsPage  from './pages/manager/ManagerProjectsPage';

import { BookOpen } from 'lucide-react';

// ─── Global CSS injected once ─────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    .glare-hover { position: relative; overflow: hidden; }
    .glare-hover::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: linear-gradient(105deg, hsla(0,0%,0%,0) 60%, rgba(255,255,255,0.05) 70%, hsla(0,0%,0%,0) 100%);
      transition: 0.4s ease;
      background-size: 200% 200%, 100% 100%;
      background-repeat: no-repeat;
      background-position: -100% -100%, 0 0;
      z-index: 5;
    }
    .glare-hover:hover::before { background-position: 100% 100%, 0 0; }

    @keyframes blob {
      0%   { transform: translate(0px, 0px) scale(1); }
      33%  { transform: translate(30px, -50px) scale(1.1); }
      66%  { transform: translate(-20px, 20px) scale(0.9); }
      100% { transform: translate(0px, 0px) scale(1); }
    }
    .animate-blob { animation: blob 7s infinite; }
    .animation-delay-2000 { animation-delay: 2s; }
    .animation-delay-4000 { animation-delay: 4s; }

    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fade-in 0.3s ease forwards; }
  `}</style>
);

// ─── "Coming Soon" placeholder for unbuilt sub-routes ────────────
const ComingSoon = ({ title = 'Module Coming Soon' }) => {
  const { t, isDarkMode } = useAppContext();
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
      <BookOpen className={`w-16 h-16 mb-4 ${isDarkMode ? 'text-slate-700' : 'text-gray-300'}`} />
      <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>{title}</h2>
      <p className={`mt-2 ${t.textMuted}`}>This section will be built in the next phase.</p>
    </div>
  );
};

// ─── Role-based overview redirect ────────────────────────────────
const RoleDashboardOverview = () => {
  const { role } = useSelector((state) => state.auth);
  switch (role) {
    case 'super_admin': return <SuperAdminDashboard />;
    case 'hr_admin':    return <HRAdminDashboard />;
    case 'manager':     return <ManagerDashboard />;
    case 'expert':      return <ExpertDashboard />;
    default:            return <StudentDashboard />;
  }
};

// ─── Main Dashboard Shell (Sidebar + Content area) ───────────────
const DashboardShell = () => {
  const { t } = useAppContext();
  const { role } = useSelector((state) => state.auth);

  const showChatbot = role === 'student';

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-500 ${t.bg}`}>
      <GlobalStyles />
      <Sidebar />

      <div className="flex-1 overflow-auto">
        <div className="p-8 max-w-6xl mx-auto">
          {/* Nested sub-routes render here */}
          <Routes>
            {/* OVERVIEW - role-specific */}
            <Route index element={<RoleDashboardOverview />} />

            {/* STUDENT routes */}
            <Route path="skills"        element={<SkillsPage />} />
            <Route path="lectures"      element={<LecturesPage />} />
            <Route path="projects"      element={<ProjectsPage />} />
            <Route path="progress"      element={<ProgressPage />} />
            <Route path="certificates"  element={<CertificatesPage />} />

            {/* STAFF: Super Admin routes */}
            <Route path="approvals"     element={<ApprovalsPage />} />
            <Route path="users"         element={<UsersPage />} />
            <Route path="analytics"     element={<AnalyticsPage />} />
            <Route path="departments"   element={<DepartmentsPage />} />
            <Route path="settings"      element={<SettingsPage />} />
            {/* STAFF: HR Admin routes */}
            <Route path="interns"       element={<InternsPage />} />
            <Route path="attendance"    element={<AttendancePage />} />
            <Route path="onboarding"    element={<OnboardingPage />} />
            
            {/* STAFF: Manager routes */}
            <Route path="team"          element={<TeamPage />} />
            <Route path="evaluations"   element={<EvaluationsPage />} />
            <Route path="manager-projects" element={<ManagerProjectsPage />} />
            <Route path="messages"      element={<ComingSoon title="Messages" />} />
            <Route path="resources"     element={<ComingSoon title="Resources" />} />
            <Route path="qna"           element={<ComingSoon title="Q&A Dashboard" />} />


            <Route path="*"             element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>

      <AllModals />
      {showChatbot && <Chatbot />}
    </div>
  );
};

// ─── App Routes ───────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#1E293B', color: '#fff', border: '1px solid #334155' } }}
      />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Public Auth Routes */}
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register/student"   element={<StudentRegisterPage />} />
        <Route path="/register/staff"     element={<StaffRegisterPage />} />
        <Route path="/verify-email"       element={<OTPVerifyPage />} />
        <Route path="/pending-approval"   element={<PendingApprovalPage />} />

        {/* Protected Dashboard - with nested routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardShell />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// ─── Root ─────────────────────────────────────────────────────────
function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;