import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FiSearch,
  FiUserPlus,
  FiX,
} from "react-icons/fi";

import API from "../../api/axios";

import { useGroup } from "../../context/GroupContext";

const AddMembersModal = ({
  group,
  onClose,
}) => {

  const {
    addMember,
    fetchGroupById,
  } = useGroup();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [contacts, setContacts] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [addingId, setAddingId] =
    useState(null);

  // ===============================
  // 🔥 FETCH CONTACTS
  // ===============================
  useEffect(() => {

    const fetchContacts =
      async () => {

        try {

          setLoading(true);

          const res =
            await API.get(
              "/contacts"
            );

          setContacts(
            res?.data?.data || []
          );

        } catch (err) {

          console.log(err);

        } finally {

          setLoading(false);
        }
      };

    fetchContacts();

  }, []);

  // ===============================
  // 🔥 EXISTING MEMBER IDS
  // ===============================
  const existingMemberIds =
    useMemo(() => {

      return (
        group?.members?.map(
          (m) =>
            String(m.id)
        ) || []
      );

    }, [group]);

  // ===============================
  // 🔥 FILTER CONTACTS
  // ===============================
  const filteredContacts =
    useMemo(() => {

      return contacts.filter(
        (contact) => {

          // 🔥 REMOVE EXISTING MEMBERS
          if (
            existingMemberIds.includes(
              String(contact.id)
            )
          ) {

            return false;
          }

          // 🔥 SEARCH
          if (
            search.trim()
          ) {

            return (
              contact.name
                ?.toLowerCase()
                .includes(
                  search.toLowerCase()
                )
            );
          }

          return true;
        }
      );

    }, [
      contacts,
      existingMemberIds,
      search,
    ]);

  // ===============================
  // 🔥 ADD MEMBER
  // ===============================
  const handleAddMember =
    async (memberId) => {

      try {

        setAddingId(memberId);

        const res =
          await addMember(
            group.id,
            memberId
          );

        if (
          res?.success
        ) {

          // 🔥 REFRESH GROUP
          await fetchGroupById(
            group.id
          );
        }

      } catch (err) {

        console.log(err);

      } finally {

        setAddingId(null);
      }
    };

  return (
    <div
      className="
        fixed
        inset-0

        z-[999]

        bg-black/60
        backdrop-blur-sm

        flex
        items-center
        justify-center

        px-4
      "
    >

      {/* MODAL */}
      <div
        className="
          w-full
          max-w-lg

          max-h-[85vh]

          rounded-3xl

          overflow-hidden

          bg-[var(--bg)]

          border
          border-[var(--border)]

          shadow-2xl

          flex
          flex-col
        "
      >

        {/* HEADER */}
        <div
          className="
            flex
            items-center
            justify-between

            px-5
            py-4

            border-b
            border-[var(--border)]
          "
        >

          <div>

            <h2
              className="
                text-lg
                font-semibold
              "
            >
              Add Members
            </h2>

            <p
              className="
                text-xs
                opacity-60
                mt-1
              "
            >
              Add people to
              {" "}
              {group?.name}
            </p>
          </div>

          {/* CLOSE */}
          <button

            onClick={onClose}

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
            <FiX />
          </button>
        </div>

        {/* SEARCH */}
        <div
          className="
            px-4
            py-4

            border-b
            border-[var(--border)]
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
            "
          >

            <FiSearch
              className="
                opacity-60
              "
            />

            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="
                flex-1

                bg-transparent

                outline-none

                text-sm
              "
            />
          </div>
        </div>

        {/* BODY */}
        <div
          className="
            flex-1
            overflow-y-auto
          "
        >

          {/* LOADING */}
          {loading && (

            <div
              className="
                py-16

                flex
                items-center
                justify-center
              "
            >

              <div
                className="
                  w-10
                  h-10

                  rounded-full

                  border-4
                  border-[var(--primary)]
                  border-t-transparent

                  animate-spin
                "
              />
            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            filteredContacts.length === 0 && (

            <div
              className="
                py-16

                text-center

                text-sm
                opacity-60
              "
            >
              No contacts available
            </div>
          )}

          {/* CONTACTS */}
          {!loading &&

            filteredContacts.map(
              (contact) => (

                <div
                  key={contact.id}

                  className="
                    flex
                    items-center
                    justify-between

                    gap-3

                    px-4
                    py-3

                    border-b
                    border-[var(--border)]

                    hover:bg-white/5

                    transition
                  "
                >

                  {/* LEFT */}
                  <div
                    className="
                      flex
                      items-center
                      gap-3

                      min-w-0
                    "
                  >

                    {/* AVATAR */}
                    {contact.avatar ? (

                      <img
                        src={

                          contact.avatar?.startsWith(
                            "http"
                          )

                            ? contact.avatar

                            : `http://localhost:8080${contact.avatar}`
                        }

                        alt={contact.name}

                        className="
                          w-12
                          h-12

                          rounded-full
                          object-cover
                        "
                      />

                    ) : (

                      <div
                        className="
                          w-12
                          h-12

                          rounded-full

                          bg-[var(--card)]

                          flex
                          items-center
                          justify-center

                          font-semibold
                          uppercase
                        "
                      >
                        {contact.name?.charAt(0)}
                      </div>
                    )}

                    {/* INFO */}
                    <div className="min-w-0">

                      <h4
                        className="
                          font-medium
                          truncate
                        "
                      >
                        {contact.name}
                      </h4>

                      <p
                        className="
                          text-xs
                          opacity-60
                          truncate
                        "
                      >
                        {contact.bio ||
                          contact.phone ||
                          "No bio"}
                      </p>
                    </div>
                  </div>

                  {/* ADD BUTTON */}
                  <button

                    onClick={() =>
                      handleAddMember(
                        contact.id
                      )
                    }

                    disabled={
                      addingId ===
                      contact.id
                    }

                    className="
                      shrink-0

                      flex
                      items-center
                      gap-2

                      px-4
                      py-2

                      rounded-xl

                      bg-[var(--primary)]

                      text-black
                      text-sm
                      font-medium

                      hover:scale-[1.03]

                      transition

                      disabled:opacity-50
                    "
                  >

                    {addingId ===
                    contact.id ? (

                      <div
                        className="
                          w-4
                          h-4

                          rounded-full

                          border-2
                          border-black
                          border-t-transparent

                          animate-spin
                        "
                      />

                    ) : (

                      <>
                        <FiUserPlus />

                        Add
                      </>
                    )}
                  </button>
                </div>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default AddMembersModal;