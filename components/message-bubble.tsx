type Props = {
  content: string;
  isUser?: boolean;
};

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n- (.*?)(?=\n|$)/g, "<li>$1</li>")
    .replace(/(<li>[\s\S]*<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n> (.*?)(?=\n|$)/g, "<blockquote>$1</blockquote>")
    .replace(/\n/g, "<br/>");
}

export default function MessageBubble({ content, isUser }: Props) {
  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={
          isUser
            ? "max-w-[85%] rounded-3xl rounded-br-md bg-purple-600 px-4 py-3 text-white"
            : "max-w-[85%] rounded-3xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-white"
        }
        dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
      />
    </div>
  );
}
