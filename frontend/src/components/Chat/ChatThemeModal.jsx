import { motion } from "framer-motion";

import { FiCheck } from "react-icons/fi";

import {
  useChatAppearance,
  CHAT_STYLES,
  BUBBLE_COLORS,
} from "../../context/ChatAppearanceContext";

const ChatThemeModal = ({
  open,

  onClose,

  chatKey,
}) => {
  // ===============================
  // 🔥 CONTEXT
  // ===============================
  const {
    getChatStyle,
    setChatStyle,

    getBubbleColor,
    setBubbleColor,
  } = useChatAppearance();

  // ===============================
  // 🔥 CURRENT
  // ===============================
  const currentStyle = getChatStyle(chatKey);

  const currentColor = getBubbleColor(chatKey);

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (!open) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0

        z-[9999]

        bg-black/60
        backdrop-blur-md

        flex
        items-center
        justify-center

        p-4
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.92,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.92,
          y: 30,
        }}
        className="
          relative

          w-full
          max-w-md

          rounded-[30px]

          overflow-hidden

          border
          border-white/10

          bg-[var(--card)]

          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        "
      >
        {/* ======================= */}
        {/* 🔥 HEADER */}
        {/* ======================= */}
        <div
          className="
            px-6
            pt-6
            pb-4

            border-b
            border-[var(--border)]
          "
        >
          <h2
            className="
              text-[22px]
              font-[700]

              text-[var(--text)]
            "
          >
            Chat Theme
          </h2>

          <p
            className="
              mt-1

              text-sm

              text-[var(--muted)]
            "
          >
            Personalize your conversation
          </p>
        </div>

        {/* ======================= */}
        {/* 🔥 BODY */}
        {/* ======================= */}
        <div
          className="
            p-6
            space-y-7
          "
        >
          {/* ======================= */}
          {/* 🔥 CHAT STYLE */}
          {/* ======================= */}
          <div>
            <h3
              className="
                text-sm
                font-semibold

                text-[var(--muted)]

                mb-3
              "
            >
              CHAT STYLE
            </h3>

            <div
              className="
                grid
                grid-cols-3
                gap-3
              "
            >
              {Object.values(CHAT_STYLES).map((style) => {
                const active = currentStyle?.id === style.id;

                return (
                  <button
                    key={style.id}
                    onClick={() => setChatStyle(chatKey, style.id)}
                    className={`
        relative

        h-[92px]

        rounded-[24px]

        border

        transition-all
        duration-300

        flex
        flex-col
        items-center
        justify-center
        gap-3

        overflow-hidden

        ${
          active
            ? `
              border-[var(--primary)]
              bg-[var(--primary)]/10

              shadow-[0_10px_30px_rgba(0,0,0,0.16)]
            `
            : `
              border-[var(--border)]
              bg-[var(--bg)]
            `
        }
      `}
                  >
                    {/* 🔥 PREVIEW */}
                    <div
                      className={`
          relative

          w-[58px]
          h-[38px]

          ${style.me}

          transition-all
          duration-300

          bg-[var(--primary)]

          ${
            style.id === "glass"
              ? `
                  before:absolute
                  before:inset-0

                  before:rounded-inherit

                  before:bg-gradient-to-br
                  before:from-white/20
                  before:to-transparent
                `
              : ""
          }

          ${
            style.id === "neon"
              ? `
                  shadow-[0_0_16px_rgba(34,211,238,0.45)]
                `
              : ""
          }
        `}
                    />

                    {/* 🔥 TITLE */}
                    <span
                      className="
          text-xs
          font-medium

          capitalize

          text-[var(--text)]
        "
                    >
                      {style.id}
                    </span>

                    {/* 🔥 ACTIVE ICON */}
                    {active && (
                      <div
                        className="
                                    absolute
                                    top-2
                                    right-2

                                    w-5
                                    h-5

                                    rounded-full

                                    bg-[var(--primary)]

                                    flex
                                    items-center
                                    justify-center
                                "
                      >
                        <FiCheck size={12} className="text-black" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ======================= */}
          {/* 🔥 BUBBLE COLOR */}
          {/* ======================= */}
          <div>
            <h3
              className="
                text-sm
                font-semibold

                text-[var(--muted)]

                mb-3
              "
            >
              BUBBLE COLOR
            </h3>

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              {Object.values(BUBBLE_COLORS).map((item) => {

                    const active =
                        currentColor?.id === item.id;

                    return (

                        <button
                        key={item.id}

                        onClick={() =>
                            setBubbleColor(
                            chatKey,
                            item.id
                            )
                        }

                        className={`
                            relative

                            w-14
                            h-14

                            rounded-full

                            border-[4px]

                            transition-all
                            duration-300

                            overflow-hidden

                            ${
                            active
                                ? `
                                    scale-110
                                    border-white

                                    shadow-[0_0_20px_rgba(255,255,255,0.22)]
                                `
                                : `
                                    border-transparent
                                `
                            }

                            ${
                            item.id === "glass"
                                ? `
                                    backdrop-blur-xl
                                `
                                : ""
                            }
                        `}
                        style={{
                            background: item.me,
                        }}
                        >

                        {/* 🔥 GLOW */}
                        <div
                            className="
                            absolute
                            inset-0

                            rounded-full

                            bg-gradient-to-br
                            from-white/20
                            to-transparent
                            "
                        />

                        {/* 🔥 ACTIVE */}
                        {active && (

                            <div
                            className="
                                absolute
                                inset-0

                                flex
                                items-center
                                justify-center
                            "
                            >

                            <FiCheck
                                size={18}
                                className="text-white"
                            />

                            </div>
                        )}

                        </button>
                    );
                    })}
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* 🔥 FOOTER */}
        {/* ======================= */}
        <div
          className="
            px-6
            pb-6
            pt-2
          "
        >
          <button
            onClick={onClose}
            className="
              w-full

              py-3

              rounded-[18px]

              bg-[var(--primary)]

              text-black
              font-semibold

              hover:scale-[1.01]

              active:scale-[0.99]

              transition-all
            "
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatThemeModal;
