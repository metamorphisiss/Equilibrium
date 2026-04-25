"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { NeoCard } from "@/components/neo-card";
import { NeoChip } from "@/components/neo-button";
import { MOOD_QUESTIONS, type Mood } from "@/lib/moods";

interface LocationState {
  mood: Mood;
  valence: number;
  arousal: number;
}

export function QuestionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    if (!state?.mood) {
      navigate("/quiz/mood", { replace: true });
    }
  }, [state, navigate]);

  if (!state?.mood) return null;

  const questions = MOOD_QUESTIONS[state.mood.id];
  const question = questions[currentQuestion];

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      navigate("/quiz/journal", {
        state: {
          ...state,
          answers: newAnswers,
        },
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="flex items-center px-4 py-3">
        <BackButton onClick={() => navigate(-1)} />
      </div>

      <div className="flex gap-1 px-4 mb-6">
        {questions.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-2"
            style={{
              backgroundColor: index <= currentQuestion ? state.mood.colour : "#E5E5E5",
              borderLeft: index > 0 ? "2px solid #FFFBF0" : "none",
            }}
          />
        ))}
      </div>

      <div className="flex-1 px-4 pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            <NeoCard className="p-6" accentColour={state.mood.colour}>
              <h2 className="font-heading text-xl font-bold text-[#111111] mb-6 mt-2">
                {question.question}
              </h2>

              <div className="flex flex-col gap-3">
                {question.answers.map((answer, index) => (
                  <motion.div
                    key={index}
                    whileTap={{ scale: 0.97, x: 4, y: 4 }}
                  >
                    <NeoChip
                      onClick={() => handleAnswer(answer)}
                      className="w-full text-left py-4 px-4"
                    >
                      {answer}
                    </NeoChip>
                  </motion.div>
                ))}
              </div>
            </NeoCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
