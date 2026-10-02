import React from 'react';
import type { ContactMessage } from '../../../../types';

interface ContactMessageDetailProps {
  selectedMessage: ContactMessage | null;
  onUpdateStatus: (messageId: string, newStatus: string) => void;
}

export const ContactMessageDetail: React.FC<ContactMessageDetailProps> = ({
  selectedMessage,
  onUpdateStatus
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">消息详情</h2>
      </div>
      {selectedMessage ? (
        <div className="p-6 space-y-6">
          {/* 基本信息 */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{selectedMessage.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMessage.email}</p>
              </div>
              <select
                value={selectedMessage.status}
                onChange={(e) => onUpdateStatus(selectedMessage.id, e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">新消息</option>
                <option value="read">已读</option>
                <option value="replied">已回复</option>
                <option value="archived">已归档</option>
              </select>
            </div>

            {selectedMessage.phone && (
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{selectedMessage.phone}</span>
              </div>
            )}

            {selectedMessage.company && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">{selectedMessage.company}</span>
              </div>
            )}
          </div>

          {/* 主题 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">主题</h4>
            <p className="text-gray-700 dark:text-gray-300">{selectedMessage.subject}</p>
          </div>

          {/* 消息内容 */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">消息内容</h4>
            <div className="bg-gray-50 dark:bg-gray-900/60 rounded-lg p-4">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
          </div>

          {/* 合作详情 */}
          {(selectedMessage.collaboration_type || selectedMessage.budget_range || selectedMessage.timeline) && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">合作详情</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedMessage.collaboration_type && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">合作类型</div>
                    <div className="text-sm text-gray-900 dark:text-white">{selectedMessage.collaboration_type}</div>
                  </div>
                )}
                {selectedMessage.budget_range && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">预算范围</div>
                    <div className="text-sm text-gray-900 dark:text-white">{selectedMessage.budget_range}</div>
                  </div>
                )}
                {selectedMessage.timeline && (
                  <div>
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400">时间周期</div>
                    <div className="text-sm text-gray-900 dark:text-white">{selectedMessage.timeline}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 时间信息 */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>创建时间: {new Date(selectedMessage.created_at).toLocaleString('zh-CN')}</p>
            <p>更新时间: {new Date(selectedMessage.updated_at).toLocaleString('zh-CN')}</p>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 dark:text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-lg">选择一条消息查看详情</p>
          <p className="text-sm mt-2">点击左侧的消息列表来查看详细信息</p>
        </div>
      )}
    </div>
  );
};
