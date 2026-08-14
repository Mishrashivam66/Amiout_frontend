// ============================================================
// AMIOUT Enterprise Edition
// DeveloperSection.jsx
// ============================================================

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import MentorCard from "./MentorCard";
import FounderCard from "./FounderCard";
import TeamMemberCard from "./TeamMemberCard";

const DeveloperSection = () => {
  return (
    <section
      id="developer"
      className="relative overflow-hidden bg-slate-950 py-32"
    >
      {/* ====================================== */}
      {/* Background */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* Grid */}

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

      {/* Glow */}

      <div className="absolute left-0 top-0 h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-violet-500/10 blur-[140px]" />

      {/* ====================================== */}
      {/* Content */}
      {/* ====================================== */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ====================================== */}
        {/* Section Header */}
        {/* ====================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 backdrop-blur-xl">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            <span className="text-sm font-semibold text-cyan-300">
              Meet The Team
            </span>
          </div>

          <h2 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl">
            Built by
            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Passionate Engineers
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-slate-400">
            AMIOUT is designed through collaboration between product
            engineering, academic mentorship, documentation and quality
            assurance to deliver an enterprise-grade Smart Campus Outpass
            Management Platform.
          </p>
        </motion.div>

        {/* ====================================== */}
        {/* Mentor */}
        {/* ====================================== */}

        <div className="mt-24">
          <MentorCard />
        </div>

        {/* ====================================== */}
        {/* Development Team */}
        {/* ====================================== */}

        <div className="mt-28">
          <div className="mb-12 text-center">
            <h3 className="text-4xl font-black text-white">
              Core Development Team
            </h3>

            <p className="mt-3 text-lg text-slate-400">
              Product Engineering • Development • Documentation
            </p>
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            <FounderCard />

            <TeamMemberCard />
          </div>
        </div>

        {/* ====================================== */}
        {/* Engineering Philosophy */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-28"
        >
          <div className="overflow-hidden rounded-[36px] border border-cyan-500/20 bg-gradient-to-br from-slate-900 via-slate-950 to-black">
            {/* Top */}

            <div className="border-b border-white/10 px-10 py-10 text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />

                <span className="text-sm font-semibold text-cyan-300">
                  Engineering Philosophy
                </span>
              </div>

              <h3 className="mt-8 text-5xl font-black text-white">
                We Don't Just Build Software.
              </h3>

              <h2 className="mt-3 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-6xl font-black text-transparent">
                We Build Solutions.
              </h2>

              <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-slate-400">
                Every feature inside AMIOUT is designed to solve real campus
                challenges through secure engineering, thoughtful design and
                scalable architecture.
              </p>
            </div>

            {/* Principles */}

            <div className="grid gap-8 p-10 md:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Real Problems",
                  icon: "🎯",
                  desc: "Built after understanding real university workflows instead of creating demo features.",
                },
                {
                  title: "Enterprise Security",
                  icon: "🛡",
                  desc: "Role Based Access, JWT Authentication, OTP Verification and QR Validation.",
                },
                {
                  title: "Modern Engineering",
                  icon: "💻",
                  desc: "React.js, Node.js, MongoDB and scalable software architecture.",
                },
                {
                  title: "Future Ready",
                  icon: "🧠",
                  desc: "Designed for future AI modules, analytics and smart campus integration.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:-translate-y-3 hover:border-cyan-500/30"
                >
                  <div className="text-5xl">{item.icon}</div>

                  <h4 className="mt-6 text-2xl font-bold text-white">
                    {item.title}
                  </h4>

                  <p className="mt-5 leading-8 text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Quote */}

            <div className="border-t border-white/10 px-10 py-12 text-center">
              <blockquote className="mx-auto max-w-4xl text-2xl font-medium leading-10 text-slate-300 italic">
                "Technology creates the greatest impact when it solves
                real-world problems with simplicity, security and scalability."
              </blockquote>

              <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

                <span className="font-semibold text-cyan-300">
                  Designed & Developed at Amity University Madhya Pradesh
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeveloperSection;
