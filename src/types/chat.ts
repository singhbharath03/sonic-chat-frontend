export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  content: string;
  role: MessageRole;
} 