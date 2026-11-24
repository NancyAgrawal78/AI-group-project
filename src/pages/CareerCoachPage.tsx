import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Loader2,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type {
  PageRoute,
  ResumeProfile,
  SkillAnalysisResult,
  TargetSelection,
} from '../types';
import { requestSkillAnalysis } from '../utils/aiClient';

interface CareerCoachPageProps {
  profile: ResumeProfile;
  target: TargetSelection;
  analysis: SkillAnalysisResult;
  onUpdateAnalysis: (result: SkillAnalysisResult) => void;
  onNavigate: (route: PageRoute) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

export const CareerCoachPage: React.FC<CareerCoachPageProps> = ({
  profile,
  target,
  analysis,
  onUpdateAnalysis,
  onNavigate,
  onLogActivity,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const runSkillAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestSkillAnalysis(profile, target);
      onUpdateAnalysis(data);
      onLogActivity(
        `AI Coach analyzed ${target.companyName}`,
        `${data.matchPercentage}% skill match for ${target.roleTitle}`,
        'coach'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not analyze skills.');
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (key: string) => {
    setCompletedSteps((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const circumference = 2 * Math.PI * 38;
  const matchOffset = circumference - (analysis.matchPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div>
          <div className="text-xs font-medium text-indigo-700">
            Smart AI Career Coach · {target.companyName}
          </div>
          <h1 className="mt-1 text-xl font-display font-bold text-slate-900">
            Skill Gap & Readiness Analysis for {target.roleTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            Compares your verified skills, projects, and internships against {target.companyName}&apos;s requirements.
            {analysis.analyzedAt ? ` (${analysis.analyzedAt})` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={loading}
            onClick={runSkillAnalysis}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Analyzing Profile...' : 'Run Live AI Skill Analysis'}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tailor')}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            Generate Tailored Resume <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Score Overview + Coach Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-28 h-28 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="8"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={matchOffset}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-display font-bold font-mono tabular-nums text-slate-900">
                {analysis.matchPercentage}%
              </span>
              <span className="text-[11px] text-slate-500">Match</span>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3 w-full">
            <div>
              <div className="text-xs text-slate-500">Overall Compatibility Score</div>
              <div className="text-2xl font-display font-bold font-mono tabular-nums text-slate-900">
                {analysis.compatibilityScore} / 100
              </div>
              <div className="text-xs font-medium text-indigo-700 mt-0.5">
                {analysis.readinessLabel}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Role Fit Progress</span>
                <span className="font-mono tabular-nums">{analysis.matchPercentage}%</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
                  style={{ width: `${analysis.matchPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-center">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Compass className="w-4 h-4 text-indigo-700" />
            AI Career Coach Assessment
          </div>
          <p className="mt-2 text-sm text-slate-700 leading-relaxed">{analysis.coachSummary}</p>
          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-6 text-xs text-slate-600">
            <span>
              <strong className="text-emerald-700 font-mono tabular-nums">
                {analysis.matchedSkills.length}
              </strong>{' '}
              Matched Skills
            </span>
            <span>
              <strong className="text-amber-700 font-mono tabular-nums">
                {analysis.missingOrWeakSkills.filter((s) => s.status === 'weak').length}
              </strong>{' '}
              Weak Skills
            </span>
            <span>
              <strong className="text-rose-700 font-mono tabular-nums">
                {analysis.missingOrWeakSkills.filter((s) => s.status !== 'weak').length}
              </strong>{' '}
              Missing Skills
            </span>
          </div>
        </div>
      </div>

      {/* Matched vs Missing/Weak Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matched Skills (Green) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">
                Matched Skills
              </h2>
              <p className="text-xs text-slate-500">
                Verified competencies found in your profile
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 font-mono tabular-nums">
              {analysis.matchedSkills.length} matched
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {analysis.matchedSkills.map((skill, idx) => (
              <div
                key={`${skill.name}-${idx}`}
                className="p-3.5 rounded-lg bg-emerald-50/70 border border-emerald-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-semibold text-sm text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{skill.name}</span>
                  </div>
                  <span className="text-xs font-medium text-emerald-800 shrink-0">
                    Matched · {skill.category}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-emerald-900/80 pl-6">
                  {skill.evidenceInProfile}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Missing / Weak Skills (Orange / Red) */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-display font-bold text-slate-900">
                Missing & Weak Skills
              </h2>
              <p className="text-xs text-slate-500">
                Priority gaps identified from {target.companyName}&apos;s job description
              </p>
            </div>
            <span className="text-xs font-semibold text-rose-700 font-mono tabular-nums">
              {analysis.missingOrWeakSkills.length} gaps
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {analysis.missingOrWeakSkills.map((item, idx) => {
              const isWeak = item.status === 'weak';
              return (
                <div
                  key={`${item.name}-${idx}`}
                  className={`p-3.5 rounded-lg border ${
                    isWeak
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-rose-50/70 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`flex items-center gap-2 font-semibold text-sm ${
                        isWeak ? 'text-amber-950' : 'text-rose-950'
                      }`}
                    >
                      {isWeak ? (
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <span>{item.name}</span>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide shrink-0 ${
                        isWeak ? 'text-amber-800' : 'text-rose-800'
                      }`}
                    >
                      {isWeak ? 'Weak' : 'Missing'} · {item.priority}
                    </span>
                  </div>
                  <p
                    className={`mt-1.5 text-xs pl-6 ${
                      isWeak ? 'text-amber-900/80' : 'text-rose-900/80'
                    }`}
                  >
                    {item.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Required Skills to Develop */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h2 className="text-base font-display font-bold text-slate-900">
          Required Skills to Develop
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.requiredSkillsToDevelop.map((req, idx) => (
            <div key={idx} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50">
              <div className="text-xs font-medium text-indigo-700">
                Target Level: {req.targetLevel}
              </div>
              <div className="mt-1 font-semibold text-sm text-slate-900">{req.skill}</div>
              <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{req.whyItMatters}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Roadmap & Resources */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-display font-bold text-slate-900">
              Personalized Improvement Roadmap & Learning Resources
            </h2>
            <p className="text-xs text-slate-500">
              Check off action steps as you build readiness for {target.companyName}
            </p>
          </div>
          <BookOpen className="w-4 h-4 text-indigo-700" />
        </div>

        <div className="mt-5 space-y-5">
          {analysis.learningRoadmap.map((phase, pIdx) => (
            <div key={pIdx} className="p-5 rounded-xl border border-slate-200">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <div className="text-xs font-medium text-indigo-700">{phase.phase}</div>
                  <h3 className="text-base font-display font-bold text-slate-900 mt-0.5">
                    {phase.focusSkill}
                  </h3>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {phase.duration}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-2">Action Plan</div>
                  <div className="space-y-2">
                    {phase.actionSteps.map((step, sIdx) => {
                      const key = `${pIdx}-${sIdx}`;
                      const checked = Boolean(completedSteps[key]);
                      return (
                        <label
                          key={key}
                          className="flex items-start gap-2.5 text-sm text-slate-700 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStep(key)}
                            className="mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span className={checked ? 'line-through text-slate-400' : ''}>
                            {step}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-700 mb-2">
                    Recommended Resources
                  </div>
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                    {phase.resources.map((res, rIdx) => (
                      <div
                        key={rIdx}
                        className="px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 truncate">{res.title}</div>
                          <div className="text-slate-500">
                            {res.provider} · {res.type}
                          </div>
                        </div>
                        <span className="font-mono tabular-nums text-slate-600 shrink-0">
                          {res.estimatedHours}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
