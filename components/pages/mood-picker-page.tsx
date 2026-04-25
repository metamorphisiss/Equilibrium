"use client";

import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { NeoButton, NeoChip } from "@/components/neo-button";
import { SquircleCharacter } from "@/components/squircle-character";
import { MOODS, type Mood, type MoodId } from "@/lib/moods";

export function MoodPickerPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedMood = (location.state as { preselectedMood?: MoodId })?.preselectedMood;

  const [selectedMood, setSelectedMood] = useState<Mood>(
    preselectedMood ? MOODS.find((m) => m.id === preselectedMood)! : MOODS[0]
  );
  const [valence, setValence] = useState(selectedMood.valence);
  const [arousal, setArousal] = useState(selectedMood.arousal);
  const [isDragging, setIsDragging] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const chipContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setValence(selectedMood.valence);
    setArousal(selectedMood.arousal);
  }, [selectedMood]);

  useEffect(() => {
    if (chipContainerRef.current) {
      const selectedChip = chipContainerRef.current.querySelector(`[data-mood="${selectedMood.id}"]`);
      if (selectedChip) {
        selectedChip.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [selectedMood]);

  const handlePickerInteraction = (clientX: number, clientY: number) => {
    if (!pickerRef.current) return;
    const rect = pickerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    setValence(x * 2 - 1);
    setArousal(1 - y * 2);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handlePickerInteraction(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      handlePickerInteraction(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handlePickerInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging) {
      handlePickerInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleNext = () => {
    navigate("/quiz/questions", {
      state: {
        mood: selectedMood,
        valence,
        arousal,
      },
    });
  };

  const markerX = ((valence + 1) / 2) * 100;
  const markerY = ((1 - arousal) / 2) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <BackButton onClick={() => navigate(-1)} />
        <NeoChip selected colour={selectedMood.colour}>
          Save
        </NeoChip>
      </div>

      <div
        className="flex-[0.6] relative flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at top, ${selectedMood.colour}40 0%, #FFFBF0 70%)`,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedMood.id}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", duration: 0.3 }}
          >
            <SquircleCharacter mood={selectedMood} size={200} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex-[0.4] bg-[#FFFBF0] px-4 py-6 flex flex-col gap-4">
        <div
          ref={chipContainerRef}
          className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {MOODS.map((mood) => (
            <NeoChip
              key={mood.id}
              data-mood={mood.id}
              selected={selectedMood.id === mood.id}
              colour={mood.colour}
              onClick={() => setSelectedMood(mood)}
              className="snap-center shrink-0"
            >
              {mood.label}
            </NeoChip>
          ))}
        </div>

        <div
          ref={pickerRef}
          className="relative w-full h-[160px] cursor-crosshair select-none touch-none"
          style={{
            borderRadius: "16px",
            border: "2px solid #111111",
            boxShadow: "4px 4px 0px #111111",
            background: `linear-gradient(
              to bottom right,
              hsl(0, 70%, 70%) 0%,
              hsl(45, 80%, 68%) 50%,
              hsl(140, 45%, 72%) 100%
            ), linear-gradient(
              to bottom left,
              hsl(220, 35%, 68%) 0%,
              transparent 100%
            )`,
            backgroundBlendMode: "normal",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setIsDragging(false)}
        >
          <span className="absolute top-2 left-2 font-sans text-[9px] text-[#111111] opacity-50">Stressed</span>
          <span className="absolute top-2 right-2 font-sans text-[9px] text-[#111111] opacity-50">Excited</span>
          <span className="absolute bottom-2 left-2 font-sans text-[9px] text-[#111111] opacity-50">Low</span>
          <span className="absolute bottom-2 right-2 font-sans text-[9px] text-[#111111] opacity-50">Calm</span>

          <motion.div
            className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{
              left: `${markerX}%`,
              top: `${markerY}%`,
            }}
            animate={{
              left: `${markerX}%`,
              top: `${markerY}%`,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              className="w-5 h-5 rounded-full"
              style={{
                backgroundColor: "#111111",
                border: "2px solid white",
              }}
            />
          </motion.div>
        </div>

        <p className="font-mono text-sm text-center text-[#666666]">
          V: {valence.toFixed(2)} &nbsp; A: {arousal.toFixed(2)}
        </p>

        <NeoButton onClick={handleNext} fullWidth>
          Next
        </NeoButton>
      </div>
    </motion.div>
  );
}
