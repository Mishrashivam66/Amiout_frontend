// ============================================================
// AMIOUT Enterprise Edition
// TrustedSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  GraduationCap,
  Building2,
  Landmark,
  School,
  University,
  ShieldCheck,
} from "lucide-react";

// ============================================================
// Trusted Universities Data
// ============================================================

const trustedUniversities = [
  {
    id: 1,
    name: "Amity University",
    short: "AMITY",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    name: "AKTU",
    short: "AKTU",
    icon: Building2,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    name: "Indian Institute of Technology",
    short: "IIT",
    icon: Landmark,
    color: "from-orange-500 to-red-500",
  },
  {
    id: 4,
    name: "National Institute of Technology",
    short: "NIT",
    icon: School,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 5,
    name: "Future Universities",
    short: "YOUR CAMPUS",
    icon: University,
    color: "from-indigo-500 to-violet-500",
  },
];

// ============================================================
// Animation Variants
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

// ============================================================
// Component
// ============================================================

const TrustedSection = () => {
  return (
    <section
      id="trusted"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-24"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===================================================== */}
        {/* Section Header */}
        {/* ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4" />
            Enterprise Ready Platform
          </div>

          {/* Heading */}
          <h2 className="text-4xl font-black leading-tight text-white md:text-5xl">
            Trusted by
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Modern Universities
            </span>
          </h2>

          {/* Description */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            AMIOUT is designed as a scalable enterprise platform that can
            digitally manage campus mobility, hostel outpasses, approvals,
            security verification, and real-time student tracking.
          </p>
        </motion.div>

        {/* ===================================================== */}
        {/* University Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
        >
          {trustedUniversities.map((university) => {
            const Icon = university.icon;

            return (
              <motion.div
                key={university.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                {/* Hover Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${university.color} opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
                />

                {/* Border Glow */}
                <div className="absolute inset-0 rounded-3xl border border-white/5 group-hover:border-cyan-400/40 transition-all duration-500" />

                {/* Floating Blur */}
                <div
                  className={`absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br ${university.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Icon */}
                <div
                  className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${university.color} shadow-xl`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* University Short Name */}
                <h3 className="relative text-xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                  {university.short}
                </h3>

                {/* Full Name */}
                <p className="relative mt-2 text-sm leading-6 text-slate-400">
                  {university.name}
                </p>

                {/* Enterprise Badge */}
                <div className="relative mt-6 inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Enterprise Ready
                </div>

                {/* Bottom Line Animation */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.35 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${university.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================================== */}
        {/* Bottom Information */}
        {/* ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mt-20 max-w-5xl"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/60 to-blue-500/10 p-8 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              {/* Left */}
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Built for the Next Generation of Smart Campuses
                </h3>

                <p className="mt-3 max-w-2xl text-slate-400">
                  AMIOUT is designed with enterprise architecture, secure
                  authentication, QR verification, role-based access control,
                  and scalable infrastructure suitable for modern universities.
                </p>
              </div>

              {/* Right */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <h4 className="text-3xl font-black text-cyan-400">10+</h4>
                  <p className="mt-1 text-sm text-slate-400">Campus Modules</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <h4 className="text-3xl font-black text-emerald-400">
                    99.9%
                  </h4>
                  <p className="mt-1 text-sm text-slate-400">Secure Platform</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ===================================================== */}
        {/* Decorative Bottom Blur */}
        {/* ===================================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <div className="h-40 w-[700px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default TrustedSection;
