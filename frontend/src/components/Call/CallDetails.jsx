import { useState } from "react";
import {
  FiPhoneOff,
  FiMic,
  FiVideo,
  FiVolume2,
  FiCamera,
} from "react-icons/fi";

const CallDetails = ({ call, onEnd }) => {
  const [mute, setMute] = useState(false);
  const [videoOn, setVideoOn] = useState(true);

  return (
    <div className="relative w-full h-full bg-black text-white flex flex-col items-center justify-center overflow-hidden">

      {/* 🔥 VIDEO MODE */}
      {call.type === "video" ? (
        <>
          <video
            autoPlay
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          {/* self preview */}
          <div className="absolute top-5 right-4 w-24 h-36 bg-gray-800 rounded-xl overflow-hidden border border-white/20">
            <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
              You
            </div>
          </div>
        </>
      ) : (
        /* 🔥 AUDIO MODE */
        <>
          {/* gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-black" />

          {/* animated avatar */}
          <div className="relative z-10 flex flex-col items-center">

            <div className="relative">
              <img
                src={call.avatar}
                className="w-32 h-32 rounded-full object-cover shadow-2xl"
              />

              {/* pulse animation */}
              <span className="absolute inset-0 rounded-full border border-white/20 animate-ping" />
            </div>

          </div>
        </>
      )}

      {/* 🔥 TOP INFO */}
      <div className="absolute top-10 text-center z-20">
        <h2 className="text-xl font-semibold">{call.name}</h2>
        <p className="text-sm opacity-70 mt-1">
          {call.type === "video" ? "Video Calling..." : "Calling..."}
        </p>
      </div>

      {/* 🔥 CONTROLS */}
      <div className="absolute bottom-10 flex gap-6 z-20">

        {/* MIC */}
        <button
          onClick={() => setMute(!mute)}
          className={`
            p-4 rounded-full backdrop-blur-md border
            ${mute ? "bg-red-500/20 border-red-400" : "bg-white/10 border-white/20"}
          `}
        >
          <FiMic />
        </button>

        {/* SPEAKER */}
        <button className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <FiVolume2 />
        </button>

        {/* VIDEO */}
        {call.type === "video" && (
          <button
            onClick={() => setVideoOn(!videoOn)}
            className={`
              p-4 rounded-full backdrop-blur-md border
              ${!videoOn ? "bg-red-500/20 border-red-400" : "bg-white/10 border-white/20"}
            `}
          >
            <FiCamera />
          </button>
        )}

        {/* END CALL */}
        <button
          onClick={onEnd}
          className="p-5 rounded-full bg-red-500 shadow-lg hover:scale-110 transition"
        >
          <FiPhoneOff className="text-lg" />
        </button>

      </div>

    </div>
  );
};

export default CallDetails;