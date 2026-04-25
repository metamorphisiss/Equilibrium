"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeoButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}

export function NeoButton({
  children,
  onClick,
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className,
  type = "button",
}: NeoButtonProps) {
  const baseStyles = "font-heading font-semibold text-base px-6 py-3 transition-all duration-100";
  
  const variantStyles = {
    primary: "bg-[#111111] text-white",
    secondary: "bg-[#FFFBF0] text-[#111111]",
    danger: "bg-[#FF6B6B] text-white",
  };

  return (
    <motion.button
      type={type}
      whileTap={disabled ? {} : { scale: 0.97, x: 4, y: 4, boxShadow: "0px 0px 0px #111111" }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variantStyles[variant],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{
        borderRadius: "10px",
        border: "2px solid #111111",
        boxShadow: disabled ? "none" : "4px 4px 0px #111111",
      }}
    >
      {children}
    </motion.button>
  );
}

interface NeoChipProps {
  children: React.ReactNode;
  selected?: boolean;
  colour?: string;
  onClick?: () => void;
  className?: string;
}

export function NeoChip({
  children,
  selected = false,
  colour,
  onClick,
  className,
}: NeoChipProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.97, x: 2, y: 2, boxShadow: "0px 0px 0px #111111" }}
      onClick={onClick}
      className={cn(
        "font-sans px-4 py-2 transition-all duration-100",
        selected ? "font-semibold" : "font-normal",
        className
      )}
      style={{
        borderRadius: "20px",
        border: selected ? "2px solid #111111" : "1.5px solid #111111",
        backgroundColor: selected ? (colour || "#A8E6CF") : "#FFFBF0",
        boxShadow: selected ? "3px 3px 0px #111111" : "2px 2px 0px #111111",
        color: "#111111",
      }}
    >
      {children}
    </motion.button>
  );
}
