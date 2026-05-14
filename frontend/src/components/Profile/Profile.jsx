import {
  useState,
  useEffect,
  useRef,
} from "react";

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
  FiCheck,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import API from "../../api/axios";

import toast from "react-hot-toast";

import ImageCropper from "../Common/ImageCropper";

const Profile = () => {

  const navigate =
    useNavigate();

  const {
    user: authUser,
    logout,
    refreshUser,
  } = useAuth();

  // =====================================
  // 🔥 STATES
  // =====================================
  const [
    editField,
    setEditField,
  ] = useState(null);

  const [
    showMenu,
    setShowMenu,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  // 🔥 CROPPER
  const [
    showCropper,
    setShowCropper,
  ] = useState(false);

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const [preview, setPreview] =
    useState(null);

  // =====================================
  // 🔥 REFS
  // =====================================
  const dropdownRef =
    useRef();

  const fileInputRef =
    useRef();

  const logoutRef =
    useRef(false);

  // =====================================
  // 🔥 USER
  // =====================================
  const [
    user,
    setLocalUser,
  ] = useState({
    name: "",
    about: "",
    email: "",
    phone: "",
    avatar: null,
  });

  // =====================================
  // 🔥 LOAD USER
  // =====================================
  useEffect(() => {

    if (!authUser)
      return;

    setLocalUser({
      name:
        authUser.name ||
        "",

      about:
        authUser.bio ||
        "",

      email:
        authUser.email ||
        "",

      phone:
        authUser.phone
          ? `+91 ${authUser.phone}`
          : "",

      avatar:
        authUser.avatar ||
        null,
    });

  }, [authUser]);

  // =====================================
  // 🔥 CLOSE DROPDOWN
  // =====================================
  useEffect(() => {

    const handleClickOutside =
      (e) => {

        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(
            e.target
          )
        ) {

          setShowMenu(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {

      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };

  }, []);

  // =====================================
  // 🔥 INPUT CHANGE
  // =====================================
  const handleChange = (
    field,
    value
  ) => {

    setLocalUser(
      (prev) => ({
        ...prev,
        [field]: value,
      })
    );
  };

  // =====================================
  // 🔥 UPDATE PROFILE
  // =====================================
  const updateProfile =
    async (payload) => {

      try {

        setLoading(
          true
        );

        await API.put(
          "/users/me",
          payload
        );

        await refreshUser();

        toast.success(
          "Profile updated ✅"
        );

        setEditField(
          null
        );

      } catch (err) {

        console.log(
          err
        );

        let msg =
          "Update failed";

        if (
          err.response?.data
            ?.message
        ) {

          msg =
            err.response
              .data
              .message;
        }

        toast.error(
          msg
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // =====================================
  // 🔥 SAVE FIELD
  // =====================================
  const saveField =
    async (field) => {

      // 🔥 NAME
      if (
        field === "name"
      ) {

        if (
          !user.name.trim()
        ) {

          toast.error(
            "Name required"
          );

          return;
        }

        await updateProfile({
          name:
            user.name,
        });
      }

      // 🔥 ABOUT
      else if (
        field === "about"
      ) {

        await updateProfile({
          bio:
            user.about,
        });
      }

      // 🔥 EMAIL
      else if (
        field === "email"
      ) {

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            user.email
          )
        ) {

          toast.error(
            "Enter valid email"
          );

          return;
        }

        await updateProfile({
          email:
            user.email,
        });
      }
    };

  // =====================================
  // 🔥 IMAGE SELECT
  // =====================================
  const handleImageSelect =
    async (e) => {

      const file =
        e.target.files[0];

      if (!file)
        return;

      // 🔥 TYPE
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {

        toast.error(
          "Only image allowed ❌"
        );

        return;
      }

      // 🔥 SIZE
      if (
        file.size >
        5 *
          1024 *
          1024
      ) {

        toast.error(
          "Image must be under 5MB"
        );

        return;
      }

      // 🔥 PREVIEW
      const localPreview =
        URL.createObjectURL(
          file
        );

      setPreview(
        localPreview
      );

      setShowCropper(
        true
      );

      setShowMenu(
        false
      );
    };

  // =====================================
  // 🔥 REMOVE AVATAR
  // =====================================
  const removeAvatar =
    async () => {

      try {

        setLoading(
          true
        );

        await API.put(
          "/users/me",
          {
            avatar:
              "",
          }
        );

        await refreshUser();

        toast.success(
          "Profile photo removed"
        );

        setShowMenu(
          false
        );

      } catch (err) {

        console.log(
          err
        );

        toast.error(
          "Failed to remove image"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // =====================================
  // 🔥 LOGOUT
  // =====================================
  const handleLogout =
    async () => {

      if (
        logoutRef.current
      ) {

        return;
      }

      logoutRef.current =
        true;

      try {

        localStorage.removeItem(
          "seenSplash"
        );

        localStorage.removeItem(
          "seenOnboarding"
        );

        localStorage.setItem(
          "step",
          "splash"
        );

        sessionStorage.clear();

        localStorage.removeItem(
          "user"
        );

        await logout();

      } catch (err) {

        console.log(
          "Logout failed:",
          err
        );

        localStorage.removeItem(
          "seenSplash"
        );

        localStorage.removeItem(
          "seenOnboarding"
        );

        localStorage.setItem(
          "step",
          "splash"
        );

        sessionStorage.clear();

        window.location.href =
          "/";
      }
    };

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 flex flex-col items-center bg-[var(--bg)] text-[var(--text)]">

      {/* HEADER */}
      <div className="w-full md:max-w-2xl flex items-center gap-3 px-4 py-4">

        <button
          onClick={() =>
            navigate(-1)
          }
        >
          <FiArrowLeft />
        </button>

        <h2 className="text-lg font-semibold">
          My Profile
        </h2>

      </div>

      {/* MAIN */}
      <div className="w-full md:max-w-2xl px-3 overflow-y-auto hide-scrollbar space-y-4">

        {/* PROFILE CARD */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center shadow-xl">

          {/* AVATAR */}
          <div
            className="relative"
            ref={dropdownRef}
          >

            <div
              onClick={(e) => {

                e.stopPropagation();

                setShowMenu(
                  !showMenu
                );
              }}
              className="cursor-pointer"
            >

              {user.avatar ? (

                <img
                  src={
                    user.avatar
                  }
                  className="w-28 h-28 rounded-full object-cover ring-2 ring-[var(--primary)]"
                />

              ) : (

                <div className="w-28 h-28 rounded-full bg-[var(--card)] flex items-center justify-center ring-2 ring-[var(--primary)] text-xl">

                  <FiCamera />

                </div>
              )}

            </div>

            {/* FILE INPUT */}
            <input
              type="file"
              hidden
              accept="image/*"
              ref={fileInputRef}
              onChange={
                handleImageSelect
              }
            />

            {/* DROPDOWN */}
            {showMenu && (

              <div className="absolute top-32 left-1/2 -translate-x-1/2 w-56 rounded-xl shadow-2xl z-50 border border-[var(--border)] bg-[var(--card)] text-[var(--text)]">

                <div
                  onClick={() => {

                    if (
                      user.avatar
                    ) {

                      window.open(
                        user.avatar,
                        "_blank"
                      );
                    }

                    setShowMenu(
                      false
                    );
                  }}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-[var(--primary)]/10"
                >
                  Show Profile Photo
                </div>

                <div
                  onClick={() => {

                    fileInputRef.current.click();
                  }}
                  className="px-4 py-3 text-sm cursor-pointer hover:bg-[var(--primary)]/10"
                >
                  Update Profile Photo
                </div>

                <div
                  onClick={
                    removeAvatar
                  }
                  className="px-4 py-3 text-sm text-red-400 cursor-pointer hover:bg-red-500/10"
                >
                  Remove Profile Photo
                </div>

              </div>
            )}

          </div>

          {/* NAME */}
          <div className="mt-4 w-full text-center">

            {editField ===
            "name" ? (

              <div className="flex justify-center items-center gap-2">

                <input
                  value={
                    user.name
                  }
                  onChange={(e) =>
                    handleChange(
                      "name",
                      e.target
                        .value
                    )
                  }
                  autoFocus
                  className="text-center bg-transparent border-b border-[var(--primary)] outline-none"
                />

                <button
                  disabled={
                    loading
                  }
                  onClick={() =>
                    saveField(
                      "name"
                    )
                  }
                >

                  <FiCheck className="text-green-400 cursor-pointer" />

                </button>

              </div>

            ) : (

              <div className="flex justify-center items-center gap-2">

                <h3 className="text-lg font-semibold">
                  {user.name}
                </h3>

                <FiEdit2
                  className="cursor-pointer"
                  onClick={() =>
                    setEditField(
                      "name"
                    )
                  }
                />

              </div>
            )}

          </div>

          {/* ABOUT */}
          <div className="mt-2 w-full text-center text-sm opacity-70">

            {editField ===
            "about" ? (

              <div className="flex justify-center items-center gap-2">

                <input
                  value={
                    user.about
                  }
                  onChange={(e) =>
                    handleChange(
                      "about",
                      e.target
                        .value
                    )
                  }
                  autoFocus
                  className="text-center bg-transparent border-b border-[var(--primary)] outline-none"
                />

                <button
                  disabled={
                    loading
                  }
                  onClick={() =>
                    saveField(
                      "about"
                    )
                  }
                >

                  <FiCheck className="text-green-400 cursor-pointer" />

                </button>

              </div>

            ) : (

              <div className="flex justify-center items-center gap-2">

                <span>
                  {user.about ||
                    "No bio"}
                </span>

                <FiEdit2
                  className="cursor-pointer"
                  onClick={() =>
                    setEditField(
                      "about"
                    )
                  }
                />

              </div>
            )}

          </div>

          {/* EMAIL */}
          <div className="mt-2 w-full text-center text-sm opacity-80">

            {editField ===
            "email" ? (

              <div className="flex justify-center items-center gap-2">

                <input
                  value={
                    user.email
                  }
                  onChange={(e) =>
                    handleChange(
                      "email",
                      e.target
                        .value
                    )
                  }
                  autoFocus
                  className="text-center bg-transparent border-b border-[var(--primary)] outline-none"
                />

                <button
                  disabled={
                    loading
                  }
                  onClick={() =>
                    saveField(
                      "email"
                    )
                  }
                >

                  <FiCheck className="text-green-400 cursor-pointer" />

                </button>

              </div>

            ) : (

              <div className="flex justify-center items-center gap-2">

                <span>
                  {user.email ||
                    "No email"}
                </span>

                <FiEdit2
                  className="cursor-pointer"
                  onClick={() =>
                    setEditField(
                      "email"
                    )
                  }
                />

              </div>
            )}

          </div>

          {/* PHONE */}
          <p className="text-xs opacity-50 mt-2">
            {user.phone}
          </p>

        </div>

        {/* SETTINGS */}
        <Section title="Account">

          <SettingItem
            icon={<FiLock />}
            label="Privacy"
            path="/settings/privacy"
          />

          <SettingItem
            icon={<FiShield />}
            label="Security"
            path="/settings/security"
          />

          <SettingItem
            icon={<FiKey />}
            label="Two-step verification"
            path="/settings/two-step"
          />

          <SettingItem
            icon={<FiRefreshCw />}
            label="Change number"
            path="/settings/change-number"
          />

        </Section>

        <Section title="Preferences">

          <SettingItem
            icon={<FiMessageCircle />}
            label="Chats"
            path="/settings/chats"
          />

          <SettingItem
            icon={<FiBell />}
            label="Notifications"
            path="/settings/notifications"
          />

          <SettingItem
            icon={<FiDatabase />}
            label="Storage and data"
            path="/settings/storage"
          />

        </Section>

        <Section title="Help">

          <SettingItem
            icon={<FiHelpCircle />}
            label="Help center"
            path="/settings/help"
          />

          <SettingItem
            icon={<FiUsers />}
            label="Invite a friend"
            onClick={() => {

              if (
                navigator.share
              ) {

                navigator.share({
                  title:
                    "Talksy",

                  text:
                    "Join me 🚀",

                  url:
                    window.location
                      .origin,
                });

              } else {

                toast.error(
                  "Sharing not supported"
                );
              }
            }}
          />

        </Section>

        {/* LOGOUT */}
        <div
          onClick={
            handleLogout
          }
          className="glass text-center py-3 text-red-400 rounded-xl cursor-pointer"
        >
          Logout
        </div>

      </div>

      {/* 🔥 CROPPER */}
      {showCropper &&
        preview && (

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

              onCropDone={
                async (
                  croppedFile
                ) => {

                  try {

                    if (
                      !croppedFile
                    ) {

                      return;
                    }

                    setLoading(
                      true
                    );

                    // 🔥 NEW PREVIEW
                    const croppedPreview =
                      URL.createObjectURL(
                        croppedFile
                      );

                    setLocalUser(
                      (
                        prev
                      ) => ({
                        ...prev,
                        avatar:
                          croppedPreview,
                      })
                    );

                    setShowCropper(
                      false
                    );

                    // 🔥 UPLOAD
                    const formData =
                      new FormData();

                    formData.append(
                      "file",
                      croppedFile
                    );

                    formData.append(
                      "type",
                      "profile"
                    );

                    const uploadRes =
                      await API.post(
                        "/file/upload",
                        formData,
                        {
                          headers:
                            {
                              "Content-Type":
                                "multipart/form-data",
                            },
                        }
                      );

                    // 🔥 FINAL URL
                    const imageUrl =
                      uploadRes
                        .data
                        ?.data
                        ?.url ||
                      "";

                    if (
                      !imageUrl
                    ) {

                      toast.error(
                        "Image upload failed"
                      );

                      return;
                    }

                    // 🔥 UPDATE DB
                    await API.put(
                      "/users/me",
                      {
                        avatar:
                          imageUrl,
                      }
                    );

                    await refreshUser();

                    toast.success(
                      "Profile photo updated ✅"
                    );

                  } catch (
                    err
                  ) {

                    console.log(
                      err
                    );

                    let msg =
                      "Image upload failed";

                    if (
                      err
                        .response
                        ?.data
                        ?.message
                    ) {

                      msg =
                        err
                          .response
                          .data
                          .message;
                    }

                    toast.error(
                      msg
                    );

                  } finally {

                    setLoading(
                      false
                    );
                  }
                }
              }
            />

          </div>

        </div>
      )}

    </div>
  );
};

export default Profile;

/* ===================================== */
/* 🔥 SECTION */
/* ===================================== */
const Section = ({
  title,
  children,
}) => (

  <div>

    <p className="text-xs opacity-50 px-2 mb-2">
      {title}
    </p>

    <div className="glass rounded-2xl divide-y divide-[var(--border)]">

      {children}

    </div>

  </div>
);

/* ===================================== */
/* 🔥 SETTING ITEM */
/* ===================================== */
const SettingItem = ({
  icon,
  label,
  path,
  onClick,
}) => {

  const navigate =
    useNavigate();

  return (
    <div
      onClick={() =>
        onClick
          ? onClick()
          : navigate(path)
      }
      className="flex justify-between px-4 py-3 cursor-pointer hover:bg-[var(--primary)]/10"
    >

      <div className="flex gap-3 items-center">

        {icon}

        <span>
          {label}
        </span>

      </div>

      <span>›</span>

    </div>
  );
};