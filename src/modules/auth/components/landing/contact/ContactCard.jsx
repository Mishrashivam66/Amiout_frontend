import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ContactCard = ({ icon: Icon, title, subtitle, value, color }) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10"
    >
      <div className="flex items-start gap-5">
        {/* Icon */}

        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
          <Icon className={`h-8 w-8 text-white ${color}`} />
        </div>

        {/* Content */}

        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
            {title}
          </p>

          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>

          <h4 className="mt-3 break-all text-lg font-semibold text-white transition group-hover:text-cyan-300">
            {value}
          </h4>
        </div>

        {/* Arrow */}

        <ArrowUpRight className="mt-1 h-5 w-5 text-slate-500 transition group-hover:text-cyan-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
      </div>
    </motion.div>
  );
};

export default ContactCard;
