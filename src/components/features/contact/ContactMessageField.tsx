import React from 'react';
import { AlertCircle } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';

export interface ContactMessageFieldProps {
  message: string;
  error?: string;
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const ContactMessageField: React.FC<ContactMessageFieldProps> = ({
  message,
  error,
  label,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      <label
        htmlFor="message"
        className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
      >
        {label} *
      </label>
      <textarea
        id="message"
        name="message"
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'message-error' : undefined}
        rows={6}
        value={message}
        onChange={onChange}
        className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none ${
          error
            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
            : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800'
        } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
        placeholder={placeholder}
      />
      {error && (
        <SimpleMotion
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          id="message-error"
          className="mt-2 text-xs sm:text-sm text-red-500 flex items-center leading-tight break-words"
          as="p"
        >
          <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="flex-1 min-w-0">{error}</span>
        </SimpleMotion>
      )}
    </div>
  );
};
