export interface TimelineItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'education' | 'research' | 'publication' | 'patent' | 'award' | 'project' | 'skill';
  location?: string;
  organization?: string;
  tags?: string[];
  metadata?: {
    doi?: string;
    patentNumber?: string;
    certificateNumber?: string;
    impact?: number;
    citations?: number;
    url?: string;
    gpa?: number;
    level?: string;
  };
  isHighlighted?: boolean;
}

export type TimelineSortBy = 'date' | 'type' | 'title';
export type TimelineSortOrder = 'asc' | 'desc';

export interface TimelineProps {
  items?: TimelineItem[];
  maxItems?: number;
  showFilters?: boolean;
  className?: string;
}
