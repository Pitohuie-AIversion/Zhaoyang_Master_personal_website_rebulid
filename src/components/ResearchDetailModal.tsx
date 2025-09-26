import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, Users, FileText, Award, BookOpen, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { UnifiedButton } from './UnifiedButton';

interface Publication {
  id: string;
  title: string;
  journal: string;
  year: number;
  status: 'published' | 'accepted' | 'under_review' | 'in_preparation';
  authors: string[];
  description: string;
  doi?: string;
  type: 'journal' | 'conference';
}

interface Patent {
  id: string;
  title: string;
  number: string;
  applicant: string;
  publicDate: string;
  status: 'granted' | 'published' | 'pending';
  type: 'invention' | 'utility' | 'design';
  description: string;
}

interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  level: 'national' | 'provincial' | 'university';
  description: string;
  certificateNumber?: string;
}

type ResearchItem = Publication | Patent | Award;

interface ResearchDetailModalProps {
  item: ResearchItem | null;
  type: 'publication' | 'patent' | 'award';
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchDetailModal: React.FC<ResearchDetailModalProps> = ({
  item,
  type,
  isOpen,
  onClose
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!item) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': case 'granted': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'accepted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'under_review': case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'in_preparation': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'national': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'provincial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'university': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const renderPublicationDetails = (pub: Publication) => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {pub.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(pub.status)}`}>
              {pub.status === 'published' ? '已发表' : 
               pub.status === 'accepted' ? '已接收' :
               pub.status === 'under_review' ? '审稿中' : '准备中'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300">
              {pub.type === 'journal' ? '期刊论文' : '会议论文'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {pub.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">期刊</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.journal}</span>
            <UnifiedButton
              onClick={() => copyToClipboard(pub.journal, 'journal')}
              variant="ghost"
              size="sm"
              icon={copiedField === 'journal' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">发表年份</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.year}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">作者</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{pub.authors.join(', ')}</span>
            <UnifiedButton
                onClick={() => copyToClipboard(pub.authors.join(', '), 'authors')}
                variant="ghost"
                size="sm"
                icon={copiedField === 'authors' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              />
          </div>
        </div>

        {pub.doi && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">DOI</span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <a 
                href={`https://doi.org/${pub.doi}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex-1"
              >
                {pub.doi}
              </a>
              <UnifiedButton
                onClick={() => copyToClipboard(pub.doi!, 'doi')}
                variant="ghost"
                size="sm"
                icon={copiedField === 'doi' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
                className="ml-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPatentDetails = (patent: Patent) => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
          <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {patent.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(patent.status)}`}>
              {patent.status === 'granted' ? '已授权' : 
               patent.status === 'published' ? '已公开' : '审查中'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
              {patent.type === 'invention' ? '发明专利' : 
               patent.type === 'utility' ? '实用新型' : '外观设计'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {patent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">专利号</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300 font-mono">{patent.number}</span>
            <UnifiedButton
              onClick={() => copyToClipboard(patent.number, 'number')}
              variant="ghost"
              size="sm"
              icon={copiedField === 'number' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-400" />
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">申请人</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{patent.applicant}</span>
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">公开日期</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{patent.publicDate}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAwardDetails = (award: Award) => (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
          <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {award.title}
          </h2>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(award.level)}`}>
              {award.level === 'national' ? '国家级' : 
               award.level === 'provincial' ? '省级' : '校级'}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {award.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">颁发机构</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{award.organization}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="font-medium text-gray-900 dark:text-white">获奖日期</span>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{award.date}</span>
          </div>
        </div>

        {award.certificateNumber && (
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">证书编号</span>
            </div>
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <span className="text-gray-700 dark:text-gray-300 font-mono">{award.certificateNumber}</span>
              <UnifiedButton
                onClick={() => copyToClipboard(award.certificateNumber!, 'certificate')}
                variant="ghost"
                size="sm"
                icon={copiedField === 'certificate' ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                {type === 'publication' ? '论文详情' : 
                 type === 'patent' ? '专利详情' : '奖项详情'}
              </h1>
              <UnifiedButton
                onClick={onClose}
                variant="ghost"
                size="sm"
                icon={<X className="w-5 h-5" />}
              />
            </div>
            
            <div className="p-6">
              {type === 'publication' && renderPublicationDetails(item as Publication)}
              {type === 'patent' && renderPatentDetails(item as Patent)}
              {type === 'award' && renderAwardDetails(item as Award)}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};