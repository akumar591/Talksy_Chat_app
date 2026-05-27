import { useRef, useState } from "react";

import {
  FiCheck,
  FiImage,
  FiUpload,
  FiX,
  FiHeart,
  FiMoon,
  FiSun,
} from "react-icons/fi";

import { useTheme } from "../../context/ThemeContext";

import { useChatAppearance } from "../../context/ChatAppearanceContext";

import ImageCropper from "../Common/ImageCropper";

// ===============================
// 🔥 COMPONENT
// ===============================
const WallpaperModal = ({
  open,

  onClose,

  chatKey,
}) => {
  const fileInputRef = useRef(null);

  // ===============================
  // 🔥 CROPPER
  // ===============================
  const [cropImage, setCropImage] = useState(null);

  const [zoom, setZoom] = useState(1);

  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  });

  // ===============================
  // 🔥 THEME
  // ===============================
  const { dark } = useTheme();

  // ===============================
  // 🔥 CONTEXT
  // ===============================
  const {
    WALLPAPERS,

    getWallpaper,

    setWallpaper,

    setCustomWallpaper,
  } = useChatAppearance();

  // ===============================
  // 🔥 FINAL WALLPAPERS
  // ===============================
  const FINAL_WALLPAPERS = WALLPAPERS;

  // ===============================
  // 🔥 CURRENT
  // ===============================
  const currentWallpaper = getWallpaper(chatKey);

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (!open) {
    return null;
  }

  // ===============================
  // 🔥 SELECT
  // ===============================
  const handleSelectWallpaper = (wallpaperId) => {
    setWallpaper(chatKey, wallpaperId);

    onClose();
  };

  // ===============================
  // 🔥 CUSTOM WALLPAPER
  // ===============================
  const handleCustomWallpaper = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 🔥 PREVIEW URL
    const imageUrl = URL.createObjectURL(file);

    // 🔥 OPEN CROPPER
    setCropImage(imageUrl);
  };

  return (
    <div
      className="
        fixed
        inset-0

        z-[9999]

        bg-black/60
        backdrop-blur-md

        flex
        items-center
        justify-center

        p-3
        md:p-6
      "
    >
      {/* =============================== */}
      {/* 🔥 MODAL */}
      {/* =============================== */}
      <div
        className={`
          w-full
          max-w-5xl

          max-h-[92vh]

          overflow-hidden

          rounded-[32px]

          border

          shadow-[0_20px_80px_rgba(0,0,0,0.45)]

          ${
            dark
              ? `
                bg-[#0b1120]
                border-white/10
                text-white
              `
              : `
                bg-white
                border-black/10
                text-black
              `
          }

          md:mt-14
        `}
      >
        {/* =============================== */}
        {/* 🔥 HEADER */}
        {/* =============================== */}
        <div
          className={`
            flex
            items-center
            justify-between

            px-5
            md:px-7

            py-5

            border-b

            ${dark ? "border-white/10" : "border-black/10"}
          `}
        >
          {/* 🔥 LEFT */}
          <div>
            <h2
              className="
                text-[22px]
                font-bold
              "
            >
              Chat Wallpaper
            </h2>

            <p
              className={`
                text-[13px]
                mt-1

                ${dark ? "text-white/60" : "text-black/60"}
              `}
            >
              Customize your conversation 🙂
            </p>
          </div>

          {/* 🔥 CLOSE */}
          <button
            onClick={onClose}
            className={`
              w-10
              h-10

              rounded-full

              flex
              items-center
              justify-center

              transition

              ${dark ? "hover:bg-white/5" : "hover:bg-black/5"}
            `}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* =============================== */}
        {/* 🔥 BODY */}
        {/* =============================== */}
        <div className="overflow-y-auto hide-scrollbar max-h-[78vh] p-5 md:p-7">
          {/* =============================== */}
          {/* 🔥 COLOR THEMES */}
          {/* =============================== */}
          <div className="mb-10">
            <div
              className="
                flex
                items-center
                gap-2

                mb-5
              "
            >
              <FiMoon />

              <h3
                className="
                  font-semibold
                  text-[17px]
                "
              >
                Color Themes
              </h3>
            </div>

            {/* 🔥 COLORS */}
            <div
              className="
                grid

                grid-cols-2
                sm:grid-cols-3
                md:grid-cols-4
                lg:grid-cols-6

                gap-4
              "
            >
              {FINAL_WALLPAPERS.filter((item) => item.type === "gradient").map(
                (wallpaper) => {
                  const isActive = currentWallpaper?.id === wallpaper.id;

                  return (
                    <button
                      key={wallpaper.id}
                      onClick={() => handleSelectWallpaper(wallpaper.id)}
                      className={`
                        relative

                        h-[110px]

                        overflow-hidden

                        rounded-[24px]

                        border

                        transition-all
                        duration-300

                        hover:scale-[1.03]

                        ${dark ? "border-white/10" : "border-black/10"}
                      `}
                    >
                      {/* 🔥 COLOR */}
                      <div
                        className="
                          absolute
                          inset-0
                        "
                        style={{
                          background: wallpaper.background,
                        }}
                      />

                      {/* 🔥 NAME */}
                      <div
                        className="
                          absolute

                          left-3
                          bottom-3
                        "
                      >
                        <p
                          className="
                            text-white
                            text-[12px]
                            font-semibold
                          "
                        >
                          {wallpaper.name}
                        </p>
                      </div>

                      {/* 🔥 ACTIVE */}
                      {isActive && (
                        <div
                          className="
                            absolute

                            top-3
                            right-3

                            w-7
                            h-7

                            rounded-full

                            bg-white

                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FiCheck
                            className="
                              text-black
                            "
                          />
                        </div>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* =============================== */}
          {/* 🔥 IMAGE WALLPAPERS */}
          {/* =============================== */}
          <div className="mb-10">
            <div
              className="
                flex
                items-center
                gap-2

                mb-5
              "
            >
              <FiImage />

              <h3
                className="
                  font-semibold
                  text-[17px]
                "
              >
                Image Wallpapers
              </h3>
            </div>

            {/* 🔥 GRID */}
            <div
              className="
                grid

                grid-cols-2
                md:grid-cols-3
                lg:grid-cols-5

                gap-4
              "
            >
              {FINAL_WALLPAPERS.filter((item) => item.type === "image").map(
                (wallpaper) => {
                  const isActive = currentWallpaper?.id === wallpaper.id;

                  return (
                    <button
                      key={wallpaper.id}
                      onClick={() => handleSelectWallpaper(wallpaper.id)}
                      className={`
                        relative

                        h-[220px]

                        overflow-hidden

                        rounded-[26px]

                        border

                        hover:scale-[1.03]

                        transition-all
                        duration-300

                        ${dark ? "border-white/10" : "border-black/10"}
                      `}
                    >
                      {/* 🔥 IMAGE */}
                      <div
                        className="
                          absolute
                          inset-0
                        "
                        style={{
                          backgroundImage: `
                            linear-gradient(
                              rgba(0,0,0,0.2),
                              rgba(0,0,0,0.35)
                            ),
                            url(${wallpaper.image})
                            `,

                          backgroundSize: "cover",

                          backgroundPosition: "center",
                        }}
                      />

                      {/* 🔥 NAME */}
                      <div
                        className="
                          absolute

                          left-3
                          bottom-3
                        "
                      >
                        <p
                          className="
                            text-white
                            text-[13px]
                            font-semibold
                          "
                        >
                          {wallpaper.name}
                        </p>
                      </div>

                      {/* 🔥 ACTIVE */}
                      {isActive && (
                        <div
                          className="
                            absolute

                            top-3
                            right-3

                            w-7
                            h-7

                            rounded-full

                            bg-white

                            flex
                            items-center
                            justify-center
                          "
                        >
                          <FiCheck
                            className="
                              text-black
                            "
                          />
                        </div>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* =============================== */}
          {/* 🔥 CUSTOM UPLOAD */}
          {/* =============================== */}
          <div>
            <div
              className="
                flex
                items-center
                gap-2

                mb-5
              "
            >
              <FiHeart />

              <h3
                className="
                  font-semibold
                  text-[17px]
                "
              >
                Your Wallpaper
              </h3>
            </div>

            {/* 🔥 UPLOAD */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full

                rounded-[28px]

                border-2
                border-dashed

                p-8

                flex
                flex-col

                items-center
                justify-center

                gap-4

                transition-all
                duration-300

                ${
                  dark
                    ? `
                      border-white/10
                      hover:border-[var(--primary)]
                      hover:bg-white/5
                    `
                    : `
                      border-black/10
                      hover:border-[var(--primary)]
                      hover:bg-black/[0.03]
                    `
                }
              `}
            >
              {/* 🔥 ICON */}
              <div
                className="
                  w-16
                  h-16

                  rounded-full

                  bg-[var(--primary)]/10

                  flex
                  items-center
                  justify-center
                "
              >
                <FiUpload size={28} />
              </div>

              {/* 🔥 TEXT */}
              <div
                className="
                  text-center
                "
              >
                <p
                  className="
                    font-semibold
                    text-[16px]
                  "
                >
                  Upload Custom Wallpaper
                </p>

                <p
                  className={`
                    text-[13px]
                    mt-1

                    ${dark ? "text-white/60" : "text-black/60"}
                  `}
                >
                  Crop & fit support coming 🙂
                </p>
              </div>
            </button>

            {/* 🔥 INPUT */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleCustomWallpaper}
            />
          </div>

          {/* =============================== */}
          {/* 🔥 IMAGE CROPPER */}
          {/* =============================== */}
          {cropImage && (
            <div
              className="
      fixed
      inset-0

      z-[10000]

      bg-black/90

      flex
      items-center
      justify-center

      p-3
    "
            >
              <div
                className="
        relative

        w-full
        max-w-5xl

        h-[85vh]

        rounded-[32px]

        overflow-hidden
      "
              >
                <ImageCropper
                  image={cropImage}
                  aspect={1.8}
                  crop={crop}
                  setCrop={setCrop}
                  zoom={zoom}
                  setZoom={setZoom}
                  cropShape="rect"
                  showGrid={false}
                  onCropDone={(croppedFile) => {
                    // 🔥 CROPPED URL
                    // 🔥 FILE READER
                    const reader = new FileReader();

                    reader.onloadend = () => {
                      // 🔥 BASE64
                      const base64Image = reader.result;

                      // 🔥 SAVE
                      setCustomWallpaper(
                        chatKey,

                        base64Image,
                      );

                      // 🔥 RESET
                      setCropImage(null);

                      setZoom(1);

                      setCrop({
                        x: 0,
                        y: 0,
                      });

                      // 🔥 CLOSE
                      onClose();
                    };

                    // 🔥 READ
                    reader.readAsDataURL(croppedFile);

                    // 🔥 SAVE
                    setCustomWallpaper(
                      chatKey,

                      croppedUrl,
                    );

                    // 🔥 RESET
                    setCropImage(null);

                    setZoom(1);

                    setCrop({
                      x: 0,
                      y: 0,
                    });

                    // 🔥 CLOSE
                    onClose();
                  }}
                />

                {/* 🔥 CANCEL */}
                <button
                  onClick={() => {
                    setCropImage(null);

                    setZoom(1);

                    setCrop({
                      x: 0,
                      y: 0,
                    });
                  }}
                  className="
                    absolute

                    top-5
                    left-5

                    z-[10001]

                    px-5
                    py-2.5

                    rounded-full

                    bg-white/10
                    backdrop-blur-xl

                    border
                    border-white/10

                    text-white
                    text-sm
                    font-medium
                  "
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WallpaperModal;
