// ============================================================
// AMIOUT Enterprise Edition
// VerifyResetOTPCard.jsx
// ============================================================

import { useEffect, useRef, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { ShieldCheck, ArrowRight } from "lucide-react";

import { toast } from "sonner";

import { verifyResetOTP, resendResetOTP } from "../services/auth.service";

const VerifyResetOTPCard = () => {
  // ==========================================================
  // Navigation
  // ==========================================================

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  // ==========================================================
  // States
  // ==========================================================

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  const inputs = useRef([]);

  // ==========================================================
  // Redirect
  // ==========================================================

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  // ==========================================================
  // Countdown
  // ==========================================================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);
  // ==========================================================
  // HANDLE CHANGE
  // ==========================================================

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];

    newOtp[index] = value;

    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // ==========================================================
  // HANDLE KEY DOWN
  // ==========================================================

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  // ==========================================================
  // HANDLE PASTE
  // ==========================================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasted)) {
      toast.error("Please paste a valid 6-digit OTP.");
      return;
    }

    const values = pasted.split("");

    setOtp(values);

    values.forEach((digit, index) => {
      if (inputs.current[index]) {
        inputs.current[index].value = digit;
      }
    });

    inputs.current[5]?.focus();
  };

  // ==========================================================
  // VERIFY OTP
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyResetOTP({
        email,
        otp: code,
      });

      toast.success(response.message);

      navigate("/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "OTP Verification Failed");
    } finally {
      setLoading(false);
    }
  };
  // ==========================================================
  // RESEND OTP
  // ==========================================================

  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      setLoading(true);

      const response = await resendResetOTP(email);

      toast.success(response.message);

      setOtp(["", "", "", "", "", ""]);

      inputs.current[0]?.focus();

      setTimer(60);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.6,
      }}
      className="
        relative
        w-full
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/5
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      {/* ====================================== */}
      {/* Top Gradient */}
      {/* ====================================== */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* ====================================== */}
      {/* Glow */}
      {/* ====================================== */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      {/* ====================================== */}
      {/* Content */}
      {/* ====================================== */}

      <div className="relative z-10 p-8 md:p-8">
        {/* ====================================== */}
        {/* Header */}
        {/* ====================================== */}
        <div className="flex justify-center">
          <div
            className="
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-cyan-500/20
              to-violet-500/20
              ring-1
              ring-white/10
            "
          >
            <ShieldCheck className="h-10 w-10 text-cyan-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Verify Reset OTP
        </h2>
        <p className="mt-3 text-center text-slate-400">
          Enter the 6-digit OTP sent to
        </p>
        <p className="mt-1 text-center font-semibold text-cyan-400">{email}</p>
        {/* ====================================== */}
        {/* Form */}
        {/* ====================================== */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* ====================================== */}
          {/* OTP Inputs */}
          {/* ====================================== */}

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  h-14
                  w-14
                  rounded-2xl
                  border
                  border-white/10
                  bg-slate-900/60
                  text-center
                  text-2xl
                  font-bold
                  text-white
                  outline-none
                  transition-all
                  duration-300
                  focus:border-cyan-400
                  focus:ring-2
                  focus:ring-cyan-500/30
                "
              />
            ))}
          </div>

          {/* ====================================== */}
          {/* Timer */}
          {/* ====================================== */}

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-slate-400">
                Resend OTP in{" "}
                <span className="font-semibold text-cyan-400">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="
                  font-semibold
                  text-cyan-400
                  transition
                  hover:text-cyan-300
                "
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* ====================================== */}
          {/* Verify Button */}
          {/* ====================================== */}

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={loading}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-cyan-500
              via-blue-500
              to-violet-600
              px-6
              py-3.5
              font-semibold
              text-white
              shadow-xl
              shadow-cyan-500/20
              transition-all
              duration-300
              hover:shadow-cyan-500/40
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>

          {/* ====================================== */}
          {/* Footer */}
          {/* ====================================== */}

          <div className="pt-2 text-center">
            <p className="text-slate-400">
              Remember your password?
              <Link
                to="/login"
                className="ml-2 font-semibold text-cyan-400 transition-all duration-300 hover:text-cyan-300"
              >
                Back to Login
              </Link>
            </p>
          </div>
        </form>{" "}
        {/* <-- Ye missing tha */}
      </div>
    </motion.div>
  );
};

export default VerifyResetOTPCard;
