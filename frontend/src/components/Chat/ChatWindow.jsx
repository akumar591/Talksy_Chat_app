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
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useSettings } from "../../context/SettingsContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

const ChatWindow = ({ chat, onBack }) => {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { chatStyle } = useSettings();

  const {
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
  } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [input, setInput] = useState("");

  const [showAttach, setShowAttach] = useState(false);

  const [showEmoji, setShowEmoji] = useState(false);

  const [showMenu, setShowMenu] = useState(false);

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

  // ===============================
  // 🔥 EMOJIS
  // ===============================
  const emojis = ["😀", "😂", "😍", "😎", "😢", "🔥", "❤️", "👍", "🎉"];

  // ===============================
  // 🔥 SORT MESSAGES
  // ===============================
  const sortedMessages = useMemo(() => {
    return [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );
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
  }, [sortedMessages]);

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
      if (attachRef.current && !attachRef.current.contains(e.target)) {
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
            onClick={() => navigate(`/user/${chat.id}`)}
            className="flex items-center gap-3 cursor-pointer min-w-0"
          >
            <div className="relative shrink-0">
              <img
                src={chat.avatar || "/default-avatar.png"}
                alt={chat.name}
                className="w-11 h-11 rounded-full object-cover"
              />

              {chat.online && (
                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    w-3
                    h-3
                    bg-green-500
                    rounded-full
                    border-2
                    border-[var(--bg)]
                  "
                />
              )}
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold truncate">{chat.name}</h2>

              <p className="text-xs opacity-60 truncate">
                {isRecording
                  ? "Recording..."
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
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-[var(--primary)]/10
              transition
            "
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
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              hover:bg-[var(--primary)]/10
              transition
            "
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
              className="
                w-10
                h-10
                rounded-full
                flex
                items-center
                justify-center
                hover:bg-[var(--primary)]/10
                transition
              "
            >
              <FiMoreVertical />
            </button>

            {showMenu && (
              <div
                className="
                  absolute
                  right-0
                  mt-2
                  w-56
                  glass
                  rounded-2xl
                  p-2
                  z-50
                  shadow-2xl
                  border
                  border-[var(--border)]
                "
              >
                <div
                  onClick={() => {
                    navigate(`/user/${chat.id}`);

                    setShowMenu(false);
                  }}
                  className="
                    px-3
                    py-2.5
                    hover:bg-[var(--primary)]/10
                    rounded-xl
                    flex
                    gap-3
                    cursor-pointer
                    transition
                  "
                >
                  <FiUser />
                  Profile
                </div>

                <div
                  onClick={() => {
                    navigate(`/media/${chat.id}`);

                    setShowMenu(false);
                  }}
                  className="
                    px-3
                    py-2.5
                    hover:bg-[var(--primary)]/10
                    rounded-xl
                    flex
                    gap-3
                    cursor-pointer
                    transition
                  "
                >
                  <FiImage />
                  Media
                </div>

                <div className="border-t border-[var(--border)] my-2"></div>

                <div
                  onClick={handleClearChat}
                  className="
                    flex
                    items-center
                    gap-3
                    px-3
                    py-2.5
                    rounded-xl
                    cursor-pointer
                    text-red-400
                    hover:bg-red-500/10
                    transition
                  "
                >
                  <FiTrash2 />
                  Clear chat
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🔥 MESSAGES */}
      {/* 🔥 MESSAGES */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 space-y-4">
        {sortedMessages.map((msg) => {
          const isMe = Number(msg.senderId) === Number(user?.id);

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="relative max-w-full pb-3">
                {/* 🔥 ACTIONS */}
                {!msg.deleted && activeMessageId === msg.id && (
                  <div
                    className={`
                  absolute
                  -top-9
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

                        setReplyTo(msg);
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

                        setReactionMsgId(msg.id);
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

                        setMessageMenuId(msg.id);
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

                {/* 🔥 MESSAGE */}
                <div
                  onClick={() =>
                    setActiveMessageId(
                      activeMessageId === msg.id ? null : msg.id,
                    )
                  }
                  className={`
              relative

              px-3
              py-1.5

              w-fit
              max-w-[320px]
              md:max-w-[480px]

              overflow-visible
              pb-3

              rounded-[20px]

              shadow-sm
              transition-all
              duration-200

              cursor-pointer

              ${
                isMe
                  ? `
                    bg-[var(--primary)]
                    text-black
                    rounded-br-md
                  `
                  : `
                    bg-[var(--card)]
                    text-[var(--text)]
                    rounded-bl-md
                    border
                    border-[var(--border)]
                  `
              }

              hover:shadow-lg
            `}
                >
                  {/* 🔥 REPLY */}
                  {msg.replyTo && (
                    <div
                      className={`
                  mb-1.5
                  px-2.5
                  py-1.5

                  rounded-xl

                  text-[11px]

                  border-l-[3px]

                  ${
                    isMe
                      ? `
                        bg-black/10
                        border-black/30
                      `
                      : `
                        bg-[var(--primary)]/10
                        border-[var(--primary)]
                      `
                  }
                `}
                    >
                      <p className="font-medium opacity-70 mb-0.5">Reply</p>

                      <p className="truncate opacity-80">
                        {msg.replyTo.content}
                      </p>
                    </div>
                  )}

                  {/* 🔥 TEXT */}
                  <div
                    className="
                w-full
                max-w-full

                text-[13.5px]
                leading-[1.3]

                whitespace-pre-wrap
                break-words
                break-all

                tracking-[0.1px]
              "
                    style={{
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.deleted ? "🚫 This message was deleted" : msg.content}
                  </div>

                  {/* 🔥 FOOTER */}
                  <div className="flex items-center justify-end gap-1 mt-0.5">
                    <span
                      className={`
                  text-[9px]
                  tracking-wide

                  ${isMe ? "text-black/70" : "text-[var(--text)]/50"}
                `}
                    >
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  {/* 🔥 REACTIONS */}
                  {msg.reactions?.length > 0 && (
                    <div
                      className="
                  absolute
                  -bottom-3

                  left-2

                  flex
                  items-center
                  gap-1

                  px-2
                  py-[2px]

                  rounded-full

                  bg-[var(--bg)]

                  border
                  border-[var(--border)]

                  shadow-md
                  z-20
                "
                    >
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="text-[11px]">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔥 REACTION PICKER */}
                {reactionMsgId === msg.id && (
                  <div
                    ref={reactionRef}
                    className={`
                absolute
                z-50
                -top-14

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
                          reactToMessage(msg.id, e);

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
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* 🔥 INPUT */}
      <div className="p-3 bg-[var(--card)] border-t border-[var(--border)] sticky bottom-0">
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
              className={`w-11 h-11 rounded-full flex items-center justify-center transition shrink-0 ${
                isRecording
                  ? "bg-[var(--primary)] text-black"
                  : "border border-[var(--border)] hover:bg-[var(--primary)]/20"
              }`}
            >
              <FiMic />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
