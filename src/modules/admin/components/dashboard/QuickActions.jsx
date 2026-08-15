import { useNavigate } from "react-router-dom";
import {
  FaBullhorn,
  FaChartBar,
  FaFileImport,
  FaUserGraduate,
  FaUsers,
  FaCog,
  FaArrowRight,
} from "react-icons/fa";

const actions = [
  {
    title: "Students",
    subtitle: "Manage Students",
    icon: FaUsers,
    color: "green",
    path: "/admin/students",
  },
  {
    title: "Mentors",
    subtitle: "Manage Mentors",
    icon: FaUserGraduate,
    color: "blue",
    path: "/admin/mentors",
  },
  {
    title: "Reports",
    subtitle: "View Reports",
    icon: FaChartBar,
    color: "purple",
    path: "/admin/reports",
  },
  {
    title: "Users",
    subtitle: "Manage Users",
    icon: FaBullhorn,
    color: "orange",
    path: "/admin/users",
  },
  {
    title: "Groups",
    subtitle: "Manage Groups",
    icon: FaFileImport,
    color: "cyan",
    path: "/admin/groups",
  },
  {
    title: "Settings",
    subtitle: "System Settings",
    icon: FaCog,
    color: "red",
    path: "/admin/settings",
  },
];

const colorTheme = {
  green: {
    icon: "text-green-400",
    bg: "bg-green-500/10",
    hover: "hover:border-green-500",
  },

  blue: {
    icon: "text-blue-400",
    bg: "bg-blue-500/10",
    hover: "hover:border-blue-500",
  },

  purple: {
    icon: "text-purple-400",
    bg: "bg-purple-500/10",
    hover: "hover:border-purple-500",
  },

  orange: {
    icon: "text-orange-400",
    bg: "bg-orange-500/10",
    hover: "hover:border-orange-500",
  },

  cyan: {
    icon: "text-cyan-400",
    bg: "bg-cyan-500/10",
    hover: "hover:border-cyan-500",
  },

  red: {
    icon: "text-red-400",
    bg: "bg-red-500/10",
    hover: "hover:border-red-500",
  },
};

const QuickActions = () => {
  const navigate = useNavigate();
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

      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-400">
          Frequently used administrator actions
        </p>
      </div>

      {/* ========================================== */}
      {/* Grid */}
      {/* ========================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
        "
      >
        {actions.map((action) => {
          const Icon = action.icon;

          const theme = colorTheme[action.color];

          return (
            <button
              key={action.title}
              onClick={() => navigate(action.path)}
              className={`
                group
                rounded-2xl
                border
                border-[#223447]
                bg-[#081018]
                p-5
                text-left
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-xl
                ${theme.hover}
              `}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    ${theme.bg}
                  `}
                >
                  <Icon
                    className={`
                      text-2xl
                      ${theme.icon}
                    `}
                  />
                </div>

                <FaArrowRight
                  className="
                    text-slate-500
                    transition-all
                    duration-300
                    group-hover:translate-x-2
                    group-hover:text-green-400
                  "
                />
              </div>

              <div className="mt-5">
                <h3 className="text-lg font-semibold text-white">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm text-slate-400">{action.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
