import {
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";

import {
  FiX,
  FiSend,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiTrash2,
} from "react-icons/fi";

import { IoMdShare } from "react-icons/io";

import { HiOutlineFaceSmile } from "react-icons/hi2";

import toast from "react-hot-toast";

import { useStatus } from "../../context/StatusContext";

const StatusViewer = ({
  statuses = [],
  currentIndex = 0,
  setIndex,
  onClose,
  isOwnStatus = false,
}) => {

  // ===============================
  // 🔥 STATUS CONTEXT
  // ===============================
  const {
    markViewed,
    deleteStatus,
    getStatusViewers,
    reactToStatus,
    replyToStatus,
  } = useStatus();

  // ===============================
  // 🔥 CURRENT STATUS
  // ===============================
  const status =
    statuses?.[currentIndex];

  // ===============================
  // 🔥 STATES
  // ===============================
  const [progress, setProgress] =
    useState(0);

  const [reply, setReply] =
    useState("");

  const [showMenu, setShowMenu] =
    useState(false);

  const [showReactions, setShowReactions] =
    useState(false);

  const [showViews, setShowViews] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [viewers, setViewers] =
    useState([]);

  const [loadingViewers, setLoadingViewers] =
    useState(false);

  const [sendingReply, setSendingReply] =
    useState(false);

  // 🔥 NEW
  const [isPaused, setIsPaused] =
    useState(false);

  const [isTyping, setIsTyping] =
    useState(false);

  const menuRef = useRef();

  // ===============================
  // 🔥 REACTIONS
  // ===============================
  const reactions =
    useMemo(
      () => [
        "❤️",
        "🔥",
        "😍",
        "😂",
        "😮",
        "👏",
      ],
      []
    );

  // ===============================
  // 🔥 SAFE
  // ===============================
  if (!status) return null;

  // ===============================
  // 🔥 TYPE
  // ===============================
  const statusType =
    String(
      status?.type || ""
    ).toUpperCase();

  const isImage =
    statusType === "IMAGE";

  const isVideo =
    statusType === "VIDEO";

  const isText =
    statusType === "TEXT";

  // ===============================
  // 🔥 MARK VIEWED
  // ===============================
  useEffect(() => {

    if (
      !status?.id ||
      isOwnStatus
    ) return;

    markViewed(status.id);

  }, [
    status?.id,
    markViewed,
    isOwnStatus,
  ]);

  // ===============================
  // 🔥 AUTO NEXT
  // ===============================
  useEffect(() => {

    if (
      isPaused ||
      isTyping ||
      showReactions ||
      showViews ||
      sendingReply
    ) {
      return;
    }

    setProgress(0);

    const duration =
      isVideo
        ? 15000
        : 10000;

    const interval =
      setInterval(() => {

        setProgress((prev) => {

          if (prev >= 100) {

            clearInterval(interval);

            nextStatus();

            return 100;
          }

          return prev + 1;

        });

      }, duration / 100);

    return () =>
      clearInterval(interval);

  }, [
    currentIndex,
    isVideo,
    isPaused,
    isTyping,
    showReactions,
    showViews,
    sendingReply,
  ]);

  // ===============================
  // 🔥 CLOSE MENU
  // ===============================
  useEffect(() => {

    const handler = (e) => {

      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target
        )
      ) {

        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );

  }, []);

  // ===============================
  // 🔥 NEXT
  // ===============================
  const nextStatus = () => {

    if (
      currentIndex <
      statuses.length - 1
    ) {

      setIndex(
        currentIndex + 1
      );

    } else {

      onClose();
    }
  };

  // ===============================
  // 🔥 PREV
  // ===============================
  const prevStatus = () => {

    if (currentIndex > 0) {

      setIndex(
        currentIndex - 1
      );
    }
  };

  // ===============================
  // 🔥 DELETE
  // ===============================
  const handleDelete =
    async () => {

      try {

        if (
          !status?.id ||
          deleting
        ) return;

        setDeleting(true);

        const ok =
          await deleteStatus(
            status.id
          );

        if (!ok) {

          toast.error(
            "Delete failed"
          );

          return;
        }

        if (
          statuses.length <= 1
        ) {

          onClose();

          return;
        }

        if (
          currentIndex >=
          statuses.length - 1
        ) {

          setIndex(
            currentIndex - 1
          );

        } else {

          nextStatus();
        }

      } catch (err) {

        console.log(err);

      } finally {

        setDeleting(false);
      }
    };

  // ===============================
  // 🔥 VIEWERS
  // ===============================
  const handleViewers =
    async () => {

      try {

        if (
          !status?.id
        ) return;

        if (showViews) {

          setShowViews(false);

          setIsPaused(false);

          return;
        }

        setLoadingViewers(true);

        const data =
          await getStatusViewers(
            status.id
          );

        setViewers(
          data || []
        );

        setShowViews(true);

        setIsPaused(true);

      } catch (err) {

        console.log(err);

      } finally {

        setLoadingViewers(false);
      }
    };

  // ===============================
  // 🔥 REACTION
  // ===============================
  const handleReaction =
    async (
      reaction
    ) => {

      try {

        const ok =
          await reactToStatus(
            status.id,
            reaction,
            status
          );

        if (!ok) return;

        setShowReactions(false);

        setIsPaused(false);

      } catch (err) {

        console.log(err);
      }
    };

  // ===============================
  // 🔥 REPLY
  // ===============================
  const handleReply =
    async () => {

      try {

        if (
          !reply.trim()
        ) return;

        setSendingReply(true);

        const ok =
          await replyToStatus(
            status.id,
            reply,
            status
          );

        if (!ok) return;

        setReply("");

        setIsTyping(false);

        nextStatus();

      } catch (err) {

        console.log(err);

      } finally {

        setSendingReply(false);
      }
    };

  // ===============================
  // 🔥 UNIQUE VIEW COUNT
  // ===============================
  const uniqueViewCount =
    [...new Set(
      viewers.map(
        (viewer) => viewer.id
      )
    )].length;

  return (
    <div className="relative w-full h-screen flex items-center justify-center bg-[var(--bg)]">

      {/* 🔥 MAIN */}
      <div className="relative w-full h-screen md:mt-20 lg:mt-24 md:w-[320px] md:h-[600px] lg:w-[350px] lg:h-[650px] md:rounded-[28px] overflow-hidden bg-black md:shadow-2xl">

        {/* 🔥 IMAGE */}
        {isImage && (
          <img
            src={status.media}
            alt="status"
            className="w-full h-full object-cover"
          />
        )}

        {/* 🔥 VIDEO */}
        {isVideo && (
          <video
            src={status.media}
            autoPlay
            playsInline
            controls
            className="w-full h-full object-cover"
          />
        )}

        {/* 🔥 TEXT */}
        {isText && (
          <div className="w-full h-full flex items-center justify-center px-8 bg-gradient-to-br from-[var(--primary)] via-purple-500 to-blue-600">

            <p className="text-white text-[26px] font-semibold text-center leading-relaxed">
              {status.caption}
            </p>

          </div>
        )}

        {/* 🔥 OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70 z-10" />

        {/* 🔥 CLICK */}
        <div
          onClick={prevStatus}
          className="absolute left-0 top-0 w-1/2 h-full z-20"
        />

        <div
          onClick={nextStatus}
          className="absolute right-0 top-0 w-1/2 h-full z-20"
        />

        {/* 🔥 TOP */}
        <div className="absolute z-30 top-0 left-0 w-full px-3 pt-2 pb-1">

          {/* 🔥 PROGRESS */}
          <div className="flex items-center gap-1 mb-3">

            {statuses.map((_, i) => (

              <div
                key={i}
                className="flex-1 h-[3px] bg-white/20 rounded-full overflow-hidden"
              >

                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width:
                      i < currentIndex
                        ? "100%"
                        : i === currentIndex
                          ? `${progress}%`
                          : "0%",
                  }}
                />

              </div>
            ))}

          </div>

          {/* 🔥 USER */}
          <div className="flex items-center gap-3 text-white">

            <img
              src={
                status.avatar ||
                "https://i.pravatar.cc/150?img=10"
              }
              alt={status.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold truncate">
                {status.name}
              </p>

              <p className="text-[11px] opacity-70">
                {status.time}
              </p>

            </div>

            {!isOwnStatus && (
              <button className="w-9 h-9 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 text-white">

                <IoMdShare className="text-lg" />

              </button>
            )}

            {/* 🔥 MENU */}
            <div
              ref={menuRef}
              className="relative z-50"
            >

              <button
                onClick={() =>
                  setShowMenu(!showMenu)
                }
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 text-white"
              >

                <FiMoreVertical />

              </button>

              {showMenu && (
                <div className="absolute right-0 top-12 w-52 rounded-2xl bg-[var(--card)]/95 backdrop-blur-xl border border-[var(--border)] shadow-2xl overflow-hidden">

                  {!isOwnStatus && (
                    <>
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--primary)]/10 transition">
                        Mute Status
                      </button>

                      <button className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition">
                        Report Status
                      </button>
                    </>
                  )}

                  {isOwnStatus && (
                    <>
                      <button className="w-full text-left px-4 py-3 text-sm hover:bg-[var(--primary)]/10 transition">
                        Hide Status From...
                      </button>

                      <button
                        onClick={
                          handleDelete
                        }
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition flex items-center gap-3"
                      >

                        <FiTrash2 />

                        {deleting
                          ? "Deleting..."
                          : "Delete Status"}

                      </button>
                    </>
                  )}

                </div>
              )}

            </div>

            {/* 🔥 CLOSE */}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full flex items-center justify-center bg-black/30 backdrop-blur-md border border-white/10 text-white"
            >

              <FiX />

            </button>

          </div>

        </div>

        {/* 🔥 CAPTION */}
        {status.caption && !isText && (

          <div className="absolute bottom-[64px] left-0 w-full z-30 px-4 flex justify-center">

            {isOwnStatus ? (

              <div className="w-full max-w-[88%] flex items-end gap-2">

                <div className="flex-1 min-w-0 px-3 py-1 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10">

                  <p className="text-white text-[13px] sm:text-[14px] leading-relaxed break-words">
                    {status.caption}
                  </p>

                </div>

                <div className="relative shrink-0">

                  <button
                    onClick={
                      handleViewers
                    }
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
                  >

                    <FiEye className="text-white text-[18px]" />

                  </button>

                </div>

              </div>

            ) : (

              <div className="w-full max-w-[88%] flex items-end gap-2">

                <div className="flex-1 min-w-0 px-3 py-1 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10">

                  <p className="text-white text-[13px] sm:text-[14px] leading-relaxed break-words">
                    {status.caption}
                  </p>

                </div>

                <div className="relative shrink-0">

                  <button
                    onClick={() => {

                      setShowReactions(
                        !showReactions
                      );

                      setIsPaused(
                        !showReactions
                      );
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg"
                  >

                    <HiOutlineFaceSmile className="text-white text-[18px]" />

                  </button>

                  {showReactions && (
                    <div className="absolute bottom-12 right-0 flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/45 backdrop-blur-xl border border-white/10 shadow-2xl">

                      {reactions.map(
                        (r, i) => (

                          <button
                            key={i}
                            onClick={() =>
                              handleReaction(r)
                            }
                            className="text-[18px] hover:scale-125 transition"
                          >
                            {r}
                          </button>
                        )
                      )}

                    </div>
                  )}

                </div>

              </div>
            )}

          </div>
        )}

        {/* 🔥 VIEWERS SHEET */}
        {showViews && isOwnStatus && (
          <div className="absolute bottom-0 left-0 w-full h-[42%] z-50 bg-black/80 backdrop-blur-2xl border-t border-white/10 rounded-t-[28px] overflow-hidden">

            <div className="sticky top-0 bg-black/60 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">

              <div>

                <p className="text-white text-sm font-semibold">
                  Viewed By
                </p>

                <p className="text-white/50 text-xs">
                  {uniqueViewCount} views
                </p>

              </div>

              <button
                onClick={() => {

                  setShowViews(false);

                  setIsPaused(false);
                }}
                className="text-white text-lg"
              >

                <FiX />

              </button>

            </div>

            <div className="overflow-y-auto h-[calc(100%-70px)] pb-20">

              {loadingViewers ? (

                <div className="py-10 text-center text-white/60 text-sm">
                  Loading...
                </div>

              ) : viewers.length === 0 ? (

                <div className="py-10 text-center text-white/60 text-sm">
                  No views yet
                </div>

              ) : (

                [...new Map(
                  viewers.map((viewer) => [
                    viewer.id,
                    viewer
                  ])
                ).values()].map(
                  (viewer, index) => (

                    <div
                      key={`${viewer.id}-${index}`}
                      className="flex items-center gap-3 px-4 py-3 border-b border-white/5"
                    >

                      <img
                        src={
                          viewer.avatar ||
                          "https://i.pravatar.cc/150?img=11"
                        }
                        alt={
                          viewer.name
                        }
                        className="w-11 h-11 rounded-full object-cover"
                      />

                      <div className="flex-1 min-w-0">

                        <p className="text-white text-sm truncate">
                          {
                            viewer.name ||
                            "Unknown User"
                          }
                        </p>

                        <div className="flex items-center gap-2">

                          <p className="text-white/50 text-xs">
                            Viewed your status
                          </p>

                          {viewer.reaction && (
                            <span className="text-sm">
                              {viewer.reaction}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>
                  )
                )
              )}

            </div>

          </div>
        )}

        {/* 🔥 REPLY */}
        {!isOwnStatus && (
          <div className="absolute z-40 bottom-3 left-0 w-full px-4">

            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/35 backdrop-blur-xl border border-white/10">

              <input
                value={reply}
                onFocus={() =>
                  setIsTyping(true)
                }
                onBlur={() =>
                  setIsTyping(false)
                }
                onChange={(e) => {

                  setReply(
                    e.target.value
                  );

                  setIsTyping(
                    e.target.value
                      .trim()
                      .length > 0
                  );
                }}
                placeholder="Reply privately..."
                className="flex-1 bg-transparent outline-none text-[13px] text-white placeholder:text-white/45"
              />

              <button
                onClick={
                  handleReply
                }
                disabled={
                  sendingReply
                }
                className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--primary)] text-white shrink-0"
              >

                <FiSend className="text-sm" />

              </button>

            </div>

          </div>
        )}

      </div>

      {/* 🔥 LEFT */}
      <button
        onClick={prevStatus}
        className="hidden md:flex absolute left-4 items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl bg-[var(--card)]/70 border border-[var(--border)] text-[var(--text)] text-xl z-50 hover:scale-110 hover:bg-[var(--primary)]/20 transition"
      >

        <FiChevronLeft />

      </button>

      {/* 🔥 RIGHT */}
      <button
        onClick={nextStatus}
        className="hidden md:flex absolute right-4 items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl bg-[var(--card)]/70 border border-[var(--border)] text-[var(--text)] text-xl z-50 hover:scale-110 hover:bg-[var(--primary)]/20 transition"
      >

        <FiChevronRight />

      </button>

    </div>
  );
};

export default StatusViewer;