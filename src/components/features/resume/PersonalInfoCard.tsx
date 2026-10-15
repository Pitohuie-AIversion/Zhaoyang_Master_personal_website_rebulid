import React from 'react';
import { Edit, User, Globe } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import type { PersonalInfo } from '../../../types';

export interface PersonalInfoCardProps {
  info: PersonalInfo | null;
  onEdit: (info: PersonalInfo) => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ info, onEdit }) => {
  const { t, language } = useTranslation();

  if (!info) return null;

  const displayName =
    language === 'en'
      ? info.english_name || info.full_name
      : info.chinese_name || info.full_name;

  const displayBio = language === 'en' && info.bio_en ? info.bio_en : info.bio || info.bio_en;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border border-gray-200 dark:border-gray-700 theme-transition mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 flex-shrink-0 theme-transition" aria-hidden="true">
            <User className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
            {t('common.resume.personalInfo', { fallback: 'Personal Information' }) as string}
          </h3>
        </div>
        <button
          type="button"
          onClick={() => onEdit(info)}
          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
          title={t('common.edit', { fallback: 'Edit' }) as string}
          aria-label={t('common.edit', { fallback: 'Edit' }) as string}
        >
          <Edit size={16} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('common.resume.fullName', { fallback: 'Full Name' }) as string}
          </label>
          <p className="text-gray-900 dark:text-white font-medium">{displayName}</p>
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

        {info.website && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('common.resume.fields.website', { fallback: 'Website' }) as string}
            </label>
            <a
              href={info.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all inline-flex items-center gap-1"
            >
              <Globe size={14} className="flex-shrink-0" aria-hidden="true" />
              <span>{info.website}</span>
            </a>
          </div>
        )}

        {info.linkedin && (
          <div>
            <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
              {t('common.resume.fields.linkedin', { fallback: 'LinkedIn' }) as string}
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
              {t('common.resume.fields.github', { fallback: 'GitHub' }) as string}
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

      {displayBio && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm">
          <label className="block font-medium text-gray-500 dark:text-gray-400 mb-1">
            {t('common.resume.bio', { fallback: 'Bio' }) as string}
          </label>
          <p className="text-gray-900 dark:text-gray-200 whitespace-pre-wrap">{displayBio}</p>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoCard;
