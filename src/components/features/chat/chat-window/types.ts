export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

export interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (message: string) => Promise<{
    reply: string;
    relatedLinks?: Array<{ title: string; url: string }>;
  }>;
}
