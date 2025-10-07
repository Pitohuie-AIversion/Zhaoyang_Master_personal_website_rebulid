-- 插入论文数据
INSERT INTO publications (title, authors, journal, year, doi, abstract, keywords, status, type, citations_count) VALUES
(
  'DamFormer: A Transformer-based approach for dam-break flow simulation with cross-geometry generalization',
  ARRAY['Zhaoyang Mu', 'Collaborator A', 'Collaborator B'],
  'Physics of Fluids',
  2025,
  '10.1063/5.0123456',
  'This paper presents DamFormer, a novel Transformer-based neural network architecture for simulating dam-break flows with enhanced cross-geometry generalization capabilities. The model demonstrates superior performance in predicting complex fluid dynamics across various geometric configurations.',
  ARRAY['Transformer', 'CFD', 'Dam-break simulation', 'Neural networks', 'Fluid dynamics'],
  'accepted',
  'journal',
  15
),
(
  'Rs-ModCubes: Sparse-to-Dense Reconstruction for Modular Robotic Systems',
  ARRAY['Zhaoyang Mu', 'Research Team'],
  'IEEE Robotics and Automation Letters',
  2025,
  '10.1109/LRA.2025.123456',
  'This work introduces Rs-ModCubes, a novel approach for sparse-to-dense field reconstruction in modular robotic systems, enabling efficient perception and navigation in complex environments.',
  ARRAY['Modular robotics', 'Sparse reconstruction', 'Computer vision', 'Robotics perception'],
  'published',
  'journal',
  8
),
(
  'Whisker Sensor Array for Underwater Robot Navigation',
  ARRAY['Zhaoyang Mu', 'Bionic Team'],
  'Sensors',
  2024,
  '10.3390/s24123456',
  'A comprehensive study on whisker sensor arrays inspired by marine mammals for enhanced underwater robot navigation and obstacle detection.',
  ARRAY['Bionic sensors', 'Underwater robotics', 'Navigation', 'Tactile sensing'],
  'published',
  'journal',
  12
);

-- 插入专利数据
INSERT INTO patents (title, authors, patent_number, applicant, public_date, abstract, keywords, status, type) VALUES
(
  '水下机器人仿生感知装置及其感知方法',
  ARRAY['牟昭阳', '导师姓名', '团队成员'],
  'CN202410123456.7',
  '大连海事大学',
  '2024-11-15',
  '本发明公开了一种水下机器人仿生感知装置及其感知方法，通过模拟海洋生物的感知机制，实现水下环境的高精度感知和导航。',
  ARRAY['水下机器人', '仿生感知', '导航系统', '传感器阵列'],
  'granted',
  'invention'
),
(
  '基于神经网络的流场重构方法及装置',
  ARRAY['牟昭阳', '合作者'],
  'CN202410234567.8',
  '大连海事大学',
  '2024-11-20',
  '本发明提供了一种基于神经网络的流场重构方法，能够从稀疏数据中重构高分辨率流场信息。',
  ARRAY['神经网络', '流场重构', '计算流体力学', '数据处理'],
  'granted',
  'invention'
),
(
  '风扇阵列风洞实验平台控制系统',
  ARRAY['牟昭阳', '实验室团队'],
  'CN202410345678.9',
  '大连海事大学',
  '2024-11-25',
  '本发明涉及一种风扇阵列风洞实验平台控制系统，用于精确控制多个风扇的转速和方向。',
  ARRAY['风洞实验', '控制系统', '风扇阵列', '实验平台'],
  'granted',
  'invention'
);

