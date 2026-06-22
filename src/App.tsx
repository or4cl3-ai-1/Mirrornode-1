/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import LandingPage from "./components/LandingPage";
import LoadingScreen from "./components/LoadingScreen";
import OracleInterface from "./components/OracleInterface";

export default function App() {
  const [view, setView] = useState<"landing" | "loading" | "app">("landing");

  return (
    <div className="h-[100dvh] w-full bg-[#020202] flex justify-center overflow-hidden">
      {view === "landing" && <LandingPage onEnter={() => setView("loading")} />}
      {view === "loading" && <LoadingScreen onComplete={() => setView("app")} />}
      {view === "app" && <OracleInterface />}
    </div>
  );
}
