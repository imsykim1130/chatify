import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

const ContactList = () => {
  const { getContacts, isContactsLoading, contacts } = useChatStore();

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
          className="w-full flex items-center gap-4 py-4 border-b-[0.5px] border-slate-400/15 cursor-pointer"
        >
          <div className="size-12 rounded-full overflow-hidden">
            <img
              src={
                contact.profilePic !== "" ? contact.profilePic : "/avatar.png"
              }
              alt="profile image"
            />
          </div>
          <p className="text-slate-200">{contact.fullName}</p>
        </li>
      ))}
    </ul>
  );
};
export default ContactList;
