import CountUp from "react-countup";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const themes = {
  blue: {
    bg: "from-blue-600 to-indigo-700",
    icon: "bg-blue-100 text-blue-700",
    badge: "bg-blue-100 text-blue-700",
  },

  amber: {
    bg: "from-amber-500 to-orange-600",
    icon: "bg-amber-100 text-amber-700",
    badge: "bg-amber-100 text-amber-700",
  },

  emerald: {
    bg: "from-emerald-500 to-green-700",
    icon: "bg-emerald-100 text-emerald-700",
    badge: "bg-emerald-100 text-emerald-700",
  },

  rose: {
    bg: "from-rose-500 to-red-700",
    icon: "bg-rose-100 text-rose-700",
    badge: "bg-rose-100 text-rose-700",
  },
};

const StatsCards = ({
  title,
  value = 0,
  subtitle,
  icon: Icon,
  color = "blue",
}) => {
  const theme = themes[color] || themes.blue;

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        shadow-md
        border
        border-slate-200
        p-6
        group
      "
    >
      {/* Background Glow */}

      <div
        className={`
          absolute
          -right-12
          -top-12
          h-40
          w-40
          rounded-full
          bg-gradient-to-br
          ${theme.bg}
          opacity-10
          blur-3xl
        `}
      />

      {/* Top */}

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <h2 className="mt-4 text-5xl font-bold text-slate-800">{value}</h2>

          <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${theme.icon}
            transition
            duration-300
            group-hover:rotate-6
            group-hover:scale-110
          `}
        >
          <div className="text-2xl">🔥</div>
        </div>
      </div>

      {/* Bottom */}

      <div className="relative mt-8 flex items-center justify-between">
        <div
          className={`
            rounded-full
            px-3
            py-1
            text-xs
            font-semibold
            ${theme.badge}
          `}
        >
          Live Statistics
        </div>

        <TrendingUp size={20} className="text-emerald-500" />
      </div>

      {/* Bottom Border */}

      <div
        className={`
          absolute
          bottom-0
          left-0
          h-1
          w-full
          bg-gradient-to-r
          ${theme.bg}
        `}
      />
    </motion.div>
  );
};

export default StatsCards;
