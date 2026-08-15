import { Activity, CheckCircle2, XCircle, Clock3, User } from "lucide-react";

const RecentActivity = ({ activities = [] }) => {
  // ============================================================
  // Status Icon
  // ============================================================

  const getIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle2 size={18} className="text-emerald-600" />;

      case "REJECTED":
        return <XCircle size={18} className="text-red-600" />;

      default:
        return <Clock3 size={18} className="text-amber-600" />;
    }
  };

  // ============================================================
  // Status Badge
  // ============================================================

  const getBadge = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-700";

      case "REJECTED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  // ============================================================
  // Empty State
  // ============================================================

  if (!activities.length) {
    return (
      <div
        className="
          rounded-2xl
          md:rounded-3xl
          border
          border-slate-200
          bg-white
          p-5
          md:p-6
          shadow-sm
        "
      >
        {/* Header */}

        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-blue-100 p-3">
            <Activity size={22} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-lg md:text-xl font-bold text-slate-800">
              Recent Activity
            </h2>

            <p className="text-xs md:text-sm text-slate-500">
              Latest mentor activities
            </p>
          </div>
        </div>

        {/* Empty Content */}

        <div className="flex flex-col items-center justify-center py-10 md:py-14">
          <div className="rounded-full bg-slate-100 p-5">
            <Activity size={48} className="text-slate-400" />
          </div>

          <h3 className="mt-5 text-lg md:text-xl font-semibold text-slate-700">
            No Recent Activity
          </h3>

          <p
            className="
              mt-3
              max-w-sm
              text-center
              text-sm
              leading-relaxed
              text-slate-500
            "
          >
            Recent approvals, rejections and pending outpass requests will
            automatically appear here.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Main UI
  // ============================================================

  return (
    <div
      className="
        rounded-2xl
        md:rounded-3xl
        border
        border-slate-200
        bg-white
        p-5
        md:p-6
        shadow-sm
      "
    >
      {/* Header */}

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-3">
          <Activity size={22} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg md:text-xl font-bold text-slate-800">
            Recent Activity
          </h2>

          <p className="text-xs md:text-sm text-slate-500">
            Latest mentor actions
          </p>
        </div>
      </div>

      {/* Timeline */}

      <div className="space-y-4 md:space-y-5">
        {activities.map((item, index) => (
          <div key={item._id || index} className="relative flex gap-3 md:gap-4">
            {/* Timeline Line */}

            {index !== activities.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-0.5 bg-slate-200" />
            )}

            {/* Status Icon */}

            <div
              className="
                relative
                z-10
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-slate-100
              "
            >
              {getIcon(item.status)}
            </div>

            {/* Card */}

            <div
              className="
                flex-1
                rounded-2xl
                border
                border-slate-200
                bg-slate-50
                p-4
                transition-all
                duration-300
                hover:border-blue-200
                hover:bg-white
                hover:shadow-md
              "
            >
              {/* Student Info */}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      bg-blue-100
                    "
                  >
                    <User size={18} className="text-blue-600" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-slate-800 md:text-base">
                      {item.student?.name || "Student"}
                    </h3>

                    <p className="truncate text-xs text-slate-500">
                      {item.student?.enrollmentNo || "N/A"}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    inline-flex
                    w-fit
                    items-center
                    rounded-full
                    px-3
                    py-1
                    text-[11px]
                    font-semibold
                    sm:text-xs
                    ${getBadge(item.status)}
                  `}
                >
                  {item.status}
                </span>
              </div>

              {/* Reason */}

              <div className="mt-4">
                <p className="text-xs font-medium text-slate-500">Reason</p>

                <p className="mt-1 break-words text-sm leading-6 text-slate-700">
                  {item.reason}
                </p>
              </div>

              {/* Footer */}

              <div
                className="
                  mt-4
                  flex
                  flex-col
                  gap-2
                  border-t
                  border-slate-200
                  pt-3
                  text-xs
                  text-slate-500
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                "
              >
                <div className="break-words">
                  <span className="font-semibold text-slate-600">
                    Destination :
                  </span>

                  <span className="ml-1">{item.destination || "-"}</span>
                </div>

                <div className="text-left sm:text-right">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "-"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}

      <div
        className="
          mt-6
          rounded-2xl
          bg-gradient-to-r
          from-blue-600
          to-indigo-600
          p-4
          text-center
          text-white
        "
      >
        <p className="text-xs sm:text-sm">
          Showing the latest mentor activities and outpass actions.
        </p>

        <p className="mt-1 text-[11px] sm:text-xs text-blue-100">
          Activities are updated automatically whenever you approve or reject an
          outpass request.
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
