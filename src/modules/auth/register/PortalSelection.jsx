// ============================================================
// AMIOUT Enterprise Edition
// Portal Selection
// ============================================================

import { motion } from "framer-motion";

import PortalCard from "./PortalCard";

import { portals } from "./portal.data";
import { containerVariants } from "./portal.variants";

const PortalSelection = () => {
  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl px-5 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      {/* Header */}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-3xl text-center"
      >
        <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-semibold tracking-[0.2em] text-cyan-300 sm:px-5 sm:text-sm">
          AMIOUT ENTERPRISE
        </span>

        <h1 className="mt-6 text-3xl font-black leading-tight text-white sm:mt-8 sm:text-5xl lg:text-6xl">
          Choose Your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
            Portal
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base lg:text-lg">
          Select your role to continue with registration or administrator
          access.
        </p>
      </motion.div>

      {/* Portal Cards */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:mt-16 lg:gap-8"
      >
        {portals.map((portal, index) => (
          <PortalCard key={portal.id} index={index} {...portal} />
        ))}
      </motion.div>
    </section>
  );
};

export default PortalSelection;
