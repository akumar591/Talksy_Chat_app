import { memo } from "react";

import { useChat } from "../../context/ChatContext";

const DeleteMenu = ({

  msg,
  isMe,

  showDeleteMenu,

  setShowDeleteMenu,

  setShowActions,

}) => {

  const {
    deleteForMe,
    deleteForEveryone,
  } = useChat();

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (
    !showDeleteMenu ||
    msg?.deleted
  ) {

    return null;
  }

  return (
    <div
      className={`
        delete-menu

        absolute
        z-50

        top-full
        mt-3

        w-56

        p-2

        rounded-[24px]

        backdrop-blur-2xl

        border
        border-[rgba(255,255,255,0.08)]

        bg-[rgba(18,18,20,0.92)]

        shadow-[0_10px_30px_rgba(0,0,0,0.28)]

        animate-menu

        ${isMe
          ? "right-0"
          : "left-0"
        }
      `}
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      {/* =============================== */}
      {/* 🔥 DELETE FOR ME */}
      {/* =============================== */}
      <button
        onClick={(e) => {

          e.stopPropagation();

          deleteForMe(
            msg.id
          );

          setShowDeleteMenu(
            false
          );

          setShowActions(
            false
          );
        }}
        className="
          w-full

          text-left

          px-4
          py-3

          rounded-2xl

          text-sm

          hover:bg-white/5

          transition-all
          duration-200
        "
      >

        Delete for me

      </button>

      {/* =============================== */}
      {/* 🔥 DELETE FOR EVERYONE */}
      {/* =============================== */}
      <button
        onClick={(e) => {

          e.stopPropagation();

          deleteForEveryone(
            msg.id
          );

          setShowDeleteMenu(
            false
          );

          setShowActions(
            false
          );
        }}
        className="
          w-full

          text-left

          px-4
          py-3

          rounded-2xl

          text-sm
          text-red-400

          hover:bg-red-500/10

          transition-all
          duration-200
        "
      >

        Delete for everyone

      </button>

    </div>
  );
};

export default memo(DeleteMenu);