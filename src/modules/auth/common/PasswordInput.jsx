import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

const PasswordInput = ({
  label = "Password",
  placeholder = "Enter your password",
  value,
  onChange,
  name = "password",

  // NEW
  isValid = false,
  isInvalid = false,
  helperText = "",

  strength = 0,
  strengthLabel = "",

  showStrength = false,
  showChecklist = false,

  passwordChecks = {},
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const borderClass = isValid
    ? "border-green-500 shadow-green-500/20"
    : isInvalid
      ? "border-red-500 shadow-red-500/20"
      : "border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-400";

  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-cyan-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <label className="text-sm font-semibold tracking-wide text-slate-300">
        {label}
      </label>

      <div
        className={`
        group
        flex
        items-center
        rounded-2xl
        border
        bg-white/5
        backdrop-blur-xl
        transition-all
        duration-300
        ${borderClass}
        focus-within:ring-4
        focus-within:ring-cyan-500/10
      `}
      >
        <div className="pl-5">
          <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-cyan-400" />
        </div>

        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="new-password"
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

        {isValid && <CheckCircle2 className="mr-2 h-5 w-5 text-green-400" />}

        {isInvalid && <XCircle className="mr-2 h-5 w-5 text-red-400" />}

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="pr-5 text-slate-400 transition hover:text-cyan-400"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {helperText && (
        <p
          className={`text-sm ${
            isValid
              ? "text-green-400"
              : isInvalid
                ? "text-red-400"
                : "text-slate-400"
          }`}
        >
          {helperText}
        </p>
      )}

      {showStrength && (
        <div className="space-y-2">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full transition-all duration-500 ${
                strengthColor[strength]
              }`}
              style={{
                width: `${strength * 20}%`,
              }}
            />
          </div>

          <p className="text-sm font-medium text-cyan-300">
            Strength : {strengthLabel}
          </p>
        </div>
      )}

      {showChecklist && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <p
            className={
              passwordChecks.length ? "text-green-400" : "text-red-400"
            }
          >
            ✔ Minimum 8 Characters
          </p>

          <p
            className={passwordChecks.upper ? "text-green-400" : "text-red-400"}
          >
            ✔ Uppercase Letter
          </p>

          <p
            className={passwordChecks.lower ? "text-green-400" : "text-red-400"}
          >
            ✔ Lowercase Letter
          </p>

          <p
            className={
              passwordChecks.number ? "text-green-400" : "text-red-400"
            }
          >
            ✔ Number
          </p>

          <p
            className={
              passwordChecks.special ? "text-green-400" : "text-red-400"
            }
          >
            ✔ Special Character
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PasswordInput;
