import type {
  ATSCheckResult,
  InterviewFeedbackResult,
  InterviewPrepResult,
  ResumeProfile,
  SkillAnalysisResult,
  TailoredResumeResult,
  TargetSelection,
} from '../types';

export class AiRequestError extends Error {
  status: number;
  responseText: string;

  constructor(message: string, status: number, responseText: string) {
    super(message);
    this.name = 'AiRequestError';
    this.status = status;
    this.responseText = responseText;
  }
}

export function sanitizeProfileForAi(profile: ResumeProfile): ResumeProfile {
  return {
    ...profile,
    personal: {
      ...profile.personal,
      photoDataUrl: '',
    },
  };
}

export function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('latin1');
  const raw = decoder.decode(bytes);

  const chunks: string[] = [];
  const parenRegex = /\(([^()\\]{3,160})\)/g;
  let match: RegExpExecArray | null;
  while ((match = parenRegex.exec(raw)) !== null) {
    const candidate = match[1].replace(/[^\x20-\x7E]/g, ' ').trim();
    if (/[a-zA-Z]{2,}/.test(candidate) && !candidate.startsWith('PDF')) {
      chunks.push(candidate);
    }
  }

  const joined = chunks.join(' ').replace(/\s+/g, ' ').trim();
  if (joined.length >= 80) {
    return joined;
  }

  const asciiRuns = raw.match(/[A-Za-z0-9@.+/:,\- ]{6,}/g) || [];
  const filtered = asciiRuns
    .map((s) => s.trim())
    .filter((s) => /[a-z]{3,}/i.test(s) && !/obj|endobj|stream|xref|trailer|FlateDecode/i.test(s));

  return filtered.join(' ').slice(0, 12000).trim();
}

function isServerWarmupHtml(rawText: string, contentType: string): boolean {
  if (!contentType.includes('text/html') && !rawText.trim().startsWith('<')) {
    return false;
  }
  return (
    rawText.includes('Starting Server...') ||
    rawText.includes('warmup_start_time') ||
    rawText.includes('Please wait while your application starts')
  );
}

function extractReadableError(rawText: string, parsed: unknown, status: number): string {
  if (parsed && typeof parsed === 'object' && 'error' in parsed) {
    const errVal = (parsed as { error: unknown }).error;
    if (typeof errVal === 'string') {
      return errVal;
    }
    if (errVal && typeof errVal === 'object' && 'message' in errVal) {
      return String((errVal as { message: unknown }).message);
    }
  }

  const trimmed = rawText.trim();
  if (isServerWarmupHtml(trimmed, 'text/html')) {
    return 'The application server is still starting up. Please try again in a moment.';
  }
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.startsWith('<')) {
    return `Server returned HTML instead of JSON (HTTP ${status}). Verify the Express backend is running.`;
  }

  return trimmed || `Request failed with HTTP ${status}`;
}

export async function postApiJson<TResponse>(
  endpoint: string,
  payload: unknown
): Promise<TResponse> {
  const maxAttempts = 5;
  const bodyString = JSON.stringify(payload);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: bodyString,
      });
    } catch (networkErr) {
      if (attempt < 3) {
        await new Promise((resolve) => setTimeout(resolve, 400 * attempt));
        continue;
      }
      throw new AiRequestError(
        networkErr instanceof Error
          ? `${networkErr.message} — unable to reach backend endpoint ${endpoint}.`
          : `Network error reaching backend endpoint ${endpoint}.`,
        0,
        ''
      );
    }

    const rawText = await res.text();
    const contentType = res.headers.get('content-type') || '';

    if (isServerWarmupHtml(rawText, contentType) && attempt < maxAttempts) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      continue;
    }

    let parsed: unknown = null;
    if (rawText.trim()) {
      try {
        parsed = JSON.parse(rawText);
      } catch {
        parsed = null;
      }
    }

    if (!res.ok || parsed === null) {
      const message = extractReadableError(rawText, parsed, res.status);
      throw new AiRequestError(message, res.status, rawText);
    }

    return parsed as TResponse;
  }

  throw new AiRequestError('The application server is still starting up. Please try again.', 503, '');
}

export function requestResumeAssist(params: {
  mode: 'summary' | 'bullets';
  profile: ResumeProfile;
  targetCompany: string;
  targetRole: string;
  customText?: string;
}) {
  return postApiJson<{ improvedText: string; rationale: string }>('/api/ai/resume-assist', {
    ...params,
    profile: sanitizeProfileForAi(params.profile),
  });
}

export function requestSkillAnalysis(profile: ResumeProfile, target: TargetSelection) {
  return postApiJson<SkillAnalysisResult>('/api/ai/analyze-skills', {
    profile: sanitizeProfileForAi(profile),
    target,
  });
}

export function requestTailoredResume(profile: ResumeProfile, target: TargetSelection) {
  return postApiJson<TailoredResumeResult>('/api/ai/tailor-resume', {
    profile: sanitizeProfileForAi(profile),
    target,
  });
}

export function requestAtsAudit(params: {
  resumeText: string;
  fileName?: string;
  targetCompany?: string;
  targetRole?: string;
  jobDescription?: string;
}) {
  return postApiJson<ATSCheckResult>('/api/ai/ats-check', params);
}

export function requestInterviewPrep(profile: ResumeProfile, target: TargetSelection) {
  return postApiJson<InterviewPrepResult>('/api/ai/interview-prep', {
    profile: sanitizeProfileForAi(profile),
    target,
  });
}

export function requestInterviewFeedback(params: {
  question: string;
  userAnswer: string;
  companyName: string;
  roleTitle: string;
}) {
  return postApiJson<InterviewFeedbackResult>('/api/ai/interview-feedback', params);
}
