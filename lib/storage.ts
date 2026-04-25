import type { MoodId } from "./moods";
import { MOODS } from "./moods";

export interface User {
  name: string;
  age: number;
  focus: string;
}

export interface Session {
  id: number;
  date: string;
  moodId: MoodId;
  colour: string;
  valence: number;
  arousal: number;
  answers: string[];
  journal: string;
  affirmation: string;
}

const USER_KEY = "eq_user";
const SESSIONS_KEY = "eq_sessions";

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function addSession(session: Session): void {
  const sessions = getSessions();
  sessions.unshift(session);
  saveSessions(sessions);
}

export function clearStorage(): void {
  localStorage.clear();
}

export function generateMockSessions(): Session[] {
  const now = new Date();
  const mockMoods: MoodId[] = ["calm", "anxious", "happy", "tired", "grateful"];

  return mockMoods.map((moodId, index) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (index + 1));
    const mood = MOODS.find((m) => m.id === moodId)!;

    return {
      id: Date.now() - index * 100000,
      date: date.toISOString().split("T")[0],
      moodId,
      colour: mood.colour,
      valence: mood.valence + (Math.random() - 0.5) * 0.2,
      arousal: mood.arousal + (Math.random() - 0.5) * 0.2,
      answers: ["Sample answer 1", "Sample answer 2", "Sample answer 3"],
      journal: "This is a sample journal entry for demonstration purposes.",
      affirmation: mood.affirmation,
    };
  });
}

export function initializeSessions(): void {
  const sessions = getSessions();
  if (sessions.length === 0) {
    saveSessions(generateMockSessions());
  }
}

export function calculateStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionDates = new Set(sessions.map((s) => s.date.split("T")[0]));
  let streak = 0;
  const checkDate = new Date(today);

  while (true) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (sessionDates.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (streak === 0) {
      checkDate.setDate(checkDate.getDate() - 1);
      const prevDateStr = checkDate.toISOString().split("T")[0];
      if (sessionDates.has(prevDateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    } else {
      break;
    }
  }

  return streak;
}

export function getSessionsForMonth(year: number, month: number): Session[] {
  const sessions = getSessions();
  return sessions.filter((s) => {
    const d = new Date(s.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });
}

export function getDominantMood(sessions: Session[]): MoodId | null {
  if (sessions.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const s of sessions) {
    counts[s.moodId] = (counts[s.moodId] || 0) + 1;
  }

  let maxCount = 0;
  let dominantMood: MoodId | null = null;

  for (const [moodId, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = moodId as MoodId;
    }
  }

  return dominantMood;
}
