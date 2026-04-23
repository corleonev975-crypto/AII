export function MessageBubble({ role, content }: any) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser
            ? "bg-purple-600 text-white"
            : "bg-white/[0.05] text-white/90 border border-white/10"
        }`}
      >
        {content}
      </div>
    </div>
  );
}
