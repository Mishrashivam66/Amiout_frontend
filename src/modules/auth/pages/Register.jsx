// ============================================================
// AMIOUT Enterprise Edition
// Register Page
// ============================================================

import { motion } from "framer-motion";

import AuthBackground from "../components/layouts/AuthBackground";
import PortalSelection from "../register/PortalSelection";

const Register = () => {
  return (
    <AuthBackground>
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.7,
          ease: "easeOut",
        }}
        className="w-full max-w-7xl"
      >
        <PortalSelection />
      </motion.div>
    </AuthBackground>
  );
};

export default Register;
