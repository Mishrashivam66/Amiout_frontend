import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

const AuthInput = ({
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  name,

  // NEW PROPS
  isValid = false,
  isInvalid = false,
  helperText = "",
  inputMode = "text",
  maxLength,
  autoComplete = "off",
}) => {
  const borderClass = isValid
    ? "border-green-500 shadow-green-500/20"
    : isInvalid
      ? "border-red-500 shadow-red-500/20"
      : "border-white/10 hover:border-cyan-500/40 focus-within:border-cyan-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-2"
    >
      {/* Label */}

      <label className="text-sm font-semibold tracking-wide text-slate-300">
        {label}
      </label>

      {/* Input */}

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
          shadow-lg
          ${borderClass}
          focus-within:ring-4
          focus-within:ring-cyan-500/10
        `}
      >
        {/* Left Icon */}

        <div className="pl-5">
          <Icon className="h-5 w-5 text-slate-400 transition-all group-focus-within:text-cyan-400" />
        </div>

        {/* Input */}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          spellCheck={false}
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

        {/* Validation Icon */}

        {isValid && <CheckCircle2 className="mr-5 h-5 w-5 text-green-400" />}

        {isInvalid && <XCircle className="mr-5 h-5 w-5 text-red-400" />}
      </div>

      {/* Helper Text */}

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
    </motion.div>
  );
};

export default AuthInput;
