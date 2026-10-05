import type { ContactFormData, FormErrors } from '../../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[1-9]\d{0,3}[\s-]?[(]?\d{1,4}[)]?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;

export const translate = (t: ((key: string) => string) | undefined, key: string, fallback: string) => {
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
