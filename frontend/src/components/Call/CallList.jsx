import { useState } from "react";

import {
  FiPhoneIncoming,
  FiPhoneOutgoing,
  FiPhoneMissed,
  FiVideo,
  FiSearch,
} from "react-icons/fi";

/* 🔥 25 DEMO USERS */
const calls = [
  ...Array.from(
    { length: 25 },
    (_, i) => ({

      id: i + 1,

      name:
        [
          "Rahul",
          "Aman",
          "Sneha",
          "Karan",
          "Priya",
        ][i % 5] +
        " " +
        [
          "Sharma",
          "Verma",
          "Singh",
          "Mehta",
        ][i % 4],

      avatar:
        `https://i.pravatar.cc/150?img=${i + 3}`,

      type:
        i % 3 === 0
          ? "video"
          : "audio",

      status:
        i % 4 === 0
          ? "missed"
          : i % 2 === 0
          ? "incoming"
          : "outgoing",

      time:
        i < 5
          ? "Just now"
          : i < 10
          ? "10 min ago"
          : i < 15
          ? "Today"
          : "Yesterday",

      missed:
        i % 4 === 0,
    })
  ),
];

const CallList = ({
  onSelect,
}) => {

  // ===============================
  // 🔥 SEARCH
  // ===============================
  const [
    search,
    setSearch,
  ] = useState("");

  // ===============================
  // 🔥 FILTERED CALLS
  // ===============================
  const filteredCalls =
    calls.filter((call) =>

      call.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div className="w-full h-full bg-[var(--bg)]">

      {/* 🔥 SEARCH BAR */}
      <div
        className="
          sticky
          top-0

          z-20

          bg-[var(--bg)]

          px-3
          pt-3
          pb-2
        "
      >

        <div
          className="
            flex
            items-center
            gap-3

            px-4
            py-3

            rounded-2xl

            bg-[var(--card)]

            border
            border-[var(--border)]

            shadow-sm
          "
        >

          <FiSearch
            className="
              text-lg
              opacity-60
              shrink-0
            "
          />

          <input
            type="text"

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }

            placeholder="Search calls..."

            className="
              flex-1

              bg-transparent

              outline-none

              text-sm

              placeholder:opacity-50
            "
          />

        </div>

      </div>

      {/* 🔥 FIXED SCROLL AREA */}
      <div
        className="
          h-[calc(100%-84px)]

          overflow-y-auto

          px-2
          pt-2
          pb-4

          space-y-2

          hide-scrollbar
        "
      >

        {filteredCalls.length >
        0 ? (

          filteredCalls.map(
            (c) => (

              <CallItem
                key={c.id}
                call={c}
                onSelect={
                  onSelect
                }
              />
            )
          )

        ) : (

          <div
            className="
              h-full

              flex
              items-center
              justify-center

              text-sm
              opacity-60
            "
          >

            No calls found

          </div>
        )}

      </div>

    </div>
  );
};

export default CallList;

/* 🔥 CALL ITEM */
const CallItem = ({
  call,
  onSelect,
}) => {

  const icon =
    call.status ===
    "incoming" ? (

      <FiPhoneIncoming className="text-green-500" />

    ) : call.status ===
      "outgoing" ? (

      <FiPhoneOutgoing className="text-blue-500" />

    ) : (

      <FiPhoneMissed className="text-red-500" />
    );

  return (
    <div

      onClick={() =>
        onSelect(call)
      }

      className="
        flex
        items-center
        gap-3

        px-3
        py-2.5

        rounded-xl

        cursor-pointer

        transition

        active:scale-[0.98]

        md:hover:bg-[var(--card)]/60
      "
    >

      {/* 🔥 AVATAR */}
      <div className="relative">

        <img
          src={call.avatar}

          alt={call.name}

          className="
            w-12
            h-12

            rounded-full

            object-cover
          "
        />

        {/* 🔥 MISSED DOT */}
        {call.missed && (

          <span
            className="
              absolute
              top-0
              right-0

              w-2.5
              h-2.5

              bg-red-500

              rounded-full
            "
          />
        )}

      </div>

      {/* 🔥 INFO */}
      <div className="flex-1 min-w-0">

        <div
          className="
            flex
            justify-between
            items-center

            gap-2
          "
        >

          <p
            className="
              font-medium
              truncate
            "
          >
            {call.name}
          </p>

          <span
            className="
              text-[10px]
              opacity-60
              shrink-0
            "
          >
            {call.time}
          </span>

        </div>

        <div
          className="
            flex
            items-center
            gap-2

            text-xs
            opacity-60
          "
        >

          {icon}

          <span>

            {call.type ===
            "video"

              ? "Video Call"

              : "Audio Call"}

          </span>

        </div>

      </div>

      {/* 🔥 RIGHT ICON */}
      <div
        className="
          text-lg
          opacity-70
        "
      >

        {call.type ===
        "video" ? (

          <FiVideo />

        ) : (

          <FiPhoneIncoming />
        )}

      </div>

    </div>
  );
};