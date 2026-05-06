import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import API from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // ===============================
  // ✅ PHONE (SESSION STORAGE)
  // ===============================
  const [phone, setPhoneState] = useState(() => {
    return sessionStorage.getItem("phone") || null;
  });

  const setPhone = (newPhone) => {

    if (!newPhone) {
      sessionStorage.removeItem("phone");
      setPhoneState(null);
      return;
    }

    sessionStorage.setItem("phone", newPhone);
    setPhoneState(newPhone);
  };

  // ===============================
  // ✅ EMAIL (SESSION STORAGE)
  // ===============================
  const [email, setEmailState] = useState(() => {
    return sessionStorage.getItem("email") || null;
  });

  const setEmail = (newEmail) => {

    if (!newEmail) {
      sessionStorage.removeItem("email");
      setEmailState(null);
      return;
    }

    sessionStorage.setItem("email", newEmail);
    setEmailState(newEmail);
  };

  // ===============================
  // ✅ USER (LOCAL STORAGE)
  // ===============================
  const [user, setUserState] = useState(() => {

    try {

      const storedUser = localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;

    } catch {

      return null;
    }
  });

  // ===============================
  // ✅ UPDATE USER STATE
  // ===============================
  const setUser = (newUser) => {

    if (!newUser) {

      localStorage.removeItem("user");
      setUserState(null);

      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify(newUser)
    );

    setUserState(newUser);
  };

  // ===============================
  // 🔥 FETCH LATEST USER PROFILE
  // ===============================
  const fetchUser = useCallback(async () => {

    try {

      const res = await API.get("/users/me");

      if (res?.data?.data) {
        setUser(res.data.data);
      }

      return res?.data?.data;

    } catch (err) {

      console.log("Fetch user failed:", err);

      setUser(null);

      return null;
    }

  }, []);

  // ===============================
  // 🔥 REFRESH USER ANYTIME
  // ===============================
  const refreshUser = async () => {
    return await fetchUser();
  };

  // ===============================
  // 🔥 VERIFY OTP + LOGIN
  // ===============================
  const verifyOtpAndLogin = async (otp) => {

    try {

      await API.post("/auth/verify-otp", {
        phone,
        otp,
      });

      // 🔥 latest profile fetch
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

  // ===============================
  // 🔥 VERIFY EMAIL
  // ===============================
  const verifyEmail = async (otp) => {

    try {

      await API.post("/auth/verify-email", {
        phone,
        email,
        otp,
      });

      // 🔥 latest profile fetch
      await fetchUser();

      sessionStorage.removeItem("email");

      setEmailState(null);

      return true;

    } catch (err) {

      console.log("Email verify failed:", err);

      return false;
    }
  };

  // ===============================
  // 🔥 UPDATE USER LOCALLY + REFRESH
  // ===============================
  const updateUserData = async (updatedFields = {}) => {

    // 🔥 instant UI update
    const updatedUser = {
      ...(user || {}),
      ...updatedFields,
    };

    setUser(updatedUser);

    // 🔥 fetch latest backend data
    await fetchUser();
  };

  // ===============================
  // 🔥 LOGOUT
  // ===============================
  const logout = async () => {

    try {

      await API.post("/auth/logout");

    } catch (err) {

      console.log("Logout API error:", err);
    }

    localStorage.removeItem("user");

    sessionStorage.removeItem("phone");
    sessionStorage.removeItem("email");

    localStorage.setItem("step", "splash");

    setPhoneState(null);
    setEmailState(null);
    setUserState(null);
  };

  return (
    <AuthContext.Provider
      value={{

        // 🔥 auth
        phone,
        setPhone,

        email,
        setEmail,

        // 🔥 user
        user,
        setUser,

        // 🔥 login
        verifyOtpAndLogin,
        verifyEmail,

        // 🔥 user refresh
        fetchUser,
        refreshUser,
        updateUserData,

        // 🔥 logout
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);