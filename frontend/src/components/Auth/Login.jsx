import { useState } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext"; // 🔥 NEW

function Login({ onLogin }) {

  const [phone, setPhoneInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setPhone } = useAuth(); // 🔥 context

  const isValid = /^[6-9]\d{9}$/.test(phone);

  // 🔥 LOGIN FLOW
  const handleLogin = async () => {
    if (!isValid || loading) return;

    try {
      setLoading(true);

      const res = await API.post("/auth/send-otp", {
        phone,
      });

      console.log("OTP SENT:", res.data);

      // ✅ context में phone store
      setPhone(phone);

      // ✅ toast
      toast.success("OTP sent successfully ✅");

      // 👉 next screen
      onLogin();

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && isValid) handleLogin();
  };

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-[#0b0f1a] text-white overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#00c896] blur-[120px] sm:blur-[140px] opacity-10 sm:opacity-20 
      top-[-80px] left-[-80px]" />

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] 
      bg-[#0ea5e9] blur-[120px] sm:blur-[140px] opacity-10 sm:opacity-20 
      bottom-[-80px] right-[-80px]" />

      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-sm z-[1]" />

      <div className="relative z-10 flex flex-col items-center">

        <motion.img
          src={assets.Logo}
          alt="logo"
          className="w-28 sm:w-32 mb-6 opacity-80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        />

        <motion.p className="text-white/60 text-md mb-2">
          Enter your phone number to continue
        </motion.p>

        <motion.p className="text-white/30 text-xs mb-10">
          We'll send you a verification code (OTP)
        </motion.p>

        <div className="flex flex-col items-center">

          <div className="flex items-center justify-center gap-2 w-[240px] text-lg tracking-[4px]">

            <span className={`${phone ? "text-white" : "text-white/40"}`}>
              +91
            </span>

            <input
              type="tel"
              value={phone}
              placeholder="__________"
              maxLength={10}
              inputMode="numeric"
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, "");
                setPhoneInput(v);
              }}
              className="bg-transparent focus:outline-none text-white w-[160px] text-left placeholder:text-white/10"
            />
          </div>

          <div className="mt-3 w-[240px] h-[2px] bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00c896] to-[#0ea5e9]"
              animate={{
                width: phone || isFocused ? "100%" : "0%",
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {phone.length > 0 && !isValid && (
            <p className="text-red-400 text-xs mt-2">
              Enter valid 10-digit number
            </p>
          )}
        </div>

        {/* 🔥 BUTTON */}
        <motion.button
          onClick={handleLogin}
          disabled={!isValid || loading}
          whileTap={{ scale: isValid ? 0.92 : 1 }}
          whileHover={{ scale: isValid ? 1.05 : 1 }}
          className={`mt-8 flex items-center justify-center gap-3 transition-all
          ${(!isValid || loading) && "cursor-not-allowed"}
        `}
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
              "→"
            )}
          </div>

          <span className={`${isValid ? "text-white" : "text-white/30"} text-sm`}>
            {loading ? "Sending..." : "Continue"}
          </span>
        </motion.button>

        <p className="text-[11px] mt-4 text-white/40">
          Secure login • No spam
        </p>

      </div>
    </div>
  );
}

export default Login;