type Props = {
  role: "user" | "assistant";
  content: string;
  image?: string;
};

export default function MessageBubble({ role, content, image }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[80%] rounded-xl bg-white/10 p-3">
        {image && (
          <img src={image} className="mb-2 max-h-60 rounded-lg" />
        )}
        <p>{content}</p>
      </div>
    </div>
  );
}
