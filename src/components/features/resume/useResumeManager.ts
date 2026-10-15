import { useState, useEffect, useCallback } from 'react';
import { getAdminAuthHeaders } from '../../../utils/adminAuth';
import type { ResumeData } from '../../../types';

interface UseResumeManagerParams {
  adminToken: string;
  onAuthFailure: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, fallbackOrOptions?: any) => string;
}

export const useResumeManager = ({
  adminToken,
  onAuthFailure,
  t,
}: UseResumeManagerParams) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [editingSection, setEditingSection] = useState<string>('');
  const [syncing, setSyncing] = useState(false);

  const fetchResumeData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resume/data', {
        headers: getAdminAuthHeaders(adminToken),
      });
      if (response.status === 401 || response.status === 503) {
        onAuthFailure();
        return;
      }
      const result = await response.json();

      if (result.success) {
        setResumeData(result.data);
      } else {
        console.error('Failed to fetch resume data:', result.message);
      }
    } catch (error) {
      console.error('Error fetching resume data:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken, onAuthFailure]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert(t('common.resume.upload.pdfOnly', 'Please upload a PDF file'));
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        headers: getAdminAuthHeaders(adminToken),
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.resume.upload.success', 'Resume uploaded and processed successfully'));
        fetchResumeData();
      } else {
        alert(t('common.resume.upload.error', 'Failed to process resume') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(t('common.resume.upload.error', 'Failed to upload resume'));
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleEdit = (section: string, item: unknown) => {
    setEditingItem(item as Record<string, unknown>);
    setEditingSection(section);
  };

  const handleSave = async (updatedItem: Record<string, unknown>, section: string) => {
    try {
      const url = updatedItem.id
        ? `/api/resume/data/${section}/${updatedItem.id}`
        : `/api/resume/data/${section}`;

      const method = updatedItem.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
        body: JSON.stringify(updatedItem),
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.saveSuccess', 'Saved successfully'));
        setEditingItem(null);
        setEditingSection('');
        fetchResumeData();
      } else {
        alert(t('common.saveError', 'Failed to save') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(t('common.saveError', 'Failed to save'));
    }
  };

  const handleDelete = async (section: string, id: string) => {
    if (!confirm(t('common.confirmDelete', 'Are you sure you want to delete this item?'))) {
      return;
    }

    try {
      const response = await fetch(`/api/resume/data/${section}/${id}`, {
        method: 'DELETE',
        headers: getAdminAuthHeaders(adminToken),
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.deleteSuccess', 'Deleted successfully'));
        fetchResumeData();
      } else {
        alert(t('common.deleteError', 'Failed to delete') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert(t('common.deleteError', 'Failed to delete'));
    }
  };

  const handleSync = async () => {
    if (!confirm(t('common.resume.syncConfirm', 'This will sync resume data with your website. Continue?'))) {
      return;
    }

    setSyncing(true);
    try {
      const response = await fetch('/api/resume/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
      });

      const result = await response.json();

      if (result.success) {
        alert(t('common.resume.syncSuccess', 'Resume data synced successfully'));
      } else {
        alert(t('common.resume.syncError', 'Failed to sync resume data') + ': ' + result.message);
      }
    } catch (error) {
      console.error('Sync error:', error);
      alert(t('common.resume.syncError', 'Failed to sync resume data'));
    } finally {
      setSyncing(false);
    }
  };

  const handleValidate = async () => {
    try {
      const response = await fetch('/api/resume/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
      });

      const result = await response.json();

      if (result.success) {
        if (result.isValid) {
          alert(t('resume.validationSuccess', 'Resume data is valid'));
        } else {
          alert(t('resume.validationErrors', 'Validation errors') + ':\n' + result.errors.join('\n'));
        }
      } else {
        alert(t('resume.validationError', 'Failed to validate resume data'));
      }
    } catch (error) {
      console.error('Validation error:', error);
      alert(t('resume.validationError', 'Failed to validate resume data'));
    }
  };

  const closeEditModal = () => {
    setEditingItem(null);
    setEditingSection('');
  };

  return {
    resumeData,
    loading,
    uploading,
    syncing,
    editingItem,
    editingSection,
    fetchResumeData,
    handleFileUpload,
    handleEdit,
    handleSave,
    handleDelete,
    handleSync,
    handleValidate,
    closeEditModal,
  };
};
