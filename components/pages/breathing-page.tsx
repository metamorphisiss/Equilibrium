"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { useNavigate } from "react-router-dom";
import { NeoButton, NeoChip } from "@/components/neo-button";

type Phase = "idle" | "inhale" | "holdFull" | "exhale" | "holdEmpty" | "done";

interface Pattern {
  name: string;
  description: string;
  inhale: number;
  holdFull: number;
  exhale: number;
  holdEmpty: number;
  cycles: number;
  colorHex: string;
}

const PATTERNS: Pattern[] = [
  {
    name: "4-7-8",
    description: "Relaxing breath to help you sleep",
    inhale: 4, holdFull: 7, exhale: 8, holdEmpty: 0, cycles: 4,
    colorHex: "#A78BFA", // Purple 400
  },
  {
    name: "Box",
    description: "Equal phases for focus and nervous system reset",
    inhale: 4, holdFull: 4, exhale: 4, holdEmpty: 4, cycles: 4,
    colorHex: "#60A5FA", // Blue 400
  },
  {
    name: "Calm",
    description: "Long exhales for immediate anxiety relief",
    inhale: 5, holdFull: 2, exhale: 7, holdEmpty: 0, cycles: 3,
    colorHex: "#34D399", // Emerald 400
  },
  {
    name: "Awake",
    description: "Energizing breaths to wake up your mind",
    inhale: 6, holdFull: 0, exhale: 2, holdEmpty: 0, cycles: 5,
    colorHex: "#FBBF24", // Amber 400
  }
];

const InfinityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 50" className={className} width="100%" height="100%">
    <path
      d="M 25 10 C 5 10 5 40 25 40 C 42 40 58 10 75 10 C 95 10 95 40 75 40 C 58 40 42 10 25 10 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

interface StepGraphProps {
  pattern: Pattern;
  phase: Phase;
  timeRemaining: number;
  isRunning: boolean;
}

const StepGraph = ({ pattern, phase, timeRemaining, isRunning }: StepGraphProps) => {
  const total = pattern.inhale + pattern.holdFull + pattern.exhale + pattern.holdEmpty;
  if (total === 0) return null;

  // X coordinates of each transition point (in SVG viewBox 0-100)
  const pad = 5;
  const w = 90;
  const x0 = pad; // start (bottom-left)
  const x1 = pad + (pattern.inhale / total) * w; // top of inhale
  const x2 = pad + ((pattern.inhale + pattern.holdFull) / total) * w; // end of holdFull
  const x3 = pad + ((pattern.inhale + pattern.holdFull + pattern.exhale) / total) * w; // bottom of exhale
  const x4 = pad + w; // end of holdEmpty

  const yBot = 82;
  const yTop = 18;

  // Build the path segments as an array of [x,y] points
  const pathPoints: [number, number][] = [
    [x0, yBot], [x1, yTop], [x2, yTop], [x3, yBot], [x4, yBot]
  ];

  const pointsStr = pathPoints.map(([x, y]) => `${x},${y}`).join(" ");

  // Calculate the progress dot position based on the current phase & timeRemaining
  const getDotPosition = (): { x: number; y: number } | null => {
    if (!isRunning || phase === "idle" || phase === "done") return null;

    // Figure out elapsed fraction within the current phase
    let phaseDuration = 0;
    let segStart: [number, number] = [x0, yBot];
    let segEnd: [number, number] = [x1, yTop];

    switch (phase) {
      case "inhale":
        phaseDuration = pattern.inhale;
        segStart = [x0, yBot];
        segEnd = [x1, yTop];
        break;
      case "holdFull":
        phaseDuration = pattern.holdFull;
        segStart = [x1, yTop];
        segEnd = [x2, yTop];
        break;
      case "exhale":
        phaseDuration = pattern.exhale;
        segStart = [x2, yTop];
        segEnd = [x3, yBot];
        break;
      case "holdEmpty":
        phaseDuration = pattern.holdEmpty;
        segStart = [x3, yBot];
        segEnd = [x4, yBot];
        break;
    }

    if (phaseDuration === 0) return null;

    // timeRemaining counts down, so elapsed = duration - remaining
    const elapsed = phaseDuration - timeRemaining;
    const t = Math.min(elapsed / phaseDuration, 1);

    return {
      x: segStart[0] + (segEnd[0] - segStart[0]) * t,
      y: segStart[1] + (segEnd[1] - segStart[1]) * t,
    };
  };

  const dot = getDotPosition();

  // Label positions (centered under each segment)
  const labels: { text: string; x: number; dur: number }[] = [];
  if (pattern.inhale > 0) labels.push({ text: "In", x: (x0 + x1) / 2, dur: pattern.inhale });
  if (pattern.holdFull > 0) labels.push({ text: "Hold", x: (x1 + x2) / 2, dur: pattern.holdFull });
  if (pattern.exhale > 0) labels.push({ text: "Out", x: (x2 + x3) / 2, dur: pattern.exhale });
  if (pattern.holdEmpty > 0) labels.push({ text: "Hold", x: (x3 + x4) / 2, dur: pattern.holdEmpty });

  return (
    <div
      className="w-full max-w-[400px] mt-6 mb-2 relative border-[3px] border-[#111111] bg-white rounded-xl shadow-[6px_6px_0px_#111111]"
      style={{ height: "140px", minHeight: "140px", flexShrink: 0, display: "block" }}
    >
      {/* faint grid background for the graph */}
      <div className="absolute inset-0 rounded-lg" style={{ backgroundImage: 'radial-gradient(#111111 1.5px, transparent 1.5px)', backgroundSize: '10px 10px', opacity: 0.15 }} />
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        {/* Filled area under the curve */}
        <polygon
          points={pointsStr}
          fill={pattern.colorHex}
          className="transition-colors duration-500 opacity-20"
        />
        {/* The waveform line */}
        <polyline
          points={pointsStr}
          fill="none"
          stroke="#111111"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Phase labels rendered as HTML overlays for crisp text */}
      {labels.map((label) => (
        <div
          key={label.text + label.x}
          className="absolute text-[10px] font-bold text-[#111111] uppercase tracking-wider opacity-50 pointer-events-none"
          style={{
            left: `${label.x}%`,
            bottom: "4px",
            transform: "translateX(-50%)",
          }}
        >
          {label.text} {label.dur}s
        </div>
      ))}

      {/* Animated progress dot */}
      {dot && (
        <div
          className="absolute rounded-full border-[3px] border-[#111111] z-10"
          style={{
            width: 16,
            height: 16,
            backgroundColor: pattern.colorHex,
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            transform: "translate(-50%, -50%)",
            transition: "left 0.3s linear, top 0.3s linear",
            boxShadow: "2px 2px 0px #111111",
          }}
        />
      )}
    </div>
  );
};

