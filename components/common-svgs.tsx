"use client";

import React from "react";

// Common props for all mood SVGs
interface MoodProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

// Sparkle helper component for the floating elements
const Sparkle = ({ cx, cy, fill, type = "diamond" }: { cx: number | string; cy: number | string; fill: string; type?: "circle" | "diamond" | "star" | "square" }) => {
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
  if (type === "square") {
    return <rect x={x - 3} y={y - 3} width="6" height="6" fill={fill} rx="1" />;
  }
  return <circle cx={x} cy={y} r="3" fill={fill} />;
};

// Base highlight used across all characters
const Highlight = () => (
  <>
    <path d="M 32 45 A 35 35 0 0 1 50 26" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" fill="none" opacity="0.9" />
    <circle cx="36" cy="55" r="4.5" fill="#FFFFFF" opacity="0.9" />
  </>
);

// 1. Happy Green Mood
export const HappyGreenMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#C5E1A5" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Happy Eyes */}
    <path d="M 42 45 Q 46 40 50 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M 70 45 Q 74 40 78 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    {/* Open Happy Mouth */}
    <path d="M 50 58 Q 60 75 70 58 Z" fill="#000000" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 54 62 Q 60 70 66 62 Z" fill="#FF8A80" />

    {/* Blush */}
    <ellipse cx="38" cy="58" rx="6" ry="4" fill="#FF8A80" opacity="0.7" />
    <ellipse cx="82" cy="58" rx="6" ry="4" fill="#FF8A80" opacity="0.7" />

    {/* Sparkles */}
    <Sparkle cx="30" cy="30" fill="#E1BEE7" type="star" />
    <Sparkle cx="50" cy="15" fill="#FFF59D" type="star" />
    <Sparkle cx="75" cy="20" fill="#F48FB1" type="star" />
    <Sparkle cx="90" cy="30" fill="#81D4FA" type="star" />
    <Sparkle cx="100" cy="45" fill="#FFCC80" type="star" />
  </svg>
);

// 2. Sad Orange Mood
export const SadOrangeMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <circle cx="60" cy="60" r="45" fill="#FFB74D" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Droopy Eyes */}
    <circle cx="45" cy="55" r="5" fill="#000000" />
    <circle cx="75" cy="55" r="5" fill="#000000" />
    <path d="M 40 48 Q 45 44 50 50" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 80 48 Q 75 44 70 50" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 41 62 Q 45 65 49 62" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M 79 62 Q 75 65 71 62" stroke="#000000" strokeWidth="2" strokeLinecap="round" fill="none" />
    
    {/* Sad Mouth */}
    <path d="M 50 72 Q 60 62 70 72" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
  </svg>
);

// 3. Frustrated Green Mood
export const FrustratedGreenMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="5" fill="#558B2F" opacity="0.6" />
    <circle cx="60" cy="60" r="45" fill="#A5D6A7" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Frustrated Eyes */}
    <circle cx="45" cy="53" r="5" fill="#000000" />
    <circle cx="75" cy="53" r="5" fill="#000000" />
    <circle cx="46" cy="52" r="1.5" fill="#FFFFFF" />
    <circle cx="76" cy="52" r="1.5" fill="#FFFFFF" />
    <path d="M 38 48 Q 45 50 50 48" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 82 48 Q 75 50 70 48" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    
    {/* Sad Mouth with Dot */}
    <path d="M 52 65 Q 60 55 68 65" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    <circle cx="60" cy="72" r="2.5" fill="#000000" />

    {/* Blush & Anger Mark */}
    <path d="M 35 58 L 38 55 L 41 58 L 44 55" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
    <path d="M 76 58 L 79 55 L 82 58 L 85 55" stroke="#FF5252" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.6" />
    <path d="M 78 40 L 82 44 L 86 40 L 82 36 Z M 82 44 L 86 48 M 82 36 L 78 32 M 86 40 L 90 36" stroke="#D32F2F" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Floating Shapes */}
    <Sparkle cx="40" cy="20" fill="#D32F2F" type="circle" />
    <Sparkle cx="25" cy="35" fill="#81C784" type="diamond" />
    <Sparkle cx="85" cy="25" fill="#388E3C" type="circle" />
    <Sparkle cx="95" cy="35" fill="#E91E63" type="square" />
  </svg>
);

