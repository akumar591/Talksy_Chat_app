import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiPhone,
  FiVideo,
  FiMessageCircle,
} from "react-icons/fi";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🔥 Dummy data (later backend se replace hoga)
  const user = {
    id,
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=3",
    about: "Hey there! I am using talksy🚀",
    phone: "+91 9876543210",
    online: true,
  };

  return (
    <div className="w-full bg-[var(--bg)] text-[var(--text)] flex flex-col md:items-center mt-0 md:mt-16 h-screen md:h-[calc(100vh-4rem)]">
      
      {/* 🔥 HEADER */}
      <div className="w-full md:max-w-xl flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        
        {/* LEFT BACK (mobile) */}
        <button onClick={() => navigate(-1)} className="text-xl md:hidden">
          <FiArrowLeft />
        </button>

        <h2 className="font-semibold text-lg">Contact info</h2>

        {/* RIGHT BACK (desktop) */}
        <button
          onClick={() => navigate(-1)}
          className="hidden md:flex items-center gap-2 text-sm opacity-70 hover:text-[var(--primary)]"
        >
          <FiArrowLeft />
          Back
        </button>
      </div>

      {/* 🔥 MAIN CONTAINER (centered for desktop) */}
      <div className="w-full md:max-w-xl">

        {/* 🔥 PROFILE TOP */}
        <div className="flex flex-col items-center py-6">
          <div className="relative">
            <img
              src={user.avatar}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover"
            />

            {user.online && (
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg)]"></span>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-semibold mt-3">
            {user.name}
          </h3>

          <p className="text-sm opacity-60 mt-1">
            {user.online ? "online" : "last seen recently"}
          </p>
        </div>

        {/* 🔥 ACTION BUTTONS (FIXED CALL) */}
        <div className="flex justify-center gap-8 py-4">

          {/* MESSAGE */}
          <button
            onClick={() => navigate(`/chat/${id}`)}
            className="flex flex-col items-center text-sm hover:text-[var(--primary)]"
          >
            <FiMessageCircle className="text-xl mb-1" />
            Message
          </button>

          {/* AUDIO CALL */}
          <button
            onClick={() =>
              navigate("/call", {
                state: {
                  call: {
                    name: user.name,
                    avatar: user.avatar,
                    type: "audio",
                  },
                },
              })
            }
            className="flex flex-col items-center text-sm hover:text-[var(--primary)]"
          >
            <FiPhone className="text-xl mb-1" />
            Call
          </button>

          {/* VIDEO CALL */}
          <button
            onClick={() =>
              navigate("/call", {
                state: {
                  call: {
                    name: user.name,
                    avatar: user.avatar,
                    type: "video",
                  },
                },
              })
            }
            className="flex flex-col items-center text-sm hover:text-[var(--primary)]"
          >
            <FiVideo className="text-xl mb-1" />
            Video
          </button>

        </div>

        {/* 🔥 INFO SECTION */}
        <div className="px-4 space-y-3 pb-6">

          {/* ABOUT */}
          <div className="bg-[var(--card)] p-4 rounded-xl">
            <p className="text-xs opacity-60">About</p>
            <p className="mt-1">{user.about}</p>
          </div>

          {/* PHONE */}
          <div className="bg-[var(--card)] p-4 rounded-xl">
            <p className="text-xs opacity-60">Phone</p>
            <p className="mt-1">{user.phone}</p>
          </div>

          {/* MEDIA */}
          <div
            onClick={() => navigate(`/media/${id}`)}
            className="bg-[var(--card)] p-4 rounded-xl cursor-pointer hover:bg-[var(--primary)]/10 transition"
          >
            <p className="text-sm">Media, links, and docs</p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UserProfile;