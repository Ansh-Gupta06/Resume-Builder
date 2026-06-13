import { generateId } from '@/utils'
import type { NormalizedResume } from './types'
import type {
  JadeResume,
  ResumeSection,
  ThemeConfig,
  PersonalInfoContent,
  SummaryContent,
  WorkExperienceContent,
  EducationContent,
  SkillsContent,
  ProjectsContent,
  CertificationsContent,
  LanguagesContent,
  CustomContent,
} from './resume-types'

const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1a1a2e',
  accentColor: '#6271f4',
  fontFamily: 'Inter, sans-serif',
  fontSize: '14px',
  lineSpacing: 1.5,
  margin: { top: 20, right: 20, bottom: 20, left: 20 },
  sectionSpacing: 16,
  avatarStyle: 'circle',
}

function makeSection(
  type: string,
  title: string,
  order: number,
  content: ResumeSection['content'],
  visible = true
): ResumeSection {
  const now = new Date()
  return {
    id: generateId(),
    resumeId: '',
    type,
    title,
    sortOrder: order,
    visible,
    content,
    createdAt: now,
    updatedAt: now,
  }
}

export function toJadeResume(resume: NormalizedResume): JadeResume {
  const pi = resume.personalInfo
  const now = new Date()

  const personalInfoContent: PersonalInfoContent = {
    fullName: pi.fullName,
    jobTitle: pi.title,
    email: pi.email,
    phone: pi.phone,
    location: pi.location,
    website: pi.website || undefined,
    linkedin: pi.linkedin || undefined,
    github: pi.github || undefined,
    wechat: pi.wechat || undefined,
    age: pi.age || undefined,
    gender: pi.gender || undefined,
    hometown: pi.hometown || undefined,
    maritalStatus: pi.maritalStatus || undefined,
    yearsOfExperience: pi.yearsOfExperience || undefined,
    educationLevel: pi.educationLevel || undefined,
    avatar: pi.avatar || undefined,
  }

  const sections: ResumeSection[] = [
    makeSection('personal_info', 'Personal Info', 0, personalInfoContent),
  ]

  let order = 1

  for (const key of resume.visibleSections) {
    if (key === 'summary' && pi.summary) {
      sections.push(makeSection('summary', 'Summary', order++, { text: pi.summary } as SummaryContent))
    }

    if (key === 'experience' && resume.experience.length > 0) {
      const content: WorkExperienceContent = {
        items: resume.experience.map(e => ({
          id: e.id,
          company: e.company,
          position: e.position,
          location: e.location || undefined,
          startDate: e.period.split('â€“')[0]?.trim() ?? '',
          endDate: e.period.includes('Present') ? null : (e.period.split('â€“')[1]?.trim() ?? null),
          current: e.period.includes('Present'),
          description: e.description,
          technologies: [],
          highlights: e.highlights,
        })),
      }
      sections.push(makeSection('work_experience', 'Experience', order++, content))
    }

    if (key === 'education' && resume.education.length > 0) {
      const content: EducationContent = {
        items: resume.education.map(e => {
          const parts = e.degree.split(' in ')
          return {
            id: e.id,
            institution: e.institution,
            degree: parts[0] ?? e.degree,
            field: parts[1] ?? '',
            location: e.location || undefined,
            startDate: e.period.split('â€“')[0]?.trim() ?? '',
            endDate: e.period.split('â€“')[1]?.trim() ?? '',
            gpa: e.gpa || undefined,
            highlights: e.highlights,
          }
        }),
      }
      sections.push(makeSection('education', 'Education', order++, content))
    }

    if (key === 'skills' && resume.skills.length > 0) {
      const content: SkillsContent = {
        categories: resume.skills.map(s => ({
          id: s.id,
          name: s.category,
          skills: s.items,
        })),
      }
      sections.push(makeSection('skills', 'Skills', order++, content))
    }

    if (key === 'projects' && resume.projects.length > 0) {
      const content: ProjectsContent = {
        items: resume.projects.map(p => ({
          id: p.id,
          name: p.name,
          url: p.url || undefined,
          startDate: p.period.split('â€“')[0]?.trim() || undefined,
          endDate: p.period.split('â€“')[1]?.trim() || undefined,
          description: p.description,
          technologies: p.technologies,
          highlights: p.highlights,
        })),
      }
      sections.push(makeSection('projects', 'Projects', order++, content))
    }

    if (key === 'certifications' && resume.certifications.length > 0) {
      const content: CertificationsContent = {
        items: resume.certifications.map(c => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer,
          date: c.date,
          url: c.url || undefined,
        })),
      }
      sections.push(makeSection('certifications', 'Certifications', order++, content))
    }

    if (key === 'languages' && resume.languages.length > 0) {
      const content: LanguagesContent = {
        items: resume.languages.map(l => ({
          id: l.id,
          language: l.language,
          proficiency: l.proficiency,
        })),
      }
      sections.push(makeSection('languages', 'Languages', order++, content))
    }

    if (key === 'awards' && resume.awards.length > 0) {
      const content: CustomContent = {
        items: resume.awards.map(a => ({
          id: a.id,
          title: a.title,
          subtitle: a.issuer || undefined,
          date: a.date || undefined,
          description: a.description,
        })),
      }
      sections.push(makeSection('custom', 'Awards', order++, content))
    }
  }

  return {
    id: generateId(),
    userId: '',
    title: '',
    template: '',
    themeConfig: DEFAULT_THEME,
    isDefault: false,
    language: 'en',
    sections,
    createdAt: now,
    updatedAt: now,
  }
}
