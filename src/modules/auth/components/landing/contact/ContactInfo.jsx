import { motion } from "framer-motion";
import { Mail, MapPin, GraduationCap } from "lucide-react";

import ContactCard from "./ContactCard";
import SocialLinks from "./SocialLinks";

const ContactInfo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative"
    >
      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        {/* Header */}
        <div className="border-b border-white/10 p-8">
          <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold tracking-widest text-cyan-300">
            CONTACT
          </span>

          <h3 className="mt-6 text-3xl font-bold text-white">Get in Touch</h3>

          <p className="mt-4 leading-7 text-slate-400">
            Have questions about AMIOUT, collaboration opportunities, or project
            discussions? Feel free to connect.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="space-y-5 p-8">
          <ContactCard
            icon={Mail}
            title="Email"
            subtitle="Primary Contact"
            value="shivammgrmishra@gmail.com"
            color="text-cyan-400"
          />

          <ContactCard
            icon={GraduationCap}
            title="Mentor"
            subtitle="Project Guidance"
            value="Dr. Dinesh Sharma"
            color="text-violet-400"
          />

          <ContactCard
            icon={MapPin}
            title="Location"
            subtitle="Campus"
            value="Amity University, Madhya Pradesh"
            color="text-emerald-400"
          />
        </div>

        {/* Social */}
        <div className="border-t border-white/10 p-8">
          <h4 className="mb-5 text-lg font-semibold text-white">
            Connect Online
          </h4>

          <SocialLinks />
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
