import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";

import api from "../../../services/api";

const ActivateAccount = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("EMAIL");
  const [loading, setLoading] = useState(false);

  const normalizeEmail = (value) => value.trim().toLowerCase();

  const getErrorMessage = (error) =>
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again.";

  // ========================================
  // SEND ACTIVATION OTP
  // ========================================

  const sendOtp = async (event) => {
    event.preventDefault();

    const userEmail = normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      toast.error("Enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/activation/request-otp", {
        email: userEmail,
      });

      toast.success(
        response?.data?.message || "OTP sent to your registered email.",
      );

      setEmail(userEmail);
      setStep("OTP");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // VERIFY OTP & ACTIVATE ACCOUNT
  // ========================================

  const verifyOtp = async (event) => {
    event.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("Enter the 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/activation/verify-otp", {
        email: normalizeEmail(email),
        otp: otp.trim(),
      });

      toast.success(
        response?.data?.message || "Account activated successfully.",
      );

      setStep("SUCCESS");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // RESEND OTP
  // ========================================

  const resendOtp = async () => {
    try {
      setLoading(true);

      const response = await api.post("/auth/activation/resend-otp", {
        email: normalizeEmail(email),
      });

      toast.success(response?.data?.message || "A new OTP has been sent.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030b1e] flex items-center justify-center px-4 py-10 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-140px] left-[-120px] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-140px] right-[-120px] w-[400px] h-[400px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[480px] rounded-[28px] border border-cyan-500/30 bg-[#07132a] shadow-[0_0_45px_rgba(0,200,255,0.10)] p-7 sm:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            {step === "SUCCESS" ? (
              <CheckCircle2 size={32} className="text-emerald-400" />
            ) : (
              <ShieldCheck size={32} className="text-cyan-400" />
            )}
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight">AMIOUT</h1>

          <p className="text-[10px] sm:text-xs tracking-[0.22em] font-semibold text-cyan-400 mt-1">
            AMITY UNIVERSITY MADHYA PRADESH
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mt-7">
            {step === "EMAIL"
              ? "Activate Your Account"
              : step === "OTP"
                ? "Verify Your Email"
                : "Account Activated"}
          </h2>

          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            {step === "EMAIL"
              ? "Enter your registered university email to receive an activation OTP."
              : step === "OTP"
                ? "Enter the verification code sent to your email."
                : "Your account has been activated. Check your email for your temporary password."}
          </p>
        </div>

        {/* ==================================
            STEP 1: EMAIL
        ================================== */}

        {step === "EMAIL" && (
          <form onSubmit={sendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="activation-email"
                className="block text-sm font-semibold text-slate-200 mb-2"
              >
                University Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  id="activation-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-slate-700 bg-[#101d36] py-3.5 pl-12 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-3.5 font-bold disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Send OTP
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ==================================
            STEP 2: VERIFY OTP
        ================================== */}

        {step === "OTP" && (
          <form onSubmit={verifyOtp} className="space-y-5">
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center">
              <p className="text-xs text-slate-400">OTP sent to</p>
              <p className="text-sm font-semibold text-cyan-300 mt-1 break-all">
                {email}
              </p>
            </div>

            <div>
              <label
                htmlFor="activation-otp"
                className="block text-sm font-semibold text-slate-200 mb-2"
              >
                6-Digit Verification Code
              </label>

              <div className="relative">
                <KeyRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  id="activation-otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full rounded-xl border border-slate-700 bg-[#101d36] py-3.5 pl-12 pr-4 text-center text-lg font-bold tracking-[0.3em] text-white outline-none focus:border-cyan-400 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-3.5 font-bold disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Verify & Activate
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex justify-between items-center text-sm">
              <button
                type="button"
                onClick={() => {
                  setOtp("");
                  setStep("EMAIL");
                }}
                className="text-slate-400 hover:text-white"
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={loading}
                className="text-cyan-400 font-semibold hover:text-cyan-300 disabled:opacity-60"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* ==================================
            STEP 3: SUCCESS
        ================================== */}

        {step === "SUCCESS" && (
          <div className="space-y-5">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 text-center">
              <CheckCircle2
                size={30}
                className="text-emerald-400 mx-auto mb-3"
              />

              <p className="font-semibold text-emerald-300">
                Activation Successful
              </p>

              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Your temporary password will be sent to your registered email.
                Use it to sign in.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  replace: true,
                })
              }
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-3.5 font-bold"
            >
              Go to Login
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* Footer */}
        {step !== "SUCCESS" && (
          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        )}

        <p className="text-center text-[11px] text-slate-500 mt-8">
          Secure account activation • AMIOUT
        </p>
      </div>
    </div>
  );
};

export default ActivateAccount;
