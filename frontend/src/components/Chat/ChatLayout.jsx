import { useEffect } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

import { useChat } from "../../context/ChatContext";
import { useGroup } from "../../context/GroupContext";

const ChatLayout = ({ mobileSearch }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { groups, selectedGroup, setSelectedGroup } = useGroup();
  const { contacts, selectedChat, setSelectedChat, setConversation } =
    useChat();

  // ===============================
  // 🔥 ROUTE CHECK
  // ===============================
  const hasChatRoute = !!id;

  // ===============================
  // 🔥 AUTO SELECT CHAT
  // ===============================
  useEffect(() => {
    if (!id) {
      setSelectedChat(null);
      setSelectedGroup(null);

      return;
    }

    // 🔥 WAIT DATA
    if (contacts.length === 0 && groups.length === 0) {
      return;
    }

    // ===============================
    // 🔥 PRIVATE CHAT
    // ===============================
    let foundChat = contacts.find((chat) => String(chat.id) === String(id));

    // ===============================
    // 🔥 GROUP CHAT
    // ===============================
    if (!foundChat) {
      foundChat = groups.find((group) => String(group.id) === String(id));
    }

    // ===============================
    // 🔥 UPDATE SELECTED CHAT
    // ===============================
    if (foundChat) {
      // ==========================
      // GROUP
      // ==========================
      if (foundChat.isGroup) {
        setSelectedChat(null);

        setSelectedGroup(foundChat);

        setConversation({
          id: foundChat.conversationId,
          isGroup: true,
          groupId: foundChat.id,
        });
      }

      // ==========================
      // PRIVATE
      // ==========================
      else {
        setSelectedGroup(null);

        setSelectedChat(foundChat);

        setConversation({
          id: foundChat.conversationId,
          isGroup: false,
        });
      }
    }
  }, [
    id,
    contacts,
    groups,
    setSelectedChat,
    setSelectedGroup,
    setConversation,
  ]);

  return (
    <div className="w-full h-screen text-[var(--text)]">
      {/* 🔥 SIDEBAR */}
      <div
        className={`

          ${hasChatRoute ? "hidden md:block" : "block"}

          fixed
          top-16
          left-0

          w-full
          md:w-[30%]
          lg:w-[25%]

          h-[calc(100vh-64px)]

          md:border-r
          md:border-[var(--border)]
        `}
      >
        <Sidebar mobileSearch={mobileSearch} onSelectChat={setSelectedChat} />
      </div>

      {/* 🔥 CHAT WINDOW */}
      <div
        className={`

          ${hasChatRoute ? "flex" : "hidden md:flex"}

          fixed

          top-0
          md:top-16

          left-0
          md:left-[30%]
          lg:left-[25%]

          w-full
          md:w-[70%]
          lg:w-[75%]

          h-screen
          md:h-[calc(100vh-64px)]

          flex-col
        `}
      >
        {(selectedChat || selectedGroup) && (
          <ChatWindow
            chat={selectedChat || selectedGroup}
            onBack={() => {
              setSelectedChat(null);
              setSelectedGroup(null);
              setConversation(null);

              navigate("/");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
