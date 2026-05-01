import { createContext, useContext, useState } from "react";
import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ✅ PHONE (SESSION STORAGE)
  const [phone, setPhoneState] = useState(() => {
    return sessionStorage.getItem("phone") || null;
  });

  const setPhone = (newPhone) => {
    if (!newPhone) {
      sessionStorage.removeItem("phone");
      setPhoneState(null);
    } else {
      sessionStorage.setItem("phone", newPhone);
      setPhoneState(newPhone);
    }
  };

  // ✅ EMAIL (SESSION STORAGE)
  const [email, setEmailState] = useState(() => {
    return sessionStorage.getItem("email") || null;
  });

  const setEmail = (newEmail) => {
    if (!newEmail) {
      sessionStorage.removeItem("email");
      setEmailState(null);
    } else {
      sessionStorage.setItem("email", newEmail);
      setEmailState(newEmail);
    }
  };

  // ✅ USER (LOCAL STORAGE)
  const [user, setUserState] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setUser = (newUser) => {
    if (!newUser) {
      localStorage.removeItem("user");
      setUserState(null);
      return;
    }

    const updatedUser = {
      ...(user || {}),
      ...newUser,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUserState(updatedUser);
  };

  // 🔥 VERIFY OTP + LOGIN
  const verifyOtpAndLogin = async (otp) => {
    try {
      await API.post("/auth/verify-otp", {
        phone,
        otp,
      });

      await fetchUser();

      sessionStorage.removeItem("phone");
      sessionStorage.removeItem("email");
      setPhoneState(null);
      setEmailState(null);

      return true;

    } catch (err) {
      console.log("OTP failed:", err);
      return false;
    }
  };

  // 🔥 EMAIL VERIFY
  const verifyEmail = async (otp) => {
    try {
      await API.post("/auth/verify-email", {
        phone,
        email,
        otp,
      });

      await fetchUser();

      sessionStorage.removeItem("email");
      setEmailState(null);

      return true;

    } catch (err) {
      console.log("Email verify failed:", err);
      return false;
    }
  };

  // 🔥 GET PROFILE
  const fetchUser = async () => {
    try {
      const res = await API.get("/auth/profile");
      setUser(res.data.data);
    } catch (err) {
      console.log("Fetch user failed:", err);
      setUser(null);
    }
  };

  // ✅ NEW FUNCTION (ONLY ADDITION)
  const refreshUser = async () => {
    await fetchUser();
  };

  // 🔥 LOGOUT
  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout API error:", err);
    }

    localStorage.removeItem("user");
    localStorage.setItem("step", "splash");

    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("email");

    setPhoneState(null);
    setEmailState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        phone,
        setPhone,
        email,
        setEmail,
        user,
        setUser,
        verifyOtpAndLogin,
        verifyEmail,
        fetchUser,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);