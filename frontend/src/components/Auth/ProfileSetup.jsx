import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

function Profile({ onComplete }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null); // 🔥 NEW

  const [errors, setErrors] = useState({});
  const [emailVerified, setEmailVerified] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOTP, setGeneratedOTP] = useState(false);

  const [loading, setLoading] = useState(false);

  const { user, setUser, phone, fetchUser } = useAuth();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setBio(user.bio || "");
      setEmail(user.email || "");
      setPreview(user.avatar || null);

      if (user.email) setEmailVerified(true);
    }
  }, [user]);

  const validate = () => {
    let newErrors = {};

    if (name.trim().length < 3) newErrors.name = "Enter a valid name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";
    if (bio.trim().length < 3) newErrors.bio = "Write something about you";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 AUTO IMAGE UPLOAD (MAIN LOGIC)
  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "profile"); // ✅ IMPORTANT

      const res = await API.post("/file/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const url = res.data.data;

      setUploadedUrl(url); // ✅ store final uploaded URL

      console.log("Uploaded URL:", url);
    } catch (err) {
      let msg = "Image upload failed";

      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      toast.error(msg);
    }
  };

  const sendOTP = async () => {
    setErrors({});

    try {
      setSendingOTP(true);

      await API.post("/auth/send-email-otp", { email });

      setGeneratedOTP(true);
      toast.success("OTP sent to email ✅");
    } catch (err) {
      let msg = "Failed to send OTP";

      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      setErrors({ email: msg });
      toast.error(msg);
    } finally {
      setSendingOTP(false);
    }
  };

  const verifyOTP = async () => {
    setErrors({});

    try {
      await API.post("/auth/verify-email", {
        phone,
        email,
        otp,
      });

      setEmailVerified(true);
      setOtp("");

      toast.success("Email verified ✅");
    } catch (err) {
      let msg = "Verification failed";

      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      setOtp("");
      setErrors({ email: msg });
      toast.error(msg);
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    if (!emailVerified) {
      setErrors({ email: "Please verify your email" });
      return;
    }

    if (imageFile && !uploadedUrl) {
      toast.error("Please wait, image uploading...");
      return;
    }

    try {
      setLoading(true);

      const avatarUrl = uploadedUrl || preview;

      const res = await API.post("/auth/register", {
        phone,
        name,
        bio,
        email,
        avatar: avatarUrl,
      });

      // 🔥🔥 CRITICAL FIX (re-render guaranteed)
      const updatedUser = res.data.data;

      // ✅ instant UI update (fast feel)
      setUser((prev) => ({
        ...prev,
        ...updatedUser,
      }));

      // 🔥🔥 MAIN FIX (DB se latest data lana)
      await fetchUser();

      toast.success("Profile setup complete 🎉");
      onComplete();
    } catch (err) {
      let msg = "Something went wrong";

      if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      toast.error(msg);
      setErrors({ email: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0b0f1a] text-white relative">
      <motion.img src={assets.Logo} className="w-24 mb-8 opacity-80" />

      <div className="mb-8">
        <label className="cursor-pointer">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 flex items-center justify-center hover:scale-105 transition">
            {preview ? (
              <img src={preview} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/40 text-sm">Image</span>
            )}
          </div>
          <input type="file" hidden onChange={handleImage} key={preview} />
        </label>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-6">
        <div>
          <input
            placeholder="Your Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#00c896] w-full"
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <div className="flex gap-2 items-center">
            <input
              placeholder="Email *"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailVerified(false);
              }}
              className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#0ea5e9] w-full"
            />

            <button
              onClick={sendOTP}
              className="text-xs px-2 py-1 border border-white/20 rounded hover:bg-white/10 cursor-pointer"
            >
              {sendingOTP ? "Sending..." : "Verify"}
            </button>
          </div>

          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}

          {generatedOTP && !emailVerified && (
            <div className="flex gap-2 mt-2">
              <input
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
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

          {emailVerified && (
            <p className="text-green-400 text-xs mt-1">Verified ✅</p>
          )}
        </div>

        <div>
          <input
            placeholder="About *"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="bg-transparent border-b border-white/20 pb-2 outline-none focus:border-[#0ea5e9] w-full"
          />
          {errors.bio && (
            <p className="text-red-400 text-xs mt-1">{errors.bio}</p>
          )}
        </div>
      </div>

      <motion.button
        onClick={handleSubmit}
        className={`mt-10 w-full max-w-sm py-3 rounded-full font-medium cursor-pointer ${
          loading
            ? "bg-white/10 text-white/30"
            : "bg-gradient-to-r from-[#00c896] to-[#0ea5e9] text-black"
        }`}
      >
        {loading ? "Saving..." : "Continue"}
      </motion.button>
    </div>
  );
}

export default Profile;
