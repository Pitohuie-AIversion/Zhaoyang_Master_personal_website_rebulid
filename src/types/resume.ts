/**
 * 简历与履历模块领域类型定义
 */

export interface PersonalInfo {
  id: string;
  full_name: string;
  english_name?: string;
  chinese_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  bio?: string;
  bio_en?: string;
}

export interface Education {
  id: string;
  degree: string;
  degree_en?: string;
  major: string;
  major_en?: string;
  school: string;
  school_en?: string;
  start_date?: string;
  end_date?: string;
  gpa?: number;
  description?: string;
  description_en?: string;
  supervisor?: string;
  location?: string;
  status?: string;
}

export interface WorkExperience {
  id: string;
  position: string;
  position_en?: string;
  company: string;
  company_en?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  location?: string;
  description?: string;
  description_en?: string;
  achievements?: string[];
}

export interface ResearchExperience {
  id: string;
  title: string;
  title_en?: string;
  institution: string;
  institution_en?: string;
  lab_name?: string;
  supervisor?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  description_en?: string;
  keywords?: string[];
}

export interface Skill {
  id: string;
  category: string;
  skill_name: string;
  skill_name_en?: string;
  proficiency_level?: string;
  years_of_experience?: number;
  description?: string;
  is_primary?: boolean;
}

export interface Language {
  id: string;
  language: string;
  language_en?: string;
  proficiency?: string;
  is_native?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  name_en?: string;
  issuing_organization?: string;
  issue_date?: string;
  credential_id?: string;
  description?: string;
  is_active?: boolean;
}

export interface ProfessionalActivity {
  id: string;
  activity_type: string;
  title: string;
  title_en?: string;
  organization?: string;
  date?: string;
  description?: string;
  is_invited?: boolean;
}

export interface ResumePublication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  abstract?: string;
  status?: string;
}

export interface ResumePatent {
  id: string;
  title: string;
  patent_number: string;
  applicant?: string;
  public_date?: string;
  status?: string;
  type?: string;
  description?: string;
}

export interface ResumeAward {
  id: string;
  title: string;
  organization?: string;
  award_date?: string;
  level?: string;
  description?: string;
  certificate_number?: string;
}

export interface ResumeData {
  personal_info: PersonalInfo | null;
  education: Education[];
  work_experience: WorkExperience[];
  research_experience: ResearchExperience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  professional_activities: ProfessionalActivity[];
  publications: ResumePublication[];
  patents: ResumePatent[];
  awards: ResumeAward[];
}
