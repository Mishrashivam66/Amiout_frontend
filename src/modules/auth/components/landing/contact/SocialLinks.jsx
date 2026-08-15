import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { Mail, ArrowUpRight } from "lucide-react";

const socialLinks = [
  {
    title: "GitHub",
    subtitle: "Projects & Source Code",
    icon: FaGithub,
    url: "https://github.com/Mishrashivam66",
    color: "text-white",
    border: "hover:border-white/20",
  },
  {
    title: "LinkedIn",
    subtitle: "Professional Profile",
    icon: FaLinkedin,
    url: "https://linkedin.com/in/shivammishra675bb29b/",
    color: "text-blue-400",
    border: "hover:border-blue-500/30",
  },
  {
    title: "Email",
    subtitle: "Contact Me",
    icon: Mail,
    url: "mailto:shivammgrmishra@gmail.com",
    color: "text-cyan-400",
    border: "hover:border-cyan-500/30",
  },
];

const SocialLinks = () => {
  return (
    <div className="space-y-4">
      {socialLinks.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.a
            key={item.title}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              duration: 0.45,
            }}
            viewport={{ once: true }}
            whileHover={{
              x: 5,
            }}
            className={`group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl transition-all duration-300 ${item.border}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-slate-950">
                <Icon className={`h-7 w-7 ${item.color}`} />
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white">
                  {item.title}
                </h4>

                <p className="text-sm text-slate-400">{item.subtitle}</p>
              </div>
            </div>

            <ArrowUpRight className="h-5 w-5 text-slate-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-cyan-400" />
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialLinks;
