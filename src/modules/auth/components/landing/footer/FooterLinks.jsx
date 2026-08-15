// ============================================================
// AMIOUT
// FooterLinks.jsx
// ============================================================

import { motion } from "framer-motion";

const footerData = [
  {
    title: "Platform",
    links: ["Home", "Features", "Dashboard", "Contact"],
  },

  {
    title: "User Portals",
    links: ["Student Login", "Mentor Login", "Admin Login", "Register"],
  },

  {
    title: "Project",
    links: [
      "About AMIOUT",
      "Project Mentor",
      "Development Team",
      "Amity University",
    ],
  },
];

const FooterLinks = () => {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {footerData.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
          }}
          viewport={{ once: true }}
        >
          <h4 className="mb-6 text-lg font-bold text-white">{section.title}</h4>

          <ul className="space-y-4">
            {section.links.map((link) => (
              <li key={link}>
                <span className="group inline-flex items-center text-slate-400 transition duration-300 hover:text-cyan-300 cursor-default">
                  <span className="mr-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:mr-3 group-hover:w-4" />

                  {link}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};

export default FooterLinks;
