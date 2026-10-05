import React from 'react';
import { Send } from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { LazyAnimationContainerComponent as AnimationContainer } from '../../animations/LazyAnimations';
import { UnifiedButton } from '../../common/UnifiedButton';
import { ContactSuccessView } from './ContactSuccessView';
import { CollaborationTypeSelector } from './CollaborationTypeSelector';
import { ContactProjectFields } from './ContactProjectFields';
import { ContactErrorBanner } from './ContactErrorBanner';
import { ContactBasicFields } from './ContactBasicFields';
import { ContactMessageField } from './ContactMessageField';
import { useContactForm } from './useContactForm';

export interface ContactFormProps {
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSuccess }) => {
  const { t, language } = useTranslation();

  const {
    formData,
    errors,
    submitStatus,
    submitMessage,
    selectedCollaboration,
    formFieldConfig,
    collaborationTypes,
    handleInputChange,
    handleCollaborationSelect,
    handleSubmit,
    handleReset,
  } = useContactForm({ t, onSuccess });

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
              {/* 基本信息 (姓名、邮箱、主题) */}
              <ContactBasicFields
                name={formData.name}
                email={formData.email}
                subject={formData.subject}
                errors={errors}
                formFieldConfig={formFieldConfig}
                onChange={handleInputChange}
              />

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
              <ContactMessageField
                message={formData.message}
                error={errors.message}
                label={formFieldConfig.message.label}
                placeholder={formFieldConfig.message.placeholder}
                onChange={handleInputChange}
              />

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
