
import { useNavigate } from "react-router-dom";

import {
  Users,
  ClipboardList,
  History,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
} from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  // ============================================================
  // Quick Actions
  // ============================================================

  const actions = [
    {
      id: 1,
      title: "My Students",
      description: "View assigned students",
      icon: Users,
      color: "from-blue-500 to-blue-700",
      route: "/mentor/students",
    },

    {
      id: 2,
      title: "Pending Requests",
      description: "Approve outpass requests",
      icon: ClipboardList,
      color: "from-amber-500 to-orange-600",
      route: "/mentor/pending",
    },

    {
      id: 3,
      title: "History",
      description: "Previously approved requests",
      icon: History,
      color: "from-emerald-500 to-green-700",
      route: "/mentor/history",
    },

    {
      id: 4,
      title: "Reports",
      description: "Analytics & Reports",
      icon: BarChart3,
      color: "from-purple-500 to-indigo-700",
      route: "/mentor/reports",
    },

    {
      id: 5,
      title: "Announcements",
      description: "Latest notices",
      icon: Bell,
      color: "from-pink-500 to-rose-600",
      route: "/mentor/announcements",
    },

    {
      id: 6,
      title: "Settings",
      description: "Account settings",
      icon: Settings,
      color: "from-slate-500 to-slate-700",
      route: "/mentor/settings",
    },
  ];
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>

        <p className="mt-1 text-sm text-slate-500">
          Frequently used mentor shortcuts.
        </p>
      </div>

      {/* ================================================= */}
      {/* Actions */}
      {/* ================================================= */}

      <div className="grid gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.id}
              onClick={() => navigate(action.route)}
              className="
                group
                flex
                items-center
                justify-between
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
              "
            >
              {/* Left */}

              <div className="flex items-center gap-4">
                <div
                  className={`
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-gradient-to-r
                    ${action.color}
                    text-white
                    shadow-md
                    transition-transform
                    duration-300
                    group-hover:scale-110
                  `}
                >
                  <Icon size={26} />
                </div>

                <div className="text-left">
                  <h3 className="font-semibold text-slate-800">
                    {action.title}
                  </h3>

                  <p className="text-sm text-slate-500">{action.description}</p>
                </div>
              </div>

              {/* Right */}

              <ChevronRight
                size={22}
                className="
                  text-slate-400
                  transition-transform
                  duration-300
                  group-hover:translate-x-2
                  group-hover:text-blue-600
                "
              />
            </button>
          );
        })}
      </div>

      {/* ================================================= */}
      {/* Footer */}
      {/* ================================================= */}

      <div className="mt-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
        <h3 className="text-lg font-bold">Mentor Dashboard</h3>

        <p className="mt-2 text-sm text-blue-100">
          Manage students, approve outpasses, track history, and monitor
          activities from one place.
        </p>
      </div>
    </div>
  );
};

export default QuickActions;
