import { useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

function Splash({ onFinish }) {

  useEffect(() => {

    const timer = setTimeout(() => {

      onFinish();

    }, 2600);

    return () => clearTimeout(timer);

  }, [onFinish]);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0b0f1a] overflow-hidden">

      {/* 🌌 SOFT BACKGROUND GLOW */}
      <div
        className="
          absolute

          w-[220px]
          h-[220px]

          sm:w-[380px]
          sm:h-[380px]

          bg-[#00c896]

          blur-[120px]

          opacity-10

          top-[-60px]
          left-[-60px]
        "
      />

      <div
        className="
          absolute

          w-[220px]
          h-[220px]

          sm:w-[380px]
          sm:h-[380px]

          bg-[#0ea5e9]

          blur-[120px]

          opacity-10

          bottom-[-60px]
          right-[-60px]
        "
      />

      {/* 🧊 OVERLAY */}
      <div className="absolute inset-0 bg-[#0b0f1a]/85 backdrop-blur-sm z-[1]" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">

        {/* 🧠 LOGO */}
        <motion.img
          src={assets.Logo}
          alt="Talksy Logo"
          className="
            w-28
            sm:w-32

            mb-6

            object-contain

            drop-shadow-[0_0_30px_#00c896]
          "
          initial={{
            scale: 0.6,
            opacity: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          transition={{
            duration: 0.7,
            ease: "easeOut",
          }}
          draggable={false}
        />

        {/* ✨ TAGLINE */}
        <motion.p
          className="
            text-white/70

            text-sm
            sm:text-[15px]

            tracking-wide

            mb-10
          "
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
          }}
        >
          Speak Freely. Chat Boldly.
        </motion.p>

        {/* ⚡ PREMIUM LOADER */}
        <div
          className="
            relative

            w-44
            sm:w-52

            h-[3px]

            bg-white/10

            rounded-full

            overflow-hidden
          "
        >

          <motion.div
            className="
              absolute
              inset-0

              bg-gradient-to-r
              from-[#00c896]
              to-[#0ea5e9]
            "
            initial={{
              x: "-100%",
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />

        </div>

      </div>
    </div>
  );
}

export default Splash;