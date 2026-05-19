import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from "react";

import { FiX } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useChat } from "../../context/ChatContext";
import { useGroup } from "../../context/GroupContext";

import CameraModal from "./CameraModal";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

import MediaPreviewModal from "./MediaPreviewModal";
import MediaViewerModal from "./MediaViewerModal";

import AddMembersModal from "./AddMembersModal";

const ChatWindow = ({
  chat,
  onBack,
}) => {

  const navigate =
    useNavigate();

  const {
    toggleBlockContact,
    deleteContact,

    messages,
    conversation,

    sendMessage,

    clearChat,

    replyTo,
    setReplyTo,

    fetchMessages,

    uploadChatMedia,
  } = useChat();

  const {
    leaveGroup,
    fetchGroupById,
    groupDetails,
  } = useGroup();

  // ===============================
  // 🔥 INPUT
  // ===============================
  const [input, setInput] =
    useState("");

  const [
    isRecording,
    setIsRecording,
  ] = useState(false);

  const [
    showCamera,
    setShowCamera,
  ] = useState(false);

  // ===============================
  // 🔥 HEADER MENU
  // ===============================
  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  const [
    showAddMembersModal,
    setShowAddMembersModal,
  ] = useState(false);

  // ===============================
  // 🔥 ATTACH
  // ===============================
  const [
    showAttach,
    setShowAttach,
  ] = useState(false);

  // ===============================
  // 🔥 EMOJI
  // ===============================
  const [
    showEmoji,
    setShowEmoji,
  ] = useState(false);

  // ===============================
  // 🔥 PREVIEW
  // ===============================
  const [
    previewMedia,
    setPreviewMedia,
  ] = useState([]);

  const [
    previewType,
    setPreviewType,
  ] = useState("");

  const [
    mediaCaption,
    setMediaCaption,
  ] = useState("");

  const [
    showMediaPreview,
    setShowMediaPreview,
  ] = useState(false);

  const [
    sendingMedia,
    setSendingMedia,
  ] = useState(false);

  const [
    previewUrls,
    setPreviewUrls,
  ] = useState([]);

  // ===============================
  // 🔥 VIEWER
  // ===============================
  const [
    viewerOpen,
    setViewerOpen,
  ] = useState(false);

  const [
    viewerMedia,
    setViewerMedia,
  ] = useState([]);

  const [
    viewerIndex,
    setViewerIndex,
  ] = useState(0);

  // ===============================
  // 🔥 REFS
  // ===============================
  const menuRef =
    useRef(null);

  const emojiRef =
    useRef(null);

  const attachRef =
    useRef(null);

  const messagesEndRef =
    useRef(null);

  const inputRef =
    useRef(null);

  const timerRef =
    useRef(null);

  const galleryInputRef =
    useRef(null);

  const cameraInputRef =
    useRef(null);

  const fileInputRef =
    useRef(null);

  // ===============================
  // 🔥 FETCH GROUP
  // ===============================
  useEffect(() => {

    if (
      chat?.isGroup &&
      chat?.id
    ) {

      fetchGroupById(
        chat.id
      );
    }

  }, [
    chat,
    fetchGroupById,
  ]);

  // ===============================
  // 🔥 FETCH MESSAGES
  // ===============================
  useEffect(() => {

    if (
      conversation?.id
    ) {

      fetchMessages(
        conversation.id
      );
    }

  }, [
    conversation?.id,
    fetchMessages,
  ]);

  // ===============================
  // 🔥 AUTO SCROLL
  // ===============================
  useEffect(() => {

    messagesEndRef.current
      ?.scrollIntoView({

        behavior:
          "smooth",
      });

  }, [messages]);

  // ===============================
  // 🔥 AUTO FOCUS
  // ===============================
  useEffect(() => {

    inputRef.current
      ?.focus();

  }, [replyTo]);

  // ===============================
  // 🔥 CLEANUP TIMER
  // ===============================
  useEffect(() => {

    return () => {

      if (
        timerRef.current
      ) {

        clearTimeout(
          timerRef.current
        );
      }
    };

  }, []);

  // ===============================
  // 🔥 PREVIEW URLS
  // ===============================
  useEffect(() => {

    if (
      !previewMedia.length
    ) {

      setPreviewUrls([]);

      return;
    }

    const urls =
      previewMedia.map(
        file =>
          URL.createObjectURL(
            file
          )
      );

    setPreviewUrls(urls);

    return () => {

      urls.forEach(
        url =>
          URL.revokeObjectURL(
            url
          )
      );
    };

  }, [previewMedia]);

  // ===============================
  // 🔥 OUTSIDE CLICK
  // ===============================
  useEffect(() => {

    const handleOutside =
      (e) => {

        // 🔥 HEADER MENU
        if (
          menuRef.current &&
          !menuRef.current.contains(
            e.target
          )
        ) {

          setShowMenu(
            false
          );
        }

        // 🔥 ATTACH
        if (
          attachRef.current &&
          !attachRef.current.contains(
            e.target
          ) &&
          !e.target.closest(
            ".attach-menu"
          )
        ) {

          setShowAttach(
            false
          );
        }

        // 🔥 EMOJI
        if (
          emojiRef.current &&
          !emojiRef.current.contains(
            e.target
          ) &&
          !e.target.closest(
            ".emoji-trigger"
          )
        ) {

          setShowEmoji(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutside
      );
    };

  }, []);

  // ===============================
  // 🔥 GROUP MEDIA
  // ===============================
  const groupedMessages =
    useMemo(() => {

      const sorted =
        [...messages].sort(
          (a, b) =>
            new Date(
              a.createdAt
            ) -
            new Date(
              b.createdAt
            )
        );

      const finalMessages =
        [];

      let currentGroup =
        [];

      const flushGroup =
        () => {

          if (
            !currentGroup.length
          ) {
            return;
          }

          // 🔥 SINGLE
          if (
            currentGroup.length ===
            1
          ) {

            finalMessages.push(
              currentGroup[0]
            );

          } else {

            // 🔥 GROUP
            finalMessages.push({

              id:
                `media-group-${currentGroup[0].id}`,

              type:
                "MEDIA_GROUP",

              senderId:
                currentGroup[0]
                  .senderId,

              createdAt:
                currentGroup[0]
                  .createdAt,

              medias: [
                ...currentGroup,
              ],
            });
          }

          currentGroup =
            [];
        };

      sorted.forEach(
        (msg) => {

          const isMedia =
            msg.type ===
            "IMAGE";

          if (
            !isMedia
          ) {

            flushGroup();

            finalMessages.push(
              msg
            );

            return;
          }

          if (
            !currentGroup.length
          ) {

            currentGroup.push(
              msg
            );

            return;
          }

          const last =
            currentGroup[
            currentGroup.length -
            1
            ];

          const sameSender =
            last.senderId ===
            msg.senderId;

          const closeTime =
            (
              new Date(
                msg.createdAt
              ) -
              new Date(
                last.createdAt
              )
            ) < 45000;

          if (
            sameSender &&
            closeTime
          ) {

            currentGroup.push(
              msg
            );

          } else {

            flushGroup();

            currentGroup.push(
              msg
            );
          }
        }
      );

      flushGroup();

      return finalMessages;

    }, [messages]);

  // ===============================
  // 🔥 SEND MESSAGE
  // ===============================
  const handleSendMessage =
    useCallback(async () => {

      if (
        !input.trim()
      ) {
        return;
      }

      if (
        !conversation?.id
      ) {
        return;
      }

      try {

        await sendMessage({

          conversationId:
            conversation.id,

          content:
            input.trim(),

          type:
            "TEXT",

          replyToId:
            replyTo?.id ||
            null,
        });

        setInput("");

        setReplyTo(
          null
        );

      } catch (error) {

        console.log(
          error
        );
      }

    }, [

      input,
      conversation,
      sendMessage,
      replyTo,
      setReplyTo,
    ]);

  // ===============================
  // 🔥 MIC
  // ===============================
  const handleMicClick =
    () => {

      setIsRecording(
        true
      );

      timerRef.current =
        setTimeout(() => {

          setIsRecording(
            false
          );

        }, 2000);
    };

  // ===============================
  // 🔥 CLEAR CHAT
  // ===============================
  const handleClearChat =
    () => {

      if (
        !conversation?.id
      ) {
        return;
      }

      clearChat(
        conversation.id
      );

      setShowMenu(
        false
      );
    };

  // ===============================
  // 🔥 EMPTY CHAT
  // ===============================
  if (!chat) {

    return (
      <div className="hidden md:flex items-center justify-center h-full w-full">

        <div className="glass p-8 rounded-2xl text-center max-w-sm">

          <div className="text-4xl mb-3">
            💬
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Welcome to Talksy
          </h2>

          <p className="opacity-60 text-sm">
            Select a conversation
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full overflow-visible bg-[var(--bg)] text-[var(--text)]">

      {/* 🔥 HEADER */}
      <ChatHeader
        chat={chat}
        onBack={onBack}

        navigate={navigate}

        showMenu={showMenu}
        setShowMenu={
          setShowMenu
        }

        menuRef={menuRef}

        isRecording={
          isRecording
        }

        toggleBlockContact={
          toggleBlockContact
        }

        deleteContact={
          deleteContact
        }

        leaveGroup={
          leaveGroup
        }

        setShowAddMembersModal={
          setShowAddMembersModal
        }

        handleClearChat={
          handleClearChat
        }
      />

      {/* 🔥 MESSAGES */}
      <MessageList
        groupedMessages={
          groupedMessages
        }

        chat={chat}

        messagesEndRef={
          messagesEndRef
        }

        // 🔥 VIEWER
        setViewerOpen={
          setViewerOpen
        }

        setViewerMedia={
          setViewerMedia
        }

        setViewerIndex={
          setViewerIndex
        }
      />

      {/* 🔥 REPLY */}
      {replyTo && (
        <div className="px-3 py-2 bg-[var(--card)] border-t border-[var(--border)]">

          <div className="px-3 py-2 bg-[var(--primary)]/10 rounded-2xl flex justify-between items-center text-sm">

            <div className="truncate flex-1">

              <span className="font-semibold">
                Replying:
              </span>{" "}

              {
                replyTo.content
              }

            </div>

            <button
              aria-label="Cancel reply"
              onClick={() =>
                setReplyTo(
                  null
                )
              }
              className="ml-2 opacity-70 hover:opacity-100"
            >

              <FiX />

            </button>

          </div>

        </div>
      )}

      {/* 🔥 INPUT */}
      <ChatInput
        input={input}
        setInput={
          setInput
        }

        inputRef={
          inputRef
        }

        handleSendMessage={
          handleSendMessage
        }

        handleMicClick={
          handleMicClick
        }

        isRecording={
          isRecording
        }

        // 🔥 ATTACH
        showAttach={
          showAttach
        }

        setShowAttach={
          setShowAttach
        }

        attachRef={
          attachRef
        }

        galleryInputRef={
          galleryInputRef
        }

        cameraInputRef={
          cameraInputRef
        }

        fileInputRef={
          fileInputRef
        }

        setPreviewMedia={
          setPreviewMedia
        }

        setPreviewType={
          setPreviewType
        }

        setShowMediaPreview={
          setShowMediaPreview
        }

        setShowCamera={
          setShowCamera
        }

        // 🔥 EMOJI
        showEmoji={
          showEmoji
        }

        setShowEmoji={
          setShowEmoji
        }

        emojiRef={
          emojiRef
        }
      />

      {/* 🔥 MEDIA PREVIEW */}
      <MediaPreviewModal

        setPreviewUrls={
          setPreviewUrls
        }

        showMediaPreview={
          showMediaPreview
        }

        setShowMediaPreview={
          setShowMediaPreview
        }

        previewMedia={
          previewMedia
        }

        setPreviewMedia={
          setPreviewMedia
        }

        previewUrls={
          previewUrls
        }

        previewType={
          previewType
        }

        mediaCaption={
          mediaCaption
        }

        setMediaCaption={
          setMediaCaption
        }

        sendingMedia={
          sendingMedia
        }

        setSendingMedia={
          setSendingMedia
        }

        uploadChatMedia={
          uploadChatMedia
        }

        sendMessage={
          sendMessage
        }

        conversation={
          conversation
        }
      />

      {/* 🔥 VIEWER */}
      <MediaViewerModal
        open={viewerOpen}

        onClose={() =>
          setViewerOpen(
            false
          )
        }

        medias={
          viewerMedia
        }

        selectedIndex={
          viewerIndex
        }

        setSelectedIndex={
          setViewerIndex
        }
      />

      <CameraModal
        open={showCamera}

        onClose={() =>
          setShowCamera(false)
        }

        onCapture={(file) => {

          setPreviewMedia([file]);

          setPreviewType("IMAGE");

          setShowMediaPreview(true);
        }}
      />

      {/* 🔥 ADD MEMBERS */}
      {showAddMembersModal && (
        <AddMembersModal
          group={
            groupDetails ||
            chat
          }

          onClose={() =>
            setShowAddMembersModal(
              false
            )
          }
        />
      )}

    </div>
  );
};

export default ChatWindow;