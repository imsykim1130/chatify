import ChatHeader from "./ChatHeader.tsx";
import { useChatStore } from "../store/useChatStore.ts";
import { useAuthStore } from "../store/useAuthStore.ts";
import { useEffect, useRef } from "react";
import MessageLoadingSkeleton from "./MessageLoadingSkeleton.tsx";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder.tsx";
import MessageInput from "./MessageInput.tsx";

const ChatContainer = () => {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef<HTMLDivElement>(null);

  // 선택한 유저의 메세지를 받을 수 있는 소켓 연결
  useEffect(() => {
    if (!selectedUser) return;
    // 선택된 유저와 나눈 메세지 가져오기
    getMessagesByUserId(selectedUser._id);
    // 선택된 유저가 메세지를 보낼 때 메세지를 바로 받기 위한 subscribe
    subscribeToMessages();

    // cleanup
    return () => {
      unsubscribeFromMessages();
    };
  }, [
    selectedUser,
    getMessagesByUserId,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  // 메세지 추가될 때 마다 스크롤 가장 아래로 이동
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`chat ${msg.senderId === authUser?._id ? "chat-end" : "chat-start"}`}
              >
                <div
                  className={`chat-bubble relative ${msg.senderId === authUser?._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"}`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="shared"
                      className="rounded-lg h-48 object-cover"
                    />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div>
          </div>
        ) : isMessagesLoading ? (
          <MessageLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder />
        )}
      </div>

      <MessageInput />
    </>
  );
};
export default ChatContainer;
