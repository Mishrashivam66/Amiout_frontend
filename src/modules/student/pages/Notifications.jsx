import { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  CheckCheck,
} from "lucide-react";

import api from "../../../services/api";
import PageHeader from "../components/layout/PageHeader";
import { toast } from "react-hot-toast";
const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================================
  // LOAD NOTIFICATIONS
  // ==========================================================

  const loadNotifications = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/notifications");

      setNotifications(
        Array.isArray(data?.data?.notifications) ? data.data.notifications : [],
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load notifications.",
      );

      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadNotifications();
  }, []);

  // ==========================================================
  // MARK READ
  // ==========================================================

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================================
  // MARK ALL
  // ==========================================================

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ==========================================================
  // ICON
  // ==========================================================

  const getIcon = (type) => {
    switch (type) {
      case "APPROVED":
        return <CheckCircle2 className="text-green-600" size={28} />;

      case "REJECTED":
        return <XCircle className="text-red-600" size={28} />;

      case "PENDING":
        return <Clock3 className="text-yellow-600" size={28} />;

      default:
        return <Bell className="text-blue-600" size={28} />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notifications"
        subtitle="All your latest updates"
        actionText="Refresh"
        actionIcon={RefreshCw}
        onAction={loadNotifications}
      />

      {notifications.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2 text-white hover:bg-green-700"
          >
            <CheckCheck size={18} />
            Mark All Read
          </button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="rounded-3xl border bg-white p-16 shadow text-center">
          <Bell size={70} className="mx-auto text-slate-300 mb-5" />

          <h2 className="text-2xl font-bold">No Notifications</h2>

          <p className="mt-3 text-slate-500">
            You don't have any notifications yet.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {notifications.map((item) => (
            <div
              key={item._id}
              className={`rounded-3xl border bg-white p-6 shadow transition hover:shadow-xl ${
                item.isRead ? "border-slate-200" : "border-green-500"
              }`}
            >
              <div className="flex justify-between gap-5">
                <div className="flex gap-5">
                  {getIcon(item.type)}

                  <div>
                    <h2 className="text-lg font-bold">{item.title}</h2>

                    <p className="mt-2 text-slate-600">{item.message}</p>

                    <p className="mt-3 text-sm text-slate-400">
                      {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item._id)}
                    className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
