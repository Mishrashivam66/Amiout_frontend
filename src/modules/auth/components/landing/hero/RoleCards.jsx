import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  GraduationCap,
  Users,
  UserRoundCheck,
  ShieldCheck,
  Settings,
} from "lucide-react";
const roles = [
  {
    name: "For Students",
    icon: GraduationCap,
    tint: "blue",
    text: "Apply, track and manage outpass requests with ease.",
    points: [
      "Simple request process",
      "Live status tracking",
      "QR pass for gate verification",
    ],
  },
  {
    name: "For Parents",
    icon: Users,
    tint: "violet",
    text: "Stay informed and approve requests securely.",
    points: [
      "SMS notifications",
      "Secure approval link",
      "Student safety updates",
    ],
  },
  {
    name: "For Faculty",
    icon: UserRoundCheck,
    tint: "teal",
    text: "Review and manage requests with structured approvals.",
    points: [
      "Mentor / Coordinator / HOD",
      "Request management",
      "Leave & availability control",
    ],
  },
  {
    name: "For Security",
    icon: ShieldCheck,
    tint: "amber",
    text: "Quickly verify outpasses at the campus gate.",
    points: [
      "QR code scanning",
      "Time-bound validation",
      "Entry/exit audit logs",
    ],
  },
  {
    name: "For Administration",
    icon: Settings,
    tint: "pink",
    text: "Complete control and insights across campus.",
    points: [
      "User & academic mapping",
      "Reports & analytics",
      "Secure, scalable platform",
    ],
  },
];
const tones = {
  blue: ["border-blue-500/40", "from-blue-500 to-blue-700", "text-blue-400"],
  violet: [
    "border-violet-500/40",
    "from-violet-500 to-fuchsia-600",
    "text-violet-400",
  ],
  teal: ["border-teal-500/40", "from-teal-500 to-emerald-600", "text-teal-400"],
  amber: [
    "border-amber-500/40",
    "from-amber-500 to-orange-600",
    "text-amber-400",
  ],
  pink: ["border-pink-500/40", "from-pink-500 to-rose-600", "text-pink-400"],
};
const RoleCards = () => (
  <div
    id="for-roles"
    className="relative z-20 mx-auto grid max-w-[1440px] gap-4 px-5 pb-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-5 lg:px-12"
  >
    {roles.map((role, i) => {
      const Icon = role.icon;
      const [border, gradient, accent] = tones[role.tint];
      return (
        <motion.article
          key={role.name}
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className={`min-h-[260px] rounded-[22px] border ${border} bg-[#07142c]/90 p-5 shadow-[0_14px_36px_rgba(0,0,0,.15)]`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`rounded-xl bg-gradient-to-br ${gradient} p-3 text-white`}
            >
              <Icon size={25} />
            </div>
            <ArrowUpRight size={18} className="text-slate-400" />
          </div>
          <h3 className="mt-5 text-base font-bold text-white">{role.name}</h3>
          <p className="mt-2 min-h-[54px] text-sm leading-5 text-slate-300">
            {role.text}
          </p>
          <div className="mt-3 space-y-2">
            {role.points.map((point) => (
              <p key={point} className="flex gap-2 text-xs text-slate-300">
                <CheckCircle2 size={15} className={`shrink-0 ${accent}`} />
                {point}
              </p>
            ))}
          </div>
        </motion.article>
      );
    })}
  </div>
);
export default RoleCards;
