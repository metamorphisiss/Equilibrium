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

const AFFIRMATIONS = [
  "You are capable of amazing things.",
  "Every day is a fresh start.",
  "You are stronger than you think.",
  "Trust the process and yourself.",
  "Progress, not perfection.",
  "Breathe in courage, exhale doubt.",
  "Your potential is endless.",
];

export function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [streak, setStreak] = useState(0);
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);

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

        <LogoLoop />

        <NeoCard className="p-5 mb-4 mt-6" colour="#FFFFFF">
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
          colour="#C9B8FF"
          onClick={() => setCurrentAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length)}
        >
          {/* Moving animated background elements */}
          <motion.div 
            animate={{ 
              x: [0, -30, 20, 0], 
              y: [0, 20, -30, 0],
              scale: [1, 1.2, 0.9, 1]
            }} 
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-10 -right-10 w-40 h-40 bg-[#FFCDD2] rounded-full opacity-60 blur-2xl pointer-events-none"
          />
          <motion.div 
            animate={{ 
              x: [0, 40, -20, 0], 
              y: [0, -40, 30, 0],
              scale: [1, 1.4, 0.8, 1]
            }} 
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-10 -left-10 w-40 h-40 bg-[#A8E6CF] rounded-full opacity-50 blur-2xl pointer-events-none"
          />
          <motion.div 
            animate={{ 
              x: [0, -20, 40, 0], 
              y: [0, 30, -20, 0],
              scale: [0.8, 1.1, 1, 0.8]
            }} 
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-[#FFE566] rounded-full opacity-40 blur-xl pointer-events-none"
          />
          <h2 className="font-heading text-lg font-bold text-[#111111] mb-2 relative z-10 flex items-center gap-2">
            <span className="text-xl">✨</span> Daily Affirmation
          </h2>
          <div className="h-24 flex items-center relative z-10">
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
          <p className="font-sans text-[10px] text-[#444444] font-bold uppercase tracking-widest absolute bottom-4 right-5 opacity-50">
            Tap to refresh
          </p>
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
