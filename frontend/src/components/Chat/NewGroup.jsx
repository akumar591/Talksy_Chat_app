import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCamera } from "react-icons/fi";

// 🔥 Dummy users
const users = [
  { id: 1, name: "Rahul", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Amit", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Priya", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Neha", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Arjun", avatar: "https://i.pravatar.cc/150?img=5" },
];

const NewGroup = () => {
  const navigate = useNavigate();

  const [group, setGroup] = useState({
    name: "",
    about: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const toggleMember = (user) => {
    setSelectedMembers((prev) =>
      prev.find((u) => u.id === user.id)
        ? prev.filter((u) => u.id !== user.id)
        : [...prev, user]
    );
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setGroup({ ...group, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleCreate = () => {
    if (!group.name || selectedMembers.length === 0) {
      alert("Group name & members required");
      return;
    }

    alert("Group Created 🚀");
    navigate("/");
  };

  return (
    <div className="w-full h-screen md:mt-16 bg-[var(--bg)] text-[var(--text)] flex flex-col">

      {/* 🔥 HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
        <FiArrowLeft onClick={() => navigate(-1)} />
        <h2 className="font-semibold">New Group</h2>
      </div>

      {/* 🔥 GROUP INFO (TOP STYLE) */}
      <div className="flex items-center gap-4 px-4 py-4 border-b border-[var(--border)]">

        {/* PROFILE IMAGE */}
        <label className="relative cursor-pointer">
          <input type="file" hidden onChange={handleImage} />

          <div className="w-16 h-16 rounded-full border-2 border-[var(--border)] overflow-hidden flex items-center justify-center bg-[var(--card)]">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs opacity-50">Add</span>
            )}
          </div>

          {/* CAMERA ICON */}
          <div className="absolute bottom-0 right-0 bg-[var(--primary)] text-black p-1 rounded-full">
            <FiCamera size={12} />
          </div>
        </label>

        {/* INPUTS */}
        <div className="flex-1 space-y-2">

          <input
            placeholder="Group name"
            value={group.name}
            onChange={(e) => setGroup({ ...group, name: e.target.value })}
            className="w-full bg-transparent border-b border-[var(--border)] outline-none text-sm py-1"
          />

          <input
            placeholder="Group description"
            value={group.about}
            onChange={(e) => setGroup({ ...group, about: e.target.value })}
            className="w-full bg-transparent border-b border-[var(--border)] outline-none text-xs py-1 opacity-70"
          />

        </div>
      </div>

      {/* 🔥 MEMBERS */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">

        <p className="px-4 py-2 text-xs opacity-50">
          Select Members ({selectedMembers.length})
        </p>

        {users.map((u) => {
          const isSelected = selectedMembers.find((m) => m.id === u.id);

          return (
            <div
              key={u.id}
              onClick={() => toggleMember(u)}
              className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] cursor-pointer hover:bg-[var(--card)]"
            >
              {/* AVATAR */}
              <img src={u.avatar} className="w-10 h-10 rounded-full" />

              {/* NAME */}
              <div className="flex-1">
                <p className="text-sm">{u.name}</p>
              </div>

              {/* CHECK */}
              {isSelected && (
                <div className="text-[var(--primary)] text-lg">✔</div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔥 CREATE BUTTON */}
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={handleCreate}
          className="w-full py-2 rounded-md bg-[var(--primary)] text-black font-medium"
        >
          Create Group
        </button>
      </div>
    </div>
  );
};

export default NewGroup;