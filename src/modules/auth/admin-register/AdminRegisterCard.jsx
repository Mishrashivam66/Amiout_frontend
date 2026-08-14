"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import AdminRegisterHeader from "./AdminRegisterHeader";
import AdminOtpModal from "./AdminOtpModal";

import { registerAdmin } from "../services/adminAuth.service";

const AdminRegisterCard = () => {
  const [loading, setLoading] = useState(false);

  const [showOtpModal, setShowOtpModal] = useState(false);

  const [registeredEmail, setRegisteredEmail] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
    confirmPassword: "",
  });

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.employeeId ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return toast.error("Please fill all fields.");
    }

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      setLoading(true);

      const response = await registerAdmin({
        name: formData.name,
        email: formData.email,
        employeeId: formData.employeeId,
        password: formData.password,
      });

      toast.success(response.message);

      setRegisteredEmail(formData.email);

      setShowOtpModal(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Admin registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-8 backdrop-blur-xl">
        <AdminRegisterHeader />

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Name */}

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="Full Name"
            className="w-full rounded-xl bg-[#1d2740] p-4 text-white outline-none"
          />

          {/* Official Email */}

          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            placeholder="Official Email"
            className="w-full rounded-xl bg-[#1d2740] p-4 text-white outline-none"
          />

          {/* Employee ID */}

          <input
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            type="text"
            placeholder="Employee ID"
            className="w-full rounded-xl bg-[#1d2740] p-4 text-white outline-none"
          />

          {/* Password */}

          <div className="relative">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full rounded-xl bg-[#1d2740] p-4 pr-12 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password */}

          <div className="relative">
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full rounded-xl bg-[#1d2740] p-4 pr-12 text-white outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Register Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Registering..." : "Register Admin"}
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{" "}
          <Link to="/admin/login" className="font-semibold text-cyan-400">
            Login
          </Link>
        </p>
      </div>

      <AdminOtpModal
        open={showOtpModal}
        email={registeredEmail}
        onClose={() => setShowOtpModal(false)}
      />
    </>
  );
};

export default AdminRegisterCard;
