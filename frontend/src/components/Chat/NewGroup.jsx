import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiCheck,
  FiShield,
  FiUsers,
  FiX,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const users = [
  { id: 1, name: "Rahul", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Amit", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Priya", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Neha", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Arjun", avatar: "https://i.pravatar.cc/150?img=5" },
];

const NewGroup = () => {

  const navigate = useNavigate();

  const { user } = useAuth();

  const [group, setGroup] = useState({
    name: "",
    about: "",
    image: null,
  });

  const [preview, setPreview] =
    useState(null);

  const [selectedMembers, setSelectedMembers] =
    useState([]);

  const [admins, setAdmins] =
    useState([]);

  // ===============================
  // 🔥 TOGGLE MEMBER
  // ===============================
  const toggleMember = (selectedUser) => {

    const exists =
      selectedMembers.find(
        (u) => u.id === selectedUser.id
      );

    if (exists) {

      setSelectedMembers((prev) =>
        prev.filter(
          (u) => u.id !== selectedUser.id
        )
      );

      setAdmins((prev) =>
        prev.filter(
          (id) => id !== selectedUser.id
        )
      );

      return;
    }

    setSelectedMembers((prev) => [
      ...prev,
      selectedUser,
    ]);
  };

  // ===============================
  // 🔥 TOGGLE ADMIN
  // ===============================
  const toggleAdmin = (id) => {

    const exists =
      admins.includes(id);

    if (exists) {

      setAdmins((prev) =>
        prev.filter((a) => a !== id)
      );

      return;
    }

    setAdmins((prev) => [
      ...prev,
      id,
    ]);
  };

  // ===============================
  // 🔥 HANDLE IMAGE
  // ===============================
  const handleImage = (e) => {

    const file =
      e.target.files[0];

    if (!file) return;

    setGroup({
      ...group,
      image: file,
    });

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ===============================
  // 🔥 CREATE GROUP
  // ===============================
  const handleCreate = () => {

    if (
      !group.name.trim()
    ) {

      alert("Group name required");

      return;
    }

    if (
      selectedMembers.length === 0
    ) {

      alert(
        "Select at least 1 member"
      );

      return;
    }

    const payload = {

      name: group.name,

      about: group.about,

      image: group.image,

      members:
        selectedMembers.map(
          (m) => m.id
        ),

      admins: [
        user?.id,
        ...admins,
      ],
    };

    console.log(
      "GROUP PAYLOAD:",
      payload
    );

    alert("Group Created 🚀");

    navigate("/");
  };

  // ===============================
  // 🔥 ADMIN USERS
  // ===============================
  const adminUsers = useMemo(() => {

    return selectedMembers.filter(
      (m) =>
        admins.includes(m.id)
    );

  }, [
    selectedMembers,
    admins,
  ]);

  return (
    <div className="fixed inset-0 md:top-16 bg-[var(--bg)] text-[var(--text)] overflow-hidden">

      {/* 🔥 FIXED LAYOUT */}
      <div className="w-full md:max-w-2xl mx-auto h-full flex flex-col ">

        {/* ================= HEADER ================= */}
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg)]">

          <button
            onClick={() => navigate(-1)}
            className="text-xl"
          >
            <FiArrowLeft />
          </button>

          <div>

            <h2 className="font-semibold text-base">
              Create Group
            </h2>

            <p className="text-xs opacity-60">
              Create a new community chat
            </p>
          </div>
        </div>

        {/* ================= TOP CONTENT ================= */}
        <div className="shrink-0 overflow-y-auto max-h-[45%]">

          {/* ================= GROUP INFO ================= */}
          <div className="px-4 py-5 border-b border-[var(--border)]">

            <div className="flex items-start gap-4">

              {/* IMAGE */}
              <label className="relative shrink-0 cursor-pointer group">

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImage}
                />

                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[var(--border)] bg-[var(--card)] flex items-center justify-center">

                  {preview ? (

                    <img
                      src={preview}
                      alt="group"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="flex flex-col items-center justify-center opacity-60">

                      <FiUsers className="text-2xl mb-1" />

                      <span className="text-[10px]">
                        Add Photo
                      </span>
                    </div>
                  )}
                </div>

                {/* CAMERA */}
                <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shadow-lg">

                  <FiCamera size={14} />
                </div>
              </label>

              {/* INPUTS */}
              <div className="flex-1 space-y-4">

                <input
                  type="text"
                  placeholder="Group name"
                  value={group.name}
                  onChange={(e) =>
                    setGroup({
                      ...group,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-transparent border-b border-[var(--border)] outline-none py-2 text-sm"
                />

                <textarea
                  rows={2}
                  placeholder="Group description"
                  value={group.about}
                  onChange={(e) =>
                    setGroup({
                      ...group,
                      about: e.target.value,
                    })
                  }
                  className="w-full resize-none bg-transparent border-b border-[var(--border)] outline-none py-2 text-xs opacity-80"
                />
              </div>
            </div>
          </div>

          {/* ================= ADMINS ================= */}
          <div className="px-4 py-4 border-b border-[var(--border)]">

            <div className="flex items-center gap-2 mb-3">

              <FiShield className="text-[var(--primary)]" />

              <h3 className="text-sm font-medium">
                Group Admins
              </h3>
            </div>

            {/* CREATOR */}
            <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-[var(--card)] border border-[var(--border)] mb-3">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-full overflow-hidden bg-[var(--card)]">

                  {user?.profilePic ? (

                    <img
                      src={user.profilePic}
                      alt="admin"
                      className="w-full h-full object-cover"
                    />

                  ) : (

                    <div className="w-full h-full flex items-center justify-center font-semibold">

                      {user?.name?.[0] || "U"}
                    </div>
                  )}
                </div>

                <div>

                  <p className="text-sm font-medium">
                    {user?.name || "You"}
                  </p>

                  <p className="text-xs opacity-60">
                    Primary Admin
                  </p>
                </div>
              </div>

              <div className="px-2 py-1 rounded-full text-[10px] bg-[var(--primary)] text-black font-medium">

                Creator
              </div>
            </div>

            {/* EXTRA ADMINS */}
            {adminUsers.length > 0 && (

              <div className="space-y-2">

                {adminUsers.map((admin) => (

                  <div
                    key={admin.id}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--card)] border border-[var(--border)]"
                  >

                    <div className="flex items-center gap-3">

                      <img
                        src={admin.avatar}
                        alt={admin.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />

                      <div>

                        <p className="text-sm">
                          {admin.name}
                        </p>

                        <p className="text-[11px] opacity-60">
                          Group Admin
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        toggleAdmin(admin.id)
                      }
                      className="text-red-400"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= MEMBERS ================= */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">

          {/* TOP */}
          <div className="sticky top-0 z-10 px-4 py-3 bg-[var(--bg)] border-b border-[var(--border)]">

            <p className="text-xs opacity-60">

              Selected Members:
              {" "}
              {selectedMembers.length}
            </p>
          </div>

          {/* USERS */}
          <div className="p-2">

            {users.map((u) => {

              const isSelected =
                selectedMembers.find(
                  (m) => m.id === u.id
                );

              const isAdmin =
                admins.includes(u.id);

              return (

                <div
                  key={u.id}
                  className="flex items-center gap-3 px-3 py-3 rounded-2xl hover:bg-[var(--card)] transition"
                >

                  {/* SELECT */}
                  <button
                    onClick={() =>
                      toggleMember(u)
                    }
                    className={`
                      w-5
                      h-5
                      rounded-md
                      border
                      flex
                      items-center
                      justify-center
                      transition

                      ${
                        isSelected

                          ? `
                            bg-[var(--primary)]
                            border-[var(--primary)]
                            text-black
                          `

                          : `
                            border-[var(--border)]
                          `
                      }
                    `}
                  >

                    {isSelected && (
                      <FiCheck size={12} />
                    )}
                  </button>

                  {/* AVATAR */}
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />

                  {/* INFO */}
                  <div className="flex-1">

                    <p className="text-sm font-medium">
                      {u.name}
                    </p>

                    <p className="text-xs opacity-60">
                      Available
                    </p>
                  </div>

                  {/* ADMIN */}
                  {isSelected && (

                    <button
                      onClick={() =>
                        toggleAdmin(u.id)
                      }
                      className={`
                        px-3
                        py-1.5
                        rounded-full
                        text-[11px]
                        border
                        transition

                        ${
                          isAdmin

                            ? `
                              bg-[var(--primary)]
                              border-[var(--primary)]
                              text-black
                            `

                            : `
                              border-[var(--border)]
                              opacity-70
                            `
                        }1
                      `}
                    >

                      {isAdmin
                        ? "Admin"
                        : "Make Admin"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= BUTTON ================= */}
        <div className="shrink-0 p-4 border-t border-[var(--border)] bg-[var(--bg)]">

          <button
            onClick={handleCreate}
            className="w-full py-3 rounded-2xl bg-[var(--primary)] text-black font-semibold shadow-lg active:scale-[0.99] transition"
          >
            Create Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewGroup;