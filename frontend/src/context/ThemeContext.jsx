import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;

    // remove all themes
    root.classList.remove(
      "light",
      "dark",
      "neon",
      "ocean",
      "purple"
    );

    // add current theme
    root.classList.add(theme);

    localStorage.setItem("theme", theme);

    console.log("THEME:", theme);
  }, [theme]);

  // navbar ke liye
  const dark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, setTheme, dark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);