"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { useNavigate } from "react-router-dom";
import { NeoButton, NeoChip } from "@/components/neo-button";
import { BlobFace } from "@/components/blob-face";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

interface Pattern {
  name: string;
  inhale: number;
  hold: number;
  exhale: number;
  cycles: number;
}

const PATTERNS: Pattern[] = [
  { name: "4-7-8", inhale: 4, hold: 7, exhale: 8, cycles: 4 },
  { name: "Box", inhale: 4, hold: 4, exhale: 4, cycles: 4 },
  { name: "Calm", inhale: 5, hold: 2, exhale: 7, cycles: 3 },
];

export function BreathingPage() {
  const navigate = useNavigate();
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(PATTERNS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [currentCycle, setCurrentCycle] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const controls = useAnimation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<Phase>("idle");

  const triggerHaptic = () => {
    try {
      if (navigator.vibrate) {
        navigator.vibrate(30);
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
      triggerHaptic();

      let duration = 0;
      let targetScale = 1;

      switch (currentPhase) {
        case "inhale":
          duration = selectedPattern.inhale;
          targetScale = 1.4;
          break;
        case "hold":
          duration = selectedPattern.hold;
          targetScale = 1.4;
          break;
        case "exhale":
          duration = selectedPattern.exhale;
          targetScale = 1;
          break;
        default:
          return;
      }

      setTimeRemaining(duration);

      controls.start({
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
        runPhase("hold", cycle);
      } else if (currentPhase === "hold") {
        runPhase("exhale", cycle);
      } else if (currentPhase === "exhale") {
        if (cycle < selectedPattern.cycles) {
          setCurrentCycle(cycle + 1);
          runPhase("inhale", cycle + 1);
        } else {
          setPhase("done");
          phaseRef.current = "done";
          setIsRunning(false);
          triggerHaptic();
        }
      }
    },
    [selectedPattern, isRunning, controls]
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
    controls.start({ scale: 1, transition: { duration: 0.3 } });
  };

  const handleReset = () => {
    handleStop();
    setCurrentCycle(1);
    setTimeRemaining(0);
    setPhase("idle");
  };

  const getPhaseLabel = () => {
    switch (phase) {
      case "inhale":
        return "INHALE";
      case "hold":
        return "HOLD";
      case "exhale":
        return "EXHALE";
      case "done":
        return "DONE";
      default:
        return "READY";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col pb-24 md:pb-8"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="flex items-center px-4 py-3">
        <BackButton onClick={() => navigate(-1)} />
      </div>

      <div className="flex gap-2 px-4 mb-8 justify-center flex-wrap">
        {PATTERNS.map((pattern) => (
          <NeoChip
            key={pattern.name}
            selected={selectedPattern.name === pattern.name}
            colour="#111111"
            onClick={() => {
              if (!isRunning) setSelectedPattern(pattern);
            }}
            className={selectedPattern.name === pattern.name ? "text-white" : ""}
          >
            {pattern.name}
          </NeoChip>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <motion.div
          animate={controls}
          initial={{ scale: 1 }}
          className="relative flex items-center justify-center"
          style={{ width: 200, height: 200 }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: "#A8E6CF",
              border: "2px solid #111111",
              boxShadow: "4px 4px 0px #111111",
            }}
          />
          <div className="relative z-10">
            <BlobFace expression="smile" size={100} />
          </div>
        </motion.div>

        <h2 className="font-heading text-3xl font-bold text-[#111111] mt-8">
          {getPhaseLabel()}
        </h2>

        {isRunning && phase !== "done" && (
          <>
            <p className="font-mono text-4xl font-bold text-[#111111] mt-4">
              {timeRemaining}
            </p>
            <p className="font-mono text-sm text-[#666666] mt-2">
              Cycle {currentCycle} of {selectedPattern.cycles}
            </p>
          </>
        )}

        {phase === "done" && (
          <p className="font-sans text-[#666666] mt-4 text-center">
            Great job! You completed all cycles.
          </p>
        )}

        <div className="flex gap-3 mt-8 w-full max-w-xs">
          {!isRunning ? (
            <NeoButton onClick={handleStart} fullWidth>
              Start
            </NeoButton>
          ) : (
            <>
              <NeoButton onClick={handleStop} variant="secondary" fullWidth>
                Stop
              </NeoButton>
            </>
          )}
        </div>

        {(phase === "done" || (!isRunning && phase === "idle" && currentCycle > 1)) && (
          <div className="mt-3 w-full max-w-xs">
            <NeoButton onClick={handleReset} variant="secondary" fullWidth>
              Reset
            </NeoButton>
          </div>
        )}
      </div>
    </motion.div>
  );
}
