"use client";

import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { X } from "lucide-react";
import { MOODS, type Mood, type MoodId } from "@/lib/moods";

import { SquircleCharacter } from "@/components/squircle-character";

// ─── Waveform config per mood ─────────────────────────────────────────────────
const WAVEFORM_PROFILES: Record<MoodId, number[]> = {
  happy: [0.2, 0.4, 0.6, 0.75, 0.9, 1.0, 0.9, 0.75, 0.6, 0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4, 0.3, 0.5, 0.7, 0.9, 1.0, 0.9, 0.7, 0.5, 0.3],
  calm: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.65, 0.6, 0.55, 0.6, 0.65, 0.7, 0.65, 0.6, 0.55, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.5, 0.4, 0.2],
  anxious: [0.9, 0.3, 0.8, 0.2, 1.0, 0.3, 0.9, 0.4, 0.7, 0.2, 1.0, 0.5, 0.8, 0.3, 1.0, 0.4, 0.6, 0.2, 0.9, 0.5, 0.7, 0.3, 1.0, 0.4, 0.8],
  frustrated: [0.7, 0.9, 0.5, 1.0, 0.6, 0.8, 0.4, 1.0, 0.7, 0.5, 0.9, 0.6, 1.0, 0.8, 0.5, 0.7, 0.9, 0.4, 1.0, 0.6, 0.8, 0.5, 0.9, 0.7, 0.4],
  lonely: [0.3, 0.2, 0.4, 0.3, 0.5, 0.4, 0.5, 0.6, 0.5, 0.4, 0.3, 0.4, 0.5, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2, 0.3, 0.4, 0.3, 0.2, 0.1],
  tired: [0.1, 0.15, 0.2, 0.15, 0.25, 0.2, 0.3, 0.25, 0.35, 0.3, 0.4, 0.35, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.2, 0.15, 0.1, 0.15, 0.1, 0.12, 0.1],
  grateful: [0.5, 0.7, 0.6, 0.8, 0.7, 0.9, 0.8, 1.0, 0.9, 0.85, 0.9, 1.0, 0.9, 0.85, 0.8, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4],
};

