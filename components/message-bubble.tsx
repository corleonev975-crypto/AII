type MessageBubbleProps = {
  role: "user" | "assistant";
  content: string;
};

function formatContent(text: string) {
  return text.replace(/\n/g, "<br/>");
}

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[88%] items-start gap-3 md:max-w-[78%] ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <img
          src="/avatar.gif"
          alt={isUser ? "User" : "AI"}
          className="mt-1 h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/10"
        />

        <div
          className={
            isUser
              ? "rounded-3xl rounded-tr-md bg-[#7c3aed] px-4 py-3 text-sm leading-7 text-white shadow-[0_0_25px_rgba(124,58,237,0.20)]"
              : "rounded-3xl rounded-tl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm leading-7 text-white/95"
          }
          dangerouslySetInnerHTML={{ __html: formatContent(content) }}
        />
      </div>
    </div>
  );
}
