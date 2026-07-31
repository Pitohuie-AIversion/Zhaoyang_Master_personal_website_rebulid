import { toast } from 'sonner';

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

export interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  phone?: string;
}

export interface SubmitResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{0,3}[\s-]?[(]?\d{1,4}[)]?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;

const translate = (t: ((key: string) => string) | undefined, key: string, fallback: string) => {
  if (!t) return fallback;
  const value = t(key);
  return value && value !== key ? value : fallback;
};

export const validateContactForm = (formData: ContactFormData, t?: (key: string) => string): FormErrors => {
  const errors: FormErrors = {};

  if (!formData.name.trim()) {
    errors.name = translate(t, 'contact.form.validation.nameRequired', 'Please enter your name.');
  } else if (formData.name.trim().length < 2) {
    errors.name = translate(t, 'contact.form.validation.nameTooShort', 'Name must be at least 2 characters.');
  } else if (formData.name.trim().length > 50) {
    errors.name = translate(t, 'contact.form.validation.nameTooLong', 'Name cannot exceed 50 characters.');
  }

  if (!formData.email.trim()) {
    errors.email = translate(t, 'contact.form.validation.emailRequired', 'Please enter your email address.');
  } else if (!EMAIL_REGEX.test(formData.email.trim())) {
    errors.email = translate(t, 'contact.form.validation.emailInvalid', 'Please enter a valid email address.');
  }

  if (!formData.subject.trim()) {
    errors.subject = translate(t, 'contact.form.validation.subjectRequired', 'Please enter a subject.');
  } else if (formData.subject.trim().length < 5) {
    errors.subject = translate(t, 'contact.form.validation.subjectTooShort', 'Subject must be at least 5 characters.');
  } else if (formData.subject.trim().length > 100) {
    errors.subject = translate(t, 'contact.form.validation.subjectTooLong', 'Subject cannot exceed 100 characters.');
  }

  if (!formData.message.trim()) {
    errors.message = translate(t, 'contact.form.validation.messageRequired', 'Please enter your message.');
  } else if (formData.message.trim().length < 10) {
    errors.message = translate(t, 'contact.form.validation.messageTooShort', 'Message must be at least 10 characters.');
  } else if (formData.message.trim().length > 2000) {
    errors.message = translate(t, 'contact.form.validation.messageTooLong', 'Message cannot exceed 2000 characters.');
  }

  if (formData.phone?.trim() && !PHONE_REGEX.test(formData.phone.trim())) {
    errors.phone = translate(t, 'contact.form.validation.phoneInvalid', 'Please enter a valid phone number.');
  }

  return errors;
};

export const hasValidationErrors = (errors: FormErrors): boolean => Object.keys(errors).length > 0;

export const sanitizeFormData = (formData: ContactFormData): ContactFormData => ({
  name: formData.name.trim(),
  email: formData.email.trim().toLowerCase(),
  subject: formData.subject.trim(),
  message: formData.message.trim(),
  collaborationType: formData.collaborationType?.trim(),
  phone: formData.phone?.trim(),
  company: formData.company?.trim(),
  budget: formData.budget?.trim(),
  timeline: formData.timeline?.trim(),
});

export const submitContactForm = async (
  formData: ContactFormData,
  t?: (key: string) => string,
): Promise<SubmitResponse> => {
  try {
    const errors = validateContactForm(formData, t);
    if (hasValidationErrors(errors)) {
      throw new Error(Object.values(errors).join(', '));
    }

    const cleanData = sanitizeFormData(formData);
    toast.loading(translate(t, 'contact.form.submitting', 'Sending message...'), { id: 'contact-submit' });

    const response = await fetch('/api/contact/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...cleanData,
        language: localStorage.getItem('language') || 'en',
      }),
    });

    const result = await response.json().catch(() => null) as SubmitResponse | { error?: string } | null;
    if (!response.ok || !result || !('success' in result) || !result.success) {
      const serverMessage = result && 'message' in result
        ? result.message
        : result && 'error' in result
          ? result.error
          : undefined;
      throw new Error(serverMessage || translate(t, 'contact.form.submitError', 'Message submission failed.'));
    }

    toast.success(result.message || translate(t, 'contact.form.success', 'Message sent successfully.'), { id: 'contact-submit' });
    logContactSubmission(cleanData, result);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error
      ? error.message
      : translate(t, 'contact.form.submitError', 'Message submission failed.');

    toast.error(errorMessage, { id: 'contact-submit' });
    return {
      success: false,
      message: errorMessage,
    };
  }
};

const logContactSubmission = (formData: ContactFormData, result: SubmitResponse) => {
  const logData = {
    timestamp: new Date().toISOString(),
    formData: {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      collaborationType: formData.collaborationType,
      company: formData.company,
    },
    result: {
      success: result.success,
      messageId: result.data?.messageId || result.data?.id,
    },
    userAgent: navigator.userAgent,
    referrer: document.referrer,
  };

  try {
    const existingLogs = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    existingLogs.push(logData);
    if (existingLogs.length > 50) {
      existingLogs.splice(0, existingLogs.length - 50);
    }
    localStorage.setItem('contactSubmissions', JSON.stringify(existingLogs));
  } catch (error) {
    console.warn('Failed to log contact submission:', error);
  }
};

