import React from 'react';
import { PersonalInfoCard } from './PersonalInfoCard';
import { ResumeSectionTable } from './ResumeSectionTable';
import type { ResumeData, PersonalInfo } from '../../../types';

interface ResumeSectionsContentProps {
  activeTab: string;
  resumeData: ResumeData | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, fallbackOrOptions?: any) => string;
  onEdit: (section: string, item: unknown) => void;
  onDelete: (section: string, id: string) => void;
}

export const ResumeSectionsContent: React.FC<ResumeSectionsContentProps> = ({
  activeTab,
  resumeData,
  t,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {activeTab === 'personal' && (
        <PersonalInfoCard
          info={resumeData?.personal_info || null}
          onEdit={(info) => onEdit('personal_info', info as unknown as PersonalInfo)}
        />
      )}

      {activeTab === 'education' && (
        <ResumeSectionTable
          title={t('common.resume.education', 'Education')}
          items={resumeData?.education || []}
          sectionKey="education"
          fields={['degree', 'major', 'school', 'start_date', 'end_date', 'gpa', 'description']}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      {activeTab === 'experience' && (
        <div className="space-y-6">
          <ResumeSectionTable
            title={t('common.resume.workExperience', 'Work Experience')}
            items={resumeData?.work_experience || []}
            sectionKey="work_experience"
            fields={['position', 'company', 'start_date', 'end_date', 'location', 'description']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <ResumeSectionTable
            title={t('common.resume.researchExperience', 'Research Experience')}
            items={resumeData?.research_experience || []}
            sectionKey="research_experience"
            fields={['title', 'institution', 'lab_name', 'supervisor', 'start_date', 'end_date', 'description']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}

      {activeTab === 'skills' && (
        <div className="space-y-6">
          <ResumeSectionTable
            title={t('common.resume.skills', 'Skills')}
            items={resumeData?.skills || []}
            sectionKey="skills"
            fields={['skill_name', 'category', 'proficiency_level', 'years_of_experience', 'description']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <ResumeSectionTable
            title={t('common.resume.languages', 'Languages')}
            items={resumeData?.languages || []}
            sectionKey="languages"
            fields={['language', 'proficiency', 'is_native']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="space-y-6">
          <ResumeSectionTable
            title={t('common.resume.publications', 'Publications')}
            items={resumeData?.publications || []}
            sectionKey="publications"
            fields={['title', 'journal', 'year', 'doi', 'status']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <ResumeSectionTable
            title={t('common.resume.patents', 'Patents')}
            items={resumeData?.patents || []}
            sectionKey="patents"
            fields={['title', 'patent_number', 'applicant', 'public_date', 'status']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
          <ResumeSectionTable
            title={t('common.resume.awards', 'Awards')}
            items={resumeData?.awards || []}
            sectionKey="awards"
            fields={['title', 'organization', 'award_date', 'level', 'description']}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
    </>
  );
};
