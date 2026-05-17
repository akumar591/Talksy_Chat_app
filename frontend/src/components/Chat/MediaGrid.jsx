const MediaGrid = ({

  medias = [],

  setViewerOpen,
  setViewerMedia,
  setViewerIndex,
}) => {

  const total =
    medias.length;

  const getGridClass = () => {

    if (total === 1) {
      return "grid-cols-1";
    }

    return "grid-cols-2";
  };

  return (
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

                setViewerOpen(true);
              }}
            >

              {/* 🔥 IMAGE */}
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

              {/* 🔥 +MORE */}
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
  );
};

export default MediaGrid;