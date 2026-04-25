"use client";

import React, { useEffect, useRef, useState } from 'react';
import {
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
} from "./common-svgs";

const MOOD_ICONS = [
  HappyGreenMood,
  SadOrangeMood,
  FrustratedGreenMood,
  SadBlueMood,
  SadPurpleMood,
  HappyBlueMood,
  HappyPinkMood
];

interface Ball {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  mass: number;
}

export const Ballpit = ({ 
  count = 30, 
  colors = ['#FF8C69', '#FFE566', '#A8E6CF', '#C9B8FF', '#FFB8D4'],
  ...props
}: any) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  
  // Format numeric colors to CSS hex strings if necessary
  const formattedColors = colors.map((c: any) => 
    typeof c === 'number' ? '#' + c.toString(16).padStart(6, '0') : c
  );

  const [balls] = useState<Ball[]>(() => {
    const arr: Ball[] = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 10 + 35; // 35 to 45px
      arr.push({
        id: i,
        x: Math.random() * 300,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        radius,
        color: formattedColors[Math.floor(Math.random() * formattedColors.length)],
        mass: radius
      });
    }
    return arr;
  });

  const ballsRef = useRef<Ball[]>(balls);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Scatter balls safely inside the bounds on mount
    ballsRef.current.forEach(b => {
       b.x = Math.random() * (width - b.radius * 2) + b.radius;
       b.y = Math.random() * (height - b.radius * 2) + b.radius;
    });

    const updatePhysics = () => {
      const b = ballsRef.current;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const ptr = pointerRef.current;

      for (let i = 0; i < b.length; i++) {
        const ball = b[i];
        
        // Gravity & friction
        ball.vy += 0.3; // gravity
        ball.vx *= 0.99; // air friction
        ball.vy *= 0.99;

        // Pointer repulsion
        if (ptr.active) {
          const dx = ball.x - ptr.x;
          const dy = ball.y - ptr.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const force = (120 - dist) / 120;
            ball.vx += (dx / dist) * force * 4;
            ball.vy += (dy / dist) * force * 4;
          }
        }

        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.7; // bounce dampening
        } else if (ball.x + ball.radius > w) {
          ball.x = w - ball.radius;
          ball.vx *= -0.7;
        }

        // Floor / Ceiling collisions
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -0.7;
        } else if (ball.y + ball.radius > h) {
          ball.y = h - ball.radius;
          ball.vy *= -0.7;
          ball.vx *= 0.95; // floor friction
        }
      }

      // Ball-to-ball elastic collisions
      for (let i = 0; i < b.length; i++) {
        for (let j = i + 1; j < b.length; j++) {
          const b1 = b[i];
          const b2 = b[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist && dist > 0) {
            const angle = Math.atan2(dy, dx);
            const sin = Math.sin(angle);
            const cos = Math.cos(angle);

            // Rotate velocities to match collision angle
            const vx1 = b1.vx * cos + b1.vy * sin;
            const vy1 = b1.vy * cos - b1.vx * sin;
            const vx2 = b2.vx * cos + b2.vy * sin;
            const vy2 = b2.vy * cos - b2.vx * sin;

            // 1D elastic collision
            const vx1Final = ((b1.mass - b2.mass) * vx1 + 2 * b2.mass * vx2) / (b1.mass + b2.mass);
            const vx2Final = ((b2.mass - b1.mass) * vx2 + 2 * b1.mass * vx1) / (b1.mass + b2.mass);

            // Rotate velocities back
            b1.vx = vx1Final * cos - vy1 * sin;
            b1.vy = vy1 * cos + vx1Final * sin;
            b2.vx = vx2Final * cos - vy2 * sin;
            b2.vy = vy2 * cos + vx2Final * sin;

            // Resolve positional overlap
            const overlap = minDist - dist;
            const resX = (overlap * cos) / 2;
            const resY = (overlap * sin) / 2;
            b1.x -= resX;
            b1.y -= resY;
            b2.x += resX;
            b2.y += resY;
          }
        }
      }

      // Update actual DOM elements efficiently via translate3d
      const elements = container.children;
      for (let i = 0; i < b.length; i++) {
        const ball = b[i];
        const el = elements[i] as HTMLElement;
        if (el) {
          el.style.transform = `translate3d(${ball.x - ball.radius}px, ${ball.y - ball.radius}px, 0)`;
        }
      }

      requestRef.current = requestAnimationFrame(updatePhysics);
    };

    requestRef.current = requestAnimationFrame(updatePhysics);

    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full relative overflow-hidden bg-transparent"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => { pointerRef.current.active = false; }}
      onPointerDown={(e) => { 
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          pointerRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
        }
      }}
      onPointerUp={() => { pointerRef.current.active = false; }}
      style={{ touchAction: 'none' }}
    >
      {balls.map((b, i) => {
        const MoodIcon = MOOD_ICONS[i % MOOD_ICONS.length];
        return (
          <div
            key={b.id}
            className="absolute top-0 left-0"
            style={{
              width: `${b.radius * 2}px`,
              height: `${b.radius * 2}px`,
              willChange: 'transform'
            }}
          >
            <MoodIcon size={b.radius * 2} />
          </div>
        );
      })}
    </div>
  );
};
