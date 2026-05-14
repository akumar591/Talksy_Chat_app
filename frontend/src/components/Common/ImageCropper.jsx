import { useState, useCallback } from "react";

import Cropper from "react-easy-crop";

import { FiMove } from "react-icons/fi";

// =====================================
// 🔥 CREATE IMAGE
// =====================================
const createImage = (url) =>
  new Promise((resolve, reject) => {

    const image =
      new Image();

    image.addEventListener(
      "load",
      () => resolve(image)
    );

    image.addEventListener(
      "error",
      (error) =>
        reject(error)
    );

    image.setAttribute(
      "crossOrigin",
      "anonymous"
    );

    image.src = url;
  });

// =====================================
// 🔥 GET CROPPED IMAGE
// =====================================
export const getCroppedImg =
  async (
    imageSrc,
    pixelCrop
  ) => {

    const image =
      await createImage(
        imageSrc
      );

    const canvas =
      document.createElement(
        "canvas"
      );

    const ctx =
      canvas.getContext("2d");

    // 🔥 SAFETY
    if (
      !ctx ||
      !pixelCrop
    ) {

      return null;
    }

    canvas.width =
      pixelCrop.width;

    canvas.height =
      pixelCrop.height;

    ctx.drawImage(

      image,

      pixelCrop.x,
      pixelCrop.y,

      pixelCrop.width,
      pixelCrop.height,

      0,
      0,

      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise(
      (resolve) => {

        canvas.toBlob(

          (blob) => {

            // ❌ FAILED
            if (!blob) {

              resolve(
                null
              );

              return;
            }

            // 🔥 REAL FILE
            const file =
              new File(
                [blob],
                "cropped.jpeg",
                {
                  type:
                    "image/jpeg",
                }
              );

            resolve(
              file
            );
          },

          "image/jpeg",

          0.95
        );
      }
    );
  };

const ImageCropper = ({
  image,

  aspect = 1 / 1,

  cropShape = "rect",

  zoom = 1,

  setZoom = () => {},

  crop,

  setCrop,

  onCropComplete = () => {},

  onCropDone = () => {},

  minZoom = 1,

  maxZoom = 3,

  showGrid = false,
}) => {

  // =====================================
  // 🔥 INTERNAL CROP
  // =====================================
  const [
    internalCrop,
    setInternalCrop,
  ] = useState({
    x: 0,
    y: 0,
  });

  // =====================================
  // 🔥 CROPPED AREA
  // =====================================
  const [
    croppedAreaPixels,
    setCroppedAreaPixels,
  ] = useState(null);

  const finalCrop =
    crop ||
    internalCrop;

  const finalSetCrop =
    setCrop ||
    setInternalCrop;

  // =====================================
  // 🔥 CROP COMPLETE
  // =====================================
  const handleCropComplete =
    useCallback(

      (
        croppedArea,
        croppedPixels
      ) => {

        setCroppedAreaPixels(
          croppedPixels
        );

        onCropComplete(
          croppedArea,
          croppedPixels
        );
      },

      [onCropComplete]
    );

  // =====================================
  // 🔥 HANDLE DONE
  // =====================================
  const handleDone =
    async () => {

      try {

        // ❌ NO AREA
        if (
          !croppedAreaPixels
        ) {

          return;
        }

        // 🔥 CREATE FILE
        const croppedFile =
          await getCroppedImg(
            image,
            croppedAreaPixels
          );

        // ❌ INVALID FILE
        if (
          !croppedFile ||
          !(
            croppedFile instanceof
            File
          )
        ) {

          console.log(
            "INVALID FILE"
          );

          return;
        }

        console.log(
          "CROPPED FILE:",
          croppedFile
        );

        // 🔥 SEND FILE
        onCropDone(
          croppedFile
        );

      } catch (err) {

        console.log(
          "Crop Error:",
          err
        );
      }
    };

  return (
    <div
      className="
        relative

        w-full
        h-full

        overflow-hidden
        rounded-2xl

        bg-black
      "
    >

      {/* 🔥 CROPPER */}
      <Cropper
        image={image}
        crop={finalCrop}
        zoom={zoom}
        aspect={aspect}
        cropShape={cropShape}
        showGrid={showGrid}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onCropChange={
          finalSetCrop
        }
        onZoomChange={
          setZoom
        }
        onCropComplete={
          handleCropComplete
        }
      />

      {/* 🔥 ZOOM */}
      <div
        className="
          absolute

          bottom-5
          left-1/2
          -translate-x-1/2

          w-[85%]

          px-4
          py-3

          rounded-2xl

          bg-black/40
          backdrop-blur-xl

          border
          border-white/10

          flex
          items-center
          gap-3

          z-50
        "
      >

        <FiMove
          className="
            text-white
            shrink-0
          "
        />

        <input
          type="range"
          min={minZoom}
          max={maxZoom}
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

            cursor-pointer
          "
        />

      </div>

      {/* 🔥 DONE */}
      <button
        type="button"
        onClick={handleDone}
        className="
          absolute

          top-5
          right-5

          z-50

          px-5
          py-2

          rounded-full

          bg-[var(--primary)]

          text-white
          text-sm
          font-medium

          shadow-lg
        "
      >
        Done
      </button>

    </div>
  );
};

export default ImageCropper;