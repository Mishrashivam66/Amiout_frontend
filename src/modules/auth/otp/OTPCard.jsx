import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";

import {
  verifyOTP,
  resendOTP,
  verifyResetOTP,
  resendResetOTP,
} from "../services/auth.service";

import OTPHeader from "./OTPHeader";

const OTPCard = ({ email, purpose }) => {
  // ==========================================================
  // State
  // ==========================================================

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  const inputRefs = useRef([]);
  const navigate = useNavigate();

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
  // Handle OTP Change
  // ==========================================================

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;

    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================================
  // Handle Backspace
  // ==========================================================

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ==========================================================
  // Paste OTP
  // ==========================================================

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text").trim().slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const values = paste.split("");

    const updated = [...otp];

    values.forEach((digit, i) => {
      updated[i] = digit;
    });

    setOtp(updated);

    inputRefs.current[Math.min(values.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the complete OTP.");
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // REGISTER OTP
      // ======================================

      if (purpose === "REGISTER") {

        const response = await verifyOTP({
          email,
          otp: code,
        });

        toast.success(response.message);

        setTimeout(() => {
          navigate("/login");
        }, 1200);

        return;
      }

      // ======================================
      // FORGOT PASSWORD OTP
      // ======================================

      if (purpose === "RESET_PASSWORD") {

        const response = await verifyResetOTP({
          email,
          otp: code,
        });

        toast.success(response.message);

        setTimeout(() => {
          navigate("/reset-password", {
            state: {
              email,
            },
          });
        }, 1200);

        return;
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "OTP Verification Failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Resend OTP
  // ==========================================================

  // ==========================================
  // RESEND OTP
  // ==========================================

  const resendOTPHandler = async () => {
    try {
      if (purpose === "REGISTER") {
        const response = await resendOTP(email);

        toast.success(response.message);
      }

      if (purpose === "RESET_PASSWORD") {
        const response = await resendResetOTP(email);

        toast.success(response.message);
      }

      setTimer(60);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    }
  };

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
        max-w-[520px]
        overflow-hidden
        rounded-[28px]
        border
        border-white/10
        bg-white/5
        shadow-2xl
        backdrop-blur-3xl
      "
    >
      {/* Top Gradient */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* Glow */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="relative z-10 p-8">
        <OTPHeader />

        {/* ====================================== */}
        {/* Email Information */}
        {/* ====================================== */}

        <div className="mt-6 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4">
          <p className="text-sm text-slate-400">
            Verification code has been sent to
          </p>

          <p className="mt-2 break-all text-base font-semibold text-cyan-300">
            {email}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          {/* ====================================== */}
          {/* OTP Input */}
          {/* ====================================== */}

          <div className="flex justify-between gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="
                  h-16
                  w-16
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  text-center
                  text-2xl
                  font-bold
                  text-white
                  outline-none
                  transition-all
                  duration-300
                  focus:border-cyan-400
                  focus:ring-4
                  focus:ring-cyan-500/10
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
                onClick={resendOTPHandler}
                className="inline-flex items-center gap-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                <RotateCcw className="h-4 w-4" />
                Resend OTP
              </button>
            )}
          </div>

          {/* ====================================== */}
          {/* Verify Button */}
          {/* ====================================== */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
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
              py-4
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

          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-slate-400">
              Wrong email?
              <Link
                to="/register"
                className="ml-2 font-semibold text-cyan-400 transition hover:text-cyan-300"
              >
                Register Again
              </Link>
            </p>

            <Link
              to="/login"
              className="mt-4 inline-block font-semibold text-cyan-400 transition hover:text-cyan-300"
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default OTPCard;
