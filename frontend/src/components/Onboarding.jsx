import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";

const slides = [
  {
    title: "Welcome to Talksy",
    desc: "Fast • Secure • Private Conversations",
  },
  {
    title: "Chat Freely",
    desc: "Express yourself with confidence and ease",
  },
  {
    title: "Your Privacy Matters",
    desc: "End-to-end security built to protect your conversations",
  },
];

function Onboarding({ onFinish }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    if (index < slides.length - 1) {
      setIndex(index + 1);
    } else {
      localStorage.setItem("seenOnboarding", "true");
      onFinish();
    }
  };

  return (
    <div className="relative h-screen flex items-center justify-center bg-[#0b0f1a] text-white overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#00c896] blur-[120px] sm:blur-[140px] opacity-10 sm:opacity-20 
      top-[-80px] left-[-80px]" />

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#0ea5e9] blur-[120px] sm:blur-[140px] opacity-10 sm:opacity-20 
      bottom-[-80px] right-[-80px]" />

      {/* 🧊 OVERLAY */}
      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-sm z-[1]" />

      {/* 🔥 CONTENT */}
      <div className="relative z-10 w-full max-w-sm px-6 text-center">

        {/* 🧠 LOGO (LOGIN STYLE ANIMATION) */}
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={assets.Logo}
            alt="logo"
            className="w-32 mx-auto mb-6 drop-shadow-[0_0_30px_#00c896]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          />
        </AnimatePresence>

        {/* 🔄 TEXT (LOGIN STYLE) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-semibold mb-2 bg-gradient-to-r from-[#00c896] to-[#0ea5e9] bg-clip-text text-transparent">
              {slides[index].title}
            </h1>

            <p className="text-white/70 mb-10 text-sm leading-relaxed">
              {slides[index].desc}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* 🔘 DOTS */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`transition-all duration-200 ${
                i === index
                  ? "w-6 h-2 bg-gradient-to-r from-[#00c896] to-[#0ea5e9] rounded-full"
                  : "w-2 h-2 bg-white/20 rounded-full"
              }`}
            />
          ))}
        </div>

        {/* 🚀 BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          onClick={next}
          className="w-[85%] mx-auto py-2 rounded-full text-sm font-medium text-black 
          bg-gradient-to-r from-[#00c896] to-[#0ea5e9]
          shadow-[0_4px_20px_rgba(0,200,150,0.35)]"
        >
          {index === slides.length - 1 ? "Get Started →" : "Next →"}
        </motion.button>

      </div>
    </div>
  );
}

export default Onboarding;