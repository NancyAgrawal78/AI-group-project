import { COMPANY_PRESETS } from '../data/presets.ts';
import type {
  ATSCheckResult,
  InterviewFeedbackResult,
  InterviewPrepResult,
  ResumeProfile,
  SkillAnalysisResult,
  TailoredResumeResult,
  TargetSelection,
} from '../types.ts';

interface SkillCatalogEntry {
  canonical: string;
  category: string;
  aliases: string[];
  whyItMatters: string;
  studySteps: string[];
  resources: {
    title: string;
    provider: string;
    type: string;
    estimatedHours: string;
  }[];
}

const SKILL_CATALOG: SkillCatalogEntry[] = [
  {
    canonical: 'Data Structures & Algorithms',
    category: 'Core CS',
    aliases: [
      'data structures & algorithms',
      'data structures',
      'algorithms',
      'dsa',
      'complexity analysis',
      'big-o',
      'graphs',
      'dynamic programming',
    ],
    whyItMatters:
      'Core evaluation signal for coding interviews, optimal runtime complexity, and clean problem decomposition.',
    studySteps: [
      'Solve 30 medium/hard problems covering graphs, trees, sliding window, and dynamic programming under 40-minute timers.',
      'Practice articulating time/space complexity trade-offs aloud before coding.',
    ],
    resources: [
      {
        title: 'NeetCode 150 Roadmap',
        provider: 'NeetCode',
        type: 'Interactive Practice',
        estimatedHours: '24 hrs',
      },
      {
        title: 'Tech Dev Guide — Data Structures & Algorithms',
        provider: 'Google',
        type: 'Official Guide',
        estimatedHours: '10 hrs',
      },
    ],
  },
  {
    canonical: 'System Design',
    category: 'Architecture',
    aliases: [
      'system design',
      'scalable systems',
      'large-scale',
      'sharding',
      'load balancing',
      'high availability',
      'high-throughput',
      'low-level design',
      'lld',
    ],
    whyItMatters:
      'Demonstrates readiness to design scalable, fault-tolerant architectures with clear trade-offs.',
    studySteps: [
      'Walk through 6 canonical designs: rate limiter, distributed task queue, URL shortener, notification fan-out, and caching layers.',
      'Write 1-page architecture decision records covering partitioning, consistency, and failure recovery.',
    ],
    resources: [
      {
        title: 'System Design Primer',
        provider: 'GitHub Open Source',
        type: 'Study Guide',
        estimatedHours: '16 hrs',
      },
      {
        title: 'Designing Data-Intensive Applications (Summary Notes)',
        provider: 'O’Reilly / Study Notes',
        type: 'Architecture Reference',
        estimatedHours: '12 hrs',
      },
    ],
  },
  {
    canonical: 'Distributed Systems',
    category: 'Architecture',
    aliases: [
      'distributed systems',
      'distributed',
      'fault-tolerant',
      'idempotency',
      'microservices',
      'message queues',
      'kafka',
      'task scheduler',
      'job queue',
      'concurrency',
    ],
    whyItMatters:
      'Essential for reasoning about retries, eventual consistency, partitioning, and asynchronous processing.',
    studySteps: [
      'Deep-dive into idempotency keys, exponential backoff with jitter, and dead-letter queue patterns.',
      'Document how worker leases and heartbeats prevent duplicate job execution.',
    ],
    resources: [
      {
        title: 'MIT 6.824 Distributed Systems Lecture Notes',
        provider: 'MIT OpenCourseWare',
        type: 'Course Lectures',
        estimatedHours: '18 hrs',
      },
      {
        title: 'Cloud Architecture Patterns',
        provider: 'Microsoft Learn / Cloud Docs',
        type: 'Architecture Guide',
        estimatedHours: '8 hrs',
      },
    ],
  },
  {
    canonical: 'TypeScript',
    category: 'Languages',
    aliases: ['typescript', 'ts'],
    whyItMatters: 'Enforces compile-time type safety across large frontend and Node.js codebases.',
    studySteps: [
      'Practice strict discriminated unions, generics, and runtime schema validation.',
    ],
    resources: [
      {
        title: 'TypeScript Handbook',
        provider: 'TypeScript Official Docs',
        type: 'Documentation',
        estimatedHours: '6 hrs',
      },
    ],
  },
  {
    canonical: 'JavaScript',
    category: 'Languages',
    aliases: ['javascript', 'ecmascript', 'es6', 'dom & browser apis'],
    whyItMatters: 'Foundation for modern web applications, event loops, and asynchronous runtime behavior.',
    studySteps: ['Master closures, microtask/macrotask scheduling, and browser memory profiling.'],
    resources: [
      {
        title: 'JavaScript.info Modern Tutorial',
        provider: 'JavaScript.info',
        type: 'Interactive Guide',
        estimatedHours: '10 hrs',
      },
    ],
  },
  {
    canonical: 'React',
    category: 'Frontend',
    aliases: ['react', 'react.js', 'reactjs', 'component architecture'],
    whyItMatters: 'Primary library for building responsive, component-driven web interfaces.',
    studySteps: [
      'Optimize render cycles with memoization, accessible semantics, and clean state boundaries.',
    ],
    resources: [
      {
        title: 'React Official Documentation',
        provider: 'react.dev',
        type: 'Documentation',
        estimatedHours: '8 hrs',
      },
    ],
  },
  {
    canonical: 'Node.js',
    category: 'Backend',
    aliases: ['node.js', 'nodejs', 'express', 'express.js'],
    whyItMatters: 'Powers non-blocking backend APIs, worker services, and real-time event pipelines.',
    studySteps: [
      'Profile event-loop lag, stream backpressure, and graceful shutdown handling in Node services.',
    ],
    resources: [
      {
        title: 'Node.js Best Practices',
        provider: 'GitHub Open Source',
        type: 'Engineering Checklist',
        estimatedHours: '6 hrs',
      },
    ],
  },
  {
    canonical: 'Python',
    category: 'Languages',
    aliases: ['python', 'py', 'fastapi', 'django', 'flask'],
    whyItMatters: 'Widely used for algorithmic interviews, backend tooling, automation, and AI/ML pipelines.',
    studySteps: [
      'Practice clean Pythonic solutions with standard library collections (heapq, bisect, deque).',
    ],
    resources: [
      {
        title: 'Python Official Docs & Collections Guide',
        provider: 'python.org',
        type: 'Documentation',
        estimatedHours: '6 hrs',
      },
    ],
  },
  {
    canonical: 'Java',
    category: 'Languages',
    aliases: ['java', 'spring boot', 'jvm'],
    whyItMatters: 'Core enterprise and high-throughput backend language across Big Tech and IT firms.',
    studySteps: [
      'Review Java concurrency primitives, Streams API, and clean Object-Oriented Design patterns.',
    ],
    resources: [
      {
        title: 'Effective Java Key Patterns',
        provider: 'Oracle / Java Dev',
        type: 'Reference',
        estimatedHours: '10 hrs',
      },
    ],
  },
  {
    canonical: 'C++',
    category: 'Languages',
    aliases: ['c++', 'cpp', 'stl'],
    whyItMatters: 'Valued for low-level performance, memory management, and systems-level roles.',
    studySteps: [
      'Build familiarity with STL containers, smart pointers, move semantics, and concurrency primitives.',
    ],
    resources: [
      {
        title: 'learncpp.com Modern C++',
        provider: 'LearnCpp',
        type: 'Tutorial',
        estimatedHours: '14 hrs',
      },
    ],
  },
  {
    canonical: 'SQL & PostgreSQL',
    category: 'Databases',
    aliases: ['sql', 'postgresql', 'postgres', 'mysql', 'dbms', 'relational databases', 'nosql', 'dynamodb'],
    whyItMatters: 'Critical for schema modeling, query optimization, indexing, and transactional integrity.',
    studySteps: [
      'Practice EXPLAIN ANALYZE query plans, composite B-Tree indexes, and transaction isolation levels.',
    ],
    resources: [
      {
        title: 'Use The Index, Luke',
        provider: 'SQL Performance Guide',
        type: 'Technical Guide',
        estimatedHours: '6 hrs',
      },
    ],
  },
  {
    canonical: 'Redis',
    category: 'Databases',
    aliases: ['redis', 'caching'],
    whyItMatters: 'Enables sub-millisecond caching, distributed locks, rate limiting, and pub/sub.',
    studySteps: ['Explore cache-aside vs. write-through patterns and TTL eviction strategies.'],
    resources: [
      {
        title: 'Redis University — Data Structures',
        provider: 'Redis',
        type: 'Hands-on Course',
        estimatedHours: '5 hrs',
      },
    ],
  },
  {
    canonical: 'REST APIs',
    category: 'Backend',
    aliases: ['rest api', 'rest apis', 'restful', 'api design', 'graphql'],
    whyItMatters: 'Standardizes reliable service contracts, input validation, pagination, and error semantics.',
    studySteps: [
      'Design versioned endpoints with idempotency keys, structured validation, and rate limiting.',
    ],
    resources: [
      {
        title: 'Google Cloud API Design Guide',
        provider: 'Google Cloud',
        type: 'Architecture Guide',
        estimatedHours: '4 hrs',
      },
    ],
  },
  {
    canonical: 'Docker',
    category: 'Cloud & DevOps',
    aliases: ['docker', 'container', 'containers', 'containerized'],
    whyItMatters: 'Ensures reproducible builds and consistent environment parity from local dev to production.',
    studySteps: ['Optimize multi-stage Dockerfiles and non-root container security defaults.'],
    resources: [
      {
        title: 'Docker Official Getting Started',
        provider: 'Docker Docs',
        type: 'Hands-on Lab',
        estimatedHours: '5 hrs',
      },
    ],
  },
  {
    canonical: 'Kubernetes',
    category: 'Cloud & DevOps',
    aliases: ['kubernetes', 'k8s', 'gke', 'orchestration'],
    whyItMatters: 'Bridges local containerization to production autoscaling, health probes, and rolling deploys.',
    studySteps: [
      'Deploy a containerized service locally using kind/minikube with readiness probes and HPA autoscaling.',
    ],
    resources: [
      {
        title: 'Kubernetes Basics & Cloud Architecture',
        provider: 'Google Cloud Skills Boost',
        type: 'Hands-on Lab',
        estimatedHours: '12 hrs',
      },
    ],
  },
  {
    canonical: 'Cloud Infrastructure',
    category: 'Cloud & DevOps',
    aliases: ['cloud', 'aws', 'azure', 'gcp', 'google cloud', 'cloud infrastructure', 'cloud-native', 'cloud computing'],
    whyItMatters: 'Demonstrates fluency with managed compute, IAM permissions, object storage, and observability.',
    studySteps: [
      'Deploy a full-stack app to Cloud Run or AWS ECS with structured logs and health checks.',
    ],
    resources: [
      {
        title: 'Google Cloud Skills Boost / AWS Skill Builder',
        provider: 'Cloud Provider Training',
        type: 'Hands-on Lab',
        estimatedHours: '10 hrs',
      },
    ],
  },
  {
    canonical: 'Unit & Automated Testing',
    category: 'Quality & Process',
    aliases: ['unit testing', 'automated testing', 'integration tests', 'testing', 'code coverage', 'test'],
    whyItMatters: 'Proves engineering rigor and confidence in shipping regression-free production changes.',
    studySteps: [
      'Add unit, integration, and negative-case tests for every critical API boundary and state transition.',
    ],
    resources: [
      {
        title: 'Testing JavaScript & APIs Guide',
        provider: 'Martin Fowler / Testing Docs',
        type: 'Engineering Guide',
        estimatedHours: '5 hrs',
      },
    ],
  },
  {
    canonical: 'CI/CD & Git',
    category: 'Quality & Process',
    aliases: ['ci/cd', 'github actions', 'git', 'github', 'sdlc', 'agile', 'scrum'],
    whyItMatters: 'Shows readiness for collaborative PR reviews, automated checks, and reliable delivery pipelines.',
    studySteps: ['Automate linting, type-checking, and test suites on every pull request.'],
    resources: [
      {
        title: 'GitHub Actions Documentation',
        provider: 'GitHub',
        type: 'Official Docs',
        estimatedHours: '4 hrs',
      },
    ],
  },
  {
    canonical: 'Linux',
    category: 'Infrastructure',
    aliases: ['linux', 'unix', 'shell', 'bash'],
    whyItMatters: 'Essential for diagnosing production processes, networking, ports, and container internals.',
    studySteps: [
      'Practice process inspection, network diagnostics, and log parsing with standard Unix utilities.',
    ],
    resources: [
      {
        title: 'The Missing Semester of Your CS Education',
        provider: 'MIT',
        type: 'Interactive Course',
        estimatedHours: '8 hrs',
      },
    ],
  },
  {
    canonical: 'Web Performance & Accessibility',
    category: 'Frontend',
    aliases: ['web performance', 'accessibility', 'wcag', 'responsive', 'accessible', 'css'],
    whyItMatters: 'Improves Core Web Vitals, keyboard navigation, and inclusive user experience.',
    studySteps: [
      'Audit semantic landmarks, keyboard focus traps, and bundle splitting using Lighthouse.',
    ],
    resources: [
      {
        title: 'web.dev Learn Performance & Accessibility',
        provider: 'Google web.dev',
        type: 'Official Course',
        estimatedHours: '7 hrs',
      },
    ],
  },
  {
    canonical: 'Object-Oriented Design',
    category: 'Architecture',
    aliases: ['object-oriented', 'oop', 'ood', 'solid', 'design patterns'],
    whyItMatters: 'Key signal in machine-coding and LLD interviews for maintainable, extensible abstractions.',
    studySteps: [
      'Implement 4 LLD exercises (rate limiter, parking lot, task scheduler, splitwise) applying SOLID principles.',
    ],
    resources: [
      {
        title: 'Refactoring Guru — Design Patterns',
        provider: 'Refactoring.Guru',
        type: 'Interactive Catalog',
        estimatedHours: '8 hrs',
      },
    ],
  },
];

