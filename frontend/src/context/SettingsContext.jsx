import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {

  // ======================================
  // 🔥 DEFAULT STATE
  // ======================================
  const [font, setFont] = useState("Default");

  const [fontSize, setFontSize] = useState("M");

  const [transparent, setTransparent] = useState(false);

  // ======================================
  // 🔥 LOAD SETTINGS
  // ======================================
  useEffect(() => {

    const saved = JSON.parse(
      localStorage.getItem("settings")
    );

    if (saved) {

      if (saved.font) {
        setFont(saved.font);
      }

      if (saved.fontSize) {
        setFontSize(saved.fontSize);
      }

      if (
        typeof saved.transparent === "boolean"
      ) {
        setTransparent(saved.transparent);
      }
    }

  }, []);

  // ======================================
  // 🔥 APPLY GLOBAL SETTINGS
  // ======================================
  useEffect(() => {

    const root =
      document.documentElement;

    // ======================================
    // 🔥 FONT MAP
    // ======================================
    const fontMap = {

      // 🔥 DEFAULT
      Default: "sans-serif",

      // 🔥 MODERN
      Poppins: "'Poppins', sans-serif",

      Inter: "'Inter', sans-serif",

      Montserrat: "'Montserrat', sans-serif",

      Nunito: "'Nunito', sans-serif",

      Outfit: "'Outfit', sans-serif",

      Urbanist: "'Urbanist', sans-serif",

      Rubik: "'Rubik', sans-serif",

      Manrope: "'Manrope', sans-serif",

      // 🔥 CURSIVE / STYLISH
      Pacifico: "'Pacifico', cursive",

      DancingScript:
        "'Dancing Script', cursive",

      Satisfy: "'Satisfy', cursive",

      Caveat: "'Caveat', cursive",
    };

    // ======================================
    // 🔥 FONT SIZE MAP
    // ======================================
    const sizeMap = {

      S: "14px",

      M: "16px",

      L: "18px",

      XL: "20px",
    };

    // ======================================
    // 🔥 APPLY CSS VARIABLES
    // ======================================
    root.style.setProperty(
      "--font",
      fontMap[font]
    );

    root.style.setProperty(
      "--font-size",
      sizeMap[fontSize]
    );

    // ======================================
    // 🔥 TRANSPARENT MODE
    // ======================================
    root.classList.toggle(
      "transparent",
      transparent
    );

  }, [font, fontSize, transparent]);

  // ======================================
  // 🔥 SAVE SETTINGS
  // ======================================
  useEffect(() => {

    localStorage.setItem(
      "settings",

      JSON.stringify({
        font,
        fontSize,
        transparent,
      })
    );

  }, [font, fontSize, transparent]);

  // ======================================
  // 🔥 PROVIDER
  // ======================================
  return (
    <SettingsContext.Provider
      value={{

        // ==================================
        // 🔥 FONT
        // ==================================
        font,
        setFont,

        // ==================================
        // 🔥 FONT SIZE
        // ==================================
        fontSize,
        setFontSize,

        // ==================================
        // 🔥 TRANSPARENT
        // ==================================
        transparent,
        setTransparent,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// ======================================
// 🔥 SAFE HOOK
// ======================================
export const useSettings = () => {

  const context =
    useContext(SettingsContext);

  if (!context) {

    throw new Error(
      "useSettings must be used within SettingsProvider"
    );
  }

  return context;
};