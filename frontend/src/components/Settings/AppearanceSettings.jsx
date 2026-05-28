import React, { useState } from "react";

import { useTheme } from "../../context/ThemeContext";

import { useSettings } from "../../context/SettingsContext";

import { useNavigate } from "react-router-dom";

import { FiArrowLeft, FiCheck, FiChevronRight } from "react-icons/fi";

// ======================================
// 🔥 FONT OPTIONS
// ======================================
const FONT_OPTIONS = [
  "Default",
  "Poppins",
  "Inter",
  "Montserrat",
  "Nunito",
  "Outfit",
  "Urbanist",
  "Rubik",
  "Manrope",
  "Pacifico",
  "DancingScript",
  "Satisfy",
  "Caveat",
];

// ======================================
// 🔥 FONT FAMILY
// ======================================
const FONT_FAMILY = {
  Default: "sans-serif",

  Poppins: "'Poppins', sans-serif",

  Inter: "'Inter', sans-serif",

  Montserrat: "'Montserrat', sans-serif",

  Nunito: "'Nunito', sans-serif",

  Outfit: "'Outfit', sans-serif",

  Urbanist: "'Urbanist', sans-serif",

  Rubik: "'Rubik', sans-serif",

  Manrope: "'Manrope', sans-serif",

  Pacifico: "'Pacifico', cursive",

  DancingScript: "'Dancing Script', cursive",

  Satisfy: "'Satisfy', cursive",

  Caveat: "'Caveat', cursive",
};

// ======================================
// 🔥 THEMES
// ======================================
const THEMES = [
  "light",
  "dark",
  "amoled",
  "neon",
  "ocean",
  "purple",
  "sunset",
  "frost",
  "galaxy",
  "rose-gold",
];

