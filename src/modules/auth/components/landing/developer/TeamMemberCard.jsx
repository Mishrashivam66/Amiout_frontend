// ============================================================
// AMIOUT Enterprise Edition
// TeamMemberCard.jsx
// ============================================================

import { motion } from "framer-motion";
import {
  FileText,
  Search,
  ClipboardCheck,
  BookOpen,
  Users,
  Sparkles,
} from "lucide-react";

const TeamMemberCard = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      viewport={{ once: true }}
      className="group relative h-[760px] [perspective:2000px]"
    >
      <div className="relative h-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* ================= FRONT ================= */}

        <div className="absolute inset-0 overflow-hidden rounded-[36px] border border-violet-500/20 bg-linear-to-br from-slate-900 via-slate-950 to-black p-8 shadow-[0_20px_80px_rgba(0,0,0,.45)] [backface-visibility:hidden]">
          <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />

          <div className="flex h-full flex-col items-center justify-center">
            {/* IMAGE */}

            <div className="rounded-full bg-linear-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-1">
              <img
                src="/ayush.jpeg"
                alt="Ayush Tiwari"
                className="h-56 w-56 rounded-full border-4 border-slate-950 object-cover"
              />
            </div>

            {/* Badge */}

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-5 py-2">
              <Sparkles className="h-4 w-4 text-violet-400" />

              <span className="text-sm font-semibold text-violet-300">
                Core Team
              </span>
            </div>

            <h2 className="mt-8 text-center text-4xl font-black text-white">
              Ayush Tiwari
            </h2>

            <p className="mt-3 text-center text-xl font-semibold text-violet-300">
              Documentation • QA • Research Support
            </p>

            <p className="mt-8 max-w-md text-center leading-8 text-slate-300">
              Contributed to documentation, testing, feature validation, project
              reports, research activities and quality assurance throughout the
              AMIOUT development lifecycle.
            </p>

            {/* Skills */}

            <div className="mt-10 grid w-full grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <FileText className="h-8 w-8 text-violet-400" />
                <div>
                  <h4 className="font-semibold text-white">Documentation</h4>
                  <p className="text-sm text-slate-400">Technical Writing</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <ClipboardCheck className="h-8 w-8 text-emerald-400" />
                <div>
                  <h4 className="font-semibold text-white">QA Testing</h4>
                  <p className="text-sm text-slate-400">Validation</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Search className="h-8 w-8 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-white">Research</h4>
                  <p className="text-sm text-slate-400">Analysis</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Users className="h-8 w-8 text-orange-400" />
                <div>
                  <h4 className="font-semibold text-white">Collaboration</h4>
                  <p className="text-sm text-slate-400">Team Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= BACK ================= */}

        <div className="absolute inset-0 overflow-y-auto rounded-[36px] border border-violet-500/20 bg-slate-950 p-8 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h2 className="text-4xl font-black text-white">Ayush Tiwari</h2>

          <p className="mt-3 text-xl font-semibold text-violet-300">
            Documentation • QA • Research Support
          </p>

          <p className="mt-8 leading-8 text-slate-300">
            Assisted in project documentation, software testing, feature
            validation, research activities and presentation preparation,
            ensuring quality and completeness across the AMIOUT platform.
          </p>

          <div className="mt-10">
            <h3 className="mb-6 text-2xl font-bold text-white">
              Key Contributions
            </h3>

            <div className="space-y-4">
              {[
                "Prepared project documentation and reports",
                "Supported testing and feature validation",
                "Performed UI and workflow verification",
                "Contributed to requirement analysis",
                "Assisted in research and presentation",
                "Collaborated throughout the development lifecycle",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-violet-400" />

                  <p className="leading-7 text-slate-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              "Documentation",
              "QA",
              "Testing",
              "Research",
              "Validation",
              "Presentation",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
            <BookOpen className="mx-auto mb-3 h-10 w-10 text-violet-400" />

            <p className="italic leading-7 text-slate-300">
              "Good documentation and thorough testing transform great ideas
              into reliable software products."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberCard;
