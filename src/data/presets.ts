import type {
  ATSCheckResult,
  ActivityLogItem,
  CompanyPreset,
  InterviewPrepResult,
  ResumeProfile,
  SkillAnalysisResult,
  TailoredResumeResult,
  TargetSelection,
} from '../types';

export const DEFAULT_PROFILE: ResumeProfile = {
  personal: {
    fullName: 'Ananya Sharma',
    headline: 'Final-Year Computer Science Student · Full-Stack & Cloud Developer',
    email: 'ananya.sharma.dev@example.com',
    phone: '+91 98765 43210',
    location: 'Bengaluru, India',
    linkedin: 'linkedin.com/in/ananya-sharma-cs',
    github: 'github.com/ananyasharma-dev',
    portfolio: 'ananyasharma.dev',
    summary:
      'Computer Science undergraduate (8.9 CGPA) with hands-on experience building scalable React, TypeScript, and Node.js web applications. Delivered RESTful microservices and automated CI/CD pipelines during two software engineering internships, reducing API response latency by 32%. Seeking a Software Engineer role to build high-reliability distributed products.',
    photoDataUrl: '',
    includePhoto: true,
  },
  education: [
    {
      id: 'edu-1',
      institution: 'GLA University, Mathura',
      degree: 'B.Tech in Computer Science & Engineering',
      field: 'Computer Science',
      startYear: '2022',
      endYear: '2026',
      gpa: '8.9 / 10.0',
    },
    {
      id: 'edu-2',
      institution: 'Delhi Public School',
      degree: 'Senior Secondary (CBSE Class XII)',
      field: 'PCM with Computer Science',
      startYear: '2021',
      endYear: '2022',
      gpa: '94.2%',
    },
  ],
  skills: [
    'TypeScript',
    'JavaScript',
    'React',
    'Node.js',
    'Express.js',
    'Python',
    'Java',
    'SQL & PostgreSQL',
    'Data Structures & Algorithms',
    'REST APIs',
    'Git & GitHub',
    'Tailwind CSS',
    'Docker',
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'PulseQueue — Distributed Task Scheduler',
      techStack: 'TypeScript, Node.js, PostgreSQL, Redis, Docker',
      duration: 'Jan 2026 – Apr 2026',
      link: 'github.com/ananyasharma-dev/pulsequeue',
      highlights: [
        'Architected a fault-tolerant background job queue supporting delayed retries, exponential backoff, and dead-letter queues for 10,000+ simulated jobs/hour.',
        'Designed a real-time React monitoring console displaying worker throughput and queue depth metrics with WebSocket updates.',
        'Containerized worker nodes using Docker Compose and wrote integration tests achieving 88% code coverage.',
      ],
    },
    {
      id: 'proj-2',
      title: 'FinTrack — Personal Expense & Budget Analytics App',
      techStack: 'React, TypeScript, Express, PostgreSQL, Tailwind CSS',
      duration: 'Aug 2025 – Nov 2025',
      link: 'github.com/ananyasharma-dev/fintrack',
      highlights: [
        'Built an accessible responsive dashboard with CSV bank statement parsing and automated category classification rules.',
        'Optimized PostgreSQL aggregation queries using composite indexes, cutting monthly report generation time from 480ms to 95ms.',
      ],
    },
  ],
  internships: [
    {
      id: 'int-1',
      company: 'CloudScale Systems',
      role: 'Software Engineering Intern',
      duration: 'May 2025 – Jul 2025',
      location: 'Bengaluru (Hybrid)',
      highlights: [
        'Developed 6 modular React and TypeScript dashboard views for internal billing analytics used by 40+ operations specialists.',
        'Refactored legacy Node.js REST endpoints with input validation and Redis caching, reducing p95 response latency by 32%.',
        'Collaborated in 2-week Agile sprints, participating in daily standups, PR code reviews, and automated GitHub Actions deployments.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert-1',
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      year: '2025',
      credentialId: 'AWS-CCP-94821',
    },
    {
      id: 'cert-2',
      name: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      year: '2024',
      credentialId: 'META-FE-2024',
    },
  ],
};

