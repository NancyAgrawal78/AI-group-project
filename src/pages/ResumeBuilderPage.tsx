import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Award,
  Briefcase,
  Camera,
  Download,
  FolderGit2,
  GraduationCap,
  Loader2,
  Plus,
  Printer,
  Sparkles,
  Trash2,
  User,
  Wrench,
} from 'lucide-react';
import type {
  CertificationItem,
  EducationItem,
  InternshipItem,
  PageRoute,
  ProjectItem,
  ResumeProfile,
  ResumeTemplateId,
  TargetSelection,
} from '../types';
import { AvatarPlaceholder } from '../components/AvatarPlaceholder';
import { ResumePreview } from '../components/ResumePreview';
import { requestResumeAssist } from '../utils/aiClient';

interface ResumeBuilderPageProps {
  profile: ResumeProfile;
  onChangeProfile: (updated: ResumeProfile) => void;
  template: ResumeTemplateId;
  onChangeTemplate: (tpl: ResumeTemplateId) => void;
  target: TargetSelection;
  onDownloadPdf: () => void;
  onNavigate: (route: PageRoute) => void;
  onLogActivity: (title: string, detail: string, route: PageRoute) => void;
}

type BuilderTab = 'personal' | 'education' | 'skills' | 'projects' | 'internships' | 'certifications';

