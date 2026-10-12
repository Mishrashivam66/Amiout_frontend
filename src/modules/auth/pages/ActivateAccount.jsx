import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import api from "../../../services/api";
import campusLogo from "../../../assets/Campus Logo.png";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const normalizeEmail = (value) => value.trim().toLowerCase();

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

const formatTime = (seconds) =>
  `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

const ActivateAccount = () => {
  const navigate = useNavigate();
  const otpRefs = useRef([]);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [step, setStep] = useState("EMAIL");
  const [loading, setLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);

  useEffect(() => {
    if (step !== "OTP" || resendSeconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [step, resendSeconds]);

  useEffect(() => {
    if (step === "OTP") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
  };

  const startResendTimer = () => {
    setResendSeconds(RESEND_SECONDS);
  };

  // ==========================================
  // SEND ACTIVATION OTP
  // ==========================================

  const sendOtp = async (event) => {
    event.preventDefault();

    if (loading) return;

    const userEmail = normalizeEmail(email);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/activation/request-otp", {
        email: userEmail,
      });

      setEmail(userEmail);
      resetOtp();
      startResendTimer();
      setStep("OTP");

      toast.success(
        response?.data?.message || "Activation OTP sent successfully.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // OTP INPUT HANDLING
  // ==========================================

  const handleOtpChange = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setOtp((previous) => {
      const updated = [...previous];
      updated[index] = digit;
      return updated;
    });

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      otpRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      event.preventDefault();
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);

    if (!pasted) return;

    const updated = Array(OTP_LENGTH).fill("");

    pasted.split("").forEach((digit, index) => {
      updated[index] = digit;
    });

    setOtp(updated);

    otpRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const verifyOtp = async (event) => {
    event.preventDefault();

    if (loading) return;

    const enteredOtp = otp.join("");

    if (!/^\d{6}$/.test(enteredOtp)) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/activation/verify-otp", {
        email: normalizeEmail(email),
        otp: enteredOtp,
      });

      setStep("SUCCESS");

      toast.success(
        response?.data?.message || "Account activated successfully!",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const resendOtp = async () => {
    if (loading || resendSeconds > 0) return;

    try {
      setLoading(true);

      const response = await api.post("/auth/activation/resend-otp", {
        email: normalizeEmail(email),
      });

      resetOtp();
      startResendTimer();
      otpRefs.current[0]?.focus();

      toast.success(response?.data?.message || "A new OTP has been sent.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/10 " +
    "bg-white/[0.045] px-4 py-4 text-sm " +
    "text-white placeholder:text-slate-500 " +
    "outline-none transition-all duration-300 " +
    "focus:border-cyan-400/60 " +
    "focus:bg-white/[0.07] " +
    "focus:ring-4 focus:ring-cyan-400/10";

  const primaryButtonClass =
    "group flex w-full items-center justify-center " +
    "gap-2 rounded-2xl bg-gradient-to-r " +
    "from-cyan-500 via-blue-600 to-violet-600 " +
    "px-5 py-4 text-sm font-bold text-white " +
    "shadow-[0_12px_35px_rgba(37,99,235,0.25)] " +
    "transition-all duration-300 " +
    "hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(37,99,235,0.35)] " +
    "active:translate-y-0 disabled:cursor-not-allowed " +
    "disabled:opacity-60 disabled:hover:translate-y-0";

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#030817] px-4 py-10 text-white sm:px-6">
      {/* ======================================
          BACKGROUND
      ====================================== */}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 12% 15%, rgba(6,182,212,0.10), transparent 35%), radial-gradient(circle at 88% 85%, rgba(124,58,237,0.13), transparent 38%)",
        }}
        aria-hidden="true"
      />

      {/* Campus logo watermark - desktop */}
      <div
        className="pointer-events-none absolute left-[4%] top-1/2 hidden h-[min(42vw,600px)] w-[min(42vw,600px)] -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-[0.10] xl:block"
        style={{
          backgroundImage: `url("${campusLogo}")`,
        }}
        aria-hidden="true"
      />

      {/* Campus logo watermark - mobile/tablet */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 bg-contain bg-center bg-no-repeat opacity-[0.035] xl:hidden"
        style={{
          backgroundImage: `url("${campusLogo}")`,
        }}
        aria-hidden="true"
      />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[110px]" />

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden="true"
      />

      {/* ======================================
          MAIN CARD
      ====================================== */}

      <div className="relative z-10 w-full max-w-[480px] overflow-hidden rounded-[30px] border border-cyan-400/20 bg-[#08152c]/90 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">
        {/* Top accent */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />

        {/* ====================================
            BRANDING
        ==================================== */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-[22px] border border-cyan-400/20 bg-gradient-to-br from-cyan-400/15 to-blue-600/10 shadow-[0_0_35px_rgba(6,182,212,0.12)]">
            {step === "SUCCESS" ? (
              <CheckCircle2 size={35} className="text-emerald-400" />
            ) : (
              <ShieldCheck size={35} className="text-cyan-400" />
            )}
          </div>

          <h1 className="bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-3xl font-black tracking-tight text-transparent">
            AMIOUT
          </h1>

          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.20em] text-cyan-400 sm:text-[10px]">
            Amity University Madhya Pradesh
          </p>

          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <h2 className="mt-6 text-[22px] font-bold tracking-tight sm:text-2xl">
            {step === "EMAIL"
              ? "Activate Your Account"
              : step === "OTP"
                ? "Verify Your Email"
                : "Account Activated!"}
          </h2>

          <p className="mx-auto mt-3 max-w-[340px] text-sm leading-6 text-slate-400">
            {step === "EMAIL"
              ? "Enter your registered university email address to securely activate your AMIOUT account."
              : step === "OTP"
                ? "We've sent a 6-digit verification code to your registered email address."
                : "Your account is ready! Check your inbox for your temporary login password."}
          </p>
        </div>

        {/* ====================================
            STEP INDICATOR
        ==================================== */}

        <div className="mb-8 flex items-center justify-center gap-3">
          {["EMAIL", "OTP", "SUCCESS"].map((item, index) => {
            const steps = ["EMAIL", "OTP", "SUCCESS"];

            const currentIndex = steps.indexOf(step);

            const active = index <= currentIndex;

            return (
              <div key={item} className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-all ${
                    active
                      ? "border-cyan-400/40 bg-cyan-400/15 text-cyan-300"
                      : "border-white/10 bg-white/5 text-slate-500"
                  }`}
                >
                  {index < currentIndex ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    index + 1
                  )}
                </div>

                {index < 2 && (
                  <div
                    className={`h-px w-10 sm:w-14 ${
                      index < currentIndex ? "bg-cyan-400/60" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* ====================================
            STEP 1: EMAIL
        ==================================== */}

        {step === "EMAIL" && (
          <form onSubmit={sendOtp} className="space-y-5">
            <div>
              <label
                htmlFor="activation-email"
                className="mb-2.5 block text-sm font-semibold text-slate-200"
              >
                University Email Address
              </label>

              <div className="relative">
                <Mail
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400"
                />

                <input
                  id="activation-email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={loading}
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Enter your registered email"
                  className={`${inputClass} pl-12`}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Use the email registered with your university.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={primaryButtonClass}
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Sending OTP...
                </>
              ) : (
                <>
                  Send Activation OTP
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>
        )}

        {/* ====================================
            STEP 2: VERIFY OTP
        ==================================== */}

        {step === "OTP" && (
          <form onSubmit={verifyOtp} className="space-y-6">
            <div className="rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.055] px-4 py-3 text-center">
              <p className="text-xs text-slate-400">
                Verification code sent to
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-cyan-300">
                {email}
              </p>
            </div>

            <div>
              <label className="mb-3 block text-center text-sm font-semibold text-slate-200">
                Enter 6-Digit OTP
              </label>

              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpRefs.current[index] = element;
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength={1}
                    value={digit}
                    disabled={loading}
                    aria-label={`OTP digit ${index + 1}`}
                    onChange={(event) =>
                      handleOtpChange(index, event.target.value)
                    }
                    onKeyDown={(event) => handleOtpKeyDown(index, event)}
                    onPaste={handleOtpPaste}
                    className="h-12 min-w-0 flex-1 rounded-xl border border-white/15 bg-white/[0.045] text-center text-xl font-bold text-white outline-none transition-all focus:border-cyan-400 focus:bg-cyan-400/10 focus:ring-2 focus:ring-cyan-400/15 disabled:opacity-60 sm:h-14 sm:text-2xl"
                  />
                ))}
              </div>

              <p className="mt-3 text-center text-xs text-slate-500">
                Enter the code from your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.join("").length !== OTP_LENGTH}
              className={primaryButtonClass}
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <ShieldCheck size={19} />
                  Verify & Activate
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  resetOtp();
                  setResendSeconds(0);
                  setStep("EMAIL");
                }}
                className="text-sm text-slate-400 transition hover:text-white disabled:opacity-50"
              >
                Change Email
              </button>

              <button
                type="button"
                onClick={resendOtp}
                disabled={loading || resendSeconds > 0}
                className="flex items-center gap-2 text-sm font-semibold text-cyan-400 transition hover:text-cyan-300 disabled:cursor-not-allowed disabled:text-slate-500"
              >
                {resendSeconds > 0 ? (
                  <>
                    <Clock3 size={16} />
                    Resend in {formatTime(resendSeconds)}
                  </>
                ) : (
                  <>
                    <RefreshCw size={16} />
                    Resend OTP
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* ====================================
            STEP 3: SUCCESS
        ==================================== */}

        {step === "SUCCESS" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.055] p-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-400/10">
                <CheckCircle2 size={36} className="text-emerald-400" />
              </div>

              <h3 className="text-lg font-bold text-emerald-300">
                Activation Successful!
              </h3>

              <p className="mt-3 text-sm leading-6 text-slate-300">
                Your account has been activated. Check your registered email for
                your temporary password.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/10 bg-[#061126] p-4 text-left">
                <Mail size={20} className="mt-0.5 shrink-0 text-cyan-400" />

                <div>
                  <p className="text-sm font-semibold text-white">
                    Check Your Inbox
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Use your temporary password to sign in. You'll be asked to
                    create a new password during your first login.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/login", {
                  replace: true,
                })
              }
              className={primaryButtonClass}
            >
              Continue to Login
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* ====================================
            FOOTER
        ==================================== */}

        {step !== "SUCCESS" && (
          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 text-sm text-slate-400 transition hover:text-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 border-t border-white/[0.07] pt-6">
          <LockKeyhole size={13} className="text-cyan-400/70" />

          <p className="text-center text-[11px] text-slate-500">
            Secure Account Activation
            <span className="mx-2 text-slate-700">•</span>
            AMIOUT
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
