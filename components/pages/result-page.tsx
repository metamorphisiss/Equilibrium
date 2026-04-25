"use client";

import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";
import { SquircleCharacter } from "@/components/squircle-character";
import type { Session } from "@/lib/storage";
import { getMoodById } from "@/lib/moods";

interface LocationState {
  session: Session;
}

export function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  useEffect(() => {
    if (!state?.session) {
      navigate("/home", { replace: true });
      return;
    }

    try {
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch {
      // Haptics not supported
    }
  }, [state, navigate]);

  if (!state?.session) return null;

  const { session } = state;
  const mood = getMoodById(session.moodId);
  if (!mood) return null;

  const dateString = new Date(session.date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
      >
        <SquircleCharacter mood={mood} size={180} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-heading text-2xl font-bold text-[#111111] text-center mt-8 mb-6 max-w-xs"
      >
        {session.affirmation}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <NeoCard className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-lg text-[#111111]">
              {mood.label}
            </span>
            <span
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: session.colour, border: "1px solid #111111" }}
            />
          </div>
          <p className="font-sans text-sm text-[#666666] mb-3">{dateString}</p>
          <div className="font-mono text-xs text-[#888888]">
            V: {session.valence.toFixed(2)} &nbsp; A: {session.arousal.toFixed(2)}
          </div>
        </NeoCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="w-full max-w-sm mt-6 flex flex-col gap-3"
      >
        <NeoButton onClick={() => navigate("/home")} fullWidth>
          Go Home
        </NeoButton>
        <NeoButton onClick={() => navigate("/breathing")} variant="secondary" fullWidth>
          Start Breathing
        </NeoButton>
      </motion.div>
    </motion.div>
  );
}
