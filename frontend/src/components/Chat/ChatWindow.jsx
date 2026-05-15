import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import {
  FiMoreVertical,
  FiPhone,
  FiVideo,
  FiPlus,
  FiSend,
  FiMic,
  FiSmile,
  FiCamera,
  FiUser,
  FiTrash2,
  FiImage,
  FiCornerUpLeft,
  FiX,
  FiEdit3,
  FiGrid,
  FiSearch,
  FiBellOff,
  FiSlash,
  FiUnlock,
  FiUserX,
  FiUserPlus,
  FiLogOut,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";
import EmojiPicker from "emoji-picker-react";
import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";
import { useGroup } from "../../context/GroupContext";
import AddMembersModal from "./AddMembersModal";
import { toast } from "react-hot-toast";
import MediaGrid from "./MediaGrid";

const ChatWindow = ({ chat, onBack }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { chatStyle } = useSettings();

  const {
    toggleBlockContact,
    deleteContact,

    messages,
    conversation,

    sendMessage,
    reactToMessage,

    deleteForMe,
    deleteForEveryone,

    clearChat,

    replyTo,
    setReplyTo,

    fetchMessages,

    // 🔥 NEW
    uploadChatMedia,

  } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [input, setInput] = useState("");

  const [showAttach, setShowAttach] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);

  const [showMenu, setShowMenu] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);

  const [reactionMsgId, setReactionMsgId] = useState(null);

  const [activeMessageId, setActiveMessageId] = useState(null);

  const [messageMenuId, setMessageMenuId] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  // ===============================
  // 🔥 REFS
  // ===============================
  const menuRef = useRef(null);

  const emojiRef = useRef(null);

  const attachRef = useRef(null);

  const reactionRef = useRef(null);

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  const timerRef = useRef(null);

  const galleryInputRef = useRef(null);

  const cameraInputRef = useRef(null);

  const fileInputRef = useRef(null);

  const emojis = ["👍", "❤️", "😂", "😮", "😢", "😡", "🙏"];

  const { leaveGroup, fetchGroupById, groupDetails } = useGroup();

  // ===============================
  // 🔥 SORT MESSAGES
  // ===============================
  const groupedMessages = useMemo(() => {

    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    );

    const finalMessages = [];

    let currentGroup = [];

    const flushGroup = () => {

      if (!currentGroup.length) {
        return;
      }

      // 🔥 SINGLE IMAGE
      if (currentGroup.length === 1) {

        finalMessages.push(
          currentGroup[0]
        );

      } else {

        // 🔥 MULTIPLE IMAGE GROUP
        finalMessages.push({

          id:
            `media-group-${currentGroup[0].id}`,

          type: "MEDIA_GROUP",

          senderId:
            currentGroup[0].senderId,

          createdAt:
            currentGroup[0].createdAt,

          medias: [...currentGroup],
        });
      }

      currentGroup = [];
    };

    sorted.forEach((msg) => {

      const isMedia =
        msg.type === "IMAGE";

      // 🔥 NORMAL MESSAGE
      if (!isMedia) {

        flushGroup();

        finalMessages.push(msg);

        return;
      }

      // 🔥 FIRST IMAGE
      if (!currentGroup.length) {

        currentGroup.push(msg);

        return;
      }

      const last =
        currentGroup[
        currentGroup.length - 1
        ];

      const sameSender =
        last.senderId ===
        msg.senderId;

      // 🔥 45 SECOND WINDOW
      const closeTime =
        (
          new Date(msg.createdAt) -
          new Date(last.createdAt)
        ) < 45000;

      if (
        sameSender &&
        closeTime
      ) {

        currentGroup.push(msg);

      } else {

        flushGroup();

        currentGroup.push(msg);
      }
    });

    flushGroup();

    return finalMessages;

  }, [messages]);

  // ===============================
  // 🔥 FETCH MESSAGES
  // ===============================
  useEffect(() => {
    if (conversation?.id) {
      fetchMessages(conversation.id);
    }
  }, [conversation?.id, fetchMessages]);

  // ===============================
  // 🔥 AUTO SCROLL
  // ===============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [groupedMessages]);

  // ===============================
  // 🔥 AUTO FOCUS
  // ===============================
  useEffect(() => {
    inputRef.current?.focus();
  }, [replyTo]);

  // ===============================
  // 🔥 CLEANUP TIMER
  // ===============================
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (chat?.isGroup && chat?.id) {
      fetchGroupById(chat.id);
    }
  }, [chat]);

  // ===============================
  // 🔥 CLOSE MENUS
  // ===============================
  useEffect(() => {
    const handler = (e) => {
      // MENU
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      // EMOJI
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setShowEmoji(false);
      }

      // ATTACH
      if (attachRef.current && attachRef.current.contains(e.target) && !e.target.closest(".attach-menu")) {
        setShowAttach(false);
      }

      // REACTION
      if (reactionRef.current && !reactionRef.current.contains(e.target)) {
        setReactionMsgId(null);
      }

      // DELETE MENU
      if (!e.target.closest(".delete-menu")) {
        setMessageMenuId(null);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // ===============================
  // 🔥 SEND MESSAGE
  // ===============================
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) return;

    if (!conversation?.id) return;

    try {
      await sendMessage({
        conversationId: conversation.id,
        content: input.trim(),
        type: "TEXT",

        // 🔥 REPLY FIX
        replyToId: replyTo?.id || null,
      });

      setInput("");

      setReplyTo(null);

      inputRef.current?.focus();
    } catch (error) {
      console.error("Send message error:", error);
    }
  }, [input, conversation, sendMessage, replyTo, setReplyTo]);

  // ===============================
  // 🔥 SEND MEDIA
  // ===============================
  const handleSendMedia =
    useCallback(async (
      files,
      mediaType
    ) => {

      try {

        if (
          !files?.length ||
          !conversation?.id
        ) {
          return;
        }

        setShowAttach(false);

        const fileArray =
          Array.from(files);

        for (const file of fileArray) {

          // 🔥 UPLOAD TO CLOUDINARY
          const uploaded =

            await uploadChatMedia(file);

          if (!uploaded?.url) {
            continue;
          }

          // 🔥 SEND MESSAGE
          await sendMessage({

            conversationId:
              conversation.id,

            content:
              uploaded.url,

            type:
              mediaType,
          });
        }

      } catch (err) {

        console.log(err);

        toast.error(
          "Media send failed"
        );
      }
    }, [

      conversation,

      sendMessage,

      uploadChatMedia,
    ]);

  // ===============================
  // 🔥 MIC
  // ===============================
  const handleMicClick = () => {
    setIsRecording(true);

    timerRef.current = setTimeout(() => {
      setIsRecording(false);
    }, 2000);
  };

  // ===============================
  // 🔥 FORMAT TIME
  // ===============================
  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ===============================
  // 🔥 CLEAR CHAT
  // ===============================
  const handleClearChat = () => {
    if (!conversation?.id) return;

    clearChat(conversation.id);

    setShowMenu(false);
  };

  // ===============================
  // 🔥 EMPTY CHAT
  // ===============================
  if (!chat) {
    return (
      <div className="hidden md:flex items-center justify-center h-full w-full">
        <div className="glass p-8 rounded-2xl text-center max-w-sm">
          <div className="text-4xl mb-3">💬</div>

          <h2 className="text-xl font-semibold mb-2">Welcome to Talksy</h2>

          <p className="opacity-60 text-sm">Select a conversation</p>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col w-full h-full overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      {/* 🔥 HEADER */}
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

          {/* 🔥 PROFILE CLICK */}
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
                <span
                  className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg)]" />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold truncate">{chat.name}</h2>

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

                setShowMenu((prev) => !prev);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
            >
              <FiMoreVertical />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-12 w-56 p-1.5 z-50 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden animate-menu">

                {/* PROFILE / GROUP INFO */}
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

                {/* CHAT THEME */}
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

                {/* 🔥 PRIVATE CHAT ONLY */}
                {!chat.isGroup && (
                  <>
                    {/* BLOCK / UNBLOCK */}
                    <div
                      onClick={async () => {
                        await toggleBlockContact(chat.id);

                        setShowMenu(false);
                      }}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-yellow-400 hover:bg-yellow-500/10 transition-all duration-200"
                    >
                      {chat?.blocked ? (
                        <FiUnlock size={16} />
                      ) : (
                        <FiSlash size={16} />
                      )}

                      <span className="text-[13px] font-medium">
                        {chat?.blocked ? "Unblock Contact" : "Block Contact"}
                      </span>
                    </div>
                  </>
                )}

                {/* 🔥 GROUP ONLY */}
                {chat.isGroup && (
                  <>
                    {/* ADD MEMBERS */}
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

                    {/* LEAVE GROUP */}
                    <div
                      onClick={async () => {
                        try {
                          await leaveGroup(chat.id);

                          navigate("/");
                        } catch (err) {
                          console.log(err);
                        }

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

                {/* CLEAR CHAT */}
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

                {/* DELETE CONTACT */}
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

      {/* 🔥 MESSAGES */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar px-4 py-4 space-y-4">
        {/* 🔥 EMOJI CHECK */}
        {(() => {
          const isOnlyEmoji = (msg) => {

            // 🔥 ONLY NORMAL TEXT
            if (msg.type !== "TEXT") {
              return false;
            }

            // 🔥 NO STATUS
            if (
              msg.statusMedia ||
              msg.statusCaption ||
              msg.statusId
            ) {
              return false;
            }

            const text =
              msg.content?.trim() || "";

            if (!text) {
              return false;
            }

            // 🔥 ONLY EMOJIS
            const emojiRegex =
              /^(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\s)+$/u;

            return emojiRegex.test(text);
          };

          return groupedMessages.map((msg) => {
            console.log("CHAT MSG:", msg);
            const isMe = Number(msg.senderId) === Number(user?.id);

            const actionMessage =
              msg.type === "MEDIA_GROUP"
                ? msg.medias[0]
                : msg;

            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="flex items-end gap-2 max-w-full">
                  {/* 🔥 GROUP AVATAR */}
                  {chat?.isGroup && !isMe && (
                    <img
                      src={
                        msg.senderAvatar || "https://i.pravatar.cc/150?img=3"
                      }
                      alt={msg.senderName}
                      className="
                  w-8
                  h-8
                  rounded-full
                  object-cover
                  mb-1
                "
                    />
                  )}

                  <div
                    className="relative max-w-full"
                    onMouseEnter={() =>
                      setActiveMessageId(actionMessage.id)
                    }
                    onMouseLeave={() =>
                      setActiveMessageId(null)
                    }
                  >

                    {/* 🔥 MESSAGE CONTENT */}
                    <div
                      className={`
    relative
    w-fit
    max-w-full

    ${isOnlyEmoji(msg)
                          ? "bg-transparent shadow-none p-0"
                          : ""
                        }

    ${!isOnlyEmoji(msg) &&
                          (
                            msg.type === "TEXT" ||
                            msg.type === "STATUS_REPLY" ||
                            msg.type === "STATUS_REACTION"
                          )
                          ? `
        px-3.5
        py-2.5

        shadow-sm
        backdrop-blur-xl

        border

        ${isMe
                            ? `
            bg-[var(--primary)]
            text-black
            border-[var(--primary)]
            rounded-2xl
            rounded-br-md
          `
                            : `
            bg-[var(--card)]
            text-[var(--text)]
            border-[var(--border)]
            rounded-2xl
            rounded-bl-md
          `
                          }
      `
                          : ""
                        }

    ${msg.type === "MEDIA_GROUP" ||
                          msg.type === "IMAGE" ||
                          msg.type === "VIDEO"
                          ? `
        rounded-2xl
        overflow-hidden
      `
                          : ""
                        }

    whitespace-pre-wrap
    break-words
    tracking-[0.1px]

    ${isOnlyEmoji(msg)
                          ? "text-[42px] leading-none"
                          : "text-[13.5px] leading-[1.45]"
                        }
  `}
                      style={{
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                      }}
                    >

                      {msg.deleted ? (
                        <span className="italic opacity-60 text-sm">
                          🚫 This message was deleted
                        </span>
                      ) : (
                        <>

                          {/* 🔥 MEDIA GROUP */}
                          {msg.type === "MEDIA_GROUP" && (
                            <MediaGrid
                              medias={msg.medias}
                              onDelete={() => {
                                deleteForEveryone(actionMessage.id);
                              }}
                            />
                          )}

                          {/* 🔥 IMAGE */}
                          {msg.type === "IMAGE" && (
                            <div className="max-w-[260px] md:max-w-[340px] overflow-hidden rounded-2xl">

                              <img
                                src={msg.content}
                                alt="chat-media"
                                loading="lazy"
                                className="w-full h-[220px] object-cover cursor-pointer hover:scale-[1.02] transition duration-300"
                                onClick={() => window.open(msg.content, "_blank")}
                              />
                            </div>
                          )}

                          {/* 🔥 VIDEO */}
                          {msg.type === "VIDEO" && (
                            <video
                              src={msg.content}
                              controls
                              playsInline
                              className="w-full max-w-[260px] md:max-w-[340px] rounded-2xl object-cover"
                            />
                          )}

                          {/* 🔥 FILE */}
                          {msg.type === "FILE" && (
                            <a
                              href={msg.content}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`
            flex
            items-center
            gap-3

            px-3
            py-3

            rounded-2xl

            transition

            ${isMe
                                  ? "bg-black/10 hover:bg-black/20"
                                  : "bg-[var(--bg)] hover:bg-white/5 border border-[var(--border)]"
                                }
          `}
                            >
                              <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/20 flex items-center justify-center text-lg">
                                📄
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium truncate">
                                  File
                                </p>

                                <p className="text-[11px] opacity-60 truncate">
                                  Tap to open
                                </p>
                              </div>
                            </a>
                          )}

                          {/* 🔥 TEXT */}
                          {msg.type === "TEXT" && (
                            <span>{msg.content}</span>
                          )}

                          {/* 🔥 STATUS REPLY */}
                          {msg.type === "STATUS_REPLY" && (
                            <span>
                              {(msg.content || "").replace(
                                "Reply to your status: ",
                                "",
                              )}
                            </span>
                          )}

                          {/* 🔥 STATUS REACTION */}
                          {msg.type === "STATUS_REACTION" && (
                            <span>
                              {(msg.content || "").replace(
                                " reacted to your status",
                                "",
                              )}
                            </span>
                          )}

                        </>
                      )}
                    </div>

                    {/* 🔥 ACTIONS BELOW MESSAGE */}

                    {!msg.deleted && activeMessageId === actionMessage.id && (
                      <div
                        className={`
                    absolute
                    top-[100%]
                    mt-[2px]

                    z-40
                    flex
                    gap-2

                    ${isMe ? "right-0" : "left-0"}
                  `}
                      >
                        {/* REPLY */}
                        <button
                          aria-label="Reply message"
                          onClick={(e) => {
                            e.stopPropagation();

                            setReplyTo(actionMessage);
                          }}
                          className="
                      w-7
                      h-7

                      rounded-full
                      glass

                      flex
                      items-center
                      justify-center

                      hover:text-[var(--primary)]

                      transition
                    "
                        >
                          <FiCornerUpLeft size={14} />
                        </button>

                        {/* REACTION */}
                        <button
                          aria-label="React message"
                          onClick={(e) => {
                            e.stopPropagation();

                            setReactionMsgId(actionMessage.id);
                          }}
                          className="
                      w-7
                      h-7

                      rounded-full
                      glass

                      flex
                      items-center
                      justify-center

                      hover:text-[var(--primary)]

                      transition
                    "
                        >
                          <FiSmile size={14} />
                        </button>

                        {/* DELETE */}
                        <button
                          aria-label="Delete message"
                          onClick={(e) => {
                            e.stopPropagation();

                            setMessageMenuId(actionMessage.id);
                          }}
                          className="
                      w-7
                      h-7

                      rounded-full
                      glass

                      flex
                      items-center
                      justify-center

                      hover:text-red-400

                      transition
                    "
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    )}

                    {/* 🔥 REACTION PICKER */}
                    {reactionMsgId === actionMessage.id && (
                      <div
                        ref={reactionRef}
                        className={`
                    absolute
                    z-50
                    top-full
                    mt-2

                    glass

                    px-3
                    py-2

                    rounded-2xl

                    flex
                    gap-2

                    shadow-2xl

                    ${isMe ? "right-0" : "left-0"}
                  `}
                      >
                        {emojis.map((e, i) => (
                          <span
                            key={i}
                            onClick={() => {
                              reactToMessage(actionMessage.id, e);

                              setReactionMsgId(null);
                            }}
                            className="
                        cursor-pointer
                        hover:scale-125
                        transition
                      "
                          >
                            {e}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 🔥 DELETE MENU */}
                    {messageMenuId === msg.id && (
                      <div
                        className={`
                    delete-menu

                    absolute
                    z-50

                    top-full
                    mt-2

                    glass

                    rounded-2xl
                    p-2

                    w-52

                    shadow-2xl
                    border
                    border-[var(--border)]

                    ${isMe ? "right-0" : "left-0"}
                  `}
                      >
                        {/* DELETE FOR ME */}
                        <div
                          onClick={() => {
                            deleteForMe(msg.id);

                            setMessageMenuId(null);

                            setActiveMessageId(null);
                          }}
                          className="
                      px-4
                      py-2.5

                      hover:bg-[var(--primary)]/10

                      rounded-xl
                      cursor-pointer

                      text-sm

                      transition
                    "
                        >
                          Delete for me
                        </div>

                        {/* DELETE FOR EVERYONE */}
                        <div
                          onClick={() => {
                            deleteForEveryone(msg.id);

                            setMessageMenuId(null);

                            setActiveMessageId(null);
                          }}
                          className="
                      px-4
                      py-2.5

                      hover:bg-red-500/10

                      text-red-400

                      rounded-xl
                      cursor-pointer

                      text-sm

                      transition
                    "
                        >
                          Delete for everyone
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          });
        })()}

        <div ref={messagesEndRef} />
      </div>

      {/* 🔥 INPUT */}
      <div className="relative p-3 bg-[var(--card)] border-t border-[var(--border)] bottom-0">

        {/* 🔥 REPLY PREVIEW */}
        {replyTo && (
          <div className="mb-2 px-3 py-2 bg-[var(--primary)]/10 rounded-2xl flex justify-between items-center text-sm">
            <div className="truncate flex-1">
              <span className="font-semibold">Replying:</span> {replyTo.content}
            </div>

            <button
              aria-label="Cancel reply"
              onClick={() => setReplyTo(null)}
              className="ml-2 opacity-70 hover:opacity-100"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* 🔥 HIDDEN GALLERY INPUT */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {

            const files = e.target.files;

            if (!files?.length) return;

            handleSendMedia(
              files,
              "IMAGE"
            );

            e.target.value = "";
          }}
        />

        {/* 🔥 HIDDEN VIDEO INPUT */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="video/*"
          multiple
          className="hidden"
          onChange={(e) => {

            const files = e.target.files;

            if (!files?.length) return;

            handleSendMedia(
              files,
              "VIDEO"
            );

            e.target.value = "";
          }}
        />

        {/* 🔥 HIDDEN FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {

            const files = e.target.files;

            if (!files?.length) return;

            handleSendMedia(
              files,
              "FILE"
            );

            e.target.value = "";
          }}
        />

        {/* 🔥 ATTACH MENU */}
        {showAttach && (
          <div className="attach-menu absolute bottom-24 left-4 z-50 w-60 p-2 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl animate-menu">

            <div className="grid grid-cols-3 gap-3">

              {/* 🔥 GALLERY */}
              <button
                type="button"
                onClick={() => {
                  galleryInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                  <FiImage className="text-pink-400 text-xl" />
                </div>

                <span className="text-[11px]">Gallery</span>
              </button>

              {/* 🔥 VIDEO */}
              <button
                type="button"
                onClick={() => {
                  cameraInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <FiVideo className="text-blue-400 text-xl" />
                </div>

                <span className="text-[11px]">Video</span>
              </button>

              {/* 🔥 FILE */}
              <button
                type="button"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <FiPlus className="text-green-400 text-xl" />
                </div>

                <span className="text-[11px]">File</span>
              </button>

            </div>
          </div>
        )}

        {/* 🔥 PREMIUM EMOJI PICKER */}
        {showEmoji && (
          <div
            ref={emojiRef}
            className="fixed left-0 right-0 bottom-0 md:absolute md:left-14 md:right-auto md:bottom-24 z-[999] md:w-[320px] rounded-t-[24px] md:rounded-[24px] overflow-hidden hide-scrollbar border-t md:border border-[var(--border)] shadow-[0_-10px_40px_rgba(0,0,0,0.45)] animate-menu"
            style={{
              background: "var(--card)",
            }}
          >

            {/* 🔥 TOP BAR */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)]">

              <h3 className="text-[13px] font-medium opacity-80">
                Emojis
              </h3>

              <button
                onClick={() => setShowEmoji(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/5 transition"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* 🔥 LIVE INPUT PREVIEW */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(255,255,255,0.05)] overflow-x-auto hide-scrollbar">

              <div className="flex items-center gap-1 text-lg whitespace-nowrap">
                {input}
              </div>
            </div>

            {/* 🔥 EMOJI PICKER */}
            <EmojiPicker
              theme="dark"
              width="100%"
              height={window.innerWidth < 768 ? 240 : 340}
              lazyLoadEmojis
              searchDisabled={false}
              skinTonesDisabled
              previewConfig={{
                showPreview: false,
              }}
              searchPlaceHolder="Search"
              onEmojiClick={(emojiData) => {
                setInput((prev) => prev + emojiData.emoji);

                inputRef.current?.focus();
              }}
              style={{
                background: "var(--card)",
                border: "none",
                borderRadius: window.innerWidth < 768 ? "0px" : "24px",
                boxShadow: "none",
                width: "100%",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "--epr-bg-color": "var(--card)",
                "--epr-category-label-bg-color": "var(--card)",
                "--epr-hover-bg-color": "rgba(255,255,255,0.06)",
                "--epr-focus-bg-color": "rgba(255,255,255,0.08)",
                "--epr-search-input-bg-color": "rgba(255,255,255,0.03)",
                "--epr-search-input-text-color": "var(--text)",
                "--epr-search-border-color": "transparent",
                "--epr-category-icon-active-color": "var(--primary)",
                "--epr-text-color": "var(--text)",
                "--epr-emoji-size": "24px",
                "--epr-emoji-gap": "6px",
              }}
            />
          </div>
        )}

        {/* 🔥 INPUT ROW */}
        <div className="flex items-center gap-2">

          <button
            aria-label="Attach file"
            ref={attachRef}
            onClick={() => setShowAttach((prev) => !prev)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10"
          >
            <FiPlus />
          </button>

          <div className="flex items-center flex-1 px-3 py-2 rounded-full bg-[var(--bg)] border border-[var(--border)] gap-2">

            <FiSmile
              onClick={() => setShowEmoji((prev) => !prev)}
              className="cursor-pointer"
            />

            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();

                  handleSendMessage();
                }
              }}
              placeholder="Message"
              className="flex-1 bg-transparent outline-none text-sm min-w-0"
            />

            <FiCamera className="cursor-pointer shrink-0" />
          </div>

          {input.trim() ? (
            <button
              aria-label="Send message"
              onClick={handleSendMessage}
              className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-black shadow-lg hover:scale-105 transition shrink-0"
            >
              <FiSend />
            </button>
          ) : (
            <button
              aria-label="Record voice"
              onClick={handleMicClick}
              className={`w-11 h-11 rounded-full flex items-center justify-center transition shrink-0 ${isRecording
                ? "bg-[var(--primary)] text-black"
                : "border border-[var(--border)] hover:bg-[var(--primary)]/20"
                }`}
            >
              <FiMic />
            </button>
          )}
        </div>
      </div>

      {/* 🔥 ADD MEMBERS MODAL */}
      {showAddMembersModal && (
        <AddMembersModal
          group={groupDetails || chat}
          onClose={() => setShowAddMembersModal(false)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
