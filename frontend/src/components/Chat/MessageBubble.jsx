import { useState, useEffect, memo } from "react";

import MessageActions from "./MessageActions";
import ReactionPicker from "./ReactionPicker";
import DeleteMenu from "./DeleteMenu";

import MediaGrid from "./MediaGrid";

const MessageBubble = ({
  msg,
  isMe,

  // 🔥 VIEWER
  setViewerOpen,
  setViewerMedia,
  setViewerIndex,
}) => {
  // ===============================
  // 🔥 LOCAL STATES
  // ===============================
  const [showActions, setShowActions] = useState(false);

  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  // ===============================
  // 🔥 OUTSIDE CLICK
  // ===============================
  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest(`.message-wrapper-${msg.id}`)) {
        setShowActions(false);

        setShowReactionPicker(false);

        setShowDeleteMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, [msg.id]);

  // ===============================
  // 🔥 ONLY EMOJI
  // ===============================
  const isOnlyEmoji = () => {
    if (msg.type !== "TEXT") {
      return false;
    }

    const text = msg.content?.trim() || "";

    if (!text) {
      return false;
    }

    const emojiRegex =
      /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u;

    return emojiRegex.test(text);
  };

  // ===============================
  // 🔥 MESSAGE TYPES
  // ===============================
  const isTextMessage =
    msg.type === "TEXT" ||
    msg.type === "STATUS_REPLY" ||
    msg.type === "STATUS_REACTION";

  const onlyEmoji = isOnlyEmoji();

  // ===============================
  // 🔥 REACTIONS
  // ===============================
  const reactions =
    msg.type === "MEDIA_GROUP"
      ? msg.medias?.[0]?.reactions || []
      : msg?.reactions || [];

  return (
    <div
      className={`
        relative
        max-w-full
        message-wrapper-${msg.id}
      `}
      onClick={(e) => {
        e.stopPropagation();

        setShowActions((prev) => !prev);

        setShowReactionPicker(false);

        setShowDeleteMenu(false);
      }}
    >
      {/* =============================== */}
      {/* 🔥 MESSAGE CONTAINER */}
      {/* =============================== */}
      <div
        className={`
          relative
          w-fit
          max-w-full

          whitespace-pre-wrap
          break-words

          transition-all
          duration-300

          ${onlyEmoji
            ? `
              bg-transparent
              p-0
              shadow-none
            `
            : ""
          }

          ${!onlyEmoji && isTextMessage
            ? `
              px-4
              py-3

              border

              backdrop-blur-2xl

              transition-all
              duration-300

              ${isMe
              ? `
                  bg-[var(--primary)]

                  text-black

                  border-[rgba(255,255,255,0.08)]

                  rounded-[22px]
                  rounded-br-[8px]

                  shadow-[0_10px_30px_rgba(0,0,0,0.18)]

                  before:absolute
                  before:inset-0

                  before:rounded-[22px]
                  before:rounded-br-[8px]

                  before:bg-[linear-gradient(180deg,rgba(255,255,255,0.14),transparent)]

                  before:pointer-events-none

                  after:absolute
                  after:top-1
                  after:left-2

                  after:w-[45%]
                  after:h-[40%]

                  after:bg-white/10
                  after:blur-xl

                  after:rounded-full
                  after:pointer-events-none
                `
              : `
                  bg-[var(--card)]

                  text-[var(--text)]

                  border-[rgba(255,255,255,0.05)]

                  rounded-[22px]
                  rounded-bl-[8px]

                  shadow-[0_10px_30px_rgba(0,0,0,0.22)]

                  before:absolute
                  before:inset-0

                  before:rounded-[22px]
                  before:rounded-bl-[8px]

                  before:bg-[linear-gradient(180deg,rgba(255,255,255,0.04),transparent)]

                  before:pointer-events-none
                `
            }
            `
            : ""
          }

          ${msg.type === "MEDIA_GROUP" ||
            msg.type === "IMAGE" ||
            msg.type === "VIDEO"
            ? `
              rounded-[22px]
              overflow-hidden
            `
            : ""
          }

          ${onlyEmoji
            ? "text-[28px] leading-none"
            : "text-[14px] leading-[1.55]"
          }
        `}
        style={{
          overflowWrap: "anywhere",
          wordBreak: "break-word",
        }}
      >
        {/* =============================== */}
        {/* 🔥 DELETED */}
        {/* =============================== */}
        {msg.deletedForEveryone ||
          (msg.type === "MEDIA_GROUP" && msg.medias?.[0]?.deletedForEveryone) ? (
          <span className="italic opacity-60 text-sm">
            🚫 This message was deleted
          </span>
        ) : (
          <>
            {/* =============================== */}
            {/* 🔥 REPLY PREVIEW */}
            {/* =============================== */}
            {(msg.replyTo ||
              (msg.type === "MEDIA_GROUP" && msg.medias?.[0]?.replyTo)) && (
                <div
                  className={`
      mb-2

      px-3
      py-2

      rounded-2xl

      border-l-[3px]

      backdrop-blur-xl

      ${isMe
                      ? `
          bg-black/10
          border-black/40
        `
                      : `
          bg-white/[0.04]
          border-[var(--primary)]
        `
                    }
    `}
                >
                  {/* 🔥 SENDER */}
                  <p
                    className={`
        text-[11px]
        font-semibold
        mb-1

        ${isMe ? "text-black/70" : "text-[var(--primary)]"}
      `}
                  >
                    {(msg.replyTo || msg.medias?.[0]?.replyTo)?.senderName ||
                      "Reply"}
                  </p>

                  {/* 🔥 CONTENT */}
                  <div
                    className="
        text-[12px]
        opacity-75

        break-words
      "
                  >
                    {(() => {
                      const reply = msg.replyTo || msg.medias?.[0]?.replyTo;

                      const value = reply?.content || "";

                      // ===============================
                      // 🔥 IMAGE
                      // ===============================
                      if (
                        reply?.type === "IMAGE" ||
                        (value.includes("cloudinary") &&
                          (value.includes("/image/") ||
                            value.match(/\.(jpg|jpeg|png|webp|gif)$/i)))
                      ) {
                        return (
                          <div
                            className="
              flex
              items-center
              gap-2
            "
                          >
                            <img
                              src={value}
                              alt="reply-media"
                              className="
                  w-11
                  h-11

                  rounded-xl

                  object-cover

                  shrink-0
                "
                            />

                            <span
                              className="
                text-[12px]
                opacity-75
              "
                            >
                              📷 Photo
                            </span>
                          </div>
                        );
                      }

                      // ===============================
                      // 🔥 VIDEO
                      // ===============================
                      if (
                        reply?.type === "VIDEO" ||
                        (value.includes("cloudinary") &&
                          value.includes("/video/"))
                      ) {
                        return (
                          <div
                            className="
              flex
              items-center
              gap-2
            "
                          >
                            <video
                              src={value}
                              className="
                  w-11
                  h-11

                  rounded-xl

                  object-cover

                  shrink-0
                "
                            />

                            <span
                              className="
                text-[12px]
                opacity-75
              "
                            >
                              🎥 Video
                            </span>
                          </div>
                        );
                      }

                      // ===============================
                      // 🔥 FILE
                      // ===============================
                      if (reply?.type === "FILE") {
                        return "📄 File";
                      }

                      // ===============================
                      // 🔥 TEXT
                      // ===============================
                      return value;
                    })()}
                  </div>
                </div>
              )}
            {/* =============================== */}
            {/* 🔥 MEDIA GROUP */}
            {/* =============================== */}
            {msg.type === "MEDIA_GROUP" && (
              <MediaGrid
                medias={msg.medias}
                setViewerOpen={setViewerOpen}
                setViewerMedia={setViewerMedia}
                setViewerIndex={setViewerIndex}
              />
            )}

            {/* =============================== */}
            {/* 🔥 IMAGE */}
            {/* =============================== */}
            {/* =============================== */}
            {/* 🔥 IMAGE */}
            {/* =============================== */}
            {msg.type === "IMAGE" && (

              <div className="relative">

                {/* 🔥 THREE DOT */}
                <div className="
      absolute
      top-2
      right-2

      z-40
    ">

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      setShowActions(
                        prev => !prev
                      );

                      setShowReactionPicker(false);

                      setShowDeleteMenu(false);
                    }}
                    className="
          w-9
          h-9

          rounded-full

          bg-black/45

          backdrop-blur-xl

          border
          border-white/10

          text-white

          flex
          items-center
          justify-center

          hover:bg-black/60

          transition-all
          duration-200
        "
                  >

                    ⋮

                  </button>

                </div>

                <div className="
      max-w-[260px]
      md:max-w-[360px]

      overflow-hidden
      rounded-[22px]
    ">

                  <img
                    src={msg.content}
                    alt="chat-media"

                    loading="lazy"

                    onClick={(e) => {

                      e.stopPropagation();

                      setViewerMedia([msg]);

                      setViewerIndex(0);

                      setViewerOpen(true);
                    }}

                    className="
          w-full
          h-[240px]

          object-cover

          cursor-pointer

          hover:scale-[1.02]

          transition-all
          duration-300
        "
                  />

                </div>

              </div>
            )}

            {/* =============================== */}
            {/* 🔥 VIDEO */}
            {/* =============================== */}
            {msg.type === "VIDEO" && (

              <div className="relative">

                {/* 🔥 THREE DOT */}
                <div className="
      absolute
      top-2
      right-2

      z-40
    ">

                  <button
                    onClick={(e) => {

                      e.stopPropagation();

                      setShowActions(
                        prev => !prev
                      );

                      setShowReactionPicker(false);

                      setShowDeleteMenu(false);
                    }}
                    className="
          w-9
          h-9

          rounded-full

          bg-black/45

          backdrop-blur-xl

          border
          border-white/10

          text-white

          flex
          items-center
          justify-center

          hover:bg-black/60

          transition-all
          duration-200
        "
                  >

                    ⋮

                  </button>

                </div>

                <video
                  src={msg.content}

                  controls
                  playsInline

                  className="
        w-full

        max-w-[260px]
        md:max-w-[360px]

        rounded-[22px]

        object-cover
      "
                />

              </div>
            )}

            {/* =============================== */}
            {/* 🔥 FILE */}
            {/* =============================== */}
            {msg.type === "FILE" && (
              <a
                href={msg.content}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className={`
                  flex
                  items-center
                  gap-3

                  px-4
                  py-3

                  rounded-[20px]

                  transition-all
                  duration-300

                  ${isMe
                    ? `
                      bg-black/10
                      hover:bg-black/15
                    `
                    : `
                      bg-[rgba(255,255,255,0.03)]

                      hover:bg-[rgba(255,255,255,0.05)]

                      border
                      border-[rgba(255,255,255,0.05)]
                    `
                  }
                `}
              >
                <div
                  className="
                  w-11
                  h-11

                  rounded-2xl

                  bg-[var(--primary)]/20

                  flex
                  items-center
                  justify-center

                  text-lg
                "
                >
                  📄
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">File</p>

                  <p className="text-[11px] opacity-60 truncate">Tap to open</p>
                </div>
              </a>
            )}

            {/* =============================== */}
            {/* 🔥 TEXT */}
            {/* =============================== */}
            {msg.type === "TEXT" && (
              <span className="relative z-10 font-[450]">{msg.content}</span>
            )}

            {/* =============================== */}
            {/* 🔥 STATUS REPLY */}
            {/* =============================== */}
            {msg.type === "STATUS_REPLY" && (
              <span className="relative z-10 font-[450]">
                {(msg.content || "").replace("Reply to your status: ", "")}
              </span>
            )}

            {/* =============================== */}
            {/* 🔥 STATUS REACTION */}
            {/* =============================== */}
            {msg.type === "STATUS_REACTION" && (
              <span className="relative z-10 font-[450]">
                {(msg.content || "").replace(" reacted to your status", "")}
              </span>
            )}
          </>
        )}

        {/* =============================== */}
        {/* 🔥REACTIONS */}
        {/* =============================== */}
        {reactions.length > 0 && (
          <div
            className={`
              absolute
              -bottom-3

              ${isMe ? "right-2" : "left-2"}

              flex
              items-center
              gap-1

              px-2
              h-[28px]

              rounded-full

              bg-[var(--card)]

              border
              border-[rgba(255,255,255,0.08)]

              shadow-[0_4px_12px_rgba(0,0,0,0.25)]

              text-[15px]

              backdrop-blur-xl

              z-20
            `}
          >
            {reactions.map((r, i) => (
              <span key={i} className="relative top-[1px]">
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* =============================== */}
      {/* 🔥 ACTIONS */}
      {/* =============================== */}
      <div className="absolute top-12 right-2 z-50">
      <MessageActions
        msg={msg}
        isMe={isMe}
        showActions={showActions}
        setShowReactionPicker={setShowReactionPicker}
        setShowDeleteMenu={setShowDeleteMenu}
      />
      </div>

      {/* =============================== */}
      {/* 🔥 REACTION PICKER */}
      {/* =============================== */}
      <div className="absolute top-12 right-2 z-[60]">
      <ReactionPicker
        isMe={isMe}
        msg={msg}
        showReactionPicker={showReactionPicker}
        setShowReactionPicker={setShowReactionPicker}
      />
      </div>

      {/* =============================== */}
      {/* 🔥 DELETE MENU */}
      {/* =============================== */}
      <DeleteMenu
        isMe={isMe}
        msg={msg}
        showDeleteMenu={showDeleteMenu}
        setShowDeleteMenu={setShowDeleteMenu}
        setShowActions={setShowActions}
      />
    </div>
  );
};

export default memo(MessageBubble);
