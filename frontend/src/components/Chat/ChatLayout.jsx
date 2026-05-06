import { useEffect } from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

import { useChat } from "../../context/ChatContext";

const ChatLayout = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const {
    contacts,
    selectedChat,
    setSelectedChat,
  } = useChat();

  // ===============================
  // 🔥 AUTO SELECT CHAT
  // ===============================
  useEffect(() => {

    if (
      !id ||
      contacts.length === 0
    ) {
      return;
    }

    const foundChat =
      contacts.find(
        (chat) =>
          String(chat.id) ===
          String(id)
      );

    if (foundChat) {

      setSelectedChat(foundChat);
    }

  }, [
    id,
    contacts,
    setSelectedChat,
  ]);

  return (
    <div className="w-full h-screen text-[var(--text)]">

      {/* 🔥 SIDEBAR */}
      <div
        className={`${
          selectedChat
            ? "hidden md:block"
            : "block"
        }
        fixed top-16 left-0
        w-full md:w-[30%] lg:w-[25%]
        h-[calc(100vh-64px)]
        md:border-r md:border-[var(--border)]`}
      >

        <Sidebar
          onSelectChat={
            setSelectedChat
          }
        />
      </div>

      {/* 🔥 CHAT WINDOW */}
      <div
        className={`${
          selectedChat
            ? "flex"
            : "hidden md:flex"
        }
        fixed
        top-0 md:top-16
        left-0 md:left-[30%] lg:left-[25%]
        w-full md:w-[70%] lg:w-[75%]
        h-screen md:h-[calc(100vh-64px)]
        flex flex-col`}
      >

        {selectedChat && (

          <ChatWindow
            chat={selectedChat}
            onBack={() => {

              setSelectedChat(null);

              navigate("/");
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;