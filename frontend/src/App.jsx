import Navbar from "./components/Navbar";

import Settings from "./components/Settings/Settings";
import Splash from "./components/Splash";
import Onboarding from "./components/Onboarding";

import Login from "./components/Auth/Login";
import OTP from "./components/Auth/OTP";
import ProfileSetup from "./components/Auth/ProfileSetup";

import Profile from "./components/Profile/Profile";

// SETTINGS
import Privacy from "./components/Settings/Privacy";
import Security from "./components/Settings/Security";
import ChatsSettings from "./components/Settings/ChatsSettings";
import Notifications from "./components/Settings/Notifications";
import Storage from "./components/Settings/Storage";
import TwoStep from "./components/Settings/TwoStep";
import Help from "./components/Settings/Help";
import ChangeNumber from "./components/Settings/ChangeNumber";
import LinkedDevices from "./components/Settings/LinkedDevices";

// CHAT
import ChatLayout from "./components/Chat/ChatLayout";
import NewChat from "./components/Chat/NewChat";
import GroupInfo from "./components/Chat/GroupInfo";

// STATUS & CALL
import StatusLayout from "./components/Status/StatusLayout";
import CallLayout from "./components/Call/CallLayout";

import { ThemeProvider } from "./context/ThemeContext";

import {
  AuthProvider,
  useAuth,
} from "./context/AuthContext";

import { SettingsProvider } from "./context/SettingsContext";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import UserProfile from "./components/User/UserProfile";

import NewGroup from "./components/Chat/NewGroup";

import SettingsDrawer from "./components/Settings/SettingsDrawer";

import { Toaster } from "react-hot-toast";

import { ChatProvider } from "./context/ChatContext";

import ProtectedRoute from "./components/ProtectedRoute";

import { GroupProvider } from "./context/GroupContext";
import { StatusProvider } from "./context/StatusContext";

// =====================================
// 🔥 VALID STEPS
// =====================================
const VALID_STEPS = [
  "splash",
  "onboarding",
  "login",
  "otp",
  "profile",
  "app",
];

