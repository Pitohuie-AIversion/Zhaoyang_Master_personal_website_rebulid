import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { Upload, FileText, User, GraduationCap, Briefcase, Award, Settings, Download, Eye, Edit, Trash2, Plus, X } from 'lucide-react';

interface ResumeData {
  personal_info: PersonalInfo | null;
  education: Education[];
  work_experience: WorkExperience[];
  research_experience: ResearchExperience[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  professional_activities: ProfessionalActivity[];
  publications: Publication[];
  patents: Patent[];
  awards: Award[];
}

interface PersonalInfo {
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

interface Education {
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

interface WorkExperience {
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

interface ResearchExperience {
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

interface Skill {
  id: string;
  category: string;
  skill_name: string;
  skill_name_en?: string;
  proficiency_level?: string;
  years_of_experience?: number;
  description?: string;
  is_primary?: boolean;
}

interface Language {
  id: string;
  language: string;
  language_en?: string;
  proficiency?: string;
  is_native?: boolean;
}

interface Certification {
  id: string;
  name: string;
  name_en?: string;
  issuing_organization?: string;
  issue_date?: string;
  credential_id?: string;
  description?: string;
  is_active?: boolean;
}

interface ProfessionalActivity {
  id: string;
  activity_type: string;
  title: string;
  title_en?: string;
  organization?: string;
  date?: string;
  description?: string;
  is_invited?: boolean;
}

interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal?: string;
  year?: number;
  doi?: string;
  abstract?: string;
  status?: string;
}

interface Patent {
  id: string;
  title: string;
  patent_number: string;
  applicant?: string;
  public_date?: string;
  status?: string;
  type?: string;
  description?: string;
}

interface Award {
  id: string;
  title: string;
  organization?: string;
  award_date?: string;
  level?: string;
  description?: string;
  certificate_number?: string;
}

const ResumeManager: React.FC = () => {
  const { t: translate, language } = useTranslation();
  // Wrapper to keep existing call style (key, fallback) working with our translation provider
  const t = (key: string, fallbackOrOptions?: string | { fallback?: string; returnObjects?: boolean }): any => {
    const options = typeof fallbackOrOptions === 'string'
      ? { fallback: fallbackOrOptions }
      : fallbackOrOptions;
    return (translate as any)(key, options);
  };
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [editingSection, setEditingSection] = useState<string>('');
  const [syncing, setSyncing] = useState(false);

  // Fetch resume data on component mount
  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const response = await fetch('/api/resume/data');
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
  };

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
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.resume.upload.success', 'Resume uploaded and processed successfully'));
        fetchResumeData(); // Refresh data
      } else {
        alert(t('common.resume.upload.error', 'Failed to process resume') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('common.resume.upload.error', 'Failed to upload resume'));
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  const handleEdit = (section: string, item: unknown) => {
    setEditingItem(item as Record<string, unknown>);
    setEditingSection(section);
  };

  const handleSave = async () => {
    if (!editingItem || !editingSection) return;

    try {
      const typedItem = editingItem as Record<string, unknown>;
      const url = typedItem.id 
        ? `/api/resume/data/${editingSection}/${typedItem.id}`
        : `/api/resume/data/${editingSection}`;
      
      const method = typedItem.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(typedItem),
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.saveSuccess', 'Saved successfully'));
        setEditingItem(null);
        setEditingSection('');
        fetchResumeData(); // Refresh data
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
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.deleteSuccess', 'Deleted successfully'));
        fetchResumeData(); // Refresh data
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

  const renderPersonalInfo = () => {
    if (!resumeData?.personal_info) return null;

    const info = resumeData.personal_info;
    const currentLang = language;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {t('common.resume.personalInfo', 'Personal Information')}
          </h3>
          <button
            onClick={() => handleEdit('personal_info', info)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.resume.fullName', 'Full Name')}
            </label>
            <p className="text-gray-900">{info.full_name}</p>
          </div>
          
          {info.email && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.resume.email', 'Email')}
              </label>
              <p className="text-gray-900">{info.email}</p>
            </div>
          )}
          
          {info.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.resume.phone', 'Phone')}
              </label>
              <p className="text-gray-900">{info.phone}</p>
            </div>
          )}
          
          {info.location && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.resume.location', 'Location')}
              </label>
              <p className="text-gray-900">{info.location}</p>
            </div>
          )}
          
          {info.linkedin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.social.linkedin') as string}
              </label>
              <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {info.linkedin}
              </a>
            </div>
          )}
          
          {info.github && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('common.social.github') as string}
              </label>
              <a href={info.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {info.github}
              </a>
            </div>
          )}
        </div>
        
