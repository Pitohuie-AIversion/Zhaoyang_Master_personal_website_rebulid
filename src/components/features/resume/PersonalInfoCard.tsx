import React from 'react';
import { Edit } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import type { PersonalInfo } from '../../../types';

export interface PersonalInfoCardProps {
  info: PersonalInfo | null;
  onEdit: (info: PersonalInfo) => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ info, onEdit }) => {
  const { t } = useTranslation();

  if (!info) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 theme-transition mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('common.resume.personalInfo', { fallback: 'Personal Information' }) as string}
        </h3>
        <button
          onClick={() => onEdit(info)}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title={t('common.edit', { fallback: 'Edit' }) as string}
        >
          <Edit size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('common.resume.fullName', { fallback: 'Full Name' }) as string}
          </label>
          <p className="text-gray-900 dark:text-white font-medium">{info.full_name}</p>
        </div>

        {info.email && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('common.resume.email', { fallback: 'Email' }) as string}
            </label>
            <p className="text-gray-900 dark:text-white">{info.email}</p>
          </div>
        )}

        {info.phone && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('common.resume.phone', { fallback: 'Phone' }) as string}
            </label>
            <p className="text-gray-900 dark:text-white">{info.phone}</p>
          </div>
        )}

        {info.location && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('common.resume.location', { fallback: 'Location' }) as string}
            </label>
            <p className="text-gray-900 dark:text-white">{info.location}</p>
          </div>
        )}

        {info.linkedin && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              LinkedIn
            </label>
            <a
              href={info.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {info.linkedin}
            </a>
          </div>
        )}

        {info.github && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              GitHub
            </label>
            <a
              href={info.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all"
            >
              {info.github}
            </a>
          </div>
        )}
      </div>

      {info.bio && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
          <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('common.resume.bio', { fallback: 'Bio' }) as string}
          </label>
          <p className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap">{info.bio}</p>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;
