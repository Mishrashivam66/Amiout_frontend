
import {
  FaArrowRight,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUserGraduate,
} from "react-icons/fa";


const activities = [
  {
    id: 1,
    student: "Rahul Sharma",
    enrollment: "A123456789",
    action: "Outpass Approved",
    status: "Approved",
    time: "2 mins ago",
  },
  {
    id: 2,
    student: "Priya Singh",
    enrollment: "A123456790",
    action: "Outpass Pending",
    status: "Pending",
    time: "12 mins ago",
  },
  {
    id: 3,
    student: "Amit Verma",
    enrollment: "A123456791",
    action: "Outpass Rejected",
    status: "Rejected",
    time: "25 mins ago",
  },
  {
    id: 4,
    student: "Anjali Gupta",
    enrollment: "A123456792",
    action: "Student Registered",
    status: "Completed",
    time: "40 mins ago",
  },
];

const statusBadge = {
  Approved: {
    bg: "bg-green-500/10",
    text: "text-green-400",
    icon: <FaCheckCircle />,
  },

  Pending: {
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    icon: <FaClock />,
  },

  Rejected: {
    bg: "bg-red-500/10",
    text: "text-red-400",
    icon: <FaTimesCircle />,
  },

  Completed: {
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    icon: <FaCheckCircle />,
  },
};

const RecentActivity = () => {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#223447]
        bg-[#122131]
        p-6
      "
    >
      {/* ========================================== */}
      {/* Header */}
      {/* ========================================== */}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Recent Activities</h2>

          <p className="mt-1 text-sm text-slate-400">
            Latest student and outpass updates
          </p>
        </div>

        <button
          className="
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-green-400
            transition-all
            hover:text-green-300
          "
        >
          View All
          <FaArrowRight />
        </button>
      </div>

      {/* ========================================== */}
      {/* Activity List */}
      {/* ========================================== */}

      <div className="space-y-4">
        {activities.map((activity) => {
          const badge = statusBadge[activity.status];

          return (
            <div
              key={activity.id}
              className="
                flex
                flex-col
                gap-4
                rounded-xl
                border
                border-[#223447]
                bg-[#081018]
                p-4
                transition-all
                duration-300
                hover:border-green-500
                hover:shadow-lg
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              {/* Left */}

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-green-600/20
                    text-green-400
                  "
                >
                  <FaUserGraduate className="text-xl" />
                </div>

                <div>
                  <h3 className="font-semibold text-white">
                    {activity.student}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {activity.enrollment}
                  </p>
                </div>
              </div>

              {/* Center */}

              <div className="flex-1">
                <p className="text-sm text-slate-300">{activity.action}</p>
              </div>

              {/* Right */}

              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
              >
                <span
                  className={`
                    flex
                    items-center
                    gap-2
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${badge.bg}
                    ${badge.text}
                  `}
                >
                  {badge.icon}

                  {activity.status}
                </span>

                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentActivity;
