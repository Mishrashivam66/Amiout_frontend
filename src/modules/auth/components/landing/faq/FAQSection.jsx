// ============================================================
// AMIOUT Enterprise Edition
// FAQSection.jsx
// Part 1 - Imports, Data & Component Setup
// ============================================================

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HelpCircle, ChevronDown, ShieldCheck } from "lucide-react";

// ============================================================
// FAQ Data
// ============================================================

const faqData = [
  {
    id: 1,
    question: "What is AMIOUT?",
    answer:
      "AMIOUT is a Smart Outpass Management System designed for universities to digitize hostel outpass requests, approvals, QR verification and real-time student movement.",
  },

  {
    id: 2,
    question: "How does QR Verification work?",
    answer:
      "Every approved outpass generates a unique QR code that can be scanned by the security team during student exit and return.",
  },

  {
    id: 3,
    question: "Is student data secure?",
    answer:
      "Yes. AMIOUT uses JWT Authentication, encrypted passwords, role-based access control and secure APIs to protect user information.",
  },

  {
    id: 4,
    question: "How does the approval workflow work?",
    answer:
      "Students submit requests which move through Mentor and Warden approvals before the QR outpass becomes available.",
  },

  {
    id: 5,
    question: "Can parents receive notifications?",
    answer:
      "Yes. The platform can notify parents about approved or rejected outpasses through future notification integrations.",
  },

  {
    id: 6,
    question: "Which user roles are supported?",
    answer:
      "Student, Mentor, Warden, Security, Admin and Super Admin are supported with dedicated dashboards.",
  },

  {
    id: 7,
    question: "Can this platform scale for large universities?",
    answer:
      "Yes. AMIOUT follows enterprise architecture and can support thousands of users with secure role-based access.",
  },

  {
    id: 8,
    question: "Can AMIOUT integrate with existing ERP systems?",
    answer:
      "Yes. The platform is API-driven and can be integrated with existing university ERP systems in the future.",
  },
];

// ============================================================
// Component
// ============================================================

const FAQSection = () => {
  const [activeFAQ, setActiveFAQ] = useState(1);

  const toggleFAQ = (id) => {
    setActiveFAQ(activeFAQ === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-28"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-6 lg:px-8">
        {/* ===================================== */}
        {/* Section Header */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mx-auto mb-20 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-xl">
            <ShieldCheck className="h-4 w-4" />
            Frequently Asked Questions
          </span>

          <h2 className="mt-6 text-4xl font-black text-white md:text-5xl">
            Have
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
              {" "}
              Questions?
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-400">
            Everything you need to know about AMIOUT, security, approvals, QR
            verification and enterprise deployment.
          </p>
        </motion.div>

        {/* ===================================== */}
        {/* FAQ Cards */}
        {/* Part 2 Starts Here */}
        {/* ===================================== */}
        <div className="space-y-5">
          {faqData.map((faq) => {
            const isOpen = activeFAQ === faq.id;

            return (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
              >
                {/* Question */}

                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between px-8 py-6 text-left transition-all duration-300 hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
                      <HelpCircle className="h-6 w-6 text-cyan-400" />
                    </div>

                    <h3 className="text-lg font-semibold text-white md:text-xl">
                      {faq.question}
                    </h3>
                  </div>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-6 w-6 text-cyan-400" />
                  </motion.div>
                </button>

                {/* Answer */}

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      transition={{
                        duration: 0.35,
                      }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/10 px-8 pb-8 pt-6">
                        <p className="leading-8 text-slate-400">{faq.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ===================================== */}
        {/* Bottom Support Card */}
        {/* ===================================== */}

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/10 via-slate-900/80 to-blue-500/10 p-10 backdrop-blur-xl">
            <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
              <div>
                <h3 className="text-3xl font-bold text-white">
                  Still have questions?
                </h3>

                <p className="mt-3 max-w-2xl text-slate-400">
                  Our team is always ready to help you understand the platform,
                  workflow, deployment process and enterprise features.
                </p>
              </div>

              <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/30">
                Contact Team
              </button>
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

export default FAQSection;
