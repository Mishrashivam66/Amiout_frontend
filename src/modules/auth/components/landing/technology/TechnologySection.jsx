// ============================================================
// AMIOUT Enterprise Edition
// TechnologySection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  Atom,
  Palette,
  Server,
  Database,
  ShieldCheck,
  Activity,
  Cloud,
  Boxes,
  Code2,
  Globe,
  Cpu,
  Layers,
} from "lucide-react";

// ============================================================
// Technology Stack
// ============================================================

const technologies = [
  {
    id: 1,
    title: "React.js",
    category: "Frontend",
    icon: Atom,
    color: "from-cyan-500 to-blue-500",
    description:
      "Modern component-based UI library for building fast and scalable interfaces.",
  },

  {
    id: 2,
    title: "Tailwind CSS",
    category: "Styling",
    icon: Palette,
    color: "from-sky-500 to-cyan-500",
    description:
      "Utility-first CSS framework for creating responsive enterprise interfaces.",
  },

  {
    id: 3,
    title: "Node.js",
    category: "Backend",
    icon: Server,
    color: "from-green-500 to-emerald-500",
    description:
      "High-performance JavaScript runtime powering scalable backend services.",
  },

  {
    id: 4,
    title: "Express.js",
    category: "API",
    icon: Layers,
    color: "from-gray-500 to-slate-500",
    description:
      "Lightweight framework used for secure REST APIs and middleware.",
  },

  {
    id: 5,
    title: "MongoDB",
    category: "Database",
    icon: Database,
    color: "from-green-600 to-lime-500",
    description:
      "NoSQL cloud database for flexible and scalable data management.",
  },

  {
    id: 6,
    title: "JWT Authentication",
    category: "Security",
    icon: ShieldCheck,
    color: "from-purple-500 to-violet-500",
    description:
      "Secure authentication using access tokens and refresh tokens.",
  },

  {
    id: 7,
    title: "Socket.IO",
    category: "Realtime",
    icon: Activity,
    color: "from-orange-500 to-red-500",
    description:
      "Real-time communication for notifications and live approval updates.",
  },

  {
    id: 8,
    title: "Redis",
    category: "Caching",
    icon: Cpu,
    color: "from-red-500 to-rose-500",
    description: "High-speed in-memory cache improving system performance.",
  },

  {
    id: 9,
    title: "Docker",
    category: "DevOps",
    icon: Boxes,
    color: "from-blue-600 to-indigo-500",
    description:
      "Containerized deployment ensuring consistency across environments.",
  },

  {
    id: 10,
    title: "Cloudinary",
    category: "Storage",
    icon: Cloud,
    color: "from-indigo-500 to-blue-500",
    description:
      "Cloud-based media storage for QR codes, images and documents.",
  },

  {
    id: 11,
    title: "GitHub",
    category: "Version Control",
    icon: Code2,
    color: "from-slate-600 to-slate-800",
    description:
      "Professional source code management with collaborative workflows.",
  },

  {
    id: 12,
    title: "REST API",
    category: "Integration",
    icon: Globe,
    color: "from-pink-500 to-rose-500",
    description:
      "Reliable API architecture enabling seamless module communication.",
  },
];

// ============================================================
// Animation Variants
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
    },
  },
};

// ============================================================
// Component
// ============================================================

const TechnologySection = () => {
  return (
    <section
      id="technology"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ===================================== */}
        {/* Section Header */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 max-w-3xl text-center"
        >
          <span className="inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            Enterprise Technology Stack
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Built With
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Modern Technologies
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            AMIOUT is powered by a modern full-stack architecture designed for
            performance, scalability, security, and enterprise deployment.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Technology Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {technologies.map((tech) => {
            const Icon = tech.icon;

            return (
              <motion.div
                key={tech.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                {/* Gradient Glow */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                />

                {/* Floating Blur */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${tech.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Category Badge */}

                <span className="relative inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                  {tech.category}
                </span>

                {/* Icon */}

                <div
                  className={`relative mt-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${tech.color} shadow-xl`}
                >
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Title */}

                <h3 className="relative mt-6 text-2xl font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
                  {tech.title}
                </h3>

                {/* Description */}

                <p className="relative mt-4 leading-7 text-slate-400">
                  {tech.description}
                </p>

                {/* Footer */}

                <div className="relative mt-8 flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-400">
                    Production Ready
                  </span>

                  <motion.button
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-sm font-semibold text-white"
                  >
                    Learn More
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </div>

                {/* Bottom Gradient Border */}

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${tech.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Technology Summary */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-6xl"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-blue-500/10 p-10 backdrop-blur-xl">
            <div className="grid gap-8 lg:grid-cols-4">
              <div className="text-center">
                <h3 className="text-4xl font-black text-cyan-400">12+</h3>
                <p className="mt-2 text-slate-400">Modern Technologies</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-emerald-400">MERN</h3>
                <p className="mt-2 text-slate-400">Enterprise Stack</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-orange-400">REST</h3>
                <p className="mt-2 text-slate-400">Secure APIs</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-purple-400">24×7</h3>
                <p className="mt-2 text-slate-400">High Availability</p>
              </div>
            </div>
          </div>
        </motion.div>
        {/* ===================================== */}
        {/* Decorative Bottom Glow */}
        {/* ===================================== */}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center">
          <div className="h-40 w-[700px] rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
