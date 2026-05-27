import { createContext, useContext, useEffect, useMemo, useState } from "react";

// ===============================
// 🔥 CONTEXT
// ===============================
const ChatAppearanceContext = createContext(null);

// ===============================
// 🔥 WALLPAPERS
// ===============================
export const WALLPAPERS = [
  // ======================================
  // 🔥 DEFAULT DARK
  // ======================================
  {
    id: "default-dark",

    name: "Default Dark",

    type: "gradient",

    background: "linear-gradient(180deg,#020617 0%,#030712 40%,#000814 100%)",

    overlay: "rgba(0,0,0,0.28)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 MIDNIGHT GLOW
  // ======================================
  {
    id: "midnight-glow",

    name: "Midnight Glow",

    type: "gradient",

    background:
      "radial-gradient(circle at top left,#0f172a 0%,#020617 35%,#000000 100%)",

    overlay: "rgba(0,0,0,0.32)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 OCEAN VIBE
  // ======================================
  {
    id: "ocean-vibe",

    name: "Ocean Vibe",

    type: "gradient",

    background: "linear-gradient(135deg,#031525 0%,#082f49 35%,#0f172a 100%)",

    overlay: "rgba(0,0,0,0.22)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 PURPLE DREAM
  // ======================================
  {
    id: "purple-dream",

    name: "Purple Dream",

    type: "gradient",

    background: "linear-gradient(145deg,#14001f 0%,#2e1065 45%,#020617 100%)",

    overlay: "rgba(0,0,0,0.26)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 GLASS NIGHT
  // ======================================
  {
    id: "glass-night",

    name: "Glass Night",

    type: "gradient",

    background: "linear-gradient(120deg,#020617 0%,#111827 45%,#000000 100%)",

    overlay: "rgba(255,255,255,0.03)",

    blur: "14px",

    opacity: 1,
  },

    // ======================================
  // 🔥 SOFT CLOUD
  // ======================================
  {
    id: "soft-cloud",

    name: "Soft Cloud",

    type: "gradient",

    background:
      "linear-gradient(135deg,#f8fafc 0%,#e0f2fe 45%,#dbeafe 100%)",

    overlay: "rgba(255,255,255,0.10)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 PEACH GLOW
  // ======================================
  {
    id: "peach-glow",

    name: "Peach Glow",

    type: "gradient",

    background:
      "linear-gradient(135deg,#fff7ed 0%,#ffedd5 40%,#fed7aa 100%)",

    overlay: "rgba(255,255,255,0.08)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 MINT FRESH
  // ======================================
  {
    id: "mint-fresh",

    name: "Mint Fresh",

    type: "gradient",

    background:
      "linear-gradient(135deg,#ecfdf5 0%,#d1fae5 45%,#a7f3d0 100%)",

    overlay: "rgba(255,255,255,0.06)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 CREAM SUNSET
  // ======================================
  {
    id: "cream-sunset",

    name: "Cream Sunset",

    type: "gradient",

    background:
      "linear-gradient(135deg,#fffdf7 0%,#fef3c7 45%,#fde68a 100%)",

    overlay: "rgba(255,255,255,0.06)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 ANIME NIGHT
  // ======================================
  {
    id: "anime-night",

    name: "Anime Night",

    type: "image",

    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",

    overlay: "rgba(0,0,0,0.48)",

    blur: "0px",

    opacity: 0.92,
  },

  // ======================================
  // 🔥 CYBER CITY
  // ======================================
  {
    id: "cyber-city",

    name: "Cyber City",

    type: "image",

    image:
      "https://images.unsplash.com/photo-1520034475321-cbe63696469a?q=80&w=1600&auto=format&fit=crop",

    overlay: "rgba(0,0,0,0.44)",

    blur: "0px",

    opacity: 0.9,
  },

  // ======================================
  // 🔥 LOVE RED
  // ======================================
  {
    id: "love-red",

    name: "Love Red",

    type: "gradient",

    background: "linear-gradient(135deg,#3b0000 0%,#7f1d1d 45%,#dc2626 100%)",

    overlay: "rgba(0,0,0,0.30)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 ROSE NIGHT
  // ======================================
  {
    id: "rose-night",

    name: "Rose Night",

    type: "gradient",

    background: "linear-gradient(135deg,#1f0a1a 0%,#831843 45%,#e11d48 100%)",

    overlay: "rgba(0,0,0,0.30)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 COUPLE SHADOW
  // ======================================
  {
    id: "couple-shadow",

    name: "Couple Shadow",

    type: "image",

    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop",

    overlay: "rgba(0,0,0,0.42)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 ROMANTIC RAIN
  // ======================================
  {
    id: "romantic-rain",

    name: "Romantic Rain",

    type: "image",

    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop",

    overlay: "rgba(0,0,0,0.45)",

    blur: "0px",

    opacity: 1,
  },

  // ======================================
  // 🔥 SUNSET LOVE
  // ======================================
  {
    id: "sunset-love",

    name: "Sunset Love",

    type: "image",

    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop",

    overlay: "rgba(0,0,0,0.40)",

    blur: "0px",

    opacity: 1,
  },
];

// ===============================
// 🔥 CHAT STYLES
// ===============================
export const CHAT_STYLES = {
  // 🔥 DEFAULT (CURRENT APP STYLE)
  default: {
    id: "default",

    me: "rounded-[18px] rounded-br-[5px]",
    other: "rounded-[18px] rounded-bl-[5px]",
  },

  // 🔥 SHARP
  sharp: {
    id: "sharp",

    me: "rounded-[10px] rounded-br-[2px]",
    other: "rounded-[10px] rounded-bl-[2px]",
  },

  // 🔥 MODERN
  modern: {
    id: "modern",

    me: "rounded-[24px] rounded-br-[8px]",
    other: "rounded-[24px] rounded-bl-[8px]",
  },

  // 🔥 BUBBLE
  bubble: {
    id: "bubble",

    me: "rounded-[30px] rounded-br-[10px]",
    other: "rounded-[30px] rounded-bl-[10px]",
  },

  // 🔥 TELEGRAM
  telegram: {
    id: "telegram",

    me: "rounded-[18px] rounded-br-[4px]",
    other: "rounded-[18px] rounded-bl-[4px]",
  },

  // 🔥 WHATSAPP
  whatsapp: {
    id: "whatsapp",

    me: "rounded-[16px] rounded-br-[3px]",
    other: "rounded-[16px] rounded-bl-[3px]",
  },

  // 🔥 IOS
  ios: {
    id: "ios",

    me: "rounded-[28px]",
    other: "rounded-[28px]",
  },

  // 🔥 GLASS
  glass: {

   id: "glass",
   me: "rounded-[26px] rounded-br-[6px] backdrop-blur-3xl border border-white/10",
   other: "rounded-[26px] rounded-bl-[6px] backdrop-blur-3xl border border-white/10",

  },

  // 🔥 NEON
  neon: {
    id: "neon",
    me: "rounded-[22px] border border-cyan-400/40",
    other: "rounded-[22px] border border-pink-400/40",
  },

  // 🔥 SOFT
  soft: {
    id: "soft",

    me: "rounded-[20px] shadow-inner",
    other: "rounded-[20px] shadow-inner",
  },
};

// ===============================
// 🔥 BUBBLE COLORS
// ===============================
export const BUBBLE_COLORS = {
  // 🔥 DEFAULT
  default: {
    id: "default",

    me: "var(--primary)",
    other: "var(--card)",
  },

  // 🔥 EMERALD
  emerald: {
    id: "emerald",

    me: "#25D366",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 OCEAN
  ocean: {
    id: "ocean",

    me: "#3B82F6",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 PURPLE
  purple: {
    id: "purple",

    me: "#8B5CF6",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 SUNSET
  sunset: {
    id: "sunset",

    me: "#FF7849",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 ROSE
  rose: {
    id: "rose",

    me: "#F43F5E",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 GOLD
  gold: {
    id: "gold",

    me: "#EAB308",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 CYAN
  cyan: {
    id: "cyan",

    me: "#06B6D4",
    other: "rgba(255,255,255,0.06)",
  },

  // 🔥 MIDNIGHT
  midnight: {
    id: "midnight",

    me: "#111827",
    other: "#1F2937",
  },

  // 🔥 LAVA
  lava: {
    id: "lava",

    me: "#DC2626",
    other: "rgba(255,255,255,0.06)",
  },
};

// ===============================
// 🔥 DEFAULT APPEARANCE
// ===============================
const DEFAULT_APPEARANCE = {
  wallpapers: {},

  customWallpapers: {},

  chatStyles: {},

  bubbleColors: {},
};

// ===============================
// 🔥 PROVIDER
// ===============================
export const ChatAppearanceProvider = ({ children }) => {
  // ===============================
  // 🔥 STATE
  // ===============================
  const [appearance, setAppearance] = useState(() => {
    const saved = localStorage.getItem("chatAppearance");

    try {
      return saved ? JSON.parse(saved) : DEFAULT_APPEARANCE;
    } catch {
      return DEFAULT_APPEARANCE;
    }
  });

  // ===============================
  // 🔥 SAVE STORAGE
  // ===============================
  useEffect(() => {
    // 🔥 PREVENT EMPTY SAVE
    if (!appearance) {
      return;
    }

    // 🔥 SAVE
    localStorage.setItem(
      "chatAppearance",

      JSON.stringify(appearance),
    );
  }, [appearance]);

  // ===============================
  // 🔥 CREATE CHAT KEY
  // ===============================
  const createChatKey = ({
    chatId,

    groupId,

    isGroup,
  }) => {
    return isGroup
  ? `group_${groupId}`
  : `private_${chatId}`;
  };

  // ===============================
  // 🔥 SET WALLPAPER
  // ===============================
  const setWallpaper = (
    key,

    wallpaperId,
  ) => {
    setAppearance((prev) => ({
      ...prev,

      wallpapers: {
        ...prev.wallpapers,

        [key]: wallpaperId,
      },
    }));
  };

  // ===============================
  // 🔥 SET CUSTOM WALLPAPER
  // ===============================
  const setCustomWallpaper = (
    key,

    image,
  ) => {
    setAppearance((prev) => ({
      ...prev,

      customWallpapers: {
        ...prev.customWallpapers,

        [key]: image,
      },
    }));
  };

  // ===============================
  // 🔥 GET WALLPAPER
  // ===============================
  const getWallpaper = (key) => {
    // ======================================
    // 🔥 INVALID KEY
    // ======================================
    if (!key) {
      return WALLPAPERS[0];
    }

    // ======================================
    // 🔥 CUSTOM WALLPAPER
    // ======================================
    const customImage = appearance?.customWallpapers?.[key];

    if (customImage) {
      return {
        id: "custom",

        type: "image",

        image: customImage,

        overlay: "rgba(0,0,0,0.45)",

        blur: "0px",

        opacity: 1,
      };
    }

    // ======================================
    // 🔥 SAVED WALLPAPER ID
    // ======================================
    const wallpaperId = appearance?.wallpapers?.[key];

    // ======================================
    // 🔥 NO SAVED WALLPAPER
    // ======================================
    if (!wallpaperId) {
      return WALLPAPERS[0];
    }

    // ======================================
    // 🔥 FIND WALLPAPER
    // ======================================
    const foundWallpaper = WALLPAPERS.find(
      (wallpaper) => wallpaper.id === wallpaperId,
    );

    // ======================================
    // 🔥 RETURN
    // ======================================
    return foundWallpaper || WALLPAPERS[0];
  };

  // ===============================
  // 🔥 SET CHAT STYLE
  // ===============================
  const setChatStyle = (
    key,

    styleId,
  ) => {
    setAppearance((prev) => ({
      ...prev,

      chatStyles: {
        ...prev.chatStyles,

        [key]: styleId,
      },
    }));
  };

  // ===============================
  // 🔥 GET CHAT STYLE
  // ===============================
  const getChatStyle = (key) => {
    const styleId = appearance?.chatStyles?.[key] || "default";

    return CHAT_STYLES[styleId] || CHAT_STYLES.default;
  };

  // ===============================
  // 🔥 SET BUBBLE COLOR
  // ===============================
  const setBubbleColor = (
    key,

    colorId,
  ) => {
    setAppearance((prev) => ({
      ...prev,

      bubbleColors: {
        ...prev.bubbleColors,

        [key]: colorId,
      },
    }));
  };

  // ===============================
  // 🔥 GET BUBBLE COLOR
  // ===============================
  const getBubbleColor = (key) => {
    const colorId = appearance?.bubbleColors?.[key] || "default";

    return BUBBLE_COLORS[colorId] || BUBBLE_COLORS.default;
  };

  // ===============================
  // 🔥 MEMO VALUE
  // ===============================
  const value = useMemo(
    () => ({
      appearance,

      // ==================================
      // 🔥 DATA
      // ==================================
      WALLPAPERS,

      CHAT_STYLES,

      BUBBLE_COLORS,

      // ==================================
      // 🔥 HELPERS
      // ==================================
      createChatKey,

      // ==================================
      // 🔥 WALLPAPER
      // ==================================
      setWallpaper,
      setCustomWallpaper,
      getWallpaper,

      // ==================================
      // 🔥 STYLE
      // ==================================
      setChatStyle,

      getChatStyle,

      
      // ==================================
      // 🔥 BUBBLE COLOR
      // ==================================
      setBubbleColor,

      getBubbleColor,
    }),
    [appearance],
  );

  return (
    <ChatAppearanceContext.Provider value={value}>
      {children}
    </ChatAppearanceContext.Provider>
  );
};

// ===============================
// 🔥 SAFE HOOK
// ===============================
export const useChatAppearance = () => {
  const context = useContext(ChatAppearanceContext);

  if (!context) {
    throw new Error(
      "useChatAppearance must be used inside ChatAppearanceProvider",
    );
  }

  return context;
};
