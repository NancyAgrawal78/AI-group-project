import React from 'react';
import type { ResumeProfile, ResumeTemplateId } from '../types';
import { AvatarPlaceholder } from './AvatarPlaceholder';

interface ResumePreviewProps {
  profile: ResumeProfile;
  template: ResumeTemplateId;
  highlightKeywords?: string[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  profile,
  template,
  highlightKeywords = [],
}) => {
  const isExecutive = template === 'executive';
  const isModern = template === 'modern';
  const isMinimal = template === 'minimal';

  const normalizedHighlights = highlightKeywords.map((k) => k.toLowerCase().trim()).filter(Boolean);
  const isSkillHighlighted = (skill: string) => {
    const sLower = skill.toLowerCase();
    return normalizedHighlights.some(
      (kw) =>
        kw === sLower ||
        sLower.includes(kw) ||
        kw.includes(sLower) ||
        sLower
          .split(/[\s&/,]+/)
          .filter((part) => part.length >= 3)
          .some((part) => kw.includes(part))
    );
  };

  const contactItems = [
    profile.personal.email,
    profile.personal.phone,
    profile.personal.location,
    profile.personal.linkedin,
    profile.personal.github,
    profile.personal.portfolio,
  ].filter(Boolean);

  return (
    <div className="print-only-sheet bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden text-slate-900">
      {/* Header */}
      <div
        className={
          isExecutive
            ? 'bg-slate-900 text-white px-8 py-7'
            : isModern
              ? 'bg-gradient-to-r from-indigo-50 via-violet-50 to-slate-50 border-t-4 border-violet-700 border-b border-slate-200 px-8 py-7 text-slate-900'
              : 'bg-white border-b border-slate-300 px-8 py-7 text-slate-900'
        }
      >
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-display font-bold tracking-tight">
              {profile.personal.fullName || 'Your Full Name'}
            </h2>
            {profile.personal.headline && (
              <p
                className={`mt-1 text-sm font-medium ${
                  isExecutive ? 'text-indigo-200' : isModern ? 'text-violet-800' : 'text-slate-600'
                }`}
              >
                {profile.personal.headline}
              </p>
            )}
            {contactItems.length > 0 && (
              <div
                className={`mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs ${
                  isExecutive ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {contactItems.map((item, idx) => (
                  <React.Fragment key={`${item}-${idx}`}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>

          {profile.personal.includePhoto && (
            <AvatarPlaceholder
              name={profile.personal.fullName}
              photoDataUrl={profile.personal.photoDataUrl}
              size="lg"
              className={isExecutive ? 'border-slate-700' : 'border-slate-300'}
            />
          )}
        </div>
      </div>

      {/* Body */}
      <div className="px-8 py-6 space-y-5 text-[13px] leading-relaxed">
        {/* Summary */}
        {profile.personal.summary.trim() && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Professional Summary
            </h3>
            <p className="mt-2 text-slate-700">{profile.personal.summary}</p>
          </section>
        )}

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Technical Skills
            </h3>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5 text-slate-800">
              {profile.skills.map((skill, idx) => {
                const isHighlighted = isSkillHighlighted(skill);
                return (
                  <span
                    key={`${skill}-${idx}`}
                    className={
                      isHighlighted
                        ? 'font-semibold text-emerald-800 underline decoration-emerald-400 underline-offset-4'
                        : ''
                    }
                  >
                    {skill}
                    {idx < profile.skills.length - 1 ? ' ·' : ''}
                  </span>
                );
              })}
            </div>
          </section>
        )}

        {/* Experience & Internships */}
        {profile.internships.length > 0 && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Experience & Internships
            </h3>
            <div className="mt-2.5 space-y-3.5">
              {profile.internships.map((item) => (
                <div key={item.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold text-slate-900">
                      {item.role} <span className="font-normal text-slate-600">— {item.company}</span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono tabular-nums">
                      {[item.duration, item.location].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                    {item.highlights
                      .filter((h) => h.trim())
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {profile.projects.length > 0 && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Key Projects
            </h3>
            <div className="mt-2.5 space-y-3.5">
              {profile.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="font-semibold text-slate-900">{proj.title}</div>
                    {proj.duration && (
                      <div className="text-xs text-slate-500 font-mono tabular-nums">
                        {proj.duration}
                      </div>
                    )}
                  </div>
                  {proj.techStack && (
                    <div
                      className={`text-xs mt-0.5 ${
                        isModern ? 'text-violet-700' : isMinimal ? 'text-slate-600' : 'text-indigo-700'
                      }`}
                    >
                      {proj.techStack}
                      {proj.link ? ` · ${proj.link}` : ''}
                    </div>
                  )}
                  <ul className="mt-1.5 list-disc pl-4 space-y-1 text-slate-700">
                    {proj.highlights
                      .filter((h) => h.trim())
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {profile.education.length > 0 && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Education
            </h3>
            <div className="mt-2.5 space-y-2">
              {profile.education.map((edu) => (
                <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-2">
                  <div>
                    <div className="font-semibold text-slate-900">{edu.degree}</div>
                    <div className="text-xs text-slate-600">
                      {[edu.institution, edu.field, edu.gpa ? `Grade: ${edu.gpa}` : '']
                        .filter(Boolean)
                        .join(' · ')}
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 font-mono tabular-nums">
                    {edu.startYear} – {edu.endYear}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {profile.certifications.length > 0 && (
          <section>
            <h3
              className={`text-xs font-display font-bold uppercase tracking-wider pb-1 border-b ${
                isModern
                  ? 'text-violet-800 border-violet-200'
                  : isExecutive
                    ? 'text-slate-900 border-slate-300'
                    : 'text-slate-800 border-slate-200'
              }`}
            >
              Certifications
            </h3>
            <ul className="mt-2 space-y-1 text-slate-700">
              {profile.certifications.map((cert) => (
                <li key={cert.id} className="flex flex-wrap items-baseline justify-between gap-2">
                  <span>
                    <span className="font-medium text-slate-900">{cert.name}</span> — {cert.issuer}
                    {cert.credentialId ? ` (ID: ${cert.credentialId})` : ''}
                  </span>
                  {cert.year && (
                    <span className="text-xs text-slate-500 font-mono tabular-nums">{cert.year}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
