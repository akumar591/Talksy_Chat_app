import { useState, useEffect, useRef } from "react";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import StatusList from "./StatusList";
import StatusViewer from "./StatusViewer";

const StatusLayout = () => {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef();
  const navigate = useNavigate();

  // 🔥 NAVBAR CONTROL
  useEffect(() => {
    if (selectedStatus) {
      sessionStorage.setItem("statusViewer", "true");
    } else {
      sessionStorage.removeItem("statusViewer");
    }
  }, [selectedStatus]);

  // 🔥 CLOSE MENU
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full h-screen text-[var(--text)]">

      {/* MOBILE HEADER */}
      {!selectedStatus && (
        <div className="md:hidden fixed top-0 left-0 w-full z-50 bg-[var(--bg)] pt-3">

          <div className="flex items-center gap-2 px-3 py-2">

            <FiArrowLeft
              onClick={() => navigate("/")}
              className="text-lg cursor-pointer"
            />

            <div className="flex items-center flex-1 gap-2 px-3 py-2 rounded-full bg-[var(--card)]">
              <FiSearch className="text-sm opacity-60" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search status..."
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="relative" ref={menuRef}>
              <BsThreeDotsVertical
                onClick={() => setShowMenu(!showMenu)}
                className="text-lg cursor-pointer"
              />

              {showMenu && (
                <div className="absolute right-0 top-10 w-44 solid rounded-lg shadow-lg text-sm z-50">
                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10">
                    Status Privacy
                  </div>
                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10">
                    Create Channel
                  </div>
                  <div className="px-3 py-2 hover:bg-[var(--primary)]/10">
                    Archived Status
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* STATUS LIST */}
      <div
        className={`
          ${selectedStatus ? "hidden md:block" : "block"}
          fixed top-12 md:top-16 left-0
          w-full md:w-[30%] lg:w-[25%]
          h-[calc(100vh-48px)] md:h-[calc(100vh-64px)]
          md:border-r md:border-[var(--border)]
        `}
      >
        <StatusList onOpen={setSelectedStatus} />
      </div>

      {/* STATUS VIEWER */}
      <div
        className={`
          ${selectedStatus ? "flex" : "hidden md:flex"}
          fixed
          top-0 md:top-16
          left-0 md:left-[30%] lg:left-[25%]
          w-full md:w-[70%] lg:w-[75%]
          h-screen md:h-[calc(100vh-64px)]
          flex flex-col items-center justify-center
          bg-[var(--bg)]   /* ✅ FIXED */
        `}
      >
        {selectedStatus ? (
          <StatusViewer
            statuses={selectedStatus.statuses}
            currentIndex={selectedStatus.index}
            setIndex={(i) =>
              setSelectedStatus((prev) => ({ ...prev, index: i }))
            }
            onClose={() => setSelectedStatus(null)}
          />
        ) : (
          <div className="hidden md:flex flex-col items-center justify-center text-[var(--text)] opacity-60">
            <p className="text-lg">Select a status to view</p>
            <p className="text-sm opacity-50">Tap on any story</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default StatusLayout;