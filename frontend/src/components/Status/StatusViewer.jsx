import { useEffect, useState, useRef } from "react";
import {
  FiX,
  FiSend,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { IoMdShare } from "react-icons/io";

const StatusViewer = ({ statuses = [], currentIndex = 0, setIndex, onClose }) => {
  const status = statuses[currentIndex];

  const [progress, setProgress] = useState(0);
  const [reply, setReply] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const menuRef = useRef();

  // 🔥 PREMIUM REACTIONS
  const reactions = [
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/2764.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f602.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f621.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f62d.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f914.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f44d.svg",
    "https://cdn.jsdelivr.net/gh/twitter/twemoji/assets/svg/1f44e.svg",
  ];

  if (!status) return null;

  // 🔥 AUTO NEXT
  useEffect(() => {
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => prev + 0.33);
    }, 100);

    const timeout = setTimeout(() => {
      nextStatus();
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [currentIndex]);

  const nextStatus = () => {
    if (currentIndex < statuses.length - 1) {
      setIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const prevStatus = () => {
    if (currentIndex > 0) {
      setIndex(currentIndex - 1);
    }
  };

  // 🔥 CLOSE MENU
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[var(--bg)]">

      {/* MAIN VIEW */}
      <div
        className="
          relative
          w-full h-full

          md:w-[330px] md:h-[580px]
          lg:w-[360px] lg:h-[630px]

          md:aspect-[9/16]
          md:rounded-2xl

          overflow-hidden md:shadow-2xl
        "
      >

        {/* MEDIA */}
        {status.type === "image" ? (
          <img src={status.media} className="w-full h-full object-cover" />
        ) : (
          <video
            src={status.media}
            autoPlay
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* TOP BAR */}
        <div className="absolute z-20 top-0 left-0 w-full px-3 pt-3 pb-2 backdrop-blur-md bg-black/20">

          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-[var(--primary)]"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-white">

            <img src={status.avatar} className="w-8 h-8 rounded-full" />

            <div className="flex-1">
              <p className="text-sm font-medium">{status.name}</p>
              <p className="text-[10px] opacity-80">{status.time}</p>
            </div>

            <IoMdShare className="text-lg cursor-pointer" />

            <div ref={menuRef} className="relative">
              <FiMoreVertical onClick={() => setShowMenu(!showMenu)} />

              {showMenu && (
                <div className="absolute right-0 top-8 w-40 glass rounded-lg shadow-lg text-sm z-50">
                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10">Mute</div>
                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10">Report</div>
                  <div className="px-3 py-2 text-red-400">Block</div>
                </div>
              )}
            </div>

            <FiX onClick={onClose} className="cursor-pointer" />
          </div>
        </div>

        {/* ❤️ RIGHT SIDE BUTTON */}
        <div className="absolute z-20 bottom-20 right-4 flex justify-end">

          <div className="relative">

            <img
              src={reactions[0]}
              onClick={() => setShowReactions(!showReactions)}
              className="w-6 h-6 cursor-pointer hover:scale-125 transition"
            />

            {/* POPUP CENTER */}
            {showReactions && (
              <div
                className="
                  fixed bottom-28 left-1/2 -translate-x-1/2
                  flex gap-2 px-3 py-2
                  rounded-full
                  backdrop-blur-md
                  bg-[var(--card)]/80
                  border border-[var(--border)]
                  shadow-lg
                  z-[999]
                "
              >
                {reactions.map((r, i) => (
                  <img
                    key={i}
                    src={r}
                    onClick={() => setShowReactions(false)}
                    className="w-7 h-7 cursor-pointer hover:scale-125 transition"
                  />
                ))}
              </div>
            )}

          </div>

        </div>

        {/* REPLY */}
        <div className="absolute z-20 bottom-3 left-0 w-full px-3">
          <div className="flex items-center gap-2 backdrop-blur-md bg-black/30 px-3 py-2 rounded-full border border-white/10">

            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Reply..."
              className="flex-1 bg-transparent outline-none text-sm text-white"
            />

            <FiSend className="text-white cursor-pointer" />
          </div>
        </div>

      </div>

      {/* ARROWS */}
      <button
        onClick={prevStatus}
        className="
          hidden md:flex
          absolute left-4
          items-center justify-center
          w-10 h-10
          rounded-full
          backdrop-blur-md
          bg-[var(--card)]/60
          border border-[var(--border)]
          text-[var(--text)]
          text-xl
          z-50
          hover:scale-110 hover:bg-[var(--primary)]/20 transition
        "
      >
        <FiChevronLeft />
      </button>

      <button
        onClick={nextStatus}
        className="
          hidden md:flex
          absolute right-4
          items-center justify-center
          w-10 h-10
          rounded-full
          backdrop-blur-md
          bg-[var(--card)]/60
          border border-[var(--border)]
          text-[var(--text)]
          text-xl
          z-50
          hover:scale-110 hover:bg-[var(--primary)]/20 transition
        "
      >
        <FiChevronRight />
      </button>

    </div>
  );
};

export default StatusViewer;