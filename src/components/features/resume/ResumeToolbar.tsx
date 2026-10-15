import React, { useRef } from 'react';
import { Upload, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ResumeToolbarProps {
  uploading: boolean;
  syncing: boolean;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSync: () => void;
  onValidate: () => void;
  onLogout: () => void;
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({
  uploading,
  syncing,
  onFileUpload,
  onSync,
  onValidate,
  onLogout,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 border border-gray-200 dark:border-gray-700 theme-transition">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('common.resume.dataManagement', { fallback: 'Resume Actions' }) as string}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('common.resume.dataManagementDesc', { fallback: 'Upload, validate, or sync resume records' }) as string}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={onFileUpload}
            className="hidden"
            id="resume-pdf-upload"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <Upload size={16} className={`mr-2 ${uploading ? 'animate-bounce' : ''}`} />
            {uploading
              ? (t('common.resume.uploading', { fallback: 'Uploading...' }) as string)
              : (t('common.resume.uploadPDF', { fallback: 'Upload PDF' }) as string)}
          </button>

          <button
            onClick={onSync}
            disabled={syncing}
            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
            {syncing
              ? (t('common.resume.syncing', { fallback: 'Syncing...' }) as string)
              : (t('common.resume.sync', { fallback: 'Sync to Site' }) as string)}
          </button>

          <button
            onClick={onValidate}
            className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
          >
            <CheckCircle size={16} className="mr-2" />
            {t('common.resume.validate', { fallback: 'Validate' }) as string}
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm"
            title={t('common.adminAuth.lock') as string}
          >
            <Lock size={15} className="mr-1.5" />
            {t('common.adminAuth.lock') as string}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeToolbar;
