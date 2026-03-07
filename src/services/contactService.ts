import { toast } from 'sonner';

// 表单数据接口
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  collaborationType?: string;
  phone?: string;
  company?: string;
  budget?: string;
  timeline?: string;
}

// 表单验证错误接口
export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  phone?: string;
}

// 提交响应接口
export interface SubmitResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// 邮箱验证正则表达式
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{0,3}[\s-]?[(]?\d{1,4}[)]?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;

// 表单验证函数
export const validateContactForm = (formData: ContactFormData, t?: (key: string) => string): FormErrors => {
  const errors: FormErrors = {};
  const tr = (key: string, fallback: string) => (t ? t(key) : fallback);

  // 姓名验证
  if (!formData.name.trim()) {
    errors.name = tr('contact.form.validation.nameRequired', '请输入您的姓名');
  } else if (formData.name.trim().length < 2) {
    errors.name = tr('contact.form.validation.nameTooShort', '姓名至少需要2个字符');
  } else if (formData.name.trim().length > 50) {
    errors.name = tr('contact.form.validation.nameTooLong', '姓名不能超过50个字符');
  }

  // 邮箱验证
  if (!formData.email.trim()) {
    errors.email = tr('contact.form.validation.emailRequired', '请输入您的邮箱地址');
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = tr('contact.form.validation.emailInvalid', '请输入有效的邮箱地址');
  }

  // 主题验证
  if (!formData.subject.trim()) {
    errors.subject = tr('contact.form.validation.subjectRequired', '请输入邮件主题');
  } else if (formData.subject.trim().length < 5) {
    errors.subject = tr('contact.form.validation.subjectTooShort', '主题至少需要5个字符');
  } else if (formData.subject.trim().length > 100) {
    errors.subject = tr('contact.form.validation.subjectTooLong', '主题不能超过100个字符');
  }

  // 消息内容验证
  if (!formData.message.trim()) {
    errors.message = tr('contact.form.validation.messageRequired', '请输入您的消息内容');
  } else if (formData.message.trim().length < 10) {
    errors.message = tr('contact.form.validation.messageTooShort', '消息内容至少需要10个字符');
  } else if (formData.message.trim().length > 2000) {
    errors.message = tr('contact.form.validation.messageTooLong', '消息内容不能超过2000个字符');
  }

  // 电话号码验证（可选）
  if (formData.phone && formData.phone.trim()) {
    if (!PHONE_REGEX.test(formData.phone.trim())) {
      errors.phone = tr('contact.form.validation.phoneInvalid', '请输入有效的电话号码');
    }
  }

  return errors;
};

// 检查是否有验证错误
export const hasValidationErrors = (errors: FormErrors): boolean => {
  return Object.keys(errors).length > 0;
};

// 清理表单数据
export const sanitizeFormData = (formData: ContactFormData): ContactFormData => {
  return {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    subject: formData.subject.trim(),
    message: formData.message.trim(),
    collaborationType: formData.collaborationType?.trim(),
    phone: formData.phone?.trim(),
    company: formData.company?.trim(),
    budget: formData.budget?.trim(),
    timeline: formData.timeline?.trim()
  };
};

// 主要提交函数 - 保存到本地并引导用户发邮件
const saveToLocalAndNotify = async (data: ContactFormData): Promise<SubmitResponse> => {
  try {
    // 模拟短暂延迟以保持体验一致
    await new Promise(resolve => setTimeout(resolve, 800));

    const localData = {
      id: `msg_${Date.now()}`,
      ...data,
      status: 'new',
      created_at: new Date().toISOString(),
      source: 'local_storage'
    };

    // 持久化到 localStorage（备份）
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages_backup') || '[]');
    existingMessages.push(localData);
    localStorage.setItem('contactMessages_backup', JSON.stringify(existingMessages));

    return {
      success: true,
      message: '消息已记录！请同时发送邮件至 mzymuzhaoyang@gmail.com 以确保我能及时收到。',
      data: {
        messageId: localData.id,
        timestamp: localData.created_at,
        estimatedReplyTime: '24小时内',
        email: 'mzymuzhaoyang@gmail.com'
      }
    };
  } catch (_error) {
    throw new Error('无法保存消息，请直接发送邮件至 mzymuzhaoyang@gmail.com');
  }
};


