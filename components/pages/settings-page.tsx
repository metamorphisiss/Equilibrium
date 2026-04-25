"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BackButton } from "@/components/navigation";
import { NeoCard } from "@/components/neo-card";
import { NeoButton } from "@/components/neo-button";
import { getUser, clearStorage, type User } from "@/lib/storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SettingsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const handleReset = () => {
    clearStorage();
    navigate("/");
  };

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
        <div className="flex items-center mb-6">
          <BackButton onClick={() => navigate(-1)} />
          <h1 className="font-heading text-xl font-bold text-[#111111] ml-2">
            Settings
          </h1>
        </div>

        <NeoCard className="p-5 mb-4">
          <h2 className="font-heading text-lg font-bold text-[#111111] mb-4">
            Profile
          </h2>
          {user ? (
            <div className="flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#666666]">Name</span>
                <span className="font-sans text-sm text-[#111111] font-medium">
                  {user.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#666666]">Age</span>
                <span className="font-sans text-sm text-[#111111] font-medium">
                  {user.age}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-sans text-sm text-[#666666]">Focus</span>
                <span className="font-sans text-sm text-[#111111] font-medium">
                  {user.focus}
                </span>
              </div>
            </div>
          ) : (
            <p className="font-sans text-sm text-[#666666]">No user data found</p>
          )}
        </NeoCard>

        <NeoCard className="p-5" colour="#FF6B6B">
          <h2 className="font-heading text-lg font-bold text-white mb-3">
            Danger Zone
          </h2>
          <p className="font-sans text-sm text-white opacity-90 mb-4">
            This will permanently delete all your session data.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <NeoButton variant="secondary" fullWidth>
                Reset Application
              </NeoButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will wipe all your session data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset}>
                  Yes, reset everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </NeoCard>
      </div>
    </motion.div>
  );
}
