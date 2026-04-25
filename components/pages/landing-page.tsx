"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { getUser } from "@/lib/storage";
import { 
  HappyPinkMood, 
  HappyBlueMood, 
  FrustratedGreenMood,
  SadPurpleMood,
  SadOrangeMood
} from "@/components/common-svgs";
import { NeoButton } from "@/components/neo-button";
import { NeoCard } from "@/components/neo-card";

export function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (getUser()) {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Parallax Vertical Transforms
  const y1 = useTransform(scrollYProgress, [0, 1], ["0vh", "-100vh"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0vh", "-250vh"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0vh", "-150vh"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["0vh", "-300vh"]);
  const y5 = useTransform(scrollYProgress, [0, 1], ["0vh", "-50vh"]);
  
  const opacityText = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.3], ["0vh", "-20vh"]);

  return (
    <div className="bg-[#FFFBF0]">
      {/* Zoom Parallax Section */}
      <div ref={containerRef} className="h-[250vh] relative">
        <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center bg-[#FFFBF0] border-b-[3px] border-[#111111]">
          
          {/* Background Grid */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(to right, #111111 2px, transparent 2px),
                linear-gradient(to bottom, #111111 2px, transparent 2px)
              `,
              backgroundSize: "60px 60px"
            }}
          />

          {/* Parallax SVG Characters */}
          <motion.div style={{ y: y3 }} className="absolute top-[15%] md:top-[20%] left-[5%] md:left-[20%] opacity-80 z-10 w-20 md:w-[130px]">
             <FrustratedGreenMood size="100%" />
          </motion.div>
          
          <motion.div style={{ y: y4 }} className="absolute bottom-[20%] md:bottom-[20%] left-[5%] md:left-[20%] opacity-70 z-10 w-24 md:w-[140px]">
             <SadPurpleMood size="100%" />
          </motion.div>

          <motion.div style={{ y: y2 }} className="absolute top-[15%] md:top-[20%] right-[5%] md:right-[20%] opacity-90 z-10 w-24 md:w-[150px]">
             <HappyBlueMood size="100%" />
          </motion.div>

          <motion.div style={{ y: y5 }} className="absolute bottom-[20%] md:bottom-[20%] right-[5%] md:right-[20%] opacity-60 z-10 w-20 md:w-[120px]">
             <SadOrangeMood size="100%" />
          </motion.div>

          {/* Main Center Character */}
          <motion.div style={{ y: y1 }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center justify-center shadow-[4px_4px_0px_#111111] md:shadow-[8px_8px_0px_#111111] rounded-[2rem] w-48 md:w-[320px]">
            <HappyPinkMood size="100%" />
          </motion.div>

          {/* Hero Title Overlay */}
          <motion.div 
            style={{ opacity: opacityText, y: textY }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center text-center pointer-events-none drop-shadow-[6px_6px_0px_#111111] w-full"
          >
            <h1 
              className="font-heading text-6xl md:text-9xl font-black text-[#111111] uppercase tracking-tighter"
              style={{ WebkitTextStroke: "2px white" }}
            >
              Equilibrium
            </h1>
            <p className="font-sans text-xl md:text-3xl font-bold mt-4 text-white uppercase tracking-widest bg-[#111111] px-4 py-2 border-[3px] border-white -rotate-2">
              Find Your Center
            </p>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div 
            style={{ opacity: opacityText }} 
            className="absolute bottom-10 z-30 flex flex-col items-center gap-2 animate-bounce"
          >
            <span className="font-sans text-sm font-bold uppercase tracking-widest bg-white border-[2px] border-[#111111] px-3 py-1 shadow-[2px_2px_0px_#111111]">
              Scroll Down
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* Features & Journey Section */}
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20 relative z-10 bg-[#FFB8D4] border-t-[3px] border-[#111111]">
         {/* Decorative Grid */}
         <div
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.15]"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111), 
                linear-gradient(45deg, #111111 25%, transparent 25%, transparent 75%, #111111 75%, #111111)
              `,
              backgroundSize: "20px 20px",
              backgroundPosition: "0 0, 10px 10px"
            }}
          />

         <div className="max-w-4xl w-full flex flex-col gap-12 relative z-10">
            <div className="text-center bg-white border-[3px] border-[#111111] p-6 shadow-[8px_8px_0px_#111111] -rotate-1 mb-8">
              <h2 className="font-heading text-4xl md:text-6xl font-black uppercase tracking-wide">Your Journey to Balance</h2>
              <p className="font-sans font-bold text-lg mt-2 text-[#666666]">Understand your emotions. Regain your focus.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NeoCard className="p-8 flex flex-col gap-4 bg-[#FFE566] transition-transform hover:-translate-y-2">
                 <div className="text-5xl mb-2 bg-white w-16 h-16 flex items-center justify-center rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111]">🎭</div>
                 <h3 className="font-heading text-2xl font-black uppercase">Mood Tracking</h3>
                 <p className="font-sans text-sm font-bold text-[#444444] leading-relaxed">Log your emotions daily and visualize your mental state over time using our immersive, interactive character picker.</p>
              </NeoCard>

              <NeoCard className="p-8 flex flex-col gap-4 bg-[#A8E6CF] transition-transform hover:-translate-y-2">
                 <div className="text-5xl mb-2 bg-white w-16 h-16 flex items-center justify-center rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111]">🌬️</div>
                 <h3 className="font-heading text-2xl font-black uppercase">Guided Breathing</h3>
                 <p className="font-sans text-sm font-bold text-[#444444] leading-relaxed">Lower anxiety and regain your focus with beautifully animated, customizable box-breathing and 4-7-8 exercises.</p>
              </NeoCard>

              <NeoCard className="p-8 flex flex-col gap-4 bg-[#C9B8FF] transition-transform hover:-translate-y-2">
                 <div className="text-5xl mb-2 bg-white w-16 h-16 flex items-center justify-center rounded-full border-[3px] border-[#111111] shadow-[4px_4px_0px_#111111]">🤖</div>
                 <h3 className="font-heading text-2xl font-black uppercase">AI Insights</h3>
                 <p className="font-sans text-sm font-bold text-[#444444] leading-relaxed">Receive weekly intelligence summaries highlighting your energy levels, sentiment trends, and personalized affirmations.</p>
              </NeoCard>
            </div>

            <div className="flex justify-center mt-12">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button 
                  onClick={() => navigate("/login")} 
                  className="px-12 py-6 bg-white border-[4px] border-[#111111] rounded-2xl shadow-[8px_8px_0px_#111111] text-[#111111] font-heading font-black text-3xl uppercase tracking-widest hover:shadow-[4px_4px_0px_#111111] hover:translate-x-1 hover:translate-y-1 transition-all active:shadow-none active:translate-x-2 active:translate-y-2"
                >
                  Start Tracking
                </button>
              </motion.div>
            </div>
         </div>
      </div>
    </div>
  );
}
