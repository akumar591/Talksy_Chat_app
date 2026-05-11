import { Navigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function ProtectedRoute({
  children,
}) {

  const {
    user,
    authLoading,
  } = useAuth();

  // =====================================
  // 🔥 CURRENT STEP
  // =====================================
  const step =
    localStorage.getItem(
      "step"
    );

  // =====================================
  // 🔥 WAIT AUTH
  // =====================================
  if (authLoading) {

    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0f1a] text-white">

        Loading...

      </div>
    );
  }

  // =====================================
  // 🔥 ALLOW AUTH FLOW
  // =====================================
  // login
  // otp
  // profile setup
  // should work without user
  if (
    step === "login" ||
    step === "otp" ||
    step === "profile"
  ) {

    return children;
  }

  // =====================================
  // 🔥 NOT LOGGED IN
  // =====================================
  if (!user) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // =====================================
  // 🔥 AUTHORIZED
  // =====================================
  return children;
}

export default ProtectedRoute;