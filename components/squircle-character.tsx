"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Mood } from "@/lib/moods";
import { BlobFace } from "./blob-face";

interface SquircleCharacterProps {
  mood: Mood;
  size?: number;
}

export function SquircleCharacter({ mood, size = 220 }: SquircleCharacterProps) {
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
        <motion.div
          animate={{
            borderRadius: [
              "38% 62% 55% 45% / 45% 38% 62% 55%",
              "55% 45% 38% 62% / 62% 55% 45% 38%",
              "38% 62% 55% 45% / 45% 38% 62% 55%",
            ],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="absolute inset-0"
          style={{
            backgroundColor: mood.colour,
            border: "2px solid #111111",
            boxShadow: "4px 4px 0px #111111",
          }}
        />
        <div className="relative z-10" style={{ width: size * 0.6, height: size * 0.6 }}>
          <BlobFace expression={mood.faceExpression} size={size * 0.6} />
        </div>
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
