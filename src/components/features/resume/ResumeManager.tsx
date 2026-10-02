import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Eye, User, GraduationCap, Briefcase, Settings, Award } from 'lucide-react';
import { getAdminAuthHeaders } from '../../../utils/adminAuth';
import { AdminGate } from '../../common/AdminGate';
import { ResumeToolbar } from './ResumeToolbar';
import { PersonalInfoCard } from './PersonalInfoCard';
import { ResumeSectionTable } from './ResumeSectionTable';
import { ResumeEditModal } from './ResumeEditModal';
import type { ResumeData, PersonalInfo } from '../../../types';

interface ResumeManagerContentProps {
  adminToken: string;
  onLogout: () => void;
  onAuthFailure: () => void;
}

const ResumeManagerContent: React.FC<ResumeManagerContentProps> = ({
  adminToken,
  onLogout,
  onAuthFailure,
}) => {
  const { t: translate } = useTranslation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const t = (key: string, fallbackOrOptions?: string | { fallback?: string; returnObjects?: boolean }): any => {
    const options = typeof fallbackOrOptions === 'string'
      ? { fallback: fallbackOrOptions }
      : fallbackOrOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (translate as any)(key, options);
  };

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [editingSection, setEditingSection] = useState<string>('');
  const [syncing, setSyncing] = useState(false);

  const fetchResumeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume/data', {
        headers: getAdminAuthHeaders(adminToken),
      });
      if (response.status === 401 || response.status === 503) {
        onAuthFailure();
        return;
      }
      const result = await response.json();

      if (result.success) {
        setResumeData(result.data);
      } else {
        console.error('Failed to fetch resume data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken, onAuthFailure]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert(t('common.resume.upload.pdfOnly', 'Please upload a PDF file'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: getAdminAuthHeaders(adminToken),
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.resume.upload.success', 'Resume uploaded and processed successfully'));
        fetchResumeData();
      } else {
        alert(t('common.resume.upload.error', 'Failed to process resume') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('common.resume.upload.error', 'Failed to upload resume'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleEdit = (section: string, item: unknown) => {
    setEditingItem(item as Record<string, unknown>);
    setEditingSection(section);
  };

  const handleSave = async (updatedItem: Record<string, unknown>, section: string) => {
    try {
      const url = updatedItem.id
        ? `/api/resume/data/${section}/${updatedItem.id}`
        : `/api/resume/data/${section}`;

      const method = updatedItem.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
        body: JSON.stringify(updatedItem),
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.saveSuccess', 'Saved successfully'));
        setEditingItem(null);
        setEditingSection('');
        fetchResumeData();
      } else {
        alert(t('common.saveError', 'Failed to save') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(t('common.saveError', 'Failed to save'));
    }
  };

  const handleDelete = async (section: string, id: string) => {
    if (!confirm(t('common.confirmDelete', 'Are you sure you want to delete this item?'))) {
      return;
    }

    try {
      const response = await fetch(`/api/resume/data/${section}/${id}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(adminToken),
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.deleteSuccess', 'Deleted successfully'));
        fetchResumeData();
      } else {
        alert(t('common.deleteError', 'Failed to delete') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(t('common.deleteError', 'Failed to delete'));
    }
  };

  const handleSync = async () => {
    if (!confirm(t('common.resume.syncConfirm', 'This will sync resume data with your website. Continue?'))) {
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/resume/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.resume.syncSuccess', 'Resume data synced successfully'));
      } else {
        alert(t('common.resume.syncError', 'Failed to sync resume data') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert(t('common.resume.syncError', 'Failed to sync resume data'));
    } finally {
      setSyncing(false);
    }
  };

  const handleValidate = async () => {
    try {
      const response = await fetch('/api/resume/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
      });

      const result = await response.json();

      if (result.success) {
        if (result.isValid) {
          alert(t('resume.validationSuccess', 'Resume data is valid'));
        } else {
          alert(t('resume.validationErrors', 'Validation errors') + ':\n' + result.errors.join('\n'));
        }
      } else {
        alert(t('resume.validationError', 'Failed to validate resume data'));
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert(t('resume.validationError', 'Failed to validate resume data'));
    }
  };

  const tabs = [
    { id: 'overview', label: t('common.resume.overview', 'Overview'), icon: Eye },
    { id: 'personal', label: t('common.resume.personal', 'Personal'), icon: User },
    { id: 'education', label: t('common.resume.education', 'Education'), icon: GraduationCap },
    { id: 'experience', label: t('common.resume.experience', 'Experience'), icon: Briefcase },
    { id: 'skills', label: t('common.resume.skills', 'Skills'), icon: Settings },
    { id: 'achievements', label: t('common.resume.achievements', 'Achievements'), icon: Award },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 pt-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pt-24 min-h-screen text-gray-900 dark:text-gray-100 theme-transition">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('common.resume.manager', 'Resume Manager')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('common.resume.managerDesc', 'Manage and synchronize your resume data')}
        </p>
      </div>

      {/* Toolbar actions */}
      <ResumeToolbar
        uploading={uploading}
        syncing={syncing}
        onFileUpload={handleFileUpload}
        onSync={handleSync}
        onValidate={handleValidate}
        onLogout={onLogout}
      />

      {/* Tab navigation */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mb-6 overflow-x-auto">
        <nav className="flex space-x-6 px-6 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Active Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t('common.resume.dataQuality', 'Data Quality')}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {t('common.resume.completeness', 'Completeness')}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t('common.resume.sections', 'Sections')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.resume.personalInfo', 'Personal Info')}</span>
                  <span className="text-gray-900 dark:text-white">{resumeData?.personal_info ? '✓' : '○'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.resume.education', 'Education')}</span>
                  <span className="text-gray-900 dark:text-white">{resumeData?.education?.length || 0} {t('common.items', 'items')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.resume.experience', 'Experience')}</span>
                  <span className="text-gray-900 dark:text-white">{resumeData?.work_experience?.length || 0} {t('common.items', 'items')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('common.resume.skills', 'Skills')}</span>
                  <span className="text-gray-900 dark:text-white">{resumeData?.skills?.length || 0} {t('common.items', 'items')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                {t('common.resume.syncStatus', 'Sync Status')}
              </h3>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">{t('common.resume.synced', 'Synchronized')}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {t('common.resume.lastSync', 'Last sync')}: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        )}

        {activeTab === 'personal' && (
          <PersonalInfoCard
            info={resumeData?.personal_info || null}
            onEdit={(info) => handleEdit('personal_info', info as unknown as PersonalInfo)}
          />
        )}

        {activeTab === 'education' && (
          <ResumeSectionTable
            title={t('common.resume.education', 'Education')}
            items={resumeData?.education || []}
            sectionKey="education"
            fields={['degree', 'major', 'school', 'start_date', 'end_date', 'gpa', 'description']}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            <ResumeSectionTable
              title={t('common.resume.workExperience', 'Work Experience')}
              items={resumeData?.work_experience || []}
              sectionKey="work_experience"
              fields={['position', 'company', 'start_date', 'end_date', 'location', 'description']}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ResumeSectionTable
              title={t('common.resume.researchExperience', 'Research Experience')}
              items={resumeData?.research_experience || []}
              sectionKey="research_experience"
              fields={['title', 'institution', 'lab_name', 'supervisor', 'start_date', 'end_date', 'description']}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ResumeSectionTable
              title={t('common.resume.languages', 'Languages')}
              items={resumeData?.languages || []}
              sectionKey="languages"
              fields={['language', 'proficiency', 'is_native']}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ResumeSectionTable
              title={t('common.resume.patents', 'Patents')}
              items={resumeData?.patents || []}
              sectionKey="patents"
              fields={['title', 'patent_number', 'applicant', 'public_date', 'status']}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
            <ResumeSectionTable
              title={t('common.resume.awards', 'Awards')}
              items={resumeData?.awards || []}
              sectionKey="awards"
              fields={['title', 'organization', 'award_date', 'level', 'description']}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>

      {/* Editing Modal */}
      <ResumeEditModal
        editingItem={editingItem}
        editingSection={editingSection}
        onClose={() => {
          setEditingItem(null);
          setEditingSection('');
        }}
        onSave={handleSave}
      />
    </div>
  );
};

export default function ResumeManager() {
  return (
    <AdminGate descriptionKey="common.adminAuth.resumeDescription">
      {({ token, logout, triggerAuthFailure }) => (
        <ResumeManagerContent
          adminToken={token}
          onLogout={logout}
          onAuthFailure={triggerAuthFailure}
        />
      )}
    </AdminGate>
  );
}
