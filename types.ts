
export enum ViewMode {
  BROWSER = 'BROWSER',
  STUDIO = 'STUDIO',
  AUTOMATION = 'AUTOMATION',
  MARKETPLACE = 'MARKETPLACE',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS',
  CRAWLER = 'CRAWLER',
  APPS = 'APPS',
  VECTOR = 'VECTOR'
}

export enum SafetyMode {
  NORMAL = 'NORMAL',
  UNRESTRICTED = 'UNRESTRICTED'
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  isAd?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  type?: 'text' | 'image' | 'video' | 'analysis';
}

export interface AutomationNode {
  id: string;
  type: 'trigger' | 'action' | 'ai';
  label: string;
  position: { x: number; y: number };
}

export interface MarketplaceApp {
  id: string;
  name: string;
  description: string;
  author: string;
  type: 'api' | 'extension' | 'tool' | 'mini-app';
  price: number;
}
