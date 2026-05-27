import { motion } from "framer-motion";
import { FiCheck, FiX } from "react-icons/fi";

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

  // ======================================
  // 🔥 CONTEXT
  // ======================================
  const {
    getChatStyle,
    setChatStyle,

    getBubbleColor,
    setBubbleColor,
  } = useChatAppearance();

  // ======================================
  // 🔥 CURRENT
  // ======================================
  const currentStyle =
    getChatStyle(chatKey);

  const currentColor =
    getBubbleColor(chatKey);

  // ======================================
  // 🔥 HIDE
  // ======================================
  if (!open) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="
        fixed
        inset-0

        z-[9999]

        bg-black/60
        backdrop-blur-md

        flex
        items-start
        md:items-center

        justify-center

        p-0
        md:p-6
        md:pt-16
      "
    >

      {/* ====================================== */}
      {/* 🔥 MODAL */}
      {/* ====================================== */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 24,
        }}

        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}

        exit={{
          opacity: 0,
          scale: 0.94,
          y: 24,
        }}

        transition={{
          duration: 0.22,
          ease: "easeOut",
        }}

        onClick={(e) =>
          e.stopPropagation()
        }

        className="
          relative

          w-full
          md:max-w-[720px]

          h-screen
          md:h-auto

          md:max-h-[82vh]

          rounded-none
          md:rounded-[32px]

          overflow-hidden

          flex
          flex-col

          border
          border-white/10

          bg-[var(--card)]

          shadow-[0_20px_80px_rgba(0,0,0,0.35)]
        "
      >

        {/* ====================================== */}
        {/* 🔥 HEADER */}
        {/* ====================================== */}
        <div
          className="
            sticky
            top-0

            z-30

            flex
            items-start
            justify-between

            px-5
            md:px-6

            pt-5
            pb-4

            border-b
            border-[var(--border)]

            bg-[var(--card)]/95
            backdrop-blur-xl
          "
        >

          {/* 🔥 TITLE */}
          <div>

            <h2
              className="
                text-[24px]
                md:text-[26px]

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

          {/* 🔥 CLOSE */}
          <button
            onClick={onClose}

            className="
              w-10
              h-10

              rounded-full

              flex
              items-center
              justify-center

              transition-all

              hover:bg-white/10
            "
          >

            <FiX
              className="
                text-[20px]

                text-[var(--text)]
              "
            />

          </button>

        </div>

        {/* ====================================== */}
        {/* 🔥 BODY */}
        {/* ====================================== */}
        <div
          className="
            flex-1

            overflow-y-auto
            overflow-x-hidden

            hide-scrollbar

            p-4
            md:p-5

            space-y-7
          "
        >

          {/* ====================================== */}
          {/* 🔥 CHAT STYLE */}
          {/* ====================================== */}
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
                grid-cols-2
                md:grid-cols-3

                gap-3
              "
            >

              {Object.values(CHAT_STYLES).map((style) => {

                const active =
                  currentStyle?.id === style.id;

                return (

                  <button
                    key={style.id}

                    onClick={() =>
                      setChatStyle(
                        chatKey,
                        style.id
                      )
                    }

                    className={`
                      relative

                      h-[88px]
                      md:h-[96px]

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

                            scale-[1.02]

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

                    {/* 🔥 ACTIVE */}
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

                        <FiCheck
                          size={12}
                          className="text-black"
                        />

                      </div>

                    )}

                  </button>
                );
              })}

            </div>

          </div>

          {/* ====================================== */}
          {/* 🔥 BUBBLE COLOR */}
          {/* ====================================== */}
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
                grid
                grid-cols-5
                md:grid-cols-10

                gap-3
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

                      w-12
                      h-12

                      md:w-14
                      md:h-14

                      rounded-full

                      border-[4px]

                      overflow-hidden

                      transition-all
                      duration-300

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

        {/* ====================================== */}
        {/* 🔥 FOOTER */}
        {/* ====================================== */}
        <div
          className="
            sticky
            bottom-0

            px-5
            md:px-6

            pb-5
            md:pb-6

            pt-3

            border-t
            border-[var(--border)]

            bg-[var(--card)]/95

            backdrop-blur-xl
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

              transition-all

              hover:scale-[1.01]

              active:scale-[0.99]
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