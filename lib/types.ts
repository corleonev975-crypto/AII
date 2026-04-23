export type ChatRole = 'system' | 'user' | 'assistant';

export type Attachment = {
  type: 'image';
  mimeType: string;
  dataUrl: string;
  name?: string;
};

export type Message = {
  id: string;
  role: Exclude<ChatRole, 'system'>;
  content: string;
  createdAt: number;
  attachments?: Attachment[];
};
