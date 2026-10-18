import {
  FaCheckCircle,
  FaClock,
  FaDatabase,
  FaExclamationTriangle,
  FaPercentage,
  FaTimesCircle,
  FaSyncAlt,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";

// ============================================================
// DEFAULT SUMMARY
// ============================================================

const DEFAULT_SUMMARY = {
  total: 0,
  imported: 0,
  updated: 0,
  failed: 0,
  duplicates: 0,
  processingTime: "0 sec",
};

// ============================================================
// COLORS
// ============================================================

const COLORS = {
  green: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    border: "border-green-500/20",
    accent: "from-green-500 to-emerald-400",
  },

  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/20",
    accent: "from-blue-500 to-cyan-400",
  },

  red: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    border: "border-red-500/20",
    accent: "from-red-500 to-rose-400",
  },

  orange: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/20",
    accent: "from-orange-500 to-amber-400",
  },

  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/20",
    accent: "from-purple-500 to-violet-400",
  },

  cyan: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/20",
    accent: "from-cyan-500 to-sky-400",
  },

  yellow: {
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/20",
    accent: "from-yellow-500 to-amber-400",
  },
};

// ============================================================
// HELPERS
// ============================================================

const safeNumber = (value) => {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return Math.max(0, number);
};

const getPercentage = (value, total) => {
  if (total <= 0) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round((value / total) * 100)));
};

// ============================================================
// COMPONENT
// ============================================================

