// ============================================================
// AMIOUT Enterprise Edition
// FooterLinks.jsx
// ============================================================

import { motion } from "framer-motion";

const footerData = [
  {
    title: "Platform",
    links: ["Features", "Technology", "Security", "System Status", "Roadmap"],
  },

  {
    title: "Resources",
    links: ["Documentation", "GitHub", "API Reference", "FAQ", "Support"],
  },

  {
    title: "Company",
    links: [
      "About AMIOUT",
      "Development Team",
      "Contact",
      "Privacy Policy",
      "Terms & Conditions",
    ],
  },

  {
    title: "Quick Links",
    links: [
      "Student Portal",
      "Warden Portal",
      "Security Portal",
      "Admin Dashboard",
      "Register",
    ],
  },
];

const FooterLinks = () => {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
      {footerData.map((section, index) => (
        <motion.div
          key={section.title}
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: index * 0.1,
            duration: 0.5,
          }}
          viewport={{
            once: true,
          }}
        >
          {/* Heading */}

          <h4 className="mb-6 text-lg font-bold text-white">{section.title}</h4>

          {/* Links */}

          <ul className="space-y-4">
            {section.links.map((link) => (
              <li key={link}>
                <a
                  href="#"
                  className="group inline-flex items-center text-slate-400 transition-all duration-300 hover:text-cyan-300"
                >
                  <span className="mr-0 h-[2px] w-0 bg-cyan-400 transition-all duration-300 group-hover:mr-3 group-hover:w-4" />

                  {link}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};

export default FooterLinks;
