import { useState, useEffect } from 'react';
import { Search, Mail, Phone, Building, Calendar, MessageSquare } from 'lucide-react';
import { ResponsiveCard } from '../components/ResponsiveEnhancements';
import { UnifiedButton } from '../components/UnifiedButton';

interface ContactMessage {
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

interface ContactStats {
  total: number;
  byStatus: {
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
  recentCount: number;
}

export default function ContactAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState<ContactStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/contact/messages');
      const data = await response.json();
      if (data.data) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error('获取联系信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/contact/stats');
      const data = await response.json();
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const updateMessageStatus = async (messageId: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/contact/messages/${messageId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (response.ok) {
        fetchMessages();
        fetchStats();
      }
    } catch (error) {
      console.error('更新状态失败:', error);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500 text-white';
      case 'read':
        return 'bg-gray-500 text-white';
      case 'replied':
        return 'bg-green-500 text-white';
      case 'archived':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
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
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">联系信息管理</h1>
        <p className="text-gray-600">查看和管理通过网站联系表单收到的所有信息</p>
      </div>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <ResponsiveCard className="p-4">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-gray-600">总消息数</div>
              <MessageSquare className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.total}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-gray-600">新消息</div>
              <div className="h-4 w-4 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                {stats.byStatus.new}
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.byStatus.new}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-gray-600">已读消息</div>
              <div className="h-4 w-4 rounded-full bg-gray-500 text-white text-xs flex items-center justify-center">
                {stats.byStatus.read}
              </div>
            </div>
            <div className="text-2xl font-bold mt-2">{stats.byStatus.read}</div>
          </ResponsiveCard>
          
          <ResponsiveCard className="p-4">
            <div className="flex flex-row items-center justify-between">
              <div className="text-sm font-medium text-gray-600">近30天</div>
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold mt-2">{stats.recentCount}</div>
          </ResponsiveCard>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="搜索姓名、邮箱、主题或内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">全部状态</option>
          <option value="new">新消息</option>
          <option value="read">已读</option>
          <option value="replied">已回复</option>
          <option value="archived">已归档</option>
        </select>
      </div>

      {/* 消息列表 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">消息列表 ({filteredMessages.length})</h2>
          {filteredMessages.map((message) => (
            <ResponsiveCard 
              key={message.id} 
              className={`cursor-pointer transition-colors p-4 ${
                selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{message.name}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <Mail className="h-3 w-3" />
                      {message.email}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(message.status)}`}>
                    {getStatusLabel(message.status)}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="font-medium text-sm">{message.subject}</div>
                <div className="text-sm text-gray-600 line-clamp-2">
                  {message.message.substring(0, 100)}...
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(message.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            </ResponsiveCard>
          ))}
        </div>

        {/* 消息详情 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">消息详情</h2>
          {selectedMessage ? (
            <ResponsiveCard className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedMessage.name}</h3>
                  <div className="mt-1 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {selectedMessage.email}
                    </div>
                    {selectedMessage.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {selectedMessage.phone}
                      </div>
                    )}
                    {selectedMessage.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3" />
                        {selectedMessage.company}
                      </div>
                    )}
                  </div>
                </div>
                <select 
                  value={selectedMessage.status} 
                  onChange={(e) => updateMessageStatus(selectedMessage.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">新消息</option>
                  <option value="read">已读</option>
                  <option value="replied">已回复</option>
                  <option value="archived">已归档</option>
                </select>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">主题</h4>
                  <p className="text-gray-700">{selectedMessage.subject}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-gray-900">消息内容</h4>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>

                {(selectedMessage.collaboration_type || selectedMessage.budget_range || selectedMessage.timeline) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                    {selectedMessage.collaboration_type && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">合作类型</div>
                        <div className="text-sm">{selectedMessage.collaboration_type}</div>
                      </div>
                    )}
                    {selectedMessage.budget_range && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">预算范围</div>
                        <div className="text-sm">{selectedMessage.budget_range}</div>
                      </div>
                    )}
                    {selectedMessage.timeline && (
                      <div>
                        <div className="text-sm font-medium text-gray-600">时间周期</div>
                        <div className="text-sm">{selectedMessage.timeline}</div>
                      </div>
                    )}
                  </div>
                )}

                <div className="text-xs text-gray-400">
                  创建时间: {new Date(selectedMessage.created_at).toLocaleString('zh-CN')}
                </div>
              </div>
            </ResponsiveCard>
          ) : (
            <ResponsiveCard className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-500 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>选择一条消息查看详情</p>
                </div>
              </div>
            </ResponsiveCard>
          )}
        </div>
      </div>
    </div>
  );
}