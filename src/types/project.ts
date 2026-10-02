export interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  technologies: string[];
  image: string;
  status: 'completed' | 'ongoing' | 'planned';
  year: string;
  highlights: string[];
  githubUrl?: string;
  demoUrl?: string;
}

export const CATEGORY_CODES = {
  SCIENTIFIC_COMPUTING: 'scientificComputing',
  ROBOTICS_TECHNOLOGY: 'roboticsTechnology',
  SIMULATION_ANALYSIS: 'simulationAnalysis',
  EXPERIMENTAL_PLATFORM: 'experimentalPlatform',
  HIGH_PERFORMANCE_COMPUTING: 'highPerformanceComputing',
} as const;

export type ProjectCategoryCode = typeof CATEGORY_CODES[keyof typeof CATEGORY_CODES];
