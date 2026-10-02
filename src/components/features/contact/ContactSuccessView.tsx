import React from 'react';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { UnifiedButton } from '../../common/UnifiedButton';

interface ContactSuccessViewProps {
  submitMessage: string;
  successTitle: string;
  sendAnotherText: string;
  onReset: () => void;
}

export const ContactSuccessView: React.FC<ContactSuccessViewProps> = ({
  submitMessage,
  successTitle,
  sendAnotherText,
  onReset,
}) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 z-10">
      <SimpleMotion
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 dark:text-green-400">
          <CheckCircle className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {successTitle}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
          {submitMessage}
        </p>
        <UnifiedButton
          onClick={onReset}
          variant="primary"
          size="lg"
          icon={ArrowLeft}
          iconPosition="left"
        >
          {sendAnotherText}
        </UnifiedButton>
      </SimpleMotion>
    </div>
  );
};
