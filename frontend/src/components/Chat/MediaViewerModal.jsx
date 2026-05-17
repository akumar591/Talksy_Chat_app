import {
  FiDownload,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

const MediaViewerModal = ({

  open,
  onClose,

  medias = [],

  selectedIndex = 0,
  setSelectedIndex,
}) => {

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (
    !open ||
    !medias.length
  ) {
    return null;
  }

  // ===============================
  // 🔥 CURRENT MEDIA
  // ===============================
  const currentMedia =
    medias[selectedIndex];

  const mediaUrl =
    currentMedia?.content ||
    currentMedia?.url ||
    "";

  const mediaType =
    currentMedia?.type ||
    "IMAGE";

  const isVideo =
    mediaType === "VIDEO";

  // ===============================
  // 🔥 DOWNLOAD
  // ===============================
  const handleDownload =
    async () => {

      try {

        const response =
          await fetch(
            mediaUrl
          );

        const blob =
          await response.blob();

        const url =
          window.URL.createObjectURL(
            blob
          );

        const a =
          document.createElement(
            "a"
          );

        a.href = url;

        a.download =
          `talksy-media-${Date.now()}`;

        document.body.appendChild(
          a
        );

        a.click();

        a.remove();

        window.URL.revokeObjectURL(
          url
        );

      } catch (err) {

        console.log(err);
      }
    };

  // ===============================
  // 🔥 PREV
  // ===============================
  const handlePrev =
    () => {

      if (
        selectedIndex > 0
      ) {

        setSelectedIndex(
          prev => prev - 1
        );
      }
    };

  // ===============================
  // 🔥 NEXT
  // ===============================
  const handleNext =
    () => {

      if (
        selectedIndex <
        medias.length - 1
      ) {

        setSelectedIndex(
          prev => prev + 1
        );
      }
    };

  return (
    <div className="
      fixed
    inset-0

    md:top-16

    z-[999999]

    bg-black

    flex
    items-center
    justify-center

    overflow-hidden
    ">

      {/* =============================== */}
      {/* 🔥 BACKDROP */}
      {/* =============================== */}
      <div
        onClick={onClose}
        className="
          absolute
          inset-0
        "
      />

      {/* =============================== */}
      {/* 🔥 TOP BAR */}
      {/* =============================== */}
      <div className="
        absolute
        top-0
        left-0
        right-0

        z-50

        flex
        items-center
        justify-between

        px-4
        py-4

        bg-gradient-to-b
        from-black/80
        to-transparent
      ">

        {/* 🔥 CLOSE */}
        <button
          onClick={onClose}
          className="
            w-11
            h-11

            rounded-full

            bg-black/40

            backdrop-blur-xl

            text-white

            flex
            items-center
            justify-center

            hover:bg-white/10

            transition
          "
        >

          <FiX size={22} />

        </button>

        {/* 🔥 COUNTER */}
        <div className="
          text-white
          text-sm
          font-medium
        ">

          {selectedIndex + 1}
          {" / "}
          {medias.length}

        </div>

        {/* 🔥 DOWNLOAD */}
        <button
          onClick={
            handleDownload
          }
          className="
            w-11
            h-11

            rounded-full

            bg-black/40

            backdrop-blur-xl

            text-white

            flex
            items-center
            justify-center

            hover:bg-white/10

            transition
          "
        >

          <FiDownload size={20} />

        </button>

      </div>

      {/* =============================== */}
      {/* 🔥 PREV */}
      {/* =============================== */}
      {selectedIndex > 0 && (

        <button
          onClick={
            handlePrev
          }
          className="
            absolute
            left-3
            md:left-6

            z-50

            w-12
            h-12

            rounded-full

            bg-black/40

            backdrop-blur-xl

            text-white

            flex
            items-center
            justify-center

            hover:bg-white/10

            transition
          "
        >

          <FiChevronLeft size={28} />

        </button>
      )}

      {/* =============================== */}
      {/* 🔥 MEDIA */}
      {/* =============================== */}
      <div className="
        relative
        z-20

        w-full
        h-full

        flex
        items-center
        justify-center

        p-4
        md:p-10
      ">

        {isVideo ? (

          <video
            src={mediaUrl}
            controls
            autoPlay
            playsInline
            className="
              max-w-full
              max-h-full

              rounded-2xl

              object-contain
            "
          />

        ) : (

          <img
            src={mediaUrl}
            alt="media"
            loading="lazy"
            className="
              max-w-full
              max-h-full

              object-contain

              rounded-2xl
            "
          />

        )}

      </div>

      {/* =============================== */}
      {/* 🔥 NEXT */}
      {/* =============================== */}
      {selectedIndex <
        medias.length - 1 && (

        <button
          onClick={
            handleNext
          }
          className="
            absolute
            right-3
            md:right-6

            z-50

            w-12
            h-12

            rounded-full

            bg-black/40

            backdrop-blur-xl

            text-white

            flex
            items-center
            justify-center

            hover:bg-white/10

            transition
          "
        >

          <FiChevronRight size={28} />

        </button>
      )}

    </div>
  );
};

export default MediaViewerModal;