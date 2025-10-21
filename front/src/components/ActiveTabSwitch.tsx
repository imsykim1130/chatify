import clsx from "clsx";
import { useChatStore } from "../store/useChatStore";

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore();

  return (
    <div role="tablist" className="tabs tabs-boxed p-2 m-2">
      <button
        role="tab"
        onClick={() => setActiveTab("chats")}
        className={clsx("tab flex-1", { "tab-active": activeTab === "chats" })}
      >
        Chats
      </button>

      <button
        role="tab"
        onClick={() => setActiveTab("contacts")}
        className={clsx("tab flex-1", {
          "tab-active": activeTab === "contacts",
        })}
      >
        Contacts
      </button>
    </div>
  );
};
export default ActiveTabSwitch;
