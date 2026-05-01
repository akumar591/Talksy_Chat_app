import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast"; // ✅ ADD

const categories = ["Friend", "Family", "Office", "College", "School"];

const NewChat = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    category: "Friend",
  });

  const [contacts, setContacts] = useState([]);
  const [search, setSearch] = useState("");

  // 🔥 Load saved contacts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("contacts")) || [];
    setContacts(saved);
  }, []);

  // 🔥 Save contact
  const handleSave = () => {
    if (!form.name || !form.phone) {
      toast.error("Name and phone required"); // ✅ FIX
      return;
    }

    const newContact = {
      id: Date.now(),
      ...form,
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    localStorage.setItem("contacts", JSON.stringify(updated));

    setForm({
      name: "",
      phone: "",
      email: "",
      category: "Friend",
    });

    toast.success("Contact saved successfully"); // ✅ BONUS
  };

  const filtered = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-screen md:h-[calc(100vh-4rem)] mt-0 md:mt-16 flex justify-center bg-[var(--bg)] text-[var(--text)]">

      {/* CENTER WRAPPER */}
      <div className="w-full md:max-w-2xl flex flex-col h-full">

        {/* HEADER */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--border)]">
          <FiArrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          />
          <h2 className="font-semibold text-lg">New Chat</h2>
        </div>

        {/* SEARCH */}
        <div className="px-4 mt-3">
          <div className="flex items-center gap-2 bg-[var(--card)] px-3 py-2 rounded-lg shadow-sm">
            <FiSearch className="opacity-70" />
            <input
              placeholder="Search contacts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>
        </div>

        {/* ADD CONTACT */}
        <div className="mx-4 mt-4 p-4 rounded-xl bg-[var(--card)] shadow-md space-y-3">

          <p className="text-xs opacity-60">Add new contact</p>

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full p-2 text-sm bg-[var(--bg)] rounded-md outline-none"
          />

          <input
            placeholder="Phone number"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            className="w-full p-2 text-sm bg-[var(--bg)] rounded-md outline-none"
          />

          <input
            placeholder="Email (optional)"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            className="w-full p-2 text-sm bg-[var(--bg)] rounded-md outline-none"
          />

          {/* CATEGORY */}
          <div className="flex gap-2 flex-wrap pt-1">
            {categories.map((cat) => (
              <span
                key={cat}
                onClick={() =>
                  setForm({ ...form, category: cat })
                }
                className={`px-3 py-1 text-xs rounded-full cursor-pointer ${
                  form.category === cat
                    ? "bg-[var(--primary)] text-black"
                    : "bg-[var(--bg)] opacity-70"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* SAVE BUTTON */}
          <button
            onClick={handleSave}
            className="w-full py-2 mt-2 rounded-md text-sm font-medium bg-[var(--primary)] text-black hover:opacity-90 transition"
          >
            Save Contact
          </button>

        </div>

        {/* CONTACT LIST */}
        <div className="flex-1 overflow-y-auto hide-scrollbar mt-4">

          <p className="px-4 pb-2 text-xs opacity-50">Contacts</p>

          <div className="flex flex-col gap-2 px-2">

            {filtered.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/chat/${c.id}`)}
                className="flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer hover:bg-[var(--card)] transition"
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[var(--card)] flex items-center justify-center font-semibold">
                  {c.name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs opacity-60">
                    {c.phone} • {c.category}
                  </p>
                  {c.email && (
                    <p className="text-xs opacity-40">
                      {c.email}
                    </p>
                  )}
                </div>
              </div>
            ))}

          </div>

          {filtered.length === 0 && (
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