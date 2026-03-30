export default function StatCard({
  title, value, icon: Icon, color = 'primary', trend
}) {
  const colors = {
    primary : 'bg-blue-50   text-blue-600   dark:bg-blue-900/20 dark:text-blue-400',
    success : 'bg-green-50  text-green-600  dark:bg-green-900/20 dark:text-green-400',
    warning : 'bg-amber-50  text-amber-600  dark:bg-amber-900/20 dark:text-amber-400',
    danger  : 'bg-red-50    text-red-600    dark:bg-red-900/20 dark:text-red-400',
    info    : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
  };

  return (
    <div className="bg-[var(--color-surface)]
                    border border-[var(--color-border)]
                    rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-muted)] font-medium group-hover:text-[var(--color-primary)] transition-colors">{title}</p>
          <p className="text-3xl font-bold font-sora mt-2 text-[var(--color-text-primary)]">
            {value ?? '—'}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium px-2 py-0.5 rounded-full inline-flex
              ${trend >= 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
              <span>{trend >= 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(trend)}% this week</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl transition-transform group-hover:scale-110 duration-300 ${colors[color] || colors.primary}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
