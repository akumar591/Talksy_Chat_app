import {
    useState,
    useEffect,
    useRef,
} from "react";

import {
    FiArrowLeft,
    FiImage,
    FiSend,
    FiPlus,
    FiMove,
} from "react-icons/fi";

import Cropper from "react-easy-crop";

import toast from "react-hot-toast";

import {
    useStatus,
} from "../../context/StatusContext";

const AddStatus = ({
    onClose,
}) => {

    // ===============================
    // 🔥 STATUS CONTEXT
    // ===============================
    const {

        createStatus,

        uploading,

    } = useStatus();

    // ===============================
    // 🔥 STATES
    // ===============================
    const [file, setFile] =
        useState(null);

    const [preview, setPreview] =
        useState("");

    const [caption, setCaption] =
        useState("");

    // 🔥 CROPPER
    const [crop, setCrop] =
        useState({
            x: 0,
            y: 0,
        });

    const [zoom, setZoom] =
        useState(1);

    const [showCrop, setShowCrop] =
        useState(false);

    const fileInputRef =
        useRef();

    // ===============================
    // 🔥 CLEANUP
    // ===============================
    useEffect(() => {

        return () => {

            if (
                preview &&
                preview.startsWith(
                    "blob:"
                )
            ) {

                URL.revokeObjectURL(
                    preview
                );
            }
        };

    }, [preview]);

    // ===============================
    // 🔥 FILE SELECT
    // ===============================
    const handleFile = (e) => {

        const selected =
            e.target.files?.[0];

        if (!selected) return;

        // 🔥 RESET INPUT
        e.target.value = "";

        // ===============================
        // 🔥 VALIDATION
        // ===============================
        const isImage =
            selected.type.startsWith(
                "image"
            );

        const isVideo =
            selected.type.startsWith(
                "video"
            );

        if (
            !isImage &&
            !isVideo
        ) {

            toast.error(
                "Only image/video allowed"
            );

            return;
        }

        // 🔥 IMAGE LIMIT
        if (

            isImage &&

            selected.size >
            10 * 1024 * 1024

        ) {

            toast.error(
                "Image too large (10MB max)"
            );

            return;
        }

        // 🔥 VIDEO LIMIT
        if (

            isVideo &&

            selected.size >
            50 * 1024 * 1024

        ) {

            toast.error(
                "Video too large (50MB max)"
            );

            return;
        }

        // 🔥 REMOVE OLD PREVIEW
        if (
            preview &&
            preview.startsWith(
                "blob:"
            )
        ) {

            URL.revokeObjectURL(
                preview
            );
        }

        setPreview("");

        setFile(selected);

        const blobUrl =
            URL.createObjectURL(
                selected
            );

        setPreview(blobUrl);

        // 🔥 ONLY IMAGE CROPPER
        setShowCrop(
            isImage
        );
    };

    // ===============================
    // 🔥 CREATE STATUS
    // ===============================
    const handleUpload =
        async () => {

            try {

                if (
                    uploading
                ) return;

                // 🔥 EMPTY CHECK
                if (
                    !file &&
                    !caption.trim()
                ) {

                    toast.error(
                        "Add image/video or text"
                    );

                    return;
                }

                // ===============================
                // 🔥 STATUS TYPE
                // ===============================
                let type =
                    "TEXT";

                if (file) {

                    type =
                        file.type.startsWith(
                            "video"
                        )

                            ?

                            "VIDEO"

                            :

                            "IMAGE";
                }

                // ===============================
                // 🔥 CREATE STATUS
                // ===============================
                const result =

                    await createStatus({

                        file,

                        caption,

                        type,
                    });

                if (
                    !result?.success
                ) {

                    return;
                }

                onClose();

            } catch (err) {

                console.log(err);

                toast.error(
                    "Failed to upload status"
                );
            }
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
                    disabled={uploading}
                    className="
                        text-2xl
                        cursor-pointer

                        disabled:opacity-50
                    "
                >

                    <FiArrowLeft />

                </button>

                {/* 🔥 TITLE */}
                <p className="font-medium">

                    {uploading

                        ?

                        "Uploading..."

                        :

                        "New Status"}

                </p>

                {/* 🔥 EMPTY SPACE */}
                <div className="w-6" />

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
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,video/*"
                            hidden
                            onChange={handleFile}
                        />

                    </label>

                ) : (

                    <div
                        className="
                            relative

                            w-full
                            h-full

                            flex
                            items-center
                            justify-center
                        "
                    >

                        {/* 🔥 IMAGE CROPPER */}
                        {file?.type.startsWith(
                            "image"
                        ) ? (

                            <div
                                className="
                                    relative

                                    w-full
                                    h-full

                                    rounded-2xl
                                    overflow-hidden
                                "
                            >

                                <Cropper
                                    image={preview}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={9 / 16}
                                    onCropChange={
                                        setCrop
                                    }
                                    onZoomChange={
                                        setZoom
                                    }
                                    cropShape="rect"
                                    showGrid={false}
                                />

                                {/* 🔥 ZOOM CONTROL */}
                                <div
                                    className="
                                        absolute
                                        bottom-5
                                        left-1/2
                                        -translate-x-1/2

                                        w-[80%]

                                        px-4 py-3

                                        rounded-2xl

                                        bg-black/40
                                        backdrop-blur-md

                                        flex
                                        items-center
                                        gap-3

                                        z-50
                                    "
                                >

                                    <FiMove className="text-white" />

                                    <input
                                        type="range"
                                        min={1}
                                        max={3}
                                        step={0.1}
                                        value={zoom}
                                        onChange={(e) =>
                                            setZoom(
                                                Number(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        className="
                                            w-full
                                            accent-[var(--primary)]
                                        "
                                    />

                                </div>

                            </div>

                        ) : (

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

                        )}

                        {/* 🔥 CHANGE FILE */}
                        <button
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="
                                absolute
                                top-4
                                right-4

                                z-50

                                w-11 h-11

                                rounded-full

                                bg-black/40
                                backdrop-blur-md

                                border
                                border-white/10

                                text-white

                                flex
                                items-center
                                justify-center

                                hover:scale-110

                                transition
                            "
                        >

                            <FiPlus />

                        </button>

                    </div>

                )}

            </div>

            {/* 🔥 BOTTOM */}
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

                    {/* 🔥 SEND BUTTON */}
                    <button
                        onClick={
                            handleUpload
                        }
                        disabled={
                            uploading
                        }
                        className={`
                            w-11 h-11

                            rounded-full

                            flex
                            items-center
                            justify-center

                            bg-[var(--primary)]

                            text-white

                            transition

                            ${uploading

                                ?

                                "opacity-50 cursor-not-allowed"

                                :

                                "hover:scale-105"
                            }
                        `}
                    >

                        {uploading ? (

                            <div
                                className="
                                    w-5 h-5

                                    border-2
                                    border-white/30

                                    border-t-white

                                    rounded-full

                                    animate-spin
                                "
                            />

                        ) : (

                            <FiSend className="text-lg" />

                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default AddStatus;