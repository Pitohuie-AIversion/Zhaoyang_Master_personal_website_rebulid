import { useState, useEffect, useCallback } from 'react';
import { getAdminAuthHeaders } from '../utils/adminAuth';
import { useTranslation } from '../components/common/TranslationProvider';
import { AdminGate } from '../components/common/AdminGate';
import type { ContactMessage, ContactStats } from '../types';
import {
  ContactStatsCards,
  ContactMessageFilterBar,
  ContactMessageList,
  ContactMessageDetail
} from '../components/features/contact/admin';

interface ContactViewerContentProps {
  adminToken: string;
  onLogout: () => void;
  onAuthFailure: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'read':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'replied':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'archived':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'new':
      return '新消息';
    case 'read':
      return '已读';
    case 'replied':
      return '已回复';
    case 'archived':
      return '已归档';
    default:
      return status;
  }
};

function ContactViewerContent({ adminToken, onLogout, onAuthFailure }: ContactViewerContentProps) {
  const { t } = useTranslation();
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
          setSelectedMessage({ ...selectedMessage, status: newStatus as ContactMessage['status'] });
        }
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-300">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 pt-24 text-gray-900 dark:text-gray-100 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">联系信息管理</h1>
            <button
              onClick={onLogout}
              className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('common.adminAuth.lock')}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">查看和管理通过网站联系表单收到的所有信息</p>
        </div>

        {/* 统计指标卡片 */}
        {stats && <ContactStatsCards stats={stats} />}

        {/* 搜索与状态筛选器 */}
        <ContactMessageFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
        />

        {/* 消息列表与详情排布 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ContactMessageList
            messages={filteredMessages}
            selectedMessageId={selectedMessage?.id}
            onSelectMessage={setSelectedMessage}
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />

          <ContactMessageDetail
            selectedMessage={selectedMessage}
            onUpdateStatus={updateMessageStatus}
          />
        </div>
      </div>
    </div>
  );
}

export default function ContactViewer() {
  return (
    <AdminGate descriptionKey="common.adminAuth.contactDescription">
      {({ token, logout, triggerAuthFailure }) => (
        <ContactViewerContent
          adminToken={token}
          onLogout={logout}
          onAuthFailure={triggerAuthFailure}
        />
      )}
    </AdminGate>
  );
}