export const getContactSubmissionHistory = (): Record<string, unknown>[] => {
  try {
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
  } catch (error) {
    console.warn('Failed to get contact submission history:', error);
    return [];
  }
};

export const clearContactSubmissionHistory = (): void => {
  try {
    localStorage.removeItem('contactSubmissions');
  } catch (error) {
    console.warn('Failed to clear contact submission history:', error);
  }
};

export const getFormFieldConfig = (t: (key: string) => string) => {
  const tr = (key: string, fallback: string) => translate(t, key, fallback);

  return {
    name: {
      label: tr('contact.form.name.label', 'Name'),
      placeholder: tr('contact.form.name.placeholder', 'Enter your name'),
      required: true,
      maxLength: 50,
    },
    email: {
      label: tr('contact.form.email.label', 'Email'),
      placeholder: tr('contact.form.email.placeholder', 'Enter your email'),
      required: true,
      type: 'email',
    },
    phone: {
      label: tr('contact.form.phone.label', 'Phone'),
      placeholder: tr('contact.form.phone.placeholder', 'Enter your phone number'),
      required: false,
    },
    company: {
      label: tr('contact.form.company.label', 'Company / Organization'),
      placeholder: tr('contact.form.company.placeholder', 'Enter your company or organization'),
      required: false,
      maxLength: 100,
    },
    subject: {
      label: tr('contact.form.subject.label', 'Subject'),
      placeholder: tr('contact.form.subject.placeholder', 'Enter a subject'),
      required: true,
      maxLength: 100,
    },
    message: {
      label: tr('contact.form.message.label', 'Message'),
      placeholder: tr('contact.form.message.placeholder', 'Describe your request or question'),
      required: true,
      maxLength: 2000,
      rows: 6,
    },
    budget: {
      label: tr('contact.form.budget.label', 'Budget'),
      placeholder: tr('contact.form.budget.placeholder', 'Select a budget range'),
      required: false,
      options: [
        { value: '', label: tr('contact.form.budget.options.select', 'Select a budget range') },
        { value: 'under-5k', label: tr('contact.form.budget.options.under5k', 'Under 5k') },
        { value: '5k-10k', label: tr('contact.form.budget.options.5k10k', '5k-10k') },
        { value: '10k-50k', label: tr('contact.form.budget.options.10k50k', '10k-50k') },
        { value: '50k-100k', label: tr('contact.form.budget.options.50k100k', '50k-100k') },
        { value: 'over-100k', label: tr('contact.form.budget.options.over100k', 'Over 100k') },
        { value: 'discuss', label: tr('contact.form.budget.options.discuss', 'Discuss later') },
      ],
    },
    timeline: {
      label: tr('contact.form.timeline.label', 'Timeline'),
      placeholder: tr('contact.form.timeline.placeholder', 'Select a timeline'),
      required: false,
      options: [
        { value: '', label: tr('contact.form.timeline.options.select', 'Select a timeline') },
        { value: 'urgent', label: tr('contact.form.timeline.options.urgent', 'Urgent') },
        { value: 'short', label: tr('contact.form.timeline.options.short', 'Short term') },
        { value: 'medium', label: tr('contact.form.timeline.options.medium', 'Medium term') },
        { value: 'long', label: tr('contact.form.timeline.options.long', 'Long term') },
        { value: 'flexible', label: tr('contact.form.timeline.options.flexible', 'Flexible') },
      ],
    },
  };
};

export const formFieldConfig = getFormFieldConfig((key) => key);

export const getCollaborationTypes = (t: (key: string) => string) => {
  const tr = (key: string, fallback: string) => translate(t, key, fallback);

  return [
    {
      id: 'research',
      title: tr('contact.collaboration.research.title', 'Academic Collaboration'),
      description: tr('contact.collaboration.research.description', 'Papers, research projects, and academic exchange'),
      icon: 'R',
      color: '#3b82f6',
    },
    {
      id: 'development',
      title: tr('contact.collaboration.development.title', 'Technical Development'),
      description: tr('contact.collaboration.development.description', 'Software development, system design, and technical consulting'),
      icon: 'D',
      color: '#10b981',
    },
    {
      id: 'consulting',
      title: tr('contact.collaboration.consulting.title', 'Consulting'),
      description: tr('contact.collaboration.consulting.description', 'Technical plans, architecture, and problem solving'),
      icon: 'C',
      color: '#f59e0b',
    },
    {
      id: 'teaching',
      title: tr('contact.collaboration.teaching.title', 'Teaching'),
      description: tr('contact.collaboration.teaching.description', 'Training, course design, and knowledge sharing'),
      icon: 'T',
      color: '#8b5cf6',
    },
    {
      id: 'other',
      title: tr('contact.collaboration.other.title', 'Other'),
      description: tr('contact.collaboration.other.description', 'Other forms of collaboration and communication'),
      icon: 'O',
      color: '#ef4444',
    },
  ];
};

export const collaborationTypes = getCollaborationTypes((key) => key);
