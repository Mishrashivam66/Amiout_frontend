// ============================================================
// AMIOUT Enterprise Edition
// FloatingCards.jsx
// ============================================================

import { motion } from "framer-motion";
import { CheckCircle2, Bell, Brain, Users } from "lucide-react";

const cards = [
  {
    id: 1,
    title: "Mentor Approved",
    subtitle: "Request Verified",
    icon: CheckCircle2,
    color: "from-emerald-500 to-green-600",
    position: "-left-10 top-12",
  },
  {
    id: 2,
    title: "QR Ready",
    subtitle: "Scan Enabled",
    icon: CheckCircle2,
    color: "from-cyan-500 to-blue-600",
    position: "-right-10 top-24",
  },
  {
    id: 3,
    title: "AI Analytics",
    subtitle: "Insights Active",
    icon: Brain,
    color: "from-violet-500 to-purple-600",
    position: "-left-12 bottom-28",
  },
  {
    id: 4,
    title: "Live Alerts",
    subtitle: "3 Notifications",
    icon: Bell,
    color: "from-orange-500 to-red-600",
    position: "-right-8 bottom-36",
  },
  {
    id: 5,
    title: "1000+ Students",
    subtitle: "Platform Online",
    icon: Users,
    color: "from-pink-500 to-rose-600",
    position: "left-1/2 -bottom-10 -translate-x-1/2",
  },
];

const FloatingCards = () => {
  return (
    <>
      {cards.map((card, index) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.id}
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -10, 0],
            }}
            transition={{
              delay: index * 0.15,
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute ${card.position} hidden w-60 rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-2xl xl:block`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br ${card.color}`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>

              <div>
                <h4 className="text-sm font-semibold text-white">
                  {card.title}
                </h4>

                <p className="mt-1 text-xs text-slate-400">{card.subtitle}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </>
  );
};

export default FloatingCards;
