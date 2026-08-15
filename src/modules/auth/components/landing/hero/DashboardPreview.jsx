// ============================================================
// DashboardPreview.jsx
// PART 1
// ============================================================

import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Users,
  ClipboardList,
  CheckCircle2,
  Clock3,
  Bell,
} from "lucide-react";

const stats = [
  {
    title: "Students",
    value: "1,240",
    icon: Users,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Pending",
    value: "28",
    icon: Clock3,
    color: "from-orange-500 to-red-500",
  },
  {
    title: "Approved",
    value: "318",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Outpasses",
    value: "346",
    icon: ClipboardList,
    color: "from-violet-500 to-purple-600",
  },
];

const DashboardPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      className="relative w-full max-w-6xl"
    >
      {/* ================================================= */}
      {/* Dashboard */}
      {/* ================================================= */}

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 shadow-2xl backdrop-blur-3xl">
        {/* ================================================= */}
        {/* Top Header */}
        {/* ================================================= */}

        <div className="flex items-center justify-between border-b border-white/10 px-8 py-5">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-red-500" />

            <div className="h-3 w-3 rounded-full bg-yellow-500" />

            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <div className="rounded-full bg-white/5 px-5 py-2 text-sm text-slate-400">
            dashboard.amiout.app
          </div>

          <Bell className="h-5 w-5 text-slate-400" />
        </div>

        {/* ================================================= */}
        {/* Body */}
        {/* ================================================= */}

        <div className="grid grid-cols-[90px_1fr]">
          {/* Sidebar */}

          <div className="border-r border-white/10 bg-slate-950/40 p-4">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <Users className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <ClipboardList className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* Main */}
          {/* ================================================= */}

          <div className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Dashboard Overview
                </h2>

                <p className="mt-2 text-slate-400">
                  Welcome back, Administrator
                </p>
              </div>

              <button className="rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 font-semibold text-white">
                Generate Report
              </button>
            </div>

            {/* ============================================= */}
            {/* Stats */}
            {/* ============================================= */}

            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    whileHover={{
                      y: -6,
                    }}
                    className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400">{item.title}</p>

                        <h3 className="mt-3 text-4xl font-black text-white">
                          {item.value}
                        </h3>
                      </div>

                      <div
                        className={`rounded-2xl bg-gradient-to-br ${item.color} p-3`}
                      >
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* PART-2 starts from here */}
            {/* ============================================= */}
            {/* Recent Outpass Requests */}
            {/* ============================================= */}

            <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Recent Outpass Requests
                  </h3>

                  <p className="mt-1 text-sm text-slate-400">
                    Latest requests submitted by students
                  </p>
                </div>

                <button className="rounded-xl bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    name: "Rahul Sharma",
                    destination: "City Mall",
                    status: "Approved",
                    color: "bg-emerald-500/20 text-emerald-300",
                  },
                  {
                    name: "Priya Singh",
                    destination: "Railway Station",
                    status: "Pending",
                    color: "bg-yellow-500/20 text-yellow-300",
                  },
                  {
                    name: "Aman Verma",
                    destination: "Hospital",
                    status: "Rejected",
                    color: "bg-red-500/20 text-red-300",
                  },
                  {
                    name: "Neha Gupta",
                    destination: "Home",
                    status: "Approved",
                    color: "bg-emerald-500/20 text-emerald-300",
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/50 px-5 py-4"
                  >
                    <div>
                      <h4 className="font-semibold text-white">{item.name}</h4>

                      <p className="text-sm text-slate-400">
                        {item.destination}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${item.color}`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ============================================= */}
            {/* Bottom Status */}
            {/* ============================================= */}

            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <h4 className="font-semibold text-emerald-300">
                  System Status
                </h4>

                <p className="mt-2 text-3xl font-black text-white">Online</p>
              </div>

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5">
                <h4 className="font-semibold text-cyan-300">
                  Today's Requests
                </h4>

                <p className="mt-2 text-3xl font-black text-white">124</p>
              </div>

              <div className="rounded-2xl border border-violet-500/20 bg-violet-500/10 p-5">
                <h4 className="font-semibold text-violet-300">Approval Rate</h4>

                <p className="mt-2 text-3xl font-black text-white">98.7%</p>
              </div>
            </div>

            {/* ============================================= */}
            {/* Footer */}
            {/* ============================================= */}

            <div className="mt-8 flex flex-wrap items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-6 py-5">
              <div>
                <h4 className="font-semibold text-white">AMIOUT Dashboard</h4>

                <p className="text-sm text-slate-400">
                  Smart Campus Outpass Management System
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3 md:mt-0">
                <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-400" />

                <span className="font-medium text-emerald-400">
                  All Services Operational
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPreview;
