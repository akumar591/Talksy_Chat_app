import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FiArrowLeft,
  FiLock,
  FiShield,
  FiMessageCircle,
  FiBell,
  FiDatabase,
  FiSun,
  FiHelpCircle,
  FiKey,
  FiRefreshCw,
} from "react-icons/fi";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 bg-[var(--bg)] text-[var(--text)] flex flex-col items-center">
      {/* 🔥 CONTAINER (CENTERED) */}
      <div className="w-full max-w-2xl h-full flex flex-col">
        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
          <h2 className="font-semibold text-lg">Settings</h2>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* PROFILE */}
          <div
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--card)]"
          >
            <div className="w-12 h-12 rounded-full bg-[var(--card)] flex items-center justify-center font-semibold overflow-hidden">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name ? user.name[0].toUpperCase() : "U"}</span>
              )}
            </div>

            <div>
              <p className="font-medium">{user?.name || "User"}</p>

              <p className="text-xs opacity-60">
                {user?.bio || "No bio available"}
              </p>
            </div>
          </div>

          {/* ACCOUNT */}
          <Section title="Account">
            <Item label="Privacy" icon={<FiLock />} path="/settings/privacy" />
            <Item
              label="Security"
              icon={<FiShield />}
              path="/settings/security"
            />
            <Item
              label="Two-step verification"
              icon={<FiKey />}
              path="/settings/two-step"
            />
            <Item
              label="Change number"
              icon={<FiRefreshCw />}
              path="/settings/change-number"
            />
          </Section>

          {/* PREFERENCES */}
          <Section title="Preferences">
            <Item
              label="Chats"
              icon={<FiMessageCircle />}
              path="/settings/chats"
            />
            <Item
              label="Notifications"
              icon={<FiBell />}
              path="/settings/notifications"
            />
            <Item
              label="Storage and data"
              icon={<FiDatabase />}
              path="/settings/storage"
            />
          </Section>

          {/* APPEARANCE */}
          <Section title="Appearance">
            <Item
              label="Theme"
              icon={<FiSun />}
              path="/settings/theme-drawer"
            />
          </Section>

          {/* HELP */}
          <Section title="Help">
            <Item
              label="Help center"
              icon={<FiHelpCircle />}
              path="/settings/help"
            />
          </Section>

          {/* LOGOUT */}
          <div className="px-4 py-6">
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="w-full py-2 rounded-md text-sm font-medium 
              border border-red-400/30 
              text-red-400 
              hover:bg-red-500/10 
              transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

/* SECTION */
const Section = ({ title, children }) => (
  <div>
    <p className="text-xs opacity-50 px-4 py-2">{title}</p>
    <div className="divide-y divide-[var(--border)]">{children}</div>
  </div>
);

/* ITEM */
const Item = ({ label, icon, path }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-[var(--card)] transition"
    >
      <div className="flex items-center gap-3">
        <span className="opacity-80">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-xs opacity-50">›</span>
    </div>
  );
};
