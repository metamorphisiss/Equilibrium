"use client";

import { motion } from "framer-motion";

const Sparkle = ({ cx, cy, fill, type = "circle" }: { cx: number | string; cy: number | string; fill: string; type?: "circle" | "diamond" | "star" }) => {
  const x = Number(cx);
  const y = Number(cy);
  
  if (type === "diamond") {
    return (
      <path d={`M ${x} ${y - 5} L ${x + 5} ${y} L ${x} ${y + 5} L ${x - 5} ${y} Z`} fill={fill} />
    );
  }
  if (type === "star") {
    return (
      <path
        d={`M ${x} ${y - 6} Q ${x} ${y} ${x + 6} ${y} Q ${x} ${y} ${x} ${y + 6} Q ${x} ${y} ${x - 6} ${y} Q ${x} ${y} ${x} ${y - 6} Z`}
        fill={fill}
      />
    );
  }
  return <circle cx={x} cy={y} r="4" fill={fill} />;
};

const PinkMood = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" className="drop-shadow-xl">
    <ellipse cx="60" cy="100" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#FFB6C1" stroke="#000000" strokeWidth="5" />
    <path d="M 30 45 A 35 35 0 0 1 45 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    <path d="M 45 55 Q 50 50 55 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 65 55 Q 70 50 75 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    <path d="M 55 65 Q 60 75 65 65 Z" fill="#000000" />
    <path d="M 57 67 Q 60 72 63 67 Z" fill="#FF8C9D" />

    <ellipse cx="40" cy="65" rx="6" ry="4" fill="#FF8C9D" opacity="0.6" />
    <ellipse cx="80" cy="65" rx="6" ry="4" fill="#FF8C9D" opacity="0.6" />

    <Sparkle cx="25" cy="20" fill="#FF69B4" type="diamond" />
    <Sparkle cx="85" cy="15" fill="#00FFFF" type="circle" />
    <Sparkle cx="100" cy="30" fill="#FFD700" type="diamond" />
  </svg>
);

const BlueMood = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" className="drop-shadow-xl">
    <ellipse cx="60" cy="100" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#87CEEB" stroke="#000000" strokeWidth="5" />
    <path d="M 30 45 A 35 35 0 0 1 45 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    <path d="M 45 55 Q 50 50 55 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 65 55 Q 70 50 75 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    <path d="M 55 65 Q 57.5 70 60 65 Q 62.5 70 65 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    <ellipse cx="40" cy="65" rx="6" ry="4" fill="#DDA0DD" opacity="0.6" />
    <ellipse cx="80" cy="65" rx="6" ry="4" fill="#DDA0DD" opacity="0.6" />

    <Sparkle cx="30" cy="25" fill="#FF69B4" type="circle" />
    <Sparkle cx="80" cy="20" fill="#00FFFF" type="circle" />
    <Sparkle cx="100" cy="35" fill="#FFD700" type="diamond" />
  </svg>
);

const DarkBlueMood = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" className="drop-shadow-xl">
    <ellipse cx="60" cy="100" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#4682B4" stroke="#000000" strokeWidth="5" />
    <path d="M 30 45 A 35 35 0 0 1 45 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    <circle cx="48" cy="55" r="5" fill="#000000" />
    <circle cx="49" cy="54" r="1.5" fill="#FFFFFF" />
    <circle cx="72" cy="55" r="5" fill="#000000" />
    <circle cx="73" cy="54" r="1.5" fill="#FFFFFF" />
    
    <path d="M 56 68 Q 60 64 64 68" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />

    <ellipse cx="38" cy="62" rx="5" ry="3" fill="#FF6B6B" opacity="0.8" />
    <ellipse cx="82" cy="62" rx="5" ry="3" fill="#FF6B6B" opacity="0.8" />

    <Sparkle cx="35" cy="20" fill="#FF69B4" type="circle" />
    <Sparkle cx="75" cy="15" fill="#00FFFF" type="circle" />
    <Sparkle cx="95" cy="25" fill="#FFD700" type="diamond" />
  </svg>
);

const PurpleMood = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" className="drop-shadow-xl">
    <ellipse cx="60" cy="100" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#D8BFD8" stroke="#000000" strokeWidth="5" />
    <path d="M 30 45 A 35 35 0 0 1 45 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    <path d="M 42 55 Q 47 50 52 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 68 55 Q 73 50 78 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    <path d="M 56 68 Q 60 64 64 68" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />

    <ellipse cx="40" cy="65" rx="6" ry="4" fill="#FF6B6B" opacity="0.6" />
    <ellipse cx="80" cy="65" rx="6" ry="4" fill="#FF6B6B" opacity="0.6" />

    <Sparkle cx="30" cy="25" fill="#FF69B4" type="circle" />
    <Sparkle cx="85" cy="20" fill="#00FFFF" type="circle" />
    <Sparkle cx="100" cy="35" fill="#FFD700" type="diamond" />
  </svg>
);

const GreenMood = () => (
  <svg width="80" height="80" viewBox="0 0 120 120" className="drop-shadow-xl">
    <ellipse cx="60" cy="100" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#C1E1C1" stroke="#000000" strokeWidth="5" />
    <path d="M 30 45 A 35 35 0 0 1 45 30" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    <path d="M 45 48 Q 48 45 51 48" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 69 48 Q 72 45 75 48" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />

    <path d="M 45 55 Q 48 50 51 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 69 55 Q 72 50 75 55" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    <path d="M 53 65 Q 60 75 67 65 Z" fill="#000000" />
    <path d="M 55 67 Q 60 72 65 67 Z" fill="#FF6B6B" />

    <ellipse cx="38" cy="65" rx="5" ry="3" fill="#FF6B6B" opacity="0.6" />
    <ellipse cx="82" cy="65" rx="5" ry="3" fill="#FF6B6B" opacity="0.6" />

    <Sparkle cx="25" cy="35" fill="#9370DB" type="star" />
    <Sparkle cx="40" cy="20" fill="#FFD700" type="star" />
    <Sparkle cx="85" cy="25" fill="#FF69B4" type="star" />
    <Sparkle cx="100" cy="40" fill="#00FFFF" type="star" />
    <Sparkle cx="90" cy="15" fill="#FF69B4" type="star" />
  </svg>
);

const MOODS = [PinkMood, BlueMood, DarkBlueMood, PurpleMood, GreenMood];

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
            <MoodComponent />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
