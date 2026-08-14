
import { motion } from "framer-motion";
import { Users, UserCheck, Lock, ShieldAlert } from "lucide-react";

const cards = [
  {
    key: "total",
    title: "Total Students",
    icon: Users,
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    key: "active",
    title: "Active",
    icon: UserCheck,
    color: "from-emerald-500 to-green-600",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  {
    key: "locked",
    title: "Locked",
    icon: Lock,
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    key: "hold",
    title: "On Hold",
    icon: ShieldAlert,
    color: "from-rose-500 to-red-600",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
];

const StudentCard = ({ students = [] }) => {
  const total = students.length;

  const active = students.filter((s) => s.accountStatus === "ACTIVE").length;

  const locked = students.filter((s) => s.profileStatus === "LOCKED").length;

  const hold = students.filter((s) => s.accountStatus === "HOLD").length;

  const stats = {
    total,
    active,
    locked,
    hold,
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.key}
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
            className="
              relative
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
              transition-all
              duration-300
              hover:shadow-xl
            "
          >
            {/* Glow */}

            <div
              className={`
                absolute
                -right-10
                -top-10
                h-32
                w-32
                rounded-full
                bg-gradient-to-br
                ${item.color}
                opacity-10
                blur-2xl
              `}
            />

            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{item.title}</p>

                <h2 className="mt-3 text-4xl font-bold text-slate-800">
                  {stats[item.key]}
                </h2>
              </div>

              <div
                className={`
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-2xl
                  ${item.bg}
                `}
              >
                <Icon size={30} className={item.text} />
              </div>
            </div>

            <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  ${item.color}
                `}
                style={{
                  width:
                    total === 0 ? "0%" : `${(stats[item.key] / total) * 100}%`,
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StudentCard;
