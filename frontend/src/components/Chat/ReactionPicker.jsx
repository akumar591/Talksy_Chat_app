import { memo } from "react";

import { useChat } from "../../context/ChatContext";

const emojis = [
  "👍",
  "❤️",
  "😂",
  "😮",
  "😢",
  "😡",
  "🔥",
];

const ReactionPicker = ({

  msg,
  isMe,

  showReactionPicker,

  setShowReactionPicker,

}) => {

  const {
    reactToMessage,
  } = useChat();

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (
    !showReactionPicker ||
    msg?.deleted
  ) {

    return null;
  }

  return (
    <div
      className={`
        absolute
        z-50

        top-full
        mt-3

        flex
        items-center
        gap-1.5

        px-2
        py-1.5

        rounded-full

        backdrop-blur-2xl

        border
        border-[rgba(255,255,255,0.08)]

        bg-[rgba(18,18,20,0.92)]

        shadow-[0_8px_25px_rgba(0,0,0,0.28)]

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

      {emojis.map(
        (emoji, index) => (

          <button
            key={index}
            onClick={(e) => {

              e.stopPropagation();

              reactToMessage(
                msg.id,
                emoji
              );

              setShowReactionPicker(
                false
              );
            }}
            className="
              flex
              items-center
              justify-center

              text-[20px]

              hover:scale-125

              active:scale-95

              transition-all
              duration-200
            "
          >

            {emoji}

          </button>
        )
      )}

    </div>
  );
};

export default memo(ReactionPicker);