const MessageLoadingSkeleton = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className={`chat ${i % 2 === 0 ? "chat-start" : "chat-end"} animate-pulse`}
        >
          <div className={`chat-bubble bg-slate-800 text-white w-32`}></div>
        </div>
      ))}
    </div>
  );
};
export default MessageLoadingSkeleton;
