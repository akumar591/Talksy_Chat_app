import {
  useState,
  useRef,
  useEffect,
} from "react";

import { motion } from "framer-motion";

import { FiArrowLeft } from "react-icons/fi";

import { assets } from "../../assets/assets";

import API from "../../api/axios";

import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";

function OTP({
  onVerify,
}) {

  // =====================================
  // 🔥 STATES
  // =====================================
  const [otp, setOtp] =
    useState([
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

  const [loading, setLoading] =
    useState(false);

  const [timer, setTimer] =
    useState(30);

  // =====================================
  // 🔥 REFS
  // =====================================
  const inputsRef =
    useRef([]);

  const initializedRef =
    useRef(false);

  // =====================================
  // 🔥 AUTH
  // =====================================
  const {
    phone,
    setPhone,
    setUser,
  } = useAuth();

  // =====================================
  // 🔥 ACTIVE PHONE
  // =====================================
  const activePhone =
    phone ||
    sessionStorage.getItem(
      "phone"
    );

  // =====================================
  // 🔥 VALIDATION
  // =====================================
  const isValid =
    otp.join("").length ===
    6;

  // =====================================
  // 🔥 REFRESH SAFETY
  // =====================================
  useEffect(() => {

    // 🔥 strict mode safety
    if (
      initializedRef.current
    ) {

      return;
    }

    initializedRef.current =
      true;

    // 🔥 invalid access
    if (
      !activePhone
    ) {

      localStorage.setItem(
        "step",
        "login"
      );

      onVerify("login");

      return;
    }

    // 🔥 keep otp step
    localStorage.setItem(
      "step",
      "otp"
    );

  }, [
    activePhone,
    onVerify,
  ]);

  // =====================================
  // 🔥 TIMER
  // =====================================
  useEffect(() => {

    if (timer <= 0)
      return;

    const interval =
      setInterval(() => {

        setTimer((prev) => {

          if (prev <= 1) {

            clearInterval(
              interval
            );

            return 0;
          }

          return prev - 1;
        });

      }, 1000);

    return () =>
      clearInterval(
        interval
      );

  }, [timer]);

  // =====================================
  // 🔥 OTP INPUT
  // =====================================
  const handleChange = (
    value,
    index
  ) => {

    if (
      !/^[0-9]?$/.test(
        value
      )
    )
      return;

    const newOtp = [
      ...otp,
    ];

    newOtp[index] =
      value;

    setOtp(newOtp);

    if (
      value &&
      index < 5
    ) {

      inputsRef.current[
        index + 1
      ]?.focus();
    }
  };

  // =====================================
  // 🔥 BACKSPACE
  // =====================================
  const handleKeyDown = (
    e,
    index
  ) => {

    if (
      e.key ===
        "Backspace" &&
      !otp[index] &&
      index > 0
    ) {

      inputsRef.current[
        index - 1
      ]?.focus();
    }
  };

  // =====================================
  // 🔥 PASTE OTP
  // =====================================
  const handlePaste = (
    e
  ) => {

    const paste =
      e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 6);

    if (!paste)
      return;

    const newOtp =
      paste.split("");

    while (
      newOtp.length < 6
    ) {

      newOtp.push("");
    }

    setOtp(newOtp);

    const nextIndex =
      Math.min(
        paste.length,
        5
      );

    inputsRef.current[
      nextIndex
    ]?.focus();
  };

  // =====================================
  // 🔥 CHANGE NUMBER
  // =====================================
  const handleBack =
    () => {

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      setPhone(null);

      sessionStorage.removeItem(
        "phone"
      );

      localStorage.setItem(
        "step",
        "login"
      );

      onVerify("login");
    };

  // =====================================
  // 🔥 VERIFY OTP
  // =====================================
  const handleVerify =
    async () => {

      if (
        !isValid ||
        loading
      )
        return;

      try {

        setLoading(true);

        // 🔥 VERIFY OTP
        await API.post(
          "/auth/verify-otp",
          {
            phone:
              activePhone,
            otp: otp.join(
              ""
            ),
          },
          {
            withCredentials: true,
          }
        );

        // 🔥 FETCH USER
        const userRes =
          await API.get(
            "/users/me",
            {
              withCredentials: true,
            }
          );

        const currentUser =
          userRes.data.data;

        // 🔥 SAVE USER
        setUser(
          currentUser
        );

        // 🔥 IMPORTANT
        // don't clear phone here
        // profile refresh needs it

        // 🔥 ALWAYS GO PROFILE SETUP
        localStorage.setItem(
          "step",
          "profile"
        );

        toast.success(
          "OTP verified ✅"
        );

        onVerify(
          "profile"
        );

      } catch (err) {

        // 🔥 CLEAR WRONG OTP
        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        inputsRef.current[0]?.focus();

        const msg =
          err.response?.data
            ?.message ||
          "Verification failed ❌";

        toast.error(msg);

      } finally {

        setLoading(false);
      }
    };

  // =====================================
  // 🔥 RESEND OTP
  // =====================================
  const resendOtp =
    async () => {

      if (
        timer > 0 ||
        loading
      )
        return;

      try {

        setLoading(true);

        await API.post(
          "/auth/send-otp",
          {
            phone:
              activePhone,
          },
          {
            withCredentials: true,
          }
        );

        // 🔥 RESET TIMER
        setTimer(30);

        // 🔥 CLEAR OTP
        setOtp([
          "",
          "",
          "",
          "",
          "",
          "",
        ]);

        // 🔥 FOCUS
        inputsRef.current[0]?.focus();

        toast.success(
          "OTP resent successfully ✅"
        );

      } catch (err) {

        const msg =
          err.response?.data
            ?.message ||
          "Failed to resend ❌";

        toast.error(msg);

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-[#0b0f1a] text-white overflow-hidden">

      {/* BG */}
      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-[#00c896] blur-[120px] opacity-10 top-[-80px] left-[-80px]" />

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-[#0ea5e9] blur-[120px] opacity-10 bottom-[-80px] right-[-80px]" />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-sm z-[1]" />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center">

        {/* LOGO */}
        <motion.img
          src={assets.Logo}
          alt="logo"
          className="w-28 mb-6 opacity-80"
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
        />

        {/* TITLE */}
        <p className="text-white/60 text-sm mb-2">

          Enter verification code

        </p>

        {/* PHONE */}
        <p className="text-white/30 text-xs mb-8">

          OTP sent to +91{" "}

          {activePhone}

        </p>

        {/* OTP */}
        <div
          className="flex gap-3 mb-6"
          onPaste={
            handlePaste
          }
        >

          {otp.map(
            (
              digit,
              i
            ) => (

              <input
                key={i}
                ref={(el) =>
                  (
                    inputsRef.current[
                      i
                    ] = el
                  )
                }
                maxLength={1}
                value={otp[i]}
                inputMode="numeric"
                autoComplete="one-time-code"
                onChange={(e) =>
                  handleChange(
                    e.target
                      .value,
                    i
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(
                    e,
                    i
                  )
                }
                className="w-5 h-12 text-center bg-transparent border-b border-white/20 outline-none focus:border-[#00c896] transition"
              />
            )
          )}

        </div>

        {/* VERIFY */}
        <motion.button
          onClick={
            handleVerify
          }
          disabled={
            !isValid ||
            loading
          }
          whileTap={{
            scale: isValid
              ? 0.92
              : 1,
          }}
          whileHover={{
            scale: isValid
              ? 1.05
              : 1,
          }}
          className={`mt-4 flex items-center justify-center gap-3 transition-all ${(!isValid || loading) && "cursor-not-allowed"}`}
        >

          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isValid
                ? "bg-gradient-to-r from-[#00c896] to-[#0ea5e9] text-black shadow-[0_0_20px_#00c896]"
                : "bg-white/10 text-white/30"
            }`}
          >

            {loading ? (

              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />

            ) : (

              "✓"
            )}

          </div>

          <span
            className={`${isValid ? "text-white" : "text-white/30"} text-sm`}
          >

            {loading
              ? "Verifying..."
              : "Verify"}

          </span>

        </motion.button>

        {/* RESEND */}
        <p className="mt-6 text-xs text-white/40">

          Didn’t receive code?{" "}

          <span
            onClick={
              resendOtp
            }
            className={
              timer === 0
                ? "text-[#00c896] cursor-pointer"
                : "text-white/30"
            }
          >

            {timer === 0
              ? "Resend"
              : `Resend in ${timer}s`}

          </span>

        </p>

        {/* CHANGE NUMBER */}
        <button
          onClick={
            handleBack
          }
          className="mt-4 flex items-center gap-2 text-xs text-white/50 hover:text-[#00c896] transition"
        >

          <FiArrowLeft size={14} />

          Change phone number

        </button>

      </div>

    </div>
  );
}

export default OTP;