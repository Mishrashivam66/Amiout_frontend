import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock3,
  LogIn,
  LogOut,
  RefreshCw,
} from "lucide-react";

import api from "../../../services/api";
import PageHeader from "../components/layout/PageHeader";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD ACTIVITIES
  // ==========================================================

  const loadActivities = async () => {
    try {
      setLoading(true);

      // Change this API later when Activity Module is ready
      const { data } = await api.get("/notifications");

      let list = [];

      if (Array.isArray(data)) {
        list = data;
      } else if (Array.isArray(data.data)) {
        list = data.data;
      } else if (Array.isArray(data.notifications)) {
        list = data.notifications;
      } else if (Array.isArray(data.data?.notifications)) {
        list = data.data.notifications;
      }

      setActivities(list);
    } catch (error) {
      console.error(error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivities();
  }, []);

  // ==========================================================
  // ICON
  // ==========================================================

  const getIcon = (type) => {
    switch (type) {
      case "APPROVED":
        return <CheckCircle2 size={28} className="text-green-600" />;

      case "REJECTED":
        return <XCircle size={28} className="text-red-600" />;

      case "PENDING":
        return <Clock3 size={28} className="text-yellow-600" />;

      case "EXITED":
        return <LogOut size={28} className="text-orange-600" />;

      case "RETURNED":
        return <LogIn size={28} className="text-blue-600" />;

      default:
        return <Activity size={28} className="text-slate-600" />;
    }
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 rounded-2xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-8">
      <PageHeader
        title="Activities"
        subtitle="Recent activity of your outpass"
        actionText="Refresh"
        actionIcon={RefreshCw}
        onAction={loadActivities}
      />

      {activities.length === 0 ? (
        <div className="rounded-3xl border bg-white p-16 shadow text-center">
          <Activity size={70} className="mx-auto text-slate-300 mb-5" />

          <h2 className="text-2xl font-bold text-slate-700">No Activities</h2>

          <p className="mt-3 text-slate-500">No recent activity found.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map((item) => (
            <div
              key={item._id}
              className="rounded-3xl border bg-white p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex items-start gap-5">
                {getIcon(item.type)}

                <div className="flex-1">
                  <h2 className="text-lg font-bold">
                    {item.title || item.type}
                  </h2>

                  <p className="mt-2 text-slate-600">{item.message}</p>

                  <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>{new Date(item.createdAt).toLocaleString()}</span>

                    {item.isRead ? (
                      <span className="text-green-600 font-semibold">Read</span>
                    ) : (
                      <span className="text-orange-500 font-semibold">
                        Unread
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Activities;
