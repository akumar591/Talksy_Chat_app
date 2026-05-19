import { useState } from "react";

import {
  FiArrowLeft,
} from "react-icons/fi";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import CallList from "./CallList";

import CallDetails from "./CallDetails";

const CallLayout = () => {

  const navigate =
    useNavigate();

  const location =
    useLocation();

  // 🔥 ROUTE CHECK
  const hasCallRoute =
    !!location.state?.call;

  // 🔥 SELECTED CALL
  const [
    selectedCall,
    setSelectedCall,
  ] = useState(
    location.state?.call ||
      null
  );

  return (
    <div className="w-full h-screen text-[var(--text)] bg-[var(--bg)]">

      {/* 🔥 MOBILE HEADER */}
      {!hasCallRoute && (

        <div
          className="
            md:hidden

            fixed
            top-0
            left-0

            w-full

            z-50

            bg-[var(--bg)]

            border-b
            border-[var(--border)]
          "
        >

          <div
            className="
              flex
              items-center
              justify-between

              px-4
              py-3
            "
          >

            {/* 🔥 BACK */}
            <FiArrowLeft

              onClick={() =>
                navigate("/")
              }

              className="
                text-lg
                cursor-pointer
              "
            />

            {/* 🔥 TITLE */}
            <h2
              className="
                text-sm
                font-semibold
              "
            >
              Calls
            </h2>

            {/* 🔥 EMPTY */}
            <div className="w-5" />

          </div>

        </div>
      )}

      {/* 🔥 CALL LIST */}
      <div
        className={`

          ${
            hasCallRoute
              ? "hidden md:block"
              : "block"
          }

          fixed

          top-12
          md:top-16

          left-0

          w-full
          md:w-[30%]
          lg:w-[25%]

          h-[calc(100vh-48px)]
          md:h-[calc(100vh-64px)]

          md:border-r
          md:border-[var(--border)]
        `}
      >

        <CallList
          onSelect={
            setSelectedCall
          }
        />

      </div>

      {/* 🔥 CALL DETAILS */}
      <div
        className={`

          ${
            hasCallRoute
              ? "flex"
              : "hidden md:flex"
          }

          fixed

          top-0
          md:top-16

          left-0
          md:left-[30%]
          lg:left-[25%]

          w-full
          md:w-[70%]
          lg:w-[75%]

          h-screen
          md:h-[calc(100vh-64px)]

          items-center
          justify-center

          bg-[var(--bg)]
        `}
      >

        {selectedCall ? (

          <CallDetails

            call={selectedCall}

            onEnd={() => {

              if (
                location.state?.call
              ) {

                // 🔥 CHAT WINDOW
                navigate(-1);

              } else {

                // 🔥 CALL LIST
                setSelectedCall(
                  null
                );
              }
            }}
          />

        ) : (

          <p
            className="
              opacity-50

              hidden
              md:block
            "
          >
            Select a call
          </p>
        )}

      </div>

    </div>
  );
};

export default CallLayout;