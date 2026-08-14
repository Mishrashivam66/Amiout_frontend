// ============================================================
// AMIOUT Enterprise Edition
// AuthInput.jsx
// ============================================================

import { motion } from "framer-motion";

const AuthInput = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  name,
}) => {
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
      {/* Input */}
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
        {/* Icon */}

        <div className="pl-5">
          <Icon className="h-5 w-5 text-slate-400 transition-colors duration-300 group-focus-within:text-cyan-400" />
        </div>

        {/* Input */}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
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
      </div>
    </motion.div>
  );
};

export default AuthInput;
