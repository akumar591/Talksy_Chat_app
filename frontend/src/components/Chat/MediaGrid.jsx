import {
  FiMoreVertical,
} from "react-icons/fi";

import {
  useState,
  memo,
} from "react";

import MessageActions from "./MessageActions";
import ReactionPicker from "./ReactionPicker";
import DeleteMenu from "./DeleteMenu";

const MediaGrid = ({

  medias = [],

  setViewerOpen,
  setViewerMedia,
  setViewerIndex,

}) => {

  // ===============================
  // 🔥 STATES
  // ===============================
  const [
    showActions,
    setShowActions,
  ] = useState(false);

  const [
    showReactionPicker,
    setShowReactionPicker,
  ] = useState(false);

  const [
    showDeleteMenu,
    setShowDeleteMenu,
  ] = useState(false);

  // ===============================
  // 🔥 MAIN MEDIA
  // ===============================
  const mainMedia =
    medias?.[0];

  // ===============================
  // 🔥 TOTAL
  // ===============================
  const total =
    medias.length;

  // ===============================
  // 🔥 GRID CLASS
  // ===============================
  const getGridClass = () => {

    if (total === 1) {
      return "grid-cols-1";
    }

    return "grid-cols-2";
  };

  return (
    <div className="relative">

      {/* =============================== */}
      {/* 🔥 THREE DOT */}
      {/* =============================== */}
      <div className="
        absolute
        top-2
        right-2

        z-40
      ">

        <button
          onClick={(e) => {

            e.stopPropagation();

            setShowActions(
              prev => !prev
            );

            setShowReactionPicker(false);

            setShowDeleteMenu(false);
          }}
          className="
            w-9
            h-9

            rounded-full

            bg-black/45

            backdrop-blur-xl

            border
            border-white/10

            text-white

            flex
            items-center
            justify-center

            hover:bg-black/60

            transition-all
            duration-200
          "
        >

          <FiMoreVertical size={18} />

        </button>

        {/* =============================== */}
        {/* 🔥 ACTIONS */}
        {/* =============================== */}
        <MessageActions
          msg={{
            ...mainMedia,

            type:
              total > 1
                ? "MEDIA_GROUP"
                : mainMedia?.type,

            medias,
          }}

          isMe={true}

          showActions={showActions}

          setShowReactionPicker={
            setShowReactionPicker
          }

          setShowDeleteMenu={
            setShowDeleteMenu
          }
        />

        {/* =============================== */}
        {/* 🔥 REACTION PICKER */}
        {/* =============================== */}
        <ReactionPicker
          isMe={true}

          msg={{
            ...mainMedia,

            type:
              total > 1
                ? "MEDIA_GROUP"
                : mainMedia?.type,

            medias,
          }}

          showReactionPicker={
            showReactionPicker
          }

          setShowReactionPicker={
            setShowReactionPicker
          }
        />

        {/* =============================== */}
        {/* 🔥 DELETE MENU */}
        {/* =============================== */}
        <DeleteMenu
          isMe={true}

          msg={{
            ...mainMedia,

            type:
              total > 1
                ? "MEDIA_GROUP"
                : mainMedia?.type,

            medias,
          }}

          showDeleteMenu={
            showDeleteMenu
          }

          setShowDeleteMenu={
            setShowDeleteMenu
          }

          setShowActions={
            setShowActions
          }
        />

      </div>

      {/* =============================== */}
      {/* 🔥 MEDIA GRID */}
      {/* =============================== */}
      <div
        className={`
          grid

          ${getGridClass()}

          gap-1

          w-[220px]
          md:w-[260px]

          overflow-hidden
          rounded-2xl
        `}
      >

        {medias
          .slice(0, 4)
          .map((media, index) => {

            const isThreeLayout =
              total === 3;

            const isSingle =
              total === 1;

            return (
              <div
                key={media.id || index}
                className={`
                  relative

                  bg-black

                  overflow-hidden

                  cursor-pointer

                  ${isSingle
                    ? "h-[260px] md:h-[320px]"
                    : "h-[110px] md:h-[140px]"
                  }

                  ${isThreeLayout &&
                    index === 0
                    ? "row-span-2 h-[221px] md:h-[281px]"
                    : ""
                  }
                `}
                onClick={(e) => {

                  e.stopPropagation();

                  setViewerMedia(
                    medias
                  );

                  setViewerIndex(
                    index
                  );

                  setViewerOpen(
                    true
                  );
                }}
              >

                {/* =============================== */}
                {/* 🔥 IMAGE */}
                {/* =============================== */}
                <img
                  src={media.content}
                  alt=""
                  loading="lazy"
                  className="
                    w-full
                    h-full

                    object-cover

                    hover:scale-[1.03]

                    transition
                    duration-300
                  "
                />

                {/* =============================== */}
                {/* 🔥 +MORE */}
                {/* =============================== */}
                {index === 3 &&
                  total > 4 && (

                    <div
                      className="
                        absolute
                        inset-0

                        bg-black/60
                        backdrop-blur-sm

                        flex
                        items-center
                        justify-center

                        text-white
                        text-3xl
                        font-bold
                      "
                    >
                      +{total - 4}
                    </div>
                  )}

              </div>
            );
          })}
      </div>

    </div>
  );
};

export default memo(MediaGrid);