export function BreathingPage() {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const fillControls = useAnimation();
  const scaleControls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<Phase>("idle");

  const triggerAdvancedHaptic = (currentPhase: Phase) => {
    try {
      if (!navigator.vibrate) return;

      switch (currentPhase) {
        case "inhale":
          navigator.vibrate([30, 100, 40, 100, 50]);
          break;
        case "holdFull":
        case "holdEmpty":
          navigator.vibrate([30, 50, 30]);
          break;
        case "exhale":
          navigator.vibrate([100, 50, 150]);
          break;
        case "done":
          navigator.vibrate([50, 50, 50, 50, 200]);
          break;
        default:
          break;
      }
    } catch {
      // Haptics not supported
    }
  };

  const runPhase = useCallback(
    async (currentPhase: Phase, cycle: number) => {
      if (!isRunning) return;

      phaseRef.current = currentPhase;
      setPhase(currentPhase);
      triggerAdvancedHaptic(currentPhase);

      let duration = 0;
      let targetFill = 0;
      let targetScale = 1;

      switch (currentPhase) {
        case "inhale":
          duration = selectedPattern.inhale;
          targetFill = 100;
          targetScale = 1.3;
          break;
        case "holdFull":
          duration = selectedPattern.holdFull;
          targetFill = 100;
          targetScale = 1.3;
          break;
        case "exhale":
          duration = selectedPattern.exhale;
          targetFill = 0;
          targetScale = 1;
          break;
        case "holdEmpty":
          duration = selectedPattern.holdEmpty;
          targetFill = 0;
          targetScale = 1;
          break;
        default:
          return;
      }

      setTimeRemaining(duration);

      fillControls.start({
        clipPath: `inset(${100 - targetFill}% 0% 0% 0%)`,
        transition: { duration, ease: "linear" },
      });

      scaleControls.start({
        scale: targetScale,
        transition: { duration, ease: "easeInOut" },
      });

      for (let i = duration; i >= 0; i--) {
        if (phaseRef.current === "idle" || phaseRef.current === "done") return;
        setTimeRemaining(i);
        if (i > 0) {
          await new Promise((resolve) => {
            timerRef.current = setTimeout(resolve, 1000);
          });
        }
      }

      if (phaseRef.current === "idle" || phaseRef.current === "done") return;

      if (currentPhase === "inhale") {
        if (selectedPattern.holdFull > 0) runPhase("holdFull", cycle);
        else runPhase("exhale", cycle);
      } else if (currentPhase === "holdFull") {
        runPhase("exhale", cycle);
      } else if (currentPhase === "exhale") {
        if (selectedPattern.holdEmpty > 0) {
          runPhase("holdEmpty", cycle);
        } else {
          if (cycle < selectedPattern.cycles) {
            setCurrentCycle(cycle + 1);
            runPhase("inhale", cycle + 1);
          } else {
            setPhase("done");
            phaseRef.current = "done";
            setIsRunning(false);
            triggerAdvancedHaptic("done");
          }
        }
      } else if (currentPhase === "holdEmpty") {
        if (cycle < selectedPattern.cycles) {
          setCurrentCycle(cycle + 1);
          runPhase("inhale", cycle + 1);
        } else {
          setPhase("done");
          phaseRef.current = "done";
          setIsRunning(false);
          triggerAdvancedHaptic("done");
        }
      }
    },
    [selectedPattern, isRunning, fillControls, scaleControls]
  );

  useEffect(() => {
    if (isRunning && phase === "idle") {
      setCurrentCycle(1);
      runPhase("inhale", 1);
    }
  }, [isRunning, phase, runPhase]);

  const handleStart = () => {
    setPhase("idle");
    phaseRef.current = "idle";
    setIsRunning(true);
  };

  const handleStop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsRunning(false);
    setPhase("idle");
    phaseRef.current = "idle";
    fillControls.start({ clipPath: "inset(100% 0% 0% 0%)", transition: { duration: 0.5, ease: "easeOut" } });
    scaleControls.start({ scale: 1, transition: { duration: 0.5, ease: "easeOut" } });
  };

  const handleReset = () => {
    handleStop();
    setCurrentCycle(1);
    setTimeRemaining(0);
    setPhase("idle");
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale": return "Breathe In";
      case "holdFull": return "Hold Full";
      case "exhale": return "Breathe Out";
      case "holdEmpty": return "Hold Empty";
      case "done": return "Session Complete";
      default: return "Ready to begin";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col pb-24 md:pb-8 relative overflow-hidden"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      {/* Neo-brutalist Dotted Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(#111111 2px, transparent 2px)",
          backgroundSize: "28px 28px"
        }}
      />

      <div className="relative z-10 flex items-center px-4 py-3">
        <motion.div whileHover={{ x: -4 }} transition={{ duration: 0.2 }}>
          <BackButton onClick={() => navigate(-1)} />
        </motion.div>
      </div>

      <div className="relative z-10 flex flex-col items-center px-4 mb-2 mt-2">
        <div className="flex gap-2 justify-center flex-wrap mb-4">
          {PATTERNS.map((pattern) => (
            <motion.div key={pattern.name} whileHover={{ y: -2 }}>
              <NeoChip
                selected={selectedPattern.name === pattern.name}
                colour={pattern.colorHex}
                onClick={() => {
                  if (!isRunning) setSelectedPattern(pattern);
                }}
                className={selectedPattern.name === pattern.name ? "text-[#111111] font-bold border-2" : ""}
              >
                {pattern.name}
              </NeoChip>
            </motion.div>
          ))}
        </div>

        {/* Helper Description */}
        <motion.p
          key={selectedPattern.name}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-semibold text-[#111111] bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] px-4 py-2 rounded-lg text-center max-w-xs"
        >
          {selectedPattern.description}
        </motion.p>

        {/* Dynamic Step-Graph Visualizer */}
        <StepGraph pattern={selectedPattern} phase={phase} timeRemaining={timeRemaining} isRunning={isRunning} />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 mt-8">
        {/* Brutalist Circle Container + Infinity Symbol */}
        <div className="mb-12 relative flex items-center justify-center" style={{ width: 280, height: 280 }}>

          <motion.div
            animate={scaleControls}
            initial={{ scale: 1 }}
            className="absolute z-0 rounded-full border-4 border-[#111111] shadow-[8px_8px_0px_#111111] transition-colors duration-500"
            style={{
              width: 240,
              height: 240,
              backgroundColor: selectedPattern.colorHex
            }}
          />

          <div className="absolute z-10 text-[#111111] opacity-20 w-48 h-24">
            <InfinityIcon />
          </div>
          <motion.div
            animate={fillControls}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            className="absolute z-20 text-[#111111] w-48 h-24"
          >
            <InfinityIcon />
          </motion.div>
        </div>

        <motion.h2
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl font-black text-[#111111] tracking-wide mt-2"
        >
          {getPhaseLabel()}
        </motion.h2>

        {isRunning && phase !== "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center mt-6"
          >
            <div className="bg-white border-4 border-[#111111] shadow-[4px_4px_0px_#111111] px-8 py-4 rounded-2xl flex flex-col items-center">
              <p className="font-mono text-6xl font-black text-[#111111]">
                {timeRemaining}
              </p>
              <p className="font-sans text-xs text-[#111111] mt-2 uppercase tracking-widest font-bold">
                Cycle {currentCycle} of {selectedPattern.cycles}
              </p>
            </div>
          </motion.div>
        )}

        {phase === "done" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border-4 border-[#111111] shadow-[4px_4px_0px_#111111] px-6 py-4 rounded-xl mt-6 text-center"
          >
            <p className="font-sans text-[#111111] font-bold">
              Session Complete. Great job!
            </p>
          </motion.div>
        )}

        <div className="flex gap-3 mt-12 w-full max-w-xs">
          {!isRunning ? (
            <motion.div whileHover={{ scale: 1.02 }} className="w-full">
              <NeoButton onClick={handleStart} fullWidth>
                BEGIN SESSION
              </NeoButton>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.02 }} className="w-full">
              <NeoButton onClick={handleStop} variant="secondary" fullWidth>
                PAUSE
              </NeoButton>
            </motion.div>
          )}
        </div>

        {(phase === "done" || (!isRunning && phase === "idle" && currentCycle > 1)) && (
          <motion.div whileHover={{ scale: 1.02 }} className="mt-3 w-full max-w-xs">
            <NeoButton onClick={handleReset} variant="secondary" fullWidth>
              RESET
            </NeoButton>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
