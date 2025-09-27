import React, { useState } from 'react';
import { useTranslation } from '../components/TranslationProvider';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Send, CheckCircle, XCircle, Loader, Building, Clock, DollarSign, AlertCircle, ExternalLink, Code, Briefcase, GraduationCap, Users } from 'lucide-react';
import { ContactSEO } from '../components/SEOOptimization';
import { SimpleMotion } from '../components/SimpleMotion';
import { useResponsive } from '../components/ResponsiveEnhancements';
import { 
  LazyAnimationContainerComponent as AnimationContainer,
  LazyMagneticButtonComponent as MagneticButton,
  LazyFloatingElementComponent as FloatingElement,
  LazyGradientTextComponent as GradientText
} from '../components/LazyAnimations';
import { ResponsiveContainer } from '../components/ResponsiveEnhancements';
import { UnifiedButton } from '../components/UnifiedButton';
import { 
  submitContactForm, 
  validateContactForm, 
  hasValidationErrors,
  getFormFieldConfig,
  getCollaborationTypes,
  type ContactFormData,
  type FormErrors
} from '../services/contactService';
import { toast } from 'sonner';

// 提交状态类型
type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// contactInfo 将从翻译文件中动态获取

// socialLinks 将在组件内部动态生成



export default function Contact() {
  const { t } = useTranslation();
  const { isMobile } = useResponsive();
  
  // 动态生成社交媒体链接
  const socialLinks = [
    {
      name: t('contact.social.github'),
      url: 'https://github.com/zhaoyangmou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.linkedin'),
      url: 'https://linkedin.com/in/zhaoyangmou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.csdn'),
      url: 'https://blog.csdn.net/zhaoyangmou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.researchgate'),
      url: 'https://researchgate.net/profile/Zhaoyang-Mou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.586 0c-.818 0-1.508.19-2.073.565-.563.377-.97.936-1.213 1.68-.242.744-.364 1.627-.364 2.647 0 1.098.122 2.05.364 2.854.243.804.65 1.402 1.213 1.795.565.394 1.255.59 2.073.59.818 0 1.508-.196 2.073-.59.563-.393.97-.991 1.213-1.795.242-.804.364-1.756.364-2.854 0-1.02-.122-1.903-.364-2.647-.243-.744-.65-1.303-1.213-1.68C21.094.19 20.404 0 19.586 0zm0 1.608c.394 0 .728.083.999.248.271.165.48.407.625.727.145.319.218.708.218 1.167 0 .458-.073.847-.218 1.167-.145.319-.354.561-.625.727-.271.165-.605.248-.999.248-.394 0-.728-.083-.999-.248-.271-.166-.48-.408-.625-.727-.145-.32-.218-.709-.218-1.167 0-.459.073-.848.218-1.167.145-.32.354-.562.625-.727.271-.165.605-.248.999-.248zM7.541 5.455c-1.624 0-2.956.394-3.997 1.181C2.503 7.423 1.982 8.52 1.982 9.927c0 1.407.521 2.504 1.562 3.291 1.041.787 2.373 1.181 3.997 1.181.818 0 1.508-.122 2.073-.364.563-.243.97-.607 1.213-1.092.242-.485.364-1.077.364-1.775 0-.698-.122-1.29-.364-1.775-.243-.485-.65-.849-1.213-1.092-.565-.242-1.255-.364-2.073-.364zm0 1.608c.394 0 .728.083.999.248.271.165.48.407.625.727.145.319.218.708.218 1.167 0 .458-.073.847-.218 1.167-.145.319-.354.561-.625.727-.271.165-.605.248-.999.248-.394 0-.728-.083-.999-.248-.271-.166-.48-.408-.625-.727-.145-.32-.218-.709-.218-1.167 0-.459.073-.848.218-1.167.145-.32.354-.562.625-.727.271-.165.605-.248.999-.248z"/>
        </svg>
      )
    },
    {
      name: t('contact.social.scholar'),
      url: 'https://scholar.google.com/citations?user=zhaoyangmou',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5 12 0z"/>
        </svg>
      )
    }
  ];
  
  // 获取翻译后的配置数据
  const formFieldConfig = getFormFieldConfig(t);
  const collaborationTypes = getCollaborationTypes(t);
  
  // 表单数据状态
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    collaborationType: '',
    budget: '',
    timeline: ''
  });
  
  // 错误信息状态
  const [errors, setErrors] = useState<FormErrors>({});
  
  // 提交状态
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  
  // 提交消息
  const [submitMessage, setSubmitMessage] = useState<string>('');
  
  // 选中的合作类型
  const [selectedCollaboration, setSelectedCollaboration] = useState<string>('');

  // 表单验证
  const validateForm = (): FormErrors => {
    return validateContactForm(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 清除对应字段的错误信息
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // 兼容旧版本的handleInputChange函数
  const handleInputChangeOld = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // 清除对应字段的错误信息
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };
  
  // 处理合作类型选择
  const handleCollaborationSelect = (typeId: string) => {
    setSelectedCollaboration(typeId);
    setFormData(prev => ({
      ...prev,
      collaborationType: typeId
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证表单
    const validationErrors = validateForm();
    setErrors(validationErrors);
    
    if (hasValidationErrors(validationErrors)) {
      toast.error(t('contact.form.validationError'));
      return;
    }
    
    setSubmitStatus('loading');
    
    try {
      const result = await submitContactForm(formData);
      
      if (result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message);
        
        // 重置表单
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
        
        // 3秒后重置状态
        setTimeout(() => {
          setSubmitStatus('idle');
          setSubmitMessage('');
        }, 3000);
      } else {
        throw new Error(result.message);
      }
      
    } catch (error) {
      setSubmitStatus('error');
      const errorMessage = error instanceof Error ? error.message : t('contact.form.submitError');
      setSubmitMessage(errorMessage);
      
      // 3秒后重置状态
      setTimeout(() => {
        setSubmitStatus('idle');
        setSubmitMessage('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      <ContactSEO />
      
      {/* 浮动装饰元素 */}
      <FloatingElement 
        className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 dark:bg-blue-800/30 rounded-full pointer-events-none"
        duration={6}
      >
        <div />
      </FloatingElement>
      <FloatingElement 
        className="absolute top-40 right-20 w-16 h-16 bg-indigo-200/30 dark:bg-indigo-800/30 rounded-full pointer-events-none"
        duration={8}
      >
        <div />
      </FloatingElement>
      <FloatingElement
        className="absolute top-20 right-10 text-blue-500/20 dark:text-blue-400/20 pointer-events-none"
        duration={4}
      >
        <div className="w-8 h-8 rounded-full bg-current opacity-20" />
      </FloatingElement>
      <FloatingElement
        className="absolute bottom-32 left-8 text-purple-500/20 dark:text-purple-400/20 pointer-events-none"
        duration={5}
      >
        <div className="w-6 h-6 rounded-full bg-current opacity-20" />
      </FloatingElement>
      
      {/* 页面标题 */}
      <ResponsiveContainer 
        maxWidth="xl" 
        padding="lg"
        className="relative z-10"
        style={{ paddingTop: isMobile ? '100px' : '140px', paddingBottom: '80px' }}
      >
        <AnimationContainer>
          <SimpleMotion
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <GradientText
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight break-words"
              gradient="from-blue-600 via-purple-600 to-pink-600"
            >
              {t('contact.title')}
            </GradientText>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-loose break-words hyphens-auto">
              {t('contact.description')}
            </p>
          </SimpleMotion>
        </AnimationContainer>

        <main className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 max-w-7xl mx-auto">
          {/* 联系信息区域 */}
          <section className="space-y-6 order-2 xl:order-1">
            <SimpleMotion
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition">
              <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">{t('contact.contactInfo')}</h2>
              
              <address className="space-y-6 not-italic">
                {/* 邮箱信息 */}
                <div className="flex items-start sm:items-center">
                  <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
                    <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">{t('contact.email')}</h3>
                    <a href={`mailto:${t('contact.info.email')}`} className="text-sm sm:text-sm text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition leading-relaxed break-all underline-offset-2 hover:underline">{t('contact.info.email')}</a>
                  </div>
                </div>
                
                {/* 电话信息 */}
                <div className="flex items-start sm:items-center">
                  <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
                    <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">{t('contact.phone')}</h3>
                    <a href={`tel:${t('contact.info.phone')}`} className="text-sm sm:text-sm text-secondary-dark hover:text-blue-600 dark:hover:text-blue-400 theme-transition leading-relaxed underline-offset-2 hover:underline">{t('contact.info.phone')}</a>
                  </div>
                </div>
                
                {/* 地址信息 */}
                <div className="flex items-start">
                  <div className="w-12 h-12 sm:w-10 sm:h-10 bg-gray-900 rounded-md flex items-center justify-center mr-4 sm:mr-3 flex-shrink-0" aria-hidden="true">
                    <svg className="w-6 h-6 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-primary-dark theme-transition leading-snug text-base sm:text-sm">{t('contact.address')}</h3>
                    <div className="space-y-1">
                      <p className="text-sm sm:text-sm text-secondary-dark theme-transition leading-relaxed break-words">{t('contact.info.location')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition leading-relaxed">{t('contact.info.university')} {t('contact.info.department')}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 theme-transition leading-relaxed">{t('contact.info.office')}</p>
                    </div>
                  </div>
                </div>
              </address>
              </article>

              {/* 社交媒体链接 */}
              <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition">
                <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">{t('contact.academicSocial')}</h2>
                <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4" aria-label="社交媒体链接">
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 sm:p-4 bg-gray-50 dark:bg-gray-800 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group theme-transition min-h-[60px] sm:min-h-[56px]"
                      aria-label={`访问我的${link.name}主页`}
                    >
                      <div className="text-gray-600 dark:text-gray-400 mr-3 sm:mr-4 theme-transition flex-shrink-0" aria-hidden="true">
                        {link.icon}
                      </div>
                      <span className="font-medium text-sm sm:text-base text-primary-dark theme-transition leading-snug break-words flex-1 min-w-0">{link.name}</span>
                    </a>
                  ))}
                </nav>
              </article>
            </SimpleMotion>
          </section>

          {/* 联系表单区域 */}
          <section className="space-y-6 order-1 xl:order-2">
            <SimpleMotion
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <article className="card-dark rounded-lg border border-gray-200 dark:border-gray-700 p-6 theme-transition">
            <h2 className="text-xl md:text-2xl font-semibold text-primary-dark theme-transition mb-4 leading-tight">{t('contact.sendMessage')}</h2>
            
            {/* 合作类型选择 */}
            <AnimationContainer delay={0.4}>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-6 flex items-center">
                  <Building className="w-5 h-5 mr-2 text-blue-600" />
                  {t('contact.collaborationType')}
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
              <form onSubmit={handleSubmit} className="space-y-6">
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
                        <span className="break-words">{formFieldConfig.budget?.label || t('contact.form.budget.label')}</span>
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                      >
                        <option value="">{t('contact.form.selectBudget')}</option>
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
                        <span className="break-words">{formFieldConfig.timeline?.label || t('contact.form.timeline.label')}</span>
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-300"
                      >
                        <option value="">{t('contact.form.selectTimeline')}</option>
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
                  {submitStatus === 'loading' ? t('contact.form.submitting') : t('contact.form.submit')}
                </UnifiedButton>
              </form>
            </AnimationContainer>

             {/* 提交状态反馈 */}
             {submitMessage && (
               <SimpleMotion
                 initial={{ opacity: 0, y: 20, scale: 0.95 }}
                 animate={{ opacity: 1, y: 0, scale: 1 }}
                 className={`mt-6 p-6 rounded-xl flex items-center shadow-lg ${
                   submitStatus === 'success'
                     ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-800'
                     : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800'
                 }`}
               >
                 <div className={`p-2 rounded-full mr-4 ${
                   submitStatus === 'success' 
                     ? 'bg-green-100 dark:bg-green-800/30' 
                     : 'bg-red-100 dark:bg-red-800/30'
                 }`}>
                   {submitStatus === 'success' ? (
                     <CheckCircle className="w-6 h-6" />
                   ) : (
                     <XCircle className="w-6 h-6" />
                   )}
                 </div>
                 <div>
                   <h4 className="font-semibold mb-1">
                     {submitStatus === 'success' ? t('contact.form.success') : t('contact.form.error')}
                   </h4>
                   <p className="text-sm opacity-90">{submitMessage}</p>
                 </div>
               </SimpleMotion>
             )}
               </article>
             </SimpleMotion>
           </section>
        </main>
      </ResponsiveContainer>
    </div>
  );
}