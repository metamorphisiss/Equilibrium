"use client";

import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const navItems = [
  { path: "/home", label: "Home", icon: HomeIcon },
  { path: "/breathing", label: "Breathe", icon: WindIcon },
  { path: "/calendar", label: "Calendar", icon: CalendarIcon },
  { path: "/settings", label: "Settings", icon: SettingsIcon },
];

export function DesktopNav() {
  return (
    <nav
      className="hidden md:flex items-center justify-between px-6 py-4"
      style={{
        backgroundColor: "#FFFBF0",
        borderBottom: "2px solid #111111",
      }}
    >
      <NavLink to="/home" className="font-heading text-xl font-bold text-[#111111]">
        Equilibrium
      </NavLink>
      <div className="flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `font-sans text-sm font-medium transition-colors ${
                isActive ? "text-[#111111]" : "text-[#666666] hover:text-[#111111]"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export function MobileNav() {
  const location = useLocation();

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-4 py-3"
      style={{
        backgroundColor: "#FFFBF0",
        borderTop: "2px solid #111111",
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className="flex flex-col items-center gap-1"
          >
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg"
              style={{
                backgroundColor: isActive ? "#A8E6CF" : "transparent",
              }}
            >
              <Icon active={isActive} />
            </motion.div>
          </NavLink>
        );
      })}
    </nav>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.5Z"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "#111111" : "none"}
      />
      <path
        d="M9 21V12H15V21"
        stroke={active ? "#FFFBF0" : "#111111"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WindIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M9.59 4.59A2 2 0 1 1 11 8H2M12.59 19.41A2 2 0 1 0 14 16H2M17.73 7.73A2.5 2.5 0 1 1 19 12H2"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "#111111" : "none"}
      />
    </svg>
  );
}

function CalendarIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="4"
        width="18"
        height="18"
        rx="2"
        stroke="#111111"
        strokeWidth="2"
        fill={active ? "#111111" : "none"}
      />
      <path
        d="M16 2V6M8 2V6M3 10H21"
        stroke={active ? "#FFFBF0" : "#111111"}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon({ active }: { active?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="3"
        stroke="#111111"
        strokeWidth="2"
        fill={active ? "#111111" : "none"}
      />
      <path
        d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
        stroke="#111111"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97, x: 4, y: 4 }}
      onClick={onClick}
      className="p-2"
      style={{ boxShadow: "none" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 12H5M12 19L5 12L12 5"
          stroke="#111111"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.button>
  );
}
