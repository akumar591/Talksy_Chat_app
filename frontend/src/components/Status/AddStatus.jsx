import { useState } from "react";

import {
    FiArrowLeft,
    FiImage,
    FiSend,
    FiEye,
} from "react-icons/fi";

const AddStatus = ({
    onClose,
    onAdd,
}) => {

    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [caption, setCaption] =
        useState("");

    // 🔥 FILE SELECT
    const handleFile = (e) => {

        const selected =
            e.target.files[0];

        if (!selected) return;

        setFile(selected);

        setPreview(
            URL.createObjectURL(
                selected
            )
        );
    };

    // 🔥 UPLOAD STATUS
    const handleUpload = () => {

        if (!file) return;

        const newStatus = {

            id: Date.now(),

            name: "You",

            avatar:
                "https://i.pravatar.cc/150?img=12",

            media: preview,

            type:
                file.type.startsWith(
                    "video"
                )
                    ? "video"
                    : "image",

            caption,

            seen: false,

            time: "Just now",

            viewers: [],
        };

        onAdd(newStatus);
    };

    return (
        <div
            className="
        fixed
        inset-0

        z-[99999]

        bg-black

        flex
        flex-col
      "
        >

            {/* 🔥 TOP BAR */}
            <div
                className="
          flex
          items-center
          justify-between

          px-4
          py-4

          text-white
        "
            >

                {/* 🔥 BACK */}
                <button
                    onClick={onClose}
                    className="
            text-2xl
            cursor-pointer
          "
                >
                    <FiArrowLeft />
                </button>

                {/* 🔥 TITLE */}
                <p className="font-medium">
                    New Status
                </p>

                {/* 🔥 SEND */}
                <button
                    onClick={handleUpload}
                    disabled={!file}
                    className={`
            text-2xl

            transition

            ${file
                            ? "opacity-100"
                            : "opacity-40 cursor-not-allowed"
                        }
          `}
                >
                    <FiSend />
                </button>

            </div>

            {/* 🔥 PREVIEW AREA */}
            <div
                className="
          flex-1

          flex
          items-center
          justify-center

          px-4
          py-4

          overflow-hidden
        "
            >

                {!preview ? (

                    <label
                        className="
              w-full
              max-w-md

              h-[320px]
              md:h-[420px]

              border-2
              border-dashed
              border-white/20

              rounded-3xl

              flex
              flex-col
              items-center
              justify-center

              text-white

              cursor-pointer

              bg-white/5
            "
                    >

                        <FiImage
                            className="
                text-6xl
                mb-4
                opacity-70
              "
                        />

                        <p className="text-sm opacity-70">
                            Select Photo or Video
                        </p>

                        <input
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            onChange={handleFile}
                        />

                    </label>

                ) : (

                    <div
                        className="
              w-full
              h-full

              flex
              items-center
              justify-center
            "
                    >

                        {file?.type.startsWith(
                            "video"
                        ) ? (

                            <video
                                src={preview}
                                controls
                                className="
                  max-h-full
                  max-w-full

                  rounded-2xl

                  object-contain
                "
                            />

                        ) : (

                            <img
                                src={preview}
                                className="
                  max-h-full
                  max-w-full

                  rounded-2xl

                  object-contain
                "
                            />

                        )}

                    </div>

                )}

            </div>

            {/* 🔥 BOTTOM */}
            {preview && (
                <div
                    className="
            px-4
            pb-6
            pt-2
          "
                >

                    {/* 🔥 CAPTION */}
                    <div
                        className="
              flex
              items-center
              gap-3

              bg-white/10

              rounded-full

              px-4
              py-3
            "
                    >

                        <input
                            value={caption}
                            onChange={(e) =>
                                setCaption(
                                    e.target.value
                                )
                            }
                            placeholder="Add a caption..."
                            className="
                flex-1

                bg-transparent

                outline-none

                text-sm
                text-white

                placeholder:text-white/50
              "
                        />

                        <FiEye
                            className="
                text-lg
                opacity-70
              "
                        />

                    </div>

                </div>
            )}

        </div>
    );
};

export default AddStatus;