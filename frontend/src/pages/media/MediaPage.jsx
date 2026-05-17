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

  const { messages } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [activeTab, setActiveTab] = useState("MEDIA");

  const [viewerOpen, setViewerOpen] = useState(false);

  const [viewerMedia, setViewerMedia] = useState([]);

  const [viewerIndex, setViewerIndex] = useState(0);

  const [currentUserId, setCurrentUserId] = useState(null);

  // ===============================
  // 🔥 GET USER
  // ===============================
  useEffect(() => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      setCurrentUserId(Number(user?.id));

    } catch {

      setCurrentUserId(null);
    }

  }, []);

  // ===============================
  // 🔥 FILTER MEDIA
  // ===============================
  const mediaMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        (msg.type === "IMAGE" || msg.type === "VIDEO") &&
        msg.content
    );

  }, [messages]);

  // ===============================
  // 🔥 FILTER FILES
  // ===============================
  const fileMessages = useMemo(() => {

    return messages.filter(
      (msg) =>
        msg.type === "FILE" &&
        msg.content
    );

  }, [messages]);

  // ===============================
  // 🔥 SENT MEDIA
  // ===============================
  const sentMedia = mediaMessages.filter(
    (msg) =>
      msg.senderId === currentUserId
  );

  // ===============================
  // 🔥 RECEIVED MEDIA
  // ===============================
  const receivedMedia = mediaMessages.filter(
    (msg) =>
      msg.senderId !== currentUserId
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

      const downloadUrl =
        window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = downloadUrl;

      a.download =
        name || `talksy-file-${Date.now()}`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(downloadUrl);

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
                {mediaMessages.length + fileMessages.length} items
              </p>

            </div>

          </div>

        </div>

        {/* 🔥 TABS */}
        <div className="flex gap-2 px-4 pb-4">

          <button
            onClick={() => setActiveTab("MEDIA")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeTab === "MEDIA"
                ? "bg-[var(--primary)] text-black"
                : "bg-[var(--card)]"
            }`}
          >

            Media

          </button>

          <button
            onClick={() => setActiveTab("FILES")}
            className={`px-4 py-2 rounded-full text-sm transition ${
              activeTab === "FILES"
                ? "bg-[var(--primary)] text-black"
                : "bg-[var(--card)]"
            }`}
          >

            Files

          </button>

        </div>

      </div>

      {/* =============================== */}
      {/* 🔥 BODY */}
      {/* =============================== */}
      <div className="p-4 space-y-8">

        {/* =============================== */}
        {/* 🔥 MEDIA */}
        {/* =============================== */}
        {activeTab === "MEDIA" && (
          <>

            {/* 🔥 YOU SENT */}
            <div>

              <div className="flex items-center gap-2 mb-4">

                <FiImage />

                <h3 className="text-sm font-semibold">
                  You Sent
                </h3>

              </div>

              {sentMedia.length > 0 ? (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                  {sentMedia.map((item, index) => (

                    <div
                      key={item.id}
                      onClick={() => openViewer(sentMedia, index)}
                      className="relative rounded-3xl overflow-hidden bg-[var(--card)] aspect-square cursor-pointer group"
                    >

                      {/* 🔥 IMAGE */}
                      {item.type === "IMAGE" && (
                        <img
                          src={item.content}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}

                      {/* 🔥 VIDEO */}
                      {item.type === "VIDEO" && (
                        <>
                          <video
                            src={item.content}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">

                            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">

                              <FiVideo className="text-white text-2xl" />

                            </div>

                          </div>
                        </>
                      )}

                    </div>
                  ))}

                </div>

              ) : (

                <div className="opacity-60 text-sm">
                  No sent media
                </div>

              )}

            </div>

            {/* 🔥 RECEIVED */}
            <div>

              <div className="flex items-center gap-2 mb-4">

                <FiVideo />

                <h3 className="text-sm font-semibold">
                  Received
                </h3>

              </div>

              {receivedMedia.length > 0 ? (

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                  {receivedMedia.map((item, index) => (

                    <div
                      key={item.id}
                      onClick={() => openViewer(receivedMedia, index)}
                      className="relative rounded-3xl overflow-hidden bg-[var(--card)] aspect-square cursor-pointer group"
                    >

                      {/* 🔥 IMAGE */}
                      {item.type === "IMAGE" && (
                        <img
                          src={item.content}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}

                      {/* 🔥 VIDEO */}
                      {item.type === "VIDEO" && (
                        <>
                          <video
                            src={item.content}
                            className="w-full h-full object-cover"
                          />

                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">

                            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">

                              <FiVideo className="text-white text-2xl" />

                            </div>

                          </div>
                        </>
                      )}

                    </div>
                  ))}

                </div>

              ) : (

                <div className="opacity-60 text-sm">
                  No received media
                </div>

              )}

            </div>

          </>
        )}

        {/* =============================== */}
        {/* 🔥 FILES */}
        {/* =============================== */}
        {activeTab === "FILES" && (

          <div className="space-y-4">

            {fileMessages.map((file) => (

              <div
                key={file.id}
                className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-[var(--card)]"
              >

                {/* 🔥 LEFT */}
                <div className="flex items-center gap-4 min-w-0">

                  <div className="w-14 h-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center shrink-0">

                    <FiFile className="text-2xl text-[var(--primary)]" />

                  </div>

                  <div className="min-w-0">

                    <p className="font-medium truncate">
                      {file.content?.split("/")?.pop()}
                    </p>

                    <p className="text-sm opacity-60">
                      Shared file
                    </p>

                  </div>

                </div>

                {/* 🔥 DOWNLOAD */}
                <button
                  onClick={() => handleDownload(file.content)}
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
                >

                  <FiDownload />

                </button>

              </div>
            ))}

            {fileMessages.length === 0 && (

              <div className="flex flex-col items-center justify-center py-20 opacity-60">

                <FiFile className="text-5xl mb-4" />

                <p>
                  No shared files
                </p>

              </div>
            )}

          </div>
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

export default MediaPage;