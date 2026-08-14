// ============================================================
// AMIOUT Enterprise Edition
// SocialLinks.jsx
// ============================================================

import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Mail, ArrowUpRight } from "lucide-react";
const socialLinks = [
  {
    title: "GitHub",
    subtitle: "Open Source Projects",
    description: "Explore AMIOUT source code and development projects.",
    icon: FaGithub,
    url: "https://github.com/Mishrashivam66",
    color: "text-white",
    border: "hover:border-white/20",
  },

  {
    title: "LinkedIn",
    subtitle: "Professional Network",
    description: "Connect professionally and stay updated.",
    icon: FaLinkedin,
    url: "https://linkedin.com/in/shivammishra675bb29b/",
    color: "text-blue-400",
    border: "hover:border-blue-500/30",
  },

  {
    title: "Email",
    subtitle: "Direct Communication",
    description: "For collaborations and enterprise discussions.",
    icon: Mail,
    url: "mailto:shivammgrmishra@gmail.com",
    color: "text-cyan-400",
    border: "hover:border-cyan-500/30",
  },
];

const SocialLinks = () => {
  return (
    <div className="space-y-5">
      {socialLinks.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.12,
              duration: 0.45,
            }}
            viewport={{
              once: true,
            }}
            whileHover={{
              x: 8,
            }}
            className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl transition-all duration-300 ${item.border}`}
          >
            {/* Glow */}

            <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-500/10 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-slate-950">
                  <Icon className={`h-8 w-8 ${item.color}`} />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-white">{item.title}</h4>

                  <p className="mt-1 text-sm text-slate-400">{item.subtitle}</p>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>

              <ArrowUpRight className="h-6 w-6 text-slate-500 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-400" />
            </div>
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
