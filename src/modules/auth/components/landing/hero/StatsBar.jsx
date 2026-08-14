// ============================================================
// AMIOUT Enterprise Edition
// StatsBar.jsx
// ============================================================

import { motion } from "framer-motion";
import { Users, LayoutDashboard, ShieldCheck, Activity } from "lucide-react";

// ============================================================
// Stats Data
// ============================================================

const stats = [
  {
    id: 1,
    value: "1000+",
    label: "Students",
    icon: Users,
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 2,
    value: "10+",
    label: "Modules",
    icon: LayoutDashboard,
    color: "from-violet-500 to-purple-500",
  },
  {
    id: 3,
    value: "99.9%",
    label: "Security",
    icon: ShieldCheck,
    color: "from-emerald-500 to-green-500",
  },
  {
    id: 4,
    value: "24×7",
    label: "Monitoring",
    icon: Activity,
    color: "from-orange-500 to-red-500",
  },
];

const StatsBar = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.2,
        duration: 0.6,
      }}
      className="grid grid-cols-2 gap-5 xl:grid-cols-4"
    >
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.id}
            whileHover={{
              y: -8,
              scale: 1.03,
            }}
            transition={{
              duration: 0.3,
            }}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
          >
            {/* Hover Glow */}

            <div
              className={`absolute inset-0 bg-linear-to-br ${item.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
            />

            {/* Floating Blur */}

            <div
              className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-linear-to-br ${item.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
            />

            {/* Icon */}

            <div
              className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${item.color}`}
            >
              <Icon className="h-6 w-6 text-white" />
            </div>

            {/* Value */}

            <h3 className="relative mt-5 text-3xl font-black text-white">
              {item.value}
            </h3>

            {/* Label */}

            <p className="relative mt-2 text-sm font-medium text-slate-400">
              {item.label}
            </p>

            {/* Bottom Line */}

            <motion.div
              initial={{
                width: 0,
              }}
              whileHover={{
                width: "100%",
              }}
              transition={{
                duration: 0.35,
              }}
              className={`absolute bottom-0 left-0 h-1 bg-linear-to-r ${item.color}`}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default StatsBar;
