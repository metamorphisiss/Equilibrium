"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Mood } from "@/lib/moods";
import { BlobFace } from "./blob-face";
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

export function SquircleCharacter({ mood, size = 220 }: SquircleCharacterProps) {
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
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", duration: 0.3 }}
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {getMoodSvg()}
      </motion.div>
    </AnimatePresence>
  );
}

interface BreathingBlobProps {
  colour?: string;
  size?: number;
}

export function BreathingBlob({ colour = "#A8E6CF", size = 160 }: BreathingBlobProps) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.06, 1],
      }}
      transition={{
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }}
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: colour,
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
        }}
      />
      <div className="relative z-10" style={{ width: size * 0.5, height: size * 0.5 }}>
        <BlobFace expression="smile" size={size * 0.5} />
      </div>
    </motion.div>
  );
}
