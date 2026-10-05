import { translate } from './contactValidation';

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

export type FormFieldConfig = ReturnType<typeof getFormFieldConfig>;

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
