"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";

import AdminLoginHeader from "./AdminLoginHeader";
import { loginAdmin } from "../services/adminAuth.service";

const AdminLoginCard = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return toast.error("Please enter email and password.");
    }

    try {
      setLoading(true);

      const response = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });

      login(response.user, response.accessToken);

      toast.success(response.message);

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Admin login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#111827]/80 p-8 backdrop-blur-xl">
      <AdminLoginHeader />

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <input
          type="email"
          name="email"
          placeholder="Official Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full rounded-xl bg-[#1d2740] p-4 text-white outline-none"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
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

        <div className="text-right">
          <Link
            to="/admin/forgot-password"
            className="text-sm text-cyan-400 hover:text-cyan-300"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-cyan-500 py-4 font-semibold text-black transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Signing In..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-slate-400">
        Don't have an account?{" "}
        <Link to="/admin/register" className="font-semibold text-cyan-400">
          Register
        </Link>
      </p>
    </div>
  );
};

export default AdminLoginCard;
