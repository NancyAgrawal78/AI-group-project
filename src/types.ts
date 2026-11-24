export type PageRoute =
  | 'dashboard'
  | 'builder'
  | 'target'
  | 'coach'
  | 'tailor'
  | 'ats'
  | 'interview';

export type ResumeTemplateId = 'executive' | 'modern' | 'minimal';

export interface PersonalDetails {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  summary: string;
  photoDataUrl: string;
  includePhoto: boolean;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  duration: string;
  link: string;
  highlights: string[];
}

export interface InternshipItem {
  id: string;
  company: string;
  role: string;
  duration: string;
  location: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credentialId: string;
}

export interface ResumeProfile {
  personal: PersonalDetails;
  education: EducationItem[];
  skills: string[];
  projects: ProjectItem[];
  internships: InternshipItem[];
  certifications: CertificationItem[];
}

export interface TargetSelection {
  companyId: string;
  companyName: string;
  industry: string;
  roleTitle: string;
  jobDescription: string;
  experienceLevel: string;
}

export interface CompanyPreset {
  id: string;
  name: string;
  industry: string;
  headquarters: string;
  accentColor: string;
  hiringFocus: string;
  roles: {
    title: string;
    level: string;
    requiredSkills: string[];
    description: string;
  }[];
}

export interface SkillAnalysisResult {
  matchPercentage: number;
  compatibilityScore: number;
  readinessLabel: string;
  coachSummary: string;
  matchedSkills: {
    name: string;
    category: string;
    evidenceInProfile: string;
  }[];
  missingOrWeakSkills: {
    name: string;
    status: 'missing' | 'weak' | string;
    priority: 'high' | 'medium' | 'low' | string;
    reason: string;
  }[];
  requiredSkillsToDevelop: {
    skill: string;
    targetLevel: string;
    whyItMatters: string;
  }[];
  learningRoadmap: {
    phase: string;
    duration: string;
    focusSkill: string;
    actionSteps: string[];
    resources: {
      title: string;
      provider: string;
      type: string;
      estimatedHours: string;
    }[];
  }[];
  analyzedAt?: string;
}

export interface TailoredResumeResult {
  tailoredSummary: string;
  tailoredSkills: string[];
  tailoredProjects: {
    id: string;
    title: string;
    highlights: string[];
  }[];
  tailoredInternships: {
    id: string;
    company: string;
    role: string;
    highlights: string[];
  }[];
  atsMatchEstimate: number;
  includedKeywords: string[];
  recommendedKeywordsToLearn: string[];
  tailoringNotes: string[];
  generatedAt?: string;
}

export interface ATSCheckResult {
  atsScore: number;
  summary: string;
  sectionScores: {
    formatting: number;
    keywords: number;
    impactMetrics: number;
    readability: number;
    completeness: number;
  };
  foundKeywords: string[];
  missingKeywords: string[];
  formattingIssues: {
    severity: 'high' | 'medium' | 'low' | string;
    issue: string;
    fix: string;
  }[];
  suggestions: {
    section: string;
    currentObservation: string;
    improvementAction: string;
  }[];
  checkedFileName?: string;
  checkedAt?: string;
}

export interface TechnicalQuestion {
  id: string;
  question: string;
  difficulty: string;
  topic: string;
  whyAsked: string;
  sampleAnswer: string;
  tips: string[];
}

export interface HRQuestion {
  id: string;
  question: string;
  competency: string;
  whyAsked: string;
  sampleAnswer: string;
  tips: string[];
}

export interface InterviewPrepResult {
  companyFocusSummary: string;
  technicalQuestions: TechnicalQuestion[];
  hrQuestions: HRQuestion[];
  generatedAt?: string;
}

export interface InterviewFeedbackResult {
  score: number;
  strengths: string[];
  improvements: string[];
  polishedVersion: string;
}

export interface ActivityLogItem {
  id: string;
  title: string;
  detail: string;
  timestamp: string;
  route: PageRoute;
}