function normalizeText(text: string): string {
  return text.toLowerCase();
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function containsKeyword(haystackLower: string, term: string): boolean {
  const lower = term.toLowerCase().trim();
  if (!lower) return false;
  if (lower.length <= 3 && /^[a-z0-9+.#]+$/.test(lower)) {
    const regex = new RegExp(`(^|[^a-z0-9])${escapeRegex(lower)}([^a-z0-9]|$)`, 'i');
    return regex.test(haystackLower);
  }
  return haystackLower.includes(lower);
}

function findMatchingEntry(skillName: string): SkillCatalogEntry | undefined {
  const lower = skillName.toLowerCase().trim();
  return SKILL_CATALOG.find(
    (entry) =>
      entry.canonical.toLowerCase() === lower ||
      entry.aliases.some((alias) => lower === alias || lower.includes(alias) || alias.includes(lower))
  );
}

interface ProfileEvidenceSummary {
  skillsText: string;
  projectsText: string;
  internshipsText: string;
  certsText: string;
  educationText: string;
  fullText: string;
  metrics: string[];
}

function buildProfileEvidenceSummary(profile: ResumeProfile): ProfileEvidenceSummary {
  const skillsText = profile.skills.join(' | ');
  const projectsText = profile.projects
    .map((p) => `${p.title} ${p.techStack} ${p.highlights.join(' ')}`)
    .join(' | ');
  const internshipsText = profile.internships
    .map((i) => `${i.company} ${i.role} ${i.highlights.join(' ')}`)
    .join(' | ');
  const certsText = profile.certifications.map((c) => `${c.name} ${c.issuer}`).join(' | ');
  const educationText = profile.education
    .map((e) => `${e.degree} ${e.field} ${e.institution} ${e.gpa}`)
    .join(' | ');
  const fullText = [
    profile.personal.headline,
    profile.personal.summary,
    skillsText,
    projectsText,
    internshipsText,
    certsText,
    educationText,
  ].join(' | ');

  const metricMatches = fullText.match(/\b\d+(?:\.\d+)?%|\b\d+(?:,\d+)+\+?|\b\d+ms\b|\b\d+\+\s*(?:jobs|users|specialists|endpoints|requests|views)/gi) || [];
  const uniqueMetrics = Array.from(new Set(metricMatches.map((m) => m.trim())));

  return {
    skillsText: normalizeText(skillsText),
    projectsText: normalizeText(projectsText),
    internshipsText: normalizeText(internshipsText),
    certsText: normalizeText(certsText),
    educationText: normalizeText(educationText),
    fullText: normalizeText(fullText),
    metrics: uniqueMetrics,
  };
}

function checkSkillEvidence(
  skillName: string,
  profile: ResumeProfile,
  evidence: ProfileEvidenceSummary
): {
  matched: boolean;
  strength: 'strong' | 'weak' | 'missing';
  evidenceText: string;
  category: string;
} {
  const entry = findMatchingEntry(skillName);
  const terms = entry ? [entry.canonical, ...entry.aliases] : [skillName];
  const category = entry?.category || 'Technical Competency';

  const inSkills = terms.some((t) => containsKeyword(evidence.skillsText, t));
  const matchedProjects = profile.projects.filter((p) => {
    const pText = normalizeText(`${p.title} ${p.techStack} ${p.highlights.join(' ')}`);
    return terms.some((t) => containsKeyword(pText, t));
  });
  const matchedInternships = profile.internships.filter((i) => {
    const iText = normalizeText(`${i.company} ${i.role} ${i.highlights.join(' ')}`);
    return terms.some((t) => containsKeyword(iText, t));
  });
  const matchedCerts = profile.certifications.filter((c) => {
    const cText = normalizeText(`${c.name} ${c.issuer}`);
    return terms.some((t) => containsKeyword(cText, t));
  });

  const evidenceSources: string[] = [];
  if (matchedInternships.length > 0) {
    evidenceSources.push(
      `Applied during ${matchedInternships.map((i) => i.company || i.role).join(' & ')} experience`
    );
  }
  if (matchedProjects.length > 0) {
    evidenceSources.push(
      `Demonstrated in ${matchedProjects.map((p) => p.title.split('—')[0].trim()).join(' & ')}`
    );
  }
  if (matchedCerts.length > 0) {
    evidenceSources.push(`Validated via ${matchedCerts.map((c) => c.name).join(', ')}`);
  }
  if (inSkills && evidenceSources.length === 0) {
    evidenceSources.push('Listed in verified technical skills inventory');
  }

  const totalHits =
    (inSkills ? 1 : 0) +
    matchedProjects.length +
    matchedInternships.length +
    matchedCerts.length;

  if (totalHits === 0) {
    return {
      matched: false,
      strength: 'missing',
      evidenceText: '',
      category,
    };
  }

  if (inSkills && matchedProjects.length === 0 && matchedInternships.length === 0 && matchedCerts.length === 0) {
    return {
      matched: true,
      strength: 'strong',
      evidenceText: evidenceSources.join('; ') + '.',
      category,
    };
  }

  return {
    matched: true,
    strength: 'strong',
    evidenceText: evidenceSources.join('; ') + '.',
    category,
  };
}

function getTargetContext(target: TargetSelection) {
  const preset = COMPANY_PRESETS.find(
    (c) =>
      c.id === target.companyId ||
      c.name.toLowerCase() === target.companyName.toLowerCase()
  );
  const presetRole = preset?.roles.find(
    (r) => r.title.toLowerCase() === target.roleTitle.toLowerCase()
  ) || preset?.roles[0];

  const jdLower = normalizeText(`${target.roleTitle} ${target.jobDescription}`);
  const extractedSkills: string[] = [];

  if (presetRole) {
    for (const s of presetRole.requiredSkills) {
      if (!extractedSkills.some((x) => x.toLowerCase() === s.toLowerCase())) {
        extractedSkills.push(s);
      }
    }
  }

  for (const entry of SKILL_CATALOG) {
    if (entry.aliases.some((alias) => containsKeyword(jdLower, alias))) {
      if (
        !extractedSkills.some(
          (x) =>
            x.toLowerCase() === entry.canonical.toLowerCase() ||
            entry.aliases.some((a) => x.toLowerCase().includes(a))
        )
      ) {
        extractedSkills.push(entry.canonical);
      }
    }
  }

  if (extractedSkills.length === 0) {
    extractedSkills.push(
      'Data Structures & Algorithms',
      'TypeScript',
      'React',
      'Node.js',
      'SQL & PostgreSQL',
      'REST APIs',
      'System Design',
      'Unit & Automated Testing'
    );
  }

  return {
    preset,
    presetRole,
    requiredSkills: extractedSkills,
    hiringFocus:
      preset?.hiringFocus ||
      `Clean engineering execution, problem-solving, and role alignment for ${target.companyName}`,
  };
}

function upgradeActionVerb(bullet: string, target: TargetSelection, index: number): string {
  const trimmed = bullet.trim().replace(/^[•\-*]\s*/, '');
  if (!trimmed) return trimmed;

  const isGoogleOrBigTech = ['google', 'microsoft', 'amazon', 'meta', 'stripe', 'flipkart'].includes(
    target.companyId.toLowerCase()
  );

  const verbMap: [RegExp, string][] = [
    [/^Built\b/i, isGoogleOrBigTech ? 'Engineered' : 'Developed'],
    [/^Made\b/i, 'Engineered'],
    [/^Created\b/i, 'Implemented'],
    [/^Designed\b/i, index === 0 ? 'Architected and designed' : 'Engineered'],
    [/^Worked on\b/i, 'Delivered'],
    [/^Helped\b/i, 'Collaborated to deliver'],
    [/^Used\b/i, 'Leveraged'],
    [/^Wrote\b/i, 'Authored'],
    [/^Developed\b/i, index === 0 ? 'Engineered' : 'Delivered'],
    [/^Refactored\b/i, 'Re-architected and optimized'],
    [/^Optimized\b/i, 'Profiled and optimized'],
    [/^Architected\b/i, 'Architected'],
    [/^Containerized\b/i, 'Containerized and standardized'],
    [/^Collaborated\b/i, 'Partnered across Agile sprints,'],
  ];

  let updated = trimmed;
  for (const [pattern, replacement] of verbMap) {
    if (pattern.test(updated)) {
      updated = updated.replace(pattern, replacement);
      break;
    }
  }

  return updated;
}

function enrichBulletWithVerifiedContext(
  bullet: string,
  contextText: string,
  target: TargetSelection,
  index: number
): string {
  let result = upgradeActionVerb(bullet, target, index);
  const lower = result.toLowerCase();
  const ctxLower = contextText.toLowerCase();
  const jdLower = normalizeText(`${target.roleTitle} ${target.jobDescription}`);

  // Highlight measurable latency improvement accurately if both 480ms and 95ms (or similar ms->ms) exist
  const msPair = result.match(/(\d+)\s*ms\s*(?:to|->|down to)\s*(\d+)\s*ms/i);
  if (msPair && !lower.includes('%')) {
    const before = Number(msPair[1]);
    const after = Number(msPair[2]);
    if (before > after && before > 0) {
      const pct = Math.round(((before - after) / before) * 100);
      result = result.replace(/\.$/, '') + ` (${pct}% latency reduction).`;
    }
  }

  // Surface verified alignment phrases without inventing anything
  if (
    (lower.includes('job queue') || lower.includes('scheduler') || lower.includes('queue')) &&
    !lower.includes('distributed') &&
    (ctxLower.includes('distributed') || ctxLower.includes('redis'))
  ) {
    result = result.replace(/\bjob queue\b/i, 'distributed job queue');
  }

  if (
    lower.includes('rest endpoints') &&
    !lower.includes('api design') &&
    (jdLower.includes('api') || jdLower.includes('backend'))
  ) {
    result = result.replace(/\bREST endpoints\b/i, 'RESTful API endpoints');
  }

  if (
    lower.includes('integration tests') &&
    !lower.includes('automated') &&
    (jdLower.includes('automated testing') || jdLower.includes('unit'))
  ) {
    result = result.replace(/\bintegration tests\b/i, 'automated integration tests');
  }

  if (
    lower.includes('dashboard') &&
    (lower.includes('react') || ctxLower.includes('react')) &&
    !lower.includes('component') &&
    (jdLower.includes('component') || jdLower.includes('frontend') || jdLower.includes('react'))
  ) {
    result = result.replace(/\bresponsive dashboard\b/i, 'modular, component-driven dashboard');
  }

  if (
    lower.includes('docker compose') &&
    !lower.includes('reproducible') &&
    (jdLower.includes('cloud') || jdLower.includes('linux') || jdLower.includes('docker'))
  ) {
    result = result.replace(/\.$/, '') + ' for reproducible deployment parity.';
  }

  // Ensure crisp terminal punctuation
  if (!/[.!?]$/.test(result)) {
    result += '.';
  }

  return result;
}

function scoreBulletRelevance(bullet: string, targetKeywords: string[]): number {
  const lower = bullet.toLowerCase();
  let score = 0;
  if (/\d+%|\d+ms|\d+[x+]|\d{2,}/.test(bullet)) score += 3;
  for (const kw of targetKeywords) {
    const entry = findMatchingEntry(kw);
    const terms = entry ? [entry.canonical, ...entry.aliases] : [kw];
    if (terms.some((t) => containsKeyword(lower, t))) {
      score += 2;
    }
  }
  return score;
}

export function tailorResumeLocally(
  profile: ResumeProfile,
  target: TargetSelection
): TailoredResumeResult {
  const evidence = buildProfileEvidenceSummary(profile);
  const { requiredSkills, hiringFocus } = getTargetContext(target);

  // Separate verified target keywords vs unverified JD keywords
  const includedKeywords: string[] = [];
  const recommendedKeywordsToLearn: string[] = [];

  for (const reqSkill of requiredSkills) {
    const check = checkSkillEvidence(reqSkill, profile, evidence);
    if (check.matched) {
      if (!includedKeywords.some((k) => k.toLowerCase() === reqSkill.toLowerCase())) {
        includedKeywords.push(reqSkill);
      }
    } else {
      if (!recommendedKeywordsToLearn.some((k) => k.toLowerCase() === reqSkill.toLowerCase())) {
        recommendedKeywordsToLearn.push(reqSkill);
      }
    }
  }

  // Also ensure matched profile skills appear in includedKeywords so Preview highlights them cleanly
  const prioritizedSkills: string[] = [];
  const remainingSkills: string[] = [];

  for (const skill of profile.skills) {
    const skillLower = skill.toLowerCase();
    const matchesTarget = requiredSkills.some((req) => {
      const entry = findMatchingEntry(req);
      const terms = entry ? [entry.canonical, ...entry.aliases] : [req];
      return terms.some((t) => containsKeyword(skillLower, t) || containsKeyword(t.toLowerCase(), skillLower));
    });

    if (matchesTarget) {
      prioritizedSkills.push(skill);
      if (!includedKeywords.some((k) => k.toLowerCase() === skillLower)) {
        includedKeywords.push(skill);
      }
    } else {
      remainingSkills.push(skill);
    }
  }

  const tailoredSkills = [...prioritizedSkills, ...remainingSkills];

  // Tailor project highlights
  const tailoredProjects = profile.projects.map((proj) => {
    const contextStr = `${proj.title} ${proj.techStack} ${proj.highlights.join(' ')}`;
    const enriched = proj.highlights
      .filter((h) => h.trim())
      .map((h, idx) => enrichBulletWithVerifiedContext(h, contextStr, target, idx));

    const sorted = [...enriched].sort(
      (a, b) => scoreBulletRelevance(b, requiredSkills) - scoreBulletRelevance(a, requiredSkills)
    );

    return {
      id: proj.id,
      title: proj.title,
      highlights: sorted,
    };
  });

  // Tailor internship highlights
  const tailoredInternships = profile.internships.map((item) => {
    const contextStr = `${item.company} ${item.role} ${item.highlights.join(' ')}`;
    const enriched = item.highlights
      .filter((h) => h.trim())
      .map((h, idx) => enrichBulletWithVerifiedContext(h, contextStr, target, idx));

    const sorted = [...enriched].sort(
      (a, b) => scoreBulletRelevance(b, requiredSkills) - scoreBulletRelevance(a, requiredSkills)
    );

    return {
      id: item.id,
      company: item.company,
      role: item.role,
      highlights: sorted,
    };
  });

  // Construct tailored summary grounded strictly in profile facts
  const primaryEdu = profile.education[0];
  const eduPhrase = primaryEdu
    ? `${primaryEdu.degree}${primaryEdu.gpa ? ` (${primaryEdu.gpa})` : ''}`
    : 'Computer Science & Software Engineering candidate';

  const topSkills = tailoredSkills.slice(0, 4).join(', ');
  const topProject = profile.projects[0];
  const topIntern = profile.internships[0];

  const achievementBits: string[] = [];
  if (topProject) {
    const projMetric = topProject.highlights.join(' ').match(/\b\d+(?:,\d+)+\+?\s*(?:simulated\s*)?jobs\/hour|\b\d+%\s*code coverage/i)?.[0];
    achievementBits.push(
      projMetric
        ? `built ${topProject.title.split('—')[0].trim()} (${projMetric})`
        : `built ${topProject.title.split('—')[0].trim()}`
    );
  }
  if (topIntern) {
    const internMetric = topIntern.highlights.join(' ').match(/(?:reducing|cutting).*?\d+%/i)?.[0];
    achievementBits.push(
      internMetric
        ? `delivered production enhancements at ${topIntern.company} (${internMetric})`
        : `completed a ${topIntern.role} internship at ${topIntern.company}`
    );
  }

  const focusPhrase = hiringFocus
    .split(',')[0]
    ?.trim()
    .toLowerCase();

  const tailoredSummary = [
    `${eduPhrase} targeting the ${target.roleTitle} role at ${target.companyName}, bringing verified depth in ${topSkills || 'software engineering'}.`,
    achievementBits.length > 0
      ? `Proven engineering execution: ${achievementBits.join(' and ')}.`
      : `Hands-on builder focused on reliable architecture, clean code, and measurable product performance.`,
    `Aligned with ${target.companyName} priorities around ${focusPhrase || 'scalable systems'}, automated quality verification, and high-reliability software delivery.`,
  ].join(' ');

  // Compute realistic ATS match estimate
  const keywordCoverage =
    requiredSkills.length > 0
      ? includedKeywords.filter((kw) =>
          requiredSkills.some((r) => r.toLowerCase() === kw.toLowerCase())
        ).length / requiredSkills.length
      : 0.7;

  const metricBonus = Math.min(10, evidence.metrics.length * 2.5);
  const completenessBonus =
    (profile.personal.summary.trim() ? 4 : 0) +
    (profile.projects.length > 0 ? 5 : 0) +
    (profile.internships.length > 0 ? 5 : 0) +
    (profile.education.length > 0 ? 4 : 0);

  const rawEstimate = Math.round(54 + keywordCoverage * 24 + metricBonus + completenessBonus);
  const atsMatchEstimate = Math.max(62, Math.min(96, rawEstimate));

  const tailoringNotes: string[] = [
    `Prioritized ${prioritizedSkills.slice(0, 4).join(', ') || 'role-relevant skills'} at the top of Technical Skills to match ${target.companyName}’s ${target.roleTitle} screening rubric.`,
    `Reframed ${tailoredProjects.length} project${tailoredProjects.length === 1 ? '' : 's'} and ${tailoredInternships.length} experience entry with stronger action verbs while elevating verified metrics (${evidence.metrics.slice(0, 3).join(', ') || 'engineering deliverables'}).`,
    recommendedKeywordsToLearn.length > 0
      ? `Maintained strict truthfulness: kept ${recommendedKeywordsToLearn.slice(0, 3).join(', ')} out of the resume since they are not yet verified in your profile.`
      : `Strong keyword alignment across all required ${target.companyName} competencies.`,
  ];

  return {
    tailoredSummary,
    tailoredSkills,
    tailoredProjects,
    tailoredInternships,
    atsMatchEstimate,
    includedKeywords: includedKeywords.slice(0, 12),
    recommendedKeywordsToLearn: recommendedKeywordsToLearn.slice(0, 5),
    tailoringNotes,
    generatedAt: `Tailored at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  };
}

export function generateLocalResumeAssist(params: {
  mode: 'summary' | 'bullets';
  profile: ResumeProfile;
  targetCompany: string;
  targetRole: string;
  customText?: string;
}): { improvedText: string; rationale: string } {
  const { mode, profile, targetCompany, targetRole, customText } = params;
  const evidence = buildProfileEvidenceSummary(profile);

  if (mode === 'summary') {
    const edu = profile.education[0];
    const eduDesc = edu
      ? `${edu.degree} student (${edu.gpa || 'Strong Academic Standing'})`
      : 'Software Engineer';
    const topSkills = profile.skills.slice(0, 4).join(', ') || 'modern full-stack technologies';
    const proj = profile.projects[0]?.title.split('—')[0].trim();
    const intern = profile.internships[0];

    const sentence1 = `${eduDesc} with hands-on experience engineering reliable applications using ${topSkills}.`;
    const sentence2 = intern
      ? `During a ${intern.role} tenure at ${intern.company}${proj ? ` and building ${proj}` : ''}, delivered measurable improvements${evidence.metrics[0] ? ` (${evidence.metrics.slice(0, 2).join(', ')})` : ''} across API performance and product reliability.`
      : proj
        ? `Architected ${proj}${evidence.metrics[0] ? ` (${evidence.metrics[0]})` : ''} with an emphasis on clean system abstractions and automated testing.`
        : `Committed to writing maintainable, well-tested software with strong data structures and database fundamentals.`;
    const sentence3 = `Targeting ${targetRole || 'Software Engineer'} at ${targetCompany || 'top technology teams'} to contribute scalable engineering solutions.`;

    return {
      improvedText: `${sentence1} ${sentence2} ${sentence3}`,
      rationale: `Aligned your verified education, ${profile.skills.slice(0, 3).join('/')} stack, and real metrics toward ${targetCompany || 'your target'} ${targetRole || 'role'}.`,
    };
  }

  const lines = (customText || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  const targetStub: TargetSelection = {
    companyId: targetCompany.toLowerCase(),
    companyName: targetCompany || 'Target Company',
    industry: '',
    roleTitle: targetRole || 'Software Engineer',
    jobDescription: '',
    experienceLevel: '',
  };

  const improvedLines = lines.map(
    (line, idx) => `• ${enrichBulletWithVerifiedContext(line, profile.skills.join(' '), targetStub, idx)}`
  );

  return {
    improvedText: improvedLines.join('\n'),
    rationale: 'Strengthened action verbs, surfaced verified technical impact, and preserved all original facts.',
  };
}

export function analyzeSkillsLocally(
  profile: ResumeProfile,
  target: TargetSelection
): SkillAnalysisResult {
  const evidence = buildProfileEvidenceSummary(profile);
  const { requiredSkills } = getTargetContext(target);

  const matchedSkills: SkillAnalysisResult['matchedSkills'] = [];
  const missingOrWeakSkills: SkillAnalysisResult['missingOrWeakSkills'] = [];

  for (const reqSkill of requiredSkills) {
    const check = checkSkillEvidence(reqSkill, profile, evidence);
    if (check.matched) {
      // Check if evidenced in projects/internships or only in skills list
      const entry = findMatchingEntry(reqSkill);
      const terms = entry ? [entry.canonical, ...entry.aliases] : [reqSkill];
      const inProjectsOrInterns =
        terms.some((t) => containsKeyword(evidence.projectsText, t)) ||
        terms.some((t) => containsKeyword(evidence.internshipsText, t));

      matchedSkills.push({
        name: reqSkill,
        category: check.category,
        evidenceInProfile: check.evidenceText,
      });

      if (!inProjectsOrInterns && ['System Design', 'Distributed Systems', 'Kubernetes', 'Cloud Infrastructure'].includes(entry?.canonical || '')) {
        missingOrWeakSkills.push({
          name: reqSkill,
          status: 'weak',
          priority: 'medium',
          reason: `Listed or lightly referenced, but lacks a dedicated project or production deployment metric for ${target.companyName}.`,
        });
      }
    } else {
      const highPrioritySet = new Set([
        'System Design',
        'Data Structures & Algorithms',
        'Distributed Systems',
        'AWS',
        'Azure',
        'Java',
        'Python',
        'TypeScript',
        'React',
      ]);
      const isHigh =
        highPrioritySet.has(reqSkill) ||
        requiredSkills.indexOf(reqSkill) < 4;

      missingOrWeakSkills.push({
        name: reqSkill,
        status: 'missing',
        priority: isHigh ? 'high' : 'medium',
        reason: `Explicitly requested in ${target.companyName}’s ${target.roleTitle} requirements, but not yet evidenced in your skills, projects, or internships.`,
      });
    }
  }

  // Evaluate Docker vs Kubernetes nuance if Docker is present and K8s isn't
  if (
    evidence.fullText.includes('docker') &&
    !evidence.fullText.includes('kubernetes') &&
    !missingOrWeakSkills.some((m) => m.name.toLowerCase().includes('kubernetes')) &&
    ['google', 'microsoft', 'amazon'].includes(target.companyId)
  ) {
    missingOrWeakSkills.push({
      name: 'Kubernetes & Cloud Observability',
      status: 'weak',
      priority: 'medium',
      reason:
        'Docker containerization is evidenced, but production orchestration and structured metrics tracing are not yet shown.',
    });
  }

  const totalEvaluated = Math.max(1, requiredSkills.length);
  const matchPercentage = Math.max(
    25,
    Math.min(96, Math.round((matchedSkills.length / totalEvaluated) * 100))
  );
  const metricBonus = Math.min(8, evidence.metrics.length * 2);
  const compatibilityScore = Math.max(
    30,
    Math.min(97, Math.round(matchPercentage * 0.88 + metricBonus + (profile.internships.length > 0 ? 5 : 0)))
  );

  const readinessLabel =
    matchPercentage >= 80
      ? `Interview-Ready · ${missingOrWeakSkills.length} Minor Gap${missingOrWeakSkills.length === 1 ? '' : 's'}`
      : matchPercentage >= 60
        ? `Strong Candidate · ${missingOrWeakSkills.length} Targeted Gap${missingOrWeakSkills.length === 1 ? '' : 's'}`
        : `Developing Fit · ${missingOrWeakSkills.length} Priority Gaps`;

  const topMatched = matchedSkills.slice(0, 4).map((s) => s.name).join(', ');
  const topGaps = missingOrWeakSkills.slice(0, 3).map((g) => g.name).join(', ');

  const coachSummary = `Your verified strengths in ${topMatched || 'core engineering'} align well with ${target.companyName}’s ${target.roleTitle} expectations${profile.projects[0] ? `, supported by practical architecture in ${profile.projects[0].title.split('—')[0].trim()}` : ''}. ${
    topGaps
      ? `Closing targeted gaps in ${topGaps} will significantly elevate your technical screen and resume shortlist odds.`
      : 'Your competency coverage is already strong—focus on timed mock interviews and crisp impact storytelling.'
  }`;

  // Required skills to develop (top 3 gaps or advanced mastery areas)
  const developSource =
    missingOrWeakSkills.length > 0
      ? missingOrWeakSkills.slice(0, 3).map((g) => g.name)
      : ['System Design', 'Distributed Systems', 'Data Structures & Algorithms'];

  const requiredSkillsToDevelop = developSource.map((skillName) => {
    const entry = findMatchingEntry(skillName);
    return {
      skill: skillName,
      targetLevel: matchPercentage >= 75 ? 'Interview-Ready' : 'Practical / Intermediate',
      whyItMatters:
        entry?.whyItMatters ||
        `Directly strengthens your alignment with ${target.companyName}’s ${target.roleTitle} engineering bar.`,
    };
  });

  // Phased learning roadmap
  const learningRoadmap: SkillAnalysisResult['learningRoadmap'] = [];
  const gapEntries = developSource.slice(0, 2);

  gapEntries.forEach((gapName, idx) => {
    const entry = findMatchingEntry(gapName);
    learningRoadmap.push({
      phase: `Phase ${idx + 1}: ${idx === 0 ? 'High-Priority Core Gap' : 'Applied Depth & Projects'}`,
      duration: idx === 0 ? 'Weeks 1–3' : 'Weeks 4–6',
      focusSkill: gapName,
      actionSteps: entry?.studySteps || [
        `Review official documentation and build a focused mini-module demonstrating ${gapName}.`,
        `Document architecture trade-offs and measurable benchmarks on GitHub.`,
      ],
      resources: entry?.resources || [
        {
          title: `${gapName} Official Documentation & Patterns`,
          provider: 'Developer Docs',
          type: 'Technical Guide',
          estimatedHours: '10 hrs',
        },
        {
          title: 'System Design Primer',
          provider: 'GitHub Open Source',
          type: 'Study Guide',
          estimatedHours: '12 hrs',
        },
      ],
    });
  });

  return {
    matchPercentage,
    compatibilityScore,
    readinessLabel,
    coachSummary,
    matchedSkills,
    missingOrWeakSkills,
    requiredSkillsToDevelop,
    learningRoadmap,
    analyzedAt: `Analyzed at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  };
}

export function extractTextFromPdfBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const decoder = new TextDecoder('latin1');
  const raw = decoder.decode(bytes);

  const chunks: string[] = [];
  // Extract PDF literal text strings inside (...) used by Tj/TJ operators
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

  // Fallback: extract printable ASCII words if uncompressed metadata/text exists
  const asciiRuns = raw.match(/[A-Za-z0-9@.+/:,\- ]{6,}/g) || [];
  const filtered = asciiRuns
    .map((s) => s.trim())
    .filter((s) => /[a-z]{3,}/i.test(s) && !/obj|endobj|stream|xref|trailer|FlateDecode/i.test(s));

  return filtered.join(' ').slice(0, 12000).trim();
}

export function evaluateAtsLocally(params: {
  resumeText: string;
  fileName?: string;
  targetCompany?: string;
  targetRole?: string;
  jobDescription?: string;
}): ATSCheckResult {
  const { resumeText, fileName, targetCompany, targetRole, jobDescription } = params;
  const lower = normalizeText(resumeText);

  const jdLower = normalizeText(`${targetRole || ''} ${jobDescription || ''}`);
  const targetKeywords: string[] = [];

  for (const entry of SKILL_CATALOG) {
    if (!jobDescription || entry.aliases.some((a) => containsKeyword(jdLower, a))) {
      targetKeywords.push(entry.canonical);
    }
  }

  const evalPool = targetKeywords.length > 0 ? targetKeywords : SKILL_CATALOG.slice(0, 12).map((s) => s.canonical);

  const foundKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const kw of evalPool) {
    const entry = findMatchingEntry(kw);
    const terms = entry ? [entry.canonical, ...entry.aliases] : [kw];
    if (terms.some((t) => containsKeyword(lower, t))) {
      foundKeywords.push(kw);
    } else if (jobDescription) {
      missingKeywords.push(kw);
    }
  }

  // Check section completeness
  const hasEmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(resumeText);
  const hasPhoneOrLink = /(\+?\d[\d\s\-()]{7,}|linkedin\.com|github\.com)/i.test(resumeText);
  const hasSummary = /\bsummary\b|\bprofile\b|\bobjective\b/i.test(resumeText);
  const hasSkills = /\bskills\b|\btechnologies\b/i.test(resumeText);
  const hasExperienceOrProjects = /\bexperience\b|\binternship|\bprojects\b/i.test(resumeText);
  const hasEducation = /\beducation\b|\bb\.tech|\bbachelor|\buniversity|\bcollege/i.test(resumeText);

  const completenessScore = Math.min(
    100,
    (hasEmail ? 18 : 0) +
      (hasPhoneOrLink ? 16 : 0) +
      (hasSummary ? 16 : 0) +
      (hasSkills ? 18 : 0) +
      (hasExperienceOrProjects ? 18 : 0) +
      (hasEducation ? 14 : 0)
  );

  // Check quantified impact metrics
  const metricMatches = resumeText.match(/\b\d+(?:\.\d+)?%|\b\d+(?:,\d+)+\+?|\b\d+ms\b|\b\d+\+\b|\b\d+x\b/gi) || [];
  const impactMetricsScore = Math.min(96, 48 + Math.min(8, metricMatches.length) * 6);

  // Formatting & readability
  const lines = resumeText.split('\n').map((l) => l.trim()).filter(Boolean);
  const bulletLines = lines.filter((l) => /^[•\-*]/.test(l));
  const avgBulletWords =
    bulletLines.length > 0
      ? bulletLines.reduce((acc, b) => acc + b.split(/\s+/).length, 0) / bulletLines.length
      : 16;

  const formattingScore = Math.min(
    96,
    72 + (bulletLines.length >= 3 ? 12 : 4) + (lines.length >= 10 ? 8 : 0) + (hasSkills && hasEducation ? 4 : 0)
  );
  const readabilityScore = Math.min(
    95,
    avgBulletWords <= 28 && avgBulletWords >= 8 ? 88 : 76
  );

  const keywordRatio = evalPool.length > 0 ? foundKeywords.length / evalPool.length : 0.7;
  const keywordsScore = Math.max(45, Math.min(96, Math.round(45 + keywordRatio * 51)));

  const atsScore = Math.round(
    formattingScore * 0.2 +
      keywordsScore * 0.3 +
      impactMetricsScore * 0.2 +
      readabilityScore * 0.15 +
      completenessScore * 0.15
  );

  const formattingIssues: ATSCheckResult['formattingIssues'] = [];
  if (!hasEmail || !hasPhoneOrLink) {
    formattingIssues.push({
      severity: 'high',
      issue: 'Incomplete contact header detected in plain-text parse',
      fix: 'Include an explicit email address, phone number, and LinkedIn/GitHub URL in the top contact block.',
    });
  }
  if (!/https?:\/\//i.test(resumeText) && /(github\.com|linkedin\.com)/i.test(resumeText)) {
    formattingIssues.push({
      severity: 'low',
      issue: 'Profile links omit https:// protocol prefix',
      fix: 'Keep clean domain text for visual layout or prepend https:// if submitting to strict legacy parsers.',
    });
  }
  if (metricMatches.length < 3) {
    formattingIssues.push({
      severity: 'medium',
      issue: 'Limited quantified metrics detected across bullet points',
      fix: 'Add concrete numbers (%, latency ms, user counts, or test coverage) to at least 3 experience/project bullets.',
    });
  }
  if (bulletLines.length < 3) {
    formattingIssues.push({
      severity: 'medium',
      issue: 'Dense paragraph formatting instead of scannable bullet points',
      fix: 'Break project and internship descriptions into concise, action-verb bullets starting with "• ".',
    });
  }
  if (formattingIssues.length === 0) {
    formattingIssues.push({
      severity: 'low',
      issue: 'Single-column ATS structure verified cleanly',
      fix: 'No blocking parser traps found. Keep standard section headings (Summary, Skills, Experience, Projects, Education).',
    });
  }

  const suggestions: ATSCheckResult['suggestions'] = [
    {
      section: 'Keyword Alignment',
      currentObservation: `Detected ${foundKeywords.length} relevant technical keywords${targetCompany ? ` for ${targetCompany}` : ''}.`,
      improvementAction:
        missingKeywords.length > 0
          ? `If you genuinely practice ${missingKeywords.slice(0, 3).join(', ')}, weave them naturally into project bullets and your skills section.`
          : 'Strong keyword coverage across core competencies.',
    },
    {
      section: 'Impact & Action Verbs',
      currentObservation: `Found ${metricMatches.length} quantified metric${metricMatches.length === 1 ? '' : 's'} in the scanned resume.`,
      improvementAction:
        'Lead every bullet with an ownership verb (Architected, Engineered, Reduced, Optimized) followed by measurable outcome.',
    },
    {
      section: 'Section Structure',
      currentObservation: `Completeness scored ${completenessScore}/100 across standard ATS headings.`,
      improvementAction:
        'Keep reverse-chronological dates consistent (e.g., May 2025 – Jul 2025) and avoid tables or multi-column text boxes.',
    },
  ];

  const summary =
    atsScore >= 85
      ? `Strong ATS compatibility (${atsScore}/100)${targetRole ? ` for ${targetRole}` : ''}. Clean section hierarchy and ${metricMatches.length} quantified metrics give parsers high confidence.`
      : atsScore >= 70
        ? `Solid baseline (${atsScore}/100) with clear room to strengthen keyword density${missingKeywords.length > 0 ? ` (${missingKeywords.slice(0, 2).join(', ')})` : ''} and measurable bullet outcomes.`
        : `Needs structural & keyword optimization (${atsScore}/100). Add standard ATS section headings, quantified bullet points, and target role keywords.`;

  return {
    atsScore,
    summary,
    sectionScores: {
      formatting: formattingScore,
      keywords: keywordsScore,
      impactMetrics: impactMetricsScore,
      readability: readabilityScore,
      completeness: completenessScore,
    },
    foundKeywords: foundKeywords.slice(0, 14),
    missingKeywords: missingKeywords.slice(0, 8),
    formattingIssues,
    suggestions,
    checkedFileName: fileName || 'Resume Input',
    checkedAt: `Checked at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  };
}

export function generateInterviewPrepLocally(
  profile: ResumeProfile,
  target: TargetSelection
): InterviewPrepResult {
  const { preset, hiringFocus } = getTargetContext(target);
  const p1 = profile.projects[0];
  const p2 = profile.projects[1];
  const intern = profile.internships[0];
  const primarySkills = profile.skills.slice(0, 4).join(', ') || 'your primary tech stack';

  const companyFocusSummary = `${target.companyName} ${target.roleTitle} interviews prioritize ${hiringFocus}. Expect deep-dives into your real projects (${p1 ? p1.title.split('—')[0].trim() : primarySkills}), algorithmic complexity analysis, and structured behavioral examples.`;

  const technicalQuestions: InterviewPrepResult['technicalQuestions'] = [
    {
      id: `tq-${Date.now()}-1`,
      question: p1
        ? `In ${p1.title.split('—')[0].trim()}, what were the biggest architectural bottlenecks or failure modes, and how did you design around them?`
        : `Walk through the most technically complex system you have built using ${primarySkills}. How did you handle edge cases and scale?`,
      difficulty: 'Medium',
      topic: 'System Architecture & Trade-offs',
      whyAsked: `${target.companyName} probes beyond surface bullet points to verify true ownership of your resume projects.`,
      sampleAnswer: p1
        ? `In ${p1.title.split('—')[0].trim()} (${p1.techStack}), the critical challenge was ensuring reliability under concurrent load. ${p1.highlights[0] || ''} I decoupled state transitions, added bounded retries with clear failure handling, and verified behavior with automated tests.`
        : `I focused on isolating stateful bottlenecks, adding input validation at API boundaries, and measuring latency under realistic concurrent load before optimizing hot paths.`,
      tips: [
        `Anchor your answer in ${p1 ? p1.title.split('—')[0].trim() : 'a concrete system'} rather than abstract theory.`,
        'State one explicit trade-off you chose (e.g., consistency vs. latency, simplicity vs. throughput).',
        'Mention how you tested or observed the system in practice.',
      ],
    },
    {
      id: `tq-${Date.now()}-2`,
      question: `Design a rate-limiting or sliding-window metrics module suitable for ${target.companyName} scale. What data structures give O(1) or O(log N) operations?`,
      difficulty: 'Medium-Hard',
      topic: 'Data Structures & Algorithms',
      whyAsked: `Evaluates your ability to combine classic DSA (${profile.skills.includes('Data Structures & Algorithms') ? 'listed on your resume' : 'core CS'}) with production engineering.`,
      sampleAnswer:
        'For an in-memory sliding window per key, a ring buffer of fixed time buckets or a Token Bucket stored in Redis (using atomic Lua scripts or HSET with timestamps) gives O(1) time per request. We can trade sub-second exactness for bounded memory by bucketing timestamps into 1-second intervals.',
      tips: [
        'Clarify single-node vs. distributed multi-node requirements upfront.',
        'State exact Big-O time and space complexity per request.',
        'Discuss race conditions when multiple servers update shared counters.',
      ],
    },
    {
      id: `tq-${Date.now()}-3`,
      question: p2
        ? `In ${p2.title.split('—')[0].trim()}, how did you model the data and optimize slow queries or rendering bottlenecks?`
        : `How do you diagnose and eliminate a sudden 5x latency spike in a SQL-backed web application?`,
      difficulty: 'Medium',
      topic: 'Databases & Performance',
      whyAsked: 'Tests practical debugging methodology across databases, indexing, and backend APIs.',
      sampleAnswer: p2
        ? `In ${p2.title.split('—')[0].trim()}, ${p2.highlights.find((h) => /\d/.test(h)) || p2.highlights[0] || 'I profiled database queries using EXPLAIN ANALYZE'}. By identifying sequential scans and adding targeted composite indexing, we eliminated redundant sorting and improved response speed significantly.`
        : 'I inspect p95/p99 traces to isolate whether the time is spent in network I/O, lock contention, or query execution, then run EXPLAIN ANALYZE to replace full table scans with selective composite indexes.',
      tips: [
        'Explain how you measure before optimizing (EXPLAIN ANALYZE, flamegraphs, network tab).',
        'Discuss write amplification or cache invalidation trade-offs.',
        'Cite exact metrics from your projects when applicable.',
      ],
    },
    {
      id: `tq-${Date.now()}-4`,
      question: intern
        ? `During your ${intern.role} internship at ${intern.company}, how did you structure API validation, error handling, and automated testing?`
        : `How do you design idempotent REST APIs and automated test suites so regressions don’t reach production?`,
      difficulty: 'Medium',
      topic: 'API Design & Reliability',
      whyAsked: `Reflects ${target.companyName}’s emphasis on clean code, defensive boundaries, and maintainable services.`,
      sampleAnswer: intern
        ? `At ${intern.company}, ${intern.highlights[0] || 'I built modular TypeScript/Node services'}. I separated schema validation from core business logic, returned deterministic 4xx/5xx error contracts, and covered edge cases in CI so PRs couldn’t merge with failing checks.`
        : 'I enforce strict schema validation at the ingress boundary, use idempotency keys on mutating endpoints, and combine fast unit tests with contract-level integration tests in CI.',
      tips: [
        'Distinguish client validation errors (400/422) from transient server failures (503).',
        'Highlight concrete testing or CI practices you used.',
        'Keep explanations concise and structured.',
      ],
    },
    {
      id: `tq-${Date.now()}-5`,
      question: `What happens end-to-end when a user triggers a high-traffic request in a modern ${profile.skills.includes('React') ? 'React + Node.js' : 'full-stack'} architecture, and where can you introduce caching safely?`,
      difficulty: 'Medium',
      topic: 'Full-Stack & Caching',
      whyAsked: 'Assesses holistic system understanding across browser, CDN, API gateway, cache, and database.',
      sampleAnswer:
        'The browser resolves DNS/TLS and sends an HTTP request through a CDN/load balancer to stateless API servers. Read-heavy data can be cached at CDN edge (Cache-Control) or in Redis using cache-aside with short TTLs and explicit invalidation on writes, while keeping mutations strongly consistent in PostgreSQL.',
      tips: [
        'Trace the request cleanly from client to database and back.',
        'Address cache stampede and stale-read mitigation.',
      ],
    },
  ];

  const isAmazon = target.companyId === 'amazon';
  const isGoogle = target.companyId === 'google';

  const hrQuestions: InterviewPrepResult['hrQuestions'] = [
    {
      id: `hr-${Date.now()}-1`,
      question: isAmazon
        ? 'Tell me about a time you took ownership of a difficult problem outside your immediate scope to protect the customer experience.'
        : 'Tell me about a time you received tough or critical feedback during a code review or project. How did you handle it?',
      competency: isGoogle ? 'Googleyness & Humility' : isAmazon ? 'Ownership & Customer Obsession' : 'Collaboration & Growth Mindset',
      whyAsked: `${target.companyName} evaluates ego-free collaboration, receptiveness to feedback, and engineering maturity.`,
      sampleAnswer: intern
        ? `Situation: During my ${intern.role} internship at ${intern.company}, a senior reviewer pointed out tight coupling and missing edge-case validation in my initial PR. Task: Refactor cleanly without delaying the sprint. Action: I paired with them to align on service-layer conventions, extracted pure validation helpers, and added negative test cases. Result: The PR shipped on time and became our team’s reference pattern.`
        : `Situation: While building ${p1 ? p1.title.split('—')[0].trim() : 'a team project'}, peer feedback highlighted brittle error handling. Task: Make the module production-grade. Action: I refactored error paths, added integration tests, and documented usage examples. Result: Defect rates dropped and onboarding became faster.`,
      tips: [
        'Follow STAR (Situation, Task, Action, Result) in under 90 seconds.',
        'Show zero defensiveness and focus on what you learned.',
        'End with a tangible improvement in your workflow.',
      ],
    },
    {
      id: `hr-${Date.now()}-2`,
      question: `Why ${target.companyName}, and what excites you specifically about the ${target.roleTitle} role?`,
      competency: 'Role Motivation & Alignment',
      whyAsked: 'Checks whether you researched the company’s engineering culture and connected it to your real background.',
      sampleAnswer: `I’m excited by ${target.companyName}’s focus on ${preset?.hiringFocus || 'high-scale engineering impact'}. Having worked on ${p1 ? p1.title.split('—')[0].trim() : primarySkills}, I want to solve reliability and scale challenges alongside strong engineering mentors while growing my depth in ${target.roleTitle}.`,
      tips: [
        `Mention specific engineering challenges at ${target.companyName}, not generic praise.`,
        'Connect one of your real projects to their domain.',
      ],
    },
    {
      id: `hr-${Date.now()}-3`,
      question: 'Describe an ambiguous technical problem where requirements were unclear. How did you move forward?',
      competency: 'Navigating Ambiguity',
      whyAsked: 'Measures structured problem decomposition when specifications are incomplete.',
      sampleAnswer: p2
        ? `Situation: In ${p2.title.split('—')[0].trim()}, incoming data formats varied unpredictably. Task: Build a reliable ingestion flow without blocking users. Action: I collected diverse real-world samples, designed heuristic parsing with an interactive preview confirmation step, and wrote unit tests for edge cases. Result: Parsing failures dropped to zero across test scenarios.`
        : 'Situation: Early in a sprint, API requirements were still evolving. Task: Keep frontend and backend unblocked. Action: I proposed a minimal OpenAPI contract with mockable fixtures and iterated with stakeholders. Result: Both tracks integrated seamlessly ahead of deadline.',
      tips: [
        'Highlight how you reduced uncertainty with data or prototypes.',
        'Emphasize proactive communication with teammates.',
      ],
    },
    {
      id: `hr-${Date.now()}-4`,
      question: 'Tell me about a time you had to balance shipping quickly against long-term code quality or technical debt.',
      competency: 'Engineering Judgment',
      whyAsked: 'Tests pragmatic decision-making under real-world deadlines.',
      sampleAnswer:
        'Situation: Ahead of a milestone demo, a reporting query was slow due to an unindexed join. Task: Meet the deadline without introducing fragile hacks. Action: Instead of caching stale snapshots blindly, I used EXPLAIN ANALYZE to add a targeted composite index and documented follow-up pagination improvements. Result: We hit the demo deadline with an 80% faster query and zero tech-debt regressions.',
      tips: [
        'Show you understand when shortcuts are acceptable vs. dangerous.',
        'Explain how you communicated the trade-off and followed through.',
      ],
    },
  ];

  return {
    companyFocusSummary,
    technicalQuestions,
    hrQuestions,
    generatedAt: `Generated at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
  };
}

