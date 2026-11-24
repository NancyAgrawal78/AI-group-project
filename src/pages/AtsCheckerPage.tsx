import React, { useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  FileUp,
  Loader2,
  Sparkles,
  XCircle,
} from 'lucide-react';
import type { ATSCheckResult, PageRoute, ResumeProfile, TargetSelection } from '../types';
import { extractTextFromPdfBuffer, requestAtsAudit } from '../utils/aiClient';
import { profileToPlainText } from '../utils/pdfExport';

interface AtsCheckerPageProps {
  profile: ResumeProfile;
  target: TargetSelection;
  atsResult: ATSCheckResult;
  onUpdateAtsResult: (result: ATSCheckResult) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

export const AtsCheckerPage: React.FC<AtsCheckerPageProps> = ({
  profile,
  target,
  atsResult,
  onUpdateAtsResult,
  onLogActivity,
}) => {
  const [resumeText, setResumeText] = useState(() => profileToPlainText(profile));
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isPdfAttached, setIsPdfAttached] = useState(false);
  const [includeTargetJd, setIncludeTargetJd] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > 10 * 1024 * 1024) {
      setError('Resume file must be under 10 MB.');
      return;
    }

    setUploadedFileName(file.name);

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          const extracted = extractTextFromPdfBuffer(reader.result);
          setIsPdfAttached(true);
          if (extracted.length >= 40) {
            setResumeText(extracted);
          } else {
            setResumeText(profileToPlainText(profile));
            setError(
              'Compressed PDF stream detected — loaded your builder resume text below for immediate ATS scoring (or paste PDF text manually).'
            );
          }
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setIsPdfAttached(false);
          setResumeText(reader.result);
        }
      };
      reader.readAsText(file);
    }
  };

  const loadCurrentBuilderResume = () => {
    setUploadedFileName('Current Builder Profile');
    setIsPdfAttached(false);
    setResumeText(profileToPlainText(profile));
    setError(null);
  };

  const runAtsCheck = async () => {
    if (!resumeText.trim()) {
      setError('Upload a PDF/text resume or paste your resume content first.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await requestAtsAudit({
        resumeText: resumeText.trim(),
        fileName: uploadedFileName || 'Resume Input',
        targetCompany: includeTargetJd ? target.companyName : undefined,
        targetRole: includeTargetJd ? target.roleTitle : undefined,
        jobDescription: includeTargetJd ? target.jobDescription : undefined,
      });

      onUpdateAtsResult({
        ...data,
        checkedFileName: uploadedFileName || 'Pasted Resume',
      });
      onLogActivity(
        'ATS compatibility check completed',
        `Score: ${data.atsScore}/100 (${uploadedFileName || 'Resume'})`,
        'ats'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to run ATS compatibility check.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">ATS Resume Checker</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Upload an existing PDF/TXT resume or analyze your current builder profile for ATS parsing and keyword gaps.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={runAtsCheck}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? 'Scanning Resume...' : 'Run ATS Audit'}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload / Paste Resume */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-display font-bold text-slate-900">Resume Input</h2>
            <button
              type="button"
              onClick={loadCurrentBuilderResume}
              className="text-xs font-semibold text-indigo-700 hover:underline cursor-pointer"
            >
              Load Builder Resume
            </button>
          </div>

          {/* File Upload Drop Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/70 rounded-xl p-5 text-center cursor-pointer transition-colors"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
            <FileUp className="w-6 h-6 text-indigo-700 mx-auto" />
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {uploadedFileName ? uploadedFileName : 'Upload Resume (PDF, TXT, MD)'}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {isPdfAttached
                ? 'PDF text extracted locally and ready for ATS layout & keyword inspection.'
                : 'Click to browse a file from your computer, or paste text below.'}
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={includeTargetJd}
              onChange={(e) => setIncludeTargetJd(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            Score against {target.companyName} ({target.roleTitle}) JD
          </label>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Or Paste Resume Plain Text
            </label>
            <textarea
              rows={10}
              value={resumeText}
              onChange={(e) => {
                setResumeText(e.target.value);
                setIsPdfAttached(false);
                setUploadedFileName('Pasted Resume Text');
              }}
              placeholder="Paste your resume text here..."
              className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Right: ATS Analysis Report */}
        <div className="lg:col-span-7 space-y-6">
          {/* Score Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
              <div>
                <div className="text-xs text-slate-500">
                  {atsResult.checkedFileName || 'Resume'} · {atsResult.checkedAt || 'Baseline'}
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-display font-bold font-mono tabular-nums text-slate-900">
                    {atsResult.atsScore}
                  </span>
                  <span className="text-sm text-slate-400 font-mono">/ 100 ATS Score</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                <FileCheck2 className="w-5 h-5" />
                {atsResult.atsScore >= 85
                  ? 'High ATS Compatibility'
                  : atsResult.atsScore >= 70
                    ? 'Good — Minor Optimizations'
                    : 'Needs Revision'}
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-700 leading-relaxed">{atsResult.summary}</p>

            {/* 5-Dimension Breakdown */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Formatting & Structure', val: atsResult.sectionScores.formatting },
                { label: 'Keyword Match', val: atsResult.sectionScores.keywords },
                { label: 'Quantified Impact', val: atsResult.sectionScores.impactMetrics },
                { label: 'Readability & Clarity', val: atsResult.sectionScores.readability },
                { label: 'Section Completeness', val: atsResult.sectionScores.completeness },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-mono tabular-nums">{item.val}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${item.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Found vs Missing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Keywords Detected ({atsResult.foundKeywords.length})
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {atsResult.foundKeywords.length > 0
                  ? atsResult.foundKeywords.join(' · ')
                  : 'None detected yet.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="text-xs font-semibold text-rose-800 flex items-center gap-1.5 mb-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                Missing Keywords ({atsResult.missingKeywords.length})
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {atsResult.missingKeywords.length > 0
                  ? atsResult.missingKeywords.join(' · ')
                  : 'Strong keyword coverage!'}
              </p>
            </div>
          </div>

          {/* Formatting Issues */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-display font-bold text-slate-900">
              Formatting & Parser Issues
            </h2>
            <div className="mt-3 space-y-3">
              {atsResult.formattingIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50"
                >
                  <div className="flex items-center justify-between gap-2 text-xs font-semibold text-amber-950">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      {issue.issue}
                    </span>
                    <span className="uppercase font-mono text-[11px] text-amber-800 shrink-0">
                      {issue.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-amber-900/80 pl-5">{issue.fix}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Suggestions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h2 className="text-base font-display font-bold text-slate-900">
              Section-by-Section Improvement Suggestions
            </h2>
            <div className="mt-3 divide-y divide-slate-100">
              {atsResult.suggestions.map((sug, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0">
                  <div className="text-xs font-semibold text-indigo-700">{sug.section}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{sug.currentObservation}</div>
                  <div className="text-sm text-slate-800 mt-1">{sug.improvementAction}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
