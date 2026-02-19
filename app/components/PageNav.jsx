"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";

const BTN_CLASS =
  "px-5 py-1.5 text-sm font-semibold tracking-wide uppercase rounded-full border border-purple-400/50 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white shadow-lg shadow-purple-600/40 hover:from-violet-500 hover:via-purple-400 hover:to-fuchsia-400 hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-300";

const BTN_MOBILE_CLASS =
  "px-4 py-2 text-sm font-semibold tracking-wide uppercase text-center rounded-full border border-purple-400/50 bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 text-white shadow-md shadow-purple-600/30 active:scale-95 transition-all duration-300";

function NavButton({ btn, className, onAfterClick }) {
  const iconClass = btn.icon ? "flex items-center gap-1.5" : "";
  const Icon = btn.icon;

  if (btn.href) {
    return (
      <Link
        href={btn.href}
        className={`${className} ${iconClass}`}
        onClick={onAfterClick}
      >
        {Icon && <Icon size={14} />}
        {btn.label}
      </Link>
    );
  }

  return (
    <button
      onClick={(e) => {
        onAfterClick?.();
        btn.onClick?.(e);
      }}
      className={`${className} ${iconClass}`}
    >
      {Icon && <Icon size={14} />}
      {btn.label}
    </button>
  );
}

export default function PageNav({
  titleHref,
  centerTitle = false,
  leftButton = null,
  buttons = [],
  showLogout = false,
  onBeforeLogout = null,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      if (onBeforeLogout) await onBeforeLogout();
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      router.replace("/");
    }
  };

  const allButtons = [...buttons];
  if (showLogout) {
    allButtons.push({ label: "Logout", onClick: handleLogout });
  }

  const showMobileMenu = !centerTitle && allButtons.length > 1;

  if (centerTitle) {
    return (
      <nav
        className="flex justify-between items-center px-3 sm:px-8 py-2 sm:py-3 navbar"
        style={{ backgroundColor: "#232b38" }}
      >
        {leftButton ? (
          <NavButton btn={leftButton} className={BTN_CLASS} />
        ) : (
          <div style={{ flex: 0.4 }} />
        )}
        <Link
          className="absolute left-1/2 transform -translate-x-1/2 font-bold page-title text-sm sm:text-base"
          href={titleHref}
        >
          HYBE Food & Drinks
        </Link>
        <div className="flex gap-3">
          {allButtons.map((btn, i) => (
            <NavButton key={i} btn={btn} className={BTN_CLASS} />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="navbar px-3 sm:px-8 py-2 sm:py-3"
      style={{ backgroundColor: "#232b38" }}
    >
      <div className="flex items-center relative">
        {/* Title: left-aligned on mobile */}
        <Link
          className="font-bold page-title text-sm sm:text-base truncate md:hidden"
          href={titleHref}
        >
          HYBE Food & Drinks
        </Link>
        {/* Title: centered on desktop */}
        <Link
          className="hidden md:block absolute left-1/2 -translate-x-1/2 font-bold page-title text-base whitespace-nowrap"
          href={titleHref}
        >
          HYBE Food & Drinks
        </Link>

        {showMobileMenu ? (
          <>
            <div className="hidden sm:flex gap-3 ml-auto">
              {allButtons.map((btn, i) => (
                <NavButton key={i} btn={btn} className={BTN_CLASS} />
              ))}
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden text-gray-200 p-1 ml-auto"
            >
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </>
        ) : (
          <div className="flex gap-3 ml-auto">
            {allButtons.map((btn, i) => (
              <NavButton
                key={i}
                btn={btn}
                className={`shrink-0 ${BTN_CLASS}`}
              />
            ))}
          </div>
        )}
      </div>

      {showMobileMenu && menuOpen && (
        <div className="sm:hidden flex flex-col gap-2 pt-2 mt-2 border-t border-gray-700">
          {allButtons.map((btn, i) => (
            <NavButton
              key={i}
              btn={btn}
              className={BTN_MOBILE_CLASS}
              onAfterClick={() => setMenuOpen(false)}
            />
          ))}
        </div>
      )}
    </nav>
  );
}