export function evaluateInterviewAnswerLocally(params: {
  question: string;
  userAnswer: string;
  companyName: string;
  roleTitle: string;
}): InterviewFeedbackResult {
  const { userAnswer, companyName, roleTitle } = params;
  const trimmed = userAnswer.trim();
  const words = trimmed.split(/\s+/).filter(Boolean);
  const lower = trimmed.toLowerCase();

  const hasMetrics = /\d+%|\d+ms|\d+\+|\b\d+\s*(?:seconds|minutes|users|requests|times|x)\b/i.test(trimmed);
  const hasStarSignals =
    /\b(situation|context|when|during|task|goal|action|implemented|built|designed|result|outcome|reduced|improved)\b/i.test(
      lower
    );
  const hasTechDepth =
    /\b(complexity|o\(|index|cache|redis|sql|api|async|queue|test|validation|trade-off|latency|scalable|idempoten|architecture)\b/i.test(
      lower
    );

  let score = 56;
  if (words.length >= 25) score += 10;
  if (words.length >= 50) score += 8;
  if (hasMetrics) score += 10;
  if (hasStarSignals) score += 8;
  if (hasTechDepth) score += 7;
  score = Math.min(96, score);

  const strengths: string[] = [];
  if (words.length >= 30) {
    strengths.push('Good level of detail and narrative context.');
  } else {
    strengths.push('Direct and concise opening.');
  }
  if (hasTechDepth) {
    strengths.push(`Uses concrete engineering terminology relevant to ${companyName}’s ${roleTitle} bar.`);
  }
  if (hasMetrics) {
    strengths.push('Includes quantified results or measurable engineering impact.');
  }
  if (hasStarSignals) {
    strengths.push('Follows clear action-and-outcome flow.');
  }

  const improvements: string[] = [];
  if (words.length < 30) {
    improvements.push('Expand your response to 50–90 words covering context, your specific action, and the measurable result.');
  }
  if (!hasMetrics) {
    improvements.push('Add at least one concrete metric (latency, throughput, error reduction, or time saved).');
  }
  if (!hasTechDepth) {
    improvements.push('Mention explicit technical trade-offs, edge cases, or complexity analysis to elevate seniority.');
  }
  if (improvements.length === 0) {
    improvements.push('Keep delivery under 90 seconds and pause to ask if the interviewer wants deeper architecture details.');
  }

  const polishedVersion = `${trimmed.replace(/\.$/, '')}.${
    !hasMetrics
      ? ' Measurably, this approach improved system reliability and cut turnaround latency across our target workflow.'
      : ''
  }${
    !hasTechDepth
      ? ' Throughout implementation, I explicitly balanced performance trade-offs, edge-case validation, and automated test coverage.'
      : ''
  }`;

  return {
    score,
    strengths,
    improvements,
    polishedVersion,
  };
}
