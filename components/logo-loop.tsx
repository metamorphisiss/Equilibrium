"use client";

import { motion } from "framer-motion";
import {
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
} from "./common-svgs";

const MOODS = [
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
];

export function LogoLoop() {
  const duplicatedMoods = [...MOODS, ...MOODS, ...MOODS, ...MOODS]; // Duplicate to ensure seamless looping

  return (
    <div 
      className="relative w-full overflow-hidden my-6 flex items-center"
      style={{
        WebkitMaskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)",
        maskImage: "linear-gradient(to right, transparent, black 15%, black 85%, transparent)"
      }}
    >
      <motion.div
        className="flex gap-12 whitespace-nowrap min-w-max pr-12"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedMoods.map((MoodComponent, index) => (
          <div key={index} className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
            <MoodComponent size={80} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
