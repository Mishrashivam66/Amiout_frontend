import { Activity, CheckCircle2, XCircle, Clock3, User } from "lucide-react";

const RecentActivity = ({ activities = [] }) => {
  // ============================================================
  // Empty State
  // ============================================================

  if (!activities.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3">
            <Activity size={24} className="text-blue-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500">Latest mentor activities</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <Activity size={56} className="mb-4 text-slate-300" />

          <h3 className="text-lg font-semibold text-slate-700">
            No Recent Activity
          </h3>

          <p className="mt-2 text-center text-sm text-slate-500">
            Recent approvals, rejections and requests will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // Icon Helper
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
  // UI
  // ============================================================

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header */}

      <div className="mb-6 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-100 p-3">
          <Activity size={24} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>

          <p className="text-sm text-slate-500">Latest mentor actions</p>
        </div>
      </div>

      {/* Timeline */}

      <div className="space-y-5">
        {activities.map((item, index) => (
          <div key={item._id || index} className="relative flex gap-4">
            {/* Timeline */}

            {index !== activities.length - 1 && (
              <div className="absolute left-5 top-12 h-full w-0.5 bg-slate-200" />
            )}

            {/* Icon */}

            <div
              className="
                relative
                z-10
                flex
                h-10
                w-10
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
              {/* Student */}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                    <User size={18} className="text-blue-600" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.student?.name || "Student"}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {item.student?.enrollmentNo}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${getBadge(item.status)}
                  `}
                >
                  {item.status}
                </span>
              </div>

              {/* Reason */}

              <div className="mt-4">
                <p className="text-sm text-slate-700">{item.reason}</p>
              </div>

              {/* Footer */}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Destination :
                  <span className="ml-1 font-medium">{item.destination}</span>
                </span>

                <span className="text-xs text-slate-500">
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleString()
                    : ""}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-center text-white">
        <p className="text-sm">
          Showing the latest mentor activities and outpass actions.
        </p>
      </div>
    </div>
  );
};

export default RecentActivity;
