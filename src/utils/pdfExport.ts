import { jsPDF } from 'jspdf';
import type { ResumeProfile, ResumeTemplateId } from '../types';

export function profileToPlainText(profile: ResumeProfile): string {
  const lines: string[] = [];
  lines.push(profile.personal.fullName);
  lines.push(profile.personal.headline);
  lines.push(
    [
      profile.personal.email,
      profile.personal.phone,
      profile.personal.location,
      profile.personal.linkedin,
      profile.personal.github,
    ]
      .filter(Boolean)
      .join(' | ')
  );
  lines.push('');
  if (profile.personal.summary) {
    lines.push('SUMMARY');
    lines.push(profile.personal.summary);
    lines.push('');
  }
  if (profile.skills.length > 0) {
    lines.push('SKILLS');
    lines.push(profile.skills.join(', '));
    lines.push('');
  }
  if (profile.internships.length > 0) {
    lines.push('EXPERIENCE & INTERNSHIPS');
    for (const item of profile.internships) {
      lines.push(`${item.role} — ${item.company} (${item.duration}, ${item.location})`);
      for (const h of item.highlights) {
        lines.push(`• ${h}`);
      }
    }
    lines.push('');
  }
  if (profile.projects.length > 0) {
    lines.push('PROJECTS');
    for (const proj of profile.projects) {
      lines.push(`${proj.title} | ${proj.techStack} (${proj.duration})`);
      for (const h of proj.highlights) {
        lines.push(`• ${h}`);
      }
    }
    lines.push('');
  }
  if (profile.education.length > 0) {
    lines.push('EDUCATION');
    for (const edu of profile.education) {
      lines.push(
        `${edu.degree} (${edu.field}) — ${edu.institution} (${edu.startYear}–${edu.endYear}) | ${edu.gpa}`
      );
    }
    lines.push('');
  }
  if (profile.certifications.length > 0) {
    lines.push('CERTIFICATIONS');
    for (const cert of profile.certifications) {
      lines.push(`${cert.name} — ${cert.issuer} (${cert.year})`);
    }
  }
  return lines.join('\n');
}

