// ===============================
// 🔥 GROUP INFO PAGE
// ===============================

import { useEffect, useMemo, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiEdit2,
  FiFile,
  FiImage,
  FiLogOut,
  FiMoreVertical,
  FiShield,
  FiTrash2,
  FiUserPlus,
  FiUsers,
  FiCheck,
  FiVideo,
} from "react-icons/fi";

import toast from "react-hot-toast";

import API from "../../api/axios";

import { useAuth } from "../../context/AuthContext";

import { useGroup } from "../../context/GroupContext";

import AddMembersModal from "../Chat/AddMembersModal";

import MediaViewerModal from "../Chat/MediaViewerModal";

import ImageCropper from "../Common/ImageCropper";

import ConfirmModal from "../Common/ConfirmModal";

// ===============================
// 🔥 COMPONENT
// ===============================
const GroupInfo = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useAuth();

  const {
    fetchGroupById,
    fetchGroupMedia,

    groupMedia,

    leaveGroup,
    deleteGroup,

    removeMember,
    makeAdmin,
    removeAdmin,
  } = useGroup();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [group, setGroup] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showMenu, setShowMenu] = useState(false);

  const [showImageMenu, setShowImageMenu] = useState(false);

  const [showViewer, setShowViewer] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const [showAddMemberModal, setShowAddMemberModal] = useState(false);

  const [editingName, setEditingName] = useState(false);

  const [editingAbout, setEditingAbout] = useState(false);

  const [updatingName, setUpdatingName] = useState(false);

  const [updatingAbout, setUpdatingAbout] = useState(false);

  const [menuLoading, setMenuLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", about: "" });

  const [preview, setPreview] = useState(null);

  const [showCropper, setShowCropper] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const [zoom, setZoom] = useState(1);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const [deleteGroupOpen, setDeleteGroupOpen] = useState(false);

  const menuRef = useRef(null);

  const imageMenuRef = useRef(null);

  const [leaveGroupOpen, setLeaveGroupOpen] = useState(false);

  // ===============================
  // 🔥 FETCH GROUP
  // ===============================
  useEffect(() => {
    const loadGroup = async () => {
      try {
        setLoading(true);

        const data = await fetchGroupById(id);

        if (!data) {
          toast.error("Group not found");

          navigate("/");

          return;
        }

        setGroup(data);

        setFormData({
          name: data.name || "",
          about: data.about || "",
        });

        if (data.conversationId) {
          fetchGroupMedia(data.conversationId);
        }
      } catch (err) {
        console.log(err);

        toast.error("Failed to load group");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadGroup();
    }
  }, [id]);

  // ===============================
  // 🔥 CLOSE MENU OUTSIDE
  // ===============================
  useEffect(() => {
    const handleOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }

      if (imageMenuRef.current && !imageMenuRef.current.contains(e.target)) {
        setShowImageMenu(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  // ===============================
  // 🔥 ROLES
  // ===============================
  const currentMember = useMemo(() => {
    return group?.members?.find(
      (m) => String(m.userId || m.id) === String(user?.id),
    );
  }, [group, user]);

  const isCreator = useMemo(() => {
    return String(group?.createdById) === String(user?.id);
  }, [group, user]);

  const isAdmin = useMemo(() => {
    return currentMember?.role === "ADMIN";
  }, [currentMember]);

  const canManageGroup = isCreator || isAdmin;

  // ===============================
  // 🔥 UPDATE NAME
  // ===============================
  const handleUpdateName = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Group name required");

        return;
      }

      setUpdatingName(true);

      await API.put(`/groups/${group.id}`, {
        name: formData.name,
        about: group.about || "",
        avatar: group.avatar || "",
      });

      const updated = await fetchGroupById(group.id);

      setGroup(updated);

      setEditingName(false);

      toast.success("Group name updated ✅");
    } catch (err) {
      console.log(err);

      toast.error("Failed to update name");
    } finally {
      setUpdatingName(false);
    }
  };

  // ===============================
  // 🔥 UPDATE ABOUT
  // ===============================
  const handleUpdateAbout = async () => {
    try {
      setUpdatingAbout(true);

      await API.put(`/groups/${group.id}`, {
        name: group.name,
        about: formData.about,
        avatar: group.avatar || "",
      });

      const updated = await fetchGroupById(group.id);

      setGroup(updated);

      setEditingAbout(false);

      toast.success("Description updated ✅");
    } catch (err) {
      console.log(err);

      toast.error("Failed to update description");
    } finally {
      setUpdatingAbout(false);
    }
  };

  // ===============================
  // 🔥 MEDIA STATS
  // ===============================
  const imageCount = useMemo(() => {
    return groupMedia.filter((m) => m.type === "IMAGE").length;
  }, [groupMedia]);

  const videoCount = useMemo(() => {
    return groupMedia.filter((m) => m.type === "VIDEO").length;
  }, [groupMedia]);

  const fileCount = useMemo(() => {
    return groupMedia.filter((m) => m.type === "FILE").length;
  }, [groupMedia]);

  // ===============================
  // 🔥 AVATAR FALLBACK
  // ===============================
  const avatarLetters = useMemo(() => {
    const words = group?.name?.trim()?.split(" ") || [];

    if (words.length === 1) {
      return words[0]?.charAt(0)?.toUpperCase();
    }

    return `${words[0]?.charAt(0) || ""}${words[words.length - 1]?.charAt(0) || ""}`.toUpperCase();
  }, [group]);

  // ===============================
  // 🔥 HANDLE IMAGE
  // ===============================
  const handleGroupImage = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 🔥 TYPE CHECK
    if (!file.type.startsWith("image/")) {
      toast.error("Only image allowed ❌");

      return;
    }

    // 🔥 SIZE CHECK
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");

      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }
    // 🔥 PREVIEW
    const localPreview = URL.createObjectURL(file);

    setPreview(localPreview);

    // 🔥 OPEN CROPPER
    setShowCropper(true);

    setShowImageMenu(false);
  };

  // ===============================
  // 🔥 REMOVE GROUP IMAGE
  // ===============================
  const handleRemoveImage = async () => {
    try {
      setMenuLoading(true);

      await API.put(`/groups/${group.id}`, {
        name: group.name,
        about: group.about,
        avatar: "",
      });

      const updated = await fetchGroupById(group.id);

      setGroup(updated);

      setShowImageMenu(false);

      toast.success("Group photo removed");
    } catch (err) {
      console.log(err);

      toast.error("Failed to remove image");
    } finally {
      setMenuLoading(false);
    }
  };

  // ===============================
  // 🔥 REMOVE MEMBER
  // ===============================
  const handleRemoveMember = async (memberId) => {
    try {
      const res = await removeMember(group.id, memberId);

      if (res.success) {
        const updated = await fetchGroupById(group.id);
        setGroup(updated);
        toast.success("Member removed successfully ✅");
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to remove member ❌");
    }
  };

  // ===============================
  // 🔥 MAKE ADMIN
  // ===============================
  const handleMakeAdmin = async (memberId) => {
    try {
      const res = await makeAdmin(group.id, memberId);

      if (res.success) {
        const updated = await fetchGroupById(group.id);

        setGroup(updated);

        toast.success("Admin added");
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed");
    }
  };

  // ===============================
  // 🔥 REMOVE ADMIN
  // ===============================
  const handleRemoveAdmin = async (memberId) => {
    try {
      const res = await removeAdmin(group.id, memberId);

      if (res.success) {
        const updated = await fetchGroupById(group.id);

        setGroup(updated);

        toast.success("Admin removed");
      }
    } catch (err) {
      console.log(err);

      toast.error("Failed");
    }
  };

  // ===============================
  // 🔥 LOADING
  // ===============================
  if (loading) {
    return (
      <div className="w-full h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">
        <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ===============================
  // 🔥 NOT FOUND
  // ===============================
  if (!group) {
    return (
      <div className="w-full h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">
        Group not found
      </div>
    );
  }

  return (
    <div className=" w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 overflow-hidden bg-[var(--bg)] text-[var(--text)] flex justify-center">
      {/* CONTAINER */}
      <div className="w-full md:max-w-2xl h-screen flex flex-col overflow-hidden">
        {/* =============================== */}
        {/* 🔥 HEADER */}
        {/* =============================== */}
        <div className="w-full flex items-center justify-between px-4 py-3 bg-[var(--card)] border-b border-[var(--border)]">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition"
            >
              <FiArrowLeft className="text-xl" />
            </button>

            <h2 className="text-lg font-semibold">Group Info</h2>
          </div>

          {/* RIGHT */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition"
            >
              <FiMoreVertical className="text-xl" />
            </button>

            {/* MENU */}
            {showMenu && (
              <div className="absolute top-12 right-0 w-56 rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl z-50">
                {/* OPEN CHAT */}
                <button
                  onClick={() => {
                    navigate(`/group/${group.id}`);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition"
                >
                  Open Chat
                </button>

                {/* ADD MEMBER */}
                {canManageGroup && (
                  <button
                    onClick={() => {
                      setShowAddMemberModal(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition"
                  >
                    Add Members
                  </button>
                )}

                {/* DELETE */}
                {isCreator && (
                  <button
                    onClick={() => {
                      setDeleteGroupOpen(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
                  >
                    Delete Group
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* 🔥 SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {/* =============================== */}
          {/* 🔥 TOP */}
          {/* =============================== */}
          <div className="flex flex-col items-center px-6 pt-24 pb-7 border-b border-[var(--border)]">
            {/* AVATAR */}
            <div className="relative" ref={imageMenuRef}>
              {uploadingImage ? (
                <div className="w-32 h-32 rounded-full bg-[var(--card)] border border-[var(--border)] flex flex-col items-center justify-center">
                  <div className="w-8 h-8 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-2"></div>

                  <p className="text-xs opacity-70">Uploading...</p>
                </div>
              ) : group.avatar ? (
                <img
                  src={
                    group.avatar?.startsWith("http")
                      ? group.avatar
                      : `${import.meta.env.VITE_API_URL}${group.avatar}`
                  }
                  alt={group.name}
                  onClick={() => {
                    if (group.avatar) {
                      setShowViewer(true);
                    }
                  }}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-[var(--primary)]/20 cursor-pointer"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[var(--primary)] to-purple-500 flex items-center justify-center text-white text-4xl font-bold uppercase">
                  {avatarLetters}
                </div>
              )}

              {/* CAMERA */}
              {canManageGroup && (
                <button
                  onClick={() => setShowImageMenu(!showImageMenu)}
                  className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shadow-xl"
                >
                  <FiCamera />
                </button>
              )}

              {/* IMAGE MENU */}
              {showImageMenu && canManageGroup && (
                <div className="absolute top-36 left-1/2 -translate-x-1/2 w-60 rounded-2xl overflow-hidden bg-[var(--card)] border border-[var(--border)] shadow-2xl z-50">
                  {/* CHANGE */}
                  <label className="block px-4 py-3 text-sm cursor-pointer hover:bg-white/5 transition">
                    Change Group Photo
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleGroupImage}
                    />
                  </label>

                  {/* REMOVE */}
                  {group.avatar && (
                    <button
                      disabled={menuLoading}
                      onClick={handleRemoveImage}
                      className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 transition"
                    >
                      Remove Group Photo
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* =============================== */}
            {/* 🔥 GROUP NAME */}
            {/* =============================== */}
            <div className="w-full mt-5 flex items-center justify-center gap-3">
              {!editingName ? (
                <>
                  <h1 className="text-2xl font-bold break-words text-center">
                    {group.name}
                  </h1>

                  {canManageGroup && (
                    <button
                      onClick={() => {
                        setEditingName(true);

                        setFormData((prev) => ({
                          ...prev,
                          name: group.name,
                        }));
                      }}
                      className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-white/5 transition shrink-0"
                    >
                      <FiEdit2 className="text-lg opacity-70" />
                    </button>
                  )}
                </>
              ) : (
                <>
                  <input
                    autoFocus
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className="bg-transparent border-b border-[var(--primary)] px-1 py-1 text-2xl font-bold outline-none text-center"
                  />

                  <button
                    disabled={updatingName}
                    onClick={handleUpdateName}
                    className="w-9 h-9 rounded-full flex items-center justify-center bg-[var(--primary)] text-black transition shrink-0"
                  >
                    <FiCheck />
                  </button>
                </>
              )}
            </div>

            {/* ABOUT */}
            <div className="w-full mt-3 text-center">
              {/* =============================== */}
              {/* ====== GROUP DESCRIPTION ====== */}
              {/* =============================== */}
              <div className="w-full mt-3 flex items-start justify-center gap-3">
                {!editingAbout ? (
                  <>
                    <p className="text-sm opacity-70 leading-relaxed break-words text-center max-w-md">
                      {group.about || "No description"}
                    </p>

                    {canManageGroup && (
                      <button
                        onClick={() => {
                          setEditingAbout(true);

                          setFormData((prev) => ({
                            ...prev,
                            about: group.about || "",
                          }));
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/5 transition shrink-0 mt-[-4px]"
                      >
                        <FiEdit2 className="text-base opacity-70" />
                      </button>
                    )}
                  </>
                ) : (
                  <>
                    <textarea
                      autoFocus
                      rows={2}
                      value={formData.about}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          about: e.target.value,
                        })
                      }
                      placeholder="Group description"
                      className="w-full max-w-md resize-none bg-transparent border-b border-[var(--primary)] px-2 py-1 outline-none text-sm text-center"
                    />

                    <button
                      disabled={updatingAbout}
                      onClick={handleUpdateAbout}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-[var(--primary)] text-black transition shrink-0"
                    >
                      <FiCheck />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* META */}
            <div className="mt-5 flex flex-col items-center text-xs opacity-60">
              <span className="flex items-center gap-2">
                <FiUsers />
                {group.memberCount || group.members?.length || 0} members
              </span>

              <span className="mt-1">Created by {group.createdByName}</span>
            </div>
          </div>

          {/* =============================== */}
          {/* 🔥 MEDIA */}
          {/* =============================== */}
          <div className="px-4 py-5 border-b border-[var(--border)]">
            {/* TOP */}
            <div
              onClick={() => navigate(`/group-media/${group.id}`)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <h3 className="text-sm font-semibold">Media, Links & Docs</h3>

                <p className="text-xs opacity-60 mt-1">
                  Shared photos, videos and files
                </p>
              </div>

              <span className="opacity-60">→</span>
            </div>

            {/* STATS */}
            <div className="flex items-center gap-3 mt-4 overflow-x-auto hide-scrollbar">
              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] shrink-0">
                <FiImage className="text-[var(--primary)]" />
                <span className="text-xs">{imageCount} Photos</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] shrink-0">
                <FiVideo className="text-[var(--primary)]" />
                <span className="text-xs">{videoCount} Videos</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-[var(--card)] border border-[var(--border)] shrink-0">
                <FiFile className="text-[var(--primary)]" />
                <span className="text-xs">{fileCount} Files</span>
              </div>
            </div>

            {/* PREVIEW */}
            <div className="flex gap-2 mt-4 overflow-x-auto hide-scrollbar">
              {groupMedia
                .filter((m) => m.type === "IMAGE" || m.type === "VIDEO")
                .slice(0, 8)
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/group-media/${group.id}`)}
                    className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 cursor-pointer bg-[var(--card)] border border-[var(--border)] group"
                  >
                    {item.type === "IMAGE" && (
                      <img
                        src={item.content}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                      />
                    )}

                    {item.type === "VIDEO" && (
                      <>
                        <video
                          src={item.content}
                          preload="metadata"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                          <FiVideo className="text-white text-lg" />
                        </div>
                      </>
                    )}
                  </div>
                ))}

              {groupMedia.length === 0 && (
                <div className="w-full py-8 text-center text-sm opacity-60">
                  No shared media yet
                </div>
              )}
            </div>
          </div>

          {/* =============================== */}
          {/* 🔥 MEMBERS */}
          {/* =============================== */}
          <div className="pb-6">
            {/* TITLE */}
            <div className="px-4 py-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold opacity-70">Members</h3>

              {canManageGroup && (
                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="flex items-center gap-2 text-sm text-[var(--primary)]"
                >
                  <FiUserPlus />
                  Add
                </button>
              )}
            </div>

            {/* MEMBERS LIST */}
            {group.members?.map((member) => {
              const memberIsCreator =
                String(member.userId || member.id) ===
                String(group.createdById);

              const memberIsAdmin = member.role === "ADMIN";

              const isCurrentUser =
                String(member.userId || member.id) === String(user?.id);

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] hover:bg-white/5 transition"
                >
                  {/* AVATAR */}
                  <div className="relative shrink-0">
                    <img
                      src={
                        member.avatar?.startsWith("http")
                          ? member.avatar
                          : `${import.meta.env.VITE_API_URL}${member.avatar}`
                      }
                      alt={member.name}
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${member.name}`;
                      }}
                      className="w-12 h-12 rounded-full object-cover"
                    />

                    {member.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[var(--bg)]"></span>
                    )}
                  </div>

                  {/* INFO */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-medium truncate">{member.name}</h4>

                      {/* CREATOR */}
                      {memberIsCreator && (
                        <span className="px-2 py-[2px] rounded-full text-[10px] bg-yellow-500/15 text-yellow-400">
                          Creator
                        </span>
                      )}

                      {/* ADMIN */}
                      {memberIsAdmin && !memberIsCreator && (
                        <span className="flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] bg-[var(--primary)]/15 text-[var(--primary)]">
                          <FiShield size={10} />
                          Admin
                        </span>
                      )}

                      {/* MEMBER */}
                      {!memberIsAdmin && !memberIsCreator && (
                        <span className="px-2 py-[2px] rounded-full text-[10px] bg-white/5">
                          Member
                        </span>
                      )}
                    </div>

                    <p className="text-xs opacity-60 mt-1">
                      {member.online ? "online" : "offline"}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  {!isCurrentUser && (
                    <div className="flex items-center gap-2">
                      {/* CREATOR CONTROLS */}
                      {isCreator && !memberIsCreator && (
                        <>
                          {/* MAKE ADMIN */}
                          {!memberIsAdmin && (
                            <button
                              onClick={() =>
                                handleMakeAdmin(member.userId || member.id)
                              }
                              className="px-3 py-2 rounded-xl text-xs bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)]/20 transition"
                            >
                              Make Admin
                            </button>
                          )}

                          {/* REMOVE ADMIN */}
                          {memberIsAdmin && (
                            <button
                              onClick={() =>
                                handleRemoveAdmin(member.userId || member.id)
                              }
                              className="px-3 py-2 rounded-xl text-xs bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 transition"
                            >
                              Remove Admin
                            </button>
                          )}

                          {/* REMOVE */}
                          <button
                            onClick={() => {
                              setSelectedMemberId(member.userId || member.id);
                              setConfirmOpen(true);
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/10 transition"
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}

                      {/* ADMIN CONTROLS */}
                      {!isCreator &&
                        isAdmin &&
                        !memberIsAdmin &&
                        !memberIsCreator && (
                          <button
                            onClick={() => {
                              setSelectedMemberId(member.userId || member.id);
                              setConfirmOpen(true);
                            }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-red-400 hover:bg-red-500/10 transition"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* =============================== */}
          {/* 🔥 LEAVE GROUP */}
          {/* =============================== */}

          {!isCreator && (
            <div className="px-4 py-6 border-t border-[var(--border)]">
              <button
                onClick={() => setLeaveGroupOpen(true)}
                className="
                w-full
                flex
                items-center
                justify-center
                gap-3

                py-4

                rounded-2xl

                bg-gradient-to-r
                from-red-500/15
                to-red-600/10

                border
                border-red-500/20

                hover:border-red-500/40

                transition-all
              "
              >
                <FiLogOut className="text-red-400 text-xl" />

                <span className="text-sm font-semibold text-red-400">
                  Leave Group
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =============================== */}
      {/* 🔥 ADD MEMBERS MODAL */}
      {/* =============================== */}
      {showAddMemberModal && (
        <AddMembersModal
          group={group}
          setGroup={setGroup}
          onClose={() => setShowAddMemberModal(false)}
        />
      )}

      {/* =============================== */}
      {/* 🔥 REMOVE MEMBER CONFIRM */}
      {/* =============================== */}
      <ConfirmModal
        open={confirmOpen}
        title="Remove Member"
        message="Are you sure you want to remove this member from the group?"
        confirmText="Remove"
        cancelText="Cancel"
        danger={true}
        onClose={() => {
          setConfirmOpen(false);

          setSelectedMemberId(null);
        }}
        onConfirm={async () => {
          await handleRemoveMember(selectedMemberId);

          setConfirmOpen(false);

          setSelectedMemberId(null);
        }}
      />

      {/* =============================== */}
      {/* 🔥 DELETE GROUP CONFIRM */}
      {/* =============================== */}
      <ConfirmModal
        open={deleteGroupOpen}
        title="Delete Group"
        message="This group will be permanently deleted."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onClose={() => {
          setDeleteGroupOpen(false);
        }}
        onConfirm={async () => {
          const res = await deleteGroup(group.id);

          if (res.success) {
            navigate("/");
          } else {
            toast.error("Failed to delete group ❌");
          }

          setDeleteGroupOpen(false);
        }}
      />

      {/* =============================== */}
      {/* 🔥 LEAVE GROUP CONFIRM */}
      {/* =============================== */}

      <ConfirmModal
        open={leaveGroupOpen}
        title="Leave Group"
        message="Are you sure you want to leave this group?"
        confirmText="Leave"
        cancelText="Cancel"
        danger={true}
        onClose={() => {
          setLeaveGroupOpen(false);
        }}
        onConfirm={async () => {
          const res = await leaveGroup(group.id);

          if (res.success) {
            toast.success("Left group successfully");

            navigate("/");
          } else {
            toast.error("Failed to leave group ❌");
          }

          setLeaveGroupOpen(false);
        }}
      />

      {/* =============================== */}
      {/* 🔥 IMAGE VIEWER */}
      {/* =============================== */}
      {group.avatar && (
        <MediaViewerModal
          open={showViewer}
          onClose={() => setShowViewer(false)}
          medias={[
            {
              type: "IMAGE",
              content: group.avatar?.startsWith("http")
                ? group.avatar
                : `${import.meta.env.VITE_API_URL}${group.avatar}`,
            },
          ]}
          selectedIndex={0}
          setSelectedIndex={() => {}}
        />
      )}

      {/* ===================================== */}
      {/* =============  CROPPER  ============= */}
      {/* ===================================== */}
      {showCropper && preview && (
        <div className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4">
          <div className="w-full max-w-md h-[500px] rounded-3xl overflow-hidden bg-[#111827] relative">
            <ImageCropper
              image={preview}
              crop={crop}
              setCrop={setCrop}
              zoom={zoom}
              setZoom={setZoom}
              aspect={1 / 1}
              cropShape="round"
              showGrid={false}
              onCropDone={async (croppedFile) => {
                try {
                  if (!croppedFile) return;

                  setUploadingImage(true);

                  // 🔥 PREVIEW
                  const croppedPreview = URL.createObjectURL(croppedFile);

                  setPreview(croppedPreview);

                  // 🔥 CLOSE
                  setShowCropper(false);

                  // 🔥 FORM DATA
                  const formDataObj = new FormData();

                  formDataObj.append("file", croppedFile);

                  // 🔥 IMPORTANT
                  formDataObj.append("type", "profile");

                  // 🔥 UPLOAD
                  const uploadRes = await API.post(
                    "/file/upload",
                    formDataObj,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    },
                  );

                  // 🔥 IMAGE URL
                  const imageUrl = uploadRes?.data?.data?.url || "";

                  if (!imageUrl) {
                    toast.error("Upload failed ❌");

                    return;
                  }

                  // 🔥 UPDATE GROUP
                  await API.put(`/groups/${group.id}`, {
                    name: group.name,
                    about: group.about || "",
                    avatar: imageUrl,
                  });

                  // 🔥 REFRESH
                  const updated = await fetchGroupById(group.id);

                  setGroup(updated);

                  toast.success("Group photo updated ✅");
                } catch (err) {
                  console.log(err);

                  toast.error(
                    err?.response?.data?.message || "Upload failed ❌",
                  );
                } finally {
                  setMenuLoading(false);
                  setUploadingImage(false);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupInfo;
