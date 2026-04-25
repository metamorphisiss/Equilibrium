"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BreathingBlob } from "@/components/squircle-character";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";
import { getUser, saveUser } from "@/lib/storage";

export function OnboardingPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [focus, setFocus] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = () => {
    if (!name.trim() || !age || !focus) return;

    saveUser({
      name: name.trim(),
      age: parseInt(age, 10),
      focus,
    });

    navigate("/home");
  };

  const isValid = name.trim() && age && focus;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#FFFBF0" }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-8">
        <BreathingBlob colour="#A8E6CF" size={140} />

        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[#111111] mb-2">
            Equilibrium
          </h1>
          <p className="font-sans text-[#666666]">
            A quiet space for your feelings.
          </p>
        </div>

        <NeoCard className="w-full p-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm text-[#666666]">
                What should we call you?
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="font-sans w-full px-4 py-3 bg-[#FFFBF0] text-[#111111] placeholder-[#999999] outline-none"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #111111",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm text-[#666666]">
                Your age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Age"
                min="1"
                max="120"
                className="font-sans w-full px-4 py-3 bg-[#FFFBF0] text-[#111111] placeholder-[#999999] outline-none"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #111111",
                }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-sans text-sm text-[#666666]">
                Primary focus
              </label>
              <div
                className="relative"
                style={{
                  borderRadius: "10px",
                  border: "2px solid #111111",
                }}
              >
                <select
                  value={focus}
                  onChange={(e) => setFocus(e.target.value)}
                  className="font-sans w-full px-4 py-3 bg-[#FFFBF0] text-[#111111] appearance-none outline-none cursor-pointer"
                  style={{ borderRadius: "8px" }}
                >
                  <option value="">Select one</option>
                  <option value="Student">Student</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                    <path d="M1 1L6 6L11 1" stroke="#111111" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </NeoCard>

        <NeoButton
          onClick={handleSubmit}
          fullWidth
          disabled={!isValid}
        >
          Begin Journey
        </NeoButton>
      </div>
    </motion.div>
  );
}
