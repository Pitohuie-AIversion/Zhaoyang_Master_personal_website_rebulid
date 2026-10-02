import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Send, AlertCircle } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import { LazyAnimationContainerComponent as AnimationContainer } from '../../animations/LazyAnimations';
import { UnifiedButton } from '../../common/UnifiedButton';
import {
  submitContactForm,
  validateContactForm,
  hasValidationErrors,
  getFormFieldConfig,
  getCollaborationTypes,
} from '../../../services/contactService';
import type { ContactFormData, FormErrors, SubmitStatus } from '../../../types';
import { ContactSuccessView } from './ContactSuccessView';
import { CollaborationTypeSelector } from './CollaborationTypeSelector';
import { ContactProjectFields } from './ContactProjectFields';
import { ContactErrorBanner } from './ContactErrorBanner';

export interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { t, language } = useTranslation();
  const [searchParams] = useSearchParams();

  const formFieldConfig = getFormFieldConfig((key: string) => t(key) as string);
  const collaborationTypes = getCollaborationTypes((key: string) => t(key) as string);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    collaborationType: '',
    budget: '',
    timeline: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [selectedCollaboration, setSelectedCollaboration] = useState<string>('');

  useEffect(() => {
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');

    if (subject) {
      setFormData((prev) => ({ ...prev, subject }));
    }

    if (type) {
      setSelectedCollaboration(type);
      setFormData((prev) => ({ ...prev, collaborationType: type }));
    }
  }, [searchParams]);

  const validateForm = (): FormErrors => {
    return validateContactForm(formData, t as (key: string) => string);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCollaborationSelect = (typeId: string) => {
    setSelectedCollaboration(typeId);
    setFormData((prev) => ({
      ...prev,
      collaborationType: typeId,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) {
      toast.error(t('contact.form.validationError') as string);
      return;
    }

    setSubmitStatus('loading');

    try {
      const result = await submitContactForm(formData, t as (key: string) => string);

      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        onSuccess?.();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      setSubmitStatus('error');
      const errorMessage =
        error instanceof Error
          ? error.message
          : (t('contact.form.submitError') as string);
      setSubmitMessage(errorMessage);

      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
    }
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      collaborationType: '',
      budget: '',
      timeline: '',
    });
    setSelectedCollaboration('');
    setSubmitStatus('idle');
    setSubmitMessage('');
  };

  return (
    <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition relative overflow-hidden min-h-[600px]">
      {submitStatus === 'success' ? (
        <ContactSuccessView
          submitMessage={submitMessage}
          successTitle={t('contact.form.success') as string}
          sendAnotherText={t('contact.form.sendAnother') as string}
          onReset={handleReset}
        />
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">
            {t('contact.sendMessage') as string}
          </h2>

          {/* 合作类型选择 */}
          <AnimationContainer delay={0.4}>
            <CollaborationTypeSelector
              title={t('contact.collaborationType') as string}
              types={collaborationTypes}
              selectedType={selectedCollaboration}
              onSelect={handleCollaborationSelect}
            />
          </AnimationContainer>

          <AnimationContainer delay={0.6}>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* 基本信息 */}
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
                    value={formData.name}
                    onChange={handleInputChange}
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                  value={formData.subject}
                  onChange={handleInputChange}
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

              {/* 项目详情 (预算与周期) */}
              {selectedCollaboration && (
                <ContactProjectFields
                  budget={formData.budget || ''}
                  timeline={formData.timeline || ''}
                  formFieldConfig={formFieldConfig}
                  defaultBudgetLabel={t('contact.form.budget.label') as string}
                  selectBudgetPlaceholder={t('contact.form.selectBudget') as string}
                  defaultTimelineLabel={t('contact.form.timeline.label') as string}
                  selectTimelinePlaceholder={t('contact.form.selectTimeline') as string}
                  onChange={handleInputChange}
                />
              )}

              {/* 消息内容 */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words"
                >
                  {formFieldConfig.message.label} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? 'message-error' : undefined}
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 resize-none ${
                    errors.message
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 bg-white dark:bg-gray-800'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400`}
                  placeholder={formFieldConfig.message.placeholder}
                />
                {errors.message && (
                  <SimpleMotion
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    id="message-error"
                    className="mt-2 text-xs sm:text-sm text-red-500 flex items-center leading-tight break-words"
                    as="p"
                  >
                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                    <span className="flex-1 min-w-0">{errors.message}</span>
                  </SimpleMotion>
                )}
              </div>

              {/* 提交按钮 */}
              <UnifiedButton
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={submitStatus === 'loading'}
                disabled={submitStatus === 'loading'}
                icon={submitStatus === 'loading' ? undefined : Send}
                iconPosition="left"
              >
                {submitStatus === 'loading'
                  ? (t('contact.form.submitting') as string)
                  : (t('contact.form.submit') as string)}
              </UnifiedButton>
            </form>
          </AnimationContainer>

          {/* 错误状态反馈 */}
          {submitStatus === 'error' && submitMessage && (
            <ContactErrorBanner
              errorTitle={t('contact.form.error') as string}
              errorMessage={submitMessage}
              targetEmail={t('contact.info.email') as string}
              formData={formData}
              language={language}
            />
          )}
        </>
      )}
    </article>
  );
};

export default ContactForm;
