import type { BlogCategory, BlogPost, BlogTag } from './blogService';

export type BlogLanguage = 'zh' | 'en';

const categoryTranslations: Record<string, { name: string; description: string }> = {
  'academic-research': {
    name: 'Academic Research',
    description: 'Research notes on artificial intelligence, machine learning, and scientific computing.'
  },
  'project-development': {
    name: 'Project Development',
    description: 'Engineering practice, implementation experience, and code-oriented project reviews.'
  },
  'technical-thinking': {
    name: 'Technical Perspectives',
    description: 'Personal perspectives on technology trends and their practical implications.'
  },
  'learning-notes': {
    name: 'Learning Notes',
    description: 'Summaries, reflections, and reusable notes from ongoing study.'
  }
};

const tagTranslations: Record<string, string> = {
  人工智能: 'Artificial Intelligence',
  机器学习: 'Machine Learning',
  深度学习: 'Deep Learning',
  科学计算: 'Scientific Computing',
  水下机器人: 'Underwater Robotics',
  数值仿真: 'Numerical Simulation',
  稀疏重建: 'Sparse Reconstruction',
  环境感知: 'Environmental Perception',
  仿生推进: 'Bio-inspired Propulsion',
  波动鳍: 'Undulating Fin',
  流体力学: 'Fluid Mechanics'
};

