"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { NeoButton } from "@/components/neo-button";
import { SquircleCharacter } from "@/components/squircle-character";
import { addSession, type Session } from "@/lib/storage";
import type { Mood } from "@/lib/moods";

interface LocationState {
  mood: Mood;
  valence: number;
  arousal: number;
  answers: string[];
}

export function JournalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [journal, setJournal] = useState("");
  const MAX_LENGTH = 280;

  useEffect(() => {
    if (!state?.mood) {
      navigate("/quiz/mood", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.mood) return null;

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const handleComplete = () => {
    const session: Session = {
      id: Date.now(),
      date: today.toISOString().split("T")[0],
      moodId: state.mood.id,
      colour: state.mood.colour,
      valence: state.valence,
      arousal: state.arousal,
      answers: state.answers,
      journal: journal.trim(),
      affirmation: state.mood.affirmation,
    };

    addSession(session);

    navigate("/quiz/result", {
      state: { session },
    });
  };

  const charCount = journal.length;
  const isNearLimit = charCount >= 250;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="flex items-center px-4 py-3">
        <BackButton onClick={() => navigate(-1)} />
      </div>

      <div className="flex-1 px-4 pb-8 flex flex-col items-center">
        <SquircleCharacter mood={state.mood} size={140} />

        <h2 className="font-heading text-xl font-bold text-[#111111] mt-4">
          {state.mood.label}
        </h2>
        <p className="font-sans text-sm text-[#666666] mt-1">{dateString}</p>

        <p className="font-heading text-lg font-semibold text-[#111111] mt-8 mb-4 text-center">
          {state.mood.journalPrompt}
        </p>

        <div className="w-full relative">
          <textarea
            value={journal}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) {
                setJournal(e.target.value);
              }
            }}
            placeholder="Write your thoughts..."
            className="font-sans w-full h-40 px-4 py-3 bg-[#FFFBF0] text-[#111111] placeholder-[#999999] outline-none resize-none"
            style={{
              borderRadius: "16px",
              border: "2px solid #111111",
              boxShadow: "4px 4px 0px #111111",
            }}
          />
          <span
            className="absolute bottom-3 right-3 font-mono text-xs"
            style={{
              color: isNearLimit ? "#FF8C69" : "#999999",
            }}
          >
            {charCount} / {MAX_LENGTH}
          </span>
        </div>

        <div className="w-full mt-6">
          <NeoButton onClick={handleComplete} fullWidth>
            Complete Session
          </NeoButton>
        </div>
      </div>
    </motion.div>
  );
}
