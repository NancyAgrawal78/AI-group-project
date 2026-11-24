import React, { useEffect, useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import {
  ArrowRight,
  Building2,
  Compass,
  Download,
  FileCheck2,
  FileText,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  X,
} from 'lucide-react';
import {
  DEFAULT_PROFILE,
  DEFAULT_TARGET,
  INITIAL_ACTIVITIES,
  SAMPLE_ATS_RESULT,
  SAMPLE_INTERVIEW_PREP,
  SAMPLE_SKILL_ANALYSIS,
  SAMPLE_TAILORED_RESUME,
} from './data/presets';
import type {
  ATSCheckResult,
  ActivityLogItem,
  InterviewPrepResult,
  PageRoute,
  ResumeProfile,
  ResumeTemplateId,
  SkillAnalysisResult,
  TailoredResumeResult,
  TargetSelection,
} from './types';
import { AvatarPlaceholder } from './components/AvatarPlaceholder';
import { downloadResumePdf } from './utils/pdfExport';
import { DashboardPage } from './pages/DashboardPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { TargetCompanyPage } from './pages/TargetCompanyPage';
import { CareerCoachPage } from './pages/CareerCoachPage';
import { TailoredResumePage } from './pages/TailoredResumePage';
import { AtsCheckerPage } from './pages/AtsCheckerPage';
import { InterviewPrepPage } from './pages/InterviewPrepPage';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

const NAV_ITEMS: {
  id: PageRoute;
  label: string;
  group: 'Workspace' | 'Career Journey' | 'Readiness';
  icon: React.ReactNode;
}[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    group: 'Workspace',
    icon: <LayoutDashboard className="w-4 h-4" />,
  },
  {
    id: 'builder',
    label: 'Resume Builder',
    group: 'Career Journey',
    icon: <FileText className="w-4 h-4" />,
  },
  {
    id: 'target',
    label: 'Target Company',
    group: 'Career Journey',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 'coach',
    label: 'AI Career Coach',
    group: 'Career Journey',
    icon: <Compass className="w-4 h-4" />,
  },
  {
    id: 'tailor',
    label: 'Tailored Resume',
    group: 'Career Journey',
    icon: <Sparkles className="w-4 h-4" />,
  },
  {
    id: 'ats',
    label: 'ATS Checker',
    group: 'Readiness',
    icon: <FileCheck2 className="w-4 h-4" />,
  },
  {
    id: 'interview',
    label: 'Interview Prep',
    group: 'Readiness',
    icon: <MessageSquareText className="w-4 h-4" />,
  },
];

const ROUTE_META: Record<
  PageRoute,
  { title: string; nextRoute?: PageRoute; nextLabel?: string }
> = {
  dashboard: { title: 'Dashboard', nextRoute: 'builder', nextLabel: 'Edit Resume' },
  builder: { title: 'Resume Builder', nextRoute: 'target', nextLabel: 'Select Company' },
  target: { title: 'Target Company', nextRoute: 'coach', nextLabel: 'Analyze Skills' },
  coach: { title: 'AI Career Coach', nextRoute: 'tailor', nextLabel: 'Tailor Resume' },
  tailor: { title: 'Tailored Resume', nextRoute: 'ats', nextLabel: 'Run ATS Audit' },
  ats: { title: 'ATS Checker', nextRoute: 'interview', nextLabel: 'Interview Prep' },
  interview: { title: 'Interview Prep', nextRoute: 'dashboard', nextLabel: 'Back to Overview' },
};

