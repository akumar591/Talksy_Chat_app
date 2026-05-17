import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FiX,
  FiCamera,
  FiRefreshCw,
  FiVideo,
  FiStopCircle,
} from "react-icons/fi";

const CameraModal = ({

  open,
  onClose,

  onCapture,

}) => {

  // ===============================
  // 🔥 REFS
  // ===============================
  const videoRef =
    useRef(null);

  const canvasRef =
    useRef(null);

  const streamRef =
    useRef(null);

  const mediaRecorderRef =
    useRef(null);

  const chunksRef =
    useRef([]);

  // ===============================
  // 🔥 STATES
  // ===============================
  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    capturedImage,
    setCapturedImage,
  ] = useState(null);

  const [
    recordedVideo,
    setRecordedVideo,
  ] = useState(null);

  const [
    isRecording,
    setIsRecording,
  ] = useState(false);

  // ===============================
  // 🔥 OPEN CAMERA
  // ===============================
  const startCamera =
    async () => {

      try {

        setLoading(true);

        setError("");

        // 🔥 STOP OLD STREAM
        if (
          streamRef.current
        ) {

          streamRef.current
            .getTracks()
            .forEach(track =>
              track.stop()
            );
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({

            video: {
              facingMode:
                "environment",
            },

            audio: true,
          });

        streamRef.current =
          stream;

        if (
          videoRef.current
        ) {

          videoRef.current.srcObject =
            stream;
        }

      } catch (err) {

        console.log(err);

        setError(
          "Unable to access camera"
        );

      } finally {

        setLoading(false);
      }
    };

  // ===============================
  // 🔥 STOP CAMERA
  // ===============================
  const stopCamera =
    () => {

      if (
        streamRef.current
      ) {

        streamRef.current
          .getTracks()
          .forEach(track =>
            track.stop()
          );

        streamRef.current =
          null;
      }
    };

  // ===============================
  // 🔥 OPEN EFFECT
  // ===============================
  useEffect(() => {

    if (open) {

      startCamera();

    } else {

      stopCamera();

      setCapturedImage(
        null
      );

      setRecordedVideo(
        null
      );
    }

    return () => {

      stopCamera();
    };

  }, [open]);

  // ===============================
  // 🔥 CAPTURE IMAGE
  // ===============================
  const handleCapture =
    () => {

      if (
        !videoRef.current ||
        !canvasRef.current
      ) {
        return;
      }

      const video =
        videoRef.current;

      const canvas =
        canvasRef.current;

      const ctx =
        canvas.getContext(
          "2d"
        );

      const width =
        video.videoWidth;

      const height =
        video.videoHeight;

      // 🔥 PORTRAIT FIX
      if (height > width) {

        canvas.width =
          height;

        canvas.height =
          width;

        ctx.save();

        ctx.translate(
          canvas.width / 2,
          canvas.height / 2
        );

        ctx.rotate(
          90 * Math.PI / 180
        );

        ctx.drawImage(
          video,
          -width / 2,
          -height / 2,
          width,
          height
        );

        ctx.restore();

      } else {

        canvas.width =
          width;

        canvas.height =
          height;

        ctx.drawImage(
          video,
          0,
          0,
          width,
          height
        );
      }

      const image =
        canvas.toDataURL(
          "image/jpeg",
          1
        );

      setCapturedImage(
        image
      );
    };

  // ===============================
  // 🔥 START RECORDING
  // ===============================
  const startRecording =
    () => {

      if (
        !streamRef.current
      ) {
        return;
      }

      chunksRef.current =
        [];

      const mediaRecorder =
        new MediaRecorder(
          streamRef.current
        );

      mediaRecorderRef.current =
        mediaRecorder;

      mediaRecorder.ondataavailable =
        (e) => {

          if (
            e.data.size > 0
          ) {

            chunksRef.current.push(
              e.data
            );
          }
        };

      mediaRecorder.onstop =
        () => {

          const blob =
            new Blob(
              chunksRef.current,
              {
                type:
                  "video/webm",
              }
            );

          const url =
            URL.createObjectURL(
              blob
            );

          setRecordedVideo(
            {
              blob,
              url,
            }
          );
        };

      mediaRecorder.start();

      setIsRecording(
        true
      );
    };

  // ===============================
  // 🔥 STOP RECORDING
  // ===============================
  const stopRecording =
    () => {

      if (
        mediaRecorderRef.current &&
        isRecording
      ) {

        mediaRecorderRef.current.stop();

        setIsRecording(
          false
        );
      }
    };

  // ===============================
  // 🔥 SEND IMAGE
  // ===============================
  const handleSendImage =
    async () => {

      if (
        !capturedImage
      ) {
        return;
      }

      const response =
        await fetch(
          capturedImage
        );

      const blob =
        await response.blob();

      const file =
        new File(
          [blob],
          `camera-${Date.now()}.jpg`,
          {
            type:
              "image/jpeg",
          }
        );

      onCapture(file);

      handleClose();
    };

  // ===============================
  // 🔥 SEND VIDEO
  // ===============================
  const handleSendVideo =
    async () => {

      if (
        !recordedVideo
      ) {
        return;
      }

      const file =
        new File(
          [recordedVideo.blob],
          `video-${Date.now()}.webm`,
          {
            type:
              "video/webm",
          }
        );

      onCapture(file);

      handleClose();
    };

  // ===============================
  // 🔥 CLOSE
  // ===============================
  const handleClose =
    () => {

      stopCamera();

      setCapturedImage(
        null
      );

      setRecordedVideo(
        null
      );

      setIsRecording(
        false
      );

      onClose();
    };

  // ===============================
  // 🔥 RETAKE
  // ===============================
  const handleRetake =
    () => {

      setCapturedImage(
        null
      );

      setRecordedVideo(
        null
      );

      startCamera();
    };

  // ===============================
  // 🔥 HIDE
  // ===============================
  if (!open) {
    return null;
  }

  return (
    <div className="
      fixed
      inset-0

      z-[999999]

      bg-black/80
      backdrop-blur-md

      flex
      items-center
      justify-center

      p-4
    ">

      {/* =============================== */}
      {/* 🔥 MODAL */}
      {/* =============================== */}
      <div className="
        relative

        w-full
        max-w-xl

        rounded-[32px]

        overflow-hidden

        border
        border-[var(--border)]

        bg-[var(--card)]

        shadow-[0_20px_60px_rgba(0,0,0,0.45)]
      ">

        {/* =============================== */}
        {/* 🔥 HEADER */}
        {/* =============================== */}
        <div className="
          flex
          items-center
          justify-between

          px-5
          py-4

          border-b
          border-[var(--border)]
        ">

          <h2 className="
            text-base
            font-semibold
          ">
            Camera
          </h2>

          <button
            onClick={
              handleClose
            }
            className="
              w-10
              h-10

              rounded-full

              flex
              items-center
              justify-center

              hover:bg-white/5

              transition
            "
          >

            <FiX size={20} />

          </button>

        </div>

        {/* =============================== */}
        {/* 🔥 BODY */}
        {/* =============================== */}
        <div className="
          relative

          aspect-video

          bg-black

          flex
          items-center
          justify-center
        ">

          {/* 🔥 LOADING */}
          {loading && (
            <div className="
              absolute
              inset-0

              flex
              items-center
              justify-center

              text-sm
              opacity-70
            ">
              Opening camera...
            </div>
          )}

          {/* 🔥 ERROR */}
          {error && (
            <div className="
              absolute
              inset-0

              flex
              items-center
              justify-center

              text-red-400
              text-sm
            ">
              {error}
            </div>
          )}

          {/* 🔥 LIVE CAMERA */}
          {!capturedImage &&
            !recordedVideo && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="
                w-full
                h-full

                object-cover
              "
            />
          )}

          {/* 🔥 CAPTURED IMAGE */}
          {capturedImage && (
            <img
              src={capturedImage}
              alt="Captured"
              className="
                w-full
                h-full

                object-cover
              "
            />
          )}

          {/* 🔥 RECORDED VIDEO */}
          {recordedVideo && (
            <video
              src={
                recordedVideo.url
              }
              controls
              autoPlay
              className="
                w-full
                h-full

                object-cover
              "
            />
          )}

          {/* 🔥 HIDDEN CANVAS */}
          <canvas
            ref={canvasRef}
            className="hidden"
          />

        </div>

        {/* =============================== */}
        {/* 🔥 FOOTER */}
        {/* =============================== */}
        <div className="
          flex
          items-center
          justify-center
          gap-4

          px-5
          py-5
        ">

          {/* 🔥 RETAKE */}
          {(capturedImage ||
            recordedVideo) && (
            <button
              onClick={
                handleRetake
              }
              className="
                w-14
                h-14

                rounded-full

                border
                border-[var(--border)]

                flex
                items-center
                justify-center

                hover:bg-white/5

                transition
              "
            >

              <FiRefreshCw size={22} />

            </button>
          )}

          {/* 🔥 PHOTO */}
          {!capturedImage &&
            !recordedVideo &&
            !isRecording && (
            <button
              onClick={
                handleCapture
              }
              className="
                w-20
                h-20

                rounded-full

                bg-[var(--primary)]

                text-black

                flex
                items-center
                justify-center

                shadow-[0_10px_30px_rgba(0,0,0,0.25)]

                hover:scale-105

                transition
              "
            >

              <FiCamera size={30} />

            </button>
          )}

          {/* 🔥 START RECORD */}
          {!capturedImage &&
            !recordedVideo &&
            !isRecording && (
            <button
              onClick={
                startRecording
              }
              className="
                w-16
                h-16

                rounded-full

                bg-red-500

                text-white

                flex
                items-center
                justify-center

                hover:scale-105

                transition
              "
            >

              <FiVideo size={26} />

            </button>
          )}

          {/* 🔥 STOP RECORD */}
          {isRecording && (
            <button
              onClick={
                stopRecording
              }
              className="
                w-20
                h-20

                rounded-full

                bg-red-600

                text-white

                animate-pulse

                flex
                items-center
                justify-center

                shadow-[0_10px_30px_rgba(255,0,0,0.35)]

                transition
              "
            >

              <FiStopCircle size={32} />

            </button>
          )}

          {/* 🔥 SEND IMAGE */}
          {capturedImage && (
            <button
              onClick={
                handleSendImage
              }
              className="
                px-6
                h-14

                rounded-full

                bg-[var(--primary)]

                text-black
                font-semibold

                hover:scale-[1.02]

                transition
              "
            >

              Send

            </button>
          )}

          {/* 🔥 SEND VIDEO */}
          {recordedVideo && (
            <button
              onClick={
                handleSendVideo
              }
              className="
                px-6
                h-14

                rounded-full

                bg-[var(--primary)]

                text-black
                font-semibold

                hover:scale-[1.02]

                transition
              "
            >

              Send Video

            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default CameraModal;