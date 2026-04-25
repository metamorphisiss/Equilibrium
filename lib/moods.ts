export const BLOB_PATHS = {
  calm: "M 50,0 C 77.6,0 100,22.4 100,50 C 100,77.6 77.6,100 50,100 C 22.4,100 0,77.6 0,50 C 0,22.4 22.4,0 50,0 Z",
  happy: "M 50,5 C 85,0 95,15 100,50 C 95,85 85,100 50,95 C 15,100 5,85 0,50 C 5,15 15,0 50,5 Z",
  anxious: "M 50,10 C 65,5 90,20 90,50 C 90,80 65,95 50,90 C 35,95 10,80 10,50 C 10,20 35,5 50,10 Z",
  lonely: "M 50,20 C 70,20 80,40 80,60 C 80,90 65,100 50,100 C 35,100 20,90 20,60 C 20,40 30,20 50,20 Z",
  frustrated: "M 50,0 C 90,10 100,30 90,50 C 100,70 90,90 50,100 C 10,90 0,70 10,50 C 0,30 10,10 50,0 Z",
  tired: "M 50,30 C 80,30 100,60 90,80 C 80,100 70,100 50,95 C 30,100 20,100 10,80 C 0,60 20,30 50,30 Z",
  grateful: "M 50,0 C 80,0 100,20 90,50 C 80,80 70,100 50,100 C 30,100 20,80 10,50 C 0,20 20,0 50,0 Z",
} as const;

export type MoodId = "happy" | "calm" | "anxious" | "frustrated" | "lonely" | "tired" | "grateful";
export type FaceExpression = "smile" | "neutral" | "worried" | "frown" | "flat";

export interface Mood {
  id: MoodId;
  label: string;
  colour: string;
  valence: number;
  arousal: number;
  blobPath: string;
  faceExpression: FaceExpression;
  journalPrompt: string;
  affirmation: string;
}

export const MOODS: Mood[] = [
  {
    id: "happy",
    label: "Happy",
    colour: "#FFE566",
    valence: 0.8,
    arousal: 0.6,
    blobPath: BLOB_PATHS.happy,
    faceExpression: "smile",
    journalPrompt: "What made today feel good?",
    affirmation: "You showed up for yourself today.",
  },
  {
    id: "calm",
    label: "Calm",
    colour: "#A8E6CF",
    valence: 0.6,
    arousal: -0.5,
    blobPath: BLOB_PATHS.calm,
    faceExpression: "smile",
    journalPrompt: "What helped you feel settled?",
    affirmation: "Rest is productive too.",
  },
  {
    id: "anxious",
    label: "Anxious",
    colour: "#C9B8FF",
    valence: -0.5,
    arousal: 0.7,
    blobPath: BLOB_PATHS.anxious,
    faceExpression: "worried",
    journalPrompt: "What is taking up most of your headspace?",
    affirmation: "You are safe right now.",
  },
  {
    id: "frustrated",
    label: "Frustrated",
    colour: "#FF8C69",
    valence: -0.7,
    arousal: 0.8,
    blobPath: BLOB_PATHS.frustrated,
    faceExpression: "frown",
    journalPrompt: "What felt unfair or blocked today?",
    affirmation: "Your feelings are valid.",
  },
  {
    id: "lonely",
    label: "Lonely",
    colour: "#B8D4FF",
    valence: -0.6,
    arousal: -0.4,
    blobPath: BLOB_PATHS.lonely,
    faceExpression: "neutral",
    journalPrompt: "What kind of connection are you craving?",
    affirmation: "You are not as alone as it feels.",
  },
  {
    id: "tired",
    label: "Tired",
    colour: "#D4D4D4",
    valence: -0.2,
    arousal: -0.7,
    blobPath: BLOB_PATHS.tired,
    faceExpression: "flat",
    journalPrompt: "What has been draining your energy?",
    affirmation: "Small steps count.",
  },
  {
    id: "grateful",
    label: "Grateful",
    colour: "#FFB8D4",
    valence: 0.9,
    arousal: 0.3,
    blobPath: BLOB_PATHS.grateful,
    faceExpression: "smile",
    journalPrompt: "What are you quietly thankful for?",
    affirmation: "Gratitude compounds.",
  },
];

export const MOOD_QUESTIONS: Record<MoodId, { question: string; answers: string[] }[]> = {
  happy: [
    { question: "What sparked this feeling?", answers: ["A good conversation", "Achieving a goal", "Just felt lighter today"] },
    { question: "Did you connect with someone today?", answers: ["Yes, meaningfully", "Briefly, but it helped", "Not really, but I felt okay"] },
    { question: "What would make tomorrow even better?", answers: ["More of the same", "Time for myself", "Connecting with someone I care about"] },
  ],
  calm: [
    { question: "What helped you feel this way?", answers: ["Time alone", "Being in nature", "A slow morning"] },
    { question: "How is your body feeling right now?", answers: ["Relaxed and loose", "Slightly tired but good", "Neutral, not tense"] },
    { question: "What do you want to protect this feeling with?", answers: ["Boundaries", "A quiet evening", "Saying no to extra plans"] },
  ],
  anxious: [
    { question: "What feels most uncertain right now?", answers: ["Work or school", "A relationship", "My future"] },
    { question: "How long have you felt this way?", answers: ["Just today", "A few days", "Longer than I want to admit"] },
    { question: "What would help you feel 10% safer?", answers: ["Talking to someone", "Writing it down", "Taking a short break"] },
  ],
  frustrated: [
    { question: "What triggered this feeling?", answers: ["Something at work", "A person", "Myself"] },
    { question: "Did you feel heard today?", answers: ["Not at all", "Somewhat", "I did not try to speak up"] },
    { question: "What would a small release look like right now?", answers: ["Venting to someone", "Physical movement", "Just sitting with it"] },
  ],
  lonely: [
    { question: "What kind of connection are you missing?", answers: ["Deep conversation", "Physical presence", "Feeling understood"] },
    { question: "When did this feeling start?", answers: ["Today", "This week", "It comes and goes"] },
    { question: "What is one small thing you could do for yourself?", answers: ["Reach out to someone", "Do something I enjoy", "Rest without guilt"] },
  ],
  tired: [
    { question: "How was your sleep last night?", answers: ["Poor", "Okay but not enough", "Fine, but still tired"] },
    { question: "What drained you most today?", answers: ["Work demands", "Emotional labor", "Just existing"] },
    { question: "What does rest look like for you right now?", answers: ["Sleep", "Doing nothing", "Low-effort comfort activity"] },
  ],
  grateful: [
    { question: "What are you most thankful for today?", answers: ["A person in my life", "A small moment", "My own resilience"] },
    { question: "Who contributed to this feeling?", answers: ["Someone close to me", "A stranger", "Myself"] },
    { question: "How can you hold onto this?", answers: ["Write it down", "Share it with someone", "Just sit with it a moment longer"] },
  ],
};

export function getMoodById(id: MoodId): Mood | undefined {
  return MOODS.find((m) => m.id === id);
}
