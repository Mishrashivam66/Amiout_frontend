// ============================================================
// AMIOUT Enterprise Edition
// VerifyOTP.jsx
// ============================================================

import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import OTPIllustration from "../otp/OTPIllustration";
import OTPCard from "../otp/OTPCard";

const VerifyOTP = () => {
  const location = useLocation();

  const email = location.state?.email;

  const purpose = location.state?.purpose;

  console.log("LOCATION:", location);
  console.log("EMAIL:", email);
  console.log("PURPOSE:", purpose);

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* ====================================== */}
      {/* Background */}
      {/* ====================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* ====================================== */}
      {/* Glow */}
      {/* ====================================== */}

      <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-violet-500/10 blur-[140px]" />

      {/* ====================================== */}
      {/* Layout */}
      {/* ====================================== */}

      <div className="relative z-10 flex min-h-screen">
        {/* ====================================== */}
        {/* Left */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            hidden
            xl:flex
            xl:w-1/2
            items-start
            justify-center
            pt-12
            px-10
          "
        >
          <OTPIllustration />
        </motion.div>

        {/* ====================================== */}
        {/* Right */}
        {/* ====================================== */}

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="
            flex
            w-full
            items-start
            justify-center
            px-6
            pt-12
            pb-12
            xl:w-1/2
          "
        >
          <div className="w-full max-w-xl">
            <OTPCard email={email} purpose={purpose} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOTP;
