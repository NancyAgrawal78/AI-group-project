import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import type {
  PageRoute,
  ResumeProfile,
  ResumeTemplateId,
  TailoredResumeResult,
  TargetSelection,
} from '../types';
import { ResumePreview } from '../components/ResumePreview';
import { requestTailoredResume } from '../utils/aiClient';
import { downloadResumePdf } from '../utils/pdfExport';

interface TailoredResumePageProps {
  profile: ResumeProfile;
  target: TargetSelection;
  template: ResumeTemplateId;
  onChangeTemplate: (tpl: ResumeTemplateId) => void;
  tailored: TailoredResumeResult;
  onUpdateTailored: (result: TailoredResumeResult) => void;
  onApplyToProfile: (updated: ResumeProfile) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

export const TailoredResumePage: React.FC<TailoredResumePageProps> = ({
  profile,
  target,
  template,
  onChangeTemplate,
  tailored,
  onUpdateTailored,
  onApplyToProfile,
  onLogActivity,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tailoredBanner, setTailoredBanner] = useState<string | null>(null);
  const [appliedBanner, setAppliedBanner] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'diff'>('preview');

  const tailoredProfile: ResumeProfile = useMemo(() => {
    const projectMap = new Map(tailored.tailoredProjects.map((p) => [p.id, p]));
    const internMap = new Map(tailored.tailoredInternships.map((i) => [i.id, i]));

    return {
      ...profile,
      personal: {
        ...profile.personal,
        summary: tailored.tailoredSummary || profile.personal.summary,
      },
      skills: tailored.tailoredSkills.length > 0 ? tailored.tailoredSkills : profile.skills,
      projects: profile.projects.map((p) => {
        const match = projectMap.get(p.id);
        return match ? { ...p, highlights: match.highlights } : p;
      }),
      internships: profile.internships.map((i) => {
        const match = internMap.get(i.id);
        return match ? { ...i, highlights: match.highlights } : i;
      }),
    };
  }, [profile, tailored]);

  const generateTailored = async () => {
    setLoading(true);
    setError(null);
    setAppliedBanner(false);
    try {
      const data = await requestTailoredResume(profile, target);
      onUpdateTailored(data);
      setTailoredBanner(
        `Tailored resume for ${target.companyName} (${target.roleTitle}) — ${data.includedKeywords.length} verified keywords highlighted and ${data.atsMatchEstimate}% projected ATS alignment.`
      );
      onLogActivity(
        `Generated ${target.companyName}-tailored resume`,
        `Estimated ${data.atsMatchEstimate}% ATS keyword alignment`,
        'tailor'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate tailored resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTailoredPdf = () => {
    downloadResumePdf(tailoredProfile, template, target.companyName);
    onLogActivity(
      'Downloaded tailored PDF',
      `${target.companyName} · ${target.roleTitle}`,
      'tailor'
    );
  };

  const handleApplyToBaseProfile = () => {
    onApplyToProfile(tailoredProfile);
    setAppliedBanner(true);
    onLogActivity(
      'Applied tailored edits to base resume',
      `Updated summary, skills, and project highlights`,
      'builder'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-indigo-700">
            Company-Specific Resume Generator · {target.companyName}
          </div>
          <h1 className="mt-1 text-xl font-display font-bold text-slate-900">
            Tailored Resume for {target.roleTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Strictly grounded in your real experience — zero fake skills or fabricated claims.
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            disabled={loading}
            onClick={generateTailored}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 disabled:opacity-60 cursor-pointer whitespace-nowrap"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            {loading ? 'Tailoring...' : `Tailor for ${target.companyName}`}
          </button>

          <button
            type="button"
            onClick={handleDownloadTailoredPdf}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Download Tailored PDF
          </button>
        </div>
      </div>

      {error && (
        <div className="no-print bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {tailoredBanner && (
        <div className="no-print bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm px-4 py-3 rounded-lg flex items-center justify-between gap-2">
          <span>{tailoredBanner}</span>
          {tailored.generatedAt && (
            <span className="text-xs font-mono text-indigo-700 shrink-0">{tailored.generatedAt}</span>
          )}
        </div>
      )}
      {appliedBanner && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-lg">
          Tailored summary, prioritized skills, and bullet points saved to your main Resume Builder profile.
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Strategy & ATS Keyword Panel */}
        <div className="no-print xl:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Projected ATS Keyword Alignment</div>
                <div className="text-3xl font-display font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                  {tailored.atsMatchEstimate}%
                </div>
              </div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                    viewMode === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Live Resume
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('diff')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                    viewMode === 'diff' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Changes Diff
                </button>
              </div>
            </div>

            {/* Template Picker */}
            <div>
              <div className="text-xs font-medium text-slate-600 mb-2">PDF Template Style</div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'executive', label: 'Executive' },
                    { id: 'modern', label: 'Modern' },
                    { id: 'minimal', label: 'Minimal ATS' },
                  ] as const
                ).map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => onChangeTemplate(tpl.id)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border cursor-pointer ${
                      template === tpl.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {tpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Included ATS Keywords */}
            <div>
              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Verified Keywords Highlighted ({tailored.includedKeywords.length})
              </div>
              <div className="text-xs text-slate-700 leading-relaxed">
                {tailored.includedKeywords.join(' · ')}
              </div>
            </div>

            {/* Missing Keywords (Honest Advisory) */}
            {tailored.recommendedKeywordsToLearn.length > 0 && (
              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200">
                <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  JD Keywords Not Added (Learn First)
                </div>
                <p className="mt-1 text-xs text-amber-900/80">
                  These appear in the job description but aren&apos;t in your verified profile yet:{' '}
                  <strong>{tailored.recommendedKeywordsToLearn.join(', ')}</strong>.
                </p>
              </div>
            )}

            {/* Tailoring Notes */}
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                What Was Tailored & Why
              </div>
              <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4">
                {tailored.tailoringNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={handleApplyToBaseProfile}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Save Tailored Copy to Base Profile
            </button>
          </div>
        </div>

        {/* Right Preview or Diff View */}
        <div className="xl:col-span-7">
          {viewMode === 'preview' ? (
            <ResumePreview
              profile={tailoredProfile}
              template={template}
              highlightKeywords={tailored.includedKeywords}
            />
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-display font-bold text-slate-900">
                  Original vs. {target.companyName}-Tailored Comparison
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Review every phrasing and prioritization improvement side-by-side before downloading.
                </p>
              </div>

              {/* Summary Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Original Summary</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {profile.personal.summary}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200">
                  <div className="text-xs font-semibold text-indigo-800 mb-2">
                    Tailored Summary for {target.companyName}
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed">
                    {tailored.tailoredSummary}
                  </p>
                </div>
              </div>

              {/* Skills Ordering Diff */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 mb-2">Original Skills Order</div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {profile.skills.join(' · ')}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200">
                  <div className="text-xs font-semibold text-indigo-800 mb-2">
                    Prioritized Skills for {target.companyName}
                  </div>
                  <p className="text-xs text-slate-900 leading-relaxed">
                    {tailored.tailoredSkills.join(' · ')}
                  </p>
                </div>
              </div>

              {/* Project Highlights Before & After */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700">
                  Project Highlights (Before & After)
                </div>
                {tailored.tailoredProjects.map((tp) => {
                  const orig = profile.projects.find((p) => p.id === tp.id);
                  return (
                    <div key={tp.id} className="space-y-2">
                      <div className="text-sm font-semibold text-slate-900">{tp.title}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                            Original Bullets
                          </div>
                          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600">
                            {(orig?.highlights || []).map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200">
                          <div className="text-[11px] font-semibold text-indigo-800 mb-1.5">
                            Tailored for {target.companyName}
                          </div>
                          <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-900">
                            {tp.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Internship Highlights Before & After */}
              {tailored.tailoredInternships.length > 0 && (
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="text-xs font-semibold text-slate-700">
                    Experience & Internship Highlights (Before & After)
                  </div>
                  {tailored.tailoredInternships.map((ti) => {
                    const orig = profile.internships.find((i) => i.id === ti.id);
                    return (
                      <div key={ti.id} className="space-y-2">
                        <div className="text-sm font-semibold text-slate-900">
                          {ti.role} — {ti.company}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="text-[11px] font-semibold text-slate-500 mb-1.5">
                              Original Bullets
                            </div>
                            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-600">
                              {(orig?.highlights || []).map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-indigo-50/40 border border-indigo-200">
                            <div className="text-[11px] font-semibold text-indigo-800 mb-1.5">
                              Tailored for {target.companyName}
                            </div>
                            <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-900">
                              {ti.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
