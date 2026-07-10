/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import OracleInterface from "./components/OracleInterface";
import AuthScreen from "./components/AuthScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function MainApp() {
  const [view, setView] = useState<"landing" | "loading" | "auth" | "app">("landing");
  const { user } = useAuth();

  const handleLandingEnter = () => {
    if (user) {
      setView("loading");
    } else {
      setView("auth");
    }
  };

  const handleAuthComplete = () => {
    setView("loading");
  };

  return (
    <div className="h-[100dvh] w-full bg-[#020202] flex justify-center overflow-hidden">
      {view === "landing" && <LandingPage onEnter={handleLandingEnter} />}
      {view === "auth" && <AuthScreen onComplete={handleAuthComplete} />}
      {view === "loading" && <LoadingScreen onComplete={() => setView("app")} />}
      {view === "app" && <OracleInterface />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
