"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { NeoCard } from "@/components/neo-card";
import { NeoChip } from "@/components/neo-button";
import { NeoButton } from "@/components/neo-button";
import { getUser, getSessions, initializeSessions, calculateStreak, type Session } from "@/lib/storage";
import { MOODS, type MoodId } from "@/lib/moods";
import { LogoLoop } from "@/components/logo-loop";
import dynamic from "next/dynamic";

const Ballpit = dynamic(() => import("@/components/ballpit").then((mod) => mod.Ballpit), { ssr: false });

const AFFIRMATIONS = [
  "You are capable of amazing things.",
  "Every day is a fresh start.",
  "Your potential is limitless.",
  "Embrace the journey, not just the destination.",
  "You are stronger than you think.",
  "Small steps lead to big changes.",
  "Trust the process.",
  "You deserve to be happy."
];

const RIPPLE_COLORS = [
  "#C9B8FF", // pastel purple (default)
  "#FFCDD2", // pastel red
  "#A8E6CF", // pastel green
  "#F8E8A6", // pastel yellow
  "#A2C8F3", // pastel blue
  "#FFD3B6", // peach
];

export function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);

  // Ripple effect state
  const [baseColor, setBaseColor] = useState(RIPPLE_COLORS[0]);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; color: string }[]>([]);

  const handleAffirmationClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const nextColorIndex = (currentColorIndex + 1) % RIPPLE_COLORS.length;
    const nextColor = RIPPLE_COLORS[nextColorIndex];

    const newRipple = { id: Date.now(), x, y, color: nextColor };

    setRipples((prev) => [...prev, newRipple]);
    setCurrentColorIndex(nextColorIndex);
    setCurrentAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);

    // After animation completes, update base color and remove ripple
    setTimeout(() => {
      setBaseColor(nextColor);
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 800);
  };

  useEffect(() => {
    const userData = getUser();
    if (!userData) {
      navigate("/", { replace: true });
      return;
    }
    setUser(userData);

    initializeSessions();
    const sessionsData = getSessions();
    setSessions(sessionsData);
    setStreak(calculateStreak(sessionsData));

    const interval = setInterval(() => {
      setCurrentAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  const getStressLevel = () => {
    if (sessions.length === 0) return { label: "Unknown", value: 50 };
    const latest = sessions[0];
    if (latest.arousal > 0.5) return { label: "Elevated", value: 80 };
    if (latest.arousal >= 0) return { label: "Moderate", value: 50 };
    return { label: "Low", value: 25 };
  };

  const stressLevel = getStressLevel();

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pb-24 md:pb-8"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-2xl font-bold text-[#111111]">
            Hey, {user.name}
          </h1>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/settings")}
            className="p-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="3" stroke="#111111" strokeWidth="2" />
              <path
                d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22"
                stroke="#111111"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </motion.button>
        </div>

        <NeoCard className="mb-4 relative overflow-hidden shadow-[4px_4px_0px_#111111] h-[300px] p-0" colour="#FFFFFF">
          {/* Top Caption - Foreground with Pop Animations & Background */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.5, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: "spring",
              damping: 15,
              stiffness: 300,
              delay: 0.2
            }}
            className="absolute inset-x-0 top-8 flex flex-col items-center pointer-events-none select-none z-20"
          >
            <div className="bg-white px-6 py-4 rounded-2xl border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col items-center">
              <motion.h2 
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  ease: "anticipate" 
                }}
                className="font-heading text-4xl font-black text-[#111111] leading-none"
              >
                Equilibrium
              </motion.h2>
              <motion.p 
                className="font-sans text-[10px] font-bold text-[#111111] uppercase tracking-[0.4em] mt-2"
              >
                Your Wellness Journey
              </motion.p>
            </div>
          </motion.div>
          <Ballpit
            count={10}
            colors={['#FF8C69', '#FFE566', '#A8E6CF', '#C9B8FF', '#FFB8D4']}
          />
        </NeoCard>

        <NeoCard className="p-5 mb-4" colour="#FFFFFF">
          <h3 className="font-heading text-base font-bold text-[#111111] mb-3">
            Daily Check-in
          </h3>
          <NeoButton
            onClick={() => navigate("/quiz/mood")}
            fullWidth
          >
            Log today&apos;s mood
          </NeoButton>
        </NeoCard>

        <NeoCard
          className="p-5 mb-4 relative overflow-hidden group cursor-pointer"
          colour={baseColor}
          onClick={handleAffirmationClick}
        >
          {/* Expanding click-origin ripples */}
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                initial={{ width: 0, height: 0, opacity: 1 }}
                animate={{ width: 1200, height: 1200, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute rounded-full pointer-events-none"
                style={{
                  backgroundColor: ripple.color,
                  left: ripple.x,
                  top: ripple.y,
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                }}
              />
            ))}
          </AnimatePresence>

          {/* Content layer (z-10 to sit above ripples) */}
          <div className="relative z-10 pointer-events-none">
            <h2 className="font-heading text-lg font-bold text-[#111111] mb-2 flex items-center gap-2">
              Daily Affirmation
            </h2>
            <div className="h-24 flex items-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={currentAffirmationIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="font-sans text-[22px] font-black text-[#111111] leading-tight"
                >
                  "{AFFIRMATIONS[currentAffirmationIndex]}"
                </motion.p>
              </AnimatePresence>
            </div>
            <p className="text-xs font-sans font-bold text-[#666666] uppercase tracking-widest mt-2 flex justify-end">
              Tap for another →
            </p>
          </div>
        </NeoCard>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <NeoCard className="p-4">
            <p className="font-sans text-xs text-[#666666] mb-1">Sleep</p>
            <p className="font-mono text-xl font-bold text-[#111111]">7h 20m</p>
          </NeoCard>

          <NeoCard className="p-4">
            <p className="font-sans text-xs text-[#666666] mb-1">Stress</p>
            <p className="font-heading text-lg font-bold text-[#111111] mb-2">
              {stressLevel.label}
            </p>
            <div
              className="h-2 w-full"
              style={{
                backgroundColor: "#E5E5E5",
                borderRadius: "4px",
              }}
            >
              <div
                className="h-full transition-all duration-300"
                style={{
                  width: `${stressLevel.value}%`,
                  backgroundColor: stressLevel.value > 60 ? "#FF8C69" : stressLevel.value > 40 ? "#FFE566" : "#A8E6CF",
                  borderRadius: "4px",
                }}
              />
            </div>
          </NeoCard>
        </div>


        <NeoCard className="p-5" colour="#FFE566">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="font-mono text-4xl font-bold text-[#111111]">
                {streak}
              </p>
              <p className="font-sans text-sm text-[#111111]">day streak</p>
            </div>
            <div className="w-16 h-16 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 5C20 5 25 12 25 20C25 28 20 35 20 35C20 35 15 28 15 20C15 12 20 5 20 5Z"
                  fill="#FF8C69"
                  stroke="#111111"
                  strokeWidth="2"
                />
                <path
                  d="M10 15C10 15 15 18 20 20C25 22 30 25 30 25"
                  stroke="#111111"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </NeoCard>
      </div>
    </motion.div>
  );
}