export const ResumeBuilderPage: React.FC<ResumeBuilderPageProps> = ({
  profile,
  onChangeProfile,
  template,
  onChangeTemplate,
  target,
  onDownloadPdf,
  onNavigate,
  onLogActivity,
}) => {
  const [activeTab, setActiveTab] = useState<BuilderTab>('personal');
  const [skillInput, setSkillInput] = useState('');
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);
  const [aiNote, setAiNote] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updatePersonal = <K extends keyof ResumeProfile['personal']>(
    field: K,
    value: ResumeProfile['personal'][K]
  ) => {
    onChangeProfile({
      ...profile,
      personal: {
        ...profile.personal,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setAiError('Please choose an image smaller than 4 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onChangeProfile({
          ...profile,
          personal: {
            ...profile.personal,
            photoDataUrl: reader.result,
            includePhoto: true,
          },
        });
        onLogActivity('Profile photo updated', 'Photo embedded into resume preview', 'builder');
      }
    };
    reader.readAsDataURL(file);
  };

  const generateAiSummary = async () => {
    setAiLoadingId('summary');
    setAiError(null);
    setAiNote(null);
    try {
      const data = await requestResumeAssist({
        mode: 'summary',
        profile,
        targetCompany: target.companyName,
        targetRole: target.roleTitle,
      });
      if (data.improvedText) {
        updatePersonal('summary', data.improvedText);
        setAiNote(data.rationale || 'Summary updated using your verified profile.');
        onLogActivity(
          'AI summary generated',
          `Aligned summary toward ${target.roleTitle}`,
          'builder'
        );
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unable to generate AI summary.');
    } finally {
      setAiLoadingId(null);
    }
  };

  const enhanceBullets = async (
    kind: 'project' | 'internship',
    id: string,
    rawBullets: string[]
  ) => {
    const joined = rawBullets.filter((b) => b.trim()).join('\n');
    if (!joined) {
      setAiError('Add at least one bullet point before enhancing with AI.');
      return;
    }
    setAiLoadingId(id);
    setAiError(null);
    setAiNote(null);
    try {
      const data = await requestResumeAssist({
        mode: 'bullets',
        profile,
        targetCompany: target.companyName,
        targetRole: target.roleTitle,
        customText: joined,
      });
      const lines = String(data.improvedText || '')
        .split('\n')
        .map((line) => line.replace(/^[•\-*]\s*/, '').trim())
        .filter(Boolean);

      if (lines.length > 0) {
        if (kind === 'project') {
          onChangeProfile({
            ...profile,
            projects: profile.projects.map((p) =>
              p.id === id ? { ...p, highlights: lines } : p
            ),
          });
        } else {
          onChangeProfile({
            ...profile,
            internships: profile.internships.map((item) =>
              item.id === id ? { ...item, highlights: lines } : item
            ),
          });
        }
        setAiNote(data.rationale || 'Bullet points strengthened with crisp action verbs.');
      }
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Unable to enhance bullet points.');
    } finally {
      setAiLoadingId(null);
    }
  };

  const addSkill = (value?: string) => {
    const next = (value ?? skillInput).trim();
    if (!next) return;
    if (!profile.skills.some((s) => s.toLowerCase() === next.toLowerCase())) {
      onChangeProfile({ ...profile, skills: [...profile.skills, next] });
    }
    if (!value) setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    onChangeProfile({
      ...profile,
      skills: profile.skills.filter((s) => s !== skill),
    });
  };

  const addEducation = () => {
    const item: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: '',
      degree: '',
      field: '',
      startYear: '2022',
      endYear: '2026',
      gpa: '',
    };
    onChangeProfile({ ...profile, education: [...profile.education, item] });
  };

  const addProject = () => {
    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: 'New Project',
      techStack: '',
      duration: '',
      link: '',
      highlights: ['Describe what you built, your architecture decisions, and measurable outcome.'],
    };
    onChangeProfile({ ...profile, projects: [...profile.projects, item] });
  };

  const addInternship = () => {
    const item: InternshipItem = {
      id: `int-${Date.now()}`,
      company: '',
      role: '',
      duration: '',
      location: '',
      highlights: ['Describe your core engineering deliverables and impact.'],
    };
    onChangeProfile({ ...profile, internships: [...profile.internships, item] });
  };

  const addCertification = () => {
    const item: CertificationItem = {
      id: `cert-${Date.now()}`,
      name: '',
      issuer: '',
      year: '2026',
      credentialId: '',
    };
    onChangeProfile({ ...profile, certifications: [...profile.certifications, item] });
  };

  const tabs: { id: BuilderTab; label: string; icon: React.ReactNode }[] = [
    { id: 'personal', label: 'Personal & Photo', icon: <User className="w-4 h-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'skills', label: 'Skills', icon: <Wrench className="w-4 h-4" /> },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'internships', label: 'Internships', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Top Action Strip */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-900">AI Resume Builder</h1>
          <p className="text-sm text-slate-500">
            Edit your profile, upload a portrait photo, switch templates, and export a crisp PDF.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Template Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {(
              [
                { id: 'executive', label: 'Executive' },
                { id: 'modern', label: 'Modern' },
                { id: 'minimal', label: 'Minimal ATS' },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => onChangeTemplate(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  template === t.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 whitespace-nowrap cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-800 rounded-lg hover:opacity-95 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {aiError && (
        <div className="no-print bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3 rounded-lg">
          {aiError}
        </div>
      )}
      {aiNote && (
        <div className="no-print bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 rounded-lg">
          {aiNote}
        </div>
      )}

      {/* Split Builder + Live Preview */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Editor */}
        <div className="no-print xl:col-span-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
          {/* Section Tabs */}
          <div className="border-b border-slate-200 bg-slate-50/70 px-3 py-2 flex flex-wrap gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {activeTab === 'personal' && (
              <>
                {/* Photo Upload Block */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <AvatarPlaceholder
                      name={profile.personal.fullName}
                      photoDataUrl={profile.personal.photoDataUrl}
                      size="lg"
                    />
                    <div>
                      <div className="text-sm font-semibold text-slate-900">Profile Photo</div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Upload JPG or PNG headshot. Included in PDF export when enabled.
                      </p>
                      <label className="mt-2 inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.personal.includePhoto}
                          onChange={(e) => updatePersonal('includePhoto', e.target.checked)}
                          className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        Include photo in resume
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Upload Photo
                    </button>
                    {profile.personal.photoDataUrl && (
                      <button
                        type="button"
                        onClick={() => updatePersonal('photoDataUrl', '')}
                        className="p-2 text-slate-500 hover:text-rose-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Personal Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={profile.personal.fullName}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Professional Headline
                    </label>
                    <input
                      type="text"
                      value={profile.personal.headline}
                      onChange={(e) => updatePersonal('headline', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={profile.personal.email}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    <input
                      type="text"
                      value={profile.personal.phone}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={profile.personal.location}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">LinkedIn</label>
                    <input
                      type="text"
                      value={profile.personal.linkedin}
                      onChange={(e) => updatePersonal('linkedin', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">GitHub</label>
                    <input
                      type="text"
                      value={profile.personal.github}
                      onChange={(e) => updatePersonal('github', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Portfolio</label>
                    <input
                      type="text"
                      value={profile.personal.portfolio}
                      onChange={(e) => updatePersonal('portfolio', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-slate-700">
                      Professional Summary
                    </label>
                    <button
                      type="button"
                      disabled={aiLoadingId === 'summary'}
                      onClick={generateAiSummary}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {aiLoadingId === 'summary' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      Generate AI Summary
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={profile.personal.summary}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Education History</h2>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>
                {profile.education.map((edu) => (
                  <div key={edu.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Degree Entry</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProfile({
                            ...profile,
                            education: profile.education.filter((e) => e.id !== edu.id),
                          })
                        }
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            education: profile.education.map((item) =>
                              item.id === edu.id ? { ...item, institution: e.target.value } : item
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Degree (e.g. B.Tech in CS)"
                        value={edu.degree}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            education: profile.education.map((item) =>
                              item.id === edu.id ? { ...item, degree: e.target.value } : item
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.field}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            education: profile.education.map((item) =>
                              item.id === edu.id ? { ...item, field: e.target.value } : item
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Start"
                          value={edu.startYear}
                          onChange={(e) =>
                            onChangeProfile({
                              ...profile,
                              education: profile.education.map((item) =>
                                item.id === edu.id ? { ...item, startYear: e.target.value } : item
                              ),
                            })
                          }
                          className="px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono tabular-nums"
                        />
                        <input
                          type="text"
                          placeholder="End"
                          value={edu.endYear}
                          onChange={(e) =>
                            onChangeProfile({
                              ...profile,
                              education: profile.education.map((item) =>
                                item.id === edu.id ? { ...item, endYear: e.target.value } : item
                              ),
                            })
                          }
                          className="px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono tabular-nums"
                        />
                        <input
                          type="text"
                          placeholder="GPA / %"
                          value={edu.gpa}
                          onChange={(e) =>
                            onChangeProfile({
                              ...profile,
                              education: profile.education.map((item) =>
                                item.id === edu.id ? { ...item, gpa: e.target.value } : item
                              ),
                            })
                          }
                          className="px-2.5 py-2 text-sm border border-slate-200 rounded-lg font-mono tabular-nums"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Add Technical & Domain Skills
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g., Kubernetes, GraphQL, System Design..."
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => addSkill()}
                      className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 cursor-pointer whitespace-nowrap"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {profile.skills.length === 0 ? (
                    <div className="p-4 text-sm text-slate-500">
                      No skills added yet. Add skills above to unlock accurate AI skill-gap coaching.
                    </div>
                  ) : (
                    profile.skills.map((skill) => (
                      <div
                        key={skill}
                        className="px-4 py-2.5 flex items-center justify-between text-sm"
                      >
                        <span className="font-medium text-slate-800">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <div className="text-xs font-medium text-slate-500 mb-2">
                    Quick-add common competencies (click only if you genuinely possess them)
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['AWS', 'Kubernetes', 'GraphQL', 'System Design', 'CI/CD', 'Unit Testing', 'Linux']
                      .filter((s) => !profile.skills.includes(s))
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => addSkill(suggestion)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded-md cursor-pointer"
                        >
                          + {suggestion}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Projects</h2>
                  <button
                    type="button"
                    onClick={addProject}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>
                {profile.projects.map((proj) => (
                  <div key={proj.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700">{proj.title || 'Project'}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={aiLoadingId === proj.id}
                          onClick={() => enhanceBullets('project', proj.id, proj.highlights)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md cursor-pointer disabled:opacity-60"
                        >
                          {aiLoadingId === proj.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          AI Enhance
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeProfile({
                              ...profile,
                              projects: profile.projects.filter((p) => p.id !== proj.id),
                            })
                          }
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={proj.title}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            projects: profile.projects.map((p) =>
                              p.id === proj.id ? { ...p, title: e.target.value } : p
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Tech Stack (e.g., React, Node.js, PostgreSQL)"
                        value={proj.techStack}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            projects: profile.projects.map((p) =>
                              p.id === proj.id ? { ...p, techStack: e.target.value } : p
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={proj.duration}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            projects: profile.projects.map((p) =>
                              p.id === proj.id ? { ...p, duration: e.target.value } : p
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Repository / Live Link"
                        value={proj.link}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            projects: profile.projects.map((p) =>
                              p.id === proj.id ? { ...p, link: e.target.value } : p
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Bullet Points (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={proj.highlights.join('\n')}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            projects: profile.projects.map((p) =>
                              p.id === proj.id
                                ? { ...p, highlights: e.target.value.split('\n') }
                                : p
                            ),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'internships' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Internships & Experience</h2>
                  <button
                    type="button"
                    onClick={addInternship}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Internship
                  </button>
                </div>
                {profile.internships.map((item) => (
                  <div key={item.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-700">
                        {item.company || 'Experience Entry'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={aiLoadingId === item.id}
                          onClick={() => enhanceBullets('internship', item.id, item.highlights)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md cursor-pointer disabled:opacity-60"
                        >
                          {aiLoadingId === item.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3" />
                          )}
                          AI Enhance
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onChangeProfile({
                              ...profile,
                              internships: profile.internships.filter((i) => i.id !== item.id),
                            })
                          }
                          className="text-xs text-rose-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Company"
                        value={item.company}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            internships: profile.internships.map((i) =>
                              i.id === item.id ? { ...i, company: e.target.value } : i
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Role Title"
                        value={item.role}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            internships: profile.internships.map((i) =>
                              i.id === item.id ? { ...i, role: e.target.value } : i
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Duration"
                        value={item.duration}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            internships: profile.internships.map((i) =>
                              i.id === item.id ? { ...i, duration: e.target.value } : i
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        value={item.location}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            internships: profile.internships.map((i) =>
                              i.id === item.id ? { ...i, location: e.target.value } : i
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Bullet Points (one per line)
                      </label>
                      <textarea
                        rows={4}
                        value={item.highlights.join('\n')}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            internships: profile.internships.map((i) =>
                              i.id === item.id
                                ? { ...i, highlights: e.target.value.split('\n') }
                                : i
                            ),
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Certifications</h2>
                  <button
                    type="button"
                    onClick={addCertification}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </div>
                {profile.certifications.map((cert) => (
                  <div key={cert.id} className="p-4 border border-slate-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-500">Certification</span>
                      <button
                        type="button"
                        onClick={() =>
                          onChangeProfile({
                            ...profile,
                            certifications: profile.certifications.filter((c) => c.id !== cert.id),
                          })
                        }
                        className="text-xs text-rose-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Certification Name"
                        value={cert.name}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            certifications: profile.certifications.map((c) =>
                              c.id === cert.id ? { ...c, name: e.target.value } : c
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Issuing Organization"
                        value={cert.issuer}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            certifications: profile.certifications.map((c) =>
                              c.id === cert.id ? { ...c, issuer: e.target.value } : c
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Year"
                        value={cert.year}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            certifications: profile.certifications.map((c) =>
                              c.id === cert.id ? { ...c, year: e.target.value } : c
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg font-mono tabular-nums"
                      />
                      <input
                        type="text"
                        placeholder="Credential ID (optional)"
                        value={cert.credentialId}
                        onChange={(e) =>
                          onChangeProfile({
                            ...profile,
                            certifications: profile.certifications.map((c) =>
                              c.id === cert.id ? { ...c, credentialId: e.target.value } : c
                            ),
                          })
                        }
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Changes save automatically to your browser workspace.
              </span>
              <button
                type="button"
                onClick={() => onNavigate('target')}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-700 hover:text-indigo-900 cursor-pointer"
              >
                Next: Select Target Company <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Resume Preview */}
        <div className="xl:col-span-6">
          <ResumePreview profile={profile} template={template} />
        </div>
      </div>
    </div>
  );
};
