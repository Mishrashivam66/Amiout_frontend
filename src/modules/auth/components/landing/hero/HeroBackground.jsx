// ============================================================
// HeroBackground.jsx
// Clean Premium Background
// ============================================================

import { motion } from "framer-motion";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-black" />

      {/* Aurora */}
      <motion.div
        animate={{
          x: [0, 80, -50, 0],
          y: [0, -30, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 40, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/15 blur-[120px]"
      />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
        }}
        className="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-[120px]"
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating Dots */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-cyan-300/70"
          style={{
            left: `${10 + i * 8}%`,
            top: `${15 + (i % 5) * 15}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 3 + (i % 2),
            repeat: Infinity,
            delay: i * 0.3,
          }}
        />
      ))}

      {/* Center Glow */}
      <div className="absolute left-1/2 top-1/2 h-[550px] w-[550px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[180px]" />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(2,6,23,0.75)_100%)]" />
    </div>
  );
};

export default HeroBackground;
