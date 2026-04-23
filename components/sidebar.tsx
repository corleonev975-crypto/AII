'use client';

import { Conversation } from '@/lib/storage';
import { cn } from '@/lib/utils';

type SidebarProps = {
  open: boolean;
  conversations: Conversation[];
  activeId: string | null;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
};

export function Sidebar({
  open,
  conversations,
  activeId,
  onClose,
  onNewChat,
  onSelect,
  onDelete
}: SidebarProps) {
  return (
    <>
      <div className={cn('sidebar-backdrop', open && 'show')} onClick={onClose} />
      <aside className={cn('sidebar', open && 'open')}>
        <div className="sidebar-header">
          <div>
            <div className="sidebar-brand">Xinn AI</div>
            <p className="sidebar-subtitle">Groq + voice + image</p>
          </div>
          <button className="ghost-button" onClick={onNewChat}>
            + New chat
          </button>
        </div>

        <div className="sidebar-list">
          {conversations.length === 0 ? (
            <div className="sidebar-empty">Belum ada riwayat chat.</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn('sidebar-item', activeId === conversation.id && 'active')}
              >
                <button className="sidebar-item-main" onClick={() => onSelect(conversation.id)}>
                  <span>{conversation.title}</span>
                </button>
                <button
                  className="sidebar-delete"
                  onClick={() => onDelete(conversation.id)}
                  aria-label="Hapus chat"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}
