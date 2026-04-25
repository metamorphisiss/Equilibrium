"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeoCardProps {
  children: React.ReactNode;
  className?: string;
  colour?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
  interactive?: boolean;
  accentColour?: string;
}

export function NeoCard({
  children,
  className,
  colour = "#FFFFFF",
  onClick,
  interactive = false,
  accentColour,
}: NeoCardProps) {
  const Component = interactive ? motion.button : motion.div;

  return (
    <Component
      whileTap={interactive ? { scale: 0.98, x: 4, y: 4, boxShadow: "0px 0px 0px #111111" } : {}}
      onClick={onClick}
      className={cn("relative overflow-hidden", className)}
      style={{
        borderRadius: "16px",
        border: "2px solid #111111",
        backgroundColor: colour,
        boxShadow: "4px 4px 0px #111111",
      }}
    >
      {accentColour && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: accentColour }}
        />
      )}
      {children}
    </Component>
  );
}
