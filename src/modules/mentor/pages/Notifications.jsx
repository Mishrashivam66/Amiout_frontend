import { useEffect, useState } from "react";

import { Bell } from "lucide-react";

import toast from "react-hot-toast";
import * as notificationService from "../services/notificationService";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await notificationService.getNotifications();

      if (res.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchNotifications();
    };

    init();
  }, []);

  const handleRead = async (id) => {
    try {
      await notificationService.markAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch {
      toast.error("Failed to mark notification as read.");
    }
  };

  const handleReadAll = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );
    } catch {
      toast.error("Failed to mark all notifications as read.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.deleteNotification(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));
    } catch {
      toast.error("Failed to delete notification.");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

          <p className="mt-4 text-slate-500 font-medium">
            Loading notifications...
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8 shadow-xl">
        <div>
          <h1 className="text-4xl font-bold text-white">Notifications</h1>

          <p className="mt-2 text-blue-100">
            Stay updated with all mentor activities.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            className="rounded-xl bg-white/20 px-5 py-3 text-white backdrop-blur hover:bg-white/30 transition"
          ></button>

          <button
            onClick={handleReadAll}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 font-semibold text-white shadow-lg hover:scale-105 transition"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Card */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b bg-slate-50 p-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Recent Notifications
            </h2>

            <p className="mt-1 text-slate-500">
              Latest activities for your account
            </p>
          </div>

          <div className="rounded-full bg-blue-100 px-5 py-2 font-semibold text-blue-700">
            {notifications.length} Notifications
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="rounded-full bg-blue-100 p-8">
              <Bell size={60} className="text-blue-600" />
            </div>

            <h2 className="mt-6 text-2xl font-bold">No Notifications</h2>

            <p className="mt-2 text-slate-500">You're all caught up 🎉</p>
          </div>
        ) : (
          <div className="divide-y">
            {notifications.map((item) => (
              <div
                key={item._id}
                className={`transition-all duration-300 hover:bg-slate-50

              ${
                item.isRead
                  ? "bg-white"
                  : "bg-gradient-to-r from-blue-50 to-indigo-50"
              }

              `}
              >
                <div className="flex items-start justify-between p-6">
                  {/* Left */}

                  <div className="flex gap-5">
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl

                    ${
                      item.isRead
                        ? "bg-slate-200"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600"
                    }

                    `}
                    >
                      <Bell
                        size={26}
                        className={
                          item.isRead ? "text-slate-600" : "text-white"
                        }
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-800">
                          {item.title}
                        </h3>

                        {!item.isRead && (
                          <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="mt-2 text-slate-600">{item.message}</p>

                      <p className="mt-4 text-sm text-slate-400">
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Right */}

                  <div className="flex gap-3">
                    {!item.isRead && (
                      <button
                        onClick={() => handleRead(item._id)}
                        className="rounded-xl bg-emerald-100 px-4 py-3 font-medium text-emerald-700 hover:bg-emerald-200 transition"
                      >
                        ✓ Read
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="rounded-xl bg-red-100 px-4 py-3 font-medium text-red-700 hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
