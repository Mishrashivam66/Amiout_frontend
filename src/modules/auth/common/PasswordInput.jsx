// ============================================================
// AMIOUT Enterprise Edition
// PasswordInput.jsx
// ============================================================

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label = "Password",
  placeholder = "Enter your password",
  value,
  onChange,
  name = "password",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.4,
      }}
      className="space-y-3"
    >
      {/* ====================================== */}
      {/* Label */}
      {/* ====================================== */}

      <label className="text-sm font-semibold tracking-wide text-slate-300">
        {label}
      </label>

      {/* ====================================== */}
      {/* Password Field */}
      {/* ====================================== */}

      <div
        className="
          group
          flex
          items-center
          rounded-2xl
          border
          border-white/10
          bg-white/5
          backdrop-blur-xl
          transition-all
          duration-300

          hover:border-cyan-500/40

          focus-within:border-cyan-400
          focus-within:ring-4
          focus-within:ring-cyan-500/10
        "
      >
        {/* Lock Icon */}

        <div className="pl-5">
          <Lock className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-400" />
        </div>

        {/* Password Input */}

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="current-password"
          className="
            w-full
            bg-transparent
            px-4
            py-4
            text-white
            placeholder:text-slate-500
            outline-none
          "
        />

        {/* Toggle */}

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="pr-5 text-slate-400 transition hover:text-cyan-400"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default PasswordInput;
