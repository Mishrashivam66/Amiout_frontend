// ============================================================
// AMIOUT Enterprise Edition
// Desktop Navigation
// ============================================================

import { motion } from "framer-motion";
import { navigation } from "./navbar.data";

const DesktopNav = () => {
  return (
    <nav className="hidden items-center gap-8 lg:flex">
      {navigation.map((item) => (
        <motion.a
          key={item.title}
          href={item.href}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="group relative text-sm font-semibold tracking-wide text-slate-300 transition-colors duration-300 hover:text-white"
        >
          {item.title}

          <span className="absolute -bottom-2 left-0 h-0.5 w-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full" />
        </motion.a>
      ))}
    </nav>
  );
};

export default DesktopNav;
