import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CirclePlay } from "lucide-react";
const MotionLink = motion(Link);
const CTAButtons = () => (
  <div className="flex flex-wrap gap-4">
    <MotionLink
      to="/login"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex min-h-14 items-center gap-5 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-600 px-7 font-bold text-white shadow-[0_10px_32px_rgba(14,165,233,.3)]"
    >
      Get Started <ArrowRight size={20} />
    </MotionLink>
    <motion.a
      href="#how-it-works"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="inline-flex min-h-14 items-center gap-3 rounded-full border border-blue-300/30 bg-[#030b1e]/70 px-7 font-medium text-blue-100"
    >
      <CirclePlay size={22} className="text-cyan-300" /> Watch Demo
    </motion.a>
  </div>
);
export default CTAButtons;
