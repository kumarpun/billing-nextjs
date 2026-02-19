"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

export default function TopNav({ isSidebarCollapsed, toggleSidebar }) {
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleTablesClick = () => {
    setIsNavigating(true);
    router.push("/dashboard");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-8 py-2 sm:py-3" style={{ backgroundColor: "#232b38" }}>
      <div className="flex items-center relative">
        {/* Left: hamburger (mobile only) */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 md:w-auto">
          <button
            onClick={toggleSidebar}
            className="text-gray-200 p-1 shrink-0 md:hidden"
            aria-label={isSidebarCollapsed ? "Open sidebar" : "Close sidebar"}
          >
            {isSidebarCollapsed ? <FiMenu size={22} /> : <FiX size={22} />}
          </button>
          {/* Title: left-aligned on mobile, centered on desktop */}
          <Link className="font-bold page-title text-sm sm:text-base truncate md:hidden" href="/dashboard">
            HYBE Food & Drinks
          </Link>
        </div>
        {/* Center: title on desktop */}
        <Link className="hidden md:block absolute left-1/2 -translate-x-1/2 font-bold page-title text-base whitespace-nowrap" href="/dashboard">
          HYBE Food & Drinks
        </Link>
        {/* Right: Tables button */}
        <button
          onClick={handleTablesClick}
          disabled={isNavigating}
          className="shrink-0 ml-auto px-5 py-1.5 text-sm font-semibold tracking-wide uppercase rounded-full border border-purple-400/50 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-600/40 hover:from-violet-500 hover:via-purple-400 hover:to-fuchsia-400 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-80 disabled:hover:scale-100"
        >
          {isNavigating ? (
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Loading
            </span>
          ) : (
            "Tables"
          )}
        </button>
      </div>
    </nav>
  );
}
