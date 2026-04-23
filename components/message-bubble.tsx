type Props = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export default function MessageBubble({ role, content, image }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-3xl px-4 py-3 text-[15px] leading-7 ${
          isUser
            ? "rounded-tr-md bg-[#6d28d9] text-white shadow-[0_0_20px_rgba(109,40,217,0.18)]"
            : "rounded-tl-md border border-white/10 bg-white/[0.04] text-white/95"
        }`}
      >
        {image && (
          <img
            src={image}
            alt="upload"
            className="mb-3 max-h-72 rounded-2xl object-cover"
          />
        )}
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}
