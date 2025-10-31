import { MessageCircleIcon } from "lucide-react";

const NoChatHistoryPlaceholder = ({ name }: { name: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      {/* message icon */}
      <div className="size-16 bg-gradient-to-br from-cyan-500/20 to-cyan-400/10 rounded-full flex items-center justify-center mb-5">
        <MessageCircleIcon className="size-8 text-cyan-400" />
      </div>
      {/* desc */}
      <h3 className="text-lg font-medium text-slate-200 mb-3">{`${name} 와 대화를 시작해보세요`}</h3>

      <div className="flex flex-col space-y-3 max-w-md mb-5">
        <p className="text-slate-400 text-sm">
          메세지를 보내 채팅을 시작해보세요!
        </p>
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto" />
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <button className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          👋 안녕하세요
        </button>
        <button className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          🤝 반갑습니다
        </button>
        <button className="px-4 py-2 text-xs font-medium text-cyan-400 bg-cyan-500/10 rounded-full hover:bg-cyan-500/20 transition-colors">
          📅 언제 만날까요?
        </button>
      </div>
    </div>
  );
};
export default NoChatHistoryPlaceholder;
