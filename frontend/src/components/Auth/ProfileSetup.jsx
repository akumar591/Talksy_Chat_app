import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function ProfileSetup({ onComplete }) {

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");

  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);

  const [errors, setErrors] = useState({});

  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);

  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    user,
    setUser,
    phone,
    fetchUser,
  } = useAuth();

  // 🔥 ACCESS SAFETY
  useEffect(() => {

    if (!phone && !user) {

      localStorage.setItem(
        "step",
        "login"
      );

      onComplete?.("login");
    }

  }, [phone, user]);

  // 🔥 PREFILL OLD USER
  useEffect(() => {

    if (user) {

      setName(user.name || "");
      setBio(user.bio || "");
      setEmail(user.email || "");
      setPreview(user.avatar || null);

      if (user.email) {
        setEmailVerified(true);
      }
    }

  }, [user]);

  // 🔥 MEMORY LEAK FIX
  useEffect(() => {

    return () => {

      if (
        preview &&
        preview.startsWith("blob:")
      ) {

        URL.revokeObjectURL(preview);
      }
    };

  }, [preview]);

  // 🔥 VALIDATION
  const validate = () => {

    let newErrors = {};

    if (name.trim().length < 3) {
      newErrors.name = "Enter valid name";
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email = "Enter valid email";
    }

    if (bio.trim().length < 3) {
      newErrors.bio = "Write something about you";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  // 🔥 IMAGE
  const handleImage = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // 🔥 IMAGE VALIDATION
    if (
      !file.type.startsWith("image/")
    ) {

      toast.error(
        "Only image allowed ❌"
      );

      return;
    }

    // 🔥 SIZE LIMIT
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      toast.error(
        "Image must be under 5MB"
      );

      return;
    }

    // 🔥 CLEAN OLD PREVIEW
    if (
      preview &&
      preview.startsWith("blob:")
    ) {

      URL.revokeObjectURL(preview);
    }

    const localPreview =
      URL.createObjectURL(file);

    setImageFile(file);
    setPreview(localPreview);

    try {

      const formData =
        new FormData();

      formData.append("file", file);
      formData.append("type", "profile");

      const res = await API.post(
        "/file/upload",
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      const url = res.data.data;

      setUploadedUrl(url);

      toast.success(
        "Image uploaded ✅"
      );

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Image upload failed";

      toast.error(msg);
    }
  };

  // 🔥 SEND EMAIL OTP
  const sendOTP = async () => {

    if (
      sendingOTP ||
      loading
    ) return;

    setErrors({});

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

      setErrors({
        email: "Enter valid email",
      });

      return;
    }

    try {

      setSendingOTP(true);

      await API.post(
        "/auth/send-email-otp",
        { email }
      );

      setGeneratedOTP(true);

      setOtp("");

      toast.success(
        "OTP sent to email ✅"
      );

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Failed to send OTP";

      setErrors({
        email: msg,
      });

      toast.error(msg);

    } finally {

      setSendingOTP(false);
    }
  };

  // 🔥 VERIFY EMAIL OTP
  const verifyOTP = async () => {

    if (
      otp.trim().length < 6
    ) {

      toast.error(
        "Enter valid OTP"
      );

      return;
    }

    try {

      await API.post(
        "/auth/verify-email",
        {
          phone,
          email,
          otp,
        }
      );

      setEmailVerified(true);

      setOtp("");

      toast.success(
        "Email verified ✅"
      );

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Verification failed";

      setOtp("");

      setErrors({
        email: msg,
      });

      toast.error(msg);
    }
  };

  // 🔥 SUBMIT PROFILE
  const handleSubmit = async () => {

    if (
      loading ||
      !validate()
    ) return;

    // 🔥 EMAIL VERIFY
    if (!emailVerified) {

      setErrors({
        email:
          "Please verify your email",
      });

      return;
    }

    // 🔥 WAIT IMAGE
    if (
      imageFile &&
      !uploadedUrl
    ) {

      toast.error(
        "Please wait, image uploading..."
      );

      return;
    }

    try {

      setLoading(true);

      const avatarUrl =
        uploadedUrl || preview;

      const res = await API.post(
        "/auth/register",
        {
          phone,
          name: name.trim(),
          bio: bio.trim(),
          email: email.trim(),
          avatar: avatarUrl,
        }
      );

      const updatedUser =
        res.data.data;

      // 🔥 FAST UI UPDATE
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      // 🔥 FETCH LATEST USER
      await fetchUser();

      // 🔥 SAVE STEP
      localStorage.setItem(
        "step",
        "app"
      );

      toast.success(
        "Profile updated 🎉"
      );

      onComplete?.();

    } catch (err) {

      const msg =
        err.response?.data?.message ||
        "Something went wrong";

      toast.error(msg);

      setErrors({
        email: msg,
      });

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0b0f1a] text-white relative overflow-hidden">

      {/* BG */}
      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-[#00c896] blur-[120px] opacity-10 top-[-80px] left-[-80px]" />

      <div className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-[#0ea5e9] blur-[120px] opacity-10 bottom-[-80px] right-[-80px]" />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-sm z-[1]" />

      {/* CONTENT */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* LOGO */}
        <motion.img
          src={assets.Logo}
          className="w-24 mb-8 opacity-80"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        />

        {/* IMAGE */}
        <div className="mb-8">

          <label className="cursor-pointer">

            <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 flex items-center justify-center hover:scale-105 transition">

              {preview ? (

                <img
                  src={preview}
                  className="w-full h-full object-cover"
                />

              ) : (

                <span className="text-white/40 text-sm">
                  Image
                </span>
              )}
            </div>

            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>
        </div>

        {/* FORM */}
        <div className="w-full max-w-sm flex flex-col gap-6">

          {/* NAME */}
          <div>

            <input
              placeholder="Your Name *"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#00c896] w-full"
            />

            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* EMAIL */}
          <div>

            <div className="flex gap-2 items-center">

              <input
                placeholder="Email *"
                value={email}
                onChange={(e) => {

                  setEmail(e.target.value);

                  setEmailVerified(false);

                  setGeneratedOTP(false);
                }}
                className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#0ea5e9] w-full"
              />

              <button
                onClick={sendOTP}
                disabled={sendingOTP}
                className="text-xs px-2 py-1 border border-white/20 rounded hover:bg-white/10 cursor-pointer disabled:opacity-50"
              >

                {sendingOTP
                  ? "Sending..."
                  : "Verify"}
              </button>
            </div>

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email}
              </p>
            )}

            {/* OTP */}
            {generatedOTP &&
              !emailVerified && (

              <div className="flex gap-2 mt-2">

                <input
                  placeholder="OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  className="bg-transparent border-b border-white/20 pb-1 outline-none"
                />

                <button
                  onClick={verifyOTP}
                  className="text-xs border px-2 rounded cursor-pointer"
                >
                  OK
                </button>
              </div>
            )}

            {/* VERIFIED */}
            {emailVerified && (
              <p className="text-green-400 text-xs mt-1">
                Verified ✅
              </p>
            )}
          </div>

          {/* BIO */}
          <div>

            <input
              placeholder="About *"
              value={bio}
              onChange={(e) =>
                setBio(e.target.value)
              }
              className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#0ea5e9] w-full"
            />

            {errors.bio && (
              <p className="text-red-400 text-xs mt-1">
                {errors.bio}
              </p>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <motion.button
          onClick={handleSubmit}
          disabled={loading}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          className={`mt-10 w-full max-w-sm py-3 rounded-full font-medium cursor-pointer transition ${
            loading
              ? "bg-white/10 text-white/30"
              : "bg-gradient-to-r from-[#00c896] to-[#0ea5e9] text-black"
          }`}
        >

          {loading
            ? "Saving..."
            : "Continue"}
        </motion.button>

      </div>
    </div>
  );
}

export default ProfileSetup;