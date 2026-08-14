// ============================================================
// AMIOUT Enterprise Edition
// FounderCard.jsx
// Part 1
// ============================================================

import { motion } from "framer-motion";

import {
  Crown,
  Sparkles,
  Code2,
  Database,
  Cpu,
  ShieldCheck,
  Globe,
  Server,
} from "lucide-react";

const FounderCard = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      viewport={{
        once: true,
      }}
      className="group relative h-[760px] [perspective:2000px]"
    >
      <div className="relative h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ================================================= */}
        {/* FRONT */}
        {/* ================================================= */}

        <div className="absolute inset-0 overflow-hidden rounded-[36px] border border-cyan-500/20 bg-linear-to-br from-slate-900 via-slate-950 to-black p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)] [backface-visibility:hidden]">
          {/* Glow */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/20 blur-[120px]" />

          {/* Founder Badge */}

          <div className="absolute right-8 top-8">
            <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-5 py-2">
              <Crown className="h-4 w-4 text-cyan-400" />

              <span className="text-sm font-bold text-cyan-300">Founder</span>
            </div>
          </div>

          <div className="relative flex h-full flex-col items-center justify-center">
            {/* Profile */}

            <div className="rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-violet-500 p-1 shadow-[0_25px_80px_rgba(59,130,246,.35)]">
              <img
                src="/shivam.jpeg"
                alt="Shivam Kumar Mishra"
                className="h-56 w-56 rounded-full border-4 border-slate-950 object-cover"
              />
            </div>

            {/* Badge */}

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />

              <span className="text-sm font-semibold text-cyan-300">
                Product Architect
              </span>
            </div>

            {/* Name */}

            <h2 className="mt-8 text-center text-4xl font-black text-white">
              Shivam Kumar Mishra
            </h2>

            {/* Role */}

            <p className="mt-3 text-center text-xl font-semibold text-cyan-300">
              Founder • Lead Full Stack Developer
            </p>

            {/* Description */}

            <p className="mt-8 max-w-md text-center leading-8 text-slate-300">
              Conceived, architected and led the complete development of AMIOUT
              including frontend, backend, authentication, database
              architecture, security implementation, dashboard engineering and
              enterprise workflow automation.
            </p>

            {/* Skills */}

            <div className="mt-10 grid w-full grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Code2 className="h-8 w-8 text-cyan-400" />

                <div>
                  <h4 className="font-semibold text-white">React.js</h4>

                  <p className="text-sm text-slate-400">Frontend</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Server className="h-8 w-8 text-blue-400" />

                <div>
                  <h4 className="font-semibold text-white">Node.js</h4>

                  <p className="text-sm text-slate-400">Backend</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Database className="h-8 w-8 text-emerald-400" />

                <div>
                  <h4 className="font-semibold text-white">MongoDB</h4>

                  <p className="text-sm text-slate-400">Database</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <ShieldCheck className="h-8 w-8 text-violet-400" />

                <div>
                  <h4 className="font-semibold text-white">Security</h4>

                  <p className="text-sm text-slate-400">Enterprise</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* BACK STARTS HERE */}
        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <div className="absolute inset-0 overflow-y-auto rounded-[36px] border border-cyan-500/20 bg-slate-950 p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {/* Header */}

          <h2 className="text-4xl font-black text-white">
            Shivam Kumar Mishra
          </h2>

          <p className="mt-3 text-xl font-semibold text-cyan-300">
            Founder • Lead Full Stack Developer
          </p>

          {/* About */}

          <p className="mt-8 leading-8 text-slate-300">
            Led the complete product lifecycle of AMIOUT from idea to
            implementation. Responsible for architecture planning, frontend
            engineering, backend development, authentication, API design,
            database modeling, UI/UX, deployment planning and overall product
            strategy.
          </p>

          {/* ====================================== */}
          {/* Key Responsibilities */}
          {/* ====================================== */}

          <div className="mt-10">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Key Responsibilities
            </h3>

            <div className="space-y-4">
              {[
                "Designed complete AMIOUT product architecture",
                "Developed frontend using React.js & Tailwind CSS",
                "Built backend APIs using Node.js & Express.js",
                "Designed MongoDB database architecture",
                "Implemented JWT Authentication & Role Based Access",
                "Developed QR Verification workflow",
                "Built Admin Dashboard & Analytics",
                "Integrated real-time notifications",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-cyan-400" />

                  <p className="leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ====================================== */}
          {/* Statistics */}
          {/* ====================================== */}

          <div className="mt-10 grid grid-cols-2 gap-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <Code2 className="mx-auto mb-3 h-10 w-10 text-cyan-400" />

              <h3 className="text-3xl font-black text-white">60+</h3>

              <p className="mt-2 text-sm text-slate-400">React Components</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <Database className="mx-auto mb-3 h-10 w-10 text-emerald-400" />

              <h3 className="text-3xl font-black text-white">40+</h3>

              <p className="mt-2 text-sm text-slate-400">Backend APIs</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <Cpu className="mx-auto mb-3 h-10 w-10 text-violet-400" />

              <h3 className="text-3xl font-black text-white">AI</h3>

              <p className="mt-2 text-sm text-slate-400">Smart Features</p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
              <Globe className="mx-auto mb-3 h-10 w-10 text-orange-400" />

              <h3 className="text-3xl font-black text-white">100%</h3>

              <p className="mt-2 text-sm text-slate-400">Product Ownership</p>
            </div>
          </div>

          {/* ====================================== */}
          {/* Tech Stack */}
          {/* ====================================== */}

          <div className="mt-10">
            <h3 className="mb-5 text-xl font-bold text-white">
              Core Technologies
            </h3>

            <div className="flex flex-wrap gap-3">
              {[
                "React.js",
                "Node.js",
                "Express.js",
                "MongoDB",
                "JWT",
                "Socket.IO",
                "Tailwind CSS",
                "Docker",
              ].map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* ================================================= */}
          {/* PART 3 STARTS HERE */}
          {/* ================================================= */}
          {/* ====================================== */}
          {/* Footer */}
          {/* ====================================== */}

          <div className="mt-10 border-t border-white/10 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Status */}

              <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

                <span className="text-sm font-medium text-emerald-400">
                  Building AMIOUT Enterprise Edition
                </span>
              </div>

              {/* Founder Badge */}

              <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
                <span className="text-sm font-semibold text-cyan-300">
                  Founder • Product Architect
                </span>
              </div>
            </div>

            {/* Quote */}

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-center text-base italic leading-8 text-slate-300">
                "Technology should solve real-world problems. AMIOUT is built to
                transform traditional campus mobility into a secure, intelligent
                and enterprise-grade digital experience."
              </p>
            </div>

            {/* Social Placeholder */}

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300">
                GitHub
              </button>

              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300">
                LinkedIn
              </button>

              <button className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-300">
                Portfolio
              </button>
            </div>

            {/* Bottom */}

            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Designed & Developed with ❤️ at
              </p>

              <h4 className="mt-2 text-lg font-bold text-white">
                Amity University Madhya Pradesh
              </h4>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FounderCard;
