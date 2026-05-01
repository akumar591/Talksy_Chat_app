import { useState, useEffect, useRef } from "react";
import {
  FiArrowLeft,
  FiEdit2,
  FiCamera,
  FiLock,
  FiMessageCircle,
  FiBell,
  FiDatabase,
  FiShield,
  FiKey,
  FiRefreshCw,
  FiHelpCircle,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const [editField, setEditField] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const dropdownRef = useRef(); // 🔥 NEW

  const [user, setLocalUser] = useState({
    name: "",
    about: "",
    phone: "",
    avatar: null,
  });

  const { user: authUser, logout } = useAuth();

  useEffect(() => {
    if (authUser) {
      setLocalUser({
        name: authUser.name || "",
        about: authUser.bio || "",
        phone: authUser.phone ? `+91 ${authUser.phone}` : "",
        avatar: authUser.avatar || null,
      });
    }
  }, [authUser]);

  // 🔥 OUTSIDE CLICK FIX
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (field, value) => {
    setLocalUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    try {
      await logout();

      localStorage.removeItem("seenSplash");
      localStorage.removeItem("seenOnboarding");
      localStorage.removeItem("user");

      window.location.href = "/";
    } catch {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 flex flex-col items-center bg-[var(--bg)] text-[var(--text)]">

      {/* HEADER */}
      <div className="w-full md:max-w-2xl flex items-center gap-3 px-4 py-4">
        <button onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <h2 className="text-lg font-semibold">My Profile</h2>
      </div>

      {/* MAIN */}
      <div className="w-full md:max-w-2xl px-3 overflow-y-auto hide-scrollbar space-y-4">

        {/* PROFILE CARD */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center shadow-xl">

          {/* AVATAR */}
          <div className="relative" ref={dropdownRef}>
            <div
              onClick={(e) => {
                e.stopPropagation(); // 🔥 important
                setShowMenu(!showMenu);
              }}
              className="cursor-pointer"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  className="w-28 h-28 rounded-full object-cover ring-2 ring-[var(--primary)]"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[var(--card)] flex items-center justify-center ring-2 ring-[var(--primary)] text-xl">
                  <FiCamera />
                </div>
              )}
            </div>

            {/* DROPDOWN */}
            {showMenu && (
              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-56 rounded-xl shadow-2xl z-50 border border-[var(--border)] bg-[var(--card)] text-[var(--text)]">

                <div
                  onClick={() => {
                    if (user.avatar) window.open(user.avatar, "_blank");
                    setShowMenu(false);
                  }}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-[var(--primary)]/10"
                >
                  Show Profile Photo
                </div>

                <div
                  onClick={() => {
                    // future upload logic
                    setShowMenu(false);
                  }}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-[var(--primary)]/10"
                >
                  Update Profile Photo
                </div>

                <div
                  onClick={() => {
                    setLocalUser((prev) => ({ ...prev, avatar: null }));
                    setShowMenu(false);
                  }}
                  className="px-4 py-3 text-sm text-red-400 cursor-pointer hover:bg-red-500/10"
                >
                  Remove Profile Photo
                </div>
              </div>
            )}
          </div>

          {/* NAME */}
          <div className="mt-4 w-full text-center">
            {editField === "name" ? (
              <input
                value={user.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => setEditField(null)}
                autoFocus
                className="text-center bg-transparent border-b border-[var(--primary)] outline-none"
              />
            ) : (
              <div className="flex justify-center items-center gap-2">
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <FiEdit2 onClick={() => setEditField("name")} />
              </div>
            )}
          </div>

          {/* ABOUT */}
          <div className="mt-2 w-full text-center text-sm opacity-70">
            {editField === "about" ? (
              <input
                value={user.about}
                onChange={(e) => handleChange("about", e.target.value)}
                onBlur={() => setEditField(null)}
                autoFocus
                className="text-center bg-transparent border-b border-[var(--primary)] outline-none"
              />
            ) : (
              <div className="flex justify-center items-center gap-2">
                <span>{user.about}</span>
                <FiEdit2 onClick={() => setEditField("about")} />
              </div>
            )}
          </div>

          <p className="text-xs opacity-50 mt-2">{user.phone}</p>
        </div>

        {/* बाकी untouched */}
        <Section title="Account">
          <SettingItem icon={<FiLock />} label="Privacy" path="/settings/privacy" />
          <SettingItem icon={<FiShield />} label="Security" path="/settings/security" />
          <SettingItem icon={<FiKey />} label="Two-step verification" path="/settings/two-step" />
          <SettingItem icon={<FiRefreshCw />} label="Change number" path="/settings/change-number" />
        </Section>

        <Section title="Preferences">
          <SettingItem icon={<FiMessageCircle />} label="Chats" path="/settings/chats" />
          <SettingItem icon={<FiBell />} label="Notifications" path="/settings/notifications" />
          <SettingItem icon={<FiDatabase />} label="Storage and data" path="/settings/storage" />
        </Section>

        <Section title="Help">
          <SettingItem icon={<FiHelpCircle />} label="Help center" path="/settings/help" />
          <SettingItem
            icon={<FiUsers />}
            label="Invite a friend"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: "Chat App",
                  text: "Join me 🚀",
                  url: window.location.origin,
                });
              } else {
                alert("Sharing not supported");
              }
            }}
          />
        </Section>

        <div
          onClick={handleLogout}
          className="glass text-center py-3 text-red-400 rounded-xl cursor-pointer"
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default Profile;

/* SAME */
const Section = ({ title, children }) => (
  <div>
    <p className="text-xs opacity-50 px-2 mb-2">{title}</p>
    <div className="glass rounded-2xl divide-y divide-[var(--border)]">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon, label, path, onClick }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => (onClick ? onClick() : navigate(path))}
      className="flex justify-between px-4 py-3 cursor-pointer hover:bg-[var(--primary)]/10"
    >
      <div className="flex gap-3 items-center">
        {icon}
        <span>{label}</span>
      </div>
      <span>›</span>
    </div>
  );
};