// ======================================
// 🔥 COMPONENT
// ======================================
const AppearanceSettings = () => {
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const {
    font,
    setFont,

    fontSize,
    setFontSize,

    transparent,
    setTransparent,
  } = useSettings();

  const [activeSection, setActiveSection] = useState(null);

  // ======================================
  // 🔥 CLOSE PAGE
  // ======================================
  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] md:mt-16 flex flex-col items-center bg-[var(--bg)] text-[var(--text)]">
      {/* ====================================== */}
      {/* 🔥 HEADER */}
      {/* ====================================== */}
      <div className="w-full md:max-w-2xl flex items-center gap-3 px-4 py-4 sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <button onClick={handleClose} className="text-xl">
          <FiArrowLeft />
        </button>

        <h2 className="text-lg font-semibold">Appearance Settings</h2>
      </div>

      {/* ====================================== */}
      {/* 🔥 CONTENT */}
      {/* ====================================== */}
      <div className="w-full md:max-w-2xl flex-1 min-h-0 overflow-y-auto hide-scrollbar px-3 pb-6 space-y-4">
        {/* ====================================== */}
        {/* 🔥 THEME */}
        {/* ====================================== */}
        <Section title="Theme">
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`
                  relative

                  h-[84px]

                  rounded-2xl

                  overflow-hidden

                  border

                  transition-all
                  duration-300

                  ${
                    theme === t
                      ? `
                        border-[var(--primary)]

                        scale-[1.02]

                        shadow-[0_10px_30px_rgba(0,0,0,0.18)]
                      `
                      : `
                        border-white/10
                      `
                  }
                `}
              >
                {/* 🔥 PREVIEW */}
                <div
                  className={`
                    absolute
                    inset-0

                    ${
                      t === "light"
                        ? "bg-gradient-to-br from-white to-gray-200"
                        : t === "dark"
                          ? "bg-gradient-to-br from-[#0f172a] via-[#020617] to-[#000814]"
                          : t === "amoled"
                            ? "bg-black border border-white/5"
                            : t === "neon"
                              ? "bg-gradient-to-br from-cyan-400/40 via-[#052e2b] to-black"
                              : t === "ocean"
                                ? "bg-gradient-to-br from-sky-400/40 via-[#082f49] to-[#020617]"
                                : t === "purple"
                                  ? "bg-gradient-to-br from-fuchsia-300/40 via-purple-700 to-[#020617]"
                                  : t === "sunset"
                                    ? "bg-gradient-to-br from-orange-400 via-pink-500 to-rose-700"
                                    : t === "frost"
                                      ? "bg-gradient-to-br from-cyan-100 via-blue-200 to-slate-200"
                                      : t === "galaxy"
                                        ? "bg-gradient-to-br from-indigo-900 via-purple-900 to-black"
                                        : t === "rose-gold"
                                          ? "bg-gradient-to-br from-rose-200 via-pink-300 to-amber-200"
                                          : "bg-gradient-to-br from-gray-200 to-gray-300"
                    }
                  `}
                />

                {/* 🔥 LABEL */}
                <div className="absolute inset-0 flex items-end justify-between p-3">
                  <span
                    className={`
                      text-sm
                      font-medium
                      capitalize

                      ${t === "light" ? "text-black" : "text-white"}
                    `}
                  >
                    {t}
                  </span>

                  {theme === t && (
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <FiCheck className="text-black text-sm" />
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* ====================================== */}
        {/* 🔥 FONT STYLE */}
        {/* ====================================== */}
        <Section title="Font Style">
          <div className="space-y-2">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f}
                onClick={() => setFont(f)}
                style={{
                  fontFamily: FONT_FAMILY[f],
                }}
                className={`
                  w-full

                  flex
                  items-center
                  justify-between

                  px-4
                  py-4

                  rounded-2xl

                  border

                  transition-all
                  duration-300

                  ${
                    font === f
                      ? `
                        border-[var(--primary)]
                        bg-[var(--primary)]/10
                      `
                      : `
                        border-white/10
                        hover:bg-white/5
                      `
                  }
                `}
              >
                <div className="text-left">
                  <p className="font-medium">{f}</p>

                  <p className="text-xs opacity-60">Talksy preview text</p>
                </div>

                {font === f ? (
                  <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <FiCheck className="text-black text-sm" />
                  </div>
                ) : (
                  <FiChevronRight className="opacity-50" />
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ====================================== */}
        {/* 🔥 FONT SIZE */}
        {/* ====================================== */}
        <Section title="Font Size">
          <div className="grid grid-cols-4 gap-3">
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`
                  py-4

                  rounded-2xl

                  border

                  font-medium

                  transition-all

                  ${
                    fontSize === size
                      ? `
                        border-[var(--primary)]
                        bg-[var(--primary)]/10
                        text-[var(--primary)]
                      `
                      : `
                        border-white/10
                        hover:bg-white/5
                      `
                  }
                `}
              >
                {size}
              </button>
            ))}
          </div>
        </Section>

        {/* ====================================== */}
        {/* 🔥 TRANSPARENT */}
        {/* ====================================== */}
        <Section title="Effects">
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            <div className="flex items-center justify-between px-4 py-4">
              <div>
                <p className="font-medium">Transparent Mode</p>

                <p className="text-xs opacity-60 mt-1">
                  Enable blur and glass effects
                </p>
              </div>

              <button
                onClick={() => setTransparent(!transparent)}
                className={`
                  relative

                  w-12
                  h-7

                  rounded-full

                  transition-all

                  ${transparent ? "bg-[var(--primary)]" : "bg-gray-500"}
                `}
              >
                <span
                  className={`
                    absolute
                    top-1

                    w-5
                    h-5

                    rounded-full

                    bg-white

                    transition-all

                    ${transparent ? "right-1" : "left-1"}
                  `}
                />
              </button>
            </div>
          </div>
        </Section>

        {/* ====================================== */}
        {/* 🔥 ADVANCED */}
        {/* ====================================== */}
        <div className="pt-2">
          <button
            onClick={() => navigate("/settings")}
            className="
              w-full

              py-4

              rounded-2xl

              font-medium

              shadow-xl

              transition-all
              duration-300

              hover:scale-[1.01]

              bg-[var(--primary)]

              text-black
            "
          >
            Advanced Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;

// ======================================
// 🔥 SECTION
// ======================================
const Section = ({ title, children }) => (
  <div>
    <p className="text-xs opacity-50 px-1 mb-2">{title}</p>

    <div className="glass rounded-3xl p-3 border border-white/10">
      {children}
    </div>
  </div>
);