// 4. Sad Blue Mood
export const SadBlueMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#5DADE2" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Cute Sad Eyes */}
    <circle cx="45" cy="55" r="7" fill="#000000" />
    <circle cx="75" cy="55" r="7" fill="#000000" />
    <circle cx="46" cy="53" r="2.5" fill="#FFFFFF" />
    <circle cx="43" cy="57" r="1.5" fill="#FFFFFF" />
    <circle cx="76" cy="53" r="2.5" fill="#FFFFFF" />
    <circle cx="73" cy="57" r="1.5" fill="#FFFFFF" />
    
    {/* Tiny Sad Mouth */}
    <path d="M 55 65 Q 60 61 65 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Blush */}
    <ellipse cx="35" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.8" />
    <ellipse cx="85" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.8" />

    {/* Sparkles */}
    <Sparkle cx="40" cy="20" fill="#F48FB1" type="circle" />
    <Sparkle cx="30" cy="35" fill="#FFF59D" type="diamond" />
    <Sparkle cx="80" cy="25" fill="#81D4FA" type="circle" />
    <Sparkle cx="95" cy="35" fill="#FFF59D" type="diamond" />
  </svg>
);

// 5. Sad Purple Mood
export const SadPurpleMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#D2B4DE" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Half-closed Sad Eyes */}
    <path d="M 38 52 Q 45 45 52 52" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 68 52 Q 75 45 82 52" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />
    <path d="M 40 54 Q 45 60 50 54" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
    <path d="M 70 54 Q 75 60 80 54" stroke="#000000" strokeWidth="3" strokeLinecap="round" fill="none" />
    
    {/* Sad Mouth */}
    <path d="M 55 65 Q 60 61 65 65" stroke="#000000" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Blush */}
    <ellipse cx="36" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.7" />
    <ellipse cx="84" cy="60" rx="6" ry="4" fill="#FF8A80" opacity="0.7" />

    {/* Sparkles */}
    <Sparkle cx="40" cy="15" fill="#F48FB1" type="circle" />
    <Sparkle cx="25" cy="30" fill="#FFF59D" type="diamond" />
    <Sparkle cx="85" cy="20" fill="#81D4FA" type="circle" />
    <Sparkle cx="100" cy="35" fill="#FFF59D" type="diamond" />
  </svg>
);

// 6. Happy Blue Mood (Cute Cat Mouth)
export const HappyBlueMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#B2EBF2" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Happy Eyes */}
    <path d="M 42 45 Q 46 40 50 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M 70 45 Q 74 40 78 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    {/* Cute w Mouth */}
    <path d="M 52 50 Q 56 55 60 50 Q 64 55 68 50" stroke="#000000" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

    {/* Blush */}
    <ellipse cx="38" cy="53" rx="6" ry="4" fill="#E040FB" opacity="0.4" />
    <ellipse cx="82" cy="53" rx="6" ry="4" fill="#E040FB" opacity="0.4" />

    {/* Sparkles */}
    <Sparkle cx="30" cy="25" fill="#F48FB1" type="circle" />
    <Sparkle cx="85" cy="20" fill="#18FFFF" type="circle" />
    <Sparkle cx="40" cy="15" fill="#FFEA00" type="diamond" />
    <Sparkle cx="95" cy="35" fill="#FFEA00" type="diamond" />
  </svg>
);

// 7. Happy Pink Mood (Open Mouth)
export const HappyPinkMood = ({ size = 80, ...props }: MoodProps) => (
  <svg width={size} height={size} viewBox="0 0 120 120" className="drop-shadow-xl overflow-visible" {...props}>
    <ellipse cx="60" cy="110" rx="35" ry="8" fill="#000000" />
    <circle cx="60" cy="60" r="45" fill="#FFCDD2" stroke="#000000" strokeWidth="6" />
    <Highlight />
    
    {/* Happy Eyes */}
    <path d="M 42 45 Q 46 40 50 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    <path d="M 70 45 Q 74 40 78 45" stroke="#000000" strokeWidth="5" strokeLinecap="round" fill="none" />
    
    {/* Open Happy Mouth */}
    <path d="M 50 58 Q 60 75 70 58 Z" fill="#000000" stroke="#000000" strokeWidth="3" strokeLinejoin="round" />
    <path d="M 54 62 Q 60 70 66 62 Z" fill="#FF8A80" />

    {/* Blush */}
    <ellipse cx="38" cy="58" rx="6" ry="4" fill="#FF5252" opacity="0.5" />
    <ellipse cx="82" cy="58" rx="6" ry="4" fill="#FF5252" opacity="0.5" />

    {/* Sparkles */}
    <Sparkle cx="30" cy="30" fill="#F48FB1" type="circle" />
    <Sparkle cx="80" cy="20" fill="#18FFFF" type="circle" />
    <Sparkle cx="40" cy="15" fill="#FFEA00" type="diamond" />
    <Sparkle cx="95" cy="30" fill="#FFEA00" type="diamond" />
  </svg>
);
