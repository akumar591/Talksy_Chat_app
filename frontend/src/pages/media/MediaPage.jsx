import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiImage,
  FiVideo,
  FiFile,
  FiDownload,
} from "react-icons/fi";

import { useChat } from "../../context/ChatContext";

import MediaViewerModal from "../../components/chat/MediaViewerModal";

const MediaPage = () => {

  const navigate = useNavigate();

  // 🔥 NOW USING OPTIMIZED CONTEXT DATA
  const {
    mediaMessages,
    imageMessages,
    videoMessages,
    fileMessages,
    pdfMessages,
  } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [activeTab, setActiveTab] =
    useState("ALL");

  const [viewerOpen, setViewerOpen] =
    useState(false);

  const [viewerMedia, setViewerMedia] =
    useState([]);

  const [viewerIndex, setViewerIndex] =
    useState(0);

  const [currentUserId, setCurrentUserId] =
    useState(null);

  // ===============================
  // 🔥 GET USER
  // ===============================
  useEffect(() => {

    try {

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      setCurrentUserId(
        Number(user?.id)
      );

    } catch {

      setCurrentUserId(null);
    }

  }, []);

  // ===============================
  // 🔥 CURRENT ITEMS
  // ===============================
  const currentItems = useMemo(() => {

    switch (activeTab) {

      case "IMAGES":
        return imageMessages;

      case "VIDEOS":
        return videoMessages;

      case "FILES":
        return fileMessages;

      case "PDF":
        return pdfMessages;

      default:
        return mediaMessages;
    }

  }, [
    activeTab,
    mediaMessages,
    imageMessages,
    videoMessages,
    fileMessages,
    pdfMessages,
  ]);

  // ===============================
  // 🔥 OPEN VIEWER
  // ===============================
  const openViewer = (
    medias,
    index
  ) => {

    setViewerMedia(medias);

    setViewerIndex(index);

    setViewerOpen(true);
  };

  // ===============================
  // 🔥 DOWNLOAD
  // ===============================
  const handleDownload = async (
    url,
    name
  ) => {

    try {

      const response =
        await fetch(url);

      const blob =
        await response.blob();

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = downloadUrl;

      a.download =
        name ||
        `talksy-file-${Date.now()}`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(
        downloadUrl
      );

    } catch (err) {

      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 md:top-16 bg-[var(--bg)] text-[var(--text)] overflow-y-auto hide-scrollbar">

      {/* =============================== */}
      {/* 🔥 HEADER */}
      {/* =============================== */}
      <div className="sticky top-0 z-50 bg-[var(--bg)]/80 backdrop-blur-xl border-b border-[var(--border)]">

        <div className="flex items-center justify-between px-4 py-4">

          {/* 🔥 LEFT */}
          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition"
            >

              <FiArrowLeft size={20} />

            </button>

            <div>

              <h2 className="text-lg font-semibold">
                Shared Media
              </h2>

              <p className="text-xs opacity-60">

                {mediaMessages.length +
                  fileMessages.length}

                {" "}items

              </p>

            </div>

          </div>

        </div>

        {/* =============================== */}
        {/* 🔥 FILTER TABS */}
        {/* =============================== */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar px-4 pb-4">

          {[
            {
              key: "ALL",
              label: "All",
            },

            {
              key: "IMAGES",
              label: "Images",
            },

            {
              key: "VIDEOS",
              label: "Videos",
            },

            {
              key: "FILES",
              label: "Files",
            },

            {
              key: "PDF",
              label: "PDF",
            },

          ].map((tab) => (

            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key)
              }
              className={`
                px-4
                py-2

                rounded-full

                text-sm

                whitespace-nowrap

                transition-all
                duration-200

                ${activeTab === tab.key

                  ? `
                    bg-[var(--primary)]
                    text-black
                    shadow-lg
                  `

                  : `
                    bg-[var(--card)]
                    hover:bg-white/5
                  `
                }
              `}
            >

              {tab.label}

            </button>
          ))}

        </div>

      </div>

      {/* =============================== */}
      {/* 🔥 BODY */}
      {/* =============================== */}
      <div className="p-4">

        {/* =============================== */}
        {/* 🔥 FILES + PDF */}
        {/* =============================== */}
        {activeTab === "FILES" ||
        activeTab === "PDF" ? (

          <div className="space-y-4">

            {(
              activeTab === "PDF"
                ? pdfMessages
                : fileMessages
            ).map((file) => (

              <div
                key={file.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-4

                  p-4

                  rounded-3xl

                  bg-[var(--card)]

                  border
                  border-[var(--border)]

                  hover:border-[var(--primary)]/30

                  transition-all
                "
              >

                {/* 🔥 LEFT */}
                <div className="flex items-center gap-4 min-w-0">

                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">

                    <FiFile className="text-2xl text-[var(--primary)]" />

                  </div>

                  <div className="min-w-0">

                    <p className="font-medium truncate">

                      {file.content
                        ?.split("/")
                        ?.pop()}

                    </p>

                    <p className="text-sm opacity-60">

                      {activeTab === "PDF"

                        ? "PDF document"

                        : "Shared file"}

                    </p>

                  </div>

                </div>

                {/* 🔥 DOWNLOAD */}
                <button
                  onClick={() =>
                    handleDownload(
                      file.content
                    )
                  }
                  className="
                    w-12
                    h-12

                    rounded-2xl

                    bg-white/5

                    flex
                    items-center
                    justify-center

                    hover:bg-[var(--primary)]/10

                    transition-all
                  "
                >

                  <FiDownload />

                </button>

              </div>
            ))}

            {(
              activeTab === "PDF"
                ? pdfMessages
                : fileMessages
            ).length === 0 && (

              <EmptyState
                icon={<FiFile />}
                text={
                  activeTab === "PDF"

                    ? "No PDF files"

                    : "No shared files"
                }
              />

            )}

          </div>

        ) : (

          <>
            {/* =============================== */}
            {/* 🔥 MEDIA GRID */}
            {/* =============================== */}
            {currentItems.length > 0 ? (

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                {currentItems.map((
                  item,
                  index
                ) => (

                  <div
                    key={item.id}
                    onClick={() =>
                      openViewer(
                        currentItems,
                        index
                      )
                    }
                    className="
                      relative

                      rounded-3xl

                      overflow-hidden

                      bg-[var(--card)]

                      aspect-square

                      cursor-pointer

                      group

                      border
                      border-[var(--border)]

                      hover:border-[var(--primary)]/30

                      transition-all
                    "
                  >

                    {/* 🔥 IMAGE */}
                    {item.type === "IMAGE" && (

                      <img
                        src={item.content}
                        alt=""
                        loading="lazy"
                        className="
                          w-full
                          h-full

                          object-cover

                          group-hover:scale-105

                          transition
                          duration-300
                        "
                      />
                    )}

                    {/* 🔥 VIDEO */}
                    {item.type === "VIDEO" && (

                      <>
                        <video
                          src={item.content}
                          className="
                            w-full
                            h-full
                            object-cover
                          "
                        />

                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">

                          <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center">

                            <FiVideo className="text-white text-2xl" />

                          </div>

                        </div>
                      </>
                    )}

                  </div>
                ))}

              </div>

            ) : (

              <EmptyState
                icon={
                  activeTab === "VIDEOS"

                    ? <FiVideo />

                    : activeTab === "IMAGES"

                    ? <FiImage />

                    : <FiFile />
                }
                text={`No ${activeTab.toLowerCase()} found`}
              />

            )}
          </>
        )}

      </div>

      {/* =============================== */}
      {/* 🔥 VIEWER */}
      {/* =============================== */}
      <MediaViewerModal
        open={viewerOpen}
        onClose={() =>
          setViewerOpen(false)
        }
        medias={viewerMedia}
        selectedIndex={viewerIndex}
        setSelectedIndex={setViewerIndex}
      />

    </div>
  );
};

export default MediaPage;

/* =============================== */
/* 🔥 EMPTY STATE */
/* =============================== */
const EmptyState = ({
  icon,
  text,
}) => (

  <div className="flex flex-col items-center justify-center py-20 opacity-60">

    <div className="text-5xl mb-4">

      {icon}

    </div>

    <p>{text}</p>

  </div>
);