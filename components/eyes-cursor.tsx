"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function EyesCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring for the cursor movement
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 16); // Center the 32px wide SVG
      cursorY.set(e.clientY - 8);  // Center the 16px high SVG
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if we are hovering over something clickable
      if (target) {
        const computedStyle = window.getComputedStyle(target);
        const clickable = 
          computedStyle.cursor === "pointer" || 
          target.tagName.toLowerCase() === "button" || 
          target.tagName.toLowerCase() === "a" ||
          target.closest("button") !== null ||
          target.closest("a") !== null;
        
        setIsHovering(clickable);
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  // If on a touch device, we usually don't want a custom cursor
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        * { cursor: none !important; }
      `}} />
      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[9999] drop-shadow-md"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <svg width="32" height="16" viewBox="0 0 32 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isHovering ? (
            // Happy ^ ^ Eyes when hovering over buttons/links
            <>
              <path d="M 4 10 Q 8 2 12 10" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 20 10 Q 24 2 28 10" stroke="black" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Little blush */}
              <ellipse cx="4" cy="12" rx="3" ry="2" fill="#FF8A80" opacity="0.8" />
              <ellipse cx="28" cy="12" rx="3" ry="2" fill="#FF8A80" opacity="0.8" />
            </>
          ) : (
            // Normal cute round eyes looking around
            <>
              <circle cx="8" cy="8" r="7" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="8" cy="8" r="3" fill="black" />
              <circle cx="9" cy="7" r="1" fill="white" />
              
              <circle cx="24" cy="8" r="7" fill="white" stroke="black" strokeWidth="2" />
              <circle cx="24" cy="8" r="3" fill="black" />
              <circle cx="25" cy="7" r="1" fill="white" />
            </>
          )}
        </svg>
      </motion.div>
    </>
  );
}