// ─── Waveform ─────────────────────────────────────────────────────────────────
function Waveform({ mood }: { mood: Mood }) {
  const bars = WAVEFORM_PROFILES[mood.id as MoodId];
  const maxH = 72;

  return (
    <div className="flex items-center justify-center gap-[3px] h-[80px]">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          className="rounded-sm"
          style={{ width: 4, backgroundColor: "#111111" }}
          animate={{
            height: [h * maxH, h * maxH * 0.65, h * maxH],
            opacity: 0.15 + h * 0.85,
          }}
          transition={{
            height: {
              repeat: Infinity,
              duration: 0.7 + (i % 5) * 0.15,
              delay: i * 0.04,
              ease: "easeInOut",
            },
          }}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export function MoodPickerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedMood = (location.state as { preselectedMood?: MoodId })?.preselectedMood;
  const defaultIndex = preselectedMood ? MOODS.findIndex((m) => m.id === preselectedMood) : 2;

  const [currentIndex, setCurrentIndex] = useState(Math.max(0, defaultIndex));
  const [direction, setDirection] = useState(0);
  const x = useMotionValue(0);

  const selectedMood = MOODS[currentIndex];
  const prevMood = MOODS[currentIndex - 1] ?? null;
  const nextMood = MOODS[currentIndex + 1] ?? null;

  const goTo = (index: number, dir: number) => {
    if (index < 0 || index >= MOODS.length) return;
    setDirection(dir);
    setCurrentIndex(index);
  };

  const handleDragEnd = (_: never, info: { offset: { x: number } }) => {
    if (info.offset.x < -50) goTo(currentIndex + 1, 1);
    else if (info.offset.x > 50) goTo(currentIndex - 1, -1);
  };

  const handleNext = () => {
    navigate("/quiz/questions", {
      state: {
        mood: selectedMood,
        valence: selectedMood.valence,
        arousal: selectedMood.arousal,
      },
    });
  };

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      {/* Neo-brutalist grid background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(to right, #111111 1px, transparent 1px), linear-gradient(to bottom, #111111 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Animated mood color wash */}
      <AnimatePresence>
        <motion.div
          key={selectedMood.id}
          className="absolute inset-0 pointer-events-none z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: `radial-gradient(ellipse at 50% 0%, ${selectedMood.colour}50 0%, transparent 60%)`,
          }}
        />
      </AnimatePresence>

      <div className="relative z-10 flex flex-col min-h-screen max-w-sm mx-auto w-full px-5 py-8">

        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="font-heading text-4xl font-black text-[#111111] uppercase leading-none tracking-tight">
              Select your<br />today's mood
            </h1>
            <p className="font-sans text-sm text-[#888888] mt-2">Swipe through the waveform</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-full border-[3px] border-[#111111] bg-white transition-transform active:translate-y-1 active:translate-x-1"
            style={{ boxShadow: "3px 3px 0px #111111" }}
            aria-label="Exit mood picker"
          >
            <X size={24} strokeWidth={3} className="text-[#111111]" />
          </button>
        </div>

        {/* Waveform card — draggable */}
        <div
          className="mb-6 rounded-2xl overflow-hidden"
          style={{
            border: "3px solid #111111",
            boxShadow: "6px 6px 0px #111111",
            backgroundColor: "white",
          }}
        >
          {/* Mood color header strip */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMood.id + "-strip"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-2"
              style={{ backgroundColor: selectedMood.colour }}
            />
          </AnimatePresence>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={handleDragEnd}
            style={{ x, cursor: "grab" }}
            whileDrag={{ cursor: "grabbing" }}
            className="px-4 py-6 touch-none"
          >
            {/* Center line indicator */}
            <div className="relative flex items-center justify-center mb-2">
              <div
                className="absolute top-1/2 -translate-y-1/2 w-[3px] rounded-full z-10"
                style={{
                  height: 84,
                  backgroundColor: selectedMood.colour,
                  border: "2px solid #111111",
                }}
              />
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={selectedMood.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="w-full"
                >
                  <Waveform mood={selectedMood} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Mood label row inside card */}
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{ borderTop: "3px solid #111111" }}
          >
            <button
              onClick={() => goTo(currentIndex - 1, -1)}
              disabled={!prevMood}
              className="font-heading text-xs font-bold uppercase tracking-widest transition-opacity"
              style={{ color: "#AAAAAA", opacity: prevMood ? 1 : 0 }}
            >
              ← {prevMood?.label}
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMood.id + "-pill"}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="px-5 py-1.5 font-heading font-black text-sm uppercase tracking-widest text-[#111111] rounded-full"
                style={{
                  backgroundColor: selectedMood.colour,
                  border: "3px solid #111111",
                  boxShadow: "2px 2px 0px #111111",
                }}
              >
                {selectedMood.label}
              </motion.div>
            </AnimatePresence>

            <button
              onClick={() => goTo(currentIndex + 1, 1)}
              disabled={!nextMood}
              className="font-heading text-xs font-bold uppercase tracking-widest transition-opacity"
              style={{ color: "#AAAAAA", opacity: nextMood ? 1 : 0 }}
            >
              {nextMood?.label} →
            </button>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {MOODS.map((m, i) => (
            <motion.button
              key={m.id}
              onClick={() => goTo(i, i > currentIndex ? 1 : -1)}
              animate={{
                width: i === currentIndex ? 28 : 8,
                backgroundColor: i === currentIndex ? "#111111" : "#CCCCCC",
              }}
              transition={{ duration: 0.25 }}
              className="h-[8px] rounded-full border-[2px] border-transparent"
              style={{ borderColor: i === currentIndex ? "#111111" : "transparent" }}
            />
          ))}
        </div>

        {/* Affirmation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood.id + "-affirmation"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mb-8 p-4 rounded-xl"
            style={{
              border: "3px solid #111111",
              boxShadow: "3px 3px 0px #111111",
              backgroundColor: selectedMood.colour + "33",
            }}
          >
            <p className="font-sans text-xs text-[#888888] uppercase tracking-widest mb-1">Today's affirmation</p>
            <p className="font-heading text-base font-bold text-[#111111] italic">
              "{selectedMood.affirmation}"
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Blob character with reactive ambient colour field */}
        <div className="flex justify-center items-center my-4 h-[140px] relative">
          {/* Ambient glow field — HSL-interpolated per mood colour */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            animate={{
              backgroundColor: selectedMood.colour + "55",
              boxShadow: `0 0 60px 20px ${selectedMood.colour}40`,
              scale: [1, 1.08, 1],
            }}
            transition={{
              backgroundColor: { duration: 0.7, ease: "easeInOut" },
              boxShadow: { duration: 0.7, ease: "easeInOut" },
              scale: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{ width: 130, height: 130 }}
          />
          <div className="relative z-10">
            <SquircleCharacter mood={selectedMood} size={140} />
          </div>
        </div>

        {/* Continue button */}
        <div className="mt-auto">
          <motion.button
            onClick={handleNext}
            whileTap={{ x: 4, y: 4, boxShadow: "0px 0px 0px #111111" }}
            className="w-full py-4 font-heading font-bold text-lg uppercase tracking-widest text-[#111111] rounded-xl border-[3px] border-[#111111] transition-colors"
            style={{
              backgroundColor: selectedMood.colour,
              boxShadow: "4px 4px 0px #111111",
            }}
          >
            Continue →
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
