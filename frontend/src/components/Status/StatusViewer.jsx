import { useEffect, useState, useRef } from "react";

import {
  FiX,
  FiSend,
  FiMoreVertical,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";

import { IoMdShare } from "react-icons/io";

const StatusViewer = ({
  statuses = [],
  currentIndex = 0,
  setIndex,
  onClose,
}) => {

  const status = statuses[currentIndex];

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

  const menuRef = useRef();

  // 🔥 REACTIONS
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

    const duration = 10000;

    const interval = setInterval(() => {

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

  }, [currentIndex]);

  // 🔥 NEXT
  const nextStatus = () => {

    if (
      currentIndex <
      statuses.length - 1
    ) {

      setIndex(currentIndex + 1);

    } else {

      onClose();
    }

  };

  // 🔥 PREV
  const prevStatus = () => {

    if (currentIndex > 0) {

      setIndex(currentIndex - 1);
    }

  };

  // 🔥 CLOSE MENU
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

  return (
    <div
      className="
        relative
        w-full
        h-screen

        flex
        items-center
        justify-center

        bg-[var(--bg)]
      "
    >

      {/* 🔥 MAIN FRAME */}
      <div
        className="
          relative

          w-full
          h-screen

          md:mt-20
          lg:mt-24

          md:w-[330px]
          md:h-[580px]

          lg:w-[360px]
          lg:h-[630px]

          md:rounded-2xl
          overflow-hidden

          bg-black
          md:shadow-2xl
        "
      >

        {/* 🔥 MEDIA */}
        {status.type ===
        "image" ? (
          <img
            src={status.media}
            className="
              w-full h-full
              object-cover
            "
          />
        ) : (
          <video
            src={status.media}
            autoPlay
            muted
            controls={false}
            className="
              w-full h-full
              object-cover
            "
          />
        )}

        {/* 🔥 OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-black/20
            z-10
          "
        />

        {/* 🔥 CLICK AREA */}
        <div
          onClick={prevStatus}
          className="
            absolute
            left-0 top-0
            w-1/2 h-full
            z-20
          "
        />

        <div
          onClick={nextStatus}
          className="
            absolute
            right-0 top-0
            w-1/2 h-full
            z-20
          "
        />

        {/* 🔥 TOP */}
        <div
          className="
            absolute
            z-30
            top-0 left-0

            w-full

            px-3 pt-3 pb-2

            backdrop-blur-md
            bg-black/20
          "
        >

          {/* 🔥 PROGRESS */}
          <div
            className="
              w-full h-1
              bg-white/20
              rounded-full
              overflow-hidden
              mb-3
            "
          >

            <div
              className="
                h-full
                bg-[var(--primary)]
                transition-all
                duration-100
              "
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          {/* 🔥 USER */}
          <div
            className="
              flex items-center
              gap-2
              text-white
            "
          >

            <img
              src={status.avatar}
              className="
                w-8 h-8
                rounded-full
                object-cover
              "
            />

            <div className="flex-1">

              <p className="text-sm font-medium">
                {status.name}
              </p>

              <p className="text-[10px] opacity-80">
                {status.time}
              </p>

            </div>

            {/* SHARE */}
            <IoMdShare className="text-lg cursor-pointer" />

            {/* MENU */}
            <div
              ref={menuRef}
              className="relative"
            >

              <FiMoreVertical
                onClick={() =>
                  setShowMenu(
                    !showMenu
                  )
                }
                className="
                  cursor-pointer
                "
              />

              {showMenu && (
                <div
                  className="
                    absolute
                    right-0 top-8

                    w-40

                    bg-[var(--card)]

                    border
                    border-[var(--border)]

                    rounded-lg

                    shadow-lg

                    text-sm

                    overflow-hidden

                    z-50
                  "
                >

                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10 cursor-pointer">
                    Mute
                  </div>

                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10 cursor-pointer">
                    Report
                  </div>

                  <div className="px-3 py-2 text-red-400 cursor-pointer hover:bg-red-500/10">
                    Block
                  </div>

                </div>
              )}

            </div>

            {/* CLOSE */}
            <FiX
              onClick={onClose}
              className="
                cursor-pointer
                text-lg
              "
            />

          </div>

        </div>

        {/* 🔥 CAPTION */}
        {status.caption && (
          <div
            className="
              absolute
              bottom-28
              left-0

              w-full

              px-4

              z-30
            "
          >

            <div
              className="
                bg-black/40
                backdrop-blur-md

                rounded-2xl

                px-4 py-3
              "
            >

              <p
                className="
                  text-white
                  text-sm
                  leading-relaxed
                "
              >
                {status.caption}
              </p>

            </div>

          </div>
        )}

        {/* 🔥 VIEWS */}
        {status.name === "You" &&
          status.views && (
            <div
              className="
                absolute
                bottom-20
                left-0

                w-full

                z-30

                px-4
              "
            >

              <div className="flex justify-center">

                <button
                  onClick={() =>
                    setShowViews(
                      !showViews
                    )
                  }
                  className="
                    flex items-center
                    gap-2

                    px-4 py-2

                    rounded-full

                    bg-black/40
                    backdrop-blur-md

                    border
                    border-white/10

                    text-white
                    text-sm
                  "
                >

                  <FiEye />

                  <span>
                    {
                      status.views
                        .length
                    }
                  </span>

                </button>

              </div>

              {/* 🔥 POPUP */}
              {showViews && (
                <div
                  className="
                    absolute

                    bottom-14
                    left-1/2
                    -translate-x-1/2

                    w-[280px]

                    rounded-2xl

                    bg-[var(--card)]/95
                    backdrop-blur-xl

                    border
                    border-[var(--border)]

                    shadow-2xl

                    overflow-hidden
                  "
                >

                  <div
                    className="
                      p-3

                      border-b
                      border-[var(--border)]
                    "
                  >

                    <p
                      className="
                        font-medium
                        text-sm
                      "
                    >
                      Viewed by
                    </p>

                  </div>

                  <div
                    className="
                      max-h-[260px]
                      overflow-y-auto
                    "
                  >

                    {status.views.map(
                      (u) => (
                        <div
                          key={u.id}
                          className="
                            flex items-center
                            gap-3

                            px-4 py-3

                            hover:bg-[var(--primary)]/10

                            transition
                          "
                        >

                          <img
                            src={
                              u.avatar
                            }
                            className="
                              w-10 h-10
                              rounded-full
                              object-cover
                            "
                          />

                          <p className="text-sm">
                            {u.name}
                          </p>

                        </div>
                      )
                    )}

                  </div>

                </div>
              )}

            </div>
          )}

        {/* 🔥 REACTIONS */}
        <div
          className="
            absolute
            z-30
            bottom-20
            right-4

            flex justify-end
          "
        >

          <div className="relative">

            <img
              src={reactions[0]}
              onClick={() =>
                setShowReactions(
                  !showReactions
                )
              }
              className="
                w-7 h-7
                cursor-pointer

                hover:scale-125

                transition
              "
            />

            {/* POPUP */}
            {showReactions && (
              <div
                className="
                  fixed

                  bottom-28
                  left-1/2
                  -translate-x-1/2

                  flex gap-2

                  px-3 py-2

                  rounded-full

                  backdrop-blur-md
                  bg-[var(--card)]/80

                  border
                  border-[var(--border)]

                  shadow-lg

                  z-[999]
                "
              >

                {reactions.map(
                  (r, i) => (
                    <img
                      key={i}
                      src={r}
                      onClick={() =>
                        setShowReactions(
                          false
                        )
                      }
                      className="
                        w-7 h-7

                        cursor-pointer

                        hover:scale-125

                        transition
                      "
                    />
                  )
                )}

              </div>
            )}

          </div>

        </div>

        {/* 🔥 REPLY */}
        <div
          className="
            absolute
            z-30
            bottom-3
            left-0

            w-full

            px-3
          "
        >

          <div
            className="
              flex items-center
              gap-2

              backdrop-blur-md
              bg-black/30

              px-3 py-2

              rounded-full

              border
              border-white/10
            "
          >

            <input
              value={reply}
              onChange={(e) =>
                setReply(
                  e.target.value
                )
              }
              placeholder="Reply..."
              className="
                flex-1

                bg-transparent
                outline-none

                text-sm
                text-white
              "
            />

            <FiSend className="text-white cursor-pointer" />

          </div>

        </div>

      </div>

      {/* 🔥 DESKTOP LEFT */}
      <button
        onClick={prevStatus}
        className="
          hidden md:flex

          absolute left-4

          items-center
          justify-center

          w-10 h-10

          rounded-full

          backdrop-blur-md
          bg-[var(--card)]/60

          border
          border-[var(--border)]

          text-[var(--text)]
          text-xl

          z-50

          hover:scale-110
          hover:bg-[var(--primary)]/20

          transition
        "
      >

        <FiChevronLeft />

      </button>

      {/* 🔥 DESKTOP RIGHT */}
      <button
        onClick={nextStatus}
        className="
          hidden md:flex

          absolute right-4

          items-center
          justify-center

          w-10 h-10

          rounded-full

          backdrop-blur-md
          bg-[var(--card)]/60

          border
          border-[var(--border)]

          text-[var(--text)]
          text-xl

          z-50

          hover:scale-110
          hover:bg-[var(--primary)]/20

          transition
        "
      >

        <FiChevronRight />

      </button>

    </div>
  );
};

export default StatusViewer;