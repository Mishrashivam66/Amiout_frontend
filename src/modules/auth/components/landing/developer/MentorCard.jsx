// ============================================================
// AMIOUT Enterprise Edition
// MentorCard.jsx
// ============================================================

import { motion } from "framer-motion";
import {
  GraduationCap,
  Award,
  BookOpen,
  ShieldCheck,
  Brain,
  Sparkles,
} from "lucide-react";

const MentorCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className="group mx-auto max-w-6xl [perspective:2000px]"
    >
      <div className="relative h-[720px] transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ================================================= */}
        {/* FRONT */}
        {/* ================================================= */}

        <div className="absolute inset-0 overflow-hidden rounded-[40px] border border-yellow-500/20 bg-linear-to-br from-[#111827] via-[#0f172a] to-black p-10 shadow-2xl [backface-visibility:hidden]">
          {/* Glow */}

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-500/20 blur-[120px]" />

          <div className="grid h-full items-center gap-12 lg:grid-cols-[320px_1fr]">
            {/* Photo */}

            <div className="flex flex-col items-center">
              <div className="rounded-full bg-linear-to-br from-yellow-400 via-amber-500 to-orange-500 p-1 shadow-[0_20px_80px_rgba(234,179,8,.35)]">
                <img
                  src="/mentor.jpg"
                  alt="Project Mentor"
                  className="h-72 w-72 rounded-full border-4 border-slate-950 object-cover"
                />
              </div>

              <div className="mt-8 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-5 py-2">
                <span className="flex items-center gap-2 font-semibold text-yellow-300">
                  <GraduationCap className="h-5 w-5" />
                  Academic Mentor
                </span>
              </div>
            </div>

            {/* Content */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-yellow-300">
                <Sparkles className="h-4 w-4" />
                Technical Supervision
              </div>

              <h2 className="mt-6 text-5xl font-black text-white">
                Dr. Dinesh Sharma
              </h2>

              <p className="mt-4 text-2xl font-semibold text-yellow-300">
                Associate Professor • Amity University
              </p>

              <p className="mt-8 text-lg leading-8 text-slate-300">
                Guided the complete AMIOUT development lifecycle through
                academic mentorship, software engineering best practices,
                intelligent system design and architecture reviews.
              </p>

              <div className="mt-10 grid gap-5 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-5">
                  <Award className="h-10 w-10 text-yellow-400" />

                  <div>
                    <h4 className="font-bold text-white">Technical Guidance</h4>

                    <p className="text-sm text-slate-400">
                      Architecture & Review
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-5">
                  <BookOpen className="h-10 w-10 text-cyan-400" />

                  <div>
                    <h4 className="font-bold text-white">Research Support</h4>

                    <p className="text-sm text-slate-400">
                      Innovation & Learning
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-5">
                  <Brain className="h-10 w-10 text-violet-400" />

                  <div>
                    <h4 className="font-bold text-white">AI & Smart Systems</h4>

                    <p className="text-sm text-slate-400">Technical Vision</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-5">
                  <ShieldCheck className="h-10 w-10 text-emerald-400" />

                  <div>
                    <h4 className="font-bold text-white">Quality Assurance</h4>

                    <p className="text-sm text-slate-400">
                      Review & Validation
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* BACK */}
        {/* ================================================= */}

        <div className="absolute inset-0 overflow-y-auto rounded-[40px] border border-yellow-500/20 bg-slate-950 p-10 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h2 className="text-4xl font-black text-white">
            Mentor Contributions
          </h2>

          <p className="mt-3 text-xl text-yellow-300">
            Academic Guidance & Technical Supervision
          </p>

          <div className="mt-10 space-y-6">
            {[
              "Guided the overall software architecture and system planning.",
              "Reviewed frontend and backend implementation strategy.",
              "Provided academic mentorship throughout the project lifecycle.",
              "Supported AI-driven campus automation concepts.",
              "Validated security, scalability and software engineering practices.",
              "Mentored the team in documentation, research and project presentation.",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mt-2 h-3 w-3 rounded-full bg-yellow-400" />

                <p className="leading-8 text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MentorCard;
