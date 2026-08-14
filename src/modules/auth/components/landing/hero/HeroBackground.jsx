// ============================================================
// AMIOUT Enterprise Edition
// HeroBackground.jsx
// Premium Animated Background
// ============================================================

import { motion } from "framer-motion";

const HeroBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* ====================================== */}
      {/* Base Background */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* ====================================== */}
      {/* Aurora Gradient */}
      {/* ====================================== */}

      <motion.div
        animate={{
          x: [0, 80, -60, 0],
          y: [0, -40, 50, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -left-40 -top-40 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[120px]"
      />

      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-0 top-10 h-[500px] w-[500px] rounded-full bg-blue-600/15 blur-[120px]"
      />

      <motion.div
        animate={{
          y: [0, -50, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/3 h-[450px] w-[450px] rounded-full bg-violet-600/10 blur-[120px]"
      />

      {/* ====================================== */}
      {/* Grid Background */}
      {/* ====================================== */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ====================================== */}
      {/* Radial Fade */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(2,6,23,0.85)_75%,#020617_100%)]" />

      {/* ====================================== */}
      {/* Part 2 Starts Here */}
      {/* ====================================== */}
      {/* ====================================== */}
      {/* Floating Orbs */}
      {/* ====================================== */}

      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[20%] h-5 w-5 rounded-full bg-cyan-400/70 shadow-[0_0_30px_10px_rgba(34,211,238,0.4)]"
      />

      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -25, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute right-[15%] top-[28%] h-4 w-4 rounded-full bg-blue-400/70 shadow-[0_0_30px_10px_rgba(59,130,246,0.35)]"
      />

      <motion.div
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-[18%] left-[22%] h-6 w-6 rounded-full bg-violet-400/60 shadow-[0_0_40px_12px_rgba(167,139,250,0.35)]"
      />

      {/* ====================================== */}
      {/* Animated Particles */}
      {/* ====================================== */}

      {Array.from({ length: 18 }).map((_, index) => (
        <motion.span
          key={index}
          className="absolute h-1.5 w-1.5 rounded-full bg-white/40"
          style={{
            left: `${5 + index * 5}%`,
            top: `${10 + (index % 6) * 12}%`,
          }}
          animate={{
            y: [0, -18, 0],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 2 + (index % 4),
            repeat: Infinity,
            delay: index * 0.15,
          }}
        />
      ))}

      {/* ====================================== */}
      {/* Top Glow */}
      {/* ====================================== */}

      <div className="absolute inset-x-0 top-0 h-48 bg-linear-to-b from-cyan-500/5 to-transparent" />

      {/* ====================================== */}
      {/* Bottom Fade */}
      {/* ====================================== */}

      <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent" />

      {/* ====================================== */}
      {/* Noise Texture */}
      {/* ====================================== */}

      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* ====================================== */}
      {/* Center Glow */}
      {/* ====================================== */}

      <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-[180px]" />

      {/* ====================================== */}
      {/* Decorative Rings */}
      {/* ====================================== */}

      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.03]" />

      <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500/[0.02]" />

      {/* ====================================== */}
      {/* Part 3 Starts Here */}
      {/* ====================================== */}
      {/* ====================================== */}
      {/* Top Left Light */}
      {/* ====================================== */}

      <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-cyan-400/5 blur-[140px]" />

      {/* ====================================== */}
      {/* Bottom Right Light */}
      {/* ====================================== */}

      <div className="absolute bottom-0 right-0 h-[450px] w-[450px] rounded-full bg-blue-500/5 blur-[150px]" />

      {/* ====================================== */}
      {/* Vignette */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(2,6,23,0.45)_75%,rgba(2,6,23,0.92)_100%)]" />

      {/* ====================================== */}
      {/* Overlay */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-slate-950/5" />
    </div>
  );
};

export default HeroBackground;