        {info.bio && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('common.resume.bio', 'Bio')}
            </label>
            <p className="text-gray-900 whitespace-pre-wrap">{info.bio}</p>
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, items: unknown[], sectionKey: string, fields: string[]) => {
    if (!items || items.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
            <button
              onClick={() => handleEdit(sectionKey, {})}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus size={16} />
              {t('common.add', 'Add')}
            </button>
          </div>
          <p className="text-gray-500 text-center py-8">{t('common.noData', 'No data available')}</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
          <button
            onClick={() => handleEdit(sectionKey, {})}
            className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus size={16} />
            {t('common.add', 'Add')}
          </button>
        </div>
        
        <div className="space-y-4">
          {items.map((item) => {
            const typedItem = item as Record<string, unknown>;
            return (
              <div key={typedItem.id as string} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    {typedItem.title as string || typedItem.degree as string || typedItem.position as string || typedItem.skill_name as string || typedItem.language as string || typedItem.name as string}
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(sectionKey, item)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(sectionKey, typedItem.id as string)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  {fields.map((field) => {
                    const value = typedItem[field];
                    if (!value) return null;
                    
                    return (
                      <div key={field}>
                        <span className="font-medium">{field.replace('_', ' ')}: </span>
                        <span>{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderEditingModal = () => {
    if (!editingItem || !editingSection) return null;

    const renderFormFields = () => {
      const fields = Object.keys(editingItem).filter(key => key !== 'id' && key !== 'created_at' && key !== 'updated_at');
      
      return fields.map((field) => (
        <div key={field} className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </label>
          {Array.isArray(editingItem[field]) ? (
            <textarea
              value={editingItem[field].join(', ')}
              onChange={(e) => setEditingItem({
                ...editingItem,
                [field]: e.target.value.split(',').map(s => s.trim()).filter(s => s)
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          ) : typeof editingItem[field] === 'boolean' ? (
            <select
              value={editingItem[field] ? 'true' : 'false'}
              onChange={(e) => setEditingItem({
                ...editingItem,
                [field]: e.target.value === 'true'
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">{t('common.confirmYes', { fallback: 'Yes' }) as string}</option>
              <option value="false">{t('common.confirmNo', { fallback: 'No' }) as string}</option>
            </select>
          ) : (
            <input
              type="text"
              value={(editingItem as Record<string, unknown>)[field] as string || ''}
              onChange={(e) => setEditingItem({
                ...(editingItem as Record<string, unknown>),
                [field]: e.target.value
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      ));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {(editingItem as Record<string, unknown>).id ? (t('common.edit', { fallback: 'Edit' }) as string) : (t('common.add', { fallback: 'Add' }) as string)} {editingSection}
            </h3>
            <button
              onClick={() => {
                setEditingItem(null);
                setEditingSection('');
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            {renderFormFields()}
            
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setEditingItem(null);
                  setEditingSection('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t('common.save', 'Save')}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('common.resume.manager', 'Resume Manager')}
        </h1>
        <p className="text-gray-600">
          {t('common.resume.managerDesc', 'Manage and synchronize your resume data')}
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {t('common.resume.upload.title', 'Upload Resume PDF')}
            </h3>
            <p className="text-gray-600 text-sm">
              {t('common.resume.upload.desc', 'Upload your resume PDF to extract and store data automatically')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleValidate}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileText size={16} />
              {t('common.resume.validate', 'Validate Data')}
            </button>
            <button
              onClick={handleSync}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {syncing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {t('common.resume.syncing', 'Syncing...')}
                </>
              ) : (
                <>
                  <Download size={16} />
                  {t('common.resume.sync', 'Sync with Website')}
                </>
              )}
            </button>
            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <button
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('common.resume.upload.uploading', 'Uploading...')}
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    {t('common.resume.upload.selectFile', 'Select PDF File')}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t('common.resume.dataQuality', 'Data Quality')}
                </h3>
                <FileText className="text-blue-600" size={20} />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {t('common.resume.completeness', 'Completeness')}
                  </span>
                  <span className="text-sm font-medium text-gray-900">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t('common.resume.sections', 'Sections')}
                </h3>
                <Settings className="text-green-600" size={20} />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('common.resume.personalInfo', 'Personal Info')}</span>
                  <span className="text-sm text-gray-900">{resumeData?.personal_info ? '✓' : '○'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('common.resume.education', 'Education')}</span>
                  <span className="text-sm text-gray-900">{resumeData?.education?.length || 0} {t('common.items', 'items')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('common.resume.experience', 'Experience')}</span>
                  <span className="text-sm text-gray-900">{resumeData?.work_experience?.length || 0} {t('common.items', 'items')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('common.resume.skills', 'Skills')}</span>
                  <span className="text-sm text-gray-900">{resumeData?.skills?.length || 0} {t('common.items', 'items')}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t('common.resume.syncStatus', 'Sync Status')}
                </h3>
                <Award className="text-purple-600" size={20} />
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm">{t('common.resume.synced', 'Synchronized')}</span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {t('common.resume.lastSync', 'Last sync')}: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'personal' && renderPersonalInfo()}

        {activeTab === 'education' && (
          renderSection(
            t('common.resume.education', 'Education'),
            resumeData?.education || [],
            'education',
            ['degree', 'major', 'school', 'start_date', 'end_date', 'gpa', 'description']
          )
        )}

        {activeTab === 'experience' && (
          <div className="space-y-6">
            {renderSection(
              t('common.resume.workExperience', 'Work Experience'),
              resumeData?.work_experience || [],
              'work_experience',
              ['position', 'company', 'start_date', 'end_date', 'location', 'description']
            )}
            {renderSection(
              t('common.resume.researchExperience', 'Research Experience'),
              resumeData?.research_experience || [],
              'research_experience',
              ['title', 'institution', 'lab_name', 'supervisor', 'start_date', 'end_date', 'description']
            )}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6">
            {renderSection(
              t('common.resume.skills', 'Skills'),
              resumeData?.skills || [],
              'skills',
              ['skill_name', 'category', 'proficiency_level', 'years_of_experience', 'description']
            )}
            {renderSection(
              t('common.resume.languages', 'Languages'),
              resumeData?.languages || [],
              'languages',
              ['language', 'proficiency', 'is_native']
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-6">
            {renderSection(
              t('common.resume.publications', 'Publications'),
              resumeData?.publications || [],
              'publications',
              ['title', 'journal', 'year', 'doi', 'status']
            )}
            {renderSection(
              t('common.resume.patents', 'Patents'),
              resumeData?.patents || [],
              'patents',
              ['title', 'patent_number', 'applicant', 'public_date', 'status']
            )}
            {renderSection(
              t('common.resume.awards', 'Awards'),
              resumeData?.awards || [],
              'awards',
              ['title', 'organization', 'award_date', 'level', 'description']
            )}
          </div>
        )}
      </div>

      {/* Editing Modal */}
      {renderEditingModal()}
    </div>
  );
};

export default ResumeManager;
