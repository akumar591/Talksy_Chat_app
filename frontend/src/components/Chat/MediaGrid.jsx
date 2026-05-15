import { useState, useEffect } from "react";

const MediaGrid = ({ medias = [], onDelete }) => {

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(0);

  const total = medias.length;

  // 🔥 BODY SCROLL LOCK
  useEffect(() => {

    if (open) {

      document.body.style.overflow = "hidden";

    } else {

      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };

  }, [open]);

  // 🔥 ESC CLOSE
  useEffect(() => {

    const handleEsc = (e) => {

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };

  }, []);

  const getGridClass = () => {

    if (total === 1) {
      return "grid-cols-1";
    }

    return "grid-cols-2";
  };

  return (
    <>
      {/* 🔥 GRID */}
      <div className={`grid ${getGridClass()} gap-1 max-w-[250px] md:max-w-[320px] overflow-hidden rounded-2xl`}>

        {medias.slice(0, 4).map((media, index) => {

          const isThreeLayout = total === 3;

          const isSingle = total === 1;

          return (
            <div
              key={media.id}
              className={`relative bg-black overflow-hidden cursor-pointer ${isSingle ? "h-[220px] md:h-[320px]" : "h-[110px] md:h-[160px]"} ${isThreeLayout && index === 0 ? "row-span-2 h-[221px] md:h-[321px]" : ""}`}
              onClick={() => {

                setSelected(index);

                setOpen(true);
              }}
            >

              {/* 🔥 IMAGE */}
              <img
                src={media.content}
                alt=""
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition duration-300"
              />

              {/* 🔥 QUICK DOWNLOAD */}
              <a
                href={media.content}
                download
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 transition flex items-center justify-center text-white text-xs opacity-100 md:opacity-0 md:hover:opacity-100"
              >
                ⬇
              </a>

              {/* 🔥 +MORE */}
              {index === 3 && total > 4 && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold">
                  +{total - 4}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 🔥 MODAL */}
      {open && (
        <div
          className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >

          {/* 🔥 TOP ACTIONS */}
          <div
            className="fixed top-4 right-4 z-[999999] flex items-center gap-2 md:gap-3"
            onClick={(e) => e.stopPropagation()}
          >

            {/* 🔥 DOWNLOAD */}
            <a
              href={medias[selected]?.content}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/70 hover:bg-black/90 transition backdrop-blur-md flex items-center justify-center text-white text-base md:text-lg border border-white/10"
            >
              ⬇
            </a>

            {/* 🔥 OPEN */}
            <a
              href={medias[selected]?.content}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/70 hover:bg-black/90 transition backdrop-blur-md flex items-center justify-center text-white text-base md:text-lg border border-white/10"
            >
              ↗
            </a>

            {/* 🔥 DELETE */}
            <button
              onClick={() => {

                if (onDelete) {
                  onDelete();
                }

                setOpen(false);
              }}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-red-500/80 hover:bg-red-600 transition flex items-center justify-center text-white text-base md:text-lg"
            >
              🗑
            </button>

            {/* 🔥 CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/70 hover:bg-black/90 transition backdrop-blur-md flex items-center justify-center text-white text-lg md:text-xl border border-white/10"
            >
              ✕
            </button>

          </div>

          {/* 🔥 PREV */}
          {selected > 0 && (
            <button
              onClick={(e) => {

                e.stopPropagation();

                setSelected(prev => prev - 1);
              }}
              className="absolute left-2 md:left-5 text-white text-4xl md:text-5xl z-[999999]"
            >
              ‹
            </button>
          )}

          {/* 🔥 IMAGE */}
          <img
            src={medias[selected]?.content}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-w-[95vw] max-h-[82vh] md:max-h-[88vh] object-contain"
          />

          {/* 🔥 NEXT */}
          {selected < medias.length - 1 && (
            <button
              onClick={(e) => {

                e.stopPropagation();

                setSelected(prev => prev + 1);
              }}
              className="absolute right-2 md:right-5 text-white text-4xl md:text-5xl z-[999999]"
            >
              ›
            </button>
          )}

          {/* 🔥 COUNTER */}
          <div className="absolute bottom-5 text-white text-xs md:text-sm font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
            {selected + 1} / {medias.length}
          </div>

        </div>
      )}
    </>
  );
};

export default MediaGrid;