import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import type { FormErrors } from '../../../types';

export interface ContactBasicFieldsProps {
  name: string;
  email: string;
  subject: string;
  errors: FormErrors;
  formFieldConfig: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    subject: { label: string; placeholder: string };
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ContactBasicFields: React.FC<ContactBasicFieldsProps> = ({
  name,
  email,
  subject,
  errors,
  formFieldConfig,
  onChange,
}) => {
  return (
    <>
      {/* 姓名与邮箱 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 姓名 */}
        <div>
          <label
            htmlFor="name"
            className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
          >
            {formFieldConfig.name.label} *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? 'name-error' : undefined}
            value={name}
            onChange={onChange}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
              errors.name
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder={formFieldConfig.name.placeholder}
          />
          {errors.name && (
            <SimpleMotion
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id="name-error"
              className="mt-2 text-sm text-red-500 flex items-center"
              as="p"
            >
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.name}
            </SimpleMotion>
          )}
        </div>

        {/* 邮箱 */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
          >
            {formFieldConfig.email.label} *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            value={email}
            onChange={onChange}
            className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
              errors.email
                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800'
            } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
            placeholder={formFieldConfig.email.placeholder}
          />
          {errors.email && (
            <SimpleMotion
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              id="email-error"
              className="mt-2 text-xs sm:text-sm text-red-500 flex items-center leading-tight break-words"
              as="p"
            >
              <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="flex-1 min-w-0">{errors.email}</span>
            </SimpleMotion>
          )}
        </div>
      </div>

      {/* 主题 */}
      <div>
        <label
          htmlFor="subject"
          className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
        >
          {formFieldConfig.subject.label} *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? 'subject-error' : undefined}
          value={subject}
          onChange={onChange}
          className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
            errors.subject
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800'
          } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
          placeholder={formFieldConfig.subject.placeholder}
        />
        {errors.subject && (
          <SimpleMotion
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            id="subject-error"
            className="mt-2 text-xs sm:text-sm text-red-500 flex items-center leading-tight break-words"
            as="p"
          >
            <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="flex-1 min-w-0">{errors.subject}</span>
          </SimpleMotion>
        )}
      </div>
    </>
  );
};
