import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiImage,
  FiVideo,
  FiFile,
  FiDownload,
} from "react-icons/fi";

import API from "../../api/axios";

import MediaViewerModal from "../../components/Chat/MediaViewerModal";

const GroupMediaPage = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [mediaMessages, setMediaMessages] = useState([]);

  const [group, setGroup] = useState(null);

  const [conversationId, setConversationId] = useState(null);

  const [activeTab, setActiveTab] = useState("ALL");

  const [viewerOpen, setViewerOpen] = useState(false);

  const [viewerMedia, setViewerMedia] = useState([]);

  const [viewerIndex, setViewerIndex] = useState(0);

  // ===============================
  // 🔥 FETCH GROUP
  // ===============================
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await API.get(`/groups/${id}`);

        const groupData = res?.data?.data;

        setGroup(groupData);

        setConversationId(groupData?.conversationId);
      } catch (err) {
        console.log(err);
      }
    };

    if (id) {
      fetchGroup();
    }
  }, [id]);

  // ===============================
  // 🔥 FETCH MEDIA
  // ===============================
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        if (!conversationId) {
          return;
        }

        const res = await API.get(`/messages/media/${conversationId}`);

        setMediaMessages(res?.data?.data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMedia();
  }, [conversationId]);

  // ===============================
  // 🔥 FILTERED ITEMS
  // ===============================
  const currentItems = useMemo(() => {
    const filteredMedia = mediaMessages.filter((msg) => {
      const isMedia =
        msg.type === "IMAGE" ||
        msg.type === "VIDEO" ||
        msg.type === "FILE" ||
        msg.type === "MEDIA_GROUP";

      return isMedia && !msg.deletedForEveryone;
    });

    switch (activeTab) {
      case "IMAGES":
        return filteredMedia.filter(
          (msg) => msg.type === "IMAGE" || msg.type === "MEDIA_GROUP",
        );

      case "VIDEOS":
        return filteredMedia.filter((msg) => msg.type === "VIDEO");

      case "FILES":
        return filteredMedia.filter((msg) => msg.type === "FILE");

      case "PDF":
        return filteredMedia.filter(
          (msg) =>
            msg.type === "FILE" && msg.content?.toLowerCase().includes(".pdf"),
        );

      default:
        return filteredMedia;
    }
  }, [activeTab, mediaMessages]);

  // ===============================
  // 🔥 FILES
  // ===============================
  const fileMessages = currentItems.filter((msg) => msg.type === "FILE");

  const pdfMessages = currentItems.filter(
    (msg) => msg.type === "FILE" && msg.content?.toLowerCase().includes(".pdf"),
  );

  // ===============================
  // 🔥 OPEN VIEWER
  // ===============================
  const openViewer = (medias, index) => {
    setViewerMedia(medias);

    setViewerIndex(index);

    setViewerOpen(true);
  };

  // ===============================
  // 🔥 DOWNLOAD
  // ===============================
  const handleDownload = async (url, name) => {
    try {
      const response = await fetch(url);

      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = downloadUrl;

      a.download = name || `talksy-file-${Date.now()}`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 md:top-16 bg-[var(--bg)] text-[var(--text)] overflow-y-auto hide-scrollbar"  style={{ background: "var(--bg)" }}>
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
                {group?.name || "Group"} Media
              </h2>

              <p className="text-xs opacity-60">{currentItems.length} items</p>
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
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4
                py-2

                rounded-full

                text-sm

                whitespace-nowrap

                transition-all
                duration-200

                ${
                  activeTab === tab.key
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
        {activeTab === "FILES" || activeTab === "PDF" ? (
          <div className="space-y-4">
            {(activeTab === "PDF" ? pdfMessages : fileMessages).map((file) => (
              <div
                key={file.id}
                className="
                  overflow-hidden

                  rounded-[28px]

                  bg-[var(--card)]

                  border
                  border-[var(--border)]

                  hover:border-[var(--primary)]/30

                  transition-all
                  duration-300

                  shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                "
              >
                {/* 🔥 TOP */}
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={
                        file.senderAvatar ||
                        `https://ui-avatars.com/api/?name=${file.senderName}`
                      }
                      alt={file.senderName}
                      className="
                        w-11
                        h-11

                        rounded-full
                        object-cover

                        shrink-0
                      "
                    />

                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold truncate">
                        {file.senderName || "Unknown"}
                      </h4>

                      <p className="text-[11px] opacity-60">
                        {new Date(file.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDownload(file.content)}
                    className="
                      w-11
                      h-11

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

                {/* 🔥 FILE CARD */}
                <div className="px-4 pb-4">
                  <div
                    className="
                      flex
                      items-center
                      gap-4

                      p-4

                      rounded-3xl

                      bg-white/5
                    "
                  >
                    <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                      <FiFile className="text-2xl text-[var(--primary)]" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">
                        {file.content?.split("/")?.pop()}
                      </p>

                      <p className="text-sm opacity-60 mt-1">
                        {activeTab === "PDF" ? "PDF document" : "Shared file"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {(activeTab === "PDF" ? pdfMessages : fileMessages).length ===
              0 && (
              <EmptyState
                icon={<FiFile />}
                text={activeTab === "PDF" ? "No PDF files" : "No shared files"}
              />
            )}
          </div>
        ) : (
          <>
            {/* =============================== */}
            {/* 🔥 GROUPED MEDIA */}
            {/* =============================== */}
            {currentItems.length > 0 ? (
              <div
                className="
                        grid
                        grid-cols-1
                        md:grid-cols-2
                        xl:grid-cols-3

                        gap-6

                        w-full
                        max-w-[1400px]

                        mx-auto
                        "
              >
                {Object.values(
                  currentItems.reduce((acc, item) => {
                    const key = item.senderId;

                    if (!acc[key]) {
                      acc[key] = {
                        senderId: item.senderId,

                        senderName: item.senderName,

                        senderAvatar: item.senderAvatar,

                        items: [],
                      };
                    }

                    acc[key].items.push(item);

                    return acc;
                  }, {}),
                ).map((group) => (
                  <div
                    key={group.senderId}
                    className="
          overflow-hidden

          rounded-[30px]

          bg-[var(--card)]

          border
          border-[var(--border)]

          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        "
                  >
                    {/* =============================== */}
                    {/* 🔥 TOP */}
                    {/* =============================== */}
                    <div
                      className="
            flex
            items-center
            justify-between

            gap-3

            px-4
            py-4
          "
                    >
                      {/* 🔥 LEFT */}
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 🔥 AVATAR */}
                        <img
                          src={
                            group.senderAvatar ||
                            `https://ui-avatars.com/api/?name=${group.senderName}`
                          }
                          alt={group.senderName}
                          className="
                w-12
                h-12

                rounded-full
                object-cover

                shrink-0
              "
                        />

                        {/* 🔥 INFO */}
                        <div className="min-w-0">
                          <h4
                            className="
                  text-[15px]
                  font-semibold

                  truncate
                "
                          >
                            {group.senderName}
                          </h4>

                          <p
                            className="
                  text-xs
                  opacity-60
                  mt-1
                "
                          >
                            {group.items.length} shared items
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* =============================== */}
                    {/* 🔥 GRID */}
                    {/* =============================== */}
                    <div
                      className="
            grid
            grid-cols-3
            sm:grid-cols-4

            gap-[2px]

            bg-black/5
          "
                    >
                      {group.items.slice(0, 8).map((item, index) => (
                        <div
                          key={item.id}
                          onClick={() => openViewer(group.items, index)}
                          className="
                  relative

                  aspect-square

                  overflow-hidden

                  cursor-pointer

                  group

                  bg-black/5
                "
                        >
                          {/* 🔥 IMAGE */}
                          {(item.type === "IMAGE" ||
                            item.type === "MEDIA_GROUP") && (
                            <img
                              src={item.content}
                              alt=""
                              loading="lazy"
                              className="
                      w-full
                      h-full

                      object-cover

                      transition-all
                      duration-500

                      group-hover:scale-105
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
                                <div className="w-12 h-12 rounded-full bg-black/55 backdrop-blur-xl flex items-center justify-center">
                                  <FiVideo className="text-white text-xl" />
                                </div>
                              </div>
                            </>
                          )}

                          {/* 🔥 MORE OVERLAY */}
                          {index === 7 && group.items.length > 8 && (
                            <div
                              className="
                      absolute inset-0

                      bg-black/60

                      flex
                      items-center
                      justify-center

                      text-white

                      text-2xl
                      font-bold
                    "
                            >
                              +{group.items.length - 8}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={
                  activeTab === "VIDEOS" ? (
                    <FiVideo />
                  ) : activeTab === "IMAGES" ? (
                    <FiImage />
                  ) : (
                    <FiFile />
                  )
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
        onClose={() => setViewerOpen(false)}
        medias={viewerMedia}
        selectedIndex={viewerIndex}
        setSelectedIndex={setViewerIndex}
      />
    </div>
  );
};

export default GroupMediaPage;

/* =============================== */
/* 🔥 EMPTY STATE */
/* =============================== */
const EmptyState = ({ icon, text }) => (
  <div className="flex flex-col items-center justify-center py-20 opacity-60">
    <div className="text-5xl mb-4">{icon}</div>

    <p>{text}</p>
  </div>
);
