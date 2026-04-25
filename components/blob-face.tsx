"use client";

import type { Mood, FaceExpression } from "@/lib/moods";
import { motion } from "framer-motion";

interface BlobFaceProps {
  expression: FaceExpression;
  size?: number;
}

export function BlobFace({ expression, size = 100 }: BlobFaceProps) {
  const scale = size / 100;

  const eyePositions = {
    leftX: 35,
    rightX: 65,
    y: 40,
  };

  const renderEyes = () => {
    switch (expression) {
      case "smile":
        return (
          <>
            <circle cx={eyePositions.leftX} cy={eyePositions.y} r={5} fill="#111111" />
            <circle cx={eyePositions.rightX} cy={eyePositions.y} r={5} fill="#111111" />
          </>
        );
      case "worried":
        return (
          <>
            <ellipse cx={eyePositions.leftX} cy={eyePositions.y} rx={6} ry={7} fill="#111111" />
            <ellipse cx={eyePositions.rightX} cy={eyePositions.y} rx={6} ry={7} fill="#111111" />
          </>
        );
      case "frown":
        return (
          <>
            <circle cx={eyePositions.leftX} cy={eyePositions.y} r={5} fill="#111111" />
            <circle cx={eyePositions.rightX} cy={eyePositions.y} r={5} fill="#111111" />
            <path
              d={`M ${eyePositions.leftX - 8} ${eyePositions.y - 10} L ${eyePositions.leftX + 4} ${eyePositions.y - 6}`}
              stroke="#111111"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d={`M ${eyePositions.rightX + 8} ${eyePositions.y - 10} L ${eyePositions.rightX - 4} ${eyePositions.y - 6}`}
              stroke="#111111"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          </>
        );
      case "neutral":
        return (
          <>
            <ellipse cx={eyePositions.leftX} cy={eyePositions.y + 2} rx={5} ry={4} fill="#111111" />
            <ellipse cx={eyePositions.rightX} cy={eyePositions.y + 2} rx={5} ry={4} fill="#111111" />
          </>
        );
      case "flat":
        return (
          <>
            <path
              d={`M ${eyePositions.leftX - 6} ${eyePositions.y} L ${eyePositions.leftX + 6} ${eyePositions.y}`}
              stroke="#111111"
              strokeWidth={3}
              strokeLinecap="round"
            />
            <path
              d={`M ${eyePositions.rightX - 6} ${eyePositions.y} L ${eyePositions.rightX + 6} ${eyePositions.y}`}
              stroke="#111111"
              strokeWidth={3}
              strokeLinecap="round"
            />
          </>
        );
      default:
        return (
          <>
            <circle cx={eyePositions.leftX} cy={eyePositions.y} r={5} fill="#111111" />
            <circle cx={eyePositions.rightX} cy={eyePositions.y} r={5} fill="#111111" />
          </>
        );
    }
  };

  const renderMouth = () => {
    const mouthY = 60;

    switch (expression) {
      case "smile":
        return (
          <path
            d="M 35 58 Q 50 72 65 58"
            stroke="#111111"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        );
      case "worried":
        return (
          <path
            d="M 40 62 Q 45 60 50 62 Q 55 64 60 62"
            stroke="#111111"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
        );
      case "frown":
        return (
          <path
            d={`M 38 ${mouthY + 4} L 62 ${mouthY + 4}`}
            stroke="#111111"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      case "neutral":
        return (
          <path
            d="M 40 60 Q 50 64 60 60"
            stroke="#111111"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
          />
        );
      case "flat":
        return (
          <path
            d={`M 40 ${mouthY} L 60 ${mouthY}`}
            stroke="#111111"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
      default:
        return (
          <path
            d={`M 40 ${mouthY} L 60 ${mouthY}`}
            stroke="#111111"
            strokeWidth={3}
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ transform: `scale(${scale / scale})` }}
    >
      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}

export function MiniBlobFace({ expression, size = 24 }: BlobFaceProps) {
  const renderEyes = () => {
    const leftX = 35;
    const rightX = 65;
    const y = 40;

    switch (expression) {
      case "smile":
      case "neutral":
        return (
          <>
            <circle cx={leftX} cy={y} r={6} fill="#111111" />
            <circle cx={rightX} cy={y} r={6} fill="#111111" />
          </>
        );
      case "worried":
        return (
          <>
            <ellipse cx={leftX} cy={y} rx={7} ry={8} fill="#111111" />
            <ellipse cx={rightX} cy={y} rx={7} ry={8} fill="#111111" />
          </>
        );
      case "frown":
        return (
          <>
            <circle cx={leftX} cy={y} r={6} fill="#111111" />
            <circle cx={rightX} cy={y} r={6} fill="#111111" />
            <path d={`M ${leftX - 10} ${y - 12} L ${leftX + 6} ${y - 6}`} stroke="#111111" strokeWidth={3} strokeLinecap="round" />
            <path d={`M ${rightX + 10} ${y - 12} L ${rightX - 6} ${y - 6}`} stroke="#111111" strokeWidth={3} strokeLinecap="round" />
          </>
        );
      case "flat":
        return (
          <>
            <path d={`M ${leftX - 8} ${y} L ${leftX + 8} ${y}`} stroke="#111111" strokeWidth={4} strokeLinecap="round" />
            <path d={`M ${rightX - 8} ${y} L ${rightX + 8} ${y}`} stroke="#111111" strokeWidth={4} strokeLinecap="round" />
          </>
        );
      default:
        return (
          <>
            <circle cx={leftX} cy={y} r={6} fill="#111111" />
            <circle cx={rightX} cy={y} r={6} fill="#111111" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (expression) {
      case "smile":
        return <path d="M 32 58 Q 50 76 68 58" stroke="#111111" strokeWidth={4} strokeLinecap="round" fill="none" />;
      case "worried":
        return <path d="M 38 64 Q 44 60 50 64 Q 56 68 62 64" stroke="#111111" strokeWidth={3} strokeLinecap="round" fill="none" />;
      case "frown":
      case "flat":
        return <path d="M 36 62 L 64 62" stroke="#111111" strokeWidth={4} strokeLinecap="round" />;
      case "neutral":
        return <path d="M 38 60 Q 50 68 62 60" stroke="#111111" strokeWidth={3} strokeLinecap="round" fill="none" />;
      default:
        return <path d="M 38 62 L 62 62" stroke="#111111" strokeWidth={4} strokeLinecap="round" />;
    }
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {renderEyes()}
      {renderMouth()}
    </svg>
  );
}

interface OrganicMoodBlobProps {
  mood: Mood;
  size?: number;
}

export function OrganicMoodBlob({ mood, size = 150 }: OrganicMoodBlobProps) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={{
        scale: [1, 1.05, 1],
        rotate: [0, 1, -1, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 drop-shadow-xl overflow-visible"
        style={{ width: size, height: size }}
      >
        {/* Shadow layer for Neo-Brutalism */}
        <path
          d={mood.blobPath}
          fill="#111111"
          transform="translate(4, 4)"
        />
        {/* Main blob body */}
        <path
          d={mood.blobPath}
          fill={mood.colour}
          stroke="#111111"
          strokeWidth="3.5"
        />
        {/* Subtle highlight */}
        <path
          d="M 30 30 Q 40 20 50 30"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.4"
          fill="none"
        />
      </svg>
      <div className="relative z-10" style={{ width: size * 0.45, height: size * 0.45 }}>
        <BlobFace expression={mood.faceExpression} size={size * 0.45} />
      </div>
    </motion.div>
  );
}
