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
    msg.type === "TEXT";
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
      flex w-fit max-w-full
      ${isMe ? "ml-auto justify-end" : "mr-auto justify-start"}
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
        <div className="shrink-0 mr-2 self-start pt-[1px]">
          <img
            src={msg.senderAvatar || "/default-avatar.png"}
            alt={msg.senderName}
            loading="lazy"
            className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shadow-sm"
          />
        </div>
      )}

      {/* =============================== */}
      {/* 🔥 MESSAGE BODY */}
      {/* =============================== */}
      <div
          className={
            onlyEmoji ||
            msg.type === "STATUS_REPLY" ||
            msg.type === "STATUS_REACTION"
              ? "relative w-fit"
              : "relative w-fit min-w-[220px] sm:min-w-[260px] max-w-[85%] md:max-w-[70%] lg:max-w-[58%]"
          }
      >
        {/* =============================== */}
        {/* 🔥 GROUP HEADER */}
        {/* =============================== */}
        {isGroupMessage && (
          <div className="flex items-center gap-2 mb-[5px] px-[2px]">
            {/* 🔥 USER NAME */}
            {/* 🔥 USER NAME */}
            <span
              className={`text-[13px] font-semibold leading-none tracking-[0.1px]
                  ${
                    msg.senderRole === "CREATOR"
                      ? "text-[var(--group-creator)]"
                      : msg.senderRole === "ADMIN"
                        ? "text-[var(--group-admin)]"
                        : "text-[var(--group-member)]"
                  }`}
            >
              {msg.senderName}
            </span>

            {/* 🔥 ROLE BADGE */}
            <span
              className={`text-[9px] uppercase tracking-wide px-2 py-[2px] rounded-full font-medium
                
                ${
                  msg.senderRole === "CREATOR"
                    ? `
                      bg-[var(--group-creator-bg)]
                      text-[var(--group-creator)]
                    `
                    : msg.senderRole === "ADMIN"
                      ? `
                        bg-[var(--group-admin-bg)]
                        text-[var(--group-admin)]
                      `
                      : `
                        bg-[var(--group-member-bg)]
                        text-[var(--group-member)]
                      `
                }
              `}
            >
              {msg.senderRole}
            </span>
          </div>
        )}

        {/* =============================== */}
        {/* 🔥 MESSAGE CARD */}
        {/* =============================== */}
        <div
          className={`relative z-[1] ${onlyEmoji ? "w-fit max-w-fit" : "w-full max-w-full"} whitespace-pre-wrap break-words transition-all duration-300

          ${ onlyEmoji ? ` bg-transparent p-0 shadow-none ` : "" }
              
          ${
            !onlyEmoji && isTextMessage
              ? `
                px-[10px] pt-[7px] pb-[2px] border backdrop-blur-2xl

                ${
                  isMe
                    ? `
                      bg-[var(--primary)] text-black border-[rgba(255,255,255,0.08)]
                      rounded-[18px] rounded-br-[5px]
                      shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                    `
                    : `
                      bg-[var(--card)] text-[var(--text)] border-[rgba(255,255,255,0.05)]
                      rounded-[18px] rounded-bl-[5px]
                      shadow-[0_10px_30px_rgba(0,0,0,0.22)]
                    `
                }
              `
              : ""
          }

          ${
            msg.type === "MEDIA_GROUP" ||
            msg.type === "IMAGE" ||
            msg.type === "VIDEO"
              ? ` rounded-[22px] overflow-visible ` : ""    
           }

          ${
            onlyEmoji
              ? `
                text-[42px] leading-none inline-flex flex-wrap gap-x-[2px] gap-y-[2px] w-fit max-w-[220px]
                ${isMe ? "justify-end" : "justify-start"}
              `
              : `
                text-[14px] leading-[1.3]
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
            <span className="italic opacity-60 text-sm">
              🚫 This message was deleted
            </span>
          ) : (
            <>
              {/* =============================== */}
              {/* 🔥 REPLY PREVIEW */}
              {/* =============================== */}
              {replyMessage && (
                <div className={`  mb-2 overflow-hidden rounded-2xl border-l-[4px] backdrop-blur-xl
                    ${
                      isMe
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
                  <div className="px-3 py-2">
                    {/* 🔥 TOP */}
                    <div className="flex items-center gap-2 mb-[4px]">
                      {/* 🔥 MINI AVATAR */}
                      <img
                        src={
                          replyMessage?.senderAvatar || "/default-avatar.png"
                        }
                        alt="" className=" w-5 h-5 rounded-full object-cover shrink-0" />
 
                      {/* 🔥 NAME */}
                      <span
                        className={`text-[11px]   font-semibold   truncate
                      ${isMe ? "text-black/70" : "text-[var(--primary)]"}`}   >
          
                   
                        {replyMessage?.senderName || "User"}
                      </span>
                    </div>

                    {/* 🔥 CONTENT */}
                    <div
                      className=" text-[12px] opacity-75 leading-[1.4] break-words line-clamp-2 ">
                                                                                                                                                    
                      {/* 🔥 IMAGE */}
                      {replyMessage?.type === "IMAGE" ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={replyMessage.content}
                            alt=""
                            className="w-10 h-10
                              rounded-lg
                              object-cover
                            "
                          />
                

                          <span>📷 Photo</span>
                        </div>
                      ) : replyMessage?.type === "VIDEO" ? (
                        <div className="flex items-center gap-2">
                          <video
                            src={replyMessage.content}
                            className="w-10 h-10 rounded-lg object-cover"              
                          />
                          <span>🎥 Video</span>
                        </div>
                      ) : replyMessage?.type === "FILE" ? (
                        <span>📄 File</span>
                      ) : (
                        replyMessage?.content
                      )}
                    </div>
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
                <div className="relative group w-fit">

                  {/* 🔥 MEDIA OPTIONS */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      setShowActions((prev) => !prev);

                      setShowReactionPicker(false);

                      setShowDeleteMenu(false);
                    }}

                    className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-black/45 backdrop-blur-xl text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-black/60"
                  >
                    ⋮
                  </button>

                  {/* 🔥 IMAGE */}
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

                    className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[360px] max-h-[420px] object-cover rounded-[22px] cursor-pointer select-none block"
                  />

                  {/* 🔥 MEDIA OVERLAY */}
                  <div className="absolute inset-0 rounded-[22px] bg-black/0 group-hover:bg-black/10 transition-all duration-200 pointer-events-none" />

                </div>
              )}

              {/* =============================== */}
              {/* 🔥 VIDEO */}
              {/* =============================== */}
              {msg.type === "VIDEO" && (
                <div className="relative group w-fit">

                  {/* 🔥 MEDIA OPTIONS */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions((prev) => !prev);
                      setShowReactionPicker(false);
                      setShowDeleteMenu(false);
                    }}
                    className="absolute top-2 right-2 z-30 w-8 h-8 rounded-full bg-black/45 backdrop-blur-xl text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200 hover:bg-black/60"
                  >
                    ⋮
                  </button>

                  {/* 🔥 VIDEO */}
                  <video
                    src={msg.content}
                    controls
                    playsInline

                    onClick={(e) => {
                      e.stopPropagation();
                    }}

                    className="w-full max-w-[220px] sm:max-w-[260px] md:max-w-[360px] max-h-[420px] rounded-[22px] bg-black object-cover"
                  />

                  {/* 🔥 OVERLAY */}
                  <div className="absolute inset-0 rounded-[22px] bg-black/0 group-hover:bg-black/10 transition-all duration-200 pointer-events-none" />

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
                  className={`
              flex items-center gap-3 px-4 py-3 rounded-[20px]

              ${
                isMe
                  ? `
                    bg-black/10
                  `
                  : `
                    bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]
                  `
              }
            `}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[var(--primary)]/20 flex items-center justify-center">
                    📄
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold">File</p>

                    <p className="text-[11px] opacity-60">Tap to open</p>
                  </div>
                </a>
              )}

              {/* =============================== */}
              {/* 🔥 TEXT */}
              {/* =============================== */}
              {msg.type === "TEXT" && (
                <div className={`${onlyEmoji ? "w-fit" : "relative"}`}>
                  {/* 🔥 MESSAGE */}
                  <span
                    className={`relative z-10 font-[450] break-words whitespace-pre-wrap ${
                      onlyEmoji
                        ? "text-[30px] leading-[1.05]"
                        : "text-[15px] leading-[1.28]"
                    }`}
                  >
                    {msg.content}
                  </span>

                  {/* 🔥 TIME */}
                  <div
                    className={`flex
                ${
                  onlyEmoji
                    ? isMe
                      ? "justify-end pr-[4px]"
                      : "justify-start pl-[4px]"
                    : "justify-end"
                }
                ${onlyEmoji ? "mt-[4px]" : "mt-[2px]"}
              `}
                  >
                    <span
                      className={`text-[10px] opacity-60 ${
                        onlyEmoji
                          ? `dark:text-white/70 text-black/70`
                          : isMe
                                ? "text-[var(--message-time-me)]"
                                : "text-[var(--message-time)]"
                      }`}
                    >
                      {formattedTime}
                    </span>
                  </div>
                </div>
              )}

              {/* =============================== */}
              {/* 🔥 STATUS REACTION */}
              {/* =============================== */}
              {msg.type === "STATUS_REACTION" && (

                <div
                  className={`
                    relative overflow-hidden w-fit
                    rounded-[26px]
                    border
                    backdrop-blur-2xl
                    shadow-[0_8px_24px_rgba(0,0,0,0.18)]

                    ${
                      isMe
                        ? `
                          bg-[var(--primary)]
                          border-white/10
                          text-black
                        `
                        : `
                          bg-[var(--card)]
                          border-[var(--border)]
                          text-[var(--text)]
                        `
                    }
                  `}
                >

                  {/* 🔥 MEDIA */}
                  {msg.statusMedia && (

                    <div className="relative">

                      {msg.statusType === "IMAGE" ? (

                        <img
                          src={msg.statusMedia}
                          alt="status"
                          className="block w-[190px] h-[250px] object-cover"
                        />

                      ) : (

                        <video
                          src={msg.statusMedia}
                          className="block w-[190px] h-[250px] object-cover"
                        />

                      )}

                      {/* 🔥 FLOATING REACTION */}
                      <div className="absolute bottom-3 right-3">

                        <div className="w-11 h-11 rounded-full bg-black/55 backdrop-blur-xl border border-white/10 flex items-center justify-center text-[22px] shadow-xl">
                          {msg.content?.split(" ")[0]}
                        </div>

                      </div>

                    </div>
                  )}

                  {/* 🔥 BOTTOM */}
                  <div className="px-3 py-2">

                    <p className="text-[12px] font-medium opacity-70">
                      reacted to your status
                    </p>

                  </div>

                </div>
              )}

              {/* =============================== */}
              {/* 🔥 STATUS REPLY */}
              {/* =============================== */}
              {msg.type === "STATUS_REPLY" && (

                <div
                  className={`
                    relative overflow-hidden w-fit
                    rounded-[26px]
                    border
                    backdrop-blur-2xl
                    shadow-[0_8px_24px_rgba(0,0,0,0.18)]

                    ${
                      isMe
                        ? `
                          bg-[var(--primary)]
                          border-white/10
                          text-black
                        `
                        : `
                          bg-[var(--card)]
                          border-[var(--border)]
                          text-[var(--text)]
                        `
                    }
                  `}
                >

                  {/* 🔥 MEDIA */}
                  {msg.statusMedia && (

                    <div className="relative">

                      {msg.statusType === "IMAGE" ? (

                        <img
                          src={msg.statusMedia}
                          alt="status"
                          className="block w-[210px] sm:w-[230px] h-[270px] object-cover"
                        />

                      ) : (

                        <video
                          src={msg.statusMedia}
                          className="block w-[210px] sm:w-[230px] h-[270px] object-cover"
                        />

                      )}

                    </div>
                  )}

                  {/* 🔥 REPLY CONTENT */}
                  <div className="px-3 py-3">

                    {/* 🔥 TOP LABEL */}
                    <div className="flex items-center gap-2 mb-2">

                      <div className="w-2 h-2 rounded-full bg-sky-400" />

                      <span className="text-[11px] uppercase tracking-[1.2px] font-semibold opacity-70">
                        Replying to status
                      </span>

                    </div>

                    {/* 🔥 MESSAGE */}
                    <p className="text-[14px] leading-[1.45] break-words whitespace-pre-wrap">

                      {(msg.content || "").replace(
                        "Reply to your status: ",
                        ""
                      )}

                    </p>

                  </div>

                </div>
              )}


              {/* =============================== */}
              {/* 🔥 MEDIA TIME */}
              {/* =============================== */}
              {(msg.type === "IMAGE" ||
                msg.type === "VIDEO" ||
                msg.type === "MEDIA_GROUP") && (
                <div
                  className={`
              absolute bottom-2
              ${isMe ? "left-2" : "right-2"}
              px-2 py-[2px] rounded-full bg-black/45 backdrop-blur-xl
            `}
                >
                  <span className="text-[10px] text-white">
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
          absolute -bottom-3 ${isMe ? "left-2" : "left-2"}
          flex items-center gap-1 px-2 h-[28px]
          rounded-full bg-[var(--card)]
          border border-[rgba(255,255,255,0.08)]
          shadow-[0_4px_12px_rgba(0,0,0,0.25)]
          text-[15px] backdrop-blur-xl z-20
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
        <div
          className={`z-50 mt-2 flex justify-center sm:absolute sm:top-12 sm:right-2`}
        >
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
          <div className={`absolute z-[9999] top-[145%]  ${isMe ? `right-0 ` : `left-0` } sm:left-auto sm:top-12 sm:right-2 `}>

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
          setShowDeleteMenu={(value) => {
            setShowDeleteMenu(value);

            if (!value) {
              setShowActions(false);
            }
          }}
          setShowActions={setShowActions}
        />
      </div>
    </div>
  );
};

export default memo(MessageBubble);
