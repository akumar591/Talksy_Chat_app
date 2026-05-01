import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const SettingsLayout = ({ title, children }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 bg-[var(--bg)] text-[var(--text)] flex justify-center">

      {/* 🔥 CENTER CONTAINER */}
      <div className="w-full max-w-2xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <button onClick={() => navigate(-1)}>
            <FiArrowLeft />
          </button>
          <h2 className="font-semibold">{title}</h2>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 hide-scrollbar">
          {children}
        </div>

      </div>
    </div>
  );
};


/* 🔥 ITEM */
export const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-4 bg-[var(--card)] rounded-xl">
    <span>{label}</span>
    {value && <span className="text-sm opacity-60">{value}</span>}
  </div>
);


/* 🔥 TOGGLE */
export const ToggleItem = ({ label, value, onChange }) => (
  <div className="flex justify-between items-center p-4 bg-[var(--card)] rounded-xl">
    <span>{label}</span>

    <div
      onClick={onChange}
      className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition ${
        value ? "bg-green-500" : "bg-gray-400"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full transition ${
          value ? "ml-auto" : ""
        }`}
      />
    </div>
  </div>
);