import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
} from 'lucide-react';
import type {
  InterviewFeedbackResult,
  InterviewPrepResult,
  PageRoute,
  ResumeProfile,
  TargetSelection,
} from '../types';
import {
  requestInterviewFeedback,
  requestInterviewPrep,
} from '../utils/aiClient';

interface InterviewPrepPageProps {
  profile: ResumeProfile;
  target: TargetSelection;
  prep: InterviewPrepResult;
  onUpdatePrep: (result: InterviewPrepResult) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

export const InterviewPrepPage: React.FC<InterviewPrepPageProps> = ({
  profile,
  target,
  prep,
  onUpdatePrep,
  onLogActivity,
}) => {
  const [category, setCategory] = useState<'all' | 'technical' | 'hr'>('all');
  const [expandedAnswer, setExpandedAnswer] = useState<Record<string, boolean>>({});
  const [practiceDrafts, setPracticeDrafts] = useState<Record<string, string>>({});
  const [feedbackMap, setFeedbackMap] = useState<Record<string, InterviewFeedbackResult>>({});
  const [feedbackLoadingId, setFeedbackLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await requestInterviewPrep(profile, target);
      onUpdatePrep(data);
      onLogActivity(
        `Interview prep generated for ${target.companyName}`,
        `${data.technicalQuestions.length} technical & ${data.hrQuestions.length} HR questions`,
        'interview'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to generate interview questions.');
    } finally {
      setLoading(false);
    }
  };

  const evaluatePracticeAnswer = async (id: string, question: string) => {
    const answer = (practiceDrafts[id] || '').trim();
    if (!answer) return;
    setFeedbackLoadingId(id);
    setError(null);
    try {
      const data = await requestInterviewFeedback({
        question,
        userAnswer: answer,
        companyName: target.companyName,
        roleTitle: target.roleTitle,
      });
      setFeedbackMap((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to evaluate answer.');
    } finally {
      setFeedbackLoadingId(null);
    }
  };

  const showTech = category === 'all' || category === 'technical';
  const showHr = category === 'all' || category === 'hr';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-indigo-700">
            AI Interview Preparation · {target.companyName}
          </div>
          <h1 className="mt-1 text-xl font-display font-bold text-slate-900">
            Technical & HR Questions for {target.roleTitle}
          </h1>
          <p className="mt-1 text-sm text-slate-600 max-w-2xl">
            {prep.companyFocusSummary}
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={generateQuestions}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? 'Generating Kit...' : `Generate ${target.companyName} Questions`}
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Filter Segmented Control */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {[
            {
              id: 'all',
              label: `All (${prep.technicalQuestions.length + prep.hrQuestions.length})`,
            },
            { id: 'technical', label: `Technical (${prep.technicalQuestions.length})` },
            { id: 'hr', label: `HR & Behavioral (${prep.hrQuestions.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id as 'all' | 'technical' | 'hr')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md cursor-pointer whitespace-nowrap ${
                category === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {prep.generatedAt && (
          <span className="text-xs text-slate-500 font-mono">{prep.generatedAt}</span>
        )}
      </div>

      {/* Technical Questions */}
      {showTech && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-slate-900">
            Technical Interview Questions
          </h2>
          {prep.technicalQuestions.map((q, idx) => {
            const open = Boolean(expandedAnswer[q.id]);
            const feedback = feedbackMap[q.id];
            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="text-xs font-medium text-indigo-700">
                    Question 0{idx + 1} · {q.topic} · {q.difficulty}
                  </div>
                </div>

                <h3 className="text-base font-display font-bold text-slate-900 leading-snug">
                  {q.question}
                </h3>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Why interviewers ask this:</strong> {q.whyAsked}
                </p>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-800 mb-1.5">
                    Preparation Tips
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                    {q.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAnswer((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {open ? 'Hide Sample Answer' : 'View Sample Answer'}
                  </button>

                  {open && (
                    <div className="mt-3 p-4 rounded-lg bg-indigo-50/50 border border-indigo-200 text-sm text-slate-800 leading-relaxed">
                      {q.sampleAnswer}
                    </div>
                  )}
                </div>

                {/* Practice Answer Box */}
                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MessageSquareText className="w-3.5 h-3.5 text-indigo-600" />
                    Practice Your Answer for AI Coaching Feedback
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      placeholder="Draft how you would answer this in the interview..."
                      value={practiceDrafts[q.id] || ''}
                      onChange={(e) =>
                        setPracticeDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      disabled={feedbackLoadingId === q.id || !(practiceDrafts[q.id] || '').trim()}
                      onClick={() => evaluatePracticeAnswer(q.id, q.question)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {feedbackLoadingId === q.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Get AI Feedback
                    </button>
                  </div>

                  {feedback && (
                    <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
                      <div className="font-semibold text-emerald-950 font-mono tabular-nums">
                        Coach Evaluation Score: {feedback.score} / 100
                      </div>
                      <div>
                        <strong className="text-emerald-900">Strengths:</strong>{' '}
                        {feedback.strengths.join(' · ')}
                      </div>
                      <div>
                        <strong className="text-amber-900">To Improve:</strong>{' '}
                        {feedback.improvements.join(' · ')}
                      </div>
                      <div className="pt-1 text-slate-800">
                        <strong>Polished Answer:</strong> {feedback.polishedVersion}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* HR / Behavioral Questions */}
      {showHr && (
        <div className="space-y-4">
          <h2 className="text-base font-display font-bold text-slate-900">
            HR & Behavioral Questions
          </h2>
          {prep.hrQuestions.map((q, idx) => {
            const open = Boolean(expandedAnswer[q.id]);
            const feedback = feedbackMap[q.id];
            return (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
                <div className="text-xs font-medium text-violet-700">
                  Behavioral 0{idx + 1} · {q.competency}
                </div>

                <h3 className="text-base font-display font-bold text-slate-900 leading-snug">
                  {q.question}
                </h3>

                <p className="text-xs text-slate-600">
                  <strong className="text-slate-800">Why interviewers ask this:</strong> {q.whyAsked}
                </p>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-xs font-semibold text-slate-800 mb-1.5">STAR Tips</div>
                  <ul className="list-disc pl-4 space-y-1 text-xs text-slate-600">
                    {q.tips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAnswer((prev) => ({ ...prev, [q.id]: !prev[q.id] }))
                    }
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
                  >
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    {open ? 'Hide STAR Sample Answer' : 'View STAR Sample Answer'}
                  </button>

                  {open && (
                    <div className="mt-3 p-4 rounded-lg bg-violet-50/50 border border-violet-200 text-sm text-slate-800 leading-relaxed">
                      {q.sampleAnswer}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <MessageSquareText className="w-3.5 h-3.5 text-violet-600" />
                    Practice STAR Response
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <textarea
                      rows={2}
                      placeholder="Write your Situation, Task, Action, and Result..."
                      value={practiceDrafts[q.id] || ''}
                      onChange={(e) =>
                        setPracticeDrafts((prev) => ({ ...prev, [q.id]: e.target.value }))
                      }
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      disabled={feedbackLoadingId === q.id || !(practiceDrafts[q.id] || '').trim()}
                      onClick={() => evaluatePracticeAnswer(q.id, q.question)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg disabled:opacity-50 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      {feedbackLoadingId === q.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      Get AI Feedback
                    </button>
                  </div>

                  {feedback && (
                    <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-200 space-y-2 text-xs">
                      <div className="font-semibold text-emerald-950 font-mono tabular-nums">
                        Coach Evaluation Score: {feedback.score} / 100
                      </div>
                      <div>
                        <strong className="text-emerald-900">Strengths:</strong>{' '}
                        {feedback.strengths.join(' · ')}
                      </div>
                      <div>
                        <strong className="text-amber-900">To Improve:</strong>{' '}
                        {feedback.improvements.join(' · ')}
                      </div>
                      <div className="pt-1 text-slate-800">
                        <strong>Polished Answer:</strong> {feedback.polishedVersion}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
