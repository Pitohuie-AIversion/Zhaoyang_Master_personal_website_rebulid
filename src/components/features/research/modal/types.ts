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

export type ResearchItem = Publication | Patent | Award;

export interface ResearchDetailModalProps {
  item: ResearchItem | null;
  type: 'publication' | 'patent' | 'award';
  isOpen: boolean;
  onClose: () => void;
}
