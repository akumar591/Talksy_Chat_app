import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function OTP({ onVerify }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const inputsRef = useRef([]);

  const { phone, setUser } = useAuth();

  const isValid = otp.join("").length === 6;

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(paste)) return;

    const newOtp = paste.split("");
    setOtp(newOtp);

    newOtp.forEach((num, i) => {
      if (inputsRef.current[i]) {
        inputsRef.current[i].value = num;
      }
    });
  };

  // 🔥 UPDATED VERIFY (MAIN FIX)
  const handleVerify = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      // ✅ VERIFY OTP (with credentials)
      await API.post(
        "/auth/verify-otp",
        {
          phone,
          otp: otp.join(""),
        },
        {
          withCredentials: true, // 🔥 FIX
        }
      );

      // ✅ GET PROFILE (with credentials)
      const res = await API.get("/users/me", {
        withCredentials: true, // 🔥 FIX
      });

      // ✅ SAVE USER
      setUser(res.data.data);

      toast.success("Login successful ✅");
      onVerify();

    } catch (err) {
      console.log(err);

      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Server not reachable ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0) return;

    try {
      setTimer(30);

      await API.post(
        "/auth/send-otp",
        { phone },
        { withCredentials: true } // 🔥 safe
      );

      toast.success("OTP sent successfully ✅");

      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();

    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to resend ❌");
      }
    }
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-[#0b0f1a] text-white overflow-hidden">

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#00c896] blur-[120px] opacity-10 top-[-80px] left-[-80px]" />

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#0ea5e9] blur-[120px] opacity-10 bottom-[-80px] right-[-80px]" />

      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-sm z-[1]" />

      <div className="relative z-10 flex flex-col items-center">

        <motion.img
          src={assets.Logo}
          alt="logo"
          className="w-28 mb-6 opacity-80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        />

        <p className="text-white/60 text-sm mb-2">
          Enter verification code
        </p>

        <p className="text-white/30 text-xs mb-8">
          OTP sent to +91 {phone}
        </p>

        <div className="flex gap-3 mb-6" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              maxLength={1}
              value={otp[i]}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className="w-5 h-12 text-center bg-transparent border-b border-white/20"
            />
          ))}
        </div>

        <motion.button
          onClick={handleVerify}
          disabled={!isValid || loading}
          whileTap={{ scale: isValid ? 0.92 : 1 }}
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          className={`mt-4 flex items-center justify-center gap-3 transition-all
          ${(!isValid || loading) && "cursor-not-allowed"}`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center
            ${
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

          <span className={`${isValid ? "text-white" : "text-white/30"} text-sm`}>
            {loading ? "Verifying..." : "Verify"}
          </span>
        </motion.button>

        <p className="mt-6 text-xs text-white/40">
          Didn’t receive code?{" "}
          <span
            onClick={resendOtp}
            className={`${
              timer === 0 ? "text-[#00c896] cursor-pointer" : "text-white/30"
            }`}
          >
            {timer === 0 ? "Resend" : `Resend in ${timer}s`}
          </span>
        </p>

      </div>
    </div>
  );
}

export default OTP;