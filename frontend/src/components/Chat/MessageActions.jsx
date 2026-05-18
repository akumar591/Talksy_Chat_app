import {
  FiCornerUpLeft,
  FiSmile,
  FiTrash2,
} from "react-icons/fi";

import { memo } from "react";

import { useChat } from "../../context/ChatContext";

const MessageActions = ({

  msg,
  isMe,

  showActions,

  setShowReactionPicker,
  setShowDeleteMenu,

}) => {

  const {
    setReplyTo,
  } = useChat();

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (
    msg?.deleted ||
    !showActions
  ) {

    return null;
  }

  return (
    <div
      className={`
        absolute
        top-[100%]
        mt-2

        z-40

        flex
        items-center
        gap-2

        px-2.5
        py-2

        rounded-full

        backdrop-blur-2xl

        border
        border-[var(--border)]

        bg-[color-mix(in_srgb,var(--card)_88%,transparent)]

        shadow-[0_10px_30px_rgba(0,0,0,0.22)]

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
      {/* 🔥 REPLY */}
      {/* =============================== */}
      <button
        aria-label="Reply message"
        onClick={(e) => {

          e.stopPropagation();

          setReplyTo(msg);
        }}
        className="
          w-8
          h-8

          rounded-full

          flex
          items-center
          justify-center

          bg-[var(--card)]

          border
          border-[var(--border)]

          text-[var(--text)]

          shadow-md

          hover:bg-[var(--primary)]/10
          hover:text-[var(--primary)]

          hover:scale-105

          active:scale-95

          transition-all
          duration-200
        "
      >

        <FiCornerUpLeft size={15} />

      </button>

      {/* =============================== */}
      {/* 🔥 REACTION */}
      {/* =============================== */}
      <button
        aria-label="React message"
        onClick={(e) => {

          e.stopPropagation();

          setShowReactionPicker(
            prev => !prev
          );
        }}
        className="
          w-8
          h-8

          rounded-full

          flex
          items-center
          justify-center

          bg-[var(--card)]

          border
          border-[var(--border)]

          text-[var(--text)]

          shadow-md

          hover:bg-[var(--primary)]/10
          hover:text-[var(--primary)]

          hover:scale-105

          active:scale-95

          transition-all
          duration-200
        "
      >

        <FiSmile size={15} />

      </button>

      {/* =============================== */}
      {/* 🔥 DELETE */}
      {/* =============================== */}
      <button
        aria-label="Delete message"
        onClick={(e) => {

          e.stopPropagation();

          setShowDeleteMenu(
            prev => !prev
          );
        }}
        className="
          w-8
          h-8

          rounded-full

          flex
          items-center
          justify-center

          bg-[var(--card)]

          border
          border-[var(--border)]

          text-[var(--text)]

          shadow-md

          hover:bg-red-500/10
          hover:text-red-400

          hover:scale-105

          active:scale-95

          transition-all
          duration-200
        "
      >

        <FiTrash2 size={15} />

      </button>

    </div>
  );
};

export default memo(MessageActions);