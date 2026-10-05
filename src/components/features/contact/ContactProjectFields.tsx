import React from 'react';
import { DollarSign, Clock } from 'lucide-react';
import type { FormFieldConfig } from '../../../services/contactService';

interface ContactProjectFieldsProps {
  budget: string;
  timeline: string;
  formFieldConfig: FormFieldConfig;
  defaultBudgetLabel: string;
  selectBudgetPlaceholder: string;
  defaultTimelineLabel: string;
  selectTimelinePlaceholder: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ContactProjectFields: React.FC<ContactProjectFieldsProps> = ({
  budget,
  timeline,
  formFieldConfig,
  defaultBudgetLabel,
  selectBudgetPlaceholder,
  defaultTimelineLabel,
  selectTimelinePlaceholder,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 预算范围 */}
      <div>
        <label
          htmlFor="budget"
          className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
        >
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 flex-shrink-0" />
          <span className="break-words">
            {formFieldConfig.budget?.label || defaultBudgetLabel}
          </span>
        </label>
        <select
          id="budget"
          name="budget"
          value={budget}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
        >
          <option value="">{selectBudgetPlaceholder}</option>
          {formFieldConfig.budget?.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 项目周期 */}
      <div>
        <label
          htmlFor="timeline"
          className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
        >
          <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 flex-shrink-0" />
          <span className="break-words">
            {formFieldConfig.timeline?.label || defaultTimelineLabel}
          </span>
        </label>
        <select
          id="timeline"
          name="timeline"
          value={timeline}
          onChange={onChange}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
        >
          <option value="">{selectTimelinePlaceholder}</option>
          {formFieldConfig.timeline?.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
