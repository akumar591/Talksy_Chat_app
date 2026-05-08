import { useMemo } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  FiArrowLeft,
  FiCamera,
  FiUserPlus,
  FiMoreVertical,
  FiShield,
  FiTrash2,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";

const dummyGroups = [
  {
    id: "101",

    name: "Talksy Dev Team",

    about: "Official developers discussion group 🚀",

    avatar: "https://i.pravatar.cc/300?img=12",

    createdBy: "Abhishek",

    createdAt: "12 May 2026",

    members: [
      {
        id: 1,
        name: "Abhishek",
        avatar: "https://i.pravatar.cc/150?img=1",
        role: "admin",
        online: true,
      },

      {
        id: 2,
        name: "Rahul",
        avatar: "https://i.pravatar.cc/150?img=2",
        role: "admin",
        online: false,
      },

      {
        id: 3,
        name: "Priya",
        avatar: "https://i.pravatar.cc/150?img=3",
        role: "member",
        online: true,
      },

      {
        id: 4,
        name: "Amit",
        avatar: "https://i.pravatar.cc/150?img=4",
        role: "member",
        online: false,
      },

      {
        id: 5,
        name: "Neha",
        avatar: "https://i.pravatar.cc/150?img=5",
        role: "member",
        online: false,
      },
    ],
  },
];

const GroupInfo = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const { user } = useAuth();

  // 🔥 GROUP FIND
  const group = useMemo(() => {
    return dummyGroups.find((g) => String(g.id) === String(id));
  }, [id]);

  // 🔥 CHECK ADMIN
  const isAdmin = useMemo(() => {
    return group?.members?.some(
      (m) => m.name === user?.name && m.role === "admin",
    );
  }, [group, user]);

  if (!group) {
    return (
      <div
        className="
          w-full
          h-screen

          flex
          items-center
          justify-center

          bg-[var(--bg)]
          text-[var(--text)]
        "
      >
        Group not found
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
      "
    >
      {/* 🔥 CONTAINER */}
      <div
        className="
          w-full
          md:max-w-2xl

          min-h-screen

          flex
          flex-col
        "
      >
        {/* 🔥 HEADER */}
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

            bg-[var(--card)]
            backdrop-blur-xl
          "
        >
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-xl">
              <FiArrowLeft />
            </button>

            <h2 className="font-semibold">Group Info</h2>
          </div>

          {/* RIGHT */}
          <button
            className="
              w-9
              h-9

              rounded-full

              flex
              items-center
              justify-center

              hover:bg-white/5
            "
          >
            <FiMoreVertical />
          </button>
        </div>

        {/* 🔥 TOP */}
        <div
          className="
            flex
            flex-col
            items-center

            px-6
            pt-8
            pb-6

            border-b
            border-[var(--border)]
          "
        >
          {/* AVATAR */}
          <div className="relative">
            <img
              src={group.avatar}
              alt={group.name}
              className="
                w-28
                h-28

                rounded-full
                object-cover
              "
            />

            {isAdmin && (
              <button
                className="
                  absolute
                  bottom-1
                  right-1

                  w-9
                  h-9

                  rounded-full

                  flex
                  items-center
                  justify-center

                  bg-[var(--primary)]
                  text-black
                "
              >
                <FiCamera />
              </button>
            )}
          </div>

          {/* NAME */}
          <h1
            className="
              mt-4

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
            "
          >
            {group.about}
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
            <span>{group.members.length} members</span>

            <span className="mt-1">Created by {group.createdBy}</span>

            <span className="mt-1">{group.createdAt}</span>
          </div>
        </div>

        {/* 🔥 ACTIONS */}
        <div
          className="
            grid
            grid-cols-3

            gap-3

            px-4
            py-4

            border-b
            border-[var(--border)]
          "
        >
          {/* ADD MEMBER */}
          {isAdmin && (
            <button
              className="
                flex
                flex-col
                items-center
                justify-center

                gap-2

                py-4

                rounded-2xl

                bg-[var(--card)]

                hover:bg-white/5
              "
            >
              <FiUserPlus className="text-xl" />

              <span className="text-xs">Add Member</span>
            </button>
          )}

          {/* LEAVE */}
          <button
            className="
              flex
              flex-col
              items-center
              justify-center

              gap-2

              py-4

              rounded-2xl

              bg-[var(--card)]

              text-red-400

              hover:bg-red-500/10
            "
          >
            <FiLogOut className="text-xl" />

            <span className="text-xs">Leave Group</span>
          </button>

          {/* DELETE */}
          {isAdmin && (
            <button
              className="
                flex
                flex-col
                items-center
                justify-center

                gap-2

                py-4

                rounded-2xl

                bg-[var(--card)]

                text-red-400

                hover:bg-red-500/10
              "
            >
              <FiTrash2 className="text-xl" />

              <span className="text-xs">Delete Group</span>
            </button>
          )}
        </div>

        {/* 🔥 MEMBERS */}
        <div className="flex-1">
          {/* TITLE */}
          <div className="px-4 py-3">
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

          {/* LIST */}
          <div className="pb-10">
            {group.members.map((member) => {
              const memberIsAdmin = member.role === "admin";

              return (
                <div
                  key={member.id}
                  className="
                      flex
                      items-center
                      gap-3

                      px-4
                      py-3

                      border-b
                      border-[var(--border)]

                      hover:bg-white/5
                    "
                >
                  {/* AVATAR */}
                  <div className="relative">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="
                          w-12
                          h-12

                          rounded-full
                          object-cover
                        "
                    />

                    {member.online && (
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
                        "
                    >
                      <h4
                        className="
                            font-medium
                            truncate
                          "
                      >
                        {member.name}
                      </h4>

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
                      {member.online ? "online" : "offline"}
                    </p>
                  </div>

                  {/* ADMIN ACTIONS */}
                  {isAdmin && member.name !== user?.name && (
                    <button
                      className="
                            px-3
                            py-1.5

                            rounded-lg

                            text-xs

                            bg-white/5

                            hover:bg-white/10
                          "
                    >
                      Manage
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInfo;
