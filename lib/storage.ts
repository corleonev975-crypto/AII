import { Message } from '@/lib/types';
import { clampText, uid } from '@/lib/utils';

export type Conversation = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
};

const STORAGE_KEY = 'xinn_ai_conversations_v1';

export function createConversation(): Conversation {
  const now = Date.now();
  return {
    id: uid('chat'),
    title: 'New chat',
    createdAt: now,
    updatedAt: now,
    messages: []
  };
}

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Conversation[];
    return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
  } catch {
    return [];
  }
}

export function saveConversations(conversations: Conversation[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function upsertConversation(conversation: Conversation) {
  const conversations = getConversations();
  const next = [...conversations.filter((item) => item.id !== conversation.id), decorateConversation(conversation)];
  saveConversations(next);
  return next.sort((a, b) => b.updatedAt - a.updatedAt);
}

export function deleteConversation(id: string) {
  const next = getConversations().filter((item) => item.id !== id);
  saveConversations(next);
  return next;
}

export function decorateConversation(conversation: Conversation): Conversation {
  const firstUser = conversation.messages.find((message) => message.role === 'user');
  const title = firstUser?.content ? clampText(firstUser.content, 34) : conversation.title || 'New chat';
  return {
    ...conversation,
    title,
    updatedAt: conversation.messages.at(-1)?.createdAt ?? conversation.updatedAt ?? Date.now()
  };
}
