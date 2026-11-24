import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import type { ResumeProfile, TargetSelection } from './src/types.ts';
import {
  analyzeSkillsLocally,
  evaluateAtsLocally,
  evaluateInterviewAnswerLocally,
  generateInterviewPrepLocally,
  generateLocalResumeAssist,
  tailorResumeLocally,
} from './src/utils/localCareerEngine.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveServerPort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  const cliPort = portArgIdx !== -1 ? Number(process.argv[portArgIdx + 1]) : 0;
  const rawEnvPort = Number(process.env.PORT) || 0;
  const nginxPort = Number(process.env.NGINX_PORT) || 0;
  const defaultAppPort = Number(process.env.DEFAULT_APP_PORT) || 3000;

  if (cliPort > 0) return cliPort;
  if (rawEnvPort > 0 && rawEnvPort !== nginxPort) return rawEnvPort;
  return defaultAppPort;
}

const PORT = resolveServerPort();

function isValidObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function isValidProfile(value: unknown): value is ResumeProfile {
  if (!isValidObject(value)) return false;
  return (
    isValidObject(value.personal) &&
    Array.isArray(value.skills) &&
    Array.isArray(value.projects) &&
    Array.isArray(value.internships) &&
    Array.isArray(value.education)
  );
}

function isValidTarget(value: unknown): value is TargetSelection {
  if (!isValidObject(value)) return false;
  return typeof value.companyName === 'string' && typeof value.roleTitle === 'string';
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Handle CORS preflight cleanly for preview iframes
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      engine: 'express-local-career-engine',
    });
  });

  // 1. Resume Assist (AI Summary & Bullet Enhancement)
  app.post('/api/ai/resume-assist', (req: Request, res: Response) => {
    try {
      const { mode, profile, targetCompany, targetRole, customText } = req.body ?? {};
      if (mode !== 'summary' && mode !== 'bullets') {
        res.status(400).json({ error: 'Invalid mode. Expected "summary" or "bullets".' });
        return;
      }
      if (!isValidProfile(profile)) {
        res.status(400).json({ error: 'Valid candidate profile payload is required.' });
        return;
      }
      const result = generateLocalResumeAssist({
        mode,
        profile,
        targetCompany: typeof targetCompany === 'string' ? targetCompany : '',
        targetRole: typeof targetRole === 'string' ? targetRole : '',
        customText: typeof customText === 'string' ? customText : undefined,
      });
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to generate resume enhancement.' });
    }
  });

  // 2. Smart Career Coach: Skill-Gap & Learning Roadmap Analysis
  app.post('/api/ai/analyze-skills', (req: Request, res: Response) => {
    try {
      const { profile, target } = req.body ?? {};
      if (!isValidProfile(profile) || !isValidTarget(target)) {
        res.status(400).json({ error: 'Valid profile and target selection are required.' });
        return;
      }
      const result = analyzeSkillsLocally(profile, target);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to analyze skill match.' });
    }
  });

  // 3. Company-Specific Resume Tailoring
  app.post('/api/ai/tailor-resume', (req: Request, res: Response) => {
    try {
      const { profile, target } = req.body ?? {};
      if (!isValidProfile(profile) || !isValidTarget(target)) {
        res.status(400).json({ error: 'Valid profile and target selection are required.' });
        return;
      }
      const result = tailorResumeLocally(profile, target);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to tailor resume.' });
    }
  });

  // 4. ATS Resume Compatibility Audit
  app.post('/api/ai/ats-check', (req: Request, res: Response) => {
    try {
      const { resumeText, fileName, targetCompany, targetRole, jobDescription } = req.body ?? {};
      if (typeof resumeText !== 'string' || !resumeText.trim()) {
        res.status(400).json({ error: 'Resume text is required for ATS evaluation.' });
        return;
      }
      const result = evaluateAtsLocally({
        resumeText: resumeText.trim(),
        fileName: typeof fileName === 'string' ? fileName : 'Resume Input',
        targetCompany: typeof targetCompany === 'string' ? targetCompany : undefined,
        targetRole: typeof targetRole === 'string' ? targetRole : undefined,
        jobDescription: typeof jobDescription === 'string' ? jobDescription : undefined,
      });
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to evaluate ATS compatibility.' });
    }
  });

  // 5. Interview Prep Kit Generation
  app.post('/api/ai/interview-prep', (req: Request, res: Response) => {
    try {
      const { profile, target } = req.body ?? {};
      if (!isValidProfile(profile) || !isValidTarget(target)) {
        res.status(400).json({ error: 'Valid profile and target selection are required.' });
        return;
      }
      const result = generateInterviewPrepLocally(profile, target);
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to generate interview questions.' });
    }
  });

  // 6. Interactive Practice Answer Feedback
  app.post('/api/ai/interview-feedback', (req: Request, res: Response) => {
    try {
      const { question, userAnswer, companyName, roleTitle } = req.body ?? {};
      if (typeof question !== 'string' || typeof userAnswer !== 'string' || !userAnswer.trim()) {
        res.status(400).json({ error: 'Question and practice answer text are required.' });
        return;
      }
      const result = evaluateInterviewAnswerLocally({
        question,
        userAnswer: userAnswer.trim(),
        companyName: typeof companyName === 'string' ? companyName : 'Target Company',
        roleTitle: typeof roleTitle === 'string' ? roleTitle : 'Software Engineer',
      });
      res.json(result);
    } catch {
      res.status(500).json({ error: 'Failed to evaluate practice interview answer.' });
    }
  });

  // Ensure unmatched /api routes return structured JSON
  app.use('/api', (req: Request, res: Response) => {
    res.status(404).json({
      error: `API endpoint not found: ${req.method} ${req.originalUrl}`,
    });
  });

  // Mount Vite middleware in dev, or serve static dist/ in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.use((_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CareerAI Express server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
