// ============================================================
// AMIOUT Enterprise Edition
// DashboardPreview.jsx
// Enterprise SaaS Dashboard Preview
// Part 1
// ============================================================

import { motion } from "framer-motion";

import {
  LayoutDashboard,
  Users,
  QrCode,
  Bell,
  BarChart3,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

const DashboardPreview = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 60,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.8,
        delay: 0.3,
      }}
      className="relative"
    >
      {/* ====================================== */}
      {/* Main Dashboard */}
      {/* ====================================== */}

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/70 shadow-2xl backdrop-blur-3xl">
        {/* ====================================== */}
        {/* Top Bar */}
        {/* ====================================== */}

        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />

            <div className="h-3 w-3 rounded-full bg-yellow-500" />

            <div className="h-3 w-3 rounded-full bg-green-500" />
          </div>

          <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-400">
            dashboard.amiout.app
          </div>

          <Bell className="h-5 w-5 text-slate-400" />
        </div>

        {/* ====================================== */}
        {/* Dashboard Body */}
        {/* ====================================== */}

        <div className="grid grid-cols-[90px_1fr]">
          {/* ====================================== */}
          {/* Sidebar */}
          {/* ====================================== */}

          <div className="border-r border-white/10 bg-slate-950/40 p-4">
            <div className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <Users className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <QrCode className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <CalendarDays className="h-5 w-5 text-slate-400" />
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
                <ShieldCheck className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* ====================================== */}
          {/* Main Content */}
          {/* ====================================== */}

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">
                  Dashboard Overview
                </h3>

                <p className="mt-2 text-sm text-slate-400">
                  Welcome back, Campus Administrator
                </p>
              </div>

              <button className="rounded-2xl bg-linear-to-r from-cyan-500 to-blue-600 px-5 py-3 text-sm font-semibold text-white">
                Generate Report
              </button>
            </div>

            {/* ====================================== */}
            {/* Statistics Cards */}
            {/* Part 2 Starts Here */}
            {/* ====================================== */}
            {/* ====================================== */}
            {/* Analytics Cards */}
            {/* ====================================== */}

            <div className="mt-8 grid grid-cols-2 gap-5">
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Total Students</p>

                    <h4 className="mt-3 text-3xl font-black text-white">
                      12,487
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 p-3">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />

                  <span className="text-sm font-medium">+12.8%</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Active Passes</p>

                    <h4 className="mt-3 text-3xl font-black text-white">342</h4>
                  </div>

                  <div className="rounded-2xl bg-linear-to-br from-violet-500 to-purple-600 p-3">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />

                  <span className="text-sm font-medium">+8.4%</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Approval Rate</p>

                    <h4 className="mt-3 text-3xl font-black text-white">
                      98.7%
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-linear-to-br from-emerald-500 to-green-600 p-3">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />

                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Performance</p>

                    <h4 className="mt-3 text-3xl font-black text-white">
                      99.9%
                    </h4>
                  </div>

                  <div className="rounded-2xl bg-linear-to-br from-orange-500 to-red-600 p-3">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />

                  <span className="text-sm font-medium">Stable</span>
                </div>
              </motion.div>
            </div>

            {/* ====================================== */}
            {/* Charts & Activity */}
            {/* Part 3 Starts Here */}
            {/* ====================================== */}
            {/* ====================================== */}
            {/* Analytics + Recent Activity */}
            {/* ====================================== */}

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              {/* ====================================== */}
              {/* Analytics Chart */}
              {/* ====================================== */}

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      Weekly Analytics
                    </h4>

                    <p className="mt-1 text-sm text-slate-400">
                      Student movement overview
                    </p>
                  </div>

                  <div className="rounded-xl bg-cyan-500/10 px-3 py-2 text-xs font-semibold text-cyan-300">
                    Last 7 Days
                  </div>
                </div>

                {/* Fake Chart */}

                <div className="flex h-48 items-end justify-between gap-3">
                  {[45, 70, 55, 90, 72, 110, 95].map((height, index) => (
                    <motion.div
                      key={index}
                      initial={{
                        height: 0,
                      }}
                      animate={{
                        height,
                      }}
                      transition={{
                        delay: index * 0.08,
                        duration: 0.6,
                      }}
                      className="flex-1 rounded-t-2xl bg-linear-to-t from-cyan-500 to-blue-500"
                    />
                  ))}
                </div>

                <div className="mt-5 flex justify-between text-xs text-slate-500">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>
              </div>

              {/* ====================================== */}
              {/* Recent Activity */}
              {/* ====================================== */}

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <h4 className="text-lg font-bold text-white">
                  Recent Activity
                </h4>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      title: "Outpass Approved",
                      time: "2 min ago",
                      color: "bg-emerald-400",
                    },
                    {
                      title: "QR Verified",
                      time: "8 min ago",
                      color: "bg-cyan-400",
                    },
                    {
                      title: "Student Returned",
                      time: "14 min ago",
                      color: "bg-blue-400",
                    },
                    {
                      title: "Security Updated",
                      time: "28 min ago",
                      color: "bg-violet-400",
                    },
                  ].map((activity) => (
                    <div
                      key={activity.title}
                      className="flex items-center gap-4"
                    >
                      <span
                        className={`h-3 w-3 rounded-full ${activity.color}`}
                      />

                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">
                          {activity.title}
                        </p>

                        <p className="text-xs text-slate-500">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ====================================== */}
            {/* Bottom Widgets */}
            {/* Part 4 Starts Here */}
            {/* ====================================== */}
            {/* ====================================== */}
            {/* Bottom Widgets */}
            {/* ====================================== */}

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {/* ====================================== */}
              {/* QR Verification */}
              {/* ====================================== */}

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">QR Verification</h4>

                    <p className="mt-1 text-sm text-slate-400">Ready to Scan</p>
                  </div>

                  <QrCode className="h-8 w-8 text-cyan-400" />
                </div>

                <div className="mt-6 flex justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-2xl border-2 border-dashed border-cyan-400 bg-cyan-500/10">
                    <QrCode className="h-14 w-14 text-cyan-300" />
                  </div>
                </div>
              </motion.div>

              {/* ====================================== */}
              {/* Calendar */}
              {/* ====================================== */}

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Calendar</h4>

                    <p className="mt-1 text-sm text-slate-400">Today</p>
                  </div>

                  <CalendarDays className="h-7 w-7 text-violet-400" />
                </div>

                <div className="mt-6">
                  <div className="rounded-2xl bg-linear-to-r from-violet-500 to-indigo-600 p-5 text-center">
                    <p className="text-sm text-violet-100">August</p>

                    <h2 className="mt-2 text-5xl font-black text-white">03</h2>

                    <p className="mt-2 text-sm text-violet-100">Monday</p>
                  </div>
                </div>
              </motion.div>

              {/* ====================================== */}
              {/* Notifications */}
              {/* ====================================== */}

              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white">Notifications</h4>

                    <p className="mt-1 text-sm text-slate-400">Live Updates</p>
                  </div>

                  <Bell className="h-7 w-7 text-orange-400" />
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl bg-emerald-500/10 p-4">
                    <p className="font-medium text-emerald-300">
                      Mentor Approved
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Outpass request approved successfully.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-cyan-500/10 p-4">
                    <p className="font-medium text-cyan-300">QR Generated</p>

                    <p className="mt-1 text-xs text-slate-400">
                      Student QR code is ready for verification.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ====================================== */}
            {/* Dashboard Footer */}
            {/* Part 5 Starts Here */}
            {/* ====================================== */}
            {/* ====================================== */}
            {/* Dashboard Footer */}
            {/* ====================================== */}

            <div className="mt-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
              {/* Admin Profile */}

              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-500 to-blue-600 text-lg font-bold text-white">
                  AK
                </div>

                <div>
                  <h4 className="font-semibold text-white">Admin Dashboard</h4>

                  <p className="text-sm text-slate-400">
                    Smart Campus Control Center
                  </p>
                </div>
              </div>

              {/* Live Status */}

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

                  <span className="text-sm font-medium text-emerald-300">
                    System Online
                  </span>
                </div>

                <div className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
                  <span className="text-sm font-medium text-cyan-300">
                    Uptime 99.98%
                  </span>
                </div>

                <div className="rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2">
                  <span className="text-sm font-medium text-violet-300">
                    Enterprise v2.0
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPreview;
