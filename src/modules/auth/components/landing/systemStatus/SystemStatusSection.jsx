// ============================================================
// AMIOUT Enterprise Edition
// SystemStatusSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  Activity,
  Users,
  FileCheck,
  Clock3,
  LogOut,
  LogIn,
  Server,
  Database,
  BellRing,
  Wifi,
} from "lucide-react";

// ============================================================
// Live System Metrics (Demo Data)
// Future: Replace with Backend API
// ============================================================

const systemStatus = [
  {
    id: 1,
    title: "Platform Status",
    value: "Online",
    subtitle: "All Services Running",
    icon: Activity,
    color: "from-emerald-500 to-green-500",
  },

  {
    id: 2,
    title: "Registered Students",
    value: "12,487",
    subtitle: "Across Campus",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
  },

  {
    id: 3,
    title: "Active Outpasses",
    value: "342",
    subtitle: "Currently Active",
    icon: FileCheck,
    color: "from-orange-500 to-red-500",
  },

  {
    id: 4,
    title: "Pending Requests",
    value: "98",
    subtitle: "Awaiting Approval",
    icon: Clock3,
    color: "from-yellow-500 to-amber-500",
  },

  {
    id: 5,
    title: "Today's Exits",
    value: "143",
    subtitle: "Verified by Security",
    icon: LogOut,
    color: "from-purple-500 to-violet-500",
  },

  {
    id: 6,
    title: "Today's Returns",
    value: "118",
    subtitle: "Successfully Returned",
    icon: LogIn,
    color: "from-pink-500 to-rose-500",
  },

  {
    id: 7,
    title: "Server Uptime",
    value: "99.98%",
    subtitle: "Last 30 Days",
    icon: Server,
    color: "from-indigo-500 to-blue-600",
  },

  {
    id: 8,
    title: "Database Health",
    value: "Healthy",
    subtitle: "MongoDB Atlas",
    icon: Database,
    color: "from-green-600 to-emerald-500",
  },

  {
    id: 9,
    title: "Notifications",
    value: "27",
    subtitle: "Unread Alerts",
    icon: BellRing,
    color: "from-fuchsia-500 to-pink-500",
  },

  {
    id: 10,
    title: "API Status",
    value: "Connected",
    subtitle: "All Endpoints Live",
    icon: Wifi,
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
      staggerChildren: 0.1,
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

const SystemStatusSection = () => {
  return (
    <section
      id="system-status"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
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
            ● Live Enterprise Monitoring
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Real-Time
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              System Status
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Monitor platform availability, student activity, outpass workflow,
            server health, database status and live system metrics from one
            unified enterprise dashboard.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Status Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-5"
        >
          {systemStatus.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.03,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                {/* Hover Background */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                />

                {/* Floating Glow */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Live Badge */}

                <div className="relative mb-5 flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    LIVE
                  </span>

                  <Icon className="h-8 w-8 text-cyan-400" />
                </div>

                {/* Value */}

                <h3 className="relative text-3xl font-black text-white">
                  {item.value}
                </h3>

                {/* Title */}

                <h4 className="mt-2 text-lg font-bold text-white">
                  {item.title}
                </h4>

                {/* Subtitle */}

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  {item.subtitle}
                </p>

                {/* Bottom Status */}

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Updated just now
                  </span>

                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-xs font-semibold text-cyan-300">
                    Active
                  </span>
                </div>

                {/* Bottom Gradient */}

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.35 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Enterprise Monitoring Summary */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-6xl"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-emerald-500/10 via-slate-900/80 to-cyan-500/10 p-10 backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <h3 className="text-4xl font-black text-emerald-400">99.98%</h3>
                <p className="mt-2 text-slate-400">Server Uptime</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-cyan-400">12K+</h3>
                <p className="mt-2 text-slate-400">Registered Students</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-orange-400">342</h3>
                <p className="mt-2 text-slate-400">Active Passes</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-purple-400">24×7</h3>
                <p className="mt-2 text-slate-400">Live Monitoring</p>
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

export default SystemStatusSection;
