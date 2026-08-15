import { motion } from "framer-motion";
import {
  FileText,
  UserCheck,
  Bell,
  Clock3,
  History,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Easy Outpass Request",
    description:
      "Students can submit outpass requests online in just a few clicks.",
  },
  {
    icon: UserCheck,
    title: "Mentor Approval",
    description:
      "Mentors can approve or reject requests instantly with remarks.",
  },
  {
    icon: Bell,
    title: "Instant Notifications",
    description:
      "Students and mentors receive real-time updates for every action.",
  },
  {
    icon: Clock3,
    title: "Real-time Status",
    description:
      "Track your outpass status anytime without visiting the office.",
  },
  {
    icon: History,
    title: "Outpass History",
    description:
      "Access complete history of approved, pending and rejected requests.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Authentication",
    description: "Role-based access with secure authentication for every user.",
  },
];

const FeaturesSection = () => {
  return (
    <section
      id="features"
      className="bg-slate-950 px-6 py-24 text-white lg:px-8"
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
            Features
          </span>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Everything You Need for
            <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Smart Outpass Management
            </span>
          </h2>

          <p className="mt-6 text-lg text-slate-400">
            AMIOUT simplifies the complete outpass workflow from request to
            approval while keeping students, mentors and administrators
            connected in real time.
          </p>
        </motion.div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-cyan-500/30 hover:bg-white/10"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="mt-8 text-2xl font-bold">{feature.title}</h3>

                <p className="mt-4 leading-7 text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
