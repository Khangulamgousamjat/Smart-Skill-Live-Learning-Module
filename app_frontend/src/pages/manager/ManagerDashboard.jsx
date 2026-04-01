import DashboardLayout from '../../components/layout/DashboardLayout';
import { Construction } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function ManagerDashboard() {
  const { t } = useLanguage();
  return (
    <DashboardLayout>
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-sora text-[var(--color-text-primary)]">{t('managerDashboard')}</h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">{t('teamPerformanceOverview')}</p>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8 text-center">
          <Construction size={40} className="mx-auto mb-3 text-[var(--color-accent)]" />
          <p className="font-sora font-semibold text-[var(--color-text-primary)]">{t('managerCentral')}</p>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">{t('fullFeatureComingSoon')}</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