export const COMPANY_PRESETS: CompanyPreset[] = [
  {
    id: 'google',
    name: 'Google',
    industry: 'Cloud, Search & AI Platforms',
    headquarters: 'Mountain View, CA',
    accentColor: '#2563EB',
    hiringFocus: 'Data Structures & Algorithms, Scalable Systems, Clean Code, Googleyness',
    roles: [
      {
        title: 'Software Engineer (University Grad)',
        level: 'Entry / L3',
        requiredSkills: [
          'Data Structures & Algorithms',
          'Python',
          'Java',
          'C++',
          'System Design',
          'Distributed Systems',
          'Unit Testing',
          'SQL',
          'Linux',
          'Cloud Infrastructure',
        ],
        description:
          'Design, develop, test, deploy, and maintain large-scale software systems at Google. Strong foundation in Data Structures, Algorithms, and complexity analysis. Experience in one or more general-purpose programming languages (Java, C++, Python, TypeScript/Go). Familiarity with distributed systems, Unix/Linux environments, API design, automated testing, and cloud-native architecture.',
      },
      {
        title: 'Frontend Software Engineer',
        level: 'Entry / Mid',
        requiredSkills: [
          'TypeScript',
          'JavaScript',
          'React',
          'Web Performance',
          'Accessibility (WCAG)',
          'Data Structures & Algorithms',
          'REST APIs',
          'Automated Testing',
        ],
        description:
          'Build fast, accessible, resilient web interfaces for millions of daily users. Deep fluency in TypeScript, modern component architecture, browser rendering performance, WCAG accessibility standards, state management, and automated E2E/unit testing.',
      },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    industry: 'Enterprise Cloud, Productivity & AI',
    headquarters: 'Redmond, WA',
    accentColor: '#0284C7',
    hiringFocus: 'Problem Solving, Object-Oriented Design, Azure Cloud, Growth Mindset',
    roles: [
      {
        title: 'Software Engineer (SDE I)',
        level: 'Entry / L59',
        requiredSkills: [
          'Data Structures & Algorithms',
          'C# / .NET or Java',
          'TypeScript',
          'React',
          'Azure',
          'Microservices',
          'SQL & Databases',
          'CI/CD',
          'Object-Oriented Design',
        ],
        description:
          'Build cloud-native services and modern web experiences across Microsoft 365 and Azure. Requires strong proficiency in object-oriented design, data structures, relational/NoSQL databases, RESTful microservices, CI/CD automation, and collaborative engineering.',
      },
      {
        title: 'Cloud Solution Engineer',
        level: 'Entry / Early Career',
        requiredSkills: [
          'Azure',
          'Kubernetes',
          'Docker',
          'Networking',
          'Python',
          'Terraform / IaC',
          'REST APIs',
          'Security Fundamentals',
        ],
        description:
          'Architect reliable cloud workloads on Microsoft Azure. Hands-on familiarity with containers (Docker/Kubernetes), Infrastructure as Code, cloud security, observability, and API integration.',
      },
    ],
  },
  {
    id: 'amazon',
    name: 'Amazon',
    industry: 'E-Commerce & Cloud Computing (AWS)',
    headquarters: 'Seattle, WA',
    accentColor: '#D97706',
    hiringFocus: 'Amazon Leadership Principles (Customer Obsession, Ownership), Scalable Backend & DSA',
    roles: [
      {
        title: 'Software Development Engineer (SDE-1)',
        level: 'Entry / L4',
        requiredSkills: [
          'Java',
          'Python',
          'Data Structures & Algorithms',
          'AWS',
          'Distributed Systems',
          'Object-Oriented Design',
          'Microservices',
          'DynamoDB / SQL',
          'System Design',
        ],
        description:
          'Own end-to-end delivery of highly available, low-latency services serving millions of Amazon customers. Strong proficiency in Java/Python/C++, algorithms, object-oriented design, AWS services (EC2, S3, Lambda, DynamoDB), operational excellence, and alignment with Amazon Leadership Principles.',
      },
    ],
  },
  {
    id: 'infosys',
    name: 'Infosys',
    industry: 'Global IT Consulting & Digital Services',
    headquarters: 'Bengaluru, India',
    accentColor: '#0EA5E9',
    hiringFocus: 'Core CS Fundamentals, Java/Python, SQL, Agile Delivery & Client Communication',
    roles: [
      {
        title: 'Specialist Programmer (SP)',
        level: 'Entry / Early Career',
        requiredSkills: [
          'Java',
          'Python',
          'Data Structures & Algorithms',
          'SQL & PostgreSQL',
          'Spring Boot',
          'React',
          'REST APIs',
          'Agile / Scrum',
        ],
        description:
          'Develop enterprise full-stack applications for global Fortune 500 clients. Strong algorithmic problem-solving, full-stack development using Java/Spring Boot or Node.js with React/Angular, relational databases, and strong verbal/written communication.',
      },
      {
        title: 'Systems Engineer',
        level: 'Entry Level',
        requiredSkills: [
          'Java',
          'Python',
          'SQL',
          'Object-Oriented Programming',
          'HTML/CSS/JavaScript',
          'Git',
          'SDLC',
        ],
        description:
          'Contribute to application development, testing, and cloud modernization projects. Requires solid knowledge of OOP, SQL queries, web fundamentals, SDLC methodologies, and analytical troubleshooting.',
      },
    ],
  },
  {
    id: 'tcs',
    name: 'TCS (Tata Consultancy Services)',
    industry: 'Enterprise IT Services & Consulting',
    headquarters: 'Mumbai, India',
    accentColor: '#4F46E5',
    hiringFocus: 'Aptitude, Core Programming (Java/Python/C++), DBMS, Cloud & Communication',
    roles: [
      {
        title: 'TCS Digital — Software Developer',
        level: 'Entry Level',
        requiredSkills: [
          'Java',
          'Python',
          'SQL & DBMS',
          'React',
          'Node.js',
          'Cloud Computing',
          'Data Structures',
          'Git & CI/CD',
        ],
        description:
          'Build digital transformation solutions across cloud, data analytics, and modern web platforms. Seeking strong coding fundamentals in Java or Python, relational DBMS knowledge, modern JavaScript/React experience, and familiarity with cloud platforms.',
      },
    ],
  },
  {
    id: 'meta',
    name: 'Meta',
    industry: 'Social Platforms, VR & Open AI',
    headquarters: 'Menlo Park, CA',
    accentColor: '#2563EB',
    hiringFocus: 'Fast Coding Rounds, Product Architecture, React & GraphQL / Distributed Systems',
    roles: [
      {
        title: 'Front End Engineer, University Grad',
        level: 'Entry / E3',
        requiredSkills: [
          'JavaScript',
          'TypeScript',
          'React',
          'DOM & Browser APIs',
          'GraphQL',
          'CSS Architecture',
          'Data Structures & Algorithms',
          'Web Performance',
        ],
        description:
          'Craft high-performance interactive web experiences at massive scale. Requires mastery of JavaScript/TypeScript, React internals, asynchronous programming, state management, GraphQL, and algorithmic problem-solving.',
      },
    ],
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    industry: 'E-Commerce & Supply Chain Tech',
    headquarters: 'Bengaluru, India',
    accentColor: '#4338CA',
    hiringFocus: 'Machine Coding Round, Low-Level Design (LLD), High-Throughput Backend',
    roles: [
      {
        title: 'SDE-1 (Full-Stack / Backend)',
        level: 'Entry / SDE-1',
        requiredSkills: [
          'Java',
          'Node.js',
          'Low-Level Design (LLD)',
          'Data Structures & Algorithms',
          'Kafka / Message Queues',
          'Redis',
          'SQL & NoSQL',
          'REST APIs',
        ],
        description:
          'Build resilient checkout, catalog, and fulfillment systems handling peak festive traffic. Evaluated on clean machine-coding design patterns, SOLID principles, DSA, caching (Redis), message queues (Kafka), and database modeling.',
      },
    ],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    industry: 'Global Financial Infrastructure & Payments',
    headquarters: 'San Francisco, CA',
    accentColor: '#635BFF',
    hiringFocus: 'Clean API Design, Bug-Hunt Debugging, Reliability & Idempotency',
    roles: [
      {
        title: 'Software Engineer, New Grad',
        level: 'Entry Level',
        requiredSkills: [
          'TypeScript',
          'Node.js',
          'Python',
          'Ruby or Go',
          'REST APIs',
          'SQL & PostgreSQL',
          'Automated Testing',
          'Distributed Reliability',
        ],
        description:
          'Build reliable financial APIs and developer dashboards with obsessive attention to edge cases, idempotency, clear error handling, and clean abstractions. Strong proficiency in API integration, debugging real codebases, and relational databases.',
      },
    ],
  },
  {
    id: 'wipro',
    name: 'Wipro',
    industry: 'Global IT, Cloud & Cybersecurity Services',
    headquarters: 'Bengaluru, India',
    accentColor: '#7C3AED',
    hiringFocus: 'Programming Fundamentals, Full-Stack Web, Cloud & DevOps Readiness',
    roles: [
      {
        title: 'Project Engineer (Turbo)',
        level: 'Entry Level',
        requiredSkills: [
          'Java',
          'Python',
          'TypeScript',
          'React',
          'SQL',
          'Docker',
          'REST APIs',
          'Cloud Fundamentals',
        ],
        description:
          'Deliver cloud-ready web applications and enterprise integrations for global clients. Requires strong programming fundamentals, database skills, modern web frameworks, and DevOps awareness.',
      },
    ],
  },
  {
    id: 'accenture',
    name: 'Accenture',
    industry: 'Technology Consulting & Enterprise Cloud',
    headquarters: 'Dublin / Global',
    accentColor: '#7C3AED',
    hiringFocus: 'Full-Stack Engineering, Cloud Platforms, Agile Delivery & Business Impact',
    roles: [
      {
        title: 'Advanced Associate Software Engineer',
        level: 'Entry Level',
        requiredSkills: [
          'Java',
          'JavaScript',
          'React',
          'Node.js',
          'SQL',
          'AWS or Azure',
          'Agile',
          'REST APIs',
        ],
        description:
          'Design and modernize enterprise web and cloud applications. Strong grasp of full-stack engineering, API integration, SQL databases, cloud deployment basics, and collaborative client delivery.',
      },
    ],
  },
];

export const DEFAULT_TARGET: TargetSelection = {
  companyId: 'google',
  companyName: 'Google',
  industry: 'Cloud, Search & AI Platforms',
  roleTitle: 'Software Engineer (University Grad)',
  experienceLevel: 'Entry / L3',
  jobDescription: COMPANY_PRESETS[0].roles[0].description,
};

export const SAMPLE_SKILL_ANALYSIS: SkillAnalysisResult = {
  matchPercentage: 76,
  compatibilityScore: 79,
  readinessLabel: 'Strong Candidate · 3 Targeted Gaps',
  coachSummary:
    'Your React, TypeScript, Node.js, and SQL foundation maps well to Google engineering workflows, and PulseQueue demonstrates real asynchronous systems thinking. Closing gaps in formal System Design, C++/Go or Java depth, and Linux/Cloud deployment observability will lift you to strong interview readiness.',
  matchedSkills: [
    {
      name: 'Data Structures & Algorithms',
      category: 'Core CS',
      evidenceInProfile: 'Listed in core skills and applied in PulseQueue scheduling logic.',
    },
    {
      name: 'TypeScript & Node.js',
      category: 'Languages & Runtime',
      evidenceInProfile: 'Used in PulseQueue, FinTrack, and CloudScale Systems internship.',
    },
    {
      name: 'SQL & PostgreSQL',
      category: 'Databases',
      evidenceInProfile: 'Optimized PostgreSQL indexing in FinTrack (480ms to 95ms).',
    },
    {
      name: 'REST APIs & Testing',
      category: 'Backend',
      evidenceInProfile: 'Built validated REST endpoints with 88% integration test coverage.',
    },
    {
      name: 'Python & Java',
      category: 'General Purpose',
      evidenceInProfile: 'Included in core technical skills inventory.',
    },
    {
      name: 'Docker',
      category: 'Infrastructure',
      evidenceInProfile: 'Containerized worker nodes using Docker Compose in PulseQueue.',
    },
  ],
  missingOrWeakSkills: [
    {
      name: 'System Design (Scalability & Sharding)',
      status: 'missing',
      priority: 'high',
      reason: 'Google L3/new-grad rounds increasingly evaluate foundational distributed system trade-offs.',
    },
    {
      name: 'Kubernetes & Cloud Observability',
      status: 'weak',
      priority: 'medium',
      reason: 'Docker Compose is present, but production orchestration and structured tracing are not yet evidenced.',
    },
    {
      name: 'C++ / Low-Level Concurrency',
      status: 'missing',
      priority: 'medium',
      reason: 'Job description highlights systems languages; adding concurrency depth strengthens backend versatility.',
    },
  ],
  requiredSkillsToDevelop: [
    {
      skill: 'Distributed System Design Fundamentals',
      targetLevel: 'Intermediate',
      whyItMatters: 'Demonstrates ability to reason about replication, caching, rate limiting, and failure modes.',
    },
    {
      skill: 'Kubernetes & GCP Cloud Run / GKE',
      targetLevel: 'Practical',
      whyItMatters: 'Bridges local Docker experience to production Google Cloud container orchestration.',
    },
    {
      skill: 'Competitive DSA Speed & Graph/DP Mastery',
      targetLevel: 'Interview-Ready',
      whyItMatters: 'Core requirement for passing Google technical coding rounds under 45-minute constraints.',
    },
  ],
  learningRoadmap: [
    {
      phase: 'Phase 1: Algorithm Fluency',
      duration: 'Weeks 1–3',
      focusSkill: 'Graphs, Dynamic Programming & Complexity Analysis',
      actionSteps: [
        'Solve 35 medium/hard graph, tree, and DP problems with timed 40-minute mock constraints.',
        'Practice explaining time/space trade-offs aloud before writing code.',
      ],
      resources: [
        {
          title: 'NeetCode 150 Roadmap',
          provider: 'NeetCode',
          type: 'Interactive Practice',
          estimatedHours: '24 hrs',
        },
        {
          title: 'Google Tech Dev Guide — Data Structures',
          provider: 'Google',
          type: 'Official Guide',
          estimatedHours: '10 hrs',
        },
      ],
    },
    {
      phase: 'Phase 2: System Design & Cloud',
      duration: 'Weeks 4–6',
      focusSkill: 'Distributed Systems & Container Orchestration',
      actionSteps: [
        'Deploy PulseQueue workers to Kubernetes or Google Cloud Run with Prometheus metrics.',
        'Document a 1-page architecture decision record covering partitioning and idempotency.',
      ],
      resources: [
        {
          title: 'System Design Primer',
          provider: 'GitHub Open Source',
          type: 'Study Guide',
          estimatedHours: '16 hrs',
        },
        {
          title: 'Kubernetes Basics & Cloud Architecture',
          provider: 'Google Cloud Skills Boost',
          type: 'Hands-on Lab',
          estimatedHours: '12 hrs',
        },
      ],
    },
  ],
  analyzedAt: 'Initial Baseline',
};

export const SAMPLE_TAILORED_RESUME: TailoredResumeResult = {
  tailoredSummary:
    'Computer Science undergraduate (8.9 CGPA) specializing in fault-tolerant backend services, TypeScript/Node.js, and PostgreSQL optimization. Built PulseQueue (10,000+ jobs/hr distributed task queue) and reduced p95 API latency by 32% during a software engineering internship at CloudScale Systems. Proven foundation in Data Structures, automated integration testing, and containerized deployments.',
  tailoredSkills: [
    'Data Structures & Algorithms',
    'Python',
    'Java',
    'TypeScript',
    'Node.js',
    'SQL & PostgreSQL',
    'REST APIs',
    'Docker',
    'React',
    'Git & GitHub',
    'Express.js',
    'JavaScript',
    'Tailwind CSS',
  ],
  tailoredProjects: [
    {
      id: 'proj-1',
      title: 'PulseQueue — Distributed Task Scheduler',
      highlights: [
        'Architected a fault-tolerant distributed job queue in TypeScript, Node.js, and Redis handling 10,000+ jobs/hour with exponential backoff retries and dead-letter recovery.',
        'Built real-time worker throughput telemetry with WebSockets and achieved 88% integration test coverage across containerized Docker worker nodes.',
      ],
    },
    {
      id: 'proj-2',
      title: 'FinTrack — Personal Expense & Budget Analytics App',
      highlights: [
        'Optimized PostgreSQL aggregation queries with composite indexing, cutting monthly analytics query latency by 80% (480ms to 95ms).',
        'Implemented deterministic CSV ingestion pipelines and modular REST endpoints backed by React and Express.',
      ],
    },
  ],
  tailoredInternships: [
    {
      id: 'int-1',
      company: 'CloudScale Systems',
      role: 'Software Engineering Intern',
      highlights: [
        'Reduced p95 REST API response latency by 32% through strict schema validation, query tuning, and Redis caching layers.',
        'Engineered 6 modular React and TypeScript billing analytics views with automated GitHub Actions CI/CD pipelines.',
      ],
    },
  ],
  atsMatchEstimate: 88,
  includedKeywords: [
    'Data Structures & Algorithms',
    'Python',
    'Java',
    'TypeScript',
    'REST APIs',
    'PostgreSQL',
    'Docker',
    'Automated Testing',
  ],
  recommendedKeywordsToLearn: ['System Design', 'Kubernetes', 'Linux Profiling'],
  tailoringNotes: [
    'Prioritized core CS languages (Python, Java) and algorithmic/distributed projects at the top for Google University Grad screening.',
    'Elevated quantifiable latency and throughput metrics (32% latency cut, 10,000+ jobs/hr, 80% query speedup) without inventing any new claims.',
  ],
  generatedAt: 'Sample Tailored Draft',
};

export const SAMPLE_ATS_RESULT: ATSCheckResult = {
  atsScore: 84,
  summary:
    'Strong single-column structure and measurable engineering impact. Adding explicit test/CI metrics to every experience entry and aligning backend system keywords will push ATS parsing compatibility above 90%.',
  sectionScores: {
    formatting: 92,
    keywords: 78,
    impactMetrics: 86,
    readability: 88,
    completeness: 80,
  },
  foundKeywords: [
    'TypeScript',
    'React',
    'Node.js',
    'PostgreSQL',
    'REST APIs',
    'Docker',
    'CI/CD',
    'Data Structures & Algorithms',
  ],
  missingKeywords: ['System Design', 'Unit Testing', 'Linux', 'Distributed Systems'],
  formattingIssues: [
    {
      severity: 'low',
      issue: 'Portfolio & GitHub links lack https:// prefix in plain-text extractors',
      fix: 'Keep clean domain text for visual clarity, or include full canonical URLs for automated link parsers.',
    },
    {
      severity: 'medium',
      issue: 'Cloud Practitioner certification lacks relevant service keywords',
      fix: 'Optionally list specific practiced services (e.g., EC2, S3, IAM) in parentheses if you have hands-on experience with them.',
    },
  ],
  suggestions: [
    {
      section: 'Professional Summary',
      currentObservation: 'Mentions general full-stack skills clearly.',
      improvementAction: 'Lead directly with your target engineering focus and strongest latency/scale metric.',
    },
    {
      section: 'Projects',
      currentObservation: 'PulseQueue shows strong distributed reliability concepts.',
      improvementAction: 'Explicitly mention fault tolerance, idempotency, or integration testing terms where accurate.',
    },
  ],
  checkedFileName: 'Current Resume Profile',
  checkedAt: 'Initial Baseline',
};

export const SAMPLE_INTERVIEW_PREP: InterviewPrepResult = {
  companyFocusSummary:
    'Google University Grad interviews emphasize clean algorithmic problem-solving (graphs, trees, dynamic programming), explicit Big-O complexity analysis, edge-case testing, and collaborative "Googleyness" behavioral signals.',
  technicalQuestions: [
    {
      id: 'tq-1',
      question:
        'In your PulseQueue project, how would you prevent two workers from executing the same delayed job concurrently under network partitions?',
      difficulty: 'Medium',
      topic: 'Distributed Reliability & Concurrency',
      whyAsked: 'Tests whether you deeply understand the distributed systems trade-offs in your own resume projects.',
      sampleAnswer:
        'I would enforce atomic lease acquisition using Redis SET NX with a visibility timeout or PostgreSQL SELECT FOR UPDATE SKIP LOCKED, paired with a monotonically increasing fencing token. Workers must make job execution idempotent using an idempotency key so that if a lease expires mid-flight and a second worker picks it up, side effects are never duplicated.',
      tips: [
        'Anchor your explanation directly in PulseQueue’s Redis/PostgreSQL architecture.',
        'Mention fencing tokens and idempotency keys explicitly.',
        'Discuss trade-offs between at-least-once and exactly-once semantics.',
      ],
    },
    {
      id: 'tq-2',
      question:
        'Given a stream of API latency numbers over a sliding window of K minutes, how would you compute the p95 latency efficiently in memory?',
      difficulty: 'Medium-Hard',
      topic: 'Data Structures & Algorithms',
      whyAsked: 'Connects classic sliding-window data structures to real production observability.',
      sampleAnswer:
        'For exact p95 over a fixed window size, maintain a queue for eviction order alongside two balanced structures (or a Fenwick/Segment tree over bucketed millisecond latencies). For massive throughput where 1% error is acceptable, use HDR Histograms or t-digest per 1-minute bucket and merge active buckets.',
      tips: [
        'Start by clarifying stream rate, precision requirements, and memory bounds.',
        'Contrast exact two-heap/balanced-BST approaches with approximate sketches.',
        'State Big-O time and space complexity cleanly.',
      ],
    },
    {
      id: 'tq-3',
      question:
        'Walk through how you diagnosed and reduced PostgreSQL query latency from 480ms to 95ms in FinTrack.',
      difficulty: 'Medium',
      topic: 'Database Internals',
      whyAsked: 'Verifies real debugging rigor vs. surface-level resume bullet points.',
      sampleAnswer:
        'I ran EXPLAIN ANALYZE on the monthly aggregation query and observed a sequential scan followed by an external disk sort across user_id and transaction_date. Creating a composite B-Tree index on (user_id, transaction_date DESC) enabled an index-only range scan, eliminating the sort stage and dropping execution time to 95ms.',
      tips: [
        'Mention EXPLAIN ANALYZE and column ordering rationale in composite indexes.',
        'Acknowledge write-amplification trade-offs of adding indexes.',
        'Keep metrics exact and concise.',
      ],
    },
  ],
  hrQuestions: [
    {
      id: 'hr-1',
      question:
        'Tell me about a time you received critical feedback during a code review or team project. How did you respond?',
      competency: 'Googleyness & Humility',
      whyAsked: 'Evaluates ego-free collaboration, openness to learning, and engineering maturity.',
      sampleAnswer:
        'Situation: During my CloudScale Systems internship, a senior engineer flagged that my initial billing endpoint lacked strict schema validation and mixed business logic with HTTP handlers. Task: I needed to refactor it cleanly before our sprint release. Action: I paired with them for 20 minutes to align on our service-layer conventions, extracted pure validator functions, and added negative test cases. Result: The PR shipped on schedule and became the template for three subsequent endpoints.',
      tips: [
        'Use the STAR structure (Situation, Task, Action, Result) within 90 seconds.',
        'Show genuine appreciation for feedback rather than defensiveness.',
        'Highlight what changed in your future coding habits.',
      ],
    },
    {
      id: 'hr-2',
      question:
        'Describe an ambiguous technical problem you faced where requirements were unclear. How did you move forward?',
      competency: 'Navigating Ambiguity',
      whyAsked: 'Measures ownership and structured problem decomposition.',
      sampleAnswer:
        'Situation: While building the FinTrack CSV importer, sample bank exports varied wildly across date formats and negative sign conventions. Task: Build a reliable parser without breaking user uploads. Action: I collected 8 real statement formats, wrote a heuristic column detector with an interactive preview confirmation step, and logged unsupported edge cases. Result: Upload errors dropped to zero across test accounts without blocking users.',
      tips: [
        'Focus on how you gathered data and de-risked assumptions early.',
        'Emphasize user empathy and iterative validation.',
        'Quantify the outcome cleanly.',
      ],
    },
  ],
  generatedAt: 'Sample Prep Kit',
};

export const INITIAL_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-1',
    title: 'Sample profile loaded for Ananya Sharma',
    detail: '2 projects, 1 internship, 13 skills ready to customize or edit',
    timestamp: 'Today',
    route: 'builder',
  },
  {
    id: 'act-2',
    title: 'Target role set to Google · Software Engineer',
    detail: '76% baseline skill match identified across 10 core competencies',
    timestamp: 'Today',
    route: 'coach',
  },
  {
    id: 'act-3',
    title: 'ATS baseline audit completed',
    detail: '84/100 compatibility score with 4 actionable keyword suggestions',
    timestamp: 'Today',
    route: 'ats',
  },
];
