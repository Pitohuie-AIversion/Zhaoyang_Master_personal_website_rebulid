import React, { useState, useCallback } from 'react';
import { useTranslation } from '../../common/TranslationProvider';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

interface ChatAssistantProps {
  className?: string;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ className = '' }) => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const handleToggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleCloseChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // 离线回复逻辑（当API不可用时）
  const getOfflineReply = useCallback((message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
      return t('common.chat.researchIntro', {
        fallback: language === 'zh'
          ? '牟昭阳的主要研究方向包括科学计算和机器人技术，特别专注于使用Transformer和Neural Operator建模CFD时空场。他在溃坝流动预测、稀疏到稠密场重构等领域有重要贡献。'
          : 'Zhaoyang Mu\'s main research areas include scientific computing and robotics, with a particular focus on using Transformer and Neural Operator for CFD spatiotemporal field modeling. He has made significant contributions in dam-break flow prediction and sparse-to-dense field reconstruction.'
      }) as string;
    }

    if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
      return t('common.chat.projectsIntro', {
        fallback: language === 'zh'
          ? '他参与了多个重要项目，包括DamFormer溃坝流动预测系统、Rs-ModCubes模块化机器人、仿生波动鳍推进系统、风扇阵列风洞实验平台等。这些项目涵盖了CFD仿真、机器人技术、硬件控制等多个领域。'
          : 'He has participated in several important projects, including the DamFormer dam-break flow prediction system, Rs-ModCubes modular robots, bionic undulating fin propulsion system, and fan array wind tunnel experimental platform. These projects cover CFD simulation, robotics, hardware control, and other fields.'
      }) as string;
    }

    if (lowerMessage.includes('教育') || lowerMessage.includes('education')) {
      return t('common.chat.educationIntro', {
        fallback: language === 'zh'
          ? '牟昭阳目前是大连海事大学人工智能专业的硕士研究生（2023.08-2026.06预计），导师是徐敏义教授。同时他也是西湖大学工学院i⁴-FSI实验室的访问学生（2024.06至今），PI是范迪夏教授。本科毕业于大连海事大学材料科学与工程专业。'
          : 'Zhaoyang Mu is currently a Master\'s student in Artificial Intelligence at Dalian Maritime University (2023.08-2026.06 expected), supervised by Prof. Xu Minyi. He is also a visiting student at the i⁴-FSI Laboratory, School of Engineering, Westlake University (2024.06-present), with PI Prof. Fan Dixia. He received his bachelor\'s degree in Materials Science and Engineering from Dalian Maritime University.'
      }) as string;
    }

    if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
      return t('common.chat.contactIntro', {
        fallback: language === 'zh'
          ? '您可以通过以下方式联系牟昭阳：\n📧 邮箱：muzhaoyang@dlmu.edu.cn\n📱 电话：+86 159-4095-5159\n🏠 地址：大连市甘井子区凌海路1号 大连海事大学\n您也可以访问他的GitHub、LinkedIn等社交媒体平台。'
          : 'You can contact Zhaoyang Mu through:\n📧 Email: muzhaoyang@dlmu.edu.cn\n📱 Phone: +86 159-4095-5159\n🏠 Address: No.1 Linghai Road, Ganjingzi District, Dalian, Dalian Maritime University\nYou can also visit his GitHub, LinkedIn and other social media platforms.'
      }) as string;
    }

    if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
      return t('common.chat.skillsIntro', {
        fallback: language === 'zh'
          ? '他掌握多种编程语言和工具：\n💻 编程：Python, MATLAB, C++, Java, JavaScript\n🔬 仿真：Star-CCM+, ANSYS Fluent, OpenFOAM\n🤖 机器学习：PyTorch, TensorFlow, Transformer\n⚙️ 硬件：STM32, Arduino, 传感器集成\n🖥️ 服务器：Linux, HPC集群管理'
          : 'He masters various programming languages and tools:\n💻 Programming: Python, MATLAB, C++, Java, JavaScript\n🔬 Simulation: Star-CCM+, ANSYS Fluent, OpenFOAM\n🤖 Machine Learning: PyTorch, TensorFlow, Transformer\n⚙️ Hardware: STM32, Arduino, Sensor Integration\n🖥️ Server: Linux, HPC Cluster Management'
      }) as string;
    }

    return t('common.chat.defaultHelp', {
      fallback: language === 'zh'
        ? '感谢您的提问！我是牟昭阳的智能助手，可以为您介绍他的学术背景、研究项目、技能专长等信息。请尝试询问更具体的问题，比如他的研究方向、项目经验、教育背景等。'
        : 'Thank you for your question! I\'m Zhaoyang Mu\'s AI assistant. I can introduce his academic background, research projects, and expertise. Please try asking more specific questions about his research areas, project experience, educational background, etc.'
    }) as string;
  }, [t, language]);

  // 获取相关链接
  const getRelatedLinks = useCallback((message: string) => {
    const lowerMessage = message.toLowerCase();
    const links = [];

    if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
      links.push({ title: t('navigation.research') as string, url: '/research' });
    }

    if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
      links.push({ title: t('navigation.projects') as string, url: '/projects' });
    }

    if (lowerMessage.includes('论文') || lowerMessage.includes('publication')) {
      links.push({ title: t('navigation.publications') as string, url: '/publications' });
    }

    if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
      links.push({ title: t('navigation.contact') as string, url: '/contact' });
    }

    if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
      links.push({ title: t('navigation.skills') as string, url: '/skills' });
    }

    return links;
  }, [t]);

  // 模拟发送消息到后端API
  const handleSendMessage = useCallback(async (message: string) => {
    try {
      // 生成会话ID（如果没有的话）
      let sessionId = localStorage.getItem('chat_session_id');
      if (!sessionId) {
        sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('chat_session_id', sessionId);
      }

      const response = await fetch('/api/chat/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          sessionId,
          language: language,
          context: [] // 可以添加上下文消息历史
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      return {
        reply: data.reply,
        relatedLinks: data.relatedLinks || []
      };
    } catch (error) {
      console.error('Failed to send message:', error);

      // 返回错误消息或离线回复
      return {
        reply: getOfflineReply(message),
        relatedLinks: getRelatedLinks(message)
      };
    }
  }, [language, getOfflineReply, getRelatedLinks]);

  return (
    <div className={`chat-assistant ${className}`}>
      <ChatButton
        isOpen={isOpen}
        onClick={handleToggleChat}
        hasUnread={hasUnread}
      />

      <ChatWindow
        isOpen={isOpen}
        onClose={handleCloseChat}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatAssistant;
