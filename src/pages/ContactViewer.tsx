import { useTranslation } from '../components/common/TranslationProvider';
import { AdminGate } from '../components/common/AdminGate';
import {
  ContactStatsCards,
  ContactMessageFilterBar,
  ContactMessageList,
  ContactMessageDetail,
  getStatusColor,
  getStatusLabel,
  useContactViewer,
} from '../components/features/contact/admin';

interface ContactViewerContentProps {
  adminToken: string;
  onLogout: () => void;
  onAuthFailure: () => void;
}

function ContactViewerContent({ adminToken, onLogout, onAuthFailure }: ContactViewerContentProps) {
  const { t } = useTranslation();
  const {
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
  } = useContactViewer({ adminToken, onAuthFailure });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-6 pt-24 theme-transition" role="status">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4" aria-hidden="true"></div>
            <div className="text-base text-gray-600 dark:text-gray-300">{t('common.loading') as string}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-6 pt-24 text-gray-900 dark:text-gray-100 theme-transition">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('contact.admin.title') as string}
            </h1>
            <button
              type="button"
              onClick={onLogout}
              aria-label={t('common.adminAuth.lock') as string}
              className="px-3 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {t('common.adminAuth.lock') as string}
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {t('contact.admin.description') as string}
          </p>
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
