import React from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Compass,
  Download,
  FileCheck2,
  FileText,
  MessageSquareText,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import type {
  ATSCheckResult,
  ActivityLogItem,
  InterviewPrepResult,
  PageRoute,
  ResumeProfile,
  SkillAnalysisResult,
  TailoredResumeResult,
  TargetSelection,
} from '../types';
import { AvatarPlaceholder } from '../components/AvatarPlaceholder';

interface DashboardPageProps {
  profile: ResumeProfile;
  target: TargetSelection;
  skillAnalysis: SkillAnalysisResult;
  tailoredResume: TailoredResumeResult;
  atsResult: ATSCheckResult;
  interviewPrep: InterviewPrepResult;
  activities: ActivityLogItem[];
  onNavigate: (route: PageRoute) => void;
  onDownloadPdf: () => void;
}

export function computeResumeCompleteness(profile: ResumeProfile): number {
  let score = 0;
  if (profile.personal.fullName.trim() && profile.personal.email.trim()) score += 15;
  if (profile.personal.headline.trim() && profile.personal.location.trim()) score += 10;
  if (profile.personal.summary.trim().length > 40) score += 15;
  if (profile.personal.photoDataUrl) score += 10;
  if (profile.education.length > 0) score += 15;
  if (profile.skills.length >= 5) score += 15;
  if (profile.projects.length > 0) score += 10;
  if (profile.internships.length > 0 || profile.certifications.length > 0) score += 10;
  return Math.min(100, score);
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  target,
  skillAnalysis,
  tailoredResume,
  atsResult,
  interviewPrep,
  activities,
  onNavigate,
  onDownloadPdf,
}) => {
  const completeness = computeResumeCompleteness(profile);
  const matchedCount = skillAnalysis.matchedSkills.length;
  const weakCount = skillAnalysis.missingOrWeakSkills.filter((s) => s.status === 'weak').length;
  const missingCount = skillAnalysis.missingOrWeakSkills.filter((s) => s.status !== 'weak').length;
  const totalEvaluated = Math.max(1, matchedCount + weakCount + missingCount);

  const matchedPct = Math.round((matchedCount / totalEvaluated) * 100);
  const weakPct = Math.round((weakCount / totalEvaluated) * 100);
  const missingPct = Math.max(0, 100 - matchedPct - weakPct);

  const journeySteps: {
    step: string;
    label: string;
    done: boolean;
    route: PageRoute;
  }[] = [
    {
      step: '01',
      label: 'Profile & Photo',
      done: completeness >= 75,
      route: 'builder',
    },
    {
      step: '02',
      label: 'Target Company',
      done: Boolean(target.companyName && target.roleTitle),
      route: 'target',
    },
    {
      step: '03',
      label: 'Skill Gap Analysis',
      done: skillAnalysis.matchPercentage > 0,
      route: 'coach',
    },
    {
      step: '04',
      label: 'Tailored Resume',
      done: Boolean(tailoredResume.tailoredSummary),
      route: 'tailor',
    },
    {
      step: '05',
      label: 'ATS & Interview',
      done: atsResult.atsScore > 0 && interviewPrep.technicalQuestions.length > 0,
      route: 'ats',
    },
  ];

  const recommendations = [
    {
      title:
        skillAnalysis.missingOrWeakSkills[0]?.name
          ? `Close priority gap: ${skillAnalysis.missingOrWeakSkills[0].name}`
          : 'Run AI skill-gap evaluation',
      description:
        skillAnalysis.missingOrWeakSkills[0]?.reason ||
        'Evaluate your skills against the active job description.',
      actionLabel: 'Open Career Coach',
      route: 'coach' as PageRoute,
    },
    {
      title: `Tailor resume for ${target.companyName}`,
      description: `Align project highlights and summary phrasing for ${target.roleTitle} without adding unverified claims.`,
      actionLabel: 'Generate Tailored Resume',
      route: 'tailor' as PageRoute,
    },
    {
      title: !profile.personal.photoDataUrl
        ? 'Upload a professional profile photo'
        : 'Verify PDF formatting in ATS Checker',
      description: !profile.personal.photoDataUrl
        ? 'Add a clean portrait headshot to personalize your Executive or Modern resume template.'
        : 'Test your tailored resume against ATS keyword extraction and layout rules.',
      actionLabel: !profile.personal.photoDataUrl ? 'Upload Photo' : 'Run ATS Audit',
      route: (!profile.personal.photoDataUrl ? 'builder' : 'ats') as PageRoute,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Workspace Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 min-w-0">
            <AvatarPlaceholder
              name={profile.personal.fullName}
              photoDataUrl={profile.personal.photoDataUrl}
              size="lg"
            />
            <div className="min-w-0">
              <div className="text-xs font-medium text-indigo-700">
                Active Career Workspace · {target.companyName}
              </div>
              <h1 className="mt-1 text-2xl font-display font-bold text-slate-900 truncate">
                {profile.personal.fullName || 'Candidate Workspace'}
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Targeting <span className="font-semibold text-slate-900">{target.roleTitle}</span> at{' '}
                <span className="font-semibold text-slate-900">{target.companyName}</span>
                <span className="mx-2 text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span>{skillAnalysis.readinessLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tailor')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Tailor Resume for {target.companyName}
            </button>
          </div>
        </div>

        {/* Connected Career Journey Pipeline */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="text-xs font-medium text-slate-500 mb-3">
            Guided Career Journey
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {journeySteps.map((item) => (
              <button
                key={item.step}
                type="button"
                onClick={() => onNavigate(item.route)}
                className="group text-left p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono tabular-nums text-slate-400">{item.step}</span>
                  {item.done ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 shrink-0" />
                  )}
                </div>
                <div className="mt-1.5 text-sm font-semibold text-slate-900 truncate">
                  {item.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4-Column KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => onNavigate('builder')}
          className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Resume Completeness</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900">
              {completeness}%
            </span>
            <span className="text-xs text-slate-500">
              {profile.skills.length} skills · {profile.projects.length} projects
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-900 to-indigo-600 rounded-full transition-all"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('ats')}
          className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>ATS Compatibility Score</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900">
              {atsResult.atsScore}
              <span className="text-base font-normal text-slate-400">/100</span>
            </span>
            <span className="text-xs font-medium text-emerald-700">
              {atsResult.foundKeywords.length} matched keywords
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 rounded-full transition-all"
              style={{ width: `${atsResult.atsScore}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('coach')}
          className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Skill-Match ({target.companyName})</span>
            <Compass className="w-4 h-4 text-violet-700" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900">
              {skillAnalysis.matchPercentage}%
            </span>
            <span className="text-xs font-medium text-amber-700">
              {skillAnalysis.missingOrWeakSkills.length} gaps tracked
            </span>
          </div>
          <div className="mt-3 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full transition-all"
              style={{ width: `${skillAnalysis.matchPercentage}%` }}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('interview')}
          className="text-left bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Interview Prep Kit</span>
            <MessageSquareText className="w-4 h-4 text-slate-700" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900">
              {interviewPrep.technicalQuestions.length + interviewPrep.hrQuestions.length}
            </span>
            <span className="text-xs text-slate-500">
              {interviewPrep.technicalQuestions.length} tech · {interviewPrep.hrQuestions.length} HR
            </span>
          </div>
          <div className="mt-3 text-xs font-medium text-indigo-700 flex items-center gap-1">
            Practice {target.companyName} questions <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Skill Comparison & Career Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Skill Comparison Chart Card */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900">
                Skill Compatibility Breakdown
              </h2>
              <p className="text-sm text-slate-500">
                Profile competencies compared against {target.companyName} · {target.roleTitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('coach')}
              className="text-sm font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Full Coach View <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stacked Bar */}
          <div className="mt-5">
            <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100">
              <div
                className="bg-emerald-600 h-full transition-all"
                style={{ width: `${matchedPct}%` }}
                title={`Matched: ${matchedCount}`}
              />
              <div
                className="bg-amber-500 h-full transition-all"
                style={{ width: `${weakPct}%` }}
                title={`Developing: ${weakCount}`}
              />
              <div
                className="bg-rose-600 h-full transition-all"
                style={{ width: `${missingPct}%` }}
                title={`Missing: ${missingCount}`}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
                Matched Skills ({matchedCount})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                Weak / Developing ({weakCount})
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
                Missing Skills ({missingCount})
              </span>
            </div>
          </div>

          {/* Sub-score Bar Chart (from ATS Section Scores) */}
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
            <div className="text-xs font-medium text-slate-500">
              Resume & Role Readiness Dimensions
            </div>
            {[
              { label: 'Formatting & Layout', val: atsResult.sectionScores.formatting },
              { label: 'Role Keyword Alignment', val: atsResult.sectionScores.keywords },
              { label: 'Quantified Impact Metrics', val: atsResult.sectionScores.impactMetrics },
              { label: 'Role Compatibility Score', val: skillAnalysis.compatibilityScore },
            ].map((row) => (
              <div key={row.label} className="grid grid-cols-12 items-center gap-3 text-sm">
                <div className="col-span-5 sm:col-span-4 text-slate-700 truncate">{row.label}</div>
                <div className="col-span-5 sm:col-span-7 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all"
                    style={{ width: `${row.val}%` }}
                  />
                </div>
                <div className="col-span-2 sm:col-span-1 text-right font-mono tabular-nums text-xs font-semibold text-slate-800">
                  {row.val}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-display font-bold text-slate-900">
                Career Recommendations
              </h2>
              <TrendingUp className="w-4 h-4 text-violet-700" />
            </div>
            <p className="text-sm text-slate-500 mt-0.5">
              Prioritized actions to maximize shortlist odds
            </p>

            <div className="mt-5 divide-y divide-slate-100">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="text-sm font-semibold text-slate-900">{rec.title}</div>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">{rec.description}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate(rec.route)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    {rec.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities + Quick Workspace Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-bold text-slate-900">Recent Activities</h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              {activities.length} logged
            </span>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{act.title}</div>
                  <div className="text-xs text-slate-500 truncate">{act.detail}</div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="text-xs font-mono tabular-nums text-slate-400">
                    {act.timestamp}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate(act.route)}
                    className="text-xs font-medium text-indigo-700 hover:underline cursor-pointer whitespace-nowrap"
                  >
                    Open
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-lg font-display font-bold text-slate-900">Target Profile Snapshot</h2>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> Company
              </span>
              <span className="font-semibold text-slate-900">{target.companyName}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-slate-400" /> Role
              </span>
              <span className="font-semibold text-slate-900 text-right">{target.roleTitle}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-slate-400" /> Tailored ATS Estimate
              </span>
              <span className="font-mono tabular-nums font-semibold text-emerald-700">
                {tailoredResume.atsMatchEstimate}%
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('target')}
            className="mt-5 w-full py-2.5 px-4 text-sm font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Change Target Company or JD
          </button>
        </div>
      </div>
    </div>
  );
};