function AppRoutes() {

  const {
    user,
    authLoading,
  } = useAuth();

  // =====================================
  // 🔥 INITIAL STEP
  // =====================================
  const getInitialStep =
    () => {

      const seenSplash =
        localStorage.getItem(
          "seenSplash"
        );

      const savedStep =
        localStorage.getItem(
          "step"
        );

      // 🔥 FIRST APP OPEN
      if (!seenSplash) {

        return "splash";
      }

      // 🔥 VALID STEP RESTORE
      if (
        VALID_STEPS.includes(
          savedStep
        )
      ) {

        return savedStep;
      }

      // 🔥 DEFAULT
      return "onboarding";
    };

  // =====================================
  // 🔥 STEP STATE
  // =====================================
  const [step, setStep] =
    useState(
      getInitialStep
    );

  // =====================================
  // 🔥 MOUNT SAFETY
  // =====================================
  const mountedRef =
    useRef(false);

  // =====================================
  // 🔥 UPDATE STEP
  // =====================================
  const updateStep = (
    newStep
  ) => {

    // 🔥 invalid safety
    if (
      !VALID_STEPS.includes(
        newStep
      )
    ) {

      return;
    }

    // 🔥 save instantly
    localStorage.setItem(
      "step",
      newStep
    );

    setStep(newStep);
  };

  // =====================================
  // 🔥 BODY BG
  // =====================================
  useEffect(() => {

    document.body.style.background =
      "var(--bg)";

  }, []);

  // =====================================
  // 🔥 STEP SYNC
  // =====================================
  useEffect(() => {

    if (
      !mountedRef.current
    ) {

      mountedRef.current =
        true;
    }

    // 🔥 keep localStorage synced
    localStorage.setItem(
      "step",
      step
    );

  }, [step]);

  // =====================================
  // 🔥 REFRESH SAFETY
  // =====================================
  useEffect(() => {

    const handleBeforeUnload =
      () => {

        localStorage.setItem(
          "step",
          step
        );
      };

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    );

    return () => {

      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      );
    };

  }, [step]);

  // =====================================
  // 🔥 AUTO APP RESTORE
  // =====================================
  useEffect(() => {

    // 🔥 wait auth restore
    if (authLoading)
      return;

    // 🔥 DON'T FORCE APP
    // while auth flow active
    if (
      step === "otp" ||
      step === "profile"
    ) {

      return;
    }

    // 🔥 restore app only
    if (
      user &&
      step !== "app"
    ) {

      updateStep("app");
    }

  }, [
    user,
    authLoading,
    step,
  ]);

  // =====================================
  // 🔥 LOADING
  // =====================================
  if (authLoading) {

    return (
      <div
        className="
          h-screen
          flex
          items-center
          justify-center
          bg-[#0b0f1a]
          text-white
        "
      >
        Loading...
      </div>
    );
  }

  // =====================================
  // 🔥 SPLASH
  // =====================================
  if (step === "splash") {

    return (
      <>
        <Toaster position="top-center" />

        <Splash
          onFinish={() => {

            // 🔥 mark splash seen
            localStorage.setItem(
              "seenSplash",
              "true"
            );

            // 🔥 already logged in
            if (user) {

              updateStep(
                "app"
              );

              return;
            }

            // 🔥 restore old flow
            const savedStep =
              localStorage.getItem(
                "step"
              );

            if (
              savedStep &&
              savedStep !==
              "splash" &&
              VALID_STEPS.includes(
                savedStep
              )
            ) {

              updateStep(
                savedStep
              );

              return;
            }

            // 🔥 new user
            updateStep(
              "onboarding"
            );

          }}
        />
      </>
    );
  }

  // =====================================
  // 🔥 ONBOARDING
  // =====================================
  if (
    step ===
    "onboarding"
  ) {

    return (
      <>
        <Toaster position="top-center" />

        <Onboarding
          onFinish={() => {

            updateStep(
              "login"
            );

          }}
        />
      </>
    );
  }

  // =====================================
  // 🔥 LOGIN
  // =====================================
  if (
    step === "login"
  ) {

    return (
      <>
        <Toaster position="top-center" />

        <Login
          onLogin={() => {

            updateStep(
              "otp"
            );

          }}
        />
      </>
    );
  }

  // =====================================
  // 🔥 OTP
  // =====================================
  if (
    step === "otp"
  ) {

    return (
      <>
        <Toaster position="top-center" />

        <OTP
          onVerify={(
            nextStep
          ) => {

            if (
              !nextStep
            )
              return;

            updateStep(
              nextStep
            );

          }}
        />
      </>
    );
  }

  // =====================================
  // 🔥 PROFILE SETUP
  // =====================================
  if (
    step ===
    "profile"
  ) {

    return (
      <>
        <Toaster position="top-center" />

        <ProfileSetup
          onComplete={() => {

            updateStep(
              "app"
            );

          }}
        />
      </>
    );
  }

  // =====================================
  // 🔥 MAIN APP
  // =====================================
  return (
    <>
      <Toaster position="top-center" />

      <ProtectedRoute>

        {/* 🔥 NAVBAR */}
        <Navbar />

        <Routes>

          {/* ================= CHAT ================= */}

          <Route
            path="/"
            element={<ChatLayout />}
          />

          <Route
            path="/chat/:id"
            element={<ChatLayout />}
          />

          <Route
            path="/group/:id"
            element={<ChatLayout />}
          />

          <Route
            path="/new-chat"
            element={<NewChat />}
          />

          <Route
            path="/new-group"
            element={<NewGroup />}
          />

          <Route
            path="/group-info/:id"
            element={<GroupInfo />}
          />

          {/* ================= USER ================= */}

          <Route
            path="/user/:id"
            element={<UserProfile />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

          {/* ================= SETTINGS ================= */}

          <Route
            path="/settings"
            element={<Settings />}
          />

          <Route
            path="/settings/privacy"
            element={<Privacy />}
          />

          <Route
            path="/settings/security"
            element={<Security />}
          />

          <Route
            path="/settings/chats"
            element={<ChatsSettings />}
          />

          <Route
            path="/settings/notifications"
            element={<Notifications />}
          />

          <Route
            path="/settings/storage"
            element={<Storage />}
          />

          <Route
            path="/settings/two-step"
            element={<TwoStep />}
          />

          <Route
            path="/settings/help"
            element={<Help />}
          />

          <Route
            path="/settings/change-number"
            element={<ChangeNumber />}
          />

          <Route
            path="/linked-devices"
            element={<LinkedDevices />}
          />

          <Route
            path="/settings/theme-drawer"
            element={<SettingsDrawer />}
          />

          {/* ================= GROUPS ================= */}

          <Route
            path="/groups"
            element={<ChatLayout />}
          />

          {/* ================= COMMUNITY ================= */}

          <Route
            path="/community"
            element={<ChatLayout />}
          />

          <Route
            path="/community/:id"
            element={<ChatLayout />}
          />

          {/* ================= STATUS ================= */}

          <Route
            path="/status"
            element={<StatusLayout />}
          />

          {/* ================= CALL ================= */}

          <Route
            path="/call"
            element={<CallLayout />}
          />

          {/* ================= INVALID ================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>

      </ProtectedRoute>
    </>
  );
}

function App() {

  return (
    <AuthProvider>

      <ChatProvider>

        <GroupProvider>

          <StatusProvider>

            <ThemeProvider>

              <SettingsProvider>

                <BrowserRouter>

                  <AppRoutes />

                </BrowserRouter>

              </SettingsProvider>

            </ThemeProvider>

          </StatusProvider>

        </GroupProvider>

      </ChatProvider>

    </AuthProvider>
  );
}

export default App;