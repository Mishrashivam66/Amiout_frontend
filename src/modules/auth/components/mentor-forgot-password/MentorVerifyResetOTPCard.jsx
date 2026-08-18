// ============================================================
// AMIOUT Enterprise Edition
// MentorVerifyResetOTPCard.jsx
// ============================================================

import { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { motion } from "framer-motion";

import { ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";

import OTPInput from "react-otp-input";

import { toast } from "sonner";

import {
  verifyMentorResetOtp,
  resendMentorResetOtp,
} from "../../services/mentorAuth.service";

const MentorVerifyResetOTPCard = () => {
  // ==========================================================
  // Navigation
  // ==========================================================

  const navigate = useNavigate();

  const location = useLocation();

  const email = location.state?.email;

  // ==========================================================
  // State
  // ==========================================================

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [resending, setResending] = useState(false);

  const [timer, setTimer] = useState(60);

  // ==========================================================
  // Timer
  // ==========================================================

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ==========================================================
  // Invalid Session
  // ==========================================================

  useEffect(() => {
    if (!email) {
      toast.error("Invalid password reset session.");

      navigate("/mentor/forgot-password");
    }
  }, [email, navigate]);

  // ==========================================================
  // Verify OTP
  // ==========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");

      return;
    }

    try {
      setLoading(true);

      const response = await verifyMentorResetOtp({
        email,
        otp,
      });

      toast.success(response.message);

      navigate("/mentor/reset-password", {
        state: {
          email,
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // Resend OTP
  // ==========================================================

  const handleResendOtp = async () => {
    try {
      setResending(true);

      const response = await resendMentorResetOtp(email);

      toast.success(response.message);

      setTimer(60);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Unable to resend OTP.");
    } finally {
      setResending(false);
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
      {/* Top Gradient */}

      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />

      {/* Glow */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[140px]" />

      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px]" />

      <div className="relative z-10 p-8">
        {/* Icon */}

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

        {/* Heading */}

        <h2 className="mt-6 text-center text-3xl font-bold text-white">
          Verify Reset OTP
        </h2>

        <p className="mt-3 text-center text-slate-400">
          Enter the 6-digit OTP sent to
        </p>

        <p className="text-center font-medium text-cyan-400">{email}</p>

        {/* Form */}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputType="tel"
            shouldAutoFocus
            renderSeparator={<span className="mx-2" />}
            renderInput={(props) => (
              <input
                {...props}
                className="
        h-14
        w-14
        rounded-xl
        border
        border-white/10
        bg-slate-900/70
        text-center
        text-2xl
        font-bold
        text-white
        outline-none
        transition-all
        appearance-none
        focus:border-cyan-400
        focus:ring-2
        focus:ring-cyan-500/30
      "
                style={{
                  WebkitAppearance: "none",
                  MozAppearance: "textfield",
                }}
              />
            )}
          />

          {/* Verify Button */}

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

          {/* Resend */}

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-slate-400">
                Resend OTP in{" "}
                <span className="font-semibold text-cyan-400">{timer}s</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="
                  inline-flex
                  items-center
                  gap-2
                  font-semibold
                  text-cyan-400
                  transition
                  hover:text-cyan-300
                "
              >
                <RotateCcw className="h-4 w-4" />

                {resending ? "Sending..." : "Resend OTP"}
              </button>
            )}
          </div>

          {/* Footer */}

          <div className="pt-2 text-center">
            <p className="text-slate-400">
              Back to
              <Link
                to="/mentor/login"
                className="
                  ml-2
                  font-semibold
                  text-cyan-400
                  transition-all
                  duration-300
                  hover:text-cyan-300
                "
              >
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default MentorVerifyResetOTPCard;
