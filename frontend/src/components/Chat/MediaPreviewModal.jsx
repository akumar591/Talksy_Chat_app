import { toast } from "react-hot-toast";

const MediaPreviewModal = ({

    showMediaPreview,
    setShowMediaPreview,

    previewMedia,
    setPreviewMedia,

    previewUrls,
    setPreviewUrls,

    previewType,

    mediaCaption,
    setMediaCaption,

    sendingMedia,
    setSendingMedia,

    uploadChatMedia,
    sendMessage,

    conversation,
}) => {

    if (!showMediaPreview) {
        return null;
    }

    return (
        <div className="fixed
  inset-0

  md:mt-16

  z-[999999]

  bg-black

  flex
  flex-col

  overflow-hidden">

            {/* 🔥 TOP BAR */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">

                {/* 🔥 CLOSE */}
                <button
                    onClick={() => {

                        if (sendingMedia) {
                            return;
                        }

                        setShowMediaPreview(false);

                        setPreviewMedia([]);

                        setPreviewUrls([]);

                        setMediaCaption("");
                    }}
                    className="text-white text-2xl"
                >
                    ✕
                </button>

                {/* 🔥 TITLE */}
                <h2 className="text-sm font-medium text-white">
                    Preview
                </h2>

                {/* 🔥 SEND */}
                <button
                    disabled={
                        sendingMedia ||
                        !previewMedia.length
                    }
                    onClick={async () => {

                        try {

                            setSendingMedia(true);

                            for (const file of previewMedia) {

                                // 🔥 UPLOAD
                                const uploaded =
                                    await uploadChatMedia(file);

                                if (!uploaded?.url) {
                                    continue;
                                }

                                // 🔥 SEND MESSAGE
                                await sendMessage({

                                    conversationId:
                                        conversation.id,

                                    content:
                                        uploaded.url,

                                    type:
                                        previewType,
                                });
                            }

                            // 🔥 CAPTION
                            if (
                                mediaCaption.trim()
                            ) {

                                await sendMessage({

                                    conversationId:
                                        conversation.id,

                                    content:
                                        mediaCaption,

                                    type: "TEXT",
                                });
                            }

                            // 🔥 RESET
                            setShowMediaPreview(false);

                            setPreviewMedia([]);

                            setPreviewUrls([]);

                            setMediaCaption("");

                        } catch (err) {

                            console.log(err);

                            toast.error(
                                "Media send failed"
                            );

                        } finally {

                            setSendingMedia(false);
                        }
                    }}
                    className="
            min-w-[100px]
            h-[42px]

            px-5

            rounded-full

            bg-[var(--primary)]

            text-black
            text-sm
            font-semibold

            flex
            items-center
            justify-center

            disabled:opacity-50

            transition
          "
                >

                    {sendingMedia
                        ? "Sending..."
                        : "Send"}

                </button>

            </div>

            {/* 🔥 MEDIA LIST */}
            <div className="flex-1 overflow-y-auto p-4">

                <div className="grid grid-cols-2 gap-3">

                    {previewMedia.map(
                        (file, index) => (

                            <div
                                key={index}
                                className="relative rounded-2xl overflow-hidden bg-[var(--card)]"
                            >

                                {/* 🔥 REMOVE */}
                                <button
                                    disabled={sendingMedia}
                                    onClick={() => {

                                        setPreviewMedia(
                                            prev =>
                                                prev.filter(
                                                    (_, i) =>
                                                        i !== index
                                                )
                                        );

                                        setPreviewUrls(
                                            prev =>
                                                prev.filter(
                                                    (_, i) =>
                                                        i !== index
                                                )
                                        );
                                    }}
                                    className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-black/70 text-white disabled:opacity-50"
                                >
                                    ✕
                                </button>

                                {/* 🔥 IMAGE */}
                                {previewType === "IMAGE" && (
                                    <img
                                        src={
                                            previewUrls[index]
                                        }
                                        alt=""
                                        loading="lazy"
                                        className="w-full h-[220px] object-cover"
                                    />
                                )}

                                {/* 🔥 VIDEO */}
                                {previewType === "VIDEO" && (
                                    <video
                                        src={
                                            previewUrls[index]
                                        }
                                        controls
                                        className="w-full h-[220px] object-cover"
                                    />
                                )}

                                {/* 🔥 FILE */}
                                {previewType === "FILE" && (
                                    <div className="flex flex-col items-center justify-center h-[220px] text-white">

                                        <div className="text-5xl mb-2">
                                            📄
                                        </div>

                                        <p className="text-xs px-2 text-center break-all">

                                            {file.name}

                                        </p>

                                    </div>
                                )}

                            </div>
                        )
                    )}

                </div>
            </div>

            {/* 🔥 CAPTION */}
            <div className="p-4 border-t border-white/10">

                <input
                    value={mediaCaption}
                    disabled={sendingMedia}
                    onChange={(e) =>
                        setMediaCaption(
                            e.target.value
                        )
                    }
                    placeholder="Add a caption..."
                    className="
            w-full
            px-4
            py-3

            rounded-full

            bg-[var(--card)]

            border
            border-[var(--border)]

            outline-none
            text-sm

            disabled:opacity-50
          "
                />

            </div>

        </div>
    );
};

export default MediaPreviewModal;