// 主要的表单提交函数
export const submitContactForm = async (formData: ContactFormData, t?: (key: string) => string): Promise<SubmitResponse> => {
  try {
    // 1. 验证表单数据
    const errors = validateContactForm(formData, t);
    if (hasValidationErrors(errors)) {
      const errorMessages = Object.values(errors).join(', ');
      throw new Error(`表单验证失败: ${errorMessages}`);
    }

    // 2. 清理表单数据
    const cleanData = sanitizeFormData(formData);

    // 3. 显示加载提示
    toast.loading(t ? t('contact.form.submitting') : '正在处理...', { id: 'contact-submit' });

    // 4. 保存到本地并提示用户发邮件
    const result = await saveToLocalAndNotify(cleanData);

    // 5. 显示成功提示
    toast.success(result.message || (t ? t('contact.form.success') : '消息已记录'), { id: 'contact-submit' });

    // 6. 记录提交日志
    logContactSubmission(cleanData, result);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : (t ? t('contact.form.submitError') : '发送失败，请稍后重试');

    // 显示错误提示
    toast.error(errorMessage, { id: 'contact-submit' });

    return {
      success: false,
      message: errorMessage
    };
  }
};

// 记录提交日志
const logContactSubmission = (formData: ContactFormData, result: SubmitResponse) => {
  const logData = {
    timestamp: new Date().toISOString(),
    formData: {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      collaborationType: formData.collaborationType,
      company: formData.company
    },
    result: {
      success: result.success,
      messageId: result.data?.messageId
    },
    userAgent: navigator.userAgent,
    referrer: document.referrer
  };

  // 存储到本地存储（实际项目中可能发送到分析服务）
  try {
    const existingLogs = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    existingLogs.push(logData);

    // 只保留最近50条记录
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }

    localStorage.setItem('contactSubmissions', JSON.stringify(existingLogs));
  } catch (error) {
    console.warn('Failed to log contact submission:', error);
  }
};

// 获取提交历史（用于调试）
export const getContactSubmissionHistory = (): Record<string, unknown>[] => {
  try {
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  } catch (error) {
    console.warn('Failed to get contact submission history:', error);
    return [];
  }
};

// 清除提交历史
export const clearContactSubmissionHistory = (): void => {
  try {
    localStorage.removeItem('contactSubmissions');
  } catch (error) {
    console.warn('Failed to clear contact submission history:', error);
  }
};

// 表单字段配置
export const getFormFieldConfig = (t: (key: string) => string) => ({
  name: {
    label: t('contact.form.name.label'),
    placeholder: t('contact.form.name.placeholder'),
    required: true,
    maxLength: 50
  },
  email: {
    label: t('contact.form.email.label'),
    placeholder: t('contact.form.email.placeholder'),
    required: true,
    type: 'email'
  },
  phone: {
    label: t('contact.form.phone.label'),
    placeholder: t('contact.form.phone.placeholder'),
    required: false
  },
  company: {
    label: t('contact.form.company.label'),
    placeholder: t('contact.form.company.placeholder'),
    required: false,
    maxLength: 100
  },
  subject: {
    label: t('contact.form.subject.label'),
    placeholder: t('contact.form.subject.placeholder'),
    required: true,
    maxLength: 100
  },
  message: {
    label: t('contact.form.message.label'),
    placeholder: t('contact.form.message.placeholder'),
    required: true,
    maxLength: 2000,
    rows: 6
  },
  budget: {
    label: t('contact.form.budget.label'),
    placeholder: t('contact.form.budget.placeholder'),
    required: false,
    options: [
      { value: '', label: t('contact.form.budget.options.select') },
      { value: 'under-5k', label: t('contact.form.budget.options.under5k') },
      { value: '5k-10k', label: t('contact.form.budget.options.5k10k') },
      { value: '10k-50k', label: t('contact.form.budget.options.10k50k') },
      { value: '50k-100k', label: t('contact.form.budget.options.50k100k') },
      { value: 'over-100k', label: t('contact.form.budget.options.over100k') },
      { value: 'discuss', label: t('contact.form.budget.options.discuss') }
    ]
  },
  timeline: {
    label: t('contact.form.timeline.label'),
    placeholder: t('contact.form.timeline.placeholder'),
    required: false,
    options: [
      { value: '', label: t('contact.form.timeline.options.select') },
      { value: 'urgent', label: t('contact.form.timeline.options.urgent') },
      { value: 'short', label: t('contact.form.timeline.options.short') },
      { value: 'medium', label: t('contact.form.timeline.options.medium') },
      { value: 'long', label: t('contact.form.timeline.options.long') },
      { value: 'flexible', label: t('contact.form.timeline.options.flexible') }
    ]
  }
});

