import { useState, useRef, useEffect } from "react";
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
  FiBellOff,
  FiTrash2,
  FiImage,
  FiLock,
  FiCornerUpLeft,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext"; // 🔥 NEW

const ChatWindow = ({ chat, onBack }) => {
  const navigate = useNavigate();

  const { chatStyle } = useSettings(); // 🔥 NEW

  const [messages, setMessages] = useState([
    { id: 1, text: "Hello 👋", sender: "other" },
    { id: 2, text: "Hi bro!", sender: "me" },
  ]);

  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [reactionMsgId, setReactionMsgId] = useState(null);

  const [isRecording, setIsRecording] = useState(false);

  const menuRef = useRef(null);
  const emojiRef = useRef(null);
  const attachRef = useRef(null);

  const emojis = ["😀", "😂", "😍", "😎", "😢", "🔥", "❤️", "👍", "🎉"];

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: input,
        sender: "me",
        replyTo,
      },
    ]);

    setInput("");
    setReplyTo(null);
  };

  const handleMicClick = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), text: "🎤 Voice message", sender: "me" },
      ]);
    }, 2000);
  };

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setShowMenu(false);
      if (emojiRef.current && !emojiRef.current.contains(e.target))
        setShowEmoji(false);
      if (attachRef.current && !attachRef.current.contains(e.target))
        setShowAttach(false);
      setReactionMsgId(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!chat) {
    return (
      <div className="hidden md:flex items-center justify-center h-full w-full">
        <div className="glass p-8 rounded-2xl text-center max-w-sm">
          <div className="text-4xl mb-3">💬</div>
          <h2 className="text-xl font-semibold mb-2">Welcome to Chat App</h2>
          <p className="opacity-60 text-sm">
            Select a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[var(--bg)] text-[var(--text)]">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden text-xl">
            ←
          </button>
          <img src={chat.avatar} className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            <p className="text-xs opacity-60">
              {isRecording ? "Recording..." : "online"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xl icon">
          <FiVideo
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
            className="cursor-pointer hover:text-[var(--primary)]"
          />

          <FiPhone
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
            className="cursor-pointer hover:text-[var(--primary)]"
          />

          <div ref={menuRef} className="relative">
            <FiMoreVertical
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu((prev) => !prev);
              }}
              className="cursor-pointer hover:text-[var(--primary)]"
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 glass rounded-xl p-2 z-50">
                <div onClick={() => {navigate(`/user/${chat.id}`); setShowMenu(false);}} className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded flex gap-2 cursor-pointer">
                  <FiUser /> Profile
                </div>
                <div onClick={() => navigate(`/media/${chat.id}`)} className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded flex gap-2 cursor-pointer">
                  <FiImage /> Media
                </div>
                <div className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded flex gap-2 cursor-pointer">
                  <FiBellOff /> Mute
                </div>
                <div className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded flex gap-2 cursor-pointer">
                  <FiLock /> Block
                </div>
                <div className="border-t my-1"></div>
                <div onClick={() => setMessages([])} className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg cursor-pointer text-red-400 hover:bg-red-500/10 transition">
                  <FiTrash2 className="text-sm" />
                  <span>Clear chat</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
            <div
              className={`relative px-4 py-2 max-w-[70%] group
              ${msg.sender === "me" ? "bg-[var(--primary)] text-black" : "bg-[var(--card)]"}
              ${
                chatStyle === "Rounded"
                  ? "chat-rounded"
                  : chatStyle === "Sharp"
                  ? "chat-sharp"
                  : "chat-glass"
              }`}
            >
              {msg.replyTo && (
                <div className="text-xs opacity-60 mb-1 border-l-2 pl-2 border-[var(--primary)]">
                  {msg.replyTo.text}
                </div>
              )}

              {msg.text}

              <div className={`absolute -bottom-8 ${msg.sender === "me" ? "right-0" : "left-0"} hidden group-hover:flex gap-2 glass px-2 py-1 rounded-lg shadow z-40`}>
                <button onClick={() => setReplyTo(msg)} className="text-[var(--text)] hover:text-[var(--primary)]">
                  <FiCornerUpLeft />
                </button>
                <button onClick={() => setReactionMsgId(msg.id)} className="flex items-center justify-center w-7 h-7 rounded-full hover:bg-[var(--primary)]/20 transition text-[var(--text)]">
                  <FiSmile />
                </button>
              </div>

              {reactionMsgId === msg.id && (
                <div className={`absolute -bottom-16 ${msg.sender === "me" ? "right-0" : "left-0"} glass px-2 py-1 rounded-lg flex gap-1 shadow z-50`}>
                  {emojis.map((e, i) => (
                    <span key={i} onClick={() => {
                      setMessages((prev) =>
                        prev.map((m) =>
                          m.id === msg.id ? { ...m, reaction: e } : m,
                        ),
                      );
                      setReactionMsgId(null);
                    }} className="cursor-pointer hover:scale-110 transition">
                      {e}
                    </span>
                  ))}
                </div>
              )}

              {msg.reaction && <div className="text-xs mt-1">{msg.reaction}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT (UNCHANGED) */}
      <div className="p-3 bg-[var(--card)] sticky bottom-0">
        {replyTo && (
          <div className="mb-2 px-3 py-1 bg-[var(--primary)]/10 rounded flex justify-between text-sm">
            <span>Replying: {replyTo.text}</span>
            <button onClick={() => setReplyTo(null)}>✕</button>
          </div>
        )}

        {showEmoji && (
          <div ref={emojiRef} className="absolute bottom-16 left-10 w-56 glass p-2 rounded-xl flex flex-wrap gap-2 z-50">
            {emojis.map((e, i) => (
              <span key={i} onClick={() => setInput(input + e)} className="cursor-pointer">
                {e}
              </span>
            ))}
          </div>
        )}

        {showAttach && (
          <div ref={attachRef} className="absolute bottom-16 left-3 glass p-2 rounded-xl z-50">
            <div className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded">📷 Photo</div>
            <div className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded">📄 Document</div>
            <div className="px-3 py-2 hover:bg-[var(--primary)]/10 rounded">📍 Location</div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); setShowAttach((prev) => !prev); }}>
            <FiPlus />
          </button>

          <div className="flex items-center flex-1 px-3 py-2 rounded-full input gap-2">
            <FiSmile onClick={(e) => { e.stopPropagation(); setShowEmoji((prev) => !prev); }} />
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message" className="flex-1 bg-transparent outline-none" />
            <FiCamera />
          </div>

          {input ? (
            <button onClick={sendMessage} className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-black">
              <FiSend />
            </button>
          ) : (
            <button onClick={handleMicClick} className={`w-10 h-10 rounded-full flex items-center justify-center ${isRecording ? "bg-[var(--primary)] text-black" : "border border-[var(--border)] hover:bg-[var(--primary)]/20"}`}>
              <FiMic />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;