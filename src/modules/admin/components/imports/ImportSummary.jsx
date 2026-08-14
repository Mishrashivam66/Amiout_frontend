
import {
  FaCheckCircle,
  FaClock,
  FaDatabase,
  FaExclamationTriangle,
  FaPercentage,
  FaTimesCircle,
} from "react-icons/fa";

const ImportSummary = ({
  summary = {
    total: 0,
    imported: 0,
    failed: 0,
    duplicates: 0,
    processingTime: "0 sec",
  },
}) => {
  const successRate =
    summary.total > 0
      ? Math.round((summary.imported / summary.total) * 100)
      : 0;

  const cards = [
    {
      title: "Total Records",
      value: summary.total,
      icon: FaDatabase,
      color: "blue",
    },

    {
      title: "Imported",
      value: summary.imported,
      icon: FaCheckCircle,
      color: "green",
    },

    {
      title: "Failed",
      value: summary.failed,
      icon: FaTimesCircle,
      color: "red",
    },

    {
      title: "Duplicates",
      value: summary.duplicates,
      icon: FaExclamationTriangle,
      color: "orange",
    },

    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: FaPercentage,
      color: "purple",
    },

    {
      title: "Processing Time",
      value: summary.processingTime,
      icon: FaClock,
      color: "cyan",
    },
  ];

  const colors = {
    green: {
      bg: "bg-green-500/10",
      text: "text-green-400",
      border: "border-green-500/20",
    },

    blue: {
      bg: "bg-blue-500/10",
      text: "text-blue-400",
      border: "border-blue-500/20",
    },

    red: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },

    orange: {
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      border: "border-orange-500/20",
    },

    purple: {
      bg: "bg-purple-500/10",
      text: "text-purple-400",
      border: "border-purple-500/20",
    },

    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
    },
  };

  return (
    <section
      className="
        rounded-3xl
        border
        border-[#223447]
        bg-[#122131]
        p-8
      "
    >
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white">Import Summary</h2>

        <p className="mt-2 text-slate-400">
          Complete overview of the latest import process.
        </p>
      </div>

      {/* ====================================================== */}
      {/* Cards */}
      {/* ====================================================== */}

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-3
        "
      >
        {cards.map((card) => {
          const theme = colors[card.color];
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`
                rounded-2xl
                border
                ${theme.border}
                bg-[#0F172A]
                p-6
                transition-all
                duration-300
                hover:-translate-y-1
              `}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.title}</p>

                  <h3 className="mt-3 text-3xl font-bold text-white">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    ${theme.bg}
                    ${theme.text}
                  `}
                >
                  <Icon className="text-2xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ====================================================== */}
      {/* Progress */}
      {/* ====================================================== */}

      <div className="mt-10">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-slate-400">Import Progress</span>

          <span className="font-semibold text-green-400">{successRate}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[#1A2A3D]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-700"
            style={{
              width: `${successRate}%`,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default ImportSummary;
