import { Eye } from "lucide-react";
import StatusBadge from "./StatusBadge";

// ==========================================================
// Format Date
// ==========================================================

const formatDate = (date) => {
  if (!date) return "-";

  const d = new Date(date);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ==========================================================
// Component
// ==========================================================

const OutpassTable = ({ outpasses = [], loading = false, onView }) => {
  // ==========================================================
  // Loading
  // ==========================================================

  if (loading) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-[#223447]
          bg-[#0F172A]
          p-16
          text-center
          shadow-2xl
        "
      >
        <div
          className="
            mx-auto
            h-14
            w-14
            animate-spin
            rounded-full
            border-4
            border-green-500
            border-t-transparent
          "
        />

        <h3 className="mt-6 text-xl font-semibold text-white">
          Loading Outpasses...
        </h3>

        <p className="mt-2 text-slate-400">
          Fetching latest records from server.
        </p>
      </div>
    );
  }

  // ==========================================================
  // Empty
  // ==========================================================

  if (!outpasses.length) {
    return (
      <div
        className="
          rounded-3xl
          border
          border-[#223447]
          bg-[#0F172A]
          p-16
          text-center
          shadow-2xl
        "
      >
        <div className="text-6xl">📄</div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          No Outpasses Found
        </h2>

        <p className="mt-3 text-slate-400">
          There are no outpass records available.
        </p>
      </div>
    );
  }

  // ==========================================================
  // Table
  // ==========================================================

  return (
    <div
      className="
        overflow-hidden
        rounded-3xl
        border
        border-[#223447]
        bg-[#0F172A]
        shadow-2xl
      "
    >
      <div className="overflow-x-auto">
        <table className="min-w-full">
          {/* ========================================= */}
          {/* Header */}
          {/* ========================================= */}

          <thead className="bg-[#16263A]">
            <tr>
              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Student
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Enrollment
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Mentor
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Type
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Exit Date
              </th>

              <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-200">
                Return Date
              </th>

              <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider text-slate-200">
                Status
              </th>

              <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider text-slate-200">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Continue in Part 2.2 */}
            {outpasses.map((item) => (
              <tr
                key={item._id}
                className="
      border-t
      border-[#223447]
      transition-all
      duration-300
      hover:bg-[#16263A]
    "
              >
                {/* ====================================================== */}
                {/* Student */}
                {/* ====================================================== */}

                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div
                      className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            text-lg
            font-bold
            text-white
            shadow-lg
          "
                    >
                      {item.student?.name?.charAt(0)?.toUpperCase() || "S"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {item.student?.name || "-"}
                      </h3>

                      <p className="text-sm text-slate-400">
                        {item.student?.email || "-"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* ====================================================== */}
                {/* Enrollment */}
                {/* ====================================================== */}

                <td className="px-6 py-5">
                  <span
                    className="
          rounded-lg
          bg-blue-500/10
          px-3
          py-2
          text-sm
          font-medium
          text-blue-300
        "
                  >
                    {item.student?.enrollmentNumber || "-"}
                  </span>
                </td>

                {/* ====================================================== */}
                {/* Mentor */}
                {/* ====================================================== */}

                <td className="px-6 py-5">
                  <div>
                    <p className="font-medium text-slate-200">
                      {item.mentor?.name || "-"}
                    </p>

                    <p className="text-xs text-slate-500">
                      {item.mentor?.email || ""}
                    </p>
                  </div>
                </td>

                {/* ====================================================== */}
                {/* Outpass Type */}
                {/* ====================================================== */}

                <td className="px-6 py-5">
                  <span
                    className="
          rounded-full
          bg-violet-500/15
          px-3
          py-1
          text-xs
          font-semibold
          uppercase
          tracking-wide
          text-violet-300
        "
                  >
                    {item.outpassType || item.type || "-"}
                  </span>
                </td>

                {/* ====================================================== */}
                {/* Exit Date */}
                {/* ====================================================== */}

                <td className="px-6 py-5 text-slate-300">
                  {formatDate(item.outDate || item.exitDate)}
                </td>

                {/* ====================================================== */}
                {/* Return Date */}
                {/* ====================================================== */}

                <td className="px-6 py-5 text-slate-300">
                  {formatDate(item.expectedReturn || item.returnDate)}
                </td>

                {/* ====================================================== */}
                {/* Status */}
                {/* ====================================================== */}

                <td className="px-6 py-5 text-center">
                  <StatusBadge status={item.status} />
                </td>

                {/* ====================================================== */}
                {/* Action */}
                {/* ====================================================== */}

                <td className="px-6 py-5 text-center">
                  <button
                    onClick={() => onView(item)}
                    className="
          inline-flex
          h-10
          w-10
          items-center
          justify-center
          rounded-xl
          bg-cyan-600
          text-white
          transition-all
          duration-300
          hover:scale-110
          hover:bg-cyan-500
          hover:shadow-lg
          hover:shadow-cyan-500/30
        "
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================== */}
      {/* Footer */}
      {/* ====================================================== */}

      <div
        className="
          flex
          flex-col
          items-center
          justify-between
          gap-4
          border-t
          border-[#223447]
          bg-[#0B1220]
          px-6
          py-5
          md:flex-row
        "
      >
        {/* Left */}

        <div>
          <p className="text-sm text-slate-400">
            Showing
            <span className="mx-2 font-bold text-green-400">
              {outpasses.length}
            </span>
            Outpass Records
          </p>

          <p className="mt-1 text-xs text-slate-500">
            AMIOUT Smart Outpass Management System
          </p>
        </div>

        {/* Right */}

        <div className="flex items-center gap-3">
          <span
            className="
              rounded-full
              bg-green-500/10
              px-4
              py-2
              text-xs
              font-semibold
              text-green-400
            "
          >
            Live Data
          </span>

          <span
            className="
              rounded-full
              bg-cyan-500/10
              px-4
              py-2
              text-xs
              font-semibold
              text-cyan-400
            "
          >
            Auto Refresh
          </span>
        </div>
      </div>
    </div>
  );
};

export default OutpassTable;
