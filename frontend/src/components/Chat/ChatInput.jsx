import {
  FiPlus,
  FiSend,
  FiMic,
  FiSmile,
  FiCamera,
  FiImage,
  FiVideo,
  FiFile,
} from "react-icons/fi";

import EmojiPicker from "emoji-picker-react";

const ChatInput = ({

  input,
  setInput,

  inputRef,

  handleSendMessage,

  handleMicClick,

  isRecording,

  // 🔥 CAMERA
  setShowCamera,

  // 🔥 ATTACH
  showAttach,
  setShowAttach,

  attachRef,

  galleryInputRef,
  cameraInputRef,
  fileInputRef,

  setPreviewMedia,
  setPreviewType,
  setShowMediaPreview,

  // 🔥 EMOJI
  showEmoji,
  setShowEmoji,

  emojiRef,

}) => {

  // ===============================
  // 🔥 HANDLE FILES
  // ===============================
  const handleFiles = (
    files,
    type
  ) => {

    if (!files?.length) {
      return;
    }

    setPreviewMedia(
      Array.from(files)
    );

    setPreviewType(type);

    setShowMediaPreview(
      true
    );

    setShowAttach(false);
  };

  return (
    <div className="relative p-3 bg-[var(--card)] border-t border-[var(--border)] bottom-0 overflow-visible">

      {/* =============================== */}
      {/* 🔥 GALLERY INPUT */}
      {/* =============================== */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {

          handleFiles(
            e.target.files,
            "IMAGE"
          );

          e.target.value = "";
        }}
      />

      {/* =============================== */}
      {/* 🔥 VIDEO INPUT */}
      {/* =============================== */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="video/*"
        multiple
        className="hidden"
        onChange={(e) => {

          handleFiles(
            e.target.files,
            "VIDEO"
          );

          e.target.value = "";
        }}
      />

      {/* =============================== */}
      {/* 🔥 FILE INPUT */}
      {/* =============================== */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {

          handleFiles(
            e.target.files,
            "FILE"
          );

          e.target.value = "";
        }}
      />

      {/* =============================== */}
      {/* 🔥 ATTACH MENU */}
      {/* =============================== */}
      {showAttach && (
        <div className="attach-menu absolute bottom-24 left-4 z-[99999] w-64 p-2 rounded-3xl bg-[var(--card)] border border-[var(--border)] shadow-2xl animate-menu backdrop-blur-2xl">

          <div className="grid grid-cols-3 gap-3">

            {/* 🔥 GALLERY */}
            <button
              type="button"
              onClick={() => {

                galleryInputRef.current?.click();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-pink-500/20 flex items-center justify-center">

                <FiImage className="text-pink-400 text-xl" />

              </div>

              <span className="text-[11px]">
                Gallery
              </span>

            </button>

            {/* 🔥 CAMERA */}
            <button
              type="button"
              onClick={() => {

                setShowCamera(
                  true
                );

                setShowAttach(
                  false
                );

                setShowEmoji(
                  false
                );
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">

                <FiVideo className="text-blue-400 text-xl" />

              </div>

              <span className="text-[11px]">
                Camera
              </span>

            </button>

            {/* 🔥 FILE */}
            <button
              type="button"
              onClick={() => {

                fileInputRef.current?.click();
              }}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 transition"
            >

              <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">

                <FiFile className="text-green-400 text-xl" />

              </div>

              <span className="text-[11px]">
                File
              </span>

            </button>

          </div>

        </div>
      )}

      {/* =============================== */}
      {/* 🔥 EMOJI PICKER */}
      {/* =============================== */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="
            absolute
            bottom-20
            left-0

            z-[99999]

            w-[320px]
            max-w-[95vw]

            rounded-[24px]

            overflow-hidden

            hide-scrollbar

            border
            border-[var(--border)]

            shadow-[0_-10px_40px_rgba(0,0,0,0.45)]

            animate-menu
          "
          style={{
            background:
              "var(--card)",
          }}
        >

          {/* 🔥 TOP */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.05)]">

            <h3 className="text-[13px] font-medium opacity-80">
              Emojis
            </h3>

            <button
              onClick={() =>
                setShowEmoji(false)
              }
              className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white/5 transition"
            >
              ✕
            </button>

          </div>

          {/* 🔥 LIVE PREVIEW */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[rgba(255,255,255,0.05)] overflow-x-auto hide-scrollbar">

            <div className="flex items-center gap-1 text-lg whitespace-nowrap">

              {input}

            </div>

          </div>

          {/* 🔥 PICKER */}
          <EmojiPicker
            theme="dark"
            width="100%"
            height={340}
            lazyLoadEmojis
            searchDisabled={false}
            skinTonesDisabled
            previewConfig={{
              showPreview: false,
            }}
            searchPlaceHolder="Search"
            onEmojiClick={(
              emojiData
            ) => {

              setInput(
                prev =>
                  prev +
                  emojiData.emoji
              );

              inputRef.current?.focus();
            }}
          />

        </div>
      )}

      {/* =============================== */}
      {/* 🔥 INPUT ROW */}
      {/* =============================== */}
      <div className="flex items-center gap-2">

        {/* 🔥 ATTACH */}
        <button
          ref={attachRef}
          aria-label="Attach file"
          onClick={() => {

            setShowEmoji(false);

            setShowAttach(
              prev => !prev
            );
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)]/10 transition"
        >

          <FiPlus />

        </button>

        {/* 🔥 INPUT */}
        <div className="flex items-center flex-1 px-3 py-2 rounded-full bg-[var(--bg)] border border-[var(--border)] gap-2">

          {/* 🔥 EMOJI */}
          <button
            type="button"
            onClick={() => {

              setShowAttach(false);

              setShowEmoji(
                prev => !prev
              );
            }}
            className="
              shrink-0

              flex
              items-center
              justify-center

              hover:text-[var(--primary)]

              transition
            "
          >

            <FiSmile />

          </button>

          {/* 🔥 INPUT */}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) =>
              setInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {

              if (
                e.key ===
                "Enter" &&
                !e.shiftKey
              ) {

                e.preventDefault();

                handleSendMessage();
              }
            }}
            placeholder="Message"
            className="flex-1 bg-transparent outline-none text-sm min-w-0"
          />

          {/* 🔥 CAMERA */}
          <button
            type="button"
            onClick={() => {

              setShowCamera(
                true
              );

              setShowAttach(
                false
              );

              setShowEmoji(
                false
              );
            }}
            className="
              shrink-0

              flex
              items-center
              justify-center

              hover:text-[var(--primary)]

              transition
            "
          >

            <FiCamera />

          </button>

        </div>

        {/* 🔥 SEND / MIC */}
        {input.trim() ? (

          <button
            aria-label="Send message"
            onClick={
              handleSendMessage
            }
            className="w-11 h-11 rounded-full bg-[var(--primary)] flex items-center justify-center text-black shadow-lg hover:scale-105 transition shrink-0"
          >

            <FiSend />

          </button>

        ) : (

          <button
            aria-label="Record voice"
            onClick={
              handleMicClick
            }
            className={`w-11 h-11 rounded-full flex items-center justify-center transition shrink-0 ${
              isRecording
                ? "bg-[var(--primary)] text-black"
                : "border border-[var(--border)] hover:bg-[var(--primary)]/20"
            }`}
          >

            <FiMic />

          </button>

        )}

      </div>
    </div>
  );
};

export default ChatInput;