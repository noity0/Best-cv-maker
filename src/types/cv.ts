export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  photoUrl?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export type CVContactInfo = ContactInfo;

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  bullets: string[];
  metricsHighlighted?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  graduationYear: string;
  honors?: string;
}

export interface CourseItem {
  id: string;
  name: string;
  institution: string;
  completionYear?: string;
  credentialUrl?: string;
  credentialId?: string;
  skillsLearned?: string[];
  description?: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  impact?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year?: string;
}

export interface CVMemoryData {
  contact: ContactInfo;
  targetJobTitle: string;
  targetIndustry?: string;
  targetJobDescription?: string;
  professionalSummary: string;
  coreCompetencies: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: {
    technical: string[];
    domain: string[];
    soft: string[];
    tools: string[];
  };
  courses?: CourseItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages?: string[];
  showPhoto?: boolean;
  customNotes?: string;
}

export interface JobPreset {
  id: string;
  title: string;
  category: 'tech' | 'business' | 'healthcare' | 'design' | 'marketing' | 'finance' | 'operations' | 'general';
  level: 'Entry-Level' | 'Mid-Level' | 'Senior / Lead' | 'Executive';
  description: string;
  atsKeywords: string[];
  mustHaveMetrics: string[];
  recommendedCertifications: string[];
  sampleQuestions: string[];
  iconName: string;
}

export interface ChatMessage {
  id: string;
  role: 'assistant' | 'user' | 'system';
  content: string;
  timestamp: string;
  quickReplies?: string[];
  memoryExtractedAlert?: string;
  actionRequired?: 'select_job' | 'view_cv' | 'add_experience' | null;
}

export type TemplateId = 'executive' | 'ats_clean' | 'modern_tech' | 'creative_dual' | 'minimal_compact';
export type AccentColor = 'indigo' | 'emerald' | 'sapphire' | 'ruby' | 'slate';
