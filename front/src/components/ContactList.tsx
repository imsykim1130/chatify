import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ContactList = () => {
  const { getContacts, isContactsLoading, contacts, setSelectedUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getContacts();
  }, [getContacts]);

  if (isContactsLoading) return <div>Loading...</div>;
  if (contacts.length === 0) return <div>연락처가 없습니다</div>;

  return (
    <ul>
      {contacts.map((contact) => (
        <li
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelectedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(contact._id) ? "avatar-online" : "avatar-offline"}`}
            >
              <div className="size-12 rounded-full overflow-hidden">
                <img
                  src={
                    contact.profilePic !== ""
                      ? contact.profilePic
                      : "/avatar.png"
                  }
                  alt="profile image"
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
          </div>
        </li>
      ))}
    </ul>
  );
};
export default ContactList;
