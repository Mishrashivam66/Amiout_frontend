import { motion } from "framer-motion";
import { LayoutDashboard, Bell, UserCheck, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: LayoutDashboard,
    title: "Student Dashboard",
    desc: "Apply and track outpass requests in one place.",
  },
  {
    icon: UserCheck,
    title: "Mentor Panel",
    desc: "Approve or reject requests with remarks.",
  },
  {
    icon: Bell,
    title: "Live Notifications",
    desc: "Receive instant updates for every action.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    desc: "Role-based authentication for every user.",
  },
];

const ScreenshotsSection = () => {
  return (
    <section
      id="dashboard"
      className="bg-slate-900 px-6 py-24 text-white lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Dashboard Preview
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Everything You Need
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              In One Dashboard
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            AMIOUT provides a clean dashboard for students, mentors and
            administrators to manage the complete outpass workflow.
          </p>
        </motion.div>

        {/* Content */}

        <div className="mt-20 grid items-center gap-12 lg:grid-cols-[65%_35%]">
          {/* Dashboard */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl"
          >
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950 shadow-2xl">
              {/* Browser Header */}
              <div className="flex items-center gap-2 border-b border-white/10 bg-slate-900 px-5 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />

                <div className="ml-6 flex-1 rounded-lg bg-slate-800 px-4 py-2 text-xs text-slate-400">
                  https://app.amiout.in/dashboard
                </div>
              </div>

              <div className="flex">
                {/* Sidebar */}
                <aside className="hidden w-56 border-r border-white/10 bg-slate-900 p-5 lg:block">
                  <h3 className="mb-8 text-lg font-bold text-cyan-400">
                    AMIOUT
                  </h3>

                  <div className="space-y-3">
                    {[
                      "Dashboard",
                      "Outpasses",
                      "Mentors",
                      "Students",
                      "Reports",
                      "Settings",
                    ].map((item) => (
                      <div
                        key={item}
                        className={`rounded-xl px-4 py-3 ${
                          item === "Dashboard"
                            ? "bg-cyan-500 text-white"
                            : "text-slate-400 hover:bg-white/5"
                        }`}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </aside>

                {/* Main */}
                <div className="flex-1 p-6">
                  <h3 className="mb-6 text-2xl font-bold text-white">
                    Dashboard Overview
                  </h3>

                  {/* Stats */}
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {[
                      ["Students", "2,456"],
                      ["Pending", "42"],
                      ["Approved", "2,180"],
                      ["Mentors", "68"],
                    ].map(([title, value]) => (
                      <div
                        key={title}
                        className="rounded-2xl border border-white/10 bg-white/5 p-5"
                      >
                        <p className="text-sm text-slate-400">{title}</p>

                        <h4 className="mt-3 text-3xl font-bold text-white">
                          {value}
                        </h4>
                      </div>
                    ))}
                  </div>

                  {/* Chart + Table */}
                  <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                    {/* Chart */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h4 className="mb-6 font-semibold text-white">
                        Weekly Requests
                      </h4>

                      <div className="flex h-44 items-end justify-between gap-3">
                        {[55, 90, 65, 120, 85, 140, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-500 to-blue-500"
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Table */}
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h4 className="mb-5 font-semibold text-white">
                        Recent Requests
                      </h4>

                      <div className="space-y-4">
                        {[
                          ["Rahul", "Pending"],
                          ["Ananya", "Approved"],
                          ["Rohit", "Approved"],
                          ["Priya", "Pending"],
                        ].map(([name, status]) => (
                          <div
                            key={name}
                            className="flex items-center justify-between border-b border-white/10 pb-3"
                          >
                            <span className="text-slate-300">{name}</span>

                            <span
                              className={`rounded-full px-3 py-1 text-xs ${
                                status === "Approved"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {items.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition hover:border-cyan-500/30"
                >
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 p-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold">{item.title}</h3>

                      <p className="mt-2 text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ScreenshotsSection;
