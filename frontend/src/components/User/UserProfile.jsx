import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiPhone,
  FiVideo,
  FiMessageCircle,
  FiChevronRight,
} from "react-icons/fi";

import API from "../../api/axios";

import { useChat } from "../../context/ChatContext";

import MediaViewerModal from "../../components/chat/MediaViewerModal";

const UserProfile = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    messages,
  } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [
    showAvatarViewer,
    setShowAvatarViewer,
  ] = useState(false);

  // ===============================
  // 🔥 FETCH USER
  // ===============================
  useEffect(() => {

    const fetchUser =
      async () => {

        try {

          setLoading(true);

          const res =
            await API.get(
              `/users/${id}`
            );

          const userData =
            res?.data?.data;

          setUser(userData);

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    if (id) {

      fetchUser();
    }

  }, [id]);

  // ===============================
  // 🔥 REAL SHARED MEDIA
  // ===============================
  const sharedMedia =
    useMemo(() => {

      const medias =
        messages.filter(
          msg =>
            (
              msg.type ===
                "IMAGE" ||

              msg.type ===
                "VIDEO" ||

              msg.type ===
                "MEDIA_GROUP"
            ) &&

            (
              msg.senderId ===
                Number(id) ||

              msg.receiverId ===
                Number(id)
            )
        );

      // 🔥 LATEST FIRST
      return medias
        .slice()
        .reverse()
        .slice(0, 10);

    }, [messages, id]);

  // ===============================
  // 🔥 LOADING
  // ===============================
  if (loading) {

    return (

      <div className="
        w-full
        h-screen

        bg-[var(--bg)]

        flex
        items-center
        justify-center

        text-[var(--text)]
      ">

        <div className="
          flex
          flex-col
          items-center

          gap-3
        ">

          <div className="
            w-10
            h-10

            border-4
            border-[var(--primary)]
            border-t-transparent

            rounded-full

            animate-spin
          "></div>

          <p className="
            text-sm
            opacity-70
          ">
            Loading profile...
          </p>

        </div>

      </div>
    );
  }

  // ===============================
  // 🔥 USER NOT FOUND
  // ===============================
  if (!user) {

    return (

      <div className="
        w-full
        h-screen

        bg-[var(--bg)]

        flex
        items-center
        justify-center

        text-[var(--text)]
      ">

        User not found

      </div>
    );
  }

  return (
    <>
      <div className="
        w-full

        bg-[var(--bg)]
        text-[var(--text)]

        flex
        flex-col
        md:items-center

        mt-0
        md:mt-16

        min-h-screen
        md:min-h-[calc(100vh-4rem)]
      ">

        {/* =============================== */}
        {/* 🔥 HEADER */}
        {/* =============================== */}
        <div className="
          sticky
          top-0

          z-30

          w-full
          md:max-w-xl

          flex
          items-center
          justify-between

          px-4
          py-3

          border-b
          border-[var(--border)]

          bg-[var(--bg)]/80
          backdrop-blur-xl
        ">

          {/* 🔥 MOBILE BACK */}
          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              text-xl
              md:hidden
            "
          >

            <FiArrowLeft />

          </button>

          <h2 className="
            font-semibold
            text-lg
          ">
            Contact info
          </h2>

          {/* 🔥 DESKTOP BACK */}
          <button
            onClick={() =>
              navigate(-1)
            }
            className="
              hidden
              md:flex

              items-center
              gap-2

              text-sm

              opacity-70

              hover:text-[var(--primary)]

              transition
            "
          >

            <FiArrowLeft />

            Back

          </button>

        </div>

        {/* =============================== */}
        {/* 🔥 MAIN */}
        {/* =============================== */}
        <div className="
          w-full
          md:max-w-xl
        ">

          {/* =============================== */}
          {/* 🔥 PROFILE TOP */}
          {/* =============================== */}
          <div className="
            relative

            flex
            flex-col
            items-center

            py-8
            px-4
          ">

            {/* 🔥 BG */}
            <div className="
              absolute
              top-0

              w-56
              h-56

              bg-[var(--primary)]/10

              blur-3xl

              rounded-full

              pointer-events-none
            "></div>

            {/* 🔥 AVATAR */}
            <div className="
              relative
              z-10
            ">

              {user.avatar ? (

                <img
                  src={user.avatar}
                  alt={user.name}

                  onClick={() =>
                    setShowAvatarViewer(
                      true
                    )
                  }

                  className="
                    w-32
                    h-32

                    md:w-36
                    md:h-36

                    rounded-full

                    object-cover

                    border-[5px]
                    border-[var(--card)]

                    shadow-[0_10px_40px_rgba(0,0,0,0.35)]

                    cursor-pointer

                    hover:scale-[1.03]

                    transition-all
                    duration-300
                  "
                />

              ) : (

                <div className="
                  w-32
                  h-32

                  md:w-36
                  md:h-36

                  rounded-full

                  bg-[var(--card)]

                  flex
                  items-center
                  justify-center

                  text-5xl
                  font-semibold

                  uppercase
                ">

                  {user.name?.charAt(0)}

                </div>
              )}

              {/* 🔥 ONLINE */}
              {user.online && (

                <span className="
                  absolute
                  bottom-2
                  right-2

                  w-5
                  h-5

                  bg-green-500

                  rounded-full

                  border-4
                  border-[var(--bg)]
                "></span>
              )}

            </div>

            {/* 🔥 NAME */}
            <h3 className="
              relative
              z-10

              text-2xl
              md:text-3xl

              font-semibold

              mt-4
            ">

              {user.name}

            </h3>

            {/* 🔥 STATUS */}
            <p className="
              relative
              z-10

              text-sm

              opacity-60

              mt-2
            ">

              {user.online
                ? "online"
                : "last seen recently"}

            </p>

          </div>

          {/* =============================== */}
          {/* 🔥 ACTIONS */}
          {/* =============================== */}
          <div className="
            flex
            justify-center

            gap-10

            py-4
            px-4
          ">

            {/* 🔥 MESSAGE */}
            <button
              onClick={() =>
                navigate(`/chat/${id}`)
              }
              className="
                flex
                flex-col
                items-center

                text-sm

                hover:text-[var(--primary)]

                transition
              "
            >

              <div className="
                w-14
                h-14

                rounded-2xl

                bg-[var(--card)]

                flex
                items-center
                justify-center

                mb-2

                shadow-lg
              ">

                <FiMessageCircle className="text-2xl" />

              </div>

              Message

            </button>

            {/* 🔥 AUDIO */}
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
              className="
                flex
                flex-col
                items-center

                text-sm

                hover:text-[var(--primary)]

                transition
              "
            >

              <div className="
                w-14
                h-14

                rounded-2xl

                bg-[var(--card)]

                flex
                items-center
                justify-center

                mb-2

                shadow-lg
              ">

                <FiPhone className="text-2xl" />

              </div>

              Call

            </button>

            {/* 🔥 VIDEO */}
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
              className="
                flex
                flex-col
                items-center

                text-sm

                hover:text-[var(--primary)]

                transition
              "
            >

              <div className="
                w-14
                h-14

                rounded-2xl

                bg-[var(--card)]

                flex
                items-center
                justify-center

                mb-2

                shadow-lg
              ">

                <FiVideo className="text-2xl" />

              </div>

              Video

            </button>

          </div>

          {/* =============================== */}
          {/* 🔥 INFO */}
          {/* =============================== */}
          <div className="
            px-4

            space-y-4

            pb-10
          ">

            {/* 🔥 ABOUT */}
            <div className="
              bg-[var(--card)]

              p-5

              rounded-3xl

              border
              border-[rgba(255,255,255,0.04)]
            ">

              <p className="
                text-xs

                opacity-60

                uppercase
                tracking-wide
              ">
                About
              </p>

              <p className="
                mt-2

                break-words

                leading-relaxed
              ">

                {user.bio &&
                user.bio.trim() !== ""
                  ? user.bio
                  : "Hey there! I am using Talksy 🚀"}

              </p>

            </div>

            {/* 🔥 PHONE */}
            <div className="
              bg-[var(--card)]

              p-5

              rounded-3xl

              border
              border-[rgba(255,255,255,0.04)]
            ">

              <p className="
                text-xs

                opacity-60

                uppercase
                tracking-wide
              ">
                Phone
              </p>

              <p className="mt-2">

                {user.phone || "Not available"}

              </p>

            </div>

            {/* 🔥 MEDIA */}
            <div
              onClick={() =>
                navigate(`/media/${id}`)
              }
              className="
                bg-[var(--card)]

                p-5

                rounded-3xl

                cursor-pointer

                border
                border-[rgba(255,255,255,0.04)]

                hover:bg-[var(--primary)]/5

                transition
              "
            >

              {/* 🔥 TOP */}
              <div className="
                flex
                items-center
                justify-between

                mb-4
              ">

                <div>

                  <p className="
                    text-base
                    font-medium
                  ">
                    Media, links & docs
                  </p>

                  <p className="
                    text-xs
                    opacity-60

                    mt-1
                  ">
                    Latest shared media
                  </p>

                </div>

                <div className="
                  flex
                  items-center
                  gap-2
                ">

                  <span className="
                    text-xs
                    opacity-60
                  ">

                    {
                      sharedMedia.length
                    }

                  </span>

                  <FiChevronRight className="opacity-50" />

                </div>

              </div>

              {/* 🔥 REAL MEDIA */}
              {sharedMedia.length >
              0 ? (

                <div className="
                  flex
                  gap-3

                  overflow-x-auto

                  hide-scrollbar
                ">

                  {sharedMedia.map(
                    (
                      media,
                      index
                    ) => {

                      // 🔥 VIDEO
                      if (
                        media.type ===
                        "VIDEO"
                      ) {

                        return (

                          <div
                            key={
                              media.id ||
                              index
                            }
                            className="
                              relative

                              shrink-0
                            "
                          >

                            <video
                              src={
                                media.content
                              }
                              className="
                                w-24
                                h-24

                                md:w-28
                                md:h-28

                                rounded-2xl

                                object-cover
                              "
                            />

                            <div className="
                              absolute
                              inset-0

                              bg-black/30

                              rounded-2xl

                              flex
                              items-center
                              justify-center
                            ">

                              <FiVideo className="text-white text-xl" />

                            </div>

                          </div>
                        );
                      }

                      // 🔥 IMAGE
                      return (

                        <img
                          key={
                            media.id ||
                            index
                          }
                          src={
                            media.content
                          }
                          alt=""
                          className="
                            w-24
                            h-24

                            md:w-28
                            md:h-28

                            rounded-2xl

                            object-cover

                            shrink-0
                          "
                        />

                      );
                    }
                  )}

                </div>

              ) : (

                <div className="
                  h-24

                  rounded-2xl

                  bg-[rgba(255,255,255,0.03)]

                  flex
                  items-center
                  justify-center

                  text-sm
                  opacity-60
                ">

                  No shared media yet

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

      {/* 🔥 PROFILE IMAGE VIEWER */}
      <MediaViewerModal
        open={showAvatarViewer}

        onClose={() =>
          setShowAvatarViewer(false)
        }

        medias={[
          {
            type: "IMAGE",
            content: user.avatar,
          },
        ]}

        selectedIndex={0}

        setSelectedIndex={() => {}}
      />
    </>
  );
};

export default UserProfile;