// 保持向后兼容性的默认配置
export const formFieldConfig = {
  name: {
    label: '姓名',
    placeholder: '请输入您的姓名',
    required: true,
    maxLength: 50
  },
  email: {
    label: '邮箱',
    placeholder: '请输入您的邮箱地址',
    required: true,
    type: 'email'
  },
  phone: {
    label: '电话',
    placeholder: '请输入您的电话号码（可选）',
    required: false
  },
  company: {
    label: '公司/机构',
    placeholder: '请输入您的公司或机构名称（可选）',
    required: false,
    maxLength: 100
  },
  subject: {
    label: '主题',
    placeholder: '请输入邮件主题',
    required: true,
    maxLength: 100
  },
  message: {
    label: '消息内容',
    placeholder: '请详细描述您的需求或问题...',
    required: true,
    maxLength: 2000,
    rows: 6
  },
  budget: {
    label: '预算范围',
    placeholder: '请选择预算范围（可选）',
    required: false,
    options: [
      { value: '', label: '请选择预算范围' },
      { value: 'under-5k', label: '5千以下' },
      { value: '5k-10k', label: '5千-1万' },
      { value: '10k-50k', label: '1万-5万' },
      { value: '50k-100k', label: '5万-10万' },
      { value: 'over-100k', label: '10万以上' },
      { value: 'discuss', label: '面议' }
    ]
  },
  timeline: {
    label: '项目周期',
    placeholder: '请选择期望的项目周期（可选）',
    required: false,
    options: [
      { value: '', label: '请选择项目周期' },
      { value: 'urgent', label: '紧急（1周内）' },
      { value: 'short', label: '短期（1-4周）' },
      { value: 'medium', label: '中期（1-3个月）' },
      { value: 'long', label: '长期（3个月以上）' },
      { value: 'flexible', label: '时间灵活' }
    ]
  }
};

// 合作类型配置
export const getCollaborationTypes = (t: (key: string) => string) => [
  {
    id: 'research',
    title: t('contact.collaboration.research.title'),
    description: t('contact.collaboration.research.description'),
    icon: '🎓',
    color: '#3b82f6'
  },
  {
    id: 'development',
    title: t('contact.collaboration.development.title'),
    description: t('contact.collaboration.development.description'),
    icon: '💻',
    color: '#10b981'
  },
  {
    id: 'consulting',
    title: t('contact.collaboration.consulting.title'),
    description: t('contact.collaboration.consulting.description'),
    icon: '🔧',
    color: '#f59e0b'
  },
  {
    id: 'teaching',
    title: t('contact.collaboration.teaching.title'),
    description: t('contact.collaboration.teaching.description'),
    icon: '📚',
    color: '#8b5cf6'
  },
  {
    id: 'other',
    title: t('contact.collaboration.other.title'),
    description: t('contact.collaboration.other.description'),
    icon: '🤝',
    color: '#ef4444'
  }
];

// 保持向后兼容性的默认配置
export const collaborationTypes = [
  {
    id: 'research',
    title: '学术合作',
    description: '论文合作、研究项目、学术交流',
    icon: '🎓',
    color: '#3b82f6'
  },
  {
    id: 'development',
    title: '技术开发',
    description: '软件开发、系统设计、技术咨询',
    icon: '💻',
    color: '#10b981'
  },
  {
    id: 'consulting',
    title: '技术咨询',
    description: '技术方案、架构设计、问题解决',
    icon: '🔧',
    color: '#f59e0b'
  },
  {
    id: 'teaching',
    title: '教学培训',
    description: '技术培训、课程设计、知识分享',
    icon: '📚',
    color: '#8b5cf6'
  },
  {
    id: 'other',
    title: '其他合作',
    description: '其他形式的合作与交流',
    icon: '🤝',
    color: '#ef4444'
  }
];
