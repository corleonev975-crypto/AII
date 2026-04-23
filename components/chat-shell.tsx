'use client';

import { ChatInput } from '@/components/chat-input';
import { MessageBubble } from '@/components/message-bubble';
import { Sidebar } from '@/components/sidebar';
import { Topbar } from '@/components/topbar';
import { WelcomeScreen } from '@/components/welcome-screen';
import { Conversation, createConversation, deleteConversation, getConversations, upsertConversation } from '@/lib/storage';
import { Attachment, Message } from '@/lib/types';
import { uid } from '@/lib/utils';
import { useEffect, useMemo, useRef, useState } from 'react';

export function ChatShell() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = getConversations();
    if (saved.length > 0) {
      setConversations(saved);
      setActiveId(saved[0].id);
    } else {
      const first = createConversation();
      const next = upsertConversation(first);
      setConversations(next);
      setActiveId(first.id);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeId, conversations, loading]);

  const activeConversation = useMemo(() => {
    return conversations.find((item) => item.id === activeId) ?? null;
  }, [conversations, activeId]);

  function persistConversation(conversation: Conversation) {
    const next = upsertConversation(conversation);
    setConversations(next);
    setActiveId(conversation.id);
  }

  function handleNewChat() {
    const created = createConversation();
    const next = upsertConversation(created);
    setConversations(next);
    setActiveId(created.id);
    setSidebarOpen(false);
  }

  function handleDeleteConversation(id: string) {
    const next = deleteConversation(id);
    setConversations(next);
    if (activeId === id) {
      if (next.length > 0) {
        setActiveId(next[0].id);
      } else {
        const created = createConversation();
        const filled = upsertConversation(created);
        setConversations(filled);
        setActiveId(created.id);
      }
    }
  }

  async function handleSubmit({ text, attachments }: { text: string; attachments: Attachment[] }) {
    const conversation = activeConversation ?? createConversation();
    const userMessage: Message = {
      id: uid('msg'),
      role: 'user',
      content: text.trim(),
      createdAt: Date.now(),
      attachments
    };

    const nextConversation: Conversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage],
      updatedAt: Date.now()
    };

    persistConversation(nextConversation);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: nextConversation.messages })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Gagal memproses chat.');

      const assistantMessage: Message = {
        id: uid('msg'),
        role: 'assistant',
        content: data.text || 'Maaf, tidak ada jawaban.',
        createdAt: Date.now()
      };

      persistConversation({
        ...nextConversation,
        messages: [...nextConversation.messages, assistantMessage],
        updatedAt: Date.now()
      });
    } catch (error) {
      const assistantMessage: Message = {
        id: uid('msg'),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Terjadi error yang tidak diketahui.',
        createdAt: Date.now()
      };

      persistConversation({
        ...nextConversation,
        messages: [...nextConversation.messages, assistantMessage],
        updatedAt: Date.now()
      });
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text).catch(() => undefined);
  }

  function handleSpeak(text: string) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'id-ID';
    window.speechSynthesis.speak(utterance);
  }

  return (
    <main className="app-shell">
      <Sidebar
        open={sidebarOpen}
        conversations={conversations}
        activeId={activeId}
        onClose={() => setSidebarOpen(false)}
        onNewChat={handleNewChat}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onDelete={handleDeleteConversation}
      />

      <div className="main-panel">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <section className="chat-scroll">
          {activeConversation?.messages.length ? (
            <div className="message-list">
              {activeConversation.messages.map((message) => (
                <MessageBubble key={message.id} message={message} onCopy={handleCopy} onSpeak={handleSpeak} />
              ))}
              {loading ? <div className="thinking">Xinn AI sedang mengetik...</div> : null}
              <div ref={bottomRef} />
            </div>
          ) : (
            <WelcomeScreen onSuggestionClick={(value) => setInput(value)} />
          )}
        </section>

        <ChatInput value={input} onChange={setInput} onSubmit={handleSubmit} loading={loading} />
      </div>
    </main>
  );
}
