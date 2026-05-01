import React, { useState, useRef, useEffect } from "react";
import {
  FiMessageCircle,
  FiUsers,
  FiSettings,
  FiSun,
  FiMoon,
  FiSearch,
  FiStar,
  FiLink,
  FiPhone,
  FiUserPlus,
  FiUser, // 🔥 Profile
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { MdOutlineGroups } from "react-icons/md";
import { MdOutlineGroup, MdGroups } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useTheme } from "../context/ThemeContext";
import SettingsDrawer from "./Settings/SettingsDrawer";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();

  // 🔥 ONLY FIX (responsive hide)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔥 ALL FULL SCREEN ROUTES
  const fullScreenRoutes = [
    "/chat/",
    "/new-chat",
    "/new-group",
    "/status",
    "/call",
    "/user/",
    "/profile",
    "/settings",
    "/settings/privacy",
    "/settings/security",
    "/settings/chats",
    "/settings/notifications",
    "/settings/storage",
    "/settings/two-step",
    "/settings/help",
    "/settings/change-number",
    "/linked-devices",
  ];

  // 🔥 CHECK
  const hideNavbar =
    fullScreenRoutes.some((route) => location.pathname.startsWith(route)) &&
    isMobile;

  const [openSettings, setOpenSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const menuRef = useRef();
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      {!hideNavbar && (
        <>
          {/* DESKTOP NAVBAR */}
          <div className="hidden md:flex fixed top-0 left-0 w-full z-50 px-6 py-3 items-center justify-between glass shadow-lg text-[var(--text)] isolate">
            <div className="flex items-center gap-3">
              <img
                src={theme === "light" ? assets.LightMoodLogo : assets.Logo}
                alt="logo"
                className="w-24 h-10 object-contain"
              />
            </div>

            <div className="flex items-center gap-10 text-xs">
              <NavItem
                icon={<FiMessageCircle />}
                label="Chats"
                onClick={() => navigate("/")}
              />
              <NavItem
                icon={<FiUsers />}
                label="Status"
                onClick={() => navigate("/status")}
              />
              <NavItem
                icon={<FiPhone />}
                label="Calls"
                onClick={() => navigate("/call")}
              />
              <NavItem
                icon={<MdOutlineGroups />}
                label="Groups"
                onClick={() => navigate("/groups")}
              />

              <NavItem
                icon={<FiUserPlus />}
                label="New-chat"
                onClick={() => navigate("/new-chat")}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* PROFILE */}
              <div
                onClick={() => {
                  navigate("/profile");
                  setShowMenu(false);
                }}
              >
                <Profile user={user} />
              </div>

              {/* SETTINGS */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenSettings(true);
                }}
                className="cursor-pointer group"
              >
                <FiSettings className="text-xl icon group-hover:text-[var(--primary)]" />
              </div>

              {/* THEME */}
              <ThemeToggle theme={theme} setTheme={setTheme} />
            </div>
          </div>

          {/* MOBILE NAV */}
          <div className="md:hidden fixed top-0 left-0 w-full z-50 isolate">
            <div
              className={`absolute inset-0 backdrop-blur-xl opacity-95 pointer-events-none ${
                theme === "light"
                  ? "bg-gradient-to-r from-white via-gray-100 to-white"
                  : "bg-gradient-to-r from-[#020617] via-[#0b0f1a] to-[#020617]"
              }`}
            />

            <div className="relative">
              <div className="flex items-center justify-between px-4 pt-3">
                <img
                  src={theme === "light" ? assets.LightMoodLogo : assets.Logo}
                  alt="logo"
                  className="w-20 h-8 object-contain"
                />

                <div className="flex items-center gap-3">
                  <div className="group relative p-2.5 rounded-full cursor-pointer bg-[var(--card)]/40 hover:bg-[var(--primary)]/20 active:scale-95">
                    <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-0 group-hover:opacity-20 blur-md"></div>
                    <FiUserPlus
                      onClick={() => navigate("/new-chat")}
                      className="icon text-sm relative group-hover:text-[var(--primary)] group-hover:scale-110"
                    />
                  </div>

                  <div ref={menuRef}>
                    <BsThreeDotsVertical
                      onClick={() => setShowMenu(!showMenu)}
                      className="text-xl cursor-pointer icon hover:text-[var(--primary)]"
                    />

                    {showMenu &&
                      createPortal(
                        <div
                          ref={dropdownRef}
                          className="fixed right-2 top-[58px] w-56 rounded-xl z-[9999] overflow-hidden animate-menu shadow-2xl"
                          style={{
                            backgroundColor: "var(--card)",
                            color: "var(--text)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {/* 🔥 PROFILE */}
                          <MenuItem
                            icon={<FiUser />}
                            label="Profile"
                            onClick={() => {
                              navigate("/profile");
                              setShowMenu(false);
                            }}
                          />

                          {/* 🔥 STATUS */}
                          <MenuItem
                            icon={<FiMessageCircle />}
                            label="Status"
                            onClick={() => {
                              navigate("/status");
                              setShowMenu(false);
                            }}
                          />

                          {/* 🔥 NEW GROUP */}
                          <MenuItem
                            icon={<MdGroups />}
                            label="New Group"
                            onClick={() => {
                              navigate("/new-group");
                              setShowMenu(false);
                            }}
                          />

                          {/* 🔥 LINKED DEVICES */}
                          <MenuItem
                            icon={<FiLink />}
                            label="Linked Devices"
                            onClick={() => {
                              navigate("/linked-devices");
                              setShowMenu(false);
                            }}
                          />

                          {/* 🔥 DIVIDER */}
                          <div className="border-t my-1 opacity-20"></div>

                          {/* 🔥 SETTINGS */}
                          <MenuItem
                            icon={<FiSettings />}
                            label="Settings"
                            onClick={() => {
                              navigate("/settings");
                              setShowMenu(false);
                            }}
                          />
                        </div>,
                        document.body,
                      )}
                  </div>
                </div>
              </div>

              {/* SEARCH */}
              <div className="px-4 mt-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full border bg-[var(--card)]/50 border-[var(--border)]">
                  <FiSearch className="text-xs opacity-60" />
                  <input
                    type="text"
                    placeholder="Search chats..."
                    className="bg-transparent outline-none text-xs w-full placeholder:text-[var(--text)]/50"
                  />
                </div>
              </div>

              {/* TABS */}
              <div className="flex gap-1.5 px-4 pb-2 mt-3 overflow-x-auto">
                {["All", "Unread", "Favorites", "Groups"].map((tab) => (
                  <Tab
                    key={tab}
                    label={tab}
                    active={activeTab === tab}
                    onClick={() => setActiveTab(tab)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="h-16 md:hidden" />

          {/* BOTTOM NAV */}
          <div className="md:hidden fixed bottom-0 left-0 w-full flex justify-around py-2 z-50 glass">
            <MobileItem
              icon={<FiMessageCircle />}
              label="Chats"
              onClick={() => navigate("/")}
            />
            <MobileItem
              icon={<FiUsers />}
              label="Status"
              onClick={() => navigate("/status")}
            />
            <NavItem
              icon={<FiPhone />}
              label="Calls"
              onClick={() => navigate("/call")}
            />
            <MobileItem icon={<MdOutlineGroup />} label="Groups" />
          </div>
        </>
      )}

      <SettingsDrawer
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
};

export default Navbar;

/* COMPONENTS */

const NavItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center cursor-pointer group"
  >
    <div className="text-xl icon group-hover:text-[var(--primary)]">{icon}</div>
    <span className="group-hover:text-[var(--primary)]">{label}</span>
  </div>
);

const MobileItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center text-xs cursor-pointer hover:text-[var(--primary)]"
  >
    <div className="text-xl">{icon}</div>
    <span>{label}</span>
  </div>
);

const MenuItem = ({ icon, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center gap-3 px-4 py-3 text-sm cursor-pointer hover:bg-[var(--primary)]/10"
  >
    <span className="text-lg opacity-80">{icon}</span>
    <span>{label}</span>
  </div>
);

const Profile = ({ user }) => (
  <div className="relative cursor-pointer w-8 h-8 rounded-full overflow-hidden border border-[#00c896] flex items-center justify-center text-xs font-semibold">

    {user?.avatar && user.avatar.trim() !== "" ? (
      <img
        src={user.avatar}
        className="w-full h-full object-cover"
        alt="profile"
      />
    ) : (
      <span>
        {user?.name ? user.name[0].toUpperCase() : "U"}
      </span>
    )}

  </div>
);

const ThemeToggle = ({ theme, setTheme }) => (
  <div className="flex items-center gap-1 p-1 rounded-full glass border border-[var(--border)]">
    <div
      onClick={() => setTheme("light")}
      className={
        theme === "light" ? "bg-[#00c896] text-black p-1 rounded-full" : "p-1"
      }
    >
      <FiSun />
    </div>
    <div
      onClick={() => setTheme("dark")}
      className={
        theme === "dark" ? "bg-[#0ea5e9] text-black p-1 rounded-full" : "p-1"
      }
    >
      <FiMoon />
    </div>
  </div>
);

const Tab = ({ label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`px-3 py-1 text-xs rounded-full cursor-pointer ${active ? "bg-[var(--primary)] text-black" : "bg-[var(--card)]/30"}`}
  >
    {label}
  </div>
);
