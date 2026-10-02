import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Send, 
  CheckCircle, 
  XCircle, 
  Building, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  ArrowLeft, 
  Mail 
} from 'lucide-react';
import { useTranslation } from '../../common/TranslationProvider';
import { SimpleMotion } from '../../animations/SimpleMotion';
import {
  LazyAnimationContainerComponent as AnimationContainer,
  LazyMagneticButtonComponent as MagneticButton
} from '../../animations/LazyAnimations';
import { UnifiedButton } from '../../common/UnifiedButton';
import { 
  submitContactForm, 
  validateContactForm, 
  hasValidationErrors,
  getFormFieldConfig,
  getCollaborationTypes
} from '../../../services/contactService';
import type { ContactFormData, FormErrors, SubmitStatus } from '../../../types';

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
    timeline: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitMessage, setSubmitMessage] = useState<string>('');
  const [selectedCollaboration, setSelectedCollaboration] = useState<string>('');

  useEffect(() => {
    const subject = searchParams.get('subject');
    const type = searchParams.get('type');
    
    if (subject) {
      setFormData(prev => ({ ...prev, subject }));
    }
    
    if (type) {
      setSelectedCollaboration(type);
      setFormData(prev => ({ ...prev, collaborationType: type }));
    }
  }, [searchParams]);

  const validateForm = (): FormErrors => {
    return validateContactForm(formData, t as (key: string) => string);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleCollaborationSelect = (typeId: string) => {
    setSelectedCollaboration(typeId);
    setFormData(prev => ({
      ...prev,
      collaborationType: typeId
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
      const errorMessage = error instanceof Error 
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
      timeline: ''
    });
    setSelectedCollaboration('');
    setSubmitStatus('idle');
    setSubmitMessage('');
  };

  return (
    <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition relative overflow-hidden min-h-[600px]">
      {submitStatus === 'success' ? (
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
              {t('contact.form.success') as string}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              {submitMessage}
            </p>
            <UnifiedButton
              onClick={handleReset}
              variant="primary"
              size="lg"
              icon={ArrowLeft}
              iconPosition="left"
            >
              {t('contact.form.sendAnother') as string}
            </UnifiedButton>
          </SimpleMotion>
        </div>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">
            {t('contact.sendMessage') as string}
          </h2>
          
          {/* 合作类型选择 */}
          <AnimationContainer delay={0.4}>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                <Building className="w-5 h-5 mr-2 text-blue-600" />
                {t('contact.collaborationType') as string}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collaborationTypes.map((type) => {
                  return (
                    <MagneticButton
                      key={type.id}
                      onClick={() => handleCollaborationSelect(type.id)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left group ${
                        selectedCollaboration === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-lg ${
                          selectedCollaboration === type.id 
                            ? 'bg-blue-100 dark:bg-blue-800/30' 
                            : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30'
                        } transition-colors duration-300`}>
                          <span className={`text-lg sm:text-xl ${
                            selectedCollaboration === type.id 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          } transition-colors duration-300 flex-shrink-0`}>
                            {type.icon}
                          </span>
                        </div>
                        <span className="ml-3 font-semibold text-sm sm:text-base lg:text-lg text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight break-words flex-1 min-w-0">
                          {type.title}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {type.description}
                      </p>
                    </MagneticButton>
                  );
                })}
              </div>
            </div>
          </AnimationContainer>

          <AnimationContainer delay={0.6}>
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              {/* 基本信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 姓名 */}
                <div>
                  <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
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
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
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
                <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
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

              {/* 项目详情 */}
              {selectedCollaboration && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 预算范围 */}
                  <div>
                    <label htmlFor="budget" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
                      <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 flex-shrink-0" />
                      <span className="break-words">{formFieldConfig.budget?.label || (t('contact.form.budget.label') as string)}</span>
                    </label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                    >
                      <option value="">{t('contact.form.selectBudget') as string}</option>
                      {formFieldConfig.budget?.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 项目周期 */}
                  <div>
                    <label htmlFor="timeline" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 flex-shrink-0" />
                      <span className="break-words">{formFieldConfig.timeline?.label || (t('contact.form.timeline.label') as string)}</span>
                    </label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                    >
                      <option value="">{t('contact.form.selectTimeline') as string}</option>
                      {formFieldConfig.timeline?.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* 消息内容 */}
              <div>
                <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 leading-tight break-words">
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

          {/* 错误状态反馈 - 包含一键通过邮件客户端发送容灾按钮 */}
          {submitStatus === 'error' && submitMessage && (
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
                  <h4 className="font-semibold mb-1">
                    {t('contact.form.error') as string}
                  </h4>
                  <p className="text-sm opacity-90">{submitMessage}</p>
                </div>
              </div>
              <a
                href={`mailto:${t('contact.info.email') as string}?subject=${encodeURIComponent(formData.subject || (language === 'zh' ? '学术咨询' : 'Academic Inquiry'))}&body=${encodeURIComponent(`${language === 'zh' ? '姓名' : 'Name'}: ${formData.name}\n${language === 'zh' ? '邮箱' : 'Email'}: ${formData.email}\n\n${language === 'zh' ? '内容' : 'Message'}:\n${formData.message}`)}`}
                className="inline-flex items-center px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap self-stretch sm:self-auto justify-center"
              >
                <Mail className="w-4 h-4 mr-2" />
                {language === 'zh' ? '使用邮件客户端发送' : 'Send via Email Client'}
              </a>
            </SimpleMotion>
          )}
        </>
      )}
    </article>
  );
};

export default ContactForm;
