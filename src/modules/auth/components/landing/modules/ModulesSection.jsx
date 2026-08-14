// ============================================================
// AMIOUT Enterprise Edition
// ModulesSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  GraduationCap,
  UserCheck,
  ShieldCheck,
  ScanLine,
  Settings,
  Crown,
  ArrowRight,
} from "lucide-react";

// ============================================================
// Platform Modules Data
// ============================================================

const modules = [
  {
    id: 1,
    title: "Student Portal",
    icon: GraduationCap,
    color: "from-blue-500 to-cyan-500",
    description:
      "Request outpasses, track approvals, download QR passes and view complete leave history.",
    features: ["Apply Outpass", "QR Pass", "Live Status", "Leave History"],
  },

  {
    id: 2,
    title: "Mentor Portal",
    icon: UserCheck,
    color: "from-violet-500 to-purple-500",
    description:
      "Approve or reject student requests and monitor mentee activities in real time.",
    features: ["Approve Requests", "Student List", "Notifications", "Remarks"],
  },

  {
    id: 3,
    title: "Warden Panel",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-500",
    description:
      "Manage hostel permissions, emergency passes and student movement securely.",
    features: [
      "Final Approval",
      "Emergency Pass",
      "Reports",
      "Hostel Dashboard",
    ],
  },

  {
    id: 4,
    title: "Security Portal",
    icon: ScanLine,
    color: "from-orange-500 to-red-500",
    description:
      "Verify QR codes instantly and maintain secure entry & exit records.",
    features: ["QR Scanner", "Entry Log", "Exit Log", "Verification"],
  },

  {
    id: 5,
    title: "Admin Panel",
    icon: Settings,
    color: "from-pink-500 to-rose-500",
    description:
      "Manage users, departments, notifications and platform configurations.",
    features: ["User Management", "Departments", "Analytics", "Settings"],
  },

  {
    id: 6,
    title: "Super Admin",
    icon: Crown,
    color: "from-yellow-500 to-amber-500",
    description:
      "Complete enterprise control with monitoring, security and system management.",
    features: ["System Control", "Audit Logs", "Roles", "Server Monitoring"],
  },
];

// ============================================================
// Animation Variants
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
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

const ModulesSection = () => {
  return (
    <section
      id="modules"
      className="relative overflow-hidden bg-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ============================= */}
        {/* Section Heading */}
        {/* ============================= */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            Enterprise Modules
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Powerful
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Platform Modules
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Every stakeholder gets a dedicated dashboard with enterprise-grade
            security, real-time monitoring and intelligent workflow automation.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Module Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <motion.div
                key={module.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                {/* Gradient Hover Background */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                />

                {/* Floating Glow */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${module.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Icon */}

                <div
                  className={`relative mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${module.color} shadow-xl`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Title */}

                <h3 className="relative text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                  {module.title}
                </h3>

                {/* Description */}

                <p className="relative mt-4 leading-7 text-slate-400">
                  {module.description}
                </p>

                {/* Feature Chips */}

                <div className="relative mt-6 flex flex-wrap gap-2">
                  {module.features.map((feature, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-300"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Divider */}

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Footer */}

                <div className="relative flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-300">
                    Enterprise Module
                  </span>

                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4" />
                  </motion.div>
                </div>

                {/* Bottom Gradient Border */}

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${module.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Bottom CTA */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-5xl"
        >
          <div className="overflow-hidden rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900 to-blue-500/10 p-10 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  One Platform.
                  <span className="text-cyan-400"> Six Powerful Modules.</span>
                </h3>

                <p className="mt-4 max-w-2xl text-slate-400">
                  Every user—from Student to Super Admin—gets a dedicated,
                  secure dashboard with role-based permissions and real-time
                  workflow management.
                </p>
              </div>

              <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/30">
                Explore Modules
              </button>
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

export default ModulesSection;
