import DashboardLayout from '../../components/layout/DashboardLayout';
import { Construction } from 'lucide-react';

export default function AdminProfile() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">Admin Profile</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">Manage your administrator account and preferences</p>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-12 text-center shadow-sm">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 mb-4">
            <Construction size={32} />
          </div>
          <h2 className="text-xl font-sora font-semibold text-[var(--color-text-primary)]">Admin Profile View</h2>
          <p className="text-[var(--color-text-muted)] text-sm mt-2 max-w-md mx-auto">
            We are currently building the advanced administrator profile management interface. This feature will allow you to manage global account settings soon.
          </p>
          <div className="mt-8 flex justify-center gap-3">
             <button className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium shadow-lg shadow-[var(--color-primary)]/20">
                Coming Soon
             </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
