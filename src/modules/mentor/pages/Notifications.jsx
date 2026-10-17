import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Inbox,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  AlertCircle,
} from "lucide-react";

import toast from "react-hot-toast";
import * as notificationService from "../services/notificationService";

// ============================================================
// HELPERS
// ============================================================

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

const unwrapResponse = (response) => {
  // Supports a service returning response.data
  // as well as a raw Axios response.
  const payload =
    response?.data?.success !== undefined ? response.data : response;

  if (payload?.success === false) {
    throw new Error(payload.message || "Notification request failed.");
  }

  return payload;
};

const extractNotifications = (payload) => {
  const list =
    (Array.isArray(payload) && payload) ||
    (Array.isArray(payload?.data?.notifications) &&
      payload.data.notifications) ||
    (Array.isArray(payload?.data?.data?.notifications) &&
      payload.data.data.notifications) ||
    (Array.isArray(payload?.notifications) && payload.notifications) ||
    (Array.isArray(payload?.data) && payload.data);

  if (!list) {
    throw new Error(
      "Unexpected notifications API response. Please verify notificationService.",
    );
  }

  return list;
};

const isNotificationRead = (item) =>
  item?.isRead === true || item?.read === true || Boolean(item?.readAt);

const getNotificationId = (item) => item?._id || item?.id;

