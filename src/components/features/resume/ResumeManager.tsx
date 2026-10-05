import React, { useState } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import { AdminGate } from '../../common/AdminGate';
import { ResumeToolbar } from './ResumeToolbar';
import { ResumeEditModal } from './ResumeEditModal';
import { ResumeOverviewCards } from './ResumeOverviewCards';
import { ResumeTabNavigation } from './ResumeTabNavigation';
import { ResumeSectionsContent } from './ResumeSectionsContent';
import { useResumeManager } from './useResumeManager';

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

  const [activeTab, setActiveTab] = useState('overview');

  const {
    resumeData,
    loading,
    uploading,
    syncing,
    editingItem,
    editingSection,
    handleFileUpload,
    handleEdit,
    handleSave,
    handleDelete,
    handleSync,
    handleValidate,
    closeEditModal,
  } = useResumeManager({
    adminToken,
    onAuthFailure,
    t,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 pt-24" role="status">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span className="sr-only">{t('common.loading', 'Loading...') as string}</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pt-24 min-h-screen text-gray-900 dark:text-gray-100 theme-transition">
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
      <ResumeTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        t={t}
      />

      {/* Active Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' ? (
          <ResumeOverviewCards
            resumeData={resumeData}
            t={t}
          />
        ) : (
          <ResumeSectionsContent
            activeTab={activeTab}
            resumeData={resumeData}
            t={t}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Editing Modal */}
      <ResumeEditModal
        editingItem={editingItem}
        editingSection={editingSection}
        onClose={closeEditModal}
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
