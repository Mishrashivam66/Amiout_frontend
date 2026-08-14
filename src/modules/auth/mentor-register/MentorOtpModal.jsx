"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  verifyMentorOtp,
  resendMentorOtp,
} from "../services/mentorAuth.service";

const MentorOtpModal = ({ open, email, onClose }) => {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!open) return;

    setTimer(60);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return toast.error("Enter valid OTP.");
    }

    try {
      setLoading(true);

      const response = await verifyMentorOtp({
        email,
        otp,
      });

      toast.success(response.message);

      onClose();

      navigate("/mentor/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // RESEND OTP
  // ==========================================

  const handleResend = async () => {
    try {
      await resendMentorOtp(email);

      toast.success("OTP sent successfully.");

      setTimer(60);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to resend OTP.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-cyan-500/20 bg-[#101827] p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Verify OTP</h2>

          <button onClick={onClose}>
            <X className="text-slate-400 hover:text-white" />
          </button>
        </div>

        <p className="mb-6 text-sm text-slate-400">
          OTP sent to
          <br />
          <span className="font-semibold text-cyan-400">{email}</span>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6 Digit OTP"
          className="w-full rounded-xl bg-[#1d2740] p-4 text-center text-xl tracking-[10px] text-white outline-none"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-6 text-center">
          {timer > 0 ? (
            <p className="text-slate-400">
              Resend OTP in <span className="text-cyan-400">{timer}s</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="font-semibold text-cyan-400 hover:text-cyan-300"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorOtpModal;
