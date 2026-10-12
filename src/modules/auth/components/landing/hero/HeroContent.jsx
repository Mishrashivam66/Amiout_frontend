import { motion } from "framer-motion";
import CTAButtons from "./CTAButtons";

const fade = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } };
const HeroContent = () => (
  <motion.div
    initial="hidden"
    animate="visible"
    transition={{ staggerChildren: 0.12 }}
    className="relative z-20 w-full max-w-[540px]"
  >
    <motion.div
      variants={fade}
      className="inline-flex rounded-full border border-cyan-500/60 bg-[#041b35]/80 px-4 py-2 text-[10px] font-semibold tracking-[.19em] text-cyan-300 sm:text-xs"
    >
      AMITY UNIVERSITY MADHYA PRADESH
    </motion.div>
    <motion.h1
      variants={fade}
      className="
  mt-6
  text-[clamp(2.9rem,5vw,5.8rem)]
  font-black
  leading-[1.02]
  tracking-[-0.055em]
  text-white
"
    >
      Freedom
      <br />
      with
      <br />
      <span className="bg-gradient-to-r from-violet-500 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
        Responsibility
      </span>
    </motion.h1>
    <motion.p
      variants={fade}
      className="mt-7 text-xs font-semibold tracking-[.34em] text-blue-200 sm:text-sm"
    >
      SMART | SECURE | SEAMLESS
    </motion.p>
    <motion.p
      variants={fade}
      className="mt-5 max-w-[465px] text-base leading-7 text-slate-300 sm:text-lg"
    >
      AMIOUT simplifies the outpass process for day scholars with a digital,
      transparent and secure system — designed for a smarter campus experience.
    </motion.p>
    <motion.div variants={fade} className="mt-8">
      <CTAButtons />
    </motion.div>
  </motion.div>
);
export default HeroContent;