export default function App() {
  const [route, setRoute] = useState<PageRoute>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [profile, setProfile] = useState<ResumeProfile>(() =>
    loadStored('careerai_v1_profile', DEFAULT_PROFILE)
  );
  const [template, setTemplate] = useState<ResumeTemplateId>(() =>
    loadStored('careerai_v1_template', 'executive')
  );
  const [target, setTarget] = useState<TargetSelection>(() =>
    loadStored('careerai_v1_target', DEFAULT_TARGET)
  );
  const [skillAnalysis, setSkillAnalysis] = useState<SkillAnalysisResult>(() =>
    loadStored('careerai_v1_skill_analysis', SAMPLE_SKILL_ANALYSIS)
  );
  const [tailoredResume, setTailoredResume] = useState<TailoredResumeResult>(() =>
    loadStored('careerai_v1_tailored', SAMPLE_TAILORED_RESUME)
  );
  const [atsResult, setAtsResult] = useState<ATSCheckResult>(() =>
    loadStored('careerai_v1_ats', SAMPLE_ATS_RESULT)
  );
  const [interviewPrep, setInterviewPrep] = useState<InterviewPrepResult>(() =>
    loadStored('careerai_v1_interview', SAMPLE_INTERVIEW_PREP)
  );
  const [activities, setActivities] = useState<ActivityLogItem[]>(() =>
    loadStored('careerai_v1_activities', INITIAL_ACTIVITIES)
  );

  useEffect(() => {
    try {
      localStorage.setItem('careerai_v1_profile', JSON.stringify(profile));
    } catch {
      // Ignore quota errors on large images
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_template', JSON.stringify(template));
  }, [template]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_target', JSON.stringify(target));
  }, [target]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_skill_analysis', JSON.stringify(skillAnalysis));
  }, [skillAnalysis]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_tailored', JSON.stringify(tailoredResume));
  }, [tailoredResume]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_ats', JSON.stringify(atsResult));
  }, [atsResult]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_interview', JSON.stringify(interviewPrep));
  }, [interviewPrep]);

  useEffect(() => {
    localStorage.setItem('careerai_v1_activities', JSON.stringify(activities));
  }, [activities]);

  const logActivity = (title: string, detail: string, targetRoute: PageRoute) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setActivities((prev) => [
      { id: `act-${Date.now()}`, title, detail, timestamp: time, route: targetRoute },
      ...prev.slice(0, 14),
    ]);
  };

  const handleNavigate = (nextRoute: PageRoute) => {
    setRoute(nextRoute);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDownloadPdf = () => {
    downloadResumePdf(profile, template);
    logActivity('Downloaded Resume PDF', `${template} template`, 'builder');
  };

  const handleResetDemo = () => {
    setProfile(DEFAULT_PROFILE);
    setTemplate('executive');
    setTarget(DEFAULT_TARGET);
    setSkillAnalysis(SAMPLE_SKILL_ANALYSIS);
    setTailoredResume(SAMPLE_TAILORED_RESUME);
    setAtsResult(SAMPLE_ATS_RESULT);
    setInterviewPrep(SAMPLE_INTERVIEW_PREP);
    setActivities(INITIAL_ACTIVITIES);
    setRoute('dashboard');
    setMobileMenuOpen(false);
  };

  const groups: ('Workspace' | 'Career Journey' | 'Readiness')[] = [
    'Workspace',
    'Career Journey',
    'Readiness',
  ];

  const meta = ROUTE_META[route];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen flex bg-slate-50 text-slate-900">
        {/* Desktop Sidebar */}
        <aside className="no-print hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-950 text-slate-200 border-r border-slate-800">
          {/* Brand */}
          <div className="h-16 px-5 flex items-center gap-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
              C
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-white whitespace-nowrap">
              CareerAI
            </span>
          </div>

          {/* Nav Groups */}
          <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
            {groups.map((group) => (
              <div key={group}>
                <div className="px-3 text-[11px] font-medium text-slate-400 mb-2">{group}</div>
                <div className="space-y-1">
                  {NAV_ITEMS.filter((item) => item.group === group).map((item) => {
                    const active = route === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          active
                            ? 'bg-gradient-to-r from-indigo-600/90 to-violet-700/90 text-white'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Candidate Summary & Reset */}
          <div className="p-4 border-t border-slate-800/80 space-y-3">
            <div className="flex items-center gap-3">
              <AvatarPlaceholder
                name={profile.personal.fullName}
                photoDataUrl={profile.personal.photoDataUrl}
                size="sm"
                className="border-slate-700"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {profile.personal.fullName}
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  {target.companyName} · {skillAnalysis.matchPercentage}% match
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleResetDemo}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Sample Data
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="no-print fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-950/60"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative w-72 max-w-[80vw] bg-slate-950 text-slate-200 flex flex-col h-full z-10">
              <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800">
                <span className="font-display font-bold text-lg text-white">CareerAI</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const active = route === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetDemo}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-medium text-slate-300 bg-slate-900 rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Sample Data
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Workspace Column */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="no-print h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 sticky top-0 z-30">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="text-slate-400 hidden sm:inline">CareerAI</span>
                <span className="text-slate-300 hidden sm:inline" aria-hidden="true">
                  /
                </span>
                <span className="font-display font-semibold text-slate-900 truncate">
                  {meta.title}
                </span>
                <span className="hidden md:inline text-slate-300" aria-hidden="true">
                  ·
                </span>
                <span className="hidden md:inline text-xs text-slate-500 truncate">
                  Target: {target.companyName} ({target.roleTitle})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </button>

              {meta.nextRoute && (
                <button
                  type="button"
                  onClick={() => handleNavigate(meta.nextRoute!)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>{meta.nextLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </header>

          {/* Page Viewport */}
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-7xl w-full mx-auto">
            <motion.div
              key={route}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {route === 'dashboard' && (
                <DashboardPage
                  profile={profile}
                  target={target}
                  skillAnalysis={skillAnalysis}
                  tailoredResume={tailoredResume}
                  atsResult={atsResult}
                  interviewPrep={interviewPrep}
                  activities={activities}
                  onNavigate={handleNavigate}
                  onDownloadPdf={handleDownloadPdf}
                />
              )}

              {route === 'builder' && (
                <ResumeBuilderPage
                  profile={profile}
                  onChangeProfile={setProfile}
                  template={template}
                  onChangeTemplate={setTemplate}
                  target={target}
                  onDownloadPdf={handleDownloadPdf}
                  onNavigate={handleNavigate}
                  onLogActivity={logActivity}
                />
              )}

              {route === 'target' && (
                <TargetCompanyPage
                  target={target}
                  onChangeTarget={setTarget}
                  onNavigate={handleNavigate}
                  onLogActivity={logActivity}
                />
              )}

              {route === 'coach' && (
                <CareerCoachPage
                  profile={profile}
                  target={target}
                  analysis={skillAnalysis}
                  onUpdateAnalysis={setSkillAnalysis}
                  onNavigate={handleNavigate}
                  onLogActivity={logActivity}
                />
              )}

              {route === 'tailor' && (
                <TailoredResumePage
                  profile={profile}
                  target={target}
                  template={template}
                  onChangeTemplate={setTemplate}
                  tailored={tailoredResume}
                  onUpdateTailored={setTailoredResume}
                  onApplyToProfile={setProfile}
                  onLogActivity={logActivity}
                />
              )}

              {route === 'ats' && (
                <AtsCheckerPage
                  profile={profile}
                  target={target}
                  atsResult={atsResult}
                  onUpdateAtsResult={setAtsResult}
                  onLogActivity={logActivity}
                />
              )}

              {route === 'interview' && (
                <InterviewPrepPage
                  profile={profile}
                  target={target}
                  prep={interviewPrep}
                  onUpdatePrep={setInterviewPrep}
                  onLogActivity={logActivity}
                />
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