const englishPosts: Record<string, Partial<BlogPost>> = {
  'transformer-cfd-spatiotemporal-modeling': {
    title: 'Applying Transformers to Spatiotemporal CFD Field Modeling',
    excerpt:
      'A practical review of Transformer architectures for computational fluid dynamics, including their advantages, current limitations, and lessons from dam-break flow prediction.',
    content: `
# Applying Transformers to Spatiotemporal CFD Field Modeling

## Introduction

Computational fluid dynamics (CFD) is a fundamental tool in modern engineering and scientific research. Accurately modeling its spatiotemporal fields remains difficult because fluid systems combine nonlinear dynamics, long-range interactions, and complex boundary conditions. Recent progress in deep learning has made Transformer architectures a promising option for data-driven scientific computing.

## Why Transformers are useful

### 1. Long-range dependency modeling

Self-attention can connect distant regions of a flow field directly. This is valuable for phenomena in which local changes propagate across a large spatial domain.

### 2. Parallel computation

Unlike recurrent neural networks, Transformers process temporal states in parallel. This can substantially improve training efficiency on modern accelerators.

### 3. Interpretability

Attention maps offer a way to inspect which spatial regions and time steps influence a prediction. They do not provide a complete physical explanation, but they can support model diagnosis.

## Dam-break flow case study

In our work, a Transformer-based model was applied to dam-break flow prediction. The experiments indicated:

- a 15–20% improvement in prediction accuracy;
- an approximately 30% reduction in computation time;
- useful generalization across previously unseen geometries.

The best-performing configurations generally used 8–16 attention heads, 6–8 layers, and embedding dimensions between 256 and 512. These ranges provided a practical balance between accuracy and computational cost.

## Current challenges

### Data requirements

High-quality CFD datasets are expensive to generate. Training data must cover enough geometries, boundary conditions, and transient states to prevent brittle predictions.

### Computational cost

Attention can be expensive for high-resolution fields. Efficient attention, patch-based representations, and multi-scale encoders are important for production use.

### Physical consistency

A low numerical error does not guarantee conservation of mass, momentum, or energy. Physical constraints should be introduced through the architecture, the loss function, or hybrid numerical coupling.

## Future directions

1. Combine attention models with physics-informed losses and governing equations.
2. Develop multi-scale representations for both global structures and local vortices.
3. Improve inference speed for real-time monitoring and control.
4. Evaluate models across geometries instead of relying only on random train-test splits.

## Conclusion

Transformers have considerable potential for CFD spatiotemporal modeling, especially when global dependencies and cross-geometry generalization matter. The most promising direction is not to replace numerical solvers blindly, but to combine data-driven models with physical knowledge and reliable validation.

## References

1. Vaswani, A., et al. (2017). Attention Is All You Need.
2. Li, Z., et al. (2020). Neural Operator: Graph Kernel Network for Partial Differential Equations.
3. Lu, L., et al. (2021). Learning nonlinear operators via DeepONet.
`,
    author: 'Zhaoyang Mu',
    category: 'Academic Research',
    tags: ['Artificial Intelligence', 'Machine Learning', 'CFD', 'Transformer', 'Scientific Computing'],
    metadata: {
      seoTitle: 'Transformers for Spatiotemporal CFD Modeling | Zhaoyang Mu',
      seoDescription:
        'A practical review of Transformer architectures for CFD field prediction, physical consistency, and cross-geometry generalization.',
      keywords: ['Transformer', 'CFD', 'Deep Learning', 'Scientific Computing', 'Spatiotemporal Modeling']
    }
  },
  'sparse-to-dense-field-reconstruction': {
    title: 'Sparse-to-Dense Field Reconstruction: From Theory to Practice',
    excerpt:
      'An introduction to reconstructing dense physical fields from sparse measurements, covering classical interpolation, learning-based methods, uncertainty, and real-world deployment.',
    content: `
# Sparse-to-Dense Field Reconstruction: From Theory to Practice

## Background

Scientific and engineering systems often provide only a small number of observations, while downstream analysis requires a complete dense field. This problem appears in weather forecasting, ocean monitoring, environmental sensing, and robotic perception.

## Problem formulation

Given sparse observation locations and their measured values, the objective is to estimate a complete field over the target domain. A common formulation combines data fidelity with a regularization term:

$$E(f) = \\sum_{i=1}^N (f(x_i, y_i, z_i) - v_i)^2 + \\lambda R(f)$$

The regularizer encodes assumptions such as smoothness, sparsity, or physical consistency.

## Reconstruction methods

### Classical interpolation

- Radial basis functions work well for smooth fields.
- Kriging incorporates spatial correlation and can estimate uncertainty.
- Inverse-distance weighting is simple and computationally efficient.

### Learning-based approaches

- Neural networks model complex nonlinear relationships.
- Gaussian processes provide probabilistic estimates.
- Graph neural networks naturally represent irregular sensor layouts.
- Neural operators learn mappings between function spaces and can transfer across discretizations.

### Hybrid methods

Hybrid systems combine numerical priors or interpolation with learned corrections. They often require less training data and produce more stable results than a purely data-driven pipeline.

## Environmental flow reconstruction

In one monitoring experiment, eight sensors were used to reconstruct a complete regional flow field:

- sensor coverage was approximately 5% of the domain;
- reconstruction error remained below 0.1 m/s RMSE;
- a single reconstruction required less than 100 ms.

For underwater robotics, sparse sonar measurements were also used to reconstruct seabed geometry and support navigation in turbid environments.

## Engineering challenges

### Data quality

Measurements contain noise, outliers, missing values, and calibration drift. Robust preprocessing and sensor-health monitoring are essential.

### Computational efficiency

High-resolution fields can exceed the memory and latency budgets of edge devices. Multi-resolution inference and model compression help meet real-time requirements.

### Uncertainty

A reconstruction system should communicate confidence, particularly outside the observed region. Uncertainty estimates are as important as the mean prediction in safety-critical applications.

## Practical improvements

Adaptive regularization can change its strength according to local field characteristics. Multi-scale reconstruction can first estimate the global structure and then progressively refine local details. For time-varying systems, online learning can update model parameters as new measurements arrive.

## Results and lessons

Across synthetic and real monitoring data, hybrid reconstruction improved accuracy by roughly 40% over basic interpolation while remaining robust to missing observations. The largest gains came from combining physical priors, data-driven feature extraction, and sensor layouts designed for information coverage.

## Future work

1. Integrate conservation laws and physical constraints.
2. Fuse visual, acoustic, and conventional sensor measurements.
3. Optimize inference for embedded and mobile hardware.
4. Couple sensor placement with reconstruction-model training.

## Conclusion

Sparse-to-dense reconstruction is both theoretically important and immediately useful. Reliable systems require more than a strong neural network: they need careful sensing, uncertainty quantification, physical constraints, and deployment-aware optimization.
`,
    author: 'Zhaoyang Mu',
    category: 'Project Development',
    tags: [
      'Sparse Reconstruction',
      'Machine Learning',
      'Scientific Computing',
      'Environmental Perception',
      'Underwater Robotics'
    ],
    metadata: {
      seoTitle: 'Sparse-to-Dense Field Reconstruction | Zhaoyang Mu',
      seoDescription:
        'Methods and engineering lessons for reconstructing dense physical fields from sparse sensor observations.',
      keywords: [
        'Sparse Reconstruction',
        'Machine Learning',
        'Scientific Computing',
        'Environmental Perception',
        'Numerical Simulation'
      ]
    }
  },
  'bionic-undulating-fin-propulsion-simulation': {
    title: 'Simulation of Bio-inspired Undulating-Fin Propulsion for Underwater Robots',
    excerpt:
      'A study of undulating-fin propulsion for underwater robots, including kinematic modeling, CFD simulation, optimization, and experimental validation.',
    content: `
# Simulation of Bio-inspired Undulating-Fin Propulsion for Underwater Robots

## Research background

Underwater robots are used for ocean exploration, environmental monitoring, and subsea operations. Conventional propellers can be noisy, inefficient at low speed, and disruptive to marine life. Bio-inspired undulating fins offer an alternative with high maneuverability, low acoustic disturbance, and potentially better efficiency.

## Biological inspiration

The design draws ideas from the motion of eels, rays, sea turtles, and octopuses. Rather than generating thrust with a rotating propeller, the fin creates a traveling wave that forms pressure differences and organized vortical structures.

## Kinematic model

A parameterized fin motion can be written as:

$$y(x,t) = A(x) \\cdot \\sin(kx - \\omega t)$$

where the amplitude distribution, wave number, and angular frequency determine the shape and speed of the traveling wave. Flexible deformation is represented with a multi-link model so that phase differences can be controlled along the fin.

## Simulation setup

- Software: ANSYS Fluent with MATLAB/Simulink.
- Mesh: an unstructured grid of approximately 500,000 cells.
- Solver: pressure-based SIMPLE algorithm.
- Turbulence model: k-omega SST.
- Boundary conditions: velocity inlet, pressure outlet, no-slip walls, and a dynamic mesh driven by a user-defined function.

## Propulsion performance

The simulations produced average thrust values between 0.5 and 3.2 N as frequency increased. Peak efficiency was between 65% and 78%, with power consumption between 2 and 8 W.

The wake contained a clear reverse Kármán vortex street and a jet-like velocity distribution. Frequency and amplitude increased thrust, while wavelength and angle of attack strongly affected the balance between efficiency and stability.

## Multi-objective optimization

NSGA-II was used to maximize thrust and efficiency while minimizing power consumption. The design variables included frequency, amplitude distribution, phase difference, and angle of attack. A representative optimum used a frequency of 1.8 Hz and an amplitude of 0.25 fin lengths, reaching approximately 78% propulsion efficiency.

## Experimental validation

The experimental platform included a water tank, a six-axis force sensor, servo-driven motion control, and high-speed data acquisition. Across test cases from 1 to 3 Hz, simulated thrust differed from measurements by approximately 5.6–5.9%.

Particle image velocimetry showed that the simulated and measured vortex structures followed the same overall pattern, supporting the validity of the numerical model.

## Key innovations

### Multi-modal wave control

Superimposing multiple traveling waves makes it possible to adjust thrust and maneuverability more independently.

### Adaptive shape optimization

Pressure feedback can be used to adjust the amplitude distribution in real time and respond to changing flow conditions.

### Smart materials

Shape-memory alloys and other responsive materials may enable lighter and more integrated fin structures, although fatigue life and actuation efficiency remain challenges.

## Remaining challenges

1. Flexible materials must survive repeated underwater loading.
2. Nonlinear coupled dynamics require robust real-time control.
3. Sealing, corrosion resistance, and manufacturing precision affect reliability.
4. Full-system efficiency must include actuators and electronics, not only hydrodynamics.

## Conclusion

Undulating-fin propulsion offers a quiet and maneuverable solution for underwater robots. Combining CFD, optimization, and controlled experiments makes it possible to understand the propulsion mechanism and develop designs that are both efficient and practical.
`,
    author: 'Zhaoyang Mu',
    category: 'Academic Research',
    tags: ['Underwater Robotics', 'Bio-inspired Propulsion', 'Undulating Fin', 'Numerical Simulation', 'Fluid Mechanics'],
    metadata: {
      seoTitle: 'Bio-inspired Undulating-Fin Propulsion Simulation | Zhaoyang Mu',
      seoDescription:
        'CFD simulation, optimization, and experimental validation of undulating-fin propulsion for underwater robots.',
      keywords: ['Underwater Robotics', 'Bio-inspired Propulsion', 'Undulating Fin', 'Numerical Simulation', 'CFD']
    }
  }
};

export function localizeBlogPost(post: BlogPost, language: BlogLanguage): BlogPost {
  if (language === 'zh') return { ...post, tags: [...post.tags], metadata: post.metadata && { ...post.metadata } };

  const translation = englishPosts[post.slug] || {};
  return {
    ...post,
    ...translation,
    tags: translation.tags ? [...translation.tags] : post.tags.map((tag) => tagTranslations[tag] || tag),
    metadata: translation.metadata ? { ...translation.metadata } : post.metadata && { ...post.metadata }
  };
}

export function localizeBlogCategory(category: BlogCategory, language: BlogLanguage): BlogCategory {
  if (language === 'zh') return { ...category };
  const translation = categoryTranslations[category.slug];
  return translation ? { ...category, ...translation } : { ...category };
}

export function localizeBlogTag(tag: BlogTag, language: BlogLanguage): BlogTag {
  if (language === 'zh') return { ...tag };
  return { ...tag, name: tagTranslations[tag.name] || tag.name };
}
