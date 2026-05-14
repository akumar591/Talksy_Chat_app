import React, { useMemo } from "react";

import { useAuth } from "../../context/AuthContext";

/* =============================== */
/* 🔥 GROUP STORIES */
/* =============================== */
const groupStatusesByUser = (
  statuses = []
) => {

  const grouped = {};

  statuses.forEach((status) => {

    if (
      !status?.userId
    ) return;

    if (
      !grouped[
      status.userId
      ]
    ) {

      grouped[
        status.userId
      ] = {

        userId:
          status.userId,

        name:
          status.name,

        avatar:
          status.avatar,

        seen: true,

        statuses: [],
      };
    }

    // 🔥 PUSH STATUS
    grouped[
      status.userId
    ].statuses.push(status);

    // 🔥 IF ANY UNSEEN
    if (!status.seen) {

      grouped[
        status.userId
      ].seen = false;
    }
  });

  return Object.values(
    grouped
  );
};

/* 🔥 MAIN COMPONENT */
const StatusList = ({
  onOpen,
  onAddStatus,

  // 🔥 BACKEND DATA
  userStatuses = [],
  statuses = [],

  loading = false,
}) => {

  // ===============================
  // 🔥 SAFE ARRAY
  // ===============================
  const safeUserStatuses =
    Array.isArray(
      userStatuses
    )

      ?

      userStatuses

      :

      [];

  const safeStatuses =
    Array.isArray(
      statuses
    )

      ?

      statuses

      :

      [];

  // ===============================
  // 🔥 REMOVE OWN STATUS
  // ===============================
  const filteredStatuses =
    safeStatuses.filter(
      (s) =>

        !safeUserStatuses.some(
          (my) =>
            my.userId ===
            s.userId
        )
    );

  // ===============================
  // 🔥 GROUP STORIES
  // ===============================
  const groupedStatuses =
    useMemo(() => {

      return groupStatusesByUser(
        filteredStatuses
      );

    }, [filteredStatuses]);

  // ===============================
  // 🔥 RECENT / VIEWED
  // ===============================
  const recent =
    groupedStatuses.filter(
      (s) => !s.seen
    );

  const viewed =
    groupedStatuses.filter(
      (s) => s.seen
    );

    const { user } = useAuth();
  return (
    <div className="w-full h-full bg-[var(--bg)]">

      <div
        className="
          h-full
          overflow-y-auto

          px-2

          pt-3 md:pt-2

          pb-2

          hide-scrollbar

          space-y-3
        "
      >

        {/* =============================== */}
        {/* 🔥 MY STATUS */}
        {/* =============================== */}
        {safeUserStatuses.length >
          0 ? (

          <div
            onClick={() =>
              onOpen({

                statuses:
                  safeUserStatuses,

                index: 0,

                isOwnStatus: true,
              })
            }
            className="
              flex items-center
              gap-3

              px-3 py-3

              rounded-2xl

              cursor-pointer

              active:scale-[0.98]

              md:hover:bg-[var(--card)]/60

              transition
            "
          >

            {/* 🔥 AVATAR */}
            <div className="relative">

              {/* 🔥 STORY RING */}
              <div
                className="
                  p-[2px]
                  rounded-full

                  bg-gradient-to-tr
                  from-[var(--primary)]
                  to-blue-500
                "
              >

                <img
                  src={
                    safeUserStatuses[0]
                      ?.avatar ||

                    "https://i.pravatar.cc/150?img=12"
                  }
                  alt="My Status"
                  className="
                    w-14 h-14
                    rounded-full
                    object-cover

                    border-2
                    border-[var(--bg)]
                  "
                />

              </div>

              {/* 🔥 ADD BUTTON */}
              <button
                type="button"
                onClick={(e) => {

                  e.stopPropagation();

                  onAddStatus();
                }}
                className="
                  absolute
                  -bottom-1
                  -right-1

                  w-6 h-6

                  rounded-full

                  bg-[var(--primary)]

                  text-white

                  flex items-center
                  justify-center

                  text-sm
                  font-bold

                  border-2
                  border-[var(--bg)]

                  shadow-lg

                  cursor-pointer
                "
              >
                +
              </button>

            </div>

            {/* 🔥 INFO */}
            <div className="flex-1 min-w-0">

              <div className="flex items-center gap-2">

                <p className="font-semibold text-sm">
                  My Status
                </p>

                <span
                  className="
                    text-[10px]

                    px-2 py-[2px]

                    rounded-full

                    bg-[var(--primary)]/15
                    text-[var(--primary)]
                  "
                >
                  {
                    safeUserStatuses.length
                  }
                </span>

              </div>

              <p className="text-xs opacity-60 mt-1">

                {
                  safeUserStatuses[0]
                    ?.time ||
                  "Tap to view your status"
                }

              </p>

            </div>

          </div>

        ) : (

          <div
            onClick={() =>
              onAddStatus()
            }
            className="
              flex items-center
              gap-3

              px-3 py-3

              rounded-2xl

              cursor-pointer

              active:scale-[0.98]

              md:hover:bg-[var(--card)]/60

              transition
            "
          >

            {/* 🔥 AVATAR */}
            <div className="relative">
              <img
                src={user?.avatar}
                alt="My Status"
                className="w-14 h-14 rounded-full object-cover border-2 border-[var(--primary)]"
              />

              {/* 🔥 PLUS */}
              <div
                className="
                  absolute
                  -bottom-1
                  -right-1

                  w-6 h-6

                  rounded-full

                  bg-[var(--primary)]

                  text-white

                  flex items-center
                  justify-center

                  text-sm
                  font-bold

                  border-2
                  border-[var(--bg)]

                  shadow-lg
                "
              >
                +
              </div>

            </div>

            {/* 🔥 TEXT */}
            <div>

              <p className="font-semibold text-sm">
                My Status
              </p>

              <p className="text-xs opacity-60 mt-1">
                Tap to add status
                update
              </p>

            </div>

          </div>

        )}

        {/* =============================== */}
        {/* 🔥 LOADING */}
        {/* =============================== */}
        {loading && (

          <div
            className="
              flex
              items-center
              justify-center

              py-10
            "
          >

            <div
              className="
                w-8 h-8

                border-2
                border-[var(--primary)]/20

                border-t-[var(--primary)]

                rounded-full

                animate-spin
              "
            />

          </div>
        )}

        {/* =============================== */}
        {/* 🔥 RECENT */}
        {/* =============================== */}
        {!loading &&
          recent.length > 0 && (

            <Section
              title="Recent Updates"
              list={recent}
              onOpen={onOpen}
            />
          )}

        {/* =============================== */}
        {/* 🔥 VIEWED */}
        {/* =============================== */}
        {!loading &&
          viewed.length > 0 && (

            <Section
              title="Viewed Updates"
              list={viewed}
              onOpen={onOpen}
              viewed
            />
          )}

        {/* =============================== */}
        {/* 🔥 EMPTY */}
        {/* =============================== */}
        {!loading &&

          recent.length === 0 &&

          viewed.length === 0 &&

          safeUserStatuses.length === 0 && (

            <div
              className="
                flex
                flex-col

                items-center
                justify-center

                py-16

                text-center
              "
            >

              <p
                className="
                  text-sm
                  opacity-60
                "
              >
                No status updates
              </p>

              <p
                className="
                  text-xs
                  opacity-40
                  mt-2
                "
              >
                Add a new story
              </p>

            </div>
          )}

      </div>

    </div>
  );
};

