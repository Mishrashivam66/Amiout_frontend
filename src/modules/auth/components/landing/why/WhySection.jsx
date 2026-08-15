import { motion } from "framer-motion";
import { Zap, ShieldCheck, Clock3, Leaf } from "lucide-react";

const reasons = [
  {
    icon: Zap,
    title: "Faster Approval",
    description:
      "Students can receive mentor approvals quickly through a completely digital workflow.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description:
      "Role-based authentication ensures that every action is secure and accessible only to authorized users.",
  },
  {
    icon: Clock3,
    title: "Real-time Tracking",
    description:
      "Track every outpass request from submission to approval without visiting the office.",
  },
  {
    icon: Leaf,
    title: "Paperless Campus",
    description:
      "Replace traditional paper slips with a modern, eco-friendly digital outpass management system.",
  },
];

const WhySection = () => {
  return (
    <section id="why" className="bg-slate-950 px-6 py-24 text-white lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300">
            Why AMIOUT
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Designed for
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Modern Universities
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AMIOUT simplifies campus mobility by providing a secure, paperless
            and intelligent outpass management experience for students, mentors
            and administrators.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {reasons.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-500/30 hover:bg-white/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mt-8 text-2xl font-bold">{item.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-violet-500/10 p-10 text-center"
        >
          <h3 className="text-3xl font-bold">
            One Platform. Complete Outpass Management.
          </h3>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300">
            From submitting requests to mentor approvals, notifications and
            tracking, AMIOUT brings the complete outpass process into a single,
            secure and easy-to-use platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default WhySection;
