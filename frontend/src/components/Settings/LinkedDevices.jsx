import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMonitor, FiLogOut } from "react-icons/fi";

const LinkedDevices = () => {
  const navigate = useNavigate();

  // 🔥 Dummy devices
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "Chrome • Windows",
      location: "Bangalore, India",
      lastActive: "Active now",
    },
    {
      id: 2,
      name: "Edge • Laptop",
      location: "Delhi, India",
      lastActive: "Last active 2 hours ago",
    },
  ]);

  // 🔥 Logout device
  const removeDevice = (id) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="w-full h-screen md:mt-16 bg-[var(--bg)] text-[var(--text)] flex flex-col">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
        <FiArrowLeft onClick={() => navigate(-1)} />
        <h2 className="font-semibold">Linked Devices</h2>
      </div>

      {/* INFO */}
      <div className="px-4 py-3 text-xs opacity-60 border-b border-[var(--border)]">
        Manage devices where your account is active
      </div>

      {/* DEVICE LIST */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">

        {devices.map((device) => (
          <div
            key={device.id}
            className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]"
          >
            {/* ICON */}
            <FiMonitor size={22} className="opacity-70" />

            {/* INFO */}
            <div className="flex-1">
              <p className="text-sm font-medium">{device.name}</p>
              <p className="text-xs opacity-60">{device.location}</p>
              <p className="text-xs text-[var(--primary)]">
                {device.lastActive}
              </p>
            </div>

            {/* LOGOUT */}
            <button
              onClick={() => removeDevice(device.id)}
              className="text-xs text-red-400 flex items-center gap-1"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        ))}

        {devices.length === 0 && (
          <p className="text-center text-xs opacity-40 mt-10">
            No linked devices
          </p>
        )}
      </div>

      {/* ADD DEVICE */}
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={() => alert("QR Scan feature coming soon")}
          className="w-full py-2 bg-[var(--primary)] text-black rounded-md font-medium"
        >
          Link a Device
        </button>
      </div>

    </div>
  );
};

export default LinkedDevices;