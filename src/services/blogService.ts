export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  updatedDate?: string;
  tags: string[];
  category: string;
  coverImage?: string;
  readingTime: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  metadata?: {
    seoTitle?: string;
    seoDescription?: string;
    keywords?: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  postCount: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface BlogComment {
  id: string;
  postId: string;
  author: string;
  email: string;
  content: string;
  date: string;
  isApproved: boolean;
  parentId?: string;
}

export interface BlogSearchOptions {
  category?: string;
  tag?: string;
  author?: string;
  search?: string;
  sortBy?: 'date' | 'views' | 'likes' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
  includeUnpublished?: boolean;
}

class BlogService {
  private posts: BlogPost[] = [];
  private categories: BlogCategory[] = [];
  private tags: BlogTag[] = [];
  private comments: BlogComment[] = [];
  private isInitialized = false;

  // 初始化博客数据
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // 模拟博客数据
      this.categories = [
        {
          id: '1',
          name: '学术研究',
          slug: 'academic-research',
          description: '关于人工智能、机器学习、科学计算的研究分享',
          color: 'blue',
          postCount: 3
        },
        {
          id: '2',
          name: '项目开发',
          slug: 'project-development',
          description: '项目开发经验、技术实践、代码分享',
          color: 'green',
          postCount: 2
        },
        {
          id: '3',
          name: '技术思考',
          slug: 'technical-thinking',
          description: '对技术发展趋势的思考和个人见解',
          color: 'purple',
          postCount: 1
        },
        {
          id: '4',
          name: '学习笔记',
          slug: 'learning-notes',
          description: '学习过程中的笔记、总结和心得',
          color: 'orange',
          postCount: 1
        }
      ];

      this.tags = [
        { id: '1', name: '人工智能', slug: 'ai', postCount: 4 },
        { id: '2', name: '机器学习', slug: 'machine-learning', postCount: 3 },
        { id: '3', name: '深度学习', slug: 'deep-learning', postCount: 2 },
        { id: '4', name: '科学计算', slug: 'scientific-computing', postCount: 2 },
        { id: '5', name: 'CFD', slug: 'cfd', postCount: 2 },
        { id: '6', name: 'Transformer', slug: 'transformer', postCount: 1 },
        { id: '7', name: '水下机器人', slug: 'underwater-robotics', postCount: 2 },
        { id: '8', name: 'Python', slug: 'python', postCount: 2 },
        { id: '9', name: 'PyTorch', slug: 'pytorch', postCount: 1 },
        { id: '10', name: '数值仿真', slug: 'numerical-simulation', postCount: 1 }
      ];

      this.posts = [
        {
          id: '1',
          title: 'Transformer在CFD时空场建模中的应用与思考',
          slug: 'transformer-cfd-spatiotemporal-modeling',
          excerpt: '探讨Transformer架构在计算流体力学时空场建模中的应用，分析其优势与挑战，并分享实际项目经验。',
          content: `
# Transformer在CFD时空场建模中的应用与思考

## 引言

计算流体力学（CFD）作为现代工程和科学研究的重要工具，其时空场的准确建模一直是研究热点。近年来，随着深度学习技术的快速发展，Transformer架构在自然语言处理和计算机视觉领域取得了巨大成功，也逐渐被引入到科学计算领域。

## Transformer架构的优势

### 1. 长距离依赖建模
Transformer的自注意力机制能够有效捕捉时空场中的长距离依赖关系，这对于理解复杂的流体动力学现象至关重要。

### 2. 并行计算能力
相比传统的循环神经网络，Transformer的并行计算特性大大提高了训练效率。

### 3. 可解释性
通过注意力权重的可视化，我们可以更好地理解模型是如何学习和预测时空场的。

## 实际应用案例

### 溃坝流模拟
在我们的研究中，我们使用Transformer架构对溃坝流进行了建模。实验结果表明：

- 预测精度提升了15-20%
- 计算时间减少了30%
- 模型具有良好的泛化能力

### 参数化研究
我们还探索了不同参数设置对模型性能的影响，发现：

- 注意力头数：8-16个效果最佳
- 层数：6-8层能够平衡性能和计算成本
- 嵌入维度：256-512维较为合适

## 挑战与展望

### 主要挑战
1. **数据需求量大**：需要大量的高质量CFD数据
2. **计算资源消耗**：训练和推理需要较强的计算资源
3. **物理约束**：如何确保模型预测符合物理规律

### 未来方向
1. **物理信息神经网络（PINN）**：结合物理方程约束
2. **多尺度建模**：处理不同尺度的时空特征
3. **实时预测**：提高推理速度，实现实时应用

## 结论

Transformer架构在CFD时空场建模中展现出了巨大潜力，但仍需要进一步的研究来克服当前的挑战。随着技术的不断发展，我相信这一领域将会有更多突破性的进展。

## 参考文献

1. Vaswani, A., et al. (2017). Attention Is All You Need. NIPS.
2. Li, Z., et al. (2020). Neural Operator: Graph Kernel Network for Partial Differential Equations.
3. Lu, L., et al. (2021). Learning nonlinear operators via DeepONet based on the universal approximation theorem of operators.
`,
          author: '牟昭阳',
          date: '2024-12-01',
          category: '学术研究',
          tags: ['人工智能', '机器学习', 'CFD', 'Transformer', '科学计算'],
          readingTime: 8,
          views: 1250,
          likes: 45,
          isPublished: true,
          isFeatured: true,
          metadata: {
            seoTitle: 'Transformer在CFD时空场建模中的应用 - 牟昭阳的学术博客',
            seoDescription: '探讨Transformer架构在计算流体力学时空场建模中的应用，分享实际项目经验和思考。',
            keywords: ['Transformer', 'CFD', '深度学习', '科学计算', '时空场建模']
          }
        },
        {
          id: '2',
          title: '稀疏到稠密场重建：从理论到实践的探索',
          slug: 'sparse-to-dense-field-reconstruction',
          excerpt: '详细介绍稀疏到稠密场重建的技术原理、实现方法以及在实际项目中的应用效果。',
          content: `
# 稀疏到稠密场重建：从理论到实践的探索

## 背景介绍

在科学计算和工程应用中，我们经常面临稀疏观测数据需要重建为完整稠密场的挑战。这种问题在气象预报、海洋监测、环境监测等领域都有广泛应用。

## 技术原理

### 问题定义
给定稀疏观测点 $(x_i, y_i, z_i)$ 和对应的观测值 $v_i$，我们的目标是重建完整的场 $f(x, y, z)$。

### 数学建模
我们采用变分方法，最小化以下能量函数：

$$E(f) = \sum_{i=1}^N (f(x_i, y_i, z_i) - v_i)^2 + \lambda R(f)$$

其中 $R(f)$ 是正则化项，$\lambda$ 是正则化参数。

## 实现方法

### 1. 基于插值的方法
- **径向基函数插值**：适用于光滑场
- **克里金插值**：考虑空间相关性
- **反距离加权**：简单高效

### 2. 基于学习的方法
- **神经网络**：强大的非线性建模能力
- **高斯过程**：提供不确定性估计
- **图神经网络**：处理不规则网格

### 3. 混合方法
结合传统插值和深度学习的优势，我们提出了混合重建框架。

## 实际应用

### 环境流场重建
在某环境监测项目中，我们使用8个传感器的数据重建了整个区域的流场：

- **数据稀疏性**：传感器覆盖率仅5%
- **重建精度**：RMSE < 0.1 m/s
- **实时性**：单次重建时间 < 100ms

### 水下机器人感知
在水下机器人应用中，我们利用稀疏的声呐数据重建了海底地形：

- **传感器限制**：声呐扫描角度有限
- **环境挑战**：水体浑浊、光线不足
- **应用效果**：成功辅助机器人导航

## 技术挑战

### 1. 数据质量
- **噪声处理**：观测数据存在测量误差
- **异常值检测**：识别和处理异常观测
- **数据融合**：整合多源观测数据

### 2. 计算效率
- **大规模问题**：处理高分辨率网格
- **实时要求**：满足在线应用需求
- **资源约束**：在边缘设备上运行

### 3. 不确定性量化
- **预测不确定性**：提供置信区间
- **敏感性分析**：评估输入数据影响
- **模型选择**：选择合适的重建方法

## 解决方案

### 自适应正则化
根据数据局部特征自适应调整正则化强度：

$$\lambda(x) = \lambda_0 \cdot g(|\nabla f(x)|)$$

其中 $g(\cdot)$ 是单调递减函数。

### 多尺度重建
采用金字塔式多尺度方法，从粗到细逐步重建：

1. **粗尺度**：快速获得大致分布
2. **中尺度**：细化局部特征
3. **细尺度**：精确重建细节

### 在线学习
对于时变场，采用在线学习方法更新模型：

$$\theta_{t+1} = \theta_t + \eta \nabla_\theta \mathcal{L}(\theta_t)$$

## 实验结果

### 合成数据实验
在合成数据上的实验表明：

| 方法 | RMSE | MAE | 计算时间(s) |
|------|------|-----|-------------|
| 线性插值 | 0.25 | 0.20 | 0.01 |
| 克里金 | 0.18 | 0.14 | 2.3 |
| 神经网络 | 0.12 | 0.09 | 0.8 |
| 混合方法 | 0.10 | 0.07 | 0.5 |

### 真实数据验证
在真实环境监测数据上的验证：

- **精度提升**：相比传统方法提升40%
- **鲁棒性**：对数据缺失具有较强容忍度
- **泛化能力**：在不同场景下表现稳定

## 未来展望

### 技术发展方向
1. **物理约束集成**：结合物理定律提高合理性
2. **多模态融合**：整合视觉、声学等多模态数据
3. **边缘计算优化**：适配移动和嵌入式设备

### 应用拓展
1. **智慧城市**：城市环境监测和管理
2. **精准农业**：农田环境参数监测
3. **灾害预警**：自然灾害早期预警

## 总结

稀疏到稠密场重建是一个具有重要理论意义和实际应用价值的研究方向。通过结合传统数值方法和现代机器学习技术，我们能够有效解决这一挑战性问题。未来的研究应该更加注重物理约束的集成和实际应用的优化。
`,
          author: '牟昭阳',
          date: '2024-11-15',
          category: '项目开发',
          tags: ['稀疏重建', '机器学习', '科学计算', '环境感知', '水下机器人'],
          readingTime: 12,
          views: 890,
          likes: 32,
          isPublished: true,
          isFeatured: true,
          metadata: {
            seoTitle: '稀疏到稠密场重建技术详解 - 牟昭阳的学术博客',
            seoDescription: '详细介绍稀疏到稠密场重建的技术原理、实现方法以及在实际项目中的应用效果。',
            keywords: ['稀疏重建', '机器学习', '科学计算', '环境感知', '数值仿真']
          }
        },
        {
          id: '3',
          title: '水下机器人仿生波动鳍推进的仿真研究',
          slug: 'bionic-undulating-fin-propulsion-simulation',
          excerpt: '分享水下机器人仿生波动鳍推进的仿真研究成果，包括建模方法、仿真结果和实验验证。',
          content: `
# 水下机器人仿生波动鳍推进的仿真研究

## 研究背景

水下机器人在海洋探索、水下作业、环境监测等领域具有重要应用价值。传统的螺旋桨推进方式存在噪音大、效率低、对海洋生物干扰强等问题。仿生波动鳍推进技术作为一种新型推进方式，具有高效、低噪、环境友好等优势。

## 仿生学原理

### 生物启发
我们的研究灵感来源于：
- **鳗鱼**：利用身体波动产生推进力
- **鳐鱼**：胸鳍波动推进
- **海龟**：四肢划水模式
- **章鱼**：触手波动运动

### 推进机理
波动鳍推进的基本原理：

$$F = \rho \cdot S \cdot v^2 \cdot C_L(\alpha)$$

其中：
- $\rho$：流体密度
- $S$：鳍面积
- $v$：波动速度
- $C_L$：升力系数

## 建模方法

### 几何建模
采用参数化方法建立波动鳍几何模型：

$$y(x,t) = A(x) \cdot \sin(kx - \omega t)$$

其中：
- $A(x)$：振幅分布函数
- $k$：波数
- $\omega$：角频率

### 运动学建模
考虑鳍的柔性变形，建立多连杆模型：

$$\theta_i(t) = \theta_0 \cdot \sin(\omega t + \phi_i)$$

其中：
- $\theta_i$：第i个连杆的角度
- $\phi_i$：相位差

### 动力学建模
基于牛顿-欧拉方程建立动力学模型：

$$M(q)\ddot{q} + C(q,\dot{q})\dot{q} + G(q) = \tau$$

## 仿真平台

### 仿真环境
- **软件平台**：ANSYS Fluent + MATLAB/Simulink
- **计算网格**：非结构化网格，约50万单元
- **求解器**：压力基求解器，SIMPLE算法
- **湍流模型**：k-ω SST模型

### 边界条件
- **入口**：速度入口，0.5-2.0 m/s
- **出口**：压力出口，静水压力
- **壁面**：无滑移边界
- **动网格**：用户定义函数(UDF)

## 仿真结果

### 推进性能分析

#### 1. 推进力特性
仿真结果表明：
- **平均推进力**：0.5-3.2 N（随频率增加）
- **推进效率**：65-78%（最优工况）
- **功率消耗**：2-8 W

#### 2. 流场特征
波动鳍产生的流场特征：
- **涡旋结构**：形成明显的反向卡门涡街
- **速度分布**：产生明显的射流效应
- **压力分布**：上下表面压力差产生升力

#### 3. 参数影响
主要参数对推进性能的影响：

| 参数 | 影响趋势 | 最优范围 |
|------|----------|----------|
| 波动频率 | 推进力↑，效率↓ | 1-3 Hz |
| 振幅 | 推进力↑，功率↑ | 0.1-0.3 L |
| 波长 | 推进力↓，效率↑ | 0.5-1.0 L |
| 攻角 | 推进力↑，稳定性↓ | 15-25° |

### 运动学优化

#### 多目标优化
采用NSGA-II算法进行多目标优化：

**目标函数**：
- 最大化推进力
- 最小化功率消耗
- 最大化推进效率

**设计变量**：
- 波动频率
- 振幅分布
- 相位差
- 攻角

**优化结果**：
- Pareto最优解集获得
- 最优工况：频率1.8 Hz，振幅0.25 L
- 推进效率达到78%

## 实验验证

### 实验装置
- **实验水池**：2m × 1m × 1m
- **测量系统**：六维力传感器
- **运动控制**：伺服电机 + 运动控制卡
- **数据采集**：高速采集系统

### 实验结果

#### 推进力对比
仿真与实验结果对比：

| 工况 | 仿真结果(N) | 实验结果(N) | 误差(%) |
|------|-------------|-------------|---------|
| 1 Hz, 0.2 L | 1.25 | 1.18 | 5.6 |
| 2 Hz, 0.2 L | 2.34 | 2.21 | 5.9 |
| 3 Hz, 0.2 L | 3.12 | 2.95 | 5.8 |

#### 流场可视化
通过PIV(粒子图像测速)技术进行流场测量：

- **涡旋结构**：仿真与实验吻合良好
- **速度分布**：射流特征明显
- **湍流强度**：分布规律一致

## 创新点

### 1. 多模态波动控制
提出多模态波动控制策略：

$$y(x,t) = \sum_{n=1}^N A_n(x) \cdot \sin(k_n x - \omega_n t + \phi_n)$$

实现推进力和机动性的独立控制。

### 2. 自适应形状优化
基于实时流场反馈的自适应形状优化：

$$A(x,t) = A_0(x) + \Delta A(x) \cdot f(C_p(x,t))$$

根据压力分布实时调整振幅。

### 3. 仿生材料应用
采用形状记忆合金(SMA)实现柔性鳍：

- **响应速度**：< 0.1 s
- **变形能力**：最大20%应变
- **疲劳寿命**：> 10^6 次循环

## 应用前景

### 水下机器人
- **海洋勘探**：长航程、低噪音
- **水下作业**：高精度定位
- **环境监测**：生态友好

### 仿生推进器
- **船舶推进**：提高效率
- **水下航行器**：增强机动性
- **海洋平台**：维护作业

## 技术挑战

### 1. 材料挑战
- **柔性材料**：高疲劳寿命
- **驱动器**：高功率密度
- **传感器**：水下可靠性

### 2. 控制挑战
- **非线性控制**：强耦合系统
- **实时性**：快速响应
- **鲁棒性**：环境适应性

### 3. 制造挑战
- **精密制造**：复杂形状
- **密封技术**：防水防腐
- **成本控制**：批量生产

## 未来展望

### 研究方向
1. **智能材料**：响应性材料应用
2. **机器学习**：数据驱动优化
3. **群体协同**：多鳍协调推进

### 技术趋势
1. **仿生深化**：更精细的生物模拟
2. **智能化**：自主决策能力
3. **集成化**：系统级优化

## 结论

仿生波动鳍推进技术为水下机器人提供了高效、低噪的推进解决方案。通过仿真研究，我们深入理解了其推进机理，优化了设计参数，并通过实验验证了仿真结果的准确性。未来，随着材料科学和控制技术的发展，这一技术将在海洋工程领域发挥更大作用。
`,
          author: '牟昭阳',
          date: '2024-10-20',
          category: '学术研究',
          tags: ['水下机器人', '仿生推进', '波动鳍', '数值仿真', '流体力学'],
          readingTime: 15,
          views: 1580,
          likes: 56,
          isPublished: true,
          isFeatured: false,
          coverImage: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=underwater%20robot%20bionic%20undulating%20fin%20propulsion%20simulation%20fluid%20dynamics%20marine%20engineering&image_size=landscape_16_9',
          metadata: {
            seoTitle: '水下机器人仿生波动鳍推进仿真研究 - 牟昭阳的学术博客',
            seoDescription: '分享水下机器人仿生波动鳍推进的仿真研究成果，包括建模方法、仿真结果和实验验证。',
            keywords: ['水下机器人', '仿生推进', '波动鳍', '数值仿真', 'CFD']
          }
        }
      ];

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize blog service:', error);
      throw error;
    }
  }

  // 获取博客文章列表
  async getPosts(options: BlogSearchOptions = {}): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    let filteredPosts = this.posts;

    // 筛选已发布的文章
    if (!options.includeUnpublished) {
      filteredPosts = filteredPosts.filter(post => post.isPublished);
    }

    // 按分类筛选
    if (options.category) {
      filteredPosts = filteredPosts.filter(post => post.category === options.category);
    }

    // 按标签筛选
    if (options.tag) {
      filteredPosts = filteredPosts.filter(post => post.tags.includes(options.tag));
    }

    // 按搜索词筛选
    if (options.search) {
      const searchLower = options.search.toLowerCase();
      filteredPosts = filteredPosts.filter(post => 
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // 排序
    const sortBy = options.sortBy || 'date';
    const sortOrder = options.sortOrder || 'desc';

    filteredPosts.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
          break;
        case 'views':
          aValue = a.views;
          bValue = b.views;
          break;
        case 'likes':
          aValue = a.likes;
          bValue = b.likes;
          break;
        case 'title':
          aValue = a.title;
          bValue = b.title;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // 分页
    const limit = options.limit || 10;
    const offset = options.offset || 0;
    
    return filteredPosts.slice(offset, offset + limit);
  }

  // 获取单篇文章
  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find(post => post.slug === slug && post.isPublished);
    
    if (post) {
      // 增加浏览量
      post.views += 1;
    }
    
    return post || null;
  }

  // 获取分类列表
  async getCategories(): Promise<BlogCategory[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.categories;
  }

  // 获取标签列表
  async getTags(): Promise<BlogTag[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.tags;
  }

  // 获取特色文章
  async getFeaturedPosts(limit: number = 3): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.posts
      .filter(post => post.isPublished && post.isFeatured)
      .slice(0, limit);
  }

  // 获取相关文章
  async getRelatedPosts(postId: string, limit: number = 3): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const currentPost = this.posts.find(post => post.id === postId);
    if (!currentPost) return [];

    const relatedPosts = this.posts
      .filter(post => 
        post.id !== postId && 
        post.isPublished &&
        (post.category === currentPost.category ||
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);

    return relatedPosts;
  }

  // 点赞文章
  async likePost(postId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const post = this.posts.find(post => post.id === postId);
    if (post) {
      post.likes += 1;
      return true;
    }
    
    return false;
  }

  // 添加评论
  async addComment(comment: Omit<BlogComment, 'id' | 'date' | 'isApproved'>): Promise<BlogComment | null> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const newComment: BlogComment = {
      ...comment,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isApproved: false // 默认需要审核
    };

    this.comments.push(newComment);
    return newComment;
  }

  // 获取文章评论
  async getPostComments(postId: string): Promise<BlogComment[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.comments
      .filter(comment => comment.postId === postId && comment.isApproved)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // 按归档日期获取文章
  async getPostsByArchive(year: number, month?: number): Promise<BlogPost[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.posts.filter(post => {
      const postDate = new Date(post.date);
      const postYear = postDate.getFullYear();
      const postMonth = postDate.getMonth() + 1;
      
      if (month) {
        return postYear === year && postMonth === month && post.isPublished;
      } else {
        return postYear === year && post.isPublished;
      }
    });
  }

  // 获取归档信息
  async getArchives(): Promise<{ year: number; month: number; count: number }[]> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const archiveMap = new Map<string, number>();
    
    this.posts
      .filter(post => post.isPublished)
      .forEach(post => {
        const date = new Date(post.date);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        archiveMap.set(key, (archiveMap.get(key) || 0) + 1);
      });

    return Array.from(archiveMap.entries())
      .map(([key, count]) => {
        const [yearStr, monthStr] = key.split('-');
        return {
          year: parseInt(yearStr),
          month: parseInt(monthStr),
          count
        };
      })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }
}

export const blogService = new BlogService();