/**
 * 联系与咨询模块领域类型定义
 */

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

export interface CollaborationType {
  id?: string;
  value?: string;
  title?: string;
  label?: string;
  description?: string;
  icon?: string;
  color?: string;
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  collaboration_type?: string;
  budget_range?: string;
  timeline?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ContactStats {
  total: number;
  byStatus: {
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
  recentCount: number;
}
