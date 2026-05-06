import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import {
  FiArrowLeft,
  FiSearch,
  FiLoader,
  FiUserPlus,
} from "react-icons/fi";

import toast from "react-hot-toast";

import API from "../../api/axios";

import { useChat } from "../../context/ChatContext";

const categories = [
  "Friend",
  "Family",
  "Office",
  "College",
  "School",
];

const NewChat = () => {

  const navigate = useNavigate();

  const {
    contacts,
    fetchContacts,
    sidebarLoading,
    openConversation,
  } = useChat();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [form, setForm] = useState({

    name: "",
    phone: "",
    email: "",
    category: "Friend",
  });

  const [search, setSearch] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  // ===============================
  // 🔥 FETCH CONTACTS
  // ===============================
  useEffect(() => {

    fetchContacts();

  }, []);

  // ===============================
  // 🔥 SAVE CONTACT
  // ===============================
  const handleSave = async () => {

    try {

      if (
        !form.name.trim() ||
        !form.phone.trim()
      ) {

        toast.error(
          "Name and phone required"
        );

        return;
      }

      setSaving(true);

      // 🔥 backend payload
      const payload = {

        name: form.name,
        phone: form.phone,
      };

      const res =
        await API.post(
          "/contacts",
          payload
        );

      // 🔥 backend response
      const response =
        res?.data;

      // ❌ user not exists
      if (!response?.success) {

        toast.error(
          response?.message ||
          "User not found"
        );

        return;
      }

      // ✅ success
      toast.success(
        response?.message ||
        "Contact added"
      );

      // 🔥 refresh sidebar
      await fetchContacts();

      // 🔥 reset form
      setForm({

        name: "",
        phone: "",
        email: "",
        category: "Friend",
      });

    } catch (err) {

      console.log(err);

      toast.error(

        err?.response?.data?.message ||

        "Failed to add contact"
      );

    } finally {

      setSaving(false);
    }
  };

  // ===============================
  // 🔥 FILTERED CONTACTS
  // ===============================
  const filtered =
    contacts.filter((c) =>

      c.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  // ===============================
  // 🔥 OPEN CHAT
  // ===============================
  const handleOpenChat =
    async (contact) => {

      const conversation =
        await openConversation(
          contact
        );

      if (conversation?.id) {

        navigate(
          `/chat/${conversation.id}`
        );
      }
    };

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 flex justify-center bg-[var(--bg)] text-[var(--text)] overflow-hidden">

      {/* 🔥 CENTER */}
      <div className="w-full md:max-w-2xl flex flex-col h-full overflow-hidden">

        {/* 🔥 HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)] shrink-0">

          <FiArrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer text-lg"
          />

          <h2 className="font-semibold text-lg">
            New Chat
          </h2>

        </div>

        {/* 🔥 SEARCH */}
        <div className="px-4 mt-3 shrink-0">

          <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-2 rounded-xl shadow-sm border border-[var(--border)]">

            <FiSearch className="opacity-70 shrink-0" />

            <input
              placeholder="Search contacts"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="bg-transparent outline-none text-sm w-full min-w-0"
            />

          </div>

        </div>

        {/* 🔥 ADD CONTACT */}
        <div className="mx-4 mt-4 p-4 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-md space-y-3 shrink-0">

          <div className="flex items-center gap-2">

            <FiUserPlus className="text-[var(--primary)]" />

            <p className="text-sm font-medium">
              Add New Contact
            </p>

          </div>

          {/* 🔥 NAME */}
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({

                ...form,

                name:
                  e.target.value,
              })
            }
            className="w-full p-3 text-sm bg-[var(--bg)] rounded-xl outline-none border border-[var(--border)]"
          />

          {/* 🔥 PHONE */}
          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({

                ...form,

                phone:
                  e.target.value,
              })
            }
            className="w-full p-3 text-sm bg-[var(--bg)] rounded-xl outline-none border border-[var(--border)]"
          />

          {/* 🔥 EMAIL */}
          <input
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) =>
              setForm({

                ...form,

                email:
                  e.target.value,
              })
            }
            className="w-full p-3 text-sm bg-[var(--bg)] rounded-xl outline-none border border-[var(--border)]"
          />

          {/* 🔥 CATEGORY */}
          <div className="flex gap-2 flex-wrap pt-1">

            {categories.map((cat) => (

              <span
                key={cat}
                onClick={() =>
                  setForm({

                    ...form,

                    category: cat,
                  })
                }
                className={`
                  px-3
                  py-1.5
                  text-xs
                  rounded-full
                  cursor-pointer
                  transition

                  ${
                    form.category === cat

                      ? "bg-[var(--primary)] text-black"

                      : "bg-[var(--bg)] opacity-70"
                  }
                `}
              >
                {cat}
              </span>
            ))}

          </div>

          {/* 🔥 BUTTON */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="
              w-full
              py-3
              mt-2

              rounded-xl

              text-sm
              font-medium

              bg-[var(--primary)]
              text-black

              hover:opacity-90

              transition

              disabled:opacity-50

              flex
              items-center
              justify-center
              gap-2
            "
          >
            {saving ? (
              <>
                <FiLoader className="animate-spin" />
                Saving...
              </>
            ) : (
              "Save Contact"
            )}
          </button>

        </div>

        {/* 🔥 CONTACTS */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden hide-scrollbar mt-4 pb-5">

          <p className="px-4 pb-2 text-xs opacity-50">
            Contacts
          </p>

          {/* 🔥 LOADING */}
          {sidebarLoading ? (

            <div className="flex justify-center py-10">

              <FiLoader className="animate-spin text-2xl opacity-60" />

            </div>

          ) : (

            <div className="flex flex-col gap-2 px-2">

              {filtered.map((c) => (

                <div
                  key={c.id}
                  onClick={() =>
                    handleOpenChat(c)
                  }
                  className="
                    flex
                    items-center
                    gap-3

                    px-3
                    py-3

                    rounded-2xl

                    cursor-pointer

                    hover:bg-[var(--card)]

                    transition
                  "
                >
                  {/* 🔥 AVATAR */}
                  <div className="relative shrink-0">

                    {c.avatar ? (

                      <img
                        src={c.avatar}
                        alt={c.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />

                    ) : (

                      <div className="w-12 h-12 rounded-full bg-[var(--card)] flex items-center justify-center font-semibold">

                        {c.name?.charAt(0)}

                      </div>
                    )}

                    {c.online && (

                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[var(--bg)]" />

                    )}

                  </div>

                  {/* 🔥 INFO */}
                  <div className="flex-1 min-w-0">

                    <div className="flex items-center justify-between gap-2">

                      <p className="text-sm font-medium truncate">
                        {c.name}
                      </p>

                      {c.lastMessageTime && (

                        <span className="text-[10px] opacity-50 shrink-0">

                          {new Date(
                            c.lastMessageTime
                          ).toLocaleTimeString([], {

                            hour: "2-digit",
                            minute: "2-digit",
                          })}

                        </span>
                      )}

                    </div>

                    <p className="text-xs opacity-60 truncate">

                      {c.lastMessage || c.phone}

                    </p>

                    {/* 🔥 UNREAD */}
                    {c.unreadCount > 0 && (

                      <div className="mt-1 flex justify-end">

                        <span className="
                          min-w-[18px]
                          h-[18px]

                          px-1

                          rounded-full

                          bg-[var(--primary)]

                          text-black
                          text-[10px]
                          font-semibold

                          flex
                          items-center
                          justify-center
                        ">
                          {c.unreadCount}
                        </span>

                      </div>
                    )}

                  </div>

                </div>
              ))}

            </div>
          )}

          {/* 🔥 EMPTY */}
          {!sidebarLoading &&
            filtered.length === 0 && (

            <p className="text-center text-xs opacity-40 mt-10">

              No contacts found

            </p>
          )}

        </div>

      </div>

    </div>
  );
};

export default NewChat;