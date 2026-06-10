import { useState, useRef, useEffect, useMemo, useCallback } from "react";

import { FiX } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import { useGroup } from "../../context/GroupContext";
import { useChatAppearance } from "../../context/ChatAppearanceContext";

import CameraModal from "./CameraModal";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import MediaPreviewModal from "./MediaPreviewModal";
import MediaViewerModal from "./MediaViewerModal";
import WallpaperModal from "./WallpaperModal";

import AddMembersModal from "./AddMembersModal";
import ConfirmModal from "../Common/ConfirmModal";

const ChatWindow = ({ chat, onBack }) => {
  const navigate = useNavigate();

  const {
    toggleBlockContact,
    deleteContact,

    messages,
    conversation,

    sendMessage,

    clearChat,

    replyTo,
    setReplyTo,

    uploadChatMedia,
  } = useChat();

  const { leaveGroup, deleteGroup, fetchGroupById, groupDetails } = useGroup();

  const { user } = useAuth();
  const { createChatKey, getWallpaper, getChatStyle, getBubbleColor } =
    useChatAppearance();

  // ===============================
  // 🔥 INPUT
  // ===============================
  const [input, setInput] = useState("");

  const [isRecording, setIsRecording] = useState(false);

  const [leaveGroupOpen, setLeaveGroupOpen] = useState(false);

  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);

  const [showCamera, setShowCamera] = useState(false);

  // ===============================
  // 🔥 HEADER MENU
  // ===============================
  const [showMenu, setShowMenu] = useState(false);
  // ===============================
  // 🔥 WALLPAPER MODAL
  // ===============================
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);

  const [showAddMembersModal, setShowAddMembersModal] = useState(false);

  // ===============================
  // 🔥 ATTACH
  // ===============================
  const [showAttach, setShowAttach] = useState(false);

  // ===============================
  // 🔥 EMOJI
  // ===============================
  const [showEmoji, setShowEmoji] = useState(false);

  // ===============================
  // 🔥 PREVIEW
  // ===============================
  const [previewMedia, setPreviewMedia] = useState([]);

  const [previewType, setPreviewType] = useState("");

  const [mediaCaption, setMediaCaption] = useState("");

  const [showMediaPreview, setShowMediaPreview] = useState(false);

  const [sendingMedia, setSendingMedia] = useState(false);

  const [previewUrls, setPreviewUrls] = useState([]);

  // ===============================
  // 🔥 VIEWER
  // ===============================
  const [viewerOpen, setViewerOpen] = useState(false);

  const [viewerMedia, setViewerMedia] = useState([]);

  const [viewerIndex, setViewerIndex] = useState(0);

  // ===============================
  // 🔥 REFS
  // ===============================
  const menuRef = useRef(null);

  const emojiRef = useRef(null);

  const attachRef = useRef(null);

  const messagesEndRef = useRef(null);

  const inputRef = useRef(null);

  // ===============================
  // 🔥 VOICE RECORDING
  // ===============================
  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  const streamRef = useRef(null);

  const galleryInputRef = useRef(null);

  const cameraInputRef = useRef(null);

  const fileInputRef = useRef(null);

  // ===============================
  // 🔥 FETCH GROUP
  // ===============================
  useEffect(() => {
    if (chat?.isGroup && chat?.id) {
      fetchGroupById(chat.id);
    }
  }, [chat?.id, chat?.isGroup]);

  // ===============================
  // 🔥 AUTO SCROLL
  // ===============================
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ===============================
  // 🔥 AUTO FOCUS
  // ===============================
  useEffect(() => {
    inputRef.current?.focus();
  }, [replyTo]);

  // ===============================
  // 🔥 PREVIEW URLS
  // ===============================
  useEffect(() => {
    if (!previewMedia.length) {
      setPreviewUrls([]);

      return;
    }

    const urls = previewMedia.map((file) => URL.createObjectURL(file));

    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewMedia]);

  // ===============================
  // 🔥 OUTSIDE CLICK
  // ===============================
  useEffect(() => {
    const handleOutside = (e) => {
      // 🔥 HEADER MENU
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      // 🔥 ATTACH
      if (
        attachRef.current &&
        !attachRef.current.contains(e.target) &&
        !e.target.closest(".attach-menu")
      ) {
        setShowAttach(false);
      }

      // 🔥 EMOJI
      if (
        emojiRef.current &&
        !emojiRef.current.contains(e.target) &&
        !e.target.closest(".emoji-trigger")
      ) {
        setShowEmoji(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  // ===============================
  // 🔥 GROUP ROLES
  // ===============================
  const currentMember = useMemo(() => {
    return groupDetails?.members?.find(
      (m) => String(m.userId || m.id) === String(user?.id || ""),
    );
  }, [groupDetails, user]);

  const isCreator = useMemo(() => {
    return String(groupDetails?.createdById) === String(user?.id || "");
  }, [groupDetails, user]);

  const isAdmin = useMemo(() => {
    return currentMember?.role === "ADMIN";
  }, [currentMember]);

  // ===============================
  // 🔥 CHAT KEY
  // ===============================
  const chatKey = chat?.isGroup
    ? `group_${conversation?.id}`
    : `private_${conversation?.id}`;

  // ===============================
  // 🔥 CURRENT WALLPAPER
  // ===============================
  const currentWallpaper = getWallpaper(chatKey);

  // ===============================
  // 🔥 CURRENT CHAT STYLE
  // ===============================
  const currentChatStyle = getChatStyle(chatKey);

  // ===============================
  // 🔥 CURRENT BUBBLE COLOR
  // ===============================
  const currentBubbleColor = getBubbleColor(chatKey);

  // ===============================
  // 🔥 GROUP MEDIA
  // ===============================
  const groupedMessages = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
    );

    const finalMessages = [];

    let currentGroup = [];

    const flushGroup = () => {
      if (!currentGroup.length) {
        return;
      }

      // 🔥 SINGLE
      if (currentGroup.length === 1) {
        finalMessages.push(currentGroup[0]);
      } else {
        // 🔥 GROUP
        finalMessages.push({
          id: `media-group-${currentGroup[0].id}`,

          type: "MEDIA_GROUP",

          senderId: currentGroup[0].senderId,

          createdAt: currentGroup[0].createdAt,

          medias: [...currentGroup],
        });
      }

      currentGroup = [];
    };

    sorted.forEach((msg) => {
      const isMedia = msg.type === "IMAGE";

      if (!isMedia) {
        flushGroup();

        finalMessages.push(msg);

        return;
      }

      if (!currentGroup.length) {
        currentGroup.push(msg);

        return;
      }

      const last = currentGroup[currentGroup.length - 1];

      const sameSender = last.senderId === msg.senderId;

      const closeTime =
        new Date(msg.createdAt) - new Date(last.createdAt) < 45000;

      if (sameSender && closeTime) {
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
  // 🔥 SEND MESSAGE
  // ===============================
  const handleSendMessage = useCallback(async () => {
    if (!input.trim()) {
      return;
    }

    if (!conversation?.id) {
      return;
    }

    try {
      await sendMessage({
        conversationId: conversation.id,

        content: input.trim(),

        type: "TEXT",

        replyToId: replyTo?.id || null,
      });

      setInput("");

      setReplyTo(null);
    } catch (error) {
      console.log(error);
    }
  }, [input, conversation, sendMessage, replyTo, setReplyTo]);

  // ===============================
  // 🔥 VOICE RECORDING
  // ===============================
  const handleMicClick = async () => {
    try {
      // 🔥 STOP RECORDING
      if (isRecording && mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();

        streamRef.current?.getTracks()?.forEach((track) => track.stop());

        setIsRecording(false);

        return;
      }

      // 🔥 START RECORDING
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;

      audioChunksRef.current = [];

      // 🔥 AUDIO CHUNKS
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 🔥 STOP RECORDING
      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/webm",
          });

          const audioFile = new File([audioBlob], `voice-${Date.now()}.webm`, {
            type: "audio/webm",
          });

          // 🔥 UPLOAD
          const uploaded = await uploadChatMedia(audioFile);

          if (!uploaded?.url) {
            return;
          }

          // 🔥 SEND MESSAGE
          await sendMessage({
            conversationId: conversation.id,

            content: uploaded.url,

            type: "VOICE",

            replyToId: replyTo?.id || null,
          });
        } catch (error) {
          console.log(error);
        }
      };

      mediaRecorder.start();

      setIsRecording(true);
    } catch (error) {
      console.log(error);

      setIsRecording(false);
    }
  };

  // ===============================
  // 🔥 CLEAR CHAT
  // ===============================
  const handleClearChat = () => {
    if (!conversation?.id) {
      return;
    }

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
    <div
      className="relative flex flex-col w-full h-full overflow-hidden text-[var(--text)]"
      style={{
        // ======================================
        // 🔥 IMAGE WALLPAPER
        // ======================================
        ...(currentWallpaper?.type === "image"
          ? {
              backgroundImage: `
          linear-gradient(
            ${currentWallpaper.overlay || "rgba(0,0,0,0.35)"},
            ${currentWallpaper.overlay || "rgba(0,0,0,0.35)"}
          ),
          url(${currentWallpaper.image})
          `,

              backgroundSize: "cover",

              backgroundPosition: "center center",

              backgroundRepeat: "no-repeat",
            }
          : {
              // ======================================
              // 🔥 GRADIENT WALLPAPER
              // ======================================
              background: currentWallpaper?.background,
            }),

        transition: "all 0.35s ease",
      }}
    >
      {/* 🔥 HEADER */}

      <ChatHeader
        chat={chat}
        chatKey={chatKey}
        onBack={onBack}
        navigate={navigate}
        showMenu={showMenu}
        setShowMenu={setShowMenu}
        isCreator={isCreator}
        isAdmin={isAdmin}
        setLeaveGroupOpen={setLeaveGroupOpen}
        setDeleteGroupOpen={setDeleteGroupOpen}
        menuRef={menuRef}
        isRecording={isRecording}
        toggleBlockContact={toggleBlockContact}
        deleteContact={deleteContact}
        leaveGroup={leaveGroup}
        setShowAddMembersModal={setShowAddMembersModal}
        handleClearChat={handleClearChat}
        setShowWallpaperModal={setShowWallpaperModal}
      />

      {/* 🔥 MESSAGES */}
      <MessageList
        groupedMessages={groupedMessages}
        chat={chat}
        messagesEndRef={messagesEndRef}
        // 🔥 VIEWER
        setViewerOpen={setViewerOpen}
        setViewerMedia={setViewerMedia}
        setViewerIndex={setViewerIndex}
        currentChatStyle={currentChatStyle}
        currentBubbleColor={currentBubbleColor}
      />

      {/* 🔥 REPLY */}
      {replyTo && (
        <div
          className="
    px-3
    py-2

    bg-[var(--card)]

    border-t
    border-[var(--border)]
  "
        >
          <div
            className="
      px-3
      py-2

      bg-[var(--primary)]/10

      rounded-2xl

      flex
      justify-between
      items-center

      gap-3

      text-sm
    "
          >
            {/* 🔥 LEFT */}
            <div
              className="
        flex-1
        min-w-0
      "
            >
              <p
                className="
          text-[12px]
          font-semibold
          mb-1
        "
              >
                Replying
              </p>

              {/* 🔥 IMAGE */}
              {replyTo.type === "IMAGE" && (
                <div
                  className="
            flex
            items-center
            gap-3
          "
                >
                  <img
                    src={replyTo.content}
                    alt="reply-media"
                    className="
                w-12
                h-12

                rounded-xl

                object-cover

                shrink-0
              "
                  />

                  <p
                    className="
              text-[13px]
              opacity-80
              truncate
            "
                  >
                    📷 Photo
                  </p>
                </div>
              )}

              {/* 🔥 VIDEO */}
              {replyTo.type === "VIDEO" && (
                <div
                  className="
            flex
            items-center
            gap-3
          "
                >
                  <video
                    src={replyTo.content}
                    className="
                w-12
                h-12

                rounded-xl

                object-cover

                shrink-0
              "
                  />

                  <p
                    className="
              text-[13px]
              opacity-80
            "
                  >
                    🎥 Video
                  </p>
                </div>
              )}

              {/* 🔥 FILE */}
              {replyTo.type === "FILE" && (
                <p
                  className="
            text-[13px]
            opacity-80
          "
                >
                  📄 File
                </p>
              )}

              {/* 🔥 VOICE */}
              {replyTo.type === "VOICE" && (
                <p className="text-[13px] opacity-80">🎤 Voice Message</p>
              )}

              {/* 🔥 TEXT */}
              {replyTo.type === "TEXT" && (
                <p
                  className="
            text-[13px]
            opacity-80

            truncate
          "
                >
                  {replyTo.content}
                </p>
              )}
            </div>

            {/* 🔥 CLOSE */}
            <button
              aria-label="Cancel reply"
              onClick={() => setReplyTo(null)}
              className="
          shrink-0

          opacity-70
          hover:opacity-100
        "
            >
              <FiX />
            </button>
          </div>
        </div>
      )}

      {/* 🔥 INPUT */}
      <div className="pb-[env(safe-area-inset-bottom)]">
        <ChatInput
          input={input}
          setInput={setInput}
          inputRef={inputRef}
          handleSendMessage={handleSendMessage}
          handleMicClick={handleMicClick}
          isRecording={isRecording}
          // 🔥 ATTACH
          showAttach={showAttach}
          setShowAttach={setShowAttach}
          attachRef={attachRef}
          galleryInputRef={galleryInputRef}
          cameraInputRef={cameraInputRef}
          fileInputRef={fileInputRef}
          setPreviewMedia={setPreviewMedia}
          setPreviewType={setPreviewType}
          setShowMediaPreview={setShowMediaPreview}
          setShowCamera={setShowCamera}
          // 🔥 EMOJI
          showEmoji={showEmoji}
          setShowEmoji={setShowEmoji}
          emojiRef={emojiRef}
        />
      </div>

      {/* 🔥 MEDIA PREVIEW */}
      <MediaPreviewModal
        setPreviewUrls={setPreviewUrls}
        showMediaPreview={showMediaPreview}
        setShowMediaPreview={setShowMediaPreview}
        previewMedia={previewMedia}
        setPreviewMedia={setPreviewMedia}
        previewUrls={previewUrls}
        previewType={previewType}
        mediaCaption={mediaCaption}
        setMediaCaption={setMediaCaption}
        sendingMedia={sendingMedia}
        setSendingMedia={setSendingMedia}
        uploadChatMedia={uploadChatMedia}
        sendMessage={sendMessage}
        conversation={conversation}
      />

      {/* 🔥 VIEWER */}
      <MediaViewerModal
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        medias={viewerMedia}
        selectedIndex={viewerIndex}
        setSelectedIndex={setViewerIndex}
      />

      <CameraModal
        open={showCamera}
        onClose={() => setShowCamera(false)}
        onCapture={(file) => {
          setPreviewMedia([file]);

          setPreviewType("IMAGE");

          setShowMediaPreview(true);
        }}
      />

      {/* 🔥 ADD MEMBERS */}
      {showAddMembersModal && (
        <AddMembersModal
          group={groupDetails || chat}
          onClose={() => setShowAddMembersModal(false)}
        />
      )}

      {/* 🔥 LEAVE GROUP */}
      <ConfirmModal
        open={leaveGroupOpen}
        title="Leave Group"
        message="Are you sure you want to leave this group?"
        confirmText="Leave"
        cancelText="Cancel"
        danger={true}
        onClose={() => {
          setLeaveGroupOpen(false);
        }}
        onConfirm={async () => {
          const res = await leaveGroup(chat.id);

          if (res.success) {
            navigate("/");
          }

          setLeaveGroupOpen(false);
        }}
      />

      {/* 🔥 DELETE GROUP */}
      <ConfirmModal
        open={deleteGroupOpen}
        title="Delete Group"
        message="This group will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onClose={() => {
          setDeleteGroupOpen(false);
        }}
        onConfirm={async () => {
          const res = await deleteGroup(chat.id);

          if (res.success) {
            navigate("/");
          }

          setDeleteGroupOpen(false);
        }}
      />

      {/* 🔥 WALLPAPER MODAL */}
      <WallpaperModal
        open={showWallpaperModal}
        onClose={() => setShowWallpaperModal(false)}
        chatKey={chatKey}
      />
    </div>
  );
};

export default ChatWindow;
