import {
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiUser,
  FiTrash2,
  FiImage,
  FiEdit3,
  FiGrid,
  FiBellOff,
  FiSlash,
  FiUnlock,
  FiUserX,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";

import { useRef } from "react";

const ChatHeader = ({
  chat,
  onBack,
  navigate,

  showMenu,
  setShowMenu,

  menuRef,

  isRecording,

  toggleBlockContact,
  deleteContact,

  leaveGroup,

  setShowAddMembersModal,

  handleClearChat,
}) => {

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-[var(--card)] border-b border-[var(--border)] backdrop-blur-xl sticky top-0 z-40">

      {/* 🔥 LEFT */}
      <div className="flex items-center gap-3 min-w-0">

        <button
          onClick={onBack}
          aria-label="Go back"
          className="md:hidden text-xl shrink-0"
        >
          ←
        </button>

        {/* 🔥 PROFILE */}
        <div
          onClick={() => {

            if (chat.isGroup) {

              navigate(`/group-info/${chat.id}`);

            } else {

              navigate(`/user/${chat.id}`);
            }
          }}
          className="flex items-center gap-3 cursor-pointer min-w-0"
        >

          <div className="relative shrink-0">

            <img
              src={chat.avatar || "/default-avatar.png"}
              alt={chat.name}
              className="w-11 h-11 rounded-full object-cover"
            />

            {!chat.isGroup && chat.online && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg)]" />
            )}

          </div>

          <div className="min-w-0">

            <h2 className="font-semibold truncate">
              {chat.name}
            </h2>

            <p className="text-xs opacity-60 truncate">

              {isRecording
                ? "Recording..."
                : chat.isGroup
                  ? `${chat.memberCount || chat.members?.length || 0} members`
                  : chat.online
                    ? "online"
                    : "last seen recently"}

            </p>
          </div>
        </div>
      </div>

      {/* 🔥 RIGHT */}
      <div className="flex items-center gap-3 text-[22px] shrink-0">

        {/* 🔥 VIDEO */}
        <button
          aria-label="Start video call"
          onClick={() =>
            navigate("/call", {
              state: {
                call: {
                  name: chat.name,
                  avatar: chat.avatar,
                  type: "video",
                },
              },
            })
          }
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
        >
          <FiVideo />
        </button>

        {/* 🔥 AUDIO */}
        <button
          aria-label="Start audio call"
          onClick={() =>
            navigate("/call", {
              state: {
                call: {
                  name: chat.name,
                  avatar: chat.avatar,
                  type: "audio",
                },
              },
            })
          }
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
        >
          <FiPhone />
        </button>

        {/* 🔥 MENU */}
        <div ref={menuRef} className="relative">

          <button
            aria-label="Open menu"
            onClick={(e) => {

              e.stopPropagation();

              setShowMenu(prev => !prev);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
          >
            <FiMoreVertical />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-12 w-56 p-1.5 z-50 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden animate-menu">

              {/* PROFILE */}
              <div
                onClick={() => {

                  if (chat.isGroup) {

                    navigate(`/group-info/${chat.id}`);

                  } else {

                    navigate(`/user/${chat.id}`);
                  }

                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200"
              >
                <FiUser size={16} />

                <span className="text-[13px] font-medium">
                  {chat.isGroup ? "Group Info" : "View Profile"}
                </span>
              </div>

              {/* MEDIA */}
              <div
                onClick={() => {

                  navigate(`/media/${chat.id}`);

                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200"
              >
                <FiImage size={16} />

                <span className="text-[13px] font-medium">
                  Media & Files
                </span>
              </div>

              {/* THEME */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200">

                <FiEdit3 size={16} />

                <span className="text-[13px] font-medium">
                  Chat Theme
                </span>

              </div>

              {/* WALLPAPER */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200">

                <FiGrid size={16} />

                <span className="text-[13px] font-medium">
                  Change Wallpaper
                </span>

              </div>

              {/* MUTE */}
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200">

                <FiBellOff size={16} />

                <span className="text-[13px] font-medium">
                  Mute Notifications
                </span>

              </div>

              <div className="h-px bg-white/10 my-1.5" />

              {/* 🔥 PRIVATE */}
              {!chat.isGroup && (
                <div
                  onClick={async () => {

                    await toggleBlockContact(chat.id);

                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200"
                >

                  {chat?.blocked
                    ? <FiUnlock size={16} />
                    : <FiSlash size={16} />
                  }

                  <span className="text-[13px] font-medium">

                    {chat?.blocked
                      ? "Unblock Contact"
                      : "Block Contact"}

                  </span>
                </div>
              )}

              {/* 🔥 GROUP */}
              {chat.isGroup && (
                <>
                  <div
                    onClick={() => {

                      setShowAddMembersModal(true);

                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-white/5 transition-all duration-200"
                  >

                    <FiUserPlus size={16} />

                    <span className="text-[13px] font-medium">
                      Add Members
                    </span>
                  </div>

                  <div
                    onClick={async () => {

                      await leaveGroup(chat.id);

                      navigate("/");

                      setShowMenu(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 transition-all duration-200"
                  >

                    <FiLogOut size={16} />

                    <span className="text-[13px] font-medium">
                      Leave Group
                    </span>
                  </div>
                </>
              )}

              {/* CLEAR */}
              <div
                onClick={() => {

                  handleClearChat();

                  setShowMenu(false);
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 transition-all duration-200"
              >

                <FiTrash2 size={16} />

                <span className="text-[13px] font-medium">
                  Clear Chat
                </span>
              </div>

              {/* DELETE */}
              {!chat.isGroup && (
                <div
                  onClick={async () => {

                    await deleteContact(chat.id);

                    setShowMenu(false);
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-red-400 hover:bg-red-500/10 transition-all duration-200"
                >

                  <FiUserX size={16} />

                  <span className="text-[13px] font-medium">
                    Delete Contact
                  </span>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ChatHeader;