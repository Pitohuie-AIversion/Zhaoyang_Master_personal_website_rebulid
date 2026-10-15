import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAdminAuthHeaders } from '../../../../utils/adminAuth';
import type { ContactMessage, ContactStats } from '../../../../types';

interface UseContactViewerOptions {
  adminToken: string;
  onAuthFailure: () => void;
}

export const useContactViewer = ({ adminToken, onAuthFailure }: UseContactViewerOptions) => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact/messages', {
        headers: getAdminAuthHeaders(adminToken),
      });
      if (response.status === 401 || response.status === 503) {
        onAuthFailure();
        return;
      }
      const data = await response.json();
      if (data.data) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('获取联系信息失败:', error);
    } finally {
      setLoading(false);
    }
  }, [adminToken, onAuthFailure]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch('/api/contact/stats', {
        headers: getAdminAuthHeaders(adminToken),
      });
      if (response.status === 401 || response.status === 503) {
        onAuthFailure();
        return;
      }
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  }, [adminToken, onAuthFailure]);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(adminToken),
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchMessages();
        fetchStats();
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({
            ...selectedMessage,
            status: newStatus as ContactMessage['status'],
          });
        }
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesSearch =
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || message.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  return {
    messages,
    filteredMessages,
    stats,
    loading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedMessage,
    setSelectedMessage,
    updateMessageStatus,
    fetchMessages,
    fetchStats,
  };
};