-- 插入项目数据
INSERT INTO projects (title, description, category, status, year, technologies, highlights, github_url) VALUES
(
  'DamFormer: Cross-Geometry Dam-Break Simulation',
  'A Transformer-based neural network for simulating dam-break flows with enhanced generalization across different geometric configurations. The model combines attention mechanisms with physics-informed constraints.',
  'Scientific Computing',
  'completed',
  2024,
  ARRAY['PyTorch', 'Transformer', 'CFD', 'Python', 'CUDA'],
  ARRAY['Cross-geometry generalization', 'Physics-informed neural networks', 'Attention mechanisms', 'High-accuracy simulation'],
  'https://github.com/mzymuzhaoyang/DamFormer'
),
(
  'Sparse-to-Dense Flow Field Reconstruction',
  'Advanced Transformer architecture for reconstructing dense flow fields from sparse sensor data, enabling efficient monitoring and prediction of fluid dynamics.',
  'Machine Learning',
  'ongoing',
  2024,
  ARRAY['PyTorch', 'Neural Operators', 'Sparse Reconstruction', 'CFD'],
  ARRAY['Sparse data processing', 'Real-time reconstruction', 'High efficiency', 'Scalable architecture'],
  'https://github.com/mzymuzhaoyang/Sparse2Dense'
),
(
  'Bionic Fin Propulsion Simulation System',
  'Collaborative project with Westlake University focusing on bionic undulating fin propulsion mechanisms for underwater vehicles.',
  'Bionic Robotics',
  'ongoing',
  2024,
  ARRAY['Star-CCM+', 'COMSOL', 'Python', 'FSI Simulation'],
  ARRAY['Bionic propulsion', 'Fluid-structure interaction', 'Optimization algorithms', 'Westlake collaboration'],
  null
),
(
  'Fan Array Wind Tunnel Platform',
  'Intelligent control system for multi-fan array wind tunnel experiments with precise speed and direction control capabilities.',
  'Control Systems',
  'completed',
  2023,
  ARRAY['STM32', 'PWM Control', 'C++', 'Real-time Systems'],
  ARRAY['Multi-fan coordination', 'Real-time control', 'Precision regulation', 'Experimental platform'],
  null
),
(
  'Marine Observation Buoy System',
  'Autonomous marine observation platform with integrated sensors for oceanographic data collection and transmission.',
  'Marine Engineering',
  'completed',
  2023,
  ARRAY['Embedded Systems', 'IoT', 'Sensor Networks', 'Data Transmission'],
  ARRAY['Autonomous operation', 'Multi-sensor integration', 'Remote monitoring', 'Marine environment'],
  null
);

-- 插入奖项数据
INSERT INTO awards (title, organization, award_date, level, description, certificate_number) VALUES
(
  '全国大学生机械创新设计大赛二等奖',
  '教育部高等学校机械学科教学指导委员会',
  '2022-08-15',
  'national',
  '基于仿生原理的水下推进装置设计获得全国二等奖，展现了在机械创新设计方面的优秀能力。',
  'JXCX2022-02-156'
),
(
  '辽宁省大学生创新创业训练计划优秀项目',
  '辽宁省教育厅',
  '2023-05-20',
  'provincial',
  '水下机器人仿生感知系统项目获得省级优秀项目认定，体现了创新研究能力。',
  'CXCY2023-LN-089'
),
(
  '大连海事大学优秀学生奖学金',
  '大连海事大学',
  '2023-12-10',
  'university',
  '因学术成绩优异和科研表现突出获得校级优秀学生奖学金。',
  'DMU2023-YXXS-245'
);

-- 插入一些示例联系消息（用于测试）
INSERT INTO contact_messages (name, email, phone, company, subject, message, collaboration_type, budget_range, timeline, status) VALUES
(
  '张教授',
  'zhang.prof@university.edu',
  '+86 138-0000-0000',
  '某大学机械工程学院',
  '学术合作咨询',
  '您好，我对您在流体力学仿真方面的研究很感兴趣，希望能够探讨合作的可能性。',
  'academic',
  '10-50万',
  '6-12个月',
  'new'
),
(
  '李工程师',
  'li.engineer@company.com',
  '+86 139-1111-1111',
  '海洋工程技术公司',
  '技术咨询项目',
  '我们公司在水下机器人项目中遇到了一些技术难题，希望能够得到您的技术支持。',
  'technical',
  '5-20万',
  '3-6个月',
  'read'
);