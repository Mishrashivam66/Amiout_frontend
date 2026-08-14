// ============================================================
// AMIOUT Enterprise Edition
// TestimonialsSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { motion } from "framer-motion";
import {
  Star,
  GraduationCap,
  ShieldCheck,
  Building2,
  Briefcase,
  Quote,
} from "lucide-react";

// ============================================================
// Testimonials Data
// ============================================================

const testimonials = [
  {
    id: 1,
    name: "Rahul Sharma",
    role: "Student",
    organization: "Amity University",
    icon: GraduationCap,
    rating: 5,
    color: "from-cyan-500 to-blue-500",
    message:
      "AMIOUT completely transformed our hostel outpass process. QR verification and real-time approvals make everything simple and secure.",
  },

  {
    id: 2,
    name: "Dr. Priya Verma",
    role: "Faculty Mentor",
    organization: "Department of CSE",
    icon: Building2,
    rating: 5,
    color: "from-violet-500 to-purple-500",
    message:
      "The approval workflow is intuitive, transparent and significantly reduces manual paperwork for mentors and wardens.",
  },

  {
    id: 3,
    name: "Hostel Warden",
    role: "Warden",
    organization: "Boys Hostel",
    icon: ShieldCheck,
    rating: 5,
    color: "from-emerald-500 to-green-500",
    message:
      "Managing student movement has become faster and more secure with role-based approvals and instant QR validation.",
  },

  {
    id: 4,
    name: "Security Officer",
    role: "Campus Security",
    organization: "University Gate",
    icon: ShieldCheck,
    rating: 5,
    color: "from-orange-500 to-red-500",
    message:
      "QR scanning is quick and reliable. It prevents fake passes and keeps entry and exit records accurate.",
  },

  {
    id: 5,
    name: "Industry Mentor",
    role: "Software Engineer",
    organization: "Technology Partner",
    icon: Briefcase,
    rating: 5,
    color: "from-pink-500 to-rose-500",
    message:
      "AMIOUT demonstrates enterprise-level architecture, modern UI/UX and scalable software engineering practices.",
  },
];

// ============================================================
// Animation Variants
// ============================================================

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
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

const TestimonialsSection = () => {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
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
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            <Quote className="h-4 w-4" />
            Testimonials
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            What People
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Say About AMIOUT
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Feedback from students, faculty, wardens and industry professionals
            about the AMIOUT Smart Outpass Management System.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* Testimonial Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-8 md:grid-cols-2 xl:grid-cols-3"
        >
          {testimonials.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                variants={cardVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
              >
                {/* Hover Glow */}

                <div
                  className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 transition-all duration-500 group-hover:opacity-10`}
                />

                {/* Floating Blur */}

                <div
                  className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-20 blur-3xl transition-all duration-500 group-hover:scale-150`}
                />

                {/* Quote */}

                <Quote className="relative mb-6 h-10 w-10 text-cyan-400 opacity-70" />

                {/* Review */}

                <p className="relative leading-8 text-slate-300">
                  "{item.message}"
                </p>

                {/* Rating */}

                <div className="relative mt-6 flex items-center gap-1">
                  {[...Array(item.rating)].map((_, index) => (
                    <Star
                      key={index}
                      className="h-5 w-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Divider */}

                <div className="my-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* User */}

                <div className="relative flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color}`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {item.name}
                    </h3>

                    <p className="text-sm text-cyan-300">{item.role}</p>

                    <p className="text-sm text-slate-400">
                      {item.organization}
                    </p>
                  </div>
                </div>

                {/* Bottom Border */}

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.4 }}
                  className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${item.color}`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* ===================================== */}
        {/* Bottom Trust Banner */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto mt-24 max-w-6xl"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-blue-500/10 p-10 backdrop-blur-xl">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <h3 className="text-4xl font-black text-cyan-400">5★</h3>
                <p className="mt-2 text-slate-400">Average Rating</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-emerald-400">100%</h3>
                <p className="mt-2 text-slate-400">Positive Feedback</p>
              </div>

              <div className="text-center">
                <h3 className="text-4xl font-black text-purple-400">
                  Enterprise
                </h3>
                <p className="mt-2 text-slate-400">Product Experience</p>
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

export default TestimonialsSection;
