import React from 'react';
import { XCircle, Mail } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import type { ContactFormData } from '../../../types';

interface ContactErrorBannerProps {
  errorTitle: string;
  errorMessage: string;
  targetEmail: string;
  formData: ContactFormData;
  language: string;
}

export const ContactErrorBanner: React.FC<ContactErrorBannerProps> = ({
  errorTitle,
  errorMessage,
  targetEmail,
  formData,
  language,
}) => {
  const mailtoSubject = encodeURIComponent(
    formData.subject || (language === 'zh' ? '学术咨询' : 'Academic Inquiry')
  );
  const mailtoBody = encodeURIComponent(
    `${language === 'zh' ? '姓名' : 'Name'}: ${formData.name}\n` +
      `${language === 'zh' ? '邮箱' : 'Email'}: ${formData.email}\n\n` +
      `${language === 'zh' ? '内容' : 'Message'}:\n${formData.message}`
  );

  return (
    <SimpleMotion
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="mt-6 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800"
    >
      <div className="flex items-center">
        <div className="p-2 rounded-full mr-4 bg-red-100 dark:bg-red-800/30 flex-shrink-0">
          <XCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="font-semibold mb-1">{errorTitle}</h4>
          <p className="text-sm opacity-90">{errorMessage}</p>
        </div>
      </div>
      <a
        href={`mailto:${targetEmail}?subject=${mailtoSubject}&body=${mailtoBody}`}
        className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap self-stretch sm:self-auto justify-center"
      >
        <Mail className="w-4 h-4 mr-2" />
        {language === 'zh' ? '使用邮件客户端发送' : 'Send via Email Client'}
      </a>
    </SimpleMotion>
  );
};