const formatTime = (value) => {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Time unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const FILTERS = ["ALL", "UNREAD", "READ"];

// ============================================================
// MAIN COMPONENT
// ============================================================

const Notifications = () => {
  const { pathname } = useLocation();

  const isCoordinator =
    pathname === "/coordinator/notifications" ||
    pathname.startsWith("/coordinator/");

  const roleName = isCoordinator ? "Coordinator" : "Mentor";

  // ==========================================================
  // STATES
  // ==========================================================

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [busyId, setBusyId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);

  // ==========================================================
  // FETCH NOTIFICATIONS
  // ==========================================================

  const fetchNotifications = useCallback(async (showLoader = false) => {
    const requestId = ++requestIdRef.current;

    if (showLoader) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    setError("");

    try {
      const response = await notificationService.getNotifications();

      const data = extractNotifications(unwrapResponse(response));

      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setNotifications(data);
    } catch (err) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      setError(getErrorMessage(err, "Failed to load notifications."));
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;

    void fetchNotifications(true);

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, [fetchNotifications]);

  // ==========================================================
  // COUNTERS
  // ==========================================================

  const unreadCount = useMemo(
    () => notifications.filter((item) => !isNotificationRead(item)).length,
    [notifications],
  );

  const readCount = notifications.length - unreadCount;

  // ==========================================================
  // SEARCH AND FILTER
  // ==========================================================

  const filteredNotifications = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const read = isNotificationRead(item);

      if (filter === "READ" && !read) return false;
      if (filter === "UNREAD" && read) return false;

      if (!keyword) return true;

      return [item.title, item.message, item.description, item.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });
  }, [notifications, search, filter]);

  // ==========================================================
  // MARK ONE NOTIFICATION AS READ
  // ==========================================================

  const handleRead = async (id) => {
    if (!id || busyId || markingAll) return;

    setBusyId(id);

    try {
      const response = await notificationService.markAsRead(id);

      unwrapResponse(response);

      setNotifications((previous) =>
        previous.map((item) =>
          getNotificationId(item) === id
            ? {
                ...item,
                isRead: true,
                read: true,
              }
            : item,
        ),
      );

      toast.success("Notification marked as read.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not mark notification as read."));
    } finally {
      setBusyId(null);
    }
  };

  // ==========================================================
  // MARK ALL AS READ
  // ==========================================================

  const handleReadAll = async () => {
    if (!unreadCount || markingAll || busyId) return;

    setMarkingAll(true);

    try {
      const response = await notificationService.markAllAsRead();

      unwrapResponse(response);

      setNotifications((previous) =>
        previous.map((item) => ({
          ...item,
          isRead: true,
          read: true,
        })),
      );

      toast.success("All notifications marked as read.");
    } catch (err) {
      toast.error(
        getErrorMessage(err, "Could not mark all notifications as read."),
      );
    } finally {
      setMarkingAll(false);
    }
  };

  // ==========================================================
  // DELETE NOTIFICATION
  // ==========================================================

  const handleDelete = async (id) => {
    if (!id || busyId || markingAll) return;

    setBusyId(id);

    try {
      const response = await notificationService.deleteNotification(id);

      unwrapResponse(response);

      setNotifications((previous) =>
        previous.filter((item) => getNotificationId(item) !== id),
      );

      toast.success("Notification deleted.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete notification."));
    } finally {
      setBusyId(null);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER */}
      <section className="rounded-3xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-900 p-6 text-white shadow-xl sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-blue-100">
              <Bell size={15} />
              {roleName} Workspace
            </span>

            <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 text-sm text-blue-100/90">
              Updates sent to your authenticated faculty account.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => void fetchNotifications(false)}
              disabled={loading || refreshing || markingAll || Boolean(busyId)}
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              onClick={handleReadAll}
              disabled={
                loading ||
                refreshing ||
                markingAll ||
                Boolean(busyId) ||
                unreadCount === 0
              }
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {markingAll ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <CheckCheck size={16} />
              )}
              Mark All Read
            </button>
          </div>
        </div>
      </section>

      {/* STATISTICS */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Bell className="text-blue-600" size={23} />

          <p className="mt-3 text-2xl font-extrabold text-slate-900">
            {notifications.length}
          </p>

          <p className="text-xs text-slate-500">Loaded notifications</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <Clock3 className="text-amber-600" size={23} />

          <p className="mt-3 text-2xl font-extrabold text-slate-900">
            {unreadCount}
          </p>

          <p className="text-xs text-slate-500">Unread</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <CheckCircle2 className="text-emerald-600" size={23} />

          <p className="mt-3 text-2xl font-extrabold text-slate-900">
            {readCount}
          </p>

          <p className="text-xs text-slate-500">Read</p>
        </div>
      </section>

      {/* NOTIFICATION LIST */}
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Recent Notifications
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Showing {filteredNotifications.length} loaded items
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <select
              aria-label="Filter notifications"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500"
            >
              {FILTERS.map((option) => (
                <option key={option} value={option}>
                  {option === "ALL"
                    ? "All"
                    : option === "READ"
                      ? "Read"
                      : "Unread"}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div
            role="alert"
            className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />

            <div className="flex-1">
              <p>{error}</p>

              <button
                type="button"
                onClick={() => void fetchNotifications(false)}
                className="mt-2 font-bold underline"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex flex-col items-center gap-3 px-6 py-20 text-slate-500">
            <Loader2 className="animate-spin text-blue-600" size={34} />

            <span className="text-sm">Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          /* EMPTY STATE */
          <div className="flex flex-col items-center px-6 py-20 text-center">
            {notifications.length ? (
              <BellOff size={42} className="text-slate-400" />
            ) : (
              <Inbox size={42} className="text-slate-400" />
            )}

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              {error
                ? "Notifications unavailable"
                : notifications.length
                  ? "No matching notifications"
                  : "No notifications yet"}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {error
                ? "Please retry loading notifications."
                : notifications.length
                  ? "Change the search or filter to see more."
                  : "New updates for your faculty account will appear here."}
            </p>
          </div>
        ) : (
          /* NOTIFICATION ITEMS */
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item, index) => {
              const id = getNotificationId(item);
              const read = isNotificationRead(item);
              const processing = busyId === id;

              return (
                <article
                  key={id || `notification-${index}`}
                  className={`flex flex-col gap-4 p-5 transition sm:flex-row sm:items-start sm:justify-between sm:p-6 ${
                    read ? "bg-white" : "bg-blue-50/60"
                  }`}
                >
                  {/* LEFT CONTENT */}
                  <div className="flex min-w-0 gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        read
                          ? "bg-slate-100 text-slate-500"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <Bell size={21} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words text-sm font-bold text-slate-900 sm:text-base">
                          {item.title || "Notification"}
                        </h3>

                        {!read && (
                          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                            NEW
                          </span>
                        )}
                      </div>

                      <p className="mt-2 break-words text-sm leading-6 text-slate-600">
                        {item.message ||
                          item.description ||
                          "No details provided."}
                      </p>

                      <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                        <Clock3 size={13} />
                        {formatTime(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                    {!read && (
                      <button
                        type="button"
                        onClick={() => void handleRead(id)}
                        disabled={
                          !id || processing || markingAll || Boolean(busyId)
                        }
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-50"
                      >
                        {processing ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCheck size={14} />
                        )}
                        Mark Read
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => void handleDelete(id)}
                      disabled={
                        !id || processing || markingAll || Boolean(busyId)
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                    >
                      {processing ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Trash2 size={14} />
                      )}
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Notifications;
