export type {
  ContactFormData,
  FormErrors,
  SubmitResponse,
  CollaborationType,
} from '../types';

export {
  validateContactForm,
  hasValidationErrors,
  sanitizeFormData,
  getFormFieldConfig,
  formFieldConfig,
  getCollaborationTypes,
  collaborationTypes,
  type FormFieldConfig,
  logContactSubmission,
  getContactSubmissionHistory,
  clearContactSubmissionHistory,
  submitContactForm,
} from './contact';
