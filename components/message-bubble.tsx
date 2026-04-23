'use client';

import { Message } from '@/lib/types';
import { formatTime } from '@/lib/utils';

function simpleMarkdown(text: string) {
  return text
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/^### (.*)$/gm, '<h3>$1</h3>')
    .replace(/^## (.*)$/gm, '<h2>$1</h2>')
    .replace(/^# (.*)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n- (.*?)(?=\n|$)/g, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>')
    .replace(/\n> (.*?)(?=\n|$)/g, '<blockquote>$1</blockquote>')
    .replace(/\n/g, '<br/>');
}

type MessageBubbleProps = {
  message: Message;
  onCopy: (text: string) => void;
  onSpeak: (text: string) => void;
};

export function MessageBubble({ message, onCopy, onSpeak }: MessageBubbleProps) {
  return (
    <article className={`message-row ${message.role}`}>
      <div className="message-avatar">{message.role === 'assistant' ? 'AI' : 'You'}</div>
      <div className="message-card">
        {message.attachments?.length ? (
          <div className="message-images">
            {message.attachments.map((attachment, index) => (
              <img key={`${attachment.dataUrl}-${index}`} src={attachment.dataUrl} alt={attachment.name || 'Upload'} />
            ))}
          </div>
        ) : null}

        <div
          className="message-content"
          dangerouslySetInnerHTML={{ __html: simpleMarkdown(message.content) }}
        />

        <div className="message-actions">
          <span>{formatTime(message.createdAt)}</span>
          <button onClick={() => onCopy(message.content)}>Copy</button>
          {message.role === 'assistant' ? <button onClick={() => onSpeak(message.content)}>Voice</button> : null}
        </div>
      </div>
    </article>
  );
}
