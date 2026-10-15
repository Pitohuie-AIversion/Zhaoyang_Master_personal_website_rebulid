import React from 'react';

export interface ShowcaseSkill {
  name: string;
  level: number;
  category: string;
  description: string;
  projects?: string[];
  icon?: React.ReactNode;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  skills: ShowcaseSkill[];
}

export interface RadarData {
  subject: string;
  A: number;
  fullMark: 100;
}
