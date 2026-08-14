// ============================================================
// AMIOUT Enterprise Edition
// ContactInfo.jsx
// ============================================================

import { motion } from "framer-motion";

import { Mail, Phone, MapPin, Clock3, Sparkles } from "lucide-react";

import ContactCard from "./ContactCard";
import SocialLinks from "./SocialLinks";

const ContactInfo = () => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -60,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
      }}
      transition={{
        duration: 0.7,
      }}
      viewport={{
        once: true,
      }}
      className="relative"
    >
      {/* Main Card */}

      <div className="overflow-hidden rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-2xl">
        {/* Glow */}

        <div className="absolute -left-20 top-20 h-60 w-60 rounded-full bg-cyan-500/10 blur-[120px]" />

        {/* Top */}

        <div className="relative border-b border-white/10 p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-cyan-400" />

            <span className="text-xs font-semibold tracking-wider text-cyan-300">
              GET IN TOUCH
            </span>
          </div>

          <h3 className="mt-6 text-4xl font-black text-white">
            Contact Information
          </h3>

          <p className="mt-5 leading-8 text-slate-400">
            Whether you're looking for collaboration, internship discussion,
            project guidance, or enterprise deployment, feel free to reach out.
          </p>
        </div>

        {/* Contact Cards */}

        <div className="space-y-5 p-8">
          <ContactCard
            icon={Mail}
            title="Email Address"
            subtitle="Always available for communication"
            value="shivammgrmishra@gmail.com"
            color="text-cyan-400"
          />

          <ContactCard
            icon={Phone}
            title="Phone Number"
            subtitle="Quick response during working hours"
            value="+91 93413 08920"
            color="text-emerald-400"
          />

          <ContactCard
            icon={MapPin}
            title="Location"
            subtitle="Based in"
            value="Amity University, Madhya Pradesh"
            color="text-orange-400"
          />

          <ContactCard
            icon={Clock3}
            title="Availability"
            subtitle="Working Hours"
            value="Monday – Friday • 09:00 AM – 06:00 PM"
            color="text-violet-400"
          />
        </div>

        {/* Bottom */}

        <div className="border-t border-white/10 p-8">
          <h4 className="mb-6 text-xl font-bold text-white">
            Professional Profiles
          </h4>

          <SocialLinks />
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfo;
