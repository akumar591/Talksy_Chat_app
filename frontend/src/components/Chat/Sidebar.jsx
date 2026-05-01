import { useNavigate } from "react-router-dom";

const chats = [
  {
    id: 1,
    name: "Rahul Sharma",
    lastMsg: "Bro kal milte hai",
    time: "2:30 PM",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 2,
    name: "Aman Verma",
    lastMsg: "Project complete?",
    time: "1:10 PM",
    online: false,
    lastSeen: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Sneha Kapoor",
    lastMsg: "Good night 😊",
    time: "Yesterday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 4,
    name: "Karan Mehta",
    lastMsg: "Call me when free",
    time: "Yesterday",
    online: false,
    lastSeen: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 5,
    name: "Priya Singh",
    lastMsg: "See you soon 💫",
    time: "Monday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=9",
  },

  {
    id: 6,
    name: "Rohit Kumar",
    lastMsg: "Match dekh raha?",
    time: "3:00 PM",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    id: 7,
    name: "Neha Jain",
    lastMsg: "Shopping chale?",
    time: "12:45 PM",
    online: false,
    lastSeen: "30 min ago",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 8,
    name: "Arjun Reddy",
    lastMsg: "Bro code bhej",
    time: "11:20 AM",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: 9,
    name: "Simran Kaur",
    lastMsg: "Nice pic 🔥",
    time: "Yesterday",
    online: false,
    lastSeen: "5 hours ago",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: 10,
    name: "Vikas Yadav",
    lastMsg: "Meeting kab hai?",
    time: "Monday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=14",
  },

  {
    id: 11,
    name: "Anjali Gupta",
    lastMsg: "PDF send karna",
    time: "Sunday",
    online: false,
    lastSeen: "1 day ago",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    id: 12,
    name: "Saurabh Singh",
    lastMsg: "Game khelenge?",
    time: "Saturday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=16",
  },
  {
    id: 13,
    name: "Megha Roy",
    lastMsg: "Awesome 👍",
    time: "Friday",
    online: false,
    lastSeen: "2 days ago",
    avatar: "https://i.pravatar.cc/150?img=17",
  },
  {
    id: 14,
    name: "Deepak Patel",
    lastMsg: "Call karna",
    time: "Thursday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=18",
  },
  {
    id: 15,
    name: "Pooja Sharma",
    lastMsg: "Thanks 😊",
    time: "Wednesday",
    online: false,
    lastSeen: "3 days ago",
    avatar: "https://i.pravatar.cc/150?img=19",
  },

  {
    id: 16,
    name: "Nikhil Jain",
    lastMsg: "Update kya hai?",
    time: "Tuesday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=20",
  },
  {
    id: 17,
    name: "Riya Sen",
    lastMsg: "Movie plan?",
    time: "Monday",
    online: false,
    lastSeen: "4 days ago",
    avatar: "https://i.pravatar.cc/150?img=21",
  },
  {
    id: 18,
    name: "Abhishek Kumar",
    lastMsg: "Bro interview kab hai?",
    time: "Sunday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=22",
  },
  {
    id: 19,
    name: "Kavita Mishra",
    lastMsg: "Send notes",
    time: "Saturday",
    online: false,
    lastSeen: "1 week ago",
    avatar: "https://i.pravatar.cc/150?img=23",
  },
  {
    id: 20,
    name: "Yash Thakur",
    lastMsg: "Let's go 🚀",
    time: "Friday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=24",
  },

  {
    id: 21,
    name: "Harsh Gupta",
    lastMsg: "Ok bro 👍",
    time: "Thursday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=25",
  },
  {
    id: 22,
    name: "Tanvi Arora",
    lastMsg: "Call later",
    time: "Wednesday",
    online: false,
    lastSeen: "2 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=26",
  },
  {
    id: 23,
    name: "Manish Verma",
    lastMsg: "Done ✔️",
    time: "Tuesday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=27",
  },
  {
    id: 24,
    name: "Divya Sharma",
    lastMsg: "Nice work!",
    time: "Monday",
    online: false,
    lastSeen: "3 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=28",
  },
  {
    id: 25,
    name: "Aakash Singh",
    lastMsg: "Ping me",
    time: "Sunday",
    online: true,
    avatar: "https://i.pravatar.cc/150?img=29",
  },
];

const Sidebar = ({ onSelectChat }) => {
  const navigate = useNavigate();

  const handleClick = (chat) => {
    onSelectChat && onSelectChat(chat);
    navigate(`/chat/${chat.id}`);
  };

  return (
    <div className="w-full h-full bg-[var(--bg)]">
      {/* 🔥 SCROLL AREA */}
      <div className="h-full overflow-y-auto px-2 pt-20 md:pt-2 pb-20 md:pb-2 hide-scrollbar">
        <div className="flex flex-col gap-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleClick(chat)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer
              hover:bg-[var(--card)]/60 transition"
            >
              {/* AVATAR */}
              <div className="relative">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />

                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-[2px] border-[var(--bg)]"></span>
                )}
              </div>

              {/* INFO */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs opacity-60 whitespace-nowrap">
                    {chat.time}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-sm opacity-70 truncate">{chat.lastMsg}</p>

                  {!chat.online && chat.lastSeen && (
                    <span className="text-[10px] opacity-50 whitespace-nowrap">
                      {chat.lastSeen}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
