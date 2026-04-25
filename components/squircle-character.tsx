"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Mood } from "@/lib/moods";
import {
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
} from "./common-svgs";

interface SquircleCharacterProps {
  mood: Mood;
  size?: number;
}

export function SquircleCharacter({ mood, size = 180 }: SquircleCharacterProps) {
  const getMoodSvg = () => {
    switch (mood.id) {
      case "happy": return <HappyPinkMood size={size} />;
      case "calm": return <HappyBlueMood size={size} />;
      case "anxious": return <SadPurpleMood size={size} />;
      case "frustrated": return <FrustratedGreenMood size={size} />;
      case "lonely": return <SadBlueMood size={size} />;
      case "tired": return <SadOrangeMood size={size} />;
      case "grateful": return <HappyGreenMood size={size} />;
      default: return <HappyGreenMood size={size} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={mood.id}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ 
          scale: [1, 1.05, 1],
          y: [0, -5, 0],
          opacity: 1 
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 0.3 }
        }}
        className="flex items-center justify-center"
      >
        {getMoodSvg()}
      </motion.div>
    </AnimatePresence>
  );
}
