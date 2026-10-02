import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import {
  submitContactForm,
  validateContactForm,
  hasValidationErrors,
  getFormFieldConfig,
  getCollaborationTypes,
} from '../../../services/contactService';
import type { ContactFormData, FormErrors, SubmitStatus } from '../../../types';

export interface UseContactFormOptions {
  t: (key: string) => string | unknown;
  onSuccess?: () => void;
}

export const useContactForm = ({ t, onSuccess }: UseContactFormOptions) => {
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

  return {
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
  };
};
