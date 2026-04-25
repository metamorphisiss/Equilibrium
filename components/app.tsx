"use client";

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { DesktopNav, MobileNav } from "./navigation";
import { LandingPage } from "./pages/landing-page";
import { OnboardingPage } from "./pages/onboarding-page";
import { HomePage } from "./pages/home-page";
import { MoodPickerPage } from "./pages/mood-picker-page";
import { QuestionsPage } from "./pages/questions-page";
import { JournalPage } from "./pages/journal-page";
import { ResultPage } from "./pages/result-page";
import { BreathingPage } from "./pages/breathing-page";
import { CalendarPage } from "./pages/calendar-page";
import { SettingsPage } from "./pages/settings-page";

function AnimatedRoutes() {
  const location = useLocation();
  const showNav = !["/", "/login", "/quiz/mood", "/quiz/questions", "/quiz/journal", "/quiz/result"].includes(
    location.pathname
  );

  return (
    <>
      {showNav && <DesktopNav />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<OnboardingPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/quiz/mood" element={<MoodPickerPage />} />
          <Route path="/quiz/questions" element={<QuestionsPage />} />
          <Route path="/quiz/journal" element={<JournalPage />} />
          <Route path="/quiz/result" element={<ResultPage />} />
          <Route path="/breathing" element={<BreathingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AnimatePresence>
      {showNav && <MobileNav />}
    </>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
