import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { useSettings } from "../../context/SettingsContext"; // 🔥 NEW
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiX } from "react-icons/fi";

// 🔥 HOVER STYLES
const themeHover = {
  light: "hover:bg-gray-200 text-[#0b0f1a]",
  dark: "hover:bg-white/10 text-white",
  neon: "hover:bg-cyan-500/20 text-cyan-300",
  ocean: "hover:bg-blue-500/20 text-blue-300",
  purple: "hover:bg-purple-500/20 text-purple-300",
};

// 🔥 ACTIVE STYLES
const themeActive = {
  light: "bg-gray-300 text-[#0b0f1a]",
  dark: "bg-[#00c896] text-white",
  neon: "bg-cyan-500/30 text-cyan-200",
  ocean: "bg-blue-500/30 text-blue-200",
  purple: "bg-purple-500/30 text-purple-200",
};

const SettingsDrawer = ({ open, onClose }) => {
  const { theme, setTheme } = useTheme();

  // 🔥 GLOBAL SETTINGS (CONNECTED)
  const {
    font, setFont,
    fontSize, setFontSize,
    chatStyle, setChatStyle,
    transparent, setTransparent
  } = useSettings();

  const navigate = useNavigate();

  const [showTheme, setShowTheme] = useState(false);
  const [showFont, setShowFont] = useState(false);

  // 🔥 ROUTE SUPPORT
  const isRouteMode = open === undefined;
  if (!open && !isRouteMode) return null;

  const handleClose = onClose || (() => navigate(-1));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Drawer */}
      <div
        className={`relative w-80 h-full flex flex-col
        backdrop-blur-xl border-l border-white/10 shadow-xl
        animate-slideIn text-[var(--text)]
        ${transparent ? "bg-white/5" : "bg-[var(--card)]"}
      `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] sticky top-0 bg-[var(--card)] z-10">
          <div className="flex items-center gap-3">
            <button onClick={handleClose} className="md:hidden text-xl icon">
              <FiArrowLeft />
            </button>
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>

          <button
            onClick={handleClose}
            className="text-lg icon hover:text-[var(--primary)]"
          >
            <FiX />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5 scroll-smooth">

          {/* 🎨 THEME */}
          <div className="mb-5">
            <button
              onClick={() => setShowTheme(!showTheme)}
              className={`
              w-full text-left p-3 rounded-lg 
              border border-white/10 transition
              ${
                theme === "light" || theme === "dark"
                  ? "bg-gray-100 !text-[#0b0f1a] hover:bg-gray-200"
                  : "bg-white/5 hover:bg-white/10 text-white"
              }
              `}
            >
              Theme
            </button>

            {showTheme && (
              <div className="mt-2 space-y-2">
                {["light", "dark", "neon", "ocean", "purple"].map((t) => (
                  <div
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`
                      p-2 rounded cursor-pointer text-sm capitalize
                      transition-all duration-200
                      ${
                        theme === t
                          ? themeActive[t]
                          : themeHover[t]   // ✅ FIXED BUG
                      }
                    `}
                  >
                    {t}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 🔤 FONT */}
          <div className="mb-5">
            <button
              onClick={() => setShowFont(!showFont)}
              className={`
              w-full text-left p-3 rounded-lg 
              border border-white/10 transition
              ${
                theme === "light" || theme === "dark"
                  ? "bg-gray-100 !text-[#0b0f1a] hover:bg-gray-200"
                  : "bg-white/5 hover:bg-white/10 text-white"
              }
              `}
            >
              Font Style
            </button>

            {showFont && (
              <div className="mt-2 space-y-2 text-sm">
                {["Default", "Poppins", "Inter", "Montserrat"].map((f) => (
                  <div
                    key={f}
                    onClick={() => setFont(f)} // ✅ WORKING
                    className={`p-2 rounded cursor-pointer transition ${themeHover[theme]}`}
                  >
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 📏 FONT SIZE */}
          <div className="mb-5">
            <p className="mb-2 text-sm opacity-80">Font Size</p>
            <div className="flex gap-2">
              {["S", "M", "L"].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)} // ✅ WORKING
                  className={`px-3 py-1 rounded border border-white/10 transition ${themeHover[theme]}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* 🎭 CHAT STYLE */}
          <div className="mb-5">
            <p className="mb-2 text-sm opacity-80">Chat Style</p>
            <div className="space-y-2 text-sm">
              {["Rounded", "Sharp", "Glass"].map((style) => (
                <div
                  key={style}
                  onClick={() => setChatStyle(style)} // ✅ WORKING
                  className={`p-2 rounded cursor-pointer transition ${themeHover[theme]}`}
                >
                  {style}
                </div>
              ))}
            </div>
          </div>

          {/* 🌫️ TRANSPARENT MODE */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm">Transparent Mode</p>
            <button
              onClick={() => setTransparent(!transparent)} // ✅ GLOBAL
              className={`
                w-10 h-5 rounded-full transition relative
                ${transparent ? "bg-[#00c896]" : "bg-gray-400"}
              `}
            >
              <span
                className={`
                  absolute top-0.5 w-4 h-4 bg-white rounded-full transition
                  ${transparent ? "right-0.5" : "left-0.5"}
                `}
              />
            </button>
          </div>

          {/* 🚀 ADVANCED */}
          <div className="mt-6">
            <button
              onClick={() => {
                handleClose();
                navigate("/settings");
              }}
              className={`
              w-full py-2 rounded-lg text-sm
              bg-gradient-to-r from-[#00c896] to-[#0ea5e9]
              font-medium shadow-md
              hover:scale-[1.02] transition-all
              ${
                theme === "light" || theme === "dark"
                  ? "!text-[#0b0f1a]"
                  : "text-white"
              }
              `}
            >
              Advanced Settings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsDrawer;