import { useEffect, useState } from "react";
import { Bell, CheckCheck, Trash2, RefreshCw, Clock } from "lucide-react";
import toast from "react-hot-toast";

import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearNotifications,
} from "../services/notification.service";

const Notifications = () => {
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });

  // ============================================================================
  // Load Notifications
  // ============================================================================

  const loadNotifications = async (page = 1) => {
    try {
      setLoading(true);

      const res = await getNotifications(page, 10);

      setNotifications(res.notifications || []);

      setPagination({
        page: res.page,
        totalPages: res.totalPages,
        total: res.total,
      });
    } catch {
      toast.error("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  // ============================================================================
  // Mark Read
  // ============================================================================

  const handleRead = async (id) => {
    try {
      await markAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );

      toast.success("Notification marked as read.");
    } catch {
      toast.error("Unable to update notification.");
    }
  };

  // ============================================================================
  // Mark All Read
  // ============================================================================

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      toast.success("All notifications marked as read.");
    } catch {
      toast.error("Unable to mark all notifications.");
    }
  };

  // ============================================================================
  // Delete Notification
  // ============================================================================

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);

      setNotifications((prev) => prev.filter((item) => item._id !== id));

      setPagination((prev) => ({
        ...prev,
        total: Math.max(prev.total - 1, 0),
      }));

      toast.success("Notification deleted.");
    } catch {
      toast.error("Unable to delete notification.");
    }
  };

  // ============================================================================
  // Clear Notifications
  // ============================================================================

  const handleClearAll = async () => {
    try {
      await clearNotifications();

      setNotifications([]);

      setPagination({
        page: 1,
        totalPages: 1,
        total: 0,
      });

      toast.success("All notifications cleared.");
    } catch {
      toast.error("Unable to clear notifications.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Notifications</h1>

          <p className="mt-2 text-slate-400">View all system notifications.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => loadNotifications(pagination.page)}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-white hover:bg-green-700"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            <CheckCheck size={18} />
            Mark All Read
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            <Trash2 size={18} />
            Clear All
          </button>
        </div>
      </div>

      {/* Statistics */}

      <div className="rounded-3xl border border-[#223447] bg-[#111827] p-8">
        <h2 className="text-5xl font-bold text-white">{pagination.total}</h2>

        <p className="mt-2 text-slate-400">Total Notifications</p>
      </div>

      {/* Notifications */}

      <div className="overflow-hidden rounded-3xl border border-[#223447] bg-[#111827]">
        {loading ? (
          <div className="p-10 text-center text-slate-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-4 p-16">
            <Bell size={60} className="text-slate-500" />

            <h2 className="text-2xl font-bold text-white">No Notifications</h2>

            <p className="text-slate-400">You're all caught up.</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item._id}
              className={`border-b border-[#223447] p-6 transition hover:bg-[#182433] ${
                !item.isRead ? "border-l-4 border-l-green-500" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>

                  <p className="text-slate-300">{item.message}</p>

                  <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500">
                    <span>{item.type}</span>

                    <span>{item.role}</span>

                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!item.isRead && (
                    <button
                      onClick={() => handleRead(item._id)}
                      className="rounded-lg bg-green-600 p-2 text-white transition hover:bg-green-700"
                    >
                      <CheckCheck size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}

      <div className="flex items-center justify-between rounded-2xl border border-[#223447] bg-[#111827] p-6">
        <div className="text-slate-300">
          Page {pagination.page} of {pagination.totalPages}
        </div>

        <div className="flex gap-3">
          <button
            disabled={pagination.page === 1}
            onClick={() => loadNotifications(pagination.page - 1)}
            className="rounded-xl bg-slate-700 px-5 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => loadNotifications(pagination.page + 1)}
            className="rounded-xl bg-blue-600 px-5 py-2 text-white transition disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
