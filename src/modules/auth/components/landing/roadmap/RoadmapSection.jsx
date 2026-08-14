// ============================================================
// AMIOUT Enterprise Edition
// RoadmapSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  Search,
  PenTool,
  Database,
  MonitorSmartphone,
  FlaskConical,
  Rocket,
  Bot,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

// ============================================================
// Roadmap Data
// ============================================================

const roadmap = [
  {
    id: 1,
    title: "Research & Planning",
    description:
      "Requirement gathering, problem analysis, workflow design and project planning.",
    icon: Search,
    status: "Completed",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    color: "from-emerald-500 to-green-500",
  },

  {
    id: 2,
    title: "UI / UX Design",
    description:
      "Wireframes, prototypes, responsive layouts and enterprise design system.",
    icon: PenTool,
    status: "Completed",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    color: "from-cyan-500 to-blue-500",
  },

  {
    id: 3,
    title: "Backend Development",
    description:
      "REST APIs, Authentication, Database, Notifications and Role Management.",
    icon: Database,
    status: "Completed",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    color: "from-violet-500 to-purple-500",
  },

  {
    id: 4,
    title: "Frontend Development",
    description:
      "Modern React UI with dashboards, animations and enterprise components.",
    icon: MonitorSmartphone,
    status: "In Progress",
    badgeColor: "bg-amber-500/10 text-amber-400",
    color: "from-orange-500 to-red-500",
  },

  {
    id: 5,
    title: "Testing & QA",
    description:
      "System testing, responsive validation, security testing and bug fixing.",
    icon: FlaskConical,
    status: "Upcoming",
    badgeColor: "bg-slate-700 text-slate-300",
    color: "from-indigo-500 to-blue-600",
  },

  {
    id: 6,
    title: "Deployment",
    description:
      "Production deployment with Docker, cloud hosting and monitoring.",
    icon: Rocket,
    status: "Upcoming",
    badgeColor: "bg-slate-700 text-slate-300",
    color: "from-pink-500 to-rose-500",
  },

  {
    id: 7,
    title: "Future AI Integration",
    description:
      "AI analytics, predictive insights and intelligent campus automation.",
    icon: Bot,
    status: "Future",
    badgeColor: "bg-cyan-500/10 text-cyan-300",
    color: "from-sky-500 to-cyan-500",
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

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
    },
  },
};

// ============================================================
// Component
// ============================================================

const RoadmapSection = () => {
  return (
    <section
      id="roadmap"
      className="relative overflow-hidden bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===================================== */}
        {/* Section Header */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Product Development Journey
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Development
            <span className="bg-linear-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Roadmap
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Follow the complete journey of AMIOUT, from initial research and
            design to enterprise deployment and future AI-powered innovation.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Timeline Starts Here */}
        {/* Part 2 */}
        {/* ===================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="relative mx-auto max-w-5xl"
        >
          {/* Vertical Timeline Line */}

          <div className="absolute left-7 top-0 hidden h-full w-1 rounded-full bg-linear-to-b from-cyan-500 via-blue-500 to-violet-500 lg:block" />

          {roadmap.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="relative mb-12 flex flex-col gap-6 lg:flex-row lg:gap-10"
              >
                {/* Timeline Icon */}

                <div className="relative z-10 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-slate-900 shadow-2xl">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br ${step.color}`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Card */}

                <motion.div
                  whileHover={{
                    y: -6,
                    scale: 1.01,
                  }}
                  transition={{ duration: 0.3 }}
                  className="group relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  {/* Hover Glow */}

                  <div
                    className={`absolute inset-0 bg-linear-to-br ${step.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                  />

                  {/* Floating Blur */}

                  <div
                    className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-linear-to-br ${step.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                  />

                  {/* Top */}

                  <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h3 className="text-2xl font-bold text-white">
                      {step.title}
                    </h3>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${step.badgeColor}`}
                    >
                      {step.status}
                    </span>
                  </div>

                  {/* Description */}

                  <p className="relative mt-5 leading-8 text-slate-400">
                    {step.description}
                  </p>

                  {/* Progress */}

                  <div className="relative mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {step.status === "Completed" ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <span className="text-sm font-medium text-emerald-400">
                            Successfully Completed
                          </span>
                        </>
                      ) : step.status === "In Progress" ? (
                        <>
                          <Clock3 className="h-5 w-5 text-amber-400" />
                          <span className="text-sm font-medium text-amber-400">
                            Currently Developing
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock3 className="h-5 w-5 text-slate-400" />
                          <span className="text-sm font-medium text-slate-400">
                            Planned Phase
                          </span>
                        </>
                      )}
                    </div>

                    <span className="text-sm text-slate-500">
                      Phase {index + 1}
                    </span>
                  </div>

                  {/* Bottom Border */}

                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.35 }}
                    className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${step.color}`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Roadmap Summary */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-6xl"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-linear-to-r from-cyan-500/10 via-slate-900/80 to-violet-500/10 p-10 backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="text-center">
                <h3 className="text-4xl font-black text-emerald-400">3</h3>
                <p className="mt-2 text-slate-400">Completed Phases</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-amber-400">1</h3>
                <p className="mt-2 text-slate-400">In Progress</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-cyan-400">3</h3>
                <p className="mt-2 text-slate-400">Upcoming Phases</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-violet-400">AI</h3>
                <p className="mt-2 text-slate-400">Future Vision</p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ===================================== */}
        {/* Decorative Bottom Glow */}
        {/* ===================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <div className="h-40 w-[700px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
