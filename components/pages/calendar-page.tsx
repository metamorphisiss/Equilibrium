"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NeoCard } from "@/components/neo-card";
import { MiniBlobFace } from "@/components/blob-face";
import { getSessions, getSessionsForMonth, getDominantMood, calculateStreak, type Session } from "@/lib/storage";
import { getMoodById, MOODS } from "@/lib/moods";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const monthSessions = getSessionsForMonth(year, month);
  const dominantMoodId = getDominantMood(monthSessions);
  const dominantMood = dominantMoodId ? getMoodById(dominantMoodId) : null;
  const streak = calculateStreak(sessions);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const monthName = currentDate.toLocaleString("default", { month: "long" });

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getSessionForDate = (day: number): Session | undefined => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return sessions.find((s) => s.date === dateStr);
  };

  const isToday = (day: number) => {
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const handleDayClick = (session: Session | undefined) => {
    if (session) {
      setSelectedSession(session);
      setDrawerOpen(true);
    }
  };

  const getTopMoodLabel = () => {
    if (monthSessions.length === 0) return "None";
    const counts: Record<string, number> = {};
    for (const s of monthSessions) {
      counts[s.moodId] = (counts[s.moodId] || 0) + 1;
    }
    let maxId = "";
    let maxCount = 0;
    for (const [id, count] of Object.entries(counts)) {
      if (count > maxCount) {
        maxCount = count;
        maxId = id;
      }
    }
    const mood = MOODS.find((m) => m.id === maxId);
    return mood?.label || "None";
  };

  const last7Sessions = sessions.slice(0, 7);
  const mockPoints = [
    { valence: -0.6, arousal: 0.7, colour: "#C9B8FF" },
    { valence: -0.5, arousal: 0.5, colour: "#FF8C69" },
    { valence: -0.3, arousal: 0.3, colour: "#C9B8FF" },
    { valence: 0.1, arousal: 0.1, colour: "#D4D4D4" },
    { valence: 0.4, arousal: -0.2, colour: "#A8E6CF" },
    { valence: 0.6, arousal: -0.4, colour: "#A8E6CF" },
    { valence: 0.8, arousal: -0.5, colour: "#FFB8D4" },
  ];

  const scatterPoints = last7Sessions.length >= 3 ? last7Sessions : mockPoints;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pb-24 md:pb-8"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-xl font-bold text-[#111111]">
            Mood Calendar
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={goToPrevMonth} className="p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 15L7 10L12 5" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-sans text-sm text-[#666666]">
              {monthName} {year}
            </span>
            <button onClick={goToNextMonth} className="p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 5L13 10L8 15" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-sans text-xs text-[#888888]">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 mb-6">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-11 h-11" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const session = getSessionForDate(day);
            const mood = session ? getMoodById(session.moodId) : null;

            return (
              <motion.button
                key={day}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.02 }}
                onClick={() => handleDayClick(session)}
                className="w-11 h-11 flex items-center justify-center relative"
                style={{
                  borderRadius: "10px",
                  backgroundColor: session ? session.colour : "#FFFBF0",
                  border: isToday(day) ? "2px solid #111111" : "none",
                }}
              >
                {mood && (
                  <MiniBlobFace expression={mood.faceExpression} size={24} />
                )}
              </motion.button>
            );
          })}
        </div>

        <NeoCard className="p-5 mb-4">
          <p className="font-sans text-xs text-[#888888] mb-1">Monthly Mood Summary</p>
          {dominantMood ? (
            <>
              <h2
                className="font-heading text-4xl font-bold mb-2"
                style={{ color: dominantMood.colour }}
              >
                {dominantMood.label}
              </h2>
              <p className="font-sans text-sm text-[#888888] mb-4">
                {dominantMood.affirmation}
              </p>
            </>
          ) : (
            <p className="font-heading text-2xl font-bold text-[#888888] mb-4">
              No entries yet
            </p>
          )}

          <div className="border-t border-[#E5E5E5] pt-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-[#111111]">
                  {monthSessions.length}
                </p>
                <p className="font-sans text-xs text-[#888888]">Sessions</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-[#111111]">
                  {streak}
                </p>
                <p className="font-sans text-xs text-[#888888]">Streak</p>
              </div>
              <div className="text-center">
                <p className="font-heading text-2xl font-bold text-[#111111]">
                  {getTopMoodLabel()}
                </p>
                <p className="font-sans text-xs text-[#888888]">Top Mood</p>
              </div>
            </div>
          </div>
        </NeoCard>

        <NeoCard className="p-4">
          <p className="font-sans text-xs text-[#888888] mb-3">7-Day Scatter</p>
          <svg
            viewBox="0 0 340 200"
            className="w-full"
            style={{
              border: "2px solid #111111",
              borderRadius: "12px",
              boxShadow: "4px 4px 0px #111111",
            }}
          >
            <line x1="170" y1="10" x2="170" y2="190" stroke="#E5E5E5" strokeWidth="1" />
            <line x1="10" y1="100" x2="330" y2="100" stroke="#E5E5E5" strokeWidth="1" />

            <text x="15" y="25" className="font-sans" fontSize="9" fill="#888888" opacity="0.5">Stressed</text>
            <text x="280" y="25" className="font-sans" fontSize="9" fill="#888888" opacity="0.5">Excited</text>
            <text x="15" y="190" className="font-sans" fontSize="9" fill="#888888" opacity="0.5">Low</text>
            <text x="295" y="190" className="font-sans" fontSize="9" fill="#888888" opacity="0.5">Calm</text>

            <text x="15" y="105" className="font-mono" fontSize="10" fill="#888888">-1</text>
            <text x="320" y="105" className="font-mono" fontSize="10" fill="#888888">1</text>
            <text x="165" y="20" className="font-mono" fontSize="10" fill="#888888">1</text>
            <text x="165" y="195" className="font-mono" fontSize="10" fill="#888888">-1</text>

            <polyline
              fill="none"
              stroke="#111111"
              strokeWidth="1.5"
              opacity="0.4"
              points={scatterPoints
                .map((p, i) => {
                  const cx = ((p.valence + 1) / 2) * 320 + 10 + i * 2;
                  const cy = ((1 - (p.arousal + 1) / 2)) * 180 + 10 + i * 2;
                  return `${cx},${cy}`;
                })
                .join(" ")}
            />

            {scatterPoints.map((point, index) => {
              const cx = ((point.valence + 1) / 2) * 320 + 10 + index * 2;
              const cy = ((1 - (point.arousal + 1) / 2)) * 180 + 10 + index * 2;

              return (
                <motion.circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={8}
                  fill={point.colour}
                  stroke="#111111"
                  strokeWidth={2}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                />
              );
            })}
          </svg>
        </NeoCard>
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selectedSession && getMoodById(selectedSession.moodId)?.label}
            </DrawerTitle>
          </DrawerHeader>
          {selectedSession && (
            <div className="px-4 pb-6">
              <div
                className="w-8 h-8 rounded-full mb-3"
                style={{ backgroundColor: selectedSession.colour, border: "2px solid #111111" }}
              />
              <p className="font-sans text-sm text-[#666666] mb-2">
                {new Date(selectedSession.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {selectedSession.journal && (
                <p className="font-sans text-sm text-[#111111] mb-3">
                  {selectedSession.journal.slice(0, 100)}
                  {selectedSession.journal.length > 100 ? "..." : ""}
                </p>
              )}
              <p className="font-mono text-xs text-[#888888]">
                V: {selectedSession.valence.toFixed(2)} &nbsp; A: {selectedSession.arousal.toFixed(2)}
              </p>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </motion.div>
  );
}
