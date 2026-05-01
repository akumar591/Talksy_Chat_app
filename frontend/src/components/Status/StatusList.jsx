import React from "react";

/* 🔥 DEMO DATA */
const statuses = [
  {
    id: 1,
    name: "Rahul Sharma",
    avatar: "https://i.pravatar.cc/150?img=3",
    media: "https://picsum.photos/400/700",
    type: "image",
    seen: false,
    time: "Just now",
  },
  {
    id: 2,
    name: "Aman Verma",
    avatar: "https://i.pravatar.cc/150?img=5",
    media: "https://www.w3schools.com/html/mov_bbb.mp4",
    type: "video",
    seen: false,
    time: "10 min ago",
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    avatar: "https://i.pravatar.cc/150?img=7",
    media: "https://picsum.photos/401/700",
    type: "image",
    seen: false,
    time: "Today, 2:30 PM",
  },
  {
    id: 4,
    name: "Karan Mehta",
    avatar: "https://i.pravatar.cc/150?img=8",
    media: "https://picsum.photos/402/700",
    type: "image",
    seen: true,
    time: "Today, 12:10 PM",
  },
  {
    id: 5,
    name: "Priya Singh",
    avatar: "https://i.pravatar.cc/150?img=9",
    media: "https://picsum.photos/403/700",
    type: "image",
    seen: true,
    time: "Yesterday",
  },

  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    name:
      ["Rohit", "Neha", "Arjun", "Simran", "Vikas"][i % 5] +
      " " +
      ["Kumar", "Jain", "Singh", "Verma"][i % 4],
    avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
    media: `https://picsum.photos/40${i}/70${i}`,
    type: "image",
    seen: i > 7,
    time: i < 5 ? "Today" : "Yesterday",
  })),
];

/* 🔥 MAIN COMPONENT */
const StatusList = ({ onOpen }) => {
  const recent = statuses.filter((s) => !s.seen);
  const viewed = statuses.filter((s) => s.seen);

  return (
    <div className="w-full h-full bg-[var(--bg)]">

      <div className="h-full overflow-y-auto px-2 pt-3 md:pt-2 pb-2 md:pb-2 mb-3 md:mb-0 hide-scrollbar space-y-3">

        {/* MY STATUS */}
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer active:scale-[0.98] md:hover:bg-[var(--card)]/60 transition">
          <div className="w-12 h-12 rounded-full border-2 border-[var(--primary)] flex items-center justify-center text-lg font-bold">
            +
          </div>

          <div>
            <p className="font-medium text-sm">My Status</p>
            <p className="text-xs opacity-60">Tap to add status</p>
          </div>
        </div>

        {/* RECENT */}
        {recent.length > 0 && (
          <Section title="Recent Updates" list={recent} onOpen={onOpen} />
        )}

        {/* VIEWED */}
        {viewed.length > 0 && (
          <Section title="Viewed Updates" list={viewed} onOpen={onOpen} viewed />
        )}

      </div>
    </div>
  );
};

export default StatusList;



/* 🔥 SECTION */
const Section = ({ title, list, onOpen, viewed }) => (
  <div>
    <p className="text-xs opacity-60 px-3 mb-1">{title}</p>

    {list.map((s, index) => (
      <StatusItem
        key={s.id}
        s={s}
        index={index}
        fullList={list}
        onOpen={onOpen}
        viewed={viewed}
      />
    ))}
  </div>
);



/* 🔥 STATUS ITEM */
const StatusItem = ({ s, index, fullList, onOpen, viewed }) => {
  return (
    <div
      onClick={() =>
        onOpen({
          statuses: fullList,
          index: index,
        })
      }
      className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer active:scale-[0.98] md:hover:bg-[var(--card)]/60 transition"
    >
      {/* AVATAR */}
      <div
        className={`p-[2px] rounded-full ${
          viewed
            ? "bg-gray-500/40"
            : "bg-gradient-to-tr from-[var(--primary)] to-blue-500"
        }`}
      >
        <img
          src={s.avatar}
          className="w-12 h-12 rounded-full object-cover"
        />
      </div>

      {/* INFO */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <p className="font-medium truncate text-sm">{s.name}</p>
          <span className="text-[10px] opacity-60">{s.time}</span>
        </div>

        <p className="text-xs opacity-60">
          {s.type === "video" ? "🎥 Video" : "📷 Photo"}
        </p>
      </div>
    </div>
  );
};