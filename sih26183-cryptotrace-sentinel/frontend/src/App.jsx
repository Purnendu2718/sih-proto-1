import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DotGridBackground from "./components/DotGridBackground";
import LandingPage from "./components/LandingPage";
import ConsoleWorkspace from "./components/ConsoleWorkspace";
import PublicLookupView from "./components/PublicLookupView";

function getRouteInfo() {
  const pathname = window.location.pathname || "/";
  const searchParams = new URLSearchParams(window.location.search);
  const isConsole = 
    pathname === "/console" || 
    pathname.endsWith("/console") || 
    pathname.endsWith("console.html") || 
    searchParams.get("page") === "console";
  const isLookup =
    pathname === "/lookup" ||
    pathname.endsWith("/lookup") ||
    pathname.endsWith("lookup.html") ||
    searchParams.get("page") === "lookup";

  return {
    view: isConsole ? "console" : (isLookup ? "lookup" : "landing"),
    address: searchParams.get("address") || "",
    chain: searchParams.get("chain") || "",
    caseId: searchParams.get("caseId") || searchParams.get("case_id") || "",
  };
}

export default function App() {
  const [route, setRoute] = useState(getRouteInfo);

  // Sync with browser history back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setRoute(getRouteInfo());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToConsole = (address = "", chain = "", caseId = "") => {
    const params = new URLSearchParams();
    if (address) params.set("address", address);
    if (chain) params.set("chain", chain);
    if (caseId) params.set("caseId", caseId);
    const queryString = params.toString();
    const newUrl = `/console${queryString ? `?${queryString}` : ""}`;
    
    window.history.pushState(null, "", newUrl);
    setRoute({
      view: "console",
      address,
      chain,
      caseId,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLookup = () => {
    window.history.pushState(null, "", "/lookup");
    setRoute({
      view: "lookup",
      address: "",
      chain: "",
      caseId: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateToLanding = () => {
    window.history.pushState(null, "", "/");
    setRoute({
      view: "landing",
      address: "",
      chain: "",
      caseId: "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full min-h-screen bg-[#08080a] text-zinc-100 overflow-x-hidden relative">
      {/* Background Dot Grid active on landing and lookup pages */}
      {(route.view === "landing" || route.view === "lookup") && <DotGridBackground />}

      {/* Main Viewport Container */}
      <div className="relative z-10 w-full h-full">
        <AnimatePresence mode="wait">
          {route.view === "lookup" ? (
            <motion.div
              key="lookup"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <PublicLookupView
                onBackToLanding={navigateToLanding}
                onLaunchConsole={navigateToConsole}
              />
            </motion.div>
          ) : route.view === "landing" ? (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <LandingPage 
                onLaunchConsole={navigateToConsole} 
                onStartInvestigation={navigateToConsole}
                onOpenLookup={navigateToLookup}
              />
            </motion.div>
          ) : (
            <motion.div
              key="console"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="w-screen h-screen overflow-hidden"
            >
              <ConsoleWorkspace 
                initialAddress={route.address}
                initialChain={route.chain}
                initialCaseId={route.caseId}
                onBackToLanding={navigateToLanding}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

