import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";

import API from "../api/axios";

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  // ===============================
  // 🔥 INIT REF
  // ===============================
  const initializedRef =
    useRef(false);

  // ===============================
  // 🔥 PHONE
  // ===============================
  const [phone, setPhoneState] =
    useState(() => {

      return (
        sessionStorage.getItem(
          "phone"
        ) || null
      );
    });

  const setPhone = (
    newPhone
  ) => {

    if (!newPhone) {

      sessionStorage.removeItem(
        "phone"
      );

      setPhoneState(null);

      return;
    }

    sessionStorage.setItem(
      "phone",
      newPhone
    );

    setPhoneState(
      newPhone
    );
  };

  // ===============================
  // 🔥 EMAIL
  // ===============================
  const [email, setEmailState] =
    useState(() => {

      return (
        sessionStorage.getItem(
          "email"
        ) || null
      );
    });

  const setEmail = (
    newEmail
  ) => {

    if (!newEmail) {

      sessionStorage.removeItem(
        "email"
      );

      setEmailState(null);

      return;
    }

    sessionStorage.setItem(
      "email",
      newEmail
    );

    setEmailState(
      newEmail
    );
  };

  // ===============================
  // 🔥 USER
  // ===============================
  const [user, setUserState] =
    useState(null);

  // ===============================
  // 🔥 AUTH LOADING
  // ===============================
  const [authLoading, setAuthLoading] =
    useState(true);

  // ===============================
  // 🔥 UPDATE USER
  // ===============================
  const setUser = (
    newUser
  ) => {

    setUserState(
      newUser || null
    );
  };

  // ===============================
  // 🔥 FETCH USER
  // ===============================
  const fetchUser =
    useCallback(
      async () => {

        try {

          const res =
            await API.get(
              "/users/me",
              {
                withCredentials: true,
              }
            );

          // 🔥 valid user
          if (
            res?.data?.data
          ) {

            setUser(
              res.data.data
            );

            // 🔥 logged in
            localStorage.setItem(
              "step",
              "app"
            );

            return res.data.data;
          }

          setUser(null);

          return null;

        } catch (err) {

          // 🔥 ignore 401
          if (
            err.response
              ?.status !== 401
          ) {

            console.log(
              "Fetch user failed:",
              err
            );
          }

          setUser(null);

          return null;
        }
      },
      []
    );

  // ===============================
  // 🔥 AUTO LOGIN
  // ===============================
  useEffect(() => {

    // 🔥 strict mode safety
    if (
      initializedRef.current
    ) {

      return;
    }

    initializedRef.current =
      true;

    const initAuth =
      async () => {

        try {

          await fetchUser();

        } finally {

          setAuthLoading(
            false
          );
        }
      };

    initAuth();

  }, [fetchUser]);

  // ===============================
  // 🔥 REFRESH USER
  // ===============================
  const refreshUser =
    async () => {

      return await fetchUser();
    };

  // ===============================
  // 🔥 VERIFY OTP
  // ===============================
  const verifyOtpAndLogin =
    async (otp) => {

      try {

        await API.post(
          "/auth/verify-otp",
          {
            phone,
            otp,
          },
          {
            withCredentials: true,
          }
        );

        // 🔥 latest user
        const latestUser =
          await fetchUser();

        // 🔥 clear temp session
        sessionStorage.removeItem(
          "phone"
        );

        sessionStorage.removeItem(
          "email"
        );

        setPhoneState(
          null
        );

        setEmailState(
          null
        );

        // 🔥 next flow
        localStorage.setItem(
          "step",
          "profile"
        );

        return latestUser;

      } catch (err) {

        console.log(
          "OTP failed:",
          err
        );

        return null;
      }
    };

  // ===============================
  // 🔥 VERIFY EMAIL
  // ===============================
  const verifyEmail =
    async (otp) => {

      try {

        await API.post(
          "/auth/verify-email",
          {
            phone,
            email,
            otp,
          }
        );

        // 🔥 latest profile
        await fetchUser();

        sessionStorage.removeItem(
          "email"
        );

        setEmailState(
          null
        );

        return true;

      } catch (err) {

        console.log(
          "Email verify failed:",
          err
        );

        return false;
      }
    };

  // ===============================
  // 🔥 UPDATE USER
  // ===============================
  const updateUserData =
    async (
      updatedFields = {}
    ) => {

      // 🔥 instant ui
      const updatedUser =
        {
          ...(user || {}),
          ...updatedFields,
        };

      setUser(
        updatedUser
      );

      // 🔥 backend sync
      await fetchUser();
    };

  // ===============================
  // 🔥 LOGOUT
  // ===============================
  const logout =
    async () => {

      try {

        await API.post(
          "/auth/logout",
          {},
          {
            withCredentials: true,
          }
        );

      } catch (err) {

        console.log(
          "Logout API error:",
          err
        );
      }

      // 🔥 clear sessions
      sessionStorage.removeItem(
        "phone"
      );

      sessionStorage.removeItem(
        "email"
      );

      // 🔥 clear splash
      localStorage.removeItem(
        "seenSplash"
      );

      // 🔥 reset flow
      localStorage.setItem(
        "step",
        "splash"
      );

      // 🔥 clear states
      setPhoneState(
        null
      );

      setEmailState(
        null
      );

      setUserState(
        null
      );

      // 🔥 refresh safely
      window.location.href =
        "/";
    };

  return (
    <AuthContext.Provider
      value={{
        // 🔥 phone
        phone,
        setPhone,

        // 🔥 email
        email,
        setEmail,

        // 🔥 user
        user,
        setUser,

        // 🔥 loading
        authLoading,

        // 🔥 auth
        verifyOtpAndLogin,
        verifyEmail,

        // 🔥 refresh
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

export const useAuth =
  () =>
    useContext(
      AuthContext
    );