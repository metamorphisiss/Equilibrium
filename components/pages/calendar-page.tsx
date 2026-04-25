"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { NeoCard } from "@/components/neo-card";
import {
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
} from "@/components/common-svgs";

const getMoodSvg = (moodId: string, size: number) => {
  switch (moodId) {
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
import { getSessions, getSessionsForMonth, getDominantMood, calculateStreak, initializeSessions, type Session } from "@/lib/storage";
import { getMoodById, MOODS } from "@/lib/moods";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
const RevealCard = ({
  frontTitle,
  frontSubtitle,
  backTitle,
  backDesc,
  colorHex = "#FFFBF0",
}: {
  frontTitle: React.ReactNode;
  frontSubtitle: string;
  backTitle: string;
  backDesc: string;
  colorHex?: string;
}) => {
  return (
    <div className="group relative block aspect-square cursor-pointer outline-none w-full">
      <span className="absolute inset-0 border-[3px] border-dashed border-[#111111] rounded-xl pointer-events-none"></span>

      <div
        className="relative flex h-full transform flex-col items-center justify-center border-[3px] border-[#111111] bg-white rounded-xl transition-transform duration-300 group-hover:-translate-x-1.5 group-hover:-translate-y-1.5"
        style={{ backgroundColor: colorHex }}
      >
        <div className="p-2 transition-opacity duration-300 group-hover:absolute group-hover:opacity-0 flex flex-col items-center justify-center w-full h-full text-center">
          <div className="font-heading text-3xl md:text-4xl font-black text-[#111111] mb-1">
            {frontTitle}
          </div>
          <div className="font-sans text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#111111]">
            {frontSubtitle}
          </div>
        </div>

        <div className="absolute p-2 opacity-0 transition-opacity duration-300 group-hover:relative group-hover:opacity-100 flex flex-col items-center justify-center w-full h-full text-center">
          <h3 className="text-[10px] md:text-xs font-heading font-bold text-[#111111] uppercase mb-1">
            {backTitle}
          </h3>
          <p className="text-[8px] md:text-[10px] font-sans text-[#111111] leading-tight font-medium">
            {backDesc}
          </p>
        </div>
      </div>
    </div>
  );
};

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    initializeSessions();
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

  const generateInsight = () => {
    if (last7Sessions.length < 3) return "Log a few more sessions to unlock your weekly insights.";
    
    const avgArousal = last7Sessions.reduce((acc, s) => acc + s.arousal, 0) / last7Sessions.length;
    const avgValence = last7Sessions.reduce((acc, s) => acc + s.valence, 0) / last7Sessions.length;
    
    if (avgArousal > 0.3 && avgValence < 0) return "Your energy was high this week, but sentiment was low. This points to stress or anxiety. Try 'Box Breathing' to center yourself.";
    if (avgArousal < -0.3 && avgValence < 0) return "You've had a low-energy, low-sentiment week. It's okay to rest. The 'Calm' breathing pattern might help you ease tension.";
    if (avgValence > 0.3) return "You've had a highly positive week! Keep up whatever routines you've been doing—they are working.";
    return "Your week has been relatively balanced. Maintain your consistency!";
  };

  const getMoodDistributionBar = () => {
    if (last7Sessions.length === 0) return null;
    const counts: Record<string, number> = {};
    last7Sessions.forEach(s => counts[s.moodId] = (counts[s.moodId] || 0) + 1);
    
    return Object.entries(counts).map(([moodId, count]) => {
      const mood = getMoodById(moodId);
      const percentage = (count / last7Sessions.length) * 100;
      return (
        <div 
          key={moodId} 
          style={{ width: `${percentage}%`, backgroundColor: mood?.colour }}
          className="h-full border-r-[3px] last:border-r-0 border-[#111111]"
        />
      );
    });
  };

  const getMoodDistributionLegend = () => {
    if (last7Sessions.length === 0) return null;
    const counts: Record<string, number> = {};
    last7Sessions.forEach(s => counts[s.moodId] = (counts[s.moodId] || 0) + 1);
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([moodId, count]) => {
      const mood = getMoodById(moodId);
      const percentage = Math.round((count / last7Sessions.length) * 100);
      return (
        <div key={moodId} className="flex items-center gap-1.5">
          <div 
            className="w-3 h-3 rounded-full border-[2px] border-[#111111]"
            style={{ backgroundColor: mood?.colour }}
          />
          <span className="font-sans text-[10px] font-bold text-[#111111] uppercase">
            {mood?.label} ({percentage}%)
          </span>
        </div>
      );
    });
  };

  const renderTrendChart = () => {
    if (last7Sessions.length < 2) return null;
    
    const reversed = [...last7Sessions].reverse();
    const width = 300;
    const height = 100;
    const step = width / Math.max(1, reversed.length - 1);
    
    const arousalPoints = reversed.map((s, i) => `${i * step},${height - ((s.arousal + 1) / 2) * height}`).join(" ");
    const valencePoints = reversed.map((s, i) => `${i * step},${height - ((s.valence + 1) / 2) * height}`).join(" ");

    return (
      <svg viewBox={`-5 -5 ${width + 10} ${height + 25}`} className="w-full">
        {/* Guidelines */}
        <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#E5E5E5" strokeWidth="2" strokeDasharray="4 4" />
        
        <polyline points={arousalPoints} fill="none" stroke="#FF6B6B" strokeWidth="3" strokeDasharray="6 4" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={valencePoints} fill="none" stroke="#60A5FA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Legend */}
        <circle cx="10" cy={height + 15} r="5" fill="#60A5FA" stroke="#111111" strokeWidth="2" />
        <text x="20" y={height + 19} fontSize="10" fontWeight="bold" fill="#111111" className="font-sans uppercase">Sentiment</text>
        
        <circle cx="100" cy={height + 15} r="5" fill="#FF6B6B" stroke="#111111" strokeWidth="2" />
        <text x="110" y={height + 19} fontSize="10" fontWeight="bold" fill="#111111" className="font-sans uppercase">Energy</text>
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen pb-24 md:pb-8 relative overflow-hidden"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      {/* Neo-brutalist Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #111111 1px, transparent 1px),
            linear-gradient(to bottom, #111111 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
      />

      <div className="max-w-lg mx-auto px-4 py-6 relative z-10">
        <div className="mb-6 print:hidden">
          <h1 className="font-heading text-3xl font-black text-[#111111] uppercase tracking-wide">
            Monthly Mood Calendar
          </h1>
        </div>

        <NeoCard className="p-5 mb-6 print:hidden">
          <div className="flex items-center justify-between mb-4 border-b-[3px] border-[#111111] pb-4">
            <span className="font-heading text-xl font-bold text-[#111111] uppercase">
              {monthName} {year}
            </span>
            <div className="flex items-center gap-3">
              <button onClick={goToPrevMonth} className="p-2 border-[3px] border-[#111111] rounded-lg bg-white hover:bg-[#FFFBF0] transition-colors shadow-[2px_2px_0px_#111111] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M12 15L7 10L12 5" stroke="#111111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button onClick={goToNextMonth} className="p-2 border-[3px] border-[#111111] rounded-lg bg-white hover:bg-[#FFFBF0] transition-colors shadow-[2px_2px_0px_#111111] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M8 5L13 10L8 15" stroke="#111111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center font-sans text-[10px] font-bold text-[#111111] uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="w-full aspect-square" />
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
                  onClick={(e) => {
                    e.currentTarget.blur();
                    handleDayClick(session);
                  }}
                  className="w-full aspect-square flex items-center justify-center relative"
                  style={{
                    borderRadius: "8px",
                    backgroundColor: mood ? mood.colour : "#FFFBF0",
                    border: isToday(day) ? "3px solid #111111" : session ? "2px solid #111111" : "2px dashed #D4D4D4",
                    boxShadow: session ? "2px 2px 0px #111111" : "none",
                  }}
                >
                  {mood && getMoodSvg(mood.id, 40)}
                </motion.button>
              );
            })}
          </div>
        </NeoCard>

        <div className="mb-3 mt-8 print:hidden">
          <h2 className="font-heading text-2xl font-bold text-[#111111] uppercase tracking-wide">Monthly Summary</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3 mb-8 print:hidden">
          <RevealCard
            frontTitle={<span className="text-5xl font-bold">{monthSessions.length}</span>}
            frontSubtitle={<span className="text-xl font-bold">{"Sessions"}</span>}
            backTitle={<span className="text-xl font-bold">{"TOTAL LOGS"}</span>}
            backDesc={<span className="text-lg font-bold">{"Keep bulding the Habit!"}</span>}
            colorHex="#A8E6CF"
          />
          <RevealCard
            frontTitle={<span className="text-5xl font-bold">{streak}</span>}
            frontSubtitle={<span className="text-xl font-bold">{"Streak"}</span>}
            backTitle={<span className="text-2xl font-bold">{"Current Run"}</span>}
            backDesc={<span className="text-lg font-bold">{"Consistency is the key."}</span>}
            colorHex="#FFB8D4"
          />
          <RevealCard
            frontTitle={
              dominantMood ? (
                <div className="flex items-center justify-center mt-1">
                  {getMoodSvg(dominantMood.id, 50)}
                </div>
              ) : "-"
            }
            frontSubtitle={<span className="text-xl font-bold">{"Top Mood"}</span>}
            backTitle={<span className="text-xl font-bold">{getTopMoodLabel()}</span>}
            backDesc={<span className="text-xl font-bold">{dominantMood ? dominantMood.affirmation : "No dominant mood yet."}</span>}
            colorHex={dominantMood ? dominantMood.colour : "#FFFBF0"}
          />
        </div>

        <div className="mb-3 mt-10 print-break-inside-avoid">
          <h2 className="font-heading text-2xl font-bold text-[#111111] uppercase tracking-wide">7-Day Retrospective</h2>
        </div>

        <NeoCard className="p-5 mb-8 print-break-inside-avoid bg-white">
          <div className="mb-6 p-4 border-[3px] border-[#111111] bg-[#FFFBF0] rounded-xl shadow-[4px_4px_0px_#111111]">
            <p className="font-sans text-xs text-[#111111] font-bold uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="text-lg">💡</span> AI Insight
            </p>
            <p className="font-sans text-sm text-[#111111] font-bold leading-relaxed">
              {generateInsight()}
            </p>
          </div>

          <div className="mb-6">
            <p className="font-sans text-xs text-[#888888] font-bold uppercase tracking-wider mb-2">Mood Distribution</p>
            <div className="w-full h-8 flex border-[3px] border-[#111111] rounded-lg overflow-hidden shadow-[2px_2px_0px_#111111] mb-3">
              {getMoodDistributionBar()}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {getMoodDistributionLegend()}
            </div>
          </div>

          <div>
            <p className="font-sans text-xs text-[#888888] font-bold uppercase tracking-wider mb-2">Energy & Sentiment Trend</p>
            {renderTrendChart()}
          </div>
        </NeoCard>

        {/* Export Button (hidden during actual print) */}
        <div className="pb-12 print-hide">
          <button 
            onClick={() => window.print()}
            className="w-full py-4 bg-[#111111] text-white font-heading font-bold text-lg uppercase tracking-widest rounded-xl border-[3px] border-[#111111] shadow-[4px_4px_0px_rgba(0,0,0,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-[#333333]"
          >
            Export Weekly Report
          </button>
        </div>
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
