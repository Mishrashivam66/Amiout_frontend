import CountUp from "react-countup";

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "green",
  percentage,
  description,
}) => {
  const colors = {
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
      glow: "shadow-green-500/10",
    },

    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
      glow: "shadow-blue-500/10",
    },

    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
      glow: "shadow-red-500/10",
    },

    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
      glow: "shadow-orange-500/10",
    },

    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
      glow: "shadow-purple-500/10",
    },

    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
      glow: "shadow-cyan-500/10",
    },
  };

  const theme = colors[color] || colors.green;

  return (
    <div
      className={`
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        ${theme.border}
        bg-[#122131]
        p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
        ${theme.glow}
      `}
    >
      {/* ========================================= */}
      {/* Glow Effect */}
      {/* ========================================= */}

      <div
        className={`
          absolute
          -right-8
          -top-8
          h-28
          w-28
          rounded-full
          blur-3xl
          opacity-20
          ${theme.bg}
        `}
      />

      {/* ========================================= */}
      {/* Header */}
      {/* ========================================= */}

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            {Number(value) || 0}
          </h2>
        </div>

        <div
          className={`
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            ${theme.bg}
            ${theme.text}
            transition-all
            duration-300
            group-hover:scale-110
          `}
        >
          {Icon && <Icon className="text-3xl" />}
        </div>
      </div>

      {/* ========================================= */}
      {/* Footer */}
      {/* ========================================= */}

      <div className="mt-6 flex items-center justify-between">
        <div>
          {percentage && (
            <span
              className={`
                rounded-full
                px-3
                py-1
                text-xs
                font-semibold
                ${theme.bg}
                ${theme.text}
              `}
            >
              {percentage}
            </span>
          )}
        </div>

        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;
