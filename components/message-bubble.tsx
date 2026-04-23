type Props = {
  content: string;
  isUser?: boolean;
};

function formatMessage(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br/>");
}

export default function MessageBubble({ content, isUser = false }: Props) {
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[92%] items-start gap-3 md:max-w-[80%] ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="mt-1 h-9 w-9 shrink-0 overflow-hidden rounded-full border border-white/10">
          <img
            src={isUser ? "/avatar.gif" : "/avatar.gif"}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        </div>

        <div
          className={
            isUser
              ? "rounded-3xl rounded-tr-md bg-[#7c3aed] px-4 py-3 text-sm leading-7 text-white shadow-[0_0_25px_rgba(124,58,237,0.25)]"
              : "rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white/95"
          }
          dangerouslySetInnerHTML={{ __html: formatMessage(content) }}
        />
      </div>
    </div>
  );
}
