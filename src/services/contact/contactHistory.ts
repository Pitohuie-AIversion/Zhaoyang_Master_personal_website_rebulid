import type { ContactFormData, SubmitResponse } from '../../types';

export const logContactSubmission = (formData: ContactFormData, result: SubmitResponse) => {
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
