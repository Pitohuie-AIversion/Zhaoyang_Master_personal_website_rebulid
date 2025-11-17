import express from 'express';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import rateLimit from 'express-rate-limit';
import SecureKeyManager from '../utils/keyManager.js';

const router = express.Router();

// 初始化密钥管理器
let keyManager = null;
let supabase = null;
let openai = null;

// 初始化Supabase客户端和密钥管理器
try {
  supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log('✅ Supabase client initialized successfully');
  
  // 初始化密钥管理器
  keyManager = new SecureKeyManager(supabase);
  console.log('✅ Key manager initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
}

// 初始化 OpenAI 客户端（使用密钥管理器）
async function initializeOpenAI() {
  if (!keyManager) {
    console.log('⚠️ Key manager not available, using fallback mode');
    return null;
  }

  try {
    const openaiKey = await keyManager.getApiKey('openai_api_key');
    if (openaiKey && openaiKey !== 'your-openai-api-key-here') {
      // 配置OpenAI客户端，支持代理
      const clientConfig = { 
        apiKey: openaiKey,
        timeout: 30000,
        maxRetries: 2
      };

      // 如果使用VPN代理，可以配置代理设置
      if (process.env.HTTPS_PROXY || process.env.https_proxy) {
        console.log('🌐 Using proxy configuration for OpenAI API');
        // 这里可以添加代理配置
      }

      const client = new OpenAI(clientConfig);
      console.log('✅ OpenAI client initialized successfully');
      return client;
    } else {
      console.log('⚠️ OpenAI API key not configured, using fallback mode');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error.message);
    return null;
  }
}

// 速率限制中间件
const chatRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 30, // 每15分钟最多30次请求
  message: {
    error: 'Too many chat requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 知识库内容（基于网站信息）
const knowledgeBase = {
  zh: {
    personal: {
      name: '牟昭阳',
      title: '人工智能专业硕士研究生',
      university: '大连海事大学',
      visitingStudent: '西湖大学工学院i⁴-FSI实验室访问学生',
      advisor: '徐敏义教授',
      visitingPI: '范迪夏教授',
      location: '大连市甘井子区凌海路1号',
      email: 'mzymuzhaoyang@gmail.com',
      phone: '+86 153-8213-0266'
    },
    research: {
      areas: ['科学计算', '机器人技术', 'CFD时空场建模', 'Transformer', 'Neural Operator'],
      focus: '使用Transformer和Neural Operator建模CFD时空场',
      contributions: ['溃坝流动预测', '稀疏到稠密场重构', 'DamFormer系统开发', '仿生波动鳍推进仿真', '风扇阵列风洞设计']
    },
    projects: [
      {
        name: 'DamFormer溃坝流动预测系统',
        description: '基于Transformer的CFD时空场预测模型，跨几何零样本泛化，发表于Physics of Fluids',
        tech: ['Python', 'PyTorch', 'Transformer', 'CFD仿真', 'Neural Operator']
      },
      {
        name: 'Sparse→Dense Transformer稀疏到稠密场重构',
        description: '面向CFD/环境流动，稀疏传感重建高分辨率时空场',
        tech: ['Python', 'PyTorch', '稀疏感知', '场重构', 'PDE求解']
      },
      {
        name: 'Rs-ModCubes模块化机器人',
        description: '可重构模块化机器人系统，自重构、可扩展、模块化立方体机器人',
        tech: ['STM32', '硬件控制', '机器人技术', '自重构算法']
      },
      {
        name: '仿生波动鳍推进仿真',
        description: '西湖大学i⁴-FSI实验室项目，Star-CCM+ CFD/FSI耦合仿真，Java Macro自动化参数扫描',
        tech: ['Star-CCM+', 'CFD-FSI', 'Java Macro', '仿生推进', '波动鳍']
      },
      {
        name: '风扇阵列风洞(Fan-Wall)',
        description: '模块化2.5m×2.5m阵列，STM32多板PWM/TACH闭环，VLAN/DHCP网络管理',
        tech: ['STM32', 'PWM/TACH', 'VLAN', 'DHCP', '网络管理', '闭环控制']
      },
      {
        name: '海洋观测浮标机械设计',
        description: '负责结构、密封、防腐、浮力计算、BOM出图及池/海试',
        tech: ['SolidWorks', 'Shapr3D', 'BOM', '干涉检查', '密封设计', '防腐设计']
      }
    ],
    skills: {
      programming: ['Python', 'MATLAB', 'C++', 'Java', 'JavaScript'],
      simulation: ['Star-CCM+', 'ANSYS Fluent', 'OpenFOAM', 'COMSOL'],
      ml: ['PyTorch', 'TensorFlow', 'Transformer', 'Neural Operator'],
      hardware: ['STM32', 'Arduino', '传感器集成', 'PWM/TACH'],
      server: ['Linux', 'HPC集群管理', 'CUDA', 'SLURM', 'W&B'],
      mechanical: ['SolidWorks', 'Shapr3D', 'BOM', '干涉检查']
    }
  },
  en: {
    personal: {
      name: 'Zhaoyang Mu',
      title: 'Master\'s Student in Artificial Intelligence',
      university: 'Dalian Maritime University',
      visitingStudent: 'Visiting Student at i⁴-FSI Laboratory, School of Engineering, Westlake University',
      advisor: 'Prof. Xu Minyi',
      visitingPI: 'Prof. Fan Dixia',
      location: 'No.1 Linghai Road, Ganjingzi District, Dalian',
      email: 'mzymuzhaoyang@gmail.com',
      phone: '+86 153-8213-0266'
    },
    research: {
      areas: ['Scientific Computing', 'Robotics', 'CFD Spatiotemporal Field Modeling', 'Transformer', 'Neural Operator'],
      focus: 'Using Transformer and Neural Operator for CFD spatiotemporal field modeling',
      contributions: ['Dam-break flow prediction', 'Sparse-to-dense field reconstruction', 'DamFormer system development', 'Bionic undulating fin propulsion simulation', 'Fan-array wind tunnel design']
    },
    projects: [
      {
        name: 'DamFormer Dam-break Flow Prediction System',
        description: 'Transformer-based CFD spatiotemporal field prediction model with cross-geometry zero-shot generalization, published in Physics of Fluids',
        tech: ['Python', 'PyTorch', 'Transformer', 'CFD Simulation', 'Neural Operator']
      },
      {
        name: 'Sparse→Dense Transformer for Field Reconstruction',
        description: 'Sparse sensor data reconstruction of high-resolution spatiotemporal fields for CFD/environmental flows',
        tech: ['Python', 'PyTorch', 'Sparse Sensing', 'Field Reconstruction', 'PDE Solving']
      },
      {
        name: 'Rs-ModCubes Modular Robots',
        description: 'Self-reconfigurable, scalable, modular cubic robots for underwater operations',
        tech: ['STM32', 'Hardware Control', 'Robotics', 'Self-reconfiguration Algorithms']
      },
      {
        name: 'Bionic Undulating Fin Propulsion Simulation',
        description: 'i⁴-FSI Laboratory, Westlake University. CFD/FSI coupling simulation with Star-CCM+, Java Macro automated parameter scanning',
        tech: ['Star-CCM+', 'CFD-FSI', 'Java Macro', 'Bionic Propulsion', 'Undulating Fin']
      },
      {
        name: 'Fan-Wall Wind Tunnel Array',
        description: 'Modular 2.5m×2.5m array, STM32 multi-board PWM/TACH closed-loop, VLAN/DHCP network management',
        tech: ['STM32', 'PWM/TACH', 'VLAN', 'DHCP', 'Network Management', 'Closed-loop Control']
      },
      {
        name: 'Ocean Observation Buoy Mechanical Design',
        description: 'Responsible for structure, sealing, anti-corrosion, buoyancy calculation, BOM drawing and pool/sea trials',
        tech: ['SolidWorks', 'Shapr3D', 'BOM', 'Interference Check', 'Sealing Design', 'Anti-corrosion Design']
      }
    ],
    skills: {
      programming: ['Python', 'MATLAB', 'C++', 'Java', 'JavaScript'],
      simulation: ['Star-CCM+', 'ANSYS Fluent', 'OpenFOAM', 'COMSOL'],
      ml: ['PyTorch', 'TensorFlow', 'Transformer', 'Neural Operator'],
      hardware: ['STM32', 'Arduino', 'Sensor Integration', 'PWM/TACH'],
      server: ['Linux', 'HPC Cluster Management', 'CUDA', 'SLURM', 'W&B'],
      mechanical: ['SolidWorks', 'Shapr3D', 'BOM', 'Interference Check']
    }
  }
};

// 生成增强系统提示词
function generateEnhancedSystemPrompt(language = 'zh', knowledgeData) {
  const kb = knowledgeData;
  
  return `You are an intelligent academic assistant for Zhaoyang Mu, a master's student specializing in AI and CFD research at Dalian Maritime University. 

Your role is to provide comprehensive, accurate, and engaging responses about Zhaoyang's academic background, research projects, and technical expertise. You should combine general knowledge with the specific information provided about Zhaoyang's work.

Personal Information:
- Name: ${kb.personal.name}
- Title: ${kb.personal.title}
- University: ${kb.personal.university}
- Visiting Student: ${kb.personal.visitingStudent}
- Advisor: ${kb.personal.advisor}
- Visiting PI: ${kb.personal.visitingPI}
- Location: ${kb.personal.location}
- Contact: ${kb.personal.email}, ${kb.personal.phone}

Research Focus Areas:
- Primary Fields: ${kb.research.areas.join(', ')}
- Research Emphasis: ${kb.research.focus}
- Key Contributions: ${kb.research.contributions.join(', ')}

Major Projects:
${kb.projects.map(p => `- ${p.name}: ${p.description} (Technologies: ${p.tech.join(', ')})`).join('\n')}

Technical Skills:
- Programming: ${kb.skills.programming.join(', ')}
- Simulation Software: ${kb.skills.simulation.join(', ')}
- Machine Learning: ${kb.skills.ml.join(', ')}
- Hardware Development: ${kb.skills.hardware.join(', ')}
- Server Management: ${kb.skills.server.join(', ')}
${kb.skills.mechanical ? `- Mechanical Design: ${kb.skills.mechanical.join(', ')}` : ''}

Response Guidelines:
1. Use ${language === 'zh' ? 'Chinese' : 'English'} for all responses
2. Provide detailed, accurate information about Zhaoyang's research and projects
3. When discussing technical topics, explain concepts clearly and provide relevant context
4. For research-related questions, mention specific papers, methodologies, or results when applicable
5. Maintain a professional yet approachable tone
6. If asked about topics beyond the provided information, use your general knowledge to provide helpful context while clearly stating what information is from Zhaoyang's specific work versus general knowledge
7. For technical questions about CFD, AI, or robotics, provide comprehensive explanations that demonstrate deep understanding of these fields
8. Always aim to be helpful, accurate, and engaging in your responses

Remember: You are representing Zhaoyang Mu's academic profile, so accuracy and professionalism are paramount.`;
}

// 增强OpenAI响应
function enhanceOpenAIResponse(openaiResponse, language, knowledgeData) {
  // 首先检查OpenAI响应是否已经足够好
  if (!openaiResponse || openaiResponse.length < 50) {
    return generateKnowledgeBaseResponse("tell me about yourself", language);
  }
  
  // 如果OpenAI响应已经很好，可以直接使用，但添加个性化元素
  const kb = knowledgeData;
  
  // 根据响应内容决定是否需要增强
  const responseLower = openaiResponse.toLowerCase();
  
  // 如果响应太通用或缺乏个性化，进行增强
  if (responseLower.includes('i am an ai assistant') || 
      responseLower.includes('i don\'t have specific information') ||
      responseLower.length < 100) {
    
    // 生成基于知识库的个性化响应
    const personalizedResponse = generateKnowledgeBaseResponse("introduce yourself", language);
    
    // 如果个性化响应质量更高，使用它
    if (personalizedResponse.length > openaiResponse.length * 1.5) {
      return personalizedResponse;
    }
  }
  
  // 否则，使用OpenAI响应但确保它包含关键信息
  return openaiResponse;
}

// 生成知识库响应
function generateKnowledgeBaseResponse(message, language) {
  const kb = knowledgeBase[language] || knowledgeBase.zh;
  const lowerMessage = message.toLowerCase();
  
  // 自我介绍
  if (lowerMessage.includes('introduce') || lowerMessage.includes('介绍') || 
      lowerMessage.includes('who are you') || lowerMessage.includes('你是谁')) {
    
    if (language === 'zh') {
      return `您好！我是牟昭阳的智能学术助手。牟昭阳是大连海事大学人工智能专业的硕士研究生，目前在西湖大学工学院i⁴-FSI实验室担任访问学生。

他的主要研究方向包括科学计算、机器人技术、CFD时空场建模等，特别专注于使用Transformer和Neural Operator进行CFD时空场建模。他在溃坝流动预测、稀疏到稠密场重构等领域有重要贡献，并开发了DamFormer系统。

如果您对他的研究项目或学术背景有任何问题，我都很乐意为您详细介绍！`;
    } else {
      return `Hello! I am the intelligent academic assistant for Zhaoyang Mu. Zhaoyang is a master's student in Artificial Intelligence at Dalian Maritime University and currently a visiting student at the i⁴-FSI Laboratory, School of Engineering, Westlake University.

His primary research areas include scientific computing, robotics, and CFD spatiotemporal field modeling, with a particular focus on using Transformer and Neural Operator for CFD spatiotemporal field modeling. He has made significant contributions in dam-break flow prediction, sparse-to-dense field reconstruction, and developed the DamFormer system.

If you have any questions about his research projects or academic background, I'd be happy to provide detailed information!`;
    }
  }
  
  // 研究相关问题
  if (lowerMessage.includes('research') || lowerMessage.includes('研究') ||
      lowerMessage.includes('work') || lowerMessage.includes('工作')) {
    
    if (language === 'zh') {
      return `牟昭阳的研究工作主要集中在以下几个领域：

1. **CFD时空场建模**：使用Transformer和Neural Operator进行计算流体动力学的时空场预测，特别擅长处理复杂的几何形状和边界条件。

2. **溃坝流动预测**：开发了DamFormer系统，能够跨几何零样本泛化，准确预测溃坝后的水流演化过程，该研究成果已发表于Physics of Fluids期刊。

3. **稀疏到稠密场重构**：研究如何从稀疏的传感器数据中重建高分辨率的时空场，这对于环境监测和CFD应用具有重要意义。

4. **仿生推进研究**：在西湖大学i⁴-FSI实验室参与仿生波动鳍推进仿真项目，使用Star-CCM+进行CFD/FSI耦合仿真。

5. **实验设备开发**：参与设计了风扇阵列风洞(Fan-Wall)系统和海洋观测浮标等实验设备。

他的研究结合了理论分析、数值仿真和实验验证，在AI与CFD的交叉领域做出了创新性贡献。`;
    } else {
      return `Zhaoyang's research focuses on several key areas:

1. **CFD Spatiotemporal Field Modeling**: Using Transformer and Neural Operator for computational fluid dynamics spatiotemporal field prediction, particularly skilled at handling complex geometries and boundary conditions.

2. **Dam-break Flow Prediction**: Developed the DamFormer system with cross-geometry zero-shot generalization capabilities, accurately predicting water flow evolution after dam breaks. This research was published in Physics of Fluids.

3. **Sparse-to-Dense Field Reconstruction**: Investigating how to reconstruct high-resolution spatiotemporal fields from sparse sensor data, which has significant implications for environmental monitoring and CFD applications.

4. **Bionic Propulsion Research**: At Westlake University's i⁴-FSI Laboratory, he participates in bionic undulating fin propulsion simulation projects using Star-CCM+ for CFD/FSI coupling simulations.

5. **Experimental Equipment Development**: Involved in designing fan-array wind tunnel (Fan-Wall) systems and ocean observation buoys.

His research combines theoretical analysis, numerical simulation, and experimental validation, making innovative contributions at the intersection of AI and CFD.`;
    }
  }
  
  // 项目相关问题
  if (lowerMessage.includes('project') || lowerMessage.includes('项目') ||
      lowerMessage.includes('damformer')) {
    
    if (language === 'zh') {
      return `DamFormer是牟昭阳开发的一个基于Transformer的溃坝流动预测系统，这是他最具代表性的研究项目之一。

**项目特点：**
- 跨几何零样本泛化能力
- 基于Transformer架构的时空场预测
- 专门用于CFD（计算流体动力学）应用
- 能够处理复杂的边界条件和几何形状

**技术栈：**
- Python + PyTorch深度学习框架
- Transformer神经网络架构
- Neural Operator理论
- CFD仿真技术

**应用价值：**
该系统能够准确预测溃坝后的水流演化过程，对于水利工程安全评估、洪水预警系统等具有重要应用价值。研究成果发表在了Physics of Fluids期刊上，显示了其学术价值和创新性。

这个项目充分展示了牟昭阳在AI与CFD交叉领域的深厚功底。`;
    } else {
      return `DamFormer is a dam-break flow prediction system based on Transformer architecture developed by Zhaoyang Mu, representing one of his most significant research projects.

**Key Features:**
- Cross-geometry zero-shot generalization capability
- Transformer-based spatiotemporal field prediction
- Specialized for CFD (Computational Fluid Dynamics) applications
- Capable of handling complex boundary conditions and geometries

**Technology Stack:**
- Python + PyTorch deep learning framework
- Transformer neural network architecture
- Neural Operator theory
- CFD simulation technology

**Application Value:**
This system can accurately predict water flow evolution after dam breaks, with significant applications for hydraulic engineering safety assessment and flood warning systems. The research was published in Physics of Fluids, demonstrating its academic value and innovation.

This project fully demonstrates Zhaoyang's deep expertise at the intersection of AI and CFD.`;
    }
  }
  
  // 默认响应
  if (language === 'zh') {
    return `您好！我是牟昭阳的学术助手。我可以为您介绍他的研究背景、项目成果和专业技能。

牟昭阳是大连海事大学人工智能专业的硕士研究生，在CFD时空场建模、Transformer应用、Neural Operator等领域有深入研究。他开发了DamFormer溃坝预测系统，在Physics of Fluids等期刊发表研究成果。

您想了解他的哪个方面呢？比如研究项目、技术技能、教育背景等，我都可以为您详细介绍。`;
  } else {
    return `Hello! I am Zhaoyang Mu's academic assistant. I can provide information about his research background, project achievements, and technical expertise.

Zhaoyang is a master's student in Artificial Intelligence at Dalian Maritime University, with deep research in CFD spatiotemporal field modeling, Transformer applications, and Neural Operator. He developed the DamFormer dam-break prediction system and has published research in journals like Physics of Fluids.

Which aspect would you like to know more about? Research projects, technical skills, educational background - I can provide detailed information on any of these topics.`;
  }
}

// 生成相关链接
function generateRelatedLinks(message, language) {
  const lowerMessage = message.toLowerCase();
  const links = [];
  
  const linkMap = {
    zh: {
      research: { title: '研究页面', url: '/research' },
      projects: { title: '项目展示', url: '/projects' },
      publications: { title: '学术论文', url: '/publications' },
      contact: { title: '联系方式', url: '/contact' },
      skills: { title: '技能专长', url: '/skills' },
      home: { title: '个人主页', url: '/' }
    },
    en: {
      research: { title: 'Research', url: '/research' },
      projects: { title: 'Projects', url: '/projects' },
      publications: { title: 'Publications', url: '/publications' },
      contact: { title: 'Contact', url: '/contact' },
      skills: { title: 'Skills', url: '/skills' },
      home: { title: 'Home', url: '/' }
    }
  };
  
  const currentLinks = linkMap[language] || linkMap.zh;
  
  if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
    links.push(currentLinks.research);
  }
  
  if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
    links.push(currentLinks.projects);
  }
  
  if (lowerMessage.includes('论文') || lowerMessage.includes('publication')) {
    links.push(currentLinks.publications);
  }
  
  if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
    links.push(currentLinks.contact);
  }
  
  if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
    links.push(currentLinks.skills);
  }
  
  // 如果没有匹配到特定链接，返回主页
  if (links.length === 0) {
    links.push(currentLinks.home);
  }
  
  return links.slice(0, 3); // 最多返回3个链接
}

// 查询分类
function categorizeQuery(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('研究') || lowerMessage.includes('research')) {
    return 'research';
  }
  if (lowerMessage.includes('项目') || lowerMessage.includes('project')) {
    return 'projects';
  }
  if (lowerMessage.includes('教育') || lowerMessage.includes('education')) {
    return 'education';
  }
  if (lowerMessage.includes('技能') || lowerMessage.includes('skill')) {
    return 'skills';
  }
  if (lowerMessage.includes('联系') || lowerMessage.includes('contact')) {
    return 'contact';
  }
  
  return 'general';
}

// 获取聊天历史
router.get('/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50 } = req.query;

    // 如果Supabase不可用，返回空历史记录
    if (!supabase) {
      return res.json({
        messages: [],
        sessionId,
        count: 0,
        error: 'Chat history temporarily unavailable'
      });
    }

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(parseInt(limit));

    if (error) {
      throw error;
    }

    res.json({
      messages: data || [],
      sessionId
    });

  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve chat history'
    });
  }
});

export default router;