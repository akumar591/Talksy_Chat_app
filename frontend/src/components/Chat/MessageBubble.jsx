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
  // 🔥 STATES
  // ===============================
  const [showActions, setShowActions] = useState(false);

  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const [activeMessageMenu, setActiveMessageMenu] = useState(null);

  const [showDeleteMenu, setShowDeleteMenu] = useState(false);

  // ===============================
  // 🔥 GROUP CHECK
  // ===============================
  const isGroupMessage =
    !isMe &&
    (msg?.isGroup || msg?.conversationType === "GROUP" || msg?.groupId);

  // ===============================
  // 🔥 OUTSIDE CLICK
  // ===============================
  useEffect(() => {
    const handleOutside = (e) => {
      if (!e.target.closest(`.message-wrapper-${msg.id}`)) {
        setShowActions(false);
        setShowReactionPicker(false);
        setShowDeleteMenu(false);
        setActiveMessageMenu(null);
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

  const onlyEmoji = isOnlyEmoji();

  // ===============================
  // 🔥 TYPES
  // ===============================
  const isTextMessage =
    msg.type === "TEXT" ||
    msg.type === "STATUS_REPLY" ||
    msg.type === "STATUS_REACTION";

  // ===============================
  // 🔥 REACTIONS
  // ===============================
  const reactions =
    msg.type === "MEDIA_GROUP"
      ? msg.medias?.[0]?.reactions || []
      : msg?.reactions || [];

  // ===============================
  // 🔥 REPLY
  // ===============================
  const replyMessage = msg.replyTo || msg.medias?.[0]?.replyTo;

  // ===============================
  // 🔥 TIME
  // ===============================
  const formattedTime = msg.createdAt
    ? new Date(msg.createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    : "";

  return (
    <div
      className={`
        w-full
        flex

        ${isMe ? "justify-end" : "justify-start"}

        ${showActions ? "mb-[70px]" : "mb-[6px]"}

        message-wrapper-${msg.id}
      `}
      onClick={(e) => {
        e.stopPropagation();

        setShowActions(true);

        setShowReactionPicker(false);

        setShowDeleteMenu(false);
      }}
    >
      {/* =============================== */}
      {/* 🔥 GROUP AVATAR */}
      {/* =============================== */}
      {isGroupMessage && (
        <img
          src={msg.senderAvatar || "/default-avatar.png"}
          alt={msg.senderName}
          className="
            w-9
            h-9

            rounded-full

            object-cover

            shrink-0

            mr-2
            mt-4
          "
        />
      )}

      {/* =============================== */}
      {/* 🔥 MESSAGE BODY */}
      {/* =============================== */}
      <div className="relative w-fit min-w-[220px] sm:min-w-[260px] max-w-[85%] md:max-w-[70%] lg:max-w-[58%]">

        {/* =============================== */}
        {/* 🔥 GROUP HEADER */}
        {/* =============================== */}
        {isGroupMessage && (
          <div
            className="
              flex
              items-center
              justify-between

              px-2
              mb-1
            "
          >
            {/* 🔥 USER NAME */}
            <span
              className="
                text-[12px]
                font-semibold

                text-[var(--primary)]
              "
            >
              {msg.senderName}
            </span>

            {/* 🔥 ROLE */}
            <span
              className="
                text-[10px]

                uppercase

                opacity-60

                ml-3
              "
            >
              {msg.senderRole === "CREATOR"
                ? "Creator"
                : msg.senderRole === "ADMIN"
                  ? "Admin"
                  : "Member"}
            </span>
          </div>
        )}

        {/* =============================== */}
        {/* 🔥 MESSAGE CARD */}
        {/* =============================== */}
        <div
          className={`
            relative
            z-[1]
            w-full
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
                 px-[10px]
                 py-[5px]
                  border

                  backdrop-blur-2xl

                  ${isMe
                ? `
                        bg-[var(--primary)]

                        text-black

                        border-[rgba(255,255,255,0.08)]

                        rounded-[18px]
rounded-br-[5px]

                        shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                      `
                : `
                        bg-[var(--card)]

                        text-[var(--text)]

                        border-[rgba(255,255,255,0.05)]

                        rounded-[18px]
rounded-bl-[5px]

                        shadow-[0_10px_30px_rgba(0,0,0,0.22)]
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
                  overflow-visible
                `
              : ""
            }

            ${onlyEmoji
              ? `
                  text-[30px]
                  leading-none
                `
              : `
                  text-[14px]
                  leading-[1.3]
                `
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
            (msg.type === "MEDIA_GROUP" &&
              msg.medias?.[0]?.deletedForEveryone) ? (
            <span
              className="
                italic
                opacity-60
                text-sm
              "
            >
              🚫 This message was deleted
            </span>
          ) : (
            <>
              {/* =============================== */}
              {/* 🔥 REPLY PREVIEW */}
              {/* =============================== */}
              {replyMessage && (
                <div
                  className={`
                    mb-1

px-[9px]
py-[6px]

                    rounded-2xl

                    border-l-[3px]

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
                  {/* 🔥 REPLY USER */}
                  <p
                    className={`
                      text-[11px]
                      font-semibold

                      mb-1

                      ${isMe ? "text-black/70" : "text-[var(--primary)]"}
                    `}
                  >
                    {replyMessage?.senderName || "Reply"}
                  </p>

                  {/* 🔥 REPLY CONTENT */}
                  <div
                    className="
                      text-[12px]

opacity-75

leading-[1.35]

break-words

whitespace-nowrap
                    "
                  >
                    {/* 🔥 IMAGE */}
                    {replyMessage?.type === "IMAGE" ||
                      (replyMessage?.content?.includes("cloudinary") &&
                        replyMessage?.content?.match(
                          /\.(jpg|jpeg|png|webp|gif)$/i,
                        )) ? (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <img
                          src={replyMessage.content}
                          alt="reply"
                          className="
                            w-11
                            h-11

                            rounded-xl

                            object-cover

                            shrink-0
                          "
                        />

                        <span>📷 Photo</span>
                      </div>
                    ) : replyMessage?.type === "VIDEO" ? (
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <video
                          src={replyMessage.content}
                          className="
                            w-11
                            h-11

                            rounded-xl

                            object-cover
                          "
                        />

                        <span>🎥 Video</span>
                      </div>
                    ) : replyMessage?.type === "FILE" ? (
                      "📄 File"
                    ) : (
                      replyMessage?.content
                    )}
                  </div>
                </div>
              )}

              {/* =============================== */}
              {/* 🔥 MEDIA GRID */}
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
              {msg.type === "IMAGE" && (
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

                    max-w-[260px]
                    md:max-w-[360px]

                    max-h-[420px]

                    object-cover

                    rounded-[22px]

                    cursor-pointer
                  "
                />
              )}

              {/* =============================== */}
              {/* 🔥 VIDEO */}
              {/* =============================== */}
              {msg.type === "VIDEO" && (
                <video
                  src={msg.content}
                  controls
                  playsInline
                  className="
                    w-full

                    max-w-[260px]
                    md:max-w-[360px]

                    rounded-[22px]
                  "
                />
              )}

              {/* =============================== */}
              {/* 🔥 FILE */}
              {/* =============================== */}
              {msg.type === "FILE" && (
                <a
                  href={msg.content}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    flex
                    items-center
                    gap-3

                    px-4
                    py-3

                    rounded-[20px]

                    ${isMe
                      ? `
                          bg-black/10
                        `
                      : `
                          bg-[rgba(255,255,255,0.03)]

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
                    "
                  >
                    📄
                  </div>

                  <div>
                    <p
                      className="
                        text-[13px]
                        font-semibold
                      "
                    >
                      File
                    </p>

                    <p
                      className="
                        text-[11px]

                        opacity-60
                      "
                    >
                      Tap to open
                    </p>
                  </div>
                </a>
              )}

              {/* =============================== */}
              {/* 🔥 TEXT */}
              {/* =============================== */}
              {msg.type === "TEXT" && (
                <div
                  className="relative " >
                  {/* 🔥 MESSAGE */}
                  <span
                    className="
                      relative
                      z-10

                      font-[450]

                      text-[15px]

                     leading-[1.28]

                      break-words
                      whitespace-pre-wrap
                    "
                  >
                    {msg.content}
                  </span>

                  {/* 🔥 TIME */}

                  <div className={` flex  ${isMe ? "justify-start" : "justify-end"} mt-[1px] `}>
                    <span
                      className={` text-[10px] opacity-60 ${onlyEmoji ? ` dark:text-white/70 text-black/70`
                        : isMe ? "text-black/70" : "text-white/60"} `}>
                      {formattedTime}
                    </span>
                  </div>
                </div>
              )}

              {/* =============================== */}
              {/* 🔥 STATUS REPLY */}
              {/* =============================== */}
              {msg.type === "STATUS_REPLY" && (
                <span
                  className="
                    relative
                    z-10

                    font-[450]
                  "
                >
                  {(msg.content || "").replace("Reply to your status: ", "")}
                </span>
              )}

              {/* =============================== */}
              {/* 🔥 STATUS REACTION */}
              {/* =============================== */}
              {msg.type === "STATUS_REACTION" && (
                <span
                  className="
                    relative
                    z-10

                    font-[450]
                  "
                >
                  {(msg.content || "").replace(" reacted to your status", "")}
                </span>
              )}

              {/* =============================== */}
              {/* 🔥 MEDIA TIME */}
              {/* =============================== */}
              {(msg.type === "IMAGE" ||
                msg.type === "VIDEO" ||
                msg.type === "MEDIA_GROUP") && (
                  <div
                    className={`
        absolute
        bottom-2

        ${isMe

                        ? "left-2"

                        : "right-2"
                      }

        px-2
        py-[2px]

        rounded-full

        bg-black/45

        backdrop-blur-xl
      `}
                  >
                    <span
                      className="
          text-[10px]
          text-white
        "
                    >
                      {formattedTime}
                    </span>
                  </div>
                )}
            </>
          )}

          {/* =============================== */}
          {/* 🔥 REACTIONS */}
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
                <span
                  key={i}
                  className="
                    relative
                    top-[1px]
                  "
                >
                  {r.emoji}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* =============================== */}
        {/* 🔥 ACTIONS */}
        {/* =============================== */}

        <div className={`z-50 ${` mt-2 flex justify-center`} sm:absolute sm:top-12 sm:right-2`}>

          {showActions && (

            <div className="w-full sm:w-auto">

              <MessageActions
                msg={msg}
                isMe={isMe}
                showActions={showActions}
                setShowReactionPicker={setShowReactionPicker}
                setShowDeleteMenu={setShowDeleteMenu}
              />

            </div>

          )}
        </div>

        {/* =============================== */}
{/* 🔥 REACTION PICKER */}
{/* =============================== */}

{showReactionPicker && (
  <div
  className={`
    absolute
    z-[9999]

   top-[145%]

    ${
      isMe
        ? `
            right-0
          `
        : `
            left-0
          `
    }

    sm:left-auto
    sm:top-12
    sm:right-2
  `}
>
    <ReactionPicker
      isMe={isMe}
      msg={msg}
      showReactionPicker={showReactionPicker}
      setShowReactionPicker={(value) => {
        setShowReactionPicker(value);

        if (!value) {
          setShowActions(false);
        }
      }}
    />
  </div>
)}

        {/* =============================== */}
        {/* 🔥 DELETE MENU */}
        {/* =============================== */}
        <DeleteMenu
          isMe={isMe}
          msg={msg}
          showDeleteMenu={showDeleteMenu}
          setShowDeleteMenu={(value) => { setShowDeleteMenu(value); if (!value) { setShowActions(false); } }}
          setShowActions={setShowActions}
        />
      </div>
    </div>
  );
};

export default memo(MessageBubble);
