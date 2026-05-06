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

// STATUS & CALL
import StatusLayout from "./components/Status/StatusLayout";
import CallLayout from "./components/Call/CallLayout";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext"; // 🔥 NEW

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import UserProfile from "./components/User/UserProfile";
import NewGroup from "./components/Chat/NewGroup";
import SettingsDrawer from "./components/Settings/SettingsDrawer";

import { Toaster } from "react-hot-toast";
import { ChatProvider } from "./context/ChatContext";

function App() {

  // ✅ SAFE INITIAL LOAD (NO FLASH, NO RESET)
  const [step, setStep] = useState(() => {
    return localStorage.getItem("step") || "splash";
  });

  // ✅ CENTRAL STEP UPDATE
  const updateStep = (newStep) => {
    localStorage.setItem("step", newStep);
    setStep(newStep);
  };

  // 🔥 SPLASH
  if (step === "splash") {
    return (
      <>
        <Toaster position="top-center" />
        <Splash onFinish={() => updateStep("onboarding")} />
      </>
    );
  }

  // 🔥 ONBOARDING
  if (step === "onboarding") {
    return (
      <>
        <Toaster position="top-center" />
        <Onboarding onFinish={() => updateStep("login")} />
      </>
    );
  }

  // 🔥 LOGIN
  if (step === "login") {
    return (
      <>
        <Toaster position="top-center" />
        <Login onLogin={() => updateStep("otp")} />
      </>
    );
  }

  // 🔥 OTP
  if (step === "otp") {
    return (
      <>
        <Toaster position="top-center" />
        <OTP onVerify={() => updateStep("profile")} />
      </>
    );
  }

  // 🔥 PROFILE
  if (step === "profile") {
    return (
      <>
        <Toaster position="top-center" />
        <ProfileSetup onComplete={() => updateStep("app")} />
      </>
    );
  }

  // 🔥 MAIN APP
  return (
    <AuthProvider>
      <ChatProvider>
      <ThemeProvider>
        <SettingsProvider> {/* 🔥 NEW WRAP (IMPORTANT) */}
          <BrowserRouter>

            <Toaster position="top-center" />
            <Navbar />

            <Routes>
              <Route path="/" element={<ChatLayout />} />
              <Route path="/chat/:id" element={<ChatLayout />} />
              <Route path="/new-chat" element={<NewChat />} />
              <Route path="/new-group" element={<NewGroup />} />

              <Route path="/user/:id" element={<UserProfile />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/settings" element={<Settings />} />

              <Route path="/settings/privacy" element={<Privacy />} />
              <Route path="/settings/security" element={<Security />} />
              <Route path="/settings/chats" element={<ChatsSettings />} />
              <Route path="/settings/notifications" element={<Notifications />} />
              <Route path="/settings/storage" element={<Storage />} />
              <Route path="/settings/two-step" element={<TwoStep />} />
              <Route path="/settings/help" element={<Help />} />
              <Route path="/settings/change-number" element={<ChangeNumber />} />
              <Route path="/linked-devices" element={<LinkedDevices />} />

              {/* 🔥 Drawer route */}
              <Route path="/settings/theme-drawer" element={<SettingsDrawer />} />

              <Route path="/groups" element={<ChatLayout />} />
              <Route path="/groups/:id" element={<ChatLayout />} />

              <Route path="/community" element={<ChatLayout />} />
              <Route path="/community/:id" element={<ChatLayout />} />

              <Route path="/status" element={<StatusLayout />} />
              <Route path="/call" element={<CallLayout />} />
            </Routes>

          </BrowserRouter>
        </SettingsProvider>
      </ThemeProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;