export default StatusList;

/* =============================== */
/* 🔥 SECTION */
/* =============================== */

const Section = ({
  title,
  list,
  onOpen,
  viewed,
}) => (

  <div>

    <p className="text-xs opacity-60 px-3 mb-1">
      {title}
    </p>

    {list.map((group) => (

      <StatusItem
        key={group.userId}
        group={group}
        onOpen={onOpen}
        viewed={viewed}
      />
    ))}

  </div>
);

/* =============================== */
/* 🔥 STATUS ITEM */
/* =============================== */
const StatusItem = ({
  group,
  onOpen,
  viewed,
}) => {

  const latestStatus =

    group.statuses[
    group.statuses.length - 1
    ];

  return (
    <div
      onClick={() =>
        onOpen({

          statuses:
            group.statuses,

          index: 0,

          isOwnStatus: false,
        })
      }
      className="
        flex items-center
        gap-3

        px-3 py-3

        rounded-xl

        cursor-pointer

        active:scale-[0.98]

        md:hover:bg-[var(--card)]/60

        transition
      "
    >

      {/* 🔥 AVATAR */}
      <div
        className={`
          p-[2px]
          rounded-full

          ${viewed

            ?

            "bg-gray-500/40"

            :

            "bg-gradient-to-tr from-[var(--primary)] to-blue-500"
          }
        `}
      >

        <img
          src={
            latestStatus?.avatar ||

            "https://i.pravatar.cc/150?img=10"
          }
          alt={latestStatus?.name}
          className="
            w-12 h-12
            rounded-full
            object-cover
          "
        />

      </div>

      {/* 🔥 INFO */}
      <div className="flex-1 min-w-0">

        <div className="flex justify-between items-center">

          <p className="font-medium truncate text-sm">

            {
              latestStatus?.name ||
              "Unknown"
            }

          </p>

          <span className="text-[10px] opacity-60">

            {
              latestStatus?.time ||
              ""
            }

          </span>

        </div>

        {/* 🔥 TYPE */}
        <p className="text-xs opacity-60">

          {
            group.statuses.length
          } updates

        </p>

        {/* 🔥 CAPTION */}
        {latestStatus?.caption && (

          <p className="text-xs opacity-50 truncate mt-1">

            {
              latestStatus.caption
            }

          </p>
        )}

      </div>

    </div>
  );
};