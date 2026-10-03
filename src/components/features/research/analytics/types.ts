export interface Publication {
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

export interface Patent {
  id: string;
  title: string;
  number: string;
  applicant: string;
  publicDate: string;
  status: 'granted' | 'published' | 'pending';
  type: 'invention' | 'utility' | 'design';
  description: string;
}

export interface Award {
  id: string;
  title: string;
  organization: string;
  date: string;
  level: 'national' | 'provincial' | 'university';
  description: string;
  certificateNumber?: string;
}

export interface ResearchAnalyticsProps {
  publications: Publication[];
  patents: Patent[];
  awards: Award[];
}

export interface PieChartData {
  name: string;
  value: number;
  status?: string;
}

export interface BarChartData {
  name: string;
  value: number;
}
