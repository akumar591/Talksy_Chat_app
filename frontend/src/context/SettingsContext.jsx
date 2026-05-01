import { createContext, useContext, useEffect, useState } from "react";

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  // 🔹 Default state
  const [font, setFont] = useState("Default");
  const [fontSize, setFontSize] = useState("M");
  const [chatStyle, setChatStyle] = useState("Rounded");
  const [transparent, setTransparent] = useState(false);

  // 🔹 Load saved settings (on mount)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("settings"));
    if (saved) {
      if (saved.font) setFont(saved.font);
      if (saved.fontSize) setFontSize(saved.fontSize);
      if (saved.chatStyle) setChatStyle(saved.chatStyle);
      if (typeof saved.transparent === "boolean") {
        setTransparent(saved.transparent);
      }
    }
  }, []);

  // 🔹 Apply globally (CSS variables + classes)
  useEffect(() => {
    const root = document.documentElement;

    const fontMap = {
      Default: "sans-serif",
      Poppins: "'Poppins', sans-serif",
      Inter: "'Inter', sans-serif",
      Montserrat: "'Montserrat', sans-serif",
    };

    const sizeMap = {
      S: "14px",
      M: "16px",
      L: "18px",
    };

    root.style.setProperty("--font", fontMap[font]);
    root.style.setProperty("--font-size", sizeMap[fontSize]);

    // global transparent mode (class toggle)
    root.classList.toggle("transparent", transparent);
  }, [font, fontSize, transparent]);

  // 🔹 Persist to localStorage
  useEffect(() => {
    localStorage.setItem(
      "settings",
      JSON.stringify({ font, fontSize, chatStyle, transparent })
    );
  }, [font, fontSize, chatStyle, transparent]);

  return (
    <SettingsContext.Provider
      value={{
        font,
        setFont,
        fontSize,
        setFontSize,
        chatStyle,
        setChatStyle,
        transparent,
        setTransparent,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// 🔹 Safe hook
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return context;
};