export function downloadResumePdf(
  profile: ResumeProfile,
  template: ResumeTemplateId,
  fileLabel?: string
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;
  let y = 44;

  const palette =
    template === 'modern'
      ? { primary: [91, 33, 182] as const, accent: [79, 70, 229] as const, dark: [15, 23, 42] as const }
      : template === 'executive'
        ? { primary: [15, 23, 42] as const, accent: [37, 99, 235] as const, dark: [15, 23, 42] as const }
        : { primary: [17, 24, 39] as const, accent: [71, 85, 105] as const, dark: [17, 24, 39] as const };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 42) {
      doc.addPage();
      y = 44;
    }
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(26);
    y += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(palette.primary[0], palette.primary[1], palette.primary[2]);
    doc.text(title.toUpperCase(), marginX, y);
    y += 5;
    doc.setDrawColor(palette.primary[0], palette.primary[1], palette.primary[2]);
    doc.setLineWidth(template === 'minimal' ? 0.6 : 1);
    doc.line(marginX, y, pageWidth - marginX, y);
    y += 14;
  };

  const drawWrappedText = (
    text: string,
    x: number,
    maxWidth: number,
    fontSize: number,
    color: readonly [number, number, number],
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    lineHeightFactor = 1.35
  ) => {
    doc.setFont('helvetica', fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    const step = fontSize * lineHeightFactor;
    for (const line of lines) {
      ensureSpace(step);
      doc.text(line, x, y);
      y += step;
    }
  };

  // Header Banner / Block
  const hasPhoto =
    profile.personal.includePhoto &&
    profile.personal.photoDataUrl &&
    (profile.personal.photoDataUrl.startsWith('data:image/jpeg') ||
      profile.personal.photoDataUrl.startsWith('data:image/png') ||
      profile.personal.photoDataUrl.startsWith('data:image/webp'));

  const headerTextWidth = hasPhoto ? contentWidth - 78 : contentWidth;

  const headlineLines = profile.personal.headline
    ? (doc.splitTextToSize(profile.personal.headline, headerTextWidth) as string[]).slice(0, 2)
    : [];

  const contactItems = [
    profile.personal.email,
    profile.personal.phone,
    profile.personal.location,
    profile.personal.linkedin,
    profile.personal.github,
  ].filter(Boolean);

  const contactLines =
    contactItems.length > 0
      ? (doc.splitTextToSize(contactItems.join('  •  '), headerTextWidth) as string[])
      : [];

  const bannerHeight = Math.max(
    108,
    44 + 16 + headlineLines.length * 13 + contactLines.length * 11 + 18
  );

  if (template === 'modern') {
    doc.setFillColor(245, 243, 255);
    doc.rect(0, 0, pageWidth, bannerHeight, 'F');
    doc.setFillColor(91, 33, 182);
    doc.rect(0, 0, pageWidth, 5, 'F');
  } else if (template === 'executive') {
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, pageWidth, bannerHeight, 'F');
  }

  const headerTextColor =
    template === 'executive' ? ([255, 255, 255] as const) : palette.dark;
  const headerSubColor =
    template === 'executive' ? ([203, 213, 225] as const) : ([71, 85, 105] as const);

  if (hasPhoto) {
    try {
      const imgType = profile.personal.photoDataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(profile.personal.photoDataUrl, imgType, pageWidth - marginX - 60, 26, 60, 60);
    } catch {
      // Skip unsupported image formats gracefully
    }
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(headerTextColor[0], headerTextColor[1], headerTextColor[2]);
  doc.text(profile.personal.fullName || 'Candidate Name', marginX, y);
  y += 16;

  if (headlineLines.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(headerSubColor[0], headerSubColor[1], headerSubColor[2]);
    doc.text(headlineLines, marginX, y);
    y += headlineLines.length * 13;
  }

  if (contactLines.length > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(headerSubColor[0], headerSubColor[1], headerSubColor[2]);
    doc.text(contactLines, marginX, y);
    y += contactLines.length * 11;
  }

  if (template === 'executive' || template === 'modern') {
    y = Math.max(y + 12, bannerHeight + 16);
  } else {
    y += 10;
  }

  // Summary
  if (profile.personal.summary.trim()) {
    drawSectionTitle('Professional Summary');
    drawWrappedText(profile.personal.summary.trim(), marginX, contentWidth, 9.5, [51, 65, 85]);
    y += 4;
  }

  // Skills
  if (profile.skills.length > 0) {
    drawSectionTitle('Technical Skills');
    drawWrappedText(profile.skills.join('  •  '), marginX, contentWidth, 9.5, [30, 41, 59]);
    y += 4;
  }

  // Internships / Experience
  if (profile.internships.length > 0) {
    drawSectionTitle('Experience & Internships');
    for (const item of profile.internships) {
      ensureSpace(36);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const rightMeta = [item.duration, item.location].filter(Boolean).join(' · ');
      const metaWidth = rightMeta ? doc.getTextWidth(rightMeta) : 0;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      const titleMaxW = Math.max(180, contentWidth - metaWidth - 12);
      const roleLines = doc.splitTextToSize(`${item.role} — ${item.company}`, titleMaxW) as string[];
      doc.text(roleLines, marginX, y);

      if (rightMeta) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        doc.text(rightMeta, pageWidth - marginX - metaWidth, y);
      }
      y += roleLines.length * 13;

      for (const bullet of item.highlights.filter((b) => b.trim())) {
        drawWrappedText(`•  ${bullet}`, marginX + 8, contentWidth - 8, 9.2, [51, 65, 85]);
      }
      y += 5;
    }
  }

  // Projects
  if (profile.projects.length > 0) {
    drawSectionTitle('Key Projects');
    for (const proj of profile.projects) {
      ensureSpace(36);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(15, 23, 42);
      doc.text(proj.title, marginX, y);

      if (proj.duration) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(100, 116, 139);
        const w = doc.getTextWidth(proj.duration);
        doc.text(proj.duration, pageWidth - marginX - w, y);
      }
      y += 12;

      if (proj.techStack) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8.5);
        doc.setTextColor(palette.accent[0], palette.accent[1], palette.accent[2]);
        doc.text(proj.techStack, marginX, y);
        y += 12;
      }

      for (const bullet of proj.highlights.filter((b) => b.trim())) {
        drawWrappedText(`•  ${bullet}`, marginX + 8, contentWidth - 8, 9.2, [51, 65, 85]);
      }
      y += 5;
    }
  }

  // Education
  if (profile.education.length > 0) {
    drawSectionTitle('Education');
    for (const edu of profile.education) {
      ensureSpace(28);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.8);
      doc.setTextColor(15, 23, 42);
      doc.text(edu.degree, marginX, y);

      const dateStr = `${edu.startYear} – ${edu.endYear}`;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text(dateStr, pageWidth - marginX - doc.getTextWidth(dateStr), y);
      y += 12;

      const subLine = [edu.institution, edu.field, edu.gpa ? `Grade: ${edu.gpa}` : '']
        .filter(Boolean)
        .join('  ·  ');
      drawWrappedText(subLine, marginX, contentWidth, 9, [71, 85, 105]);
      y += 3;
    }
  }

  // Certifications
  if (profile.certifications.length > 0) {
    drawSectionTitle('Certifications');
    for (const cert of profile.certifications) {
      ensureSpace(18);
      const line = `${cert.name} — ${cert.issuer}${cert.year ? ` (${cert.year})` : ''}${
        cert.credentialId ? ` · ID: ${cert.credentialId}` : ''
      }`;
      drawWrappedText(`•  ${line}`, marginX + 4, contentWidth - 4, 9.2, [51, 65, 85]);
    }
  }

  const safeName = (profile.personal.fullName || 'Resume')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const suffix = fileLabel ? `-${fileLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : '';
  doc.save(`${safeName}${suffix}-resume.pdf`);
}
