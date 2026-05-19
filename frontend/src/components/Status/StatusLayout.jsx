import {
  useState,
  useEffect,
  useRef,
  useMemo,
} from "react";

import {
  FiArrowLeft,
  FiSearch,
} from "react-icons/fi";

import { BsThreeDotsVertical } from "react-icons/bs";

import { useNavigate } from "react-router-dom";

import StatusList from "./StatusList";

import StatusViewer from "./StatusViewer";

import AddStatus from "./AddStatus";

import {
  useStatus,
} from "../../context/StatusContext";

const StatusLayout = () => {

  // ===============================
  // 🔥 STATUS CONTEXT
  // ===============================
  const {

    feedStatuses,

    myStatuses,

    fetchFeedStatuses,

    fetchMyStatuses,

    loading,

  } = useStatus();

  // ===============================
  // 🔥 STATES
  // ===============================
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState(null);

  const [search, setSearch] =
    useState("");

  const [showMenu, setShowMenu] =
    useState(false);

  // 🔥 ADD STATUS
  const [
    showAddStatus,
    setShowAddStatus,
  ] = useState(false);

  const menuRef = useRef();

  const navigate =
    useNavigate();

  // ===============================
  // 🔥 FETCH STATUS DATA
  // ===============================
  useEffect(() => {

    fetchFeedStatuses();

    fetchMyStatuses();

  }, [
    fetchFeedStatuses,
    fetchMyStatuses,
  ]);

  // ===============================
  // 🔥 AUTO CLOSE MENU
  // ===============================
  useEffect(() => {

    setShowMenu(false);

  }, [
    selectedStatus,
    showAddStatus,
  ]);

  // ===============================
  // 🔥 CLOSE MENU OUTSIDE
  // ===============================
  useEffect(() => {

    const handler = (e) => {

      if (

        menuRef.current &&

        !menuRef.current.contains(
          e.target
        )

      ) {

        setShowMenu(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handler
    );

    return () =>

      document.removeEventListener(
        "mousedown",
        handler
      );

  }, []);

  // ===============================
  // 🔥 SAFE FEED
  // ===============================
  const safeFeedStatuses =
    Array.isArray(
      feedStatuses
    )

      ?

      feedStatuses

      :

      [];

  // ===============================
  // 🔥 SEARCH FILTER
  // ===============================
  const filteredFeed =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {

        return safeFeedStatuses;
      }

      return safeFeedStatuses.filter(
        (s) =>

          s?.name
            ?.toLowerCase()
            .includes(query)
      );

    }, [
      safeFeedStatuses,
      search,
    ]);

  // ===============================
  // 🔥 VIEWER SAFE CHECK
  // ===============================
  useEffect(() => {

    if (
      !selectedStatus
    ) return;

    const statuses =
      selectedStatus?.statuses ||
      [];

    if (

      selectedStatus.index >=
      statuses.length

    ) {

      setSelectedStatus(
        null
      );
    }

  }, [selectedStatus]);

  return (
    <div
      className="
        w-full
        h-screen
        text-[var(--text)]
        bg-[var(--bg)]
      "
    >

      {/* 🔥 MOBILE HEADER */}
      {!selectedStatus &&
        !showAddStatus && (
          <div
            className="
              md:hidden

              fixed
              top-0 left-0

              w-full

              z-40

              bg-[var(--bg)]

              pt-3
            "
          >

            <div
              className="
                flex items-center
                gap-2

                px-3 py-2
              "
            >

              {/* 🔥 BACK */}
              <FiArrowLeft
                onClick={() =>
                  navigate(-1)
                }
                className="
                  text-lg
                  cursor-pointer
                "
              />

              {/* 🔥 SEARCH */}
              <div
                className="
                  flex items-center
                  flex-1
                  gap-2

                  px-3 py-2

                  rounded-full

                  bg-[var(--card)]
                "
              >

                <FiSearch className="text-sm opacity-60" />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search status..."
                  className="
                    bg-transparent
                    outline-none
                    text-sm
                    w-full
                  "
                />

              </div>

              {/* 🔥 MENU */}
              <div
                className="relative"
                ref={menuRef}
              >

                <BsThreeDotsVertical
                  onClick={() =>
                    setShowMenu(
                      !showMenu
                    )
                  }
                  className="
                    text-lg
                    cursor-pointer
                  "
                />

                {showMenu && (
                  <div
                    className="
                      absolute
                      right-0
                      top-10

                      w-44

                      bg-[var(--card)]

                      border
                      border-[var(--border)]

                      rounded-lg

                      shadow-lg

                      text-sm

                      z-50

                      overflow-hidden
                    "
                  >

                    <div
                      className="
                        px-3 py-2
                        hover:bg-[var(--primary)]/10
                        cursor-pointer
                      "
                    >
                      Status Privacy
                    </div>

                    <div
                      className="
                        px-3 py-2
                        hover:bg-[var(--primary)]/10
                        cursor-pointer
                      "
                    >
                      Create Channel
                    </div>

                    <div
                      className="
                        px-3 py-2
                        hover:bg-[var(--primary)]/10
                        cursor-pointer
                      "
                    >
                      Archived Status
                    </div>

                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      {/* 🔥 STATUS LIST */}
      <div
        className={`
          ${selectedStatus ||
            showAddStatus
            ? "hidden md:block"
            : "block"
          }

          fixed

          top-12 md:top-16
          left-0

          w-full
          md:w-[30%]
          lg:w-[25%]

          h-[calc(100vh-48px)]
          md:h-[calc(100vh-64px)]

          md:border-r
          md:border-[var(--border)]

          bg-[var(--bg)]
        `}
      >

        <StatusList

          onOpen={
            setSelectedStatus
          }

          onAddStatus={() =>
            setShowAddStatus(true)
          }

          // 🔥 BACKEND DATA
          userStatuses={
            Array.isArray(
              myStatuses
            )

              ?

              myStatuses

              :

              []
          }

          statuses={
            filteredFeed
          }

          loading={
            loading
          }
        />

        {/* 🔥 EMPTY SEARCH */}
        {!loading &&

          search.trim() &&

          filteredFeed.length ===
          0 && (

            <div
              className="
                flex
                flex-col

                items-center
                justify-center

                py-10

                text-center
              "
            >

              <p
                className="
                  text-sm
                  opacity-60
                "
              >
                No status found
              </p>

              <p
                className="
                  text-xs
                  opacity-40
                  mt-1
                "
              >
                Try another name
              </p>

            </div>
          )}

      </div>

      {/* 🔥 ADD STATUS */}
      {showAddStatus && (

        <AddStatus
          onClose={() =>
            setShowAddStatus(false)
          }
        />
      )}

      {/* 🔥 VIEWER AREA */}
      <div
        className={`
          ${selectedStatus
            ? "flex"
            : "hidden md:flex"
          }

          fixed

          top-0
          md:top-5

          left-0
          md:left-[30%]
          lg:left-[25%]

          w-full
          md:w-[70%]
          lg:w-[75%]

          h-screen
          md:h-[calc(100vh-64px)]

          flex
          items-center
          justify-center

          bg-[var(--bg)]

          z-30
        `}
      >

        {/* 🔥 STATUS VIEWER */}
        {selectedStatus ? (

          <StatusViewer

            statuses={
              selectedStatus
                ?.statuses || []
            }

            currentIndex={
              selectedStatus
                ?.index || 0
            }

            // 🔥 IMPORTANT FIX
            isOwnStatus={
              selectedStatus
                ?.isOwnStatus || false
            }

            setIndex={(i) =>

              setSelectedStatus(
                (prev) => ({

                  ...prev,

                  index: i,
                })
              )
            }

            onClose={() =>
              setSelectedStatus(null)
            }
          />

        ) : (

          <div
            className="
              hidden md:flex

              flex-col

              items-center
              justify-center

              text-[var(--text)]

              opacity-60
            "
          >

            <p className="text-lg">
              Select a status to
              view
            </p>

            <p className="text-sm opacity-50">
              Tap on any story
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default StatusLayout;