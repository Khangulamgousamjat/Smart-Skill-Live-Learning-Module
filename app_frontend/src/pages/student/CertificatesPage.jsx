import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Award, Download, BadgeCheck, QrCode, Lock } from 'lucide-react';

const mockCertificates = [
  {
    id: 1,
    title: 'React.js Fundamentals',
    type: 'Skill Certificate',
    issued: 'March 2026',
    code: 'NRC-CERT-001-REACT',
    color: '#3B82F6',
    earned: true,
  },
  {
    id: 2,
    title: 'Inventory System Project',
    type: 'Project Completion',
    issued: 'March 2026',
    code: 'NRC-CERT-002-PROJ',
    color: '#22C55E',
    earned: true,
  },
  {
    id: 3,
    title: 'Node.js & Backend APIs',
    type: 'Skill Certificate',
    issued: 'Not yet earned',
    code: null,
    color: '#8B5CF6',
    earned: false,
  },
  {
    id: 4,
    title: 'SSLLM Platform Completion',
    type: 'Program Completion',
    issued: 'Not yet earned',
    code: null,
    color: '#F4A100',
    earned: false,
  },
];

const CertificateCard = ({ cert, t, isDarkMode }) => (
  <div className={`rounded-2xl overflow-hidden glare-hover relative ${t.card} ${!cert.earned ? 'opacity-60' : ''}`}>
    {/* Color top bar */}
    <div className="h-1.5 w-full" style={{ background: cert.color }} />

    <div className="p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center"
          style={{ background: `${cert.color}18`, border: `1px solid ${cert.color}30` }}
        >
          {cert.earned
            ? <BadgeCheck style={{ color: cert.color }} className="w-7 h-7" />
            : <Lock className="w-6 h-6 text-slate-500" />
          }
        </div>
        {cert.earned && (
          <span className={`text-[10px] font-black px-2 py-1 rounded-full border`}
            style={{ color: cert.color, borderColor: `${cert.color}30`, background: `${cert.color}10` }}>
            EARNED
          </span>
        )}
      </div>

      <h3 className={`font-bold text-sm leading-snug mb-1 ${t.textMain}`}>{cert.title}</h3>
      <p className={`text-xs ${t.textMuted} mb-1`}>{cert.type}</p>
      <p className={`text-xs font-semibold mb-3`} style={{ color: cert.color }}>{cert.issued}</p>

      {cert.earned && cert.code && (
        <>
          <div className={`text-[10px] font-mono rounded-lg px-2 py-1.5 mb-3 ${isDarkMode ? 'bg-white/5 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
            {cert.code}
          </div>
          <div className="flex gap-2">
            <button className={`flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl border transition-colors ${isDarkMode ? 'border-white/10 text-slate-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              <QrCode className="w-3.5 h-3.5" /> View QR
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold py-2 rounded-xl text-slate-900 transition-colors hover:opacity-90"
              style={{ background: cert.color }}
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        </>
      )}

      {!cert.earned && (
        <div className={`text-xs text-center rounded-xl py-2 ${isDarkMode ? 'bg-white/3 text-slate-500' : 'bg-gray-50 text-gray-400'}`}>
          Complete required milestones to unlock
        </div>
      )}
    </div>
  </div>
);

const CertificatesPage = () => {
  const { t, isDarkMode } = useAppContext();
  const earned = mockCertificates.filter(c => c.earned);
  const locked = mockCertificates.filter(c => !c.earned);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>My Certificates</h2>
          <p className={t.textMuted}>Verifiable achievement records from your internship.</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'}`}>
          <Award className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-bold text-amber-500">{earned.length} Earned</span>
        </div>
      </div>

      <div>
        <h3 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${t.textMuted}`}>Earned ({earned.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {earned.map(c => <CertificateCard key={c.id} cert={c} t={t} isDarkMode={isDarkMode} />)}
        </div>

        <h3 className={`font-semibold mb-3 text-sm uppercase tracking-wider ${t.textMuted}`}>Locked ({locked.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locked.map(c => <CertificateCard key={c.id} cert={c} t={t} isDarkMode={isDarkMode} />)}
        </div>
      </div>
    </div>
  );
};

export default CertificatesPage;
