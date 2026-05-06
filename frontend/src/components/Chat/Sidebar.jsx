import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useChat } from "../../context/ChatContext";

const Sidebar = ({ onSelectChat }) => {

  const navigate = useNavigate();

  const location = useLocation();

  const {
    contacts,
    fetchContacts,
    openConversation,
    sidebarLoading,
  } = useChat();

  const [search, setSearch] =
    useState("");

  // ===============================
  // 🔥 FETCH CONTACTS
  // ===============================
  useEffect(() => {

    fetchContacts();

  }, []);

  // ===============================
  // 🔥 FILTER CONTACTS
  // ===============================
  const filteredChats = useMemo(() => {

    if (!search.trim()) {

      return contacts;
    }

    return contacts.filter((chat) =>
      chat.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  }, [contacts, search]);

  // ===============================
  // 🔥 FORMAT TIME
  // ===============================
  const formatTime = (time) => {

    if (!time) return "";

    const date = new Date(time);

    const now = new Date();

    const diff =
      now.getTime() -
      date.getTime();

    const oneDay =
      24 * 60 * 60 * 1000;

    if (diff < oneDay) {

      return date.toLocaleTimeString(
        [],
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }

    return date.toLocaleDateString(
      [],
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  // ===============================
  // 🔥 OPEN CHAT
  // ===============================
  const handleClick = async (
    chat
  ) => {

    try {

      const conversation =
        await openConversation(
          chat
        );

      if (!conversation) return;

      const updatedChat = {

        ...chat,

        conversationId:
          conversation.id,
      };

      onSelectChat &&
        onSelectChat(
          updatedChat
        );

      navigate(
        `/chat/${chat.id}`
      );

    } catch (err) {

      console.log(err);
    }
  };

  return (
    <div className="w-full h-full bg-[var(--bg)]">

      {/* 🔥 SEARCH (ONLY DESKTOP/TABLET) */}
      <div className="hidden md:block px-3 pt-3 pb-2">

        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
            w-full
            px-4
            py-3
            rounded-2xl
            bg-[var(--card)]
            border
            border-[var(--border)]
            outline-none
            text-sm
          "
        />
      </div>

      {/* 🔥 SCROLL AREA */}
      <div className="h-full md:h-[calc(100%-80px)] overflow-y-auto px-2 pb-20 md:pb-2 hide-scrollbar">

        {/* 🔥 LOADING */}
        {sidebarLoading && (

          <div className="flex flex-col gap-2 mt-2">

            {[1, 2, 3, 4, 5].map(
              (i) => (

                <div
                  key={i}
                  className="
                    animate-pulse
                    flex
                    items-center
                    gap-3
                    px-3
                    py-3
                    rounded-xl
                  "
                >

                  <div className="w-12 h-12 rounded-full bg-[var(--card)]" />

                  <div className="flex-1">

                    <div className="h-3 w-32 rounded bg-[var(--card)] mb-2" />

                    <div className="h-2 w-20 rounded bg-[var(--card)]" />
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* 🔥 EMPTY */}
        {!sidebarLoading &&
          filteredChats.length === 0 && (

            <div className="h-full flex items-center justify-center opacity-60 text-sm">

              No chats found
            </div>
          )}

        {/* 🔥 CHAT LIST */}
        <div className="flex flex-col gap-1 pt-16 md:pt-0">

          {filteredChats.map(
            (chat) => {

              const isActive =
                location.pathname ===
                `/chat/${chat.id}`;

              return (

                <div
                  key={chat.id}
                  onClick={() =>
                    handleClick(chat)
                  }
                  className={`
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2
                    rounded-xl
                    cursor-pointer
                    transition

                    ${
                      isActive
                        ? "bg-[var(--card)]"
                        : "hover:bg-[var(--card)]/60"
                    }
                  `}
                >

                  {/* 🔥 AVATAR */}
                  <div className="relative shrink-0">

                    {chat.avatar ? (

                      <img
                        src={chat.avatar}
                        alt={chat.name}
                        className="
                          w-12
                          h-12
                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-12
                          h-12
                          rounded-full
                          bg-[var(--card)]
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-semibold
                          uppercase
                        "
                      >
                        {chat.name?.charAt(0)}
                      </div>
                    )}

                    {/* 🔥 ONLINE */}
                    {chat.online && (

                      <span
                        className="
                          absolute
                          bottom-0
                          right-0
                          w-3
                          h-3
                          bg-green-500
                          rounded-full
                          border-[2px]
                          border-[var(--bg)]
                        "
                      />
                    )}
                  </div>

                  {/* 🔥 INFO */}
                  <div className="flex-1 min-w-0">

                    <div className="flex justify-between items-center gap-2">

                      <h3 className="font-medium truncate">
                        {chat.name}
                      </h3>

                      <span className="text-xs opacity-60 whitespace-nowrap">

                        {formatTime(
                          chat.lastMessageTime
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-0.5 gap-2">

                      <p className="text-sm opacity-70 truncate">

                        {chat.lastMessage &&
                        chat.lastMessage.trim() !== ""
                          ? chat.lastMessage
                          : "Start conversation"}
                      </p>

                      {/* 🔥 UNREAD */}
                      {chat.unreadCount >
                        0 && (

                        <span
                          className="
                            min-w-[18px]
                            h-[18px]
                            px-1
                            rounded-full
                            bg-[var(--primary)]
                            text-white
                            text-[10px]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {chat.unreadCount}
                        </span>
                      )}

                      {/* 🔥 LAST SEEN */}
                      {!chat.online &&
                        chat.lastSeen &&
                        chat.unreadCount ===
                          0 && (

                          <span className="text-[10px] opacity-50 whitespace-nowrap">

                            last seen
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;