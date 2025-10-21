import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";

function ChatsList() {
  const {
    getMyChatPartners,
    chatPartners,
    isChatPartnersLoading,
    setSelectedUser,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isChatPartnersLoading) return <UsersLoadingSkeleton />;
  if (chatPartners.length === 0) return <NoChatsFound />;

  return (
    <>
      {chatPartners.map((user) => (
        <div
          key={user._id}
          className="bg-cyan-500/10 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => {
            setSelectedUser(user);
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(user._id) ? "online" : "offline"}`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {user.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
