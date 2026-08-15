import { motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";

import ContactInfo from "./ContactInfo";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-slate-950 py-24"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[150px]" />
      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[150px]" />

      {/* Content */}

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2">
            <MessageCircleMore className="h-4 w-4 text-cyan-400" />

            <span className="text-sm font-semibold text-cyan-300">
              CONTACT US
            </span>
          </div>

          <h2 className="mt-8 text-4xl font-bold md:text-5xl">
            Get In
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {" "}
              Touch
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Have questions, suggestions or want to know more about AMIOUT? Feel
            free to reach out to us.
          </p>
        </motion.div>

        {/* Contact Info */}

        <div className="mx-auto mt-16 max-w-4xl">
          <ContactInfo />
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
