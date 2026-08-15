// ============================================================
// AMIOUT Enterprise Edition
// FooterBrand.jsx
// ============================================================

import { motion } from "framer-motion";
import { GraduationCap, MapPin } from "lucide-react";

const technologies = [
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Tailwind CSS",
  "JWT",
];

const FooterBrand = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      {/* Logo */}

      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-500 to-violet-600 shadow-lg shadow-cyan-500/30">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>

        <div>
          <h3 className="text-3xl font-black text-white">AMIOUT</h3>

          <p className="text-sm font-medium tracking-wider text-cyan-300">
            Smart Outpass Management System
          </p>
        </div>
      </div>

      {/* Description */}

      <p className="mt-8 max-w-md text-lg leading-8 text-slate-400">
        AMIOUT is a modern Smart Campus Outpass Management Platform built to
        simplify leave approvals, improve transparency, and digitize campus
        mobility through a secure and user-friendly workflow.
      </p>

      {/* University */}

      <div className="mt-10 flex items-center gap-4">
        <MapPin className="h-5 w-5 text-cyan-400" />

        <span className="text-slate-300">
          Amity University, Madhya Pradesh, India
        </span>
      </div>

      {/* Tech Stack */}

      <div className="mt-12">
        <h4 className="mb-5 text-lg font-bold text-white">Built With</h4>

        <div className="flex flex-wrap gap-3">
          {technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-xl transition hover:border-cyan-500/30 hover:text-cyan-300"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FooterBrand;
