import { toast } from 'sonner';
import type { ContactFormData, SubmitResponse } from '../../types';
import {
  validateContactForm,
  hasValidationErrors,
  sanitizeFormData,
  translate
} from './contactValidation';
import { logContactSubmission } from './contactHistory';

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
