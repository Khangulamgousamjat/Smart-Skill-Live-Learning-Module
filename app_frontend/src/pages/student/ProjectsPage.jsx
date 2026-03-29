import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { activeProjects } from '../../data/mockData';
import {
  Briefcase, ChevronRight, Loader2,
  Code2, ClipboardCheck, Lightbulb, CheckCircle2
} from 'lucide-react';

const STATUS_CONFIG = {
  'Assigned':    { label: 'To Do',          color: 'bg-slate-500',  light: 'bg-slate-50  text-slate-700  border-slate-200',  dark: 'bg-slate-500/10 text-slate-300 border-slate-500/20',  icon: ClipboardCheck },
  'In Progress': { label: 'In Progress',    color: 'bg-amber-500',  light: 'bg-amber-50  text-amber-700  border-amber-200',  dark: 'bg-amber-500/10 text-amber-300 border-amber-500/20',  icon: Code2 },
  'Review':      { label: 'Under Review',   color: 'bg-blue-500',   light: 'bg-blue-50   text-blue-700   border-blue-200',   dark: 'bg-blue-500/10  text-blue-300  border-blue-500/20',   icon: Lightbulb },
  'Completed':   { label: 'Completed',      color: 'bg-emerald-500',light: 'bg-emerald-50 text-emerald-700 border-emerald-200', dark: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', icon: CheckCircle2 },
};

const COLUMNS = ['Assigned', 'In Progress', 'Review', 'Completed'];

// ─── Single Project Card ──────────────────────────────────────────
const ProjectCard = ({ project, t, isDarkMode }) => {
  const { projectPlans, handleProjectBreakdown, approachInputs, setApproachInputs, approachReviews, handleApproachReview, projectBoilerplate, handleGenerateBoilerplate } = useAppContext();
  const [expanded, setExpanded] = useState(false);
  const plan = projectPlans[project.id];
  const review = approachReviews[project.id];
  const boilerplate = projectBoilerplate[project.id];
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG['Assigned'];
  const StatusIcon = cfg.icon;

  return (
    <div className={`rounded-2xl glare-hover transition-all ${t.card}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${isDarkMode ? cfg.dark : cfg.light}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
          <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
        </div>

        <h3 className={`font-semibold text-sm leading-snug mb-2 ${t.textMain}`}>{project.title}</h3>

        {/* Progress bar */}
        <div className={`w-full h-1.5 rounded-full mb-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
          <div
            className={`h-1.5 rounded-full transition-all duration-700 ${cfg.color}`}
            style={{ width: `${project.progress || 0}%` }}
          />
        </div>
        <p className={`text-xs ${t.textMuted}`}>{project.progress || 0}% complete</p>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(v => !v)}
          className={`mt-3 w-full flex items-center justify-between text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${isDarkMode ? 'border-white/10 text-slate-400 hover:bg-white/5' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
        >
          AI Toolkit
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Expanded AI Tools */}
      {expanded && (
        <div className={`px-4 pb-4 border-t space-y-3 ${t.border}`}>
          {/* Plan Breakdown */}
          <button
            onClick={() => handleProjectBreakdown(project)}
            disabled={plan?.loading}
            className="mt-3 w-full flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors disabled:opacity-50"
          >
            {plan?.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Lightbulb className="w-3 h-3" />}
            {plan ? 'Refresh Breakdown' : 'Generate Plan'}
          </button>
          {plan && !plan.loading && (
            <div className={`text-xs rounded-xl p-3 leading-relaxed whitespace-pre-line ${isDarkMode ? 'bg-indigo-500/5 text-indigo-200 border border-indigo-500/10' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'}`}>
              {plan.text}
            </div>
          )}

          {/* Approach Review */}
          <textarea
            value={approachInputs[project.id] || ''}
            onChange={(e) => setApproachInputs(prev => ({ ...prev, [project.id]: e.target.value }))}
            placeholder="Describe your approach for AI review…"
            rows={2}
            className={`w-full text-xs rounded-xl p-2 border resize-none outline-none ${t.input}`}
          />
          <button
            onClick={() => handleApproachReview(project)}
            disabled={review?.loading || !approachInputs[project.id]}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
          >
            {review?.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ClipboardCheck className="w-3 h-3" />}
            Review My Approach
          </button>
          {review && !review.loading && (
            <div className={`text-xs rounded-xl p-3 leading-relaxed whitespace-pre-line ${isDarkMode ? 'bg-amber-500/5 text-amber-200 border border-amber-500/10' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              {review.text}
            </div>
          )}

          {/* Boilerplate */}
          <button
            onClick={() => handleGenerateBoilerplate(project)}
            disabled={boilerplate?.loading}
            className="w-full flex items-center justify-center gap-2 text-xs font-bold py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            {boilerplate?.loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Code2 className="w-3 h-3" />}
            Get Starter Code
          </button>
          {boilerplate && !boilerplate.loading && (
            <pre className={`text-xs rounded-xl p-3 overflow-x-auto font-mono ${isDarkMode ? 'bg-black/30 text-emerald-300 border border-emerald-500/10' : 'bg-green-50 text-green-800 border border-green-100'}`}>
              {boilerplate.text}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Projects Kanban Page ────────────────────────────────────
const ProjectsPage = () => {
  const { t, isDarkMode } = useAppContext();

  const getProjectsByStatus = (status) =>
    activeProjects.filter(p => p.status === status);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className={`text-2xl font-bold font-sora ${t.textMain}`}>My Projects</h2>
          <p className={t.textMuted}>Assigned real-world projects with AI-powered task assistance.</p>
        </div>
        <div className={`px-4 py-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
          <span className={`text-sm font-semibold ${t.textMain}`}>{activeProjects.length} Projects</span>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map(status => {
          const projects = getProjectsByStatus(status);
          const cfg = STATUS_CONFIG[status];
          const ColIcon = cfg.icon;
          return (
            <div key={status} className={`rounded-2xl p-4 ${isDarkMode ? 'bg-white/3 border border-white/5' : 'bg-gray-50 border border-gray-100'}`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2 h-2 rounded-full ${cfg.color}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${t.textMuted}`}>{cfg.label}</span>
                <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/10 text-slate-400' : 'bg-gray-200 text-gray-500'}`}>
                  {projects.length}
                </span>
              </div>
              <div className="space-y-3">
                {projects.length > 0
                  ? projects.map(p => <ProjectCard key={p.id} project={p} t={t} isDarkMode={isDarkMode} />)
                  : <p className={`text-xs text-center py-6 ${t.textMuted}`}>No projects here</p>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
