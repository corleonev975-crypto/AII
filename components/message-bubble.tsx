type Props = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export default function MessageBubble({ role, content, image }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-3xl px-4 py-3 text-[16px] leading-8 ${
          isUser
            ? "bg-[#6d28d9] text-white"
            : "border border-white/10 bg-white/[0.04] text-white"
        }`}
      >
        {image && (
          <img
            src={image}
            alt="upload"
            className="mb-3 max-h-72 rounded-2xl object-cover"
          />
        )}
        <p>{content}</p>
      </div>
    </div>
  );
}
