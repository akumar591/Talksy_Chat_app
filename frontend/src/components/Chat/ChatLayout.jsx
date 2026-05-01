import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

const chats = [
  { id: 1, name: "Rahul", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 2, name: "Aman", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 3, name: "Sneha", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 4, name: "Karan", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 5, name: "Priya", avatar: "https://i.pravatar.cc/150?img=9" },
];

const ChatLayout = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    if (id) {
      const found = chats.find((c) => c.id === Number(id));
      if (found) setSelectedChat(found);
    }
  }, [id]);

  return (
    <div className="w-full h-screen text-[var(--text)]">

      {/* 🔥 SIDEBAR FIXED */}
      <div
        className={`${
          selectedChat ? "hidden md:block" : "block"
        }
        fixed top-16 left-0
        w-full md:w-[30%] lg:w-[25%]
        h-[calc(100vh-64px)]
        md:border-r md:border-[var(--border)]`}
      >
        <Sidebar onSelectChat={setSelectedChat} />
      </div>

      {/* 🔥 CHAT WINDOW FIXED */}
      <div
        className={`${
          selectedChat ? "flex" : "hidden md:flex"
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