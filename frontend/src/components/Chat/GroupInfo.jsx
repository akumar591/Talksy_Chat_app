import {
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiUserPlus,
  FiMoreVertical,
  FiShield,
  FiLogOut,
  FiTrash2,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

import { useGroup } from "../../context/GroupContext";

import MediaViewerModal from "../Chat/MediaViewerModal";

import API from "../../api/axios";

import toast from "react-hot-toast";

// 🔥 NEW
import AddMembersModal from "../Chat/AddMembersModal";

import ImageCropper from "../Common/ImageCropper";

const GroupInfo = () => {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  const { user } =
    useAuth();

  const {

    fetchGroupById,

    groupDetails,

    loading,

    leaveGroup,

    deleteGroup,

  } = useGroup();

  const [group, setGroup] =
    useState(null);

  const [showMenu, setShowMenu] =
    useState(false);

  // 🔥 IMAGE MENU
  const [
    showImageMenu,
    setShowImageMenu,
  ] = useState(false);

  const [
    showAvatarViewer,
    setShowAvatarViewer,
  ] = useState(false);

  // 🔥 NEW
  const [
    showAddMembersModal,
    setShowAddMembersModal,
  ] = useState(false);

  // 🔥 CROPPER
  const [
    showCropper,
    setShowCropper,
  ] = useState(false);

  const [preview, setPreview] =
    useState(null);

  const [crop, setCrop] =
    useState({
      x: 0,
      y: 0,
    });

  const [zoom, setZoom] =
    useState(1);

  const menuRef =
    useRef(null);

  const imageMenuRef =
    useRef(null);

  // ===============================
  // 🔥 FETCH GROUP
  // ===============================
  useEffect(() => {

    const loadGroup =
      async () => {

        try {

          const data =
            await fetchGroupById(
              id
            );

          setGroup(data);

        } catch (err) {

          console.log(err);
        }
      };

    if (id) {

      loadGroup();
    }

  }, [id]);

  // ===============================
  // 🔥 GROUP FALLBACK
  // ===============================
  useEffect(() => {

    if (
      groupDetails &&
      String(groupDetails.id) ===
      String(id)
    ) {

      setGroup(groupDetails);
    }

  }, [
    groupDetails,
    id,
  ]);

  // ===============================
  // 🔥 CLOSE MENU OUTSIDE
  // ===============================
  useEffect(() => {

    const handleClickOutside =
      (e) => {

        if (
          menuRef.current &&
          !menuRef.current.contains(
            e.target
          )
        ) {

          setShowMenu(false);
        }

        if (
          imageMenuRef.current &&
          !imageMenuRef.current.contains(
            e.target
          )
        ) {

          setShowImageMenu(false);
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

  // ===============================
  // 🔥 CHECK ADMIN
  // ===============================
  const isAdmin =
    useMemo(() => {

      return group?.members?.some(

        (m) =>

          String(m?.id) ===
          String(user?.id)

          &&

          m.role === "ADMIN"
      );

    }, [
      group,
      user,
    ]);

  // ===============================
  // 🔥 CHECK CREATOR
  // ===============================
  const isCreator =
    useMemo(() => {

      return (
        String(
          group?.createdById
        ) ===
        String(user?.id)
      );

    }, [
      group,
      user,
    ]);

  const canManageGroupPhoto =
    isAdmin || isCreator;

  // ===============================
  // 🔥 HANDLE IMAGE
  // ===============================
  const handleImage =
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

      setShowImageMenu(
        false
      );

      setShowCropper(
        true
      );
    };

  // ===============================
  // 🔥 REMOVE GROUP IMAGE
  // ===============================
  const removeGroupImage =
    async () => {

      try {

        await API.put(
          `/groups/${group.id}`,
          {
            avatar: "",
          }
        );

        const updated =
          await fetchGroupById(
            id
          );

        setGroup(updated);

        toast.success(
          "Group image removed ✅"
        );

      } catch (err) {

        console.log(err);

        toast.error(
          "Failed to remove image"
        );
      }
    };

  // ===============================
  // 🔥 REMOVE MEMBER
  // ===============================
  const removeMember =
    async (memberId) => {

      try {

        const confirmRemove =
          window.confirm(
            "Remove this member?"
          );

        if (
          !confirmRemove
        ) {

          return;
        }

        await API.delete(
          `/groups/${group.id}/members/${memberId}`
        );

        const updated =
          await fetchGroupById(
            id
          );

        setGroup(updated);

        toast.success(
          "Member removed ✅"
        );

      } catch (err) {

        console.log(err);

        const msg =
          err.response?.data
            ?.message ||
          "Failed to remove member";

        toast.error(msg);
      }
    };

  // ===============================
  // 🔥 LOADING
  // ===============================
  if (loading) {

    return (

      <div className="w-full h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--text)]">

        <div className="flex flex-col items-center gap-3">

          <div className="w-10 h-10 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>

          <p className="text-sm opacity-70">

            Loading group...
          </p>
        </div>
      </div>
    );
  }

  // ===============================
  // 🔥 GROUP NOT FOUND
  // ===============================
  if (!group) {

    return (

      <div className="w-full h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col">

        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">

          <button
            onClick={() =>
              navigate(-1)
            }
            className="text-xl"
          >
            <FiArrowLeft />
          </button>

          <h2 className="font-semibold">

            Group Info
          </h2>
        </div>

        <div className="flex-1 flex items-center justify-center text-sm opacity-70">

          Group not found

        </div>
      </div>
    );
  }

  return (
    <div
      className="
        w-full
        min-h-screen

        bg-[var(--bg)]
        text-[var(--text)]

        flex
        justify-center

        md:mt-16
      "
    >

      {/* CONTAINER */}
      <div
        className="
          w-full
          md:max-w-2xl

          min-h-screen

          flex
          flex-col
        "
      >

        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-40

            flex
            items-center
            justify-between

            px-4
            py-3

            border-b
            border-[var(--border)]

            bg-[var(--card)]/90
            backdrop-blur-xl
          "
        >

          {/* LEFT */}
          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(-1)
              }
              className="
                w-10
                h-10

                rounded-full

                flex
                items-center
                justify-center

                hover:bg-white/5
              "
            >
              <FiArrowLeft />
            </button>

            <h2 className="font-semibold text-lg">

              Group Info
            </h2>
          </div>

          {/* RIGHT */}
          <div
            className="relative"
            ref={menuRef}
          >

            <button

              onClick={() =>
                setShowMenu(
                  !showMenu
                )
              }

              className="
                w-10
                h-10

                rounded-full

                flex
                items-center
                justify-center

                hover:bg-white/5
              "
            >
              <FiMoreVertical />
            </button>

            {/* MENU */}
            {showMenu && (

              <div
                className="
                  absolute
                  right-0
                  top-12

                  w-56

                  rounded-2xl

                  bg-[var(--card)]

                  border
                  border-[var(--border)]

                  shadow-2xl

                  overflow-hidden

                  z-50
                "
              >

                {/* OPEN CHAT */}
                <button

                  onClick={() => {

                    navigate(
                      `/group/${group.id}`
                    );

                    setShowMenu(false);
                  }}

                  className="
                    w-full

                    px-4
                    py-3

                    text-left
                    text-sm

                    hover:bg-white/5
                  "
                >
                  Open Chat
                </button>

                {/* ADD MEMBER */}
                {isAdmin && (

                  <button

                    onClick={() => {

                      setShowAddMembersModal(
                        true
                      );

                      setShowMenu(false);
                    }}

                    className="
                      w-full

                      px-4
                      py-3

                      text-left
                      text-sm

                      hover:bg-white/5
                    "
                  >
                    Add Members
                  </button>
                )}

                {/* DELETE */}
                {isCreator && (

                  <button

                    onClick={async () => {

                      const confirmDelete =
                        window.confirm(
                          "Delete this group?"
                        );

                      if (
                        !confirmDelete
                      ) {

                        return;
                      }

                      const res =
                        await deleteGroup(
                          group.id
                        );

                      if (
                        res.success
                      ) {

                        navigate("/");
                      }

                      setShowMenu(false);
                    }}

                    className="
                      w-full

                      px-4
                      py-3

                      text-left
                      text-sm

                      text-red-400

                      hover:bg-red-500/10
                    "
                  >
                    Delete Group
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TOP */}
        <div
          className="
            flex
            flex-col
            items-center

            px-6
            pt-8
            pb-7

            border-b
            border-[var(--border)]
          "
        >

          {/* GROUP AVATAR */}
          <div
            className="relative"
            ref={imageMenuRef}
          >

            {group.avatar ? (

              <img
                src={

                  group.avatar?.startsWith(
                    "http"
                  )

                    ? group.avatar

                    : `http://localhost:8080${group.avatar}`
                }
                alt={group.name}
                onClick={(e) => {

                  e.stopPropagation();

                  // 🔥 ADMIN / CREATOR
                  if (
                    canManageGroupPhoto
                  ) {

                    setShowImageMenu(
                      !showImageMenu
                    );
                  }

                  // 🔥 MEMBER
                  else {

                    setShowAvatarViewer(
                      true
                    );
                  }
                }}
                className="
                  w-32
                  h-32

                  rounded-full
                  object-cover

                  ring-4
                  ring-[var(--primary)]/20

                  cursor-pointer
                "
              />

            ) : (

              <div
                onClick={(e) => {

                  e.stopPropagation();

                  // 🔥 ADMIN / CREATOR
                  if (
                    canManageGroupPhoto
                  ) {

                    setShowImageMenu(
                      !showImageMenu
                    );
                  }

                  // 🔥 MEMBER
                  else {

                    setShowAvatarViewer(
                      true
                    );
                  }
                }}

                className="
                  w-32
                  h-32

                  rounded-full

                  bg-gradient-to-br
                  from-[var(--primary)]
                  to-purple-500

                  flex
                  items-center
                  justify-center

                  text-5xl
                  font-bold
                  uppercase

                  text-white

                  cursor-pointer
                "
              >
                {group.name?.charAt(0)}
              </div>
            )}

            {/* CAMERA */}
            {canManageGroupPhoto && (

              <button
                onClick={() =>
                  setShowImageMenu(
                    !showImageMenu
                  )
                }
                className="
                  absolute
                  bottom-1
                  right-1

                  w-10
                  h-10

                  rounded-full

                  flex
                  items-center
                  justify-center

                  bg-[var(--primary)]

                  text-black

                  shadow-xl
                "
              >
                <FiCamera />
              </button>
            )}

            {/* IMAGE MENU */}
            {showImageMenu &&
              canManageGroupPhoto && (

                <div
                  className="
                  absolute
                  top-36
                  left-1/2
                  -translate-x-1/2

                  w-60

                  rounded-2xl

                  bg-[var(--card)]

                  border
                  border-[var(--border)]

                  overflow-hidden

                  shadow-2xl

                  z-50
                "
                >

                  {/* VIEW */}
                  <button

                    onClick={() => {

                      if (
                        group.avatar
                      ) {

                        setShowAvatarViewer(
                          true
                        );
                      }

                      setShowImageMenu(
                        false
                      );
                    }}

                    className="
                    w-full

                    px-4
                    py-3

                    text-left
                    text-sm

                    hover:bg-white/5
                  "
                  >
                    View Group Photo
                  </button>

                  {/* UPDATE */}
                  <label
                    className="
                    block

                    px-4
                    py-3

                    text-sm

                    cursor-pointer

                    hover:bg-white/5
                  "
                  >

                    Change Group Photo

                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={
                        handleImage
                      }
                    />
                  </label>

                  {/* REMOVE */}
                  <button

                    onClick={
                      removeGroupImage
                    }

                    className="
                    w-full

                    px-4
                    py-3

                    text-left
                    text-sm

                    text-red-400

                    hover:bg-red-500/10
                  "
                  >
                    Remove Group Photo
                  </button>
                </div>
              )}
          </div>

          {/* NAME */}
          <h1
            className="
              mt-5

              text-2xl
              font-bold

              text-center
            "
          >
            {group.name}
          </h1>

          {/* ABOUT */}
          <p
            className="
              mt-2

              text-sm
              opacity-70

              text-center
              leading-relaxed

              max-w-md
            "
          >
            {group.about ||
              "No description"}
          </p>

          {/* META */}
          <div
            className="
              mt-4

              flex
              flex-col
              items-center

              text-xs
              opacity-60
            "
          >

            <span>
              {group.memberCount || 0}
              {" "}
              members
            </span>

            <span className="mt-1">

              Created by
              {" "}
              {group.createdByName}
            </span>
          </div>
        </div>

        {/* ACTION */}
        {isAdmin && (

          <div
            className="
              px-4
              py-5

              border-b
              border-[var(--border)]
            "
          >

            <button

              onClick={() => {

                setShowAddMembersModal(
                  true
                );
              }}

              className="
                w-full

                flex
                items-center
                justify-center

                gap-3

                py-4

                rounded-2xl

                bg-[var(--card)]

                hover:bg-white/5

                transition
              "
            >

              <FiUserPlus className="text-xl" />

              <span className="text-sm font-medium">

                Add Member
              </span>
            </button>
          </div>
        )}

        {/* MEMBERS */}
        <div className="flex-1">

          {/* TITLE */}
          <div className="px-4 py-4">

            <h3
              className="
                text-sm
                font-semibold
                opacity-70
              "
            >
              Members
            </h3>
          </div>

          {/* MEMBER LIST */}
          <div className="pb-10">

            {group.members?.map(
              (member) => {

                const memberUser =
                  member;

                const memberIsAdmin =
                  member.role ===
                  "ADMIN";

                const memberIsCreator =

                  String(
                    memberUser?.id
                  ) ===

                  String(
                    group.createdById
                  );

                return (

                  <div
                    key={member.id}

                    onClick={() => {

                      if (
                        String(memberUser?.id) ===
                        String(user?.id)
                      ) {

                        return;
                      }

                      navigate(
                        `/chat/${memberUser.id}`
                      );
                    }}

                    className="
                      flex
                      items-center
                      gap-3

                      px-4
                      py-3

                      border-b
                      border-[var(--border)]

                      hover:bg-white/5

                      transition

                      cursor-pointer
                    "
                  >

                    {/* AVATAR */}
                    <div className="relative shrink-0">

                      <img
                        src={

                          memberUser?.avatar?.startsWith(
                            "http"
                          )

                            ? memberUser.avatar

                            : `http://localhost:8080${memberUser?.avatar}`
                        }

                        alt={
                          memberUser?.name
                        }

                        onError={(e) => {

                          e.target.src =
                            `https://ui-avatars.com/api/?name=${memberUser?.name}`;
                        }}

                        className="
                          w-12
                          h-12

                          rounded-full
                          object-cover
                        "
                      />

                      {/* ONLINE */}
                      {memberUser?.online && (

                        <span
                          className="
                            absolute
                            bottom-0
                            right-0

                            w-3
                            h-3

                            rounded-full

                            bg-green-500

                            border-2
                            border-[var(--bg)]
                          "
                        />
                      )}
                    </div>

                    {/* INFO */}
                    <div className="flex-1 min-w-0">

                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          flex-wrap
                        "
                      >

                        <h4
                          className="
                            font-medium
                            truncate
                          "
                        >
                          {memberUser?.name}
                        </h4>

                        {/* CREATOR */}
                        {memberIsCreator && (

                          <span
                            className="
                              px-2
                              py-[2px]

                              rounded-full

                              text-[10px]

                              bg-yellow-500/15
                              text-yellow-400
                            "
                          >
                            Creator
                          </span>
                        )}

                        {/* ADMIN */}
                        {memberIsAdmin && (

                          <span
                            className="
                              flex
                              items-center
                              gap-1

                              px-2
                              py-[2px]

                              rounded-full

                              text-[10px]

                              bg-[var(--primary)]/15
                              text-[var(--primary)]
                            "
                          >

                            <FiShield size={10} />

                            Admin
                          </span>
                        )}
                      </div>

                      <p
                        className="
                          text-xs
                          opacity-60
                        "
                      >

                        {memberUser?.online
                          ? "online"
                          : "offline"}
                      </p>
                    </div>

                    {/* REMOVE */}
                    {isAdmin &&
                      !memberIsAdmin &&
                      !memberIsCreator &&

                      String(
                        memberUser?.id
                      ) !==
                      String(
                        user?.id
                      ) && (

                        <button

                          onClick={(e) => {

                            e.stopPropagation();

                            removeMember(
                              memberUser.id
                            );
                          }}

                          className="
                          w-10
                          h-10

                          rounded-full

                          flex
                          items-center
                          justify-center

                          text-red-400

                          hover:bg-red-500/10

                          transition
                        "
                        >

                          <FiTrash2 />

                        </button>
                      )}
                  </div>
                );
              }
            )}
          </div>
        </div>

        {/* LEAVE GROUP */}
        <div
          className="
            px-4
            py-6

            border-t
            border-[var(--border)]
          "
        >

          <button

            onClick={async () => {

              const confirmLeave =
                window.confirm(
                  "Leave this group?"
                );

              if (
                !confirmLeave
              ) {

                return;
              }

              const res =
                await leaveGroup(
                  group.id
                );

              if (
                res.success
              ) {

                navigate("/");
              }
            }}

            className="
              w-full

              relative

              overflow-hidden

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

              hover:scale-[1.01]
              hover:border-red-500/40

              transition-all
              duration-300
            "
          >

            <div
              className="
                absolute
                inset-0

                bg-red-500/5

                opacity-0
                hover:opacity-100

                transition
              "
            />

            <FiLogOut
              className="
                text-red-400
                text-xl

                relative
                z-10
              "
            />

            <span
              className="
                text-sm
                font-semibold

                text-red-400

                relative
                z-10
              "
            >

              Leave Group
            </span>
          </button>
        </div>
      </div>

      {/* 🔥 ADD MEMBERS MODAL */}
      {showAddMembersModal && (

        <AddMembersModal

          group={group}

          onClose={() =>
            setShowAddMembersModal(
              false
            )
          }
        />
      )}

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

                      // 🔥 NEW PREVIEW
                      const croppedPreview =
                        URL.createObjectURL(
                          croppedFile
                        );

                      setPreview(
                        croppedPreview
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

                      // 🔥 UPDATE GROUP
                      await API.put(
                        `/groups/${group.id}`,
                        {
                          avatar:
                            imageUrl,
                        }
                      );

                      const updated =
                        await fetchGroupById(
                          id
                        );

                      setGroup(updated);

                      toast.success(
                        "Group image updated ✅"
                      );

                    } catch (
                    err
                    ) {

                      console.log(
                        err
                      );

                      const msg =
                        err.response
                          ?.data
                          ?.message ||
                        "Upload failed ❌";

                      toast.error(
                        msg
                      );
                    }
                  }
                }
              />

            </div>

          </div>
        )}

      {/* 🔥 GROUP IMAGE VIEWER */}
      <MediaViewerModal
        open={showAvatarViewer}

        onClose={() =>
          setShowAvatarViewer(false)
        }

        medias={[
          {
            type: "IMAGE",

            content:
              group.avatar?.startsWith(
                "http"
              )

                ? group.avatar

                : `http://localhost:8080${group.avatar}`,
          },
        ]}

        selectedIndex={0}

        setSelectedIndex={() => { }}
      />
    </div>
  );
};

export default GroupInfo;