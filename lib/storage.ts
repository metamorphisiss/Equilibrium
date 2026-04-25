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
  const sessions: Session[] = [];

  const journalEntries: Record<string, string[]> = {
    calm: ["Took a long walk today and felt really at peace with everything.", "Read a book for an hour, feeling very centered.", "Meditated this morning. The rest of the day flowed easily."],
    anxious: ["Got really overwhelmed with my deadline today. My chest feels tight.", "Overthinking a conversation I had earlier. Hard to focus.", "Feeling jittery and unable to sit still."],
    happy: ["Had lunch with an old friend! Laughed so much.", "Finally finished that big project. I'm so relieved and proud.", "Just a really good day. Everything seemed to go right."],
    tired: ["Barely slept last night. Dragging myself through today.", "Long week. I just want to curl up in bed and watch TV.", "Mental exhaustion is hitting me hard this afternoon."],
    grateful: ["Reflecting on how lucky I am to have my supportive friends.", "Someone bought my coffee today! It really made my morning.", "Just thankful for my health and a quiet evening."],
    sad: ["Feeling really down today for no specific reason.", "Things feel a bit heavy and bleak today, just taking it slow.", "Feeling disconnected. Watched a movie to distract myself."],
    angry: ["Someone cut me off in traffic and it ruined my morning mood.", "So frustrated with how the meeting went. Nobody listened.", "Just feeling irritable and snappy at everyone today."],
    focused: ["Got into a deep flow state and knocked out so much work.", "Really productive morning. Cleared my entire to-do list.", "Feeling sharp and completely locked in on my goals."],
  };

  // Generate 25 days of mock data
  for (let i = 0; i < 25; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (i + 1));
    
    // Randomly pick a mood
    const mood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const entries = journalEntries[mood.id] || ["Just a normal day."];
    const journal = entries[Math.floor(Math.random() * entries.length)];

    sessions.push({
      id: Date.now() - i * 100000,
      date: date.toISOString().split("T")[0],
      moodId: mood.id as MoodId,
      colour: mood.colour,
      valence: Math.max(-1, Math.min(1, mood.valence + (Math.random() - 0.5) * 0.2)),
      arousal: Math.max(-1, Math.min(1, mood.arousal + (Math.random() - 0.5) * 0.2)),
      answers: ["I felt productive", "Got some exercise", "Slept well"],
      journal,
      affirmation: mood.affirmation,
    });
  }

  return sessions;
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
