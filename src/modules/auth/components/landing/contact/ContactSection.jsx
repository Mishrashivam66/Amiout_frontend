// ============================================================
// AMIOUT Enterprise Edition
// ContactSection.jsx
// ============================================================

import { motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";

import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-950 py-36"
    >
      {/* ================================================= */}
      {/* Background */}
      {/* ================================================= */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      {/* Grid */}

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}

      <div className="absolute -left-40 top-0 h-[550px] w-[550px] rounded-full bg-cyan-500/15 blur-[160px]" />

      <div className="absolute -right-40 bottom-0 h-[550px] w-[550px] rounded-full bg-violet-500/15 blur-[160px]" />

      {/* ================================================= */}
      {/* Content */}
      {/* ================================================= */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* ============================================== */}
        {/* Header */}
        {/* ============================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-5xl text-center"
        >
          {/* Badge */}

          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-6 py-3 backdrop-blur-xl">
            <MessageCircleMore className="h-5 w-5 text-cyan-400" />

            <span className="text-sm font-semibold tracking-wide text-cyan-300">
              CONTACT & COLLABORATION
            </span>
          </div>

          {/* Heading */}

          <h2 className="mt-10 text-5xl font-black leading-tight text-white md:text-7xl">
            Let's Build
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
              {" "}
              Smarter Campuses
            </span>
            <br />
            Together
          </h2>

          {/* Subtitle */}

          <p className="mx-auto mt-10 max-w-4xl text-xl leading-9 text-slate-400">
            Whether you're interested in collaborating, discussing innovative
            ideas, exploring enterprise deployment or simply learning more about
            AMIOUT, we'd love to hear from you.
          </p>
        </motion.div>

        {/* ============================================== */}
        {/* Main Layout */}
        {/* ============================================== */}

        <div className="mt-24 grid items-start gap-12 lg:grid-cols-[420px_1fr]">
          {/* Contact Information */}

          <ContactInfo />

          {/* Contact Form */}

          <ContactForm />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
