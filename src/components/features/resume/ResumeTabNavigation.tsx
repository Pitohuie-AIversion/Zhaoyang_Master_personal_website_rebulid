import React from 'react';
import { Eye, User, GraduationCap, Briefcase, Settings, Award, type LucideIcon } from 'lucide-react';

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface ResumeTabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, fallbackOrOptions?: any) => string;
}

export const ResumeTabNavigation: React.FC<ResumeTabNavigationProps> = ({
  activeTab,
  onTabChange,
  t,
}) => {
  const tabs: TabItem[] = [
    { id: 'overview', label: t('common.resume.overview', 'Overview'), icon: Eye },
    { id: 'personal', label: t('common.resume.personal', 'Personal'), icon: User },
    { id: 'education', label: t('common.resume.education', 'Education'), icon: GraduationCap },
    { id: 'experience', label: t('common.resume.experience', 'Experience'), icon: Briefcase },
    { id: 'skills', label: t('common.resume.skills', 'Skills'), icon: Settings },
    { id: 'achievements', label: t('common.resume.achievements', 'Achievements'), icon: Award },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md mb-6 overflow-x-auto">
      <nav className="flex space-x-6 px-6 min-w-max">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
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
  );
};
