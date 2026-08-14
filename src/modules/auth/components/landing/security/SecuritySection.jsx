// ============================================================
// AMIOUT Enterprise Edition
// SecuritySection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  ShieldCheck,
  KeyRound,
  Lock,
  Fingerprint,
  RefreshCcw,
  UserCheck,
  Activity,
  Database,
} from "lucide-react";

// ============================================================
// Security Features
// ============================================================

const securityFeatures = [
  {
    id: 1,
    title: "JWT Authentication",
    icon: ShieldCheck,
    color: "from-cyan-500 to-blue-500",
    description:
      "Secure user authentication using JSON Web Tokens with protected routes.",
  },

  {
    id: 2,
    title: "Refresh Tokens",
    icon: RefreshCcw,
    color: "from-indigo-500 to-violet-500",
    description:
      "Automatic session renewal without requiring users to log in repeatedly.",
  },

  {
    id: 3,
    title: "OTP Verification",
    icon: KeyRound,
    color: "from-orange-500 to-red-500",
    description:
      "Email OTP verification ensures only authorized users can access accounts.",
  },

  {
    id: 4,
    title: "Role-Based Access",
    icon: UserCheck,
    color: "from-emerald-500 to-green-500",
    description:
      "Fine-grained permissions for Student, Mentor, Warden, Security and Admin.",
  },

  {
    id: 5,
    title: "Password Encryption",
    icon: Lock,
    color: "from-pink-500 to-rose-500",
    description: "Passwords are securely hashed using bcrypt before storage.",
  },

  {
    id: 6,
    title: "Audit Logs",
    icon: Activity,
    color: "from-yellow-500 to-amber-500",
    description:
      "Every important action is logged for monitoring and accountability.",
  },

  {
    id: 7,
    title: "Data Protection",
    icon: Database,
    color: "from-teal-500 to-cyan-500",
    description:
      "Sensitive data is securely stored and validated before processing.",
  },

  {
    id: 8,
    title: "Identity Verification",
    icon: Fingerprint,
    color: "from-purple-500 to-fuchsia-500",
    description:
      "Identity checks help prevent unauthorized access to campus resources.",
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

const SecuritySection = () => {
  return (
    <section
      id="security"
      className="relative overflow-hidden bg-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===================================== */}
        {/* Section Header */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-xl">
            Enterprise Security
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Built with
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Security First
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AMIOUT follows enterprise security practices to protect student
            data, streamline authentication, and ensure secure access across
            every module of the platform.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Security Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-4"
        >
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                {/* Hover Background */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                />

                {/* Glow */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Secure Badge */}

                <span className="relative inline-flex rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Secure
                </span>

                {/* Icon */}

                <div
                  className={`relative mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Title */}

                <h3 className="relative mt-6 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-emerald-300">
                  {feature.title}
                </h3>

                {/* Description */}

                <p className="relative mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>

                {/* Footer */}

                <div className="relative mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-300">
                    Enterprise
                  </span>

                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Learn More
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.div>
                </div>

                {/* Bottom Border */}

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.35 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Enterprise Security Summary */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-6xl"
        >
          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900/80 to-cyan-500/10 p-10 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="text-center">
                <h3 className="text-4xl font-black text-emerald-400">JWT</h3>
                <p className="mt-2 text-slate-400">Secure Authentication</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-cyan-400">RBAC</h3>
                <p className="mt-2 text-slate-400">Role Based Access</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-orange-400">OTP</h3>
                <p className="mt-2 text-slate-400">Email Verification</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-purple-400">24×7</h3>
                <p className="mt-2 text-slate-400">Security Monitoring</p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ===================================== */}
        {/* Decorative Bottom Glow */}
        {/* ===================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <div className="h-40 w-[700px] rounded-full bg-emerald-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