const ImportSummary = ({ summary = DEFAULT_SUMMARY }) => {
  // ==========================================================
  // NORMALIZE SUMMARY
  // ==========================================================

  const total = safeNumber(summary?.total);

  const imported = safeNumber(summary?.imported);

  const updated = safeNumber(summary?.updated);

  const failed = safeNumber(summary?.failed);

  const duplicates = safeNumber(summary?.duplicates);

  const processingTime = summary?.processingTime ?? "0 sec";

  // ==========================================================
  // CALCULATIONS
  // ==========================================================

  // Successfully inserted or updated records.
  // Duplicate/skipped records are not counted
  // as successfully written records.

  const successfulRecords = imported + updated;

  const successRate = getPercentage(successfulRecords, total);

  const failureRate = getPercentage(failed, total);

  const duplicateRate = getPercentage(duplicates, total);

  const hasResults = total > 0;

  const hasFailures = failed > 0;

  // ==========================================================
  // SUMMARY CARDS
  // ==========================================================

  const cards = [
    {
      title: "Total Records",
      value: total,
      icon: FaDatabase,
      color: "blue",
      description: "Total rows in the import",
    },

    {
      title: "Imported",
      value: imported,
      icon: FaCheckCircle,
      color: "green",
      description: "New records created",
    },

    {
      title: "Updated",
      value: updated,
      icon: FaSyncAlt,
      color: "cyan",
      description: "Existing records updated",
    },

    {
      title: "Failed",
      value: failed,
      icon: FaTimesCircle,
      color: "red",
      description: "Records that failed",
    },

    {
      title: "Duplicates",
      value: duplicates,
      icon: FaExclamationTriangle,
      color: "orange",
      description: "Duplicate or unchanged records",
    },

    {
      title: "Success Rate",
      value: `${successRate}%`,
      icon: FaPercentage,
      color: "purple",
      description: "Imported or updated rows",
    },

    {
      title: "Processing Time",
      value: processingTime,
      icon: FaClock,
      color: "yellow",
      description: "Time taken for import",
    },
  ];

  // ==========================================================
  // IMPORT STATUS
  // ==========================================================

  const status = !hasResults
    ? {
        label: "No Import Data",
        text: "Upload a file to see import results.",
        color: "text-slate-400",
        bg: "bg-slate-500/10",
        border: "border-slate-500/20",
      }
    : hasFailures
      ? {
          label: "Import Has Failures",
          text: `${failed} record(s) failed. Review validation errors below.`,
          color: "text-orange-400",
          bg: "bg-orange-500/10",
          border: "border-orange-500/20",
        }
      : {
          label: "No Record Failures",
          text: "No failed records were reported.",
          color: "text-green-400",
          bg: "bg-green-500/10",
          border: "border-green-500/20",
        };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <FaChartLine className="text-xl" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white">Import Summary</h2>

              <p className="mt-1 text-sm text-slate-400">
                Complete overview of your latest import.
              </p>
            </div>
          </div>
        </div>

        <div
          className={`
            inline-flex
            items-center
            gap-2
            self-start
            rounded-xl
            border
            px-4
            py-3
            text-sm
            font-semibold
            ${status.bg}
            ${status.border}
            ${status.color}
          `}
        >
          <FaInfoCircle />

          {status.label}
        </div>
      </div>

      {/* ======================================================
          SUMMARY CARDS
      ====================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const theme = COLORS[card.color];

          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                ${theme.border}
                bg-[#0F172A]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                hover:shadow-black/10
              `}
            >
              {/* Accent */}

              <div
                className={`
                  absolute
                  left-0
                  top-0
                  h-1
                  w-full
                  bg-gradient-to-r
                  ${theme.accent}
                  opacity-70
                `}
              />

              {/* Header */}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-400">
                    {card.title}
                  </p>

                  <h3 className="mt-3 break-words text-3xl font-bold text-white">
                    {card.value}
                  </h3>
                </div>

                <div
                  className={`
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    ${theme.bg}
                    ${theme.text}
                  `}
                >
                  <Icon className="text-xl" />
                </div>
              </div>

              {/* Description */}

              <p className="mt-4 text-xs leading-5 text-slate-500">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* ======================================================
          IMPORT SUCCESS RATE
      ====================================================== */}

      <div className="mt-8 rounded-2xl border border-[#223447] bg-[#0F172A] p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">
              Import Success Rate
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Percentage of rows newly imported or updated.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-green-400" />

            <span className="text-2xl font-bold text-green-400">
              {successRate}%
            </span>
          </div>
        </div>

        {/* Success Progress Bar */}

        <div
          role="progressbar"
          aria-label="Import success rate"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={successRate}
          className="h-3 overflow-hidden rounded-full bg-[#1A2A3D]"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 transition-all duration-700"
            style={{
              width: `${successRate}%`,
            }}
          />
        </div>

        <div className="mt-4 flex flex-wrap justify-between gap-3 text-sm">
          <span className="text-slate-400">
            Successfully saved:
            <span className="ml-2 font-semibold text-white">
              {successfulRecords}
            </span>
          </span>

          <span className="text-slate-400">
            Total rows:
            <span className="ml-2 font-semibold text-white">{total}</span>
          </span>
        </div>
      </div>

      {/* ======================================================
          IMPORT BREAKDOWN
      ====================================================== */}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {/* Failed Records */}

        <div className="rounded-2xl border border-red-500/20 bg-[#0F172A] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FaTimesCircle className="text-red-400" />

              <h3 className="font-semibold text-white">Failed Records</h3>
            </div>

            <span className="font-bold text-red-400">{failureRate}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#1A2A3D]">
            <div
              className="h-full rounded-full bg-red-500 transition-all duration-700"
              style={{
                width: `${failureRate}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {failed} of {total} rows reported as failed.
          </p>
        </div>

        {/* Duplicate Records */}

        <div className="rounded-2xl border border-orange-500/20 bg-[#0F172A] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-orange-400" />

              <h3 className="font-semibold text-white">Duplicate Records</h3>
            </div>

            <span className="font-bold text-orange-400">{duplicateRate}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#1A2A3D]">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-700"
              style={{
                width: `${duplicateRate}%`,
              }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-400">
            {duplicates} of {total} rows were duplicates or unchanged.
          </p>
        </div>
      </div>

      {/* ======================================================
          STATUS MESSAGE
      ====================================================== */}

      <div
        className={`
          mt-6
          rounded-xl
          border
          p-4
          ${status.bg}
          ${status.border}
        `}
      >
        <div className="flex items-start gap-3">
          <FaInfoCircle className={`mt-0.5 shrink-0 ${status.color}`} />

          <p className="text-sm leading-6 text-slate-300">{status.text}</p>
        </div>
      </div>
    </section>
  );
};

export default ImportSummary;
