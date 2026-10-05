import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';

export interface ResumeEditModalProps {
  editingItem: Record<string, unknown> | null;
  editingSection: string;
  onClose: () => void;
  onSave: (item: Record<string, unknown>, section: string) => Promise<void> | void;
}

export const ResumeEditModal: React.FC<ResumeEditModalProps> = ({
  editingItem,
  editingSection,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
    }
  }, [editingItem]);

  if (!editingItem || !editingSection) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(formData, editingSection);
    } finally {
      setSaving(false);
    }
  };

  const sectionTitleMap: Record<string, string> = {
    personal_info: 'common.resume.personalInfo',
    education: 'common.resume.education',
    work_experience: 'common.resume.workExperience',
    research_experience: 'common.resume.researchExperience',
    skills: 'common.resume.skills',
    languages: 'common.resume.languages',
    publications: 'common.resume.publications',
    patents: 'common.resume.patents',
    awards: 'common.resume.awards',
  };

  const getSectionTitle = (section: string): string => {
    const key = sectionTitleMap[section] || `common.resume.${section}`;
    const translated = t(key);
    if (translated && translated !== key) return translated as string;
    return section.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getFieldLabel = (field: string): string => {
    const key = `common.resume.fields.${field}`;
    const translated = t(key);
    if (translated && translated !== key) return translated as string;
    return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const fields = Object.keys(formData).filter(
    (key) => key !== 'id' && key !== 'created_at' && key !== 'updated_at'
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700 theme-transition">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {formData.id
              ? (t('common.edit', { fallback: 'Edit' }) as string)
              : (t('common.add', { fallback: 'Add' }) as string)}{' '}
            {getSectionTitle(editingSection)}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {getFieldLabel(field)}
              </label>

              {Array.isArray(formData[field]) ? (
                <textarea
                  value={((formData[field] as string[]) || []).join(', ')}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  rows={3}
                />
              ) : typeof formData[field] === 'boolean' ? (
                <select
                  value={formData[field] ? 'true' : 'false'}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value === 'true',
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="true">{t('common.confirmYes', { fallback: 'Yes' }) as string}</option>
                  <option value="false">{t('common.confirmNo', { fallback: 'No' }) as string}</option>
                </select>
              ) : (
                <input
                  type="text"
                  value={(formData[field] as string) || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field]: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              )}
            </div>
          ))}

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm font-medium"
            >
              {t('common.cancel', { fallback: 'Cancel' }) as string}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-medium shadow-sm"
            >
              {saving
                ? (t('common.saving', { fallback: 'Saving...' }) as string)
                : (t('common.save', { fallback: 'Save' }) as string)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResumeEditModal;
