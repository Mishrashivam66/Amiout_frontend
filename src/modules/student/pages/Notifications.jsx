import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  BellRing,
  CheckCircle2,
  XCircle,
  Clock3,
  RefreshCw,
  CheckCheck,
  Inbox,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  CircleDot,
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../../../services/api";

const formatDateTime = (value) => {
  if (!value) return "Date not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date not available";

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

const getNotificationTheme = (type) => {
  const value = String(type || "").toUpperCase();

  if (value.includes("APPROV") || value.includes("SUCCESS")) {
    return {
      Icon: CheckCircle2,
      icon: "bg-emerald-50 text-emerald-600 ring-emerald-100",
      accent: "bg-emerald-500",
    };
  }

  if (
    value.includes("REJECT") ||
    value.includes("CANCEL") ||
    value.includes("FAIL")
  ) {
    return {
      Icon: XCircle,
      icon: "bg-rose-50 text-rose-600 ring-rose-100",
      accent: "bg-rose-500",
    };
  }

  if (value.includes("PEND") || value.includes("WAIT")) {
    return {
      Icon: Clock3,
      icon: "bg-amber-50 text-amber-600 ring-amber-100",
      accent: "bg-amber-500",
    };
  }

  return {
    Icon: Bell,
    icon: "bg-blue-50 text-blue-600 ring-blue-100",
    accent: "bg-blue-500",
  };
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async (showInitialLoader = false) => {
    if (showInitialLoader) setLoading(true);
    else setRefreshing(true);

    setError("");

    try {
      const { data } = await api.get("/notifications");
      if (data?.success === false) {
        throw new Error(data.message || "Failed to load notifications.");
      }
      setNotifications(
        Array.isArray(data?.data?.notifications) ? data.data.notifications : [],
      );
    } catch (requestError) {
      const message =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to load notifications.";
      setError(message);
      if (!showInitialLoader) toast.error(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadNotifications(true);
  }, [loadNotifications]);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    if (filter === "UNREAD") {
      return notifications.filter((item) => !item.isRead);
    }
    if (filter === "READ") {
      return notifications.filter((item) => item.isRead);
    }
    return notifications;
  }, [filter, notifications]);

  const markAsRead = async (id) => {
    if (!id || markingId || markingAll) return;

    try {
      setMarkingId(id);
      await api.patch(`/notifications/${id}/read`);
      setNotifications((previous) =>
        previous.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          "Unable to mark notification as read.",
      );
    } finally {
      setMarkingId(null);
    }
  };

  const markAllRead = async () => {
    if (unreadCount === 0 || markingAll || markingId) return;

    try {
      setMarkingAll(true);
      await api.patch("/notifications/mark-all-read");
      setNotifications((previous) =>
        previous.map((item) => ({ ...item, isRead: true })),
      );
      toast.success("All notifications marked as read.");
    } catch (requestError) {
      toast.error(
        requestError?.response?.data?.message ||
          "Unable to mark all notifications as read.",
      );
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-10">
      {/* Premium header */}
      <header className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-7 text-white shadow-xl sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-14 -top-20 h-60 w-60 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-28 w-64 rounded-full bg-cyan-400/5 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <Sparkles size={14} /> AMIOUT · Student Portal
            </div>
            <div className="mt-4 flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-emerald-200">
                <BellRing size={23} />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Notifications
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Stay informed about your outpass requests and approvals.
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => loadNotifications(false)}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {/* Overview */}
      <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {[
          {
            label: "Total Notifications",
            count: notifications.length,
            Icon: Bell,
            theme: "bg-blue-50 text-blue-600",
          },
          {
            label: "Unread",
            count: unreadCount,
            Icon: CircleDot,
            theme: "bg-amber-50 text-amber-600",
          },
          {
            label: "Read",
            count: notifications.length - unreadCount,
            Icon: CheckCheck,
            theme: "bg-emerald-50 text-emerald-600",
          },
        ].map(({ label, count, Icon, theme }) => (
          <div
            key={label}
            className="flex min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5"
          >
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">
                {label}
              </p>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                {loading ? "—" : count}
              </p>
            </div>
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${theme}`}
            >
              <Icon size={22} />
            </span>
          </div>
        ))}
      </div>

      {/* Filters and bulk action */}
      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter notifications"
          >
            {[
              { key: "ALL", label: "All" },
              { key: "UNREAD", label: "Unread" },
              { key: "READ", label: "Read" },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilter(option.key)}
                aria-pressed={filter === option.key}
                className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 ${
                  filter === option.key
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {option.label}
                {option.key === "UNREAD" && unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={markAllRead}
            disabled={
              loading || unreadCount === 0 || markingAll || Boolean(markingId)
            }
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            <CheckCheck size={17} />
            {markingAll ? "Updating..." : "Mark All Read"}
          </button>
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex min-w-0 flex-wrap items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
        >
          <AlertCircle size={20} className="shrink-0" />
          <p className="min-w-0 flex-1 break-words [overflow-wrap:anywhere]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => loadNotifications(false)}
            className="rounded-lg bg-rose-600 px-3 py-2 font-semibold text-white hover:bg-rose-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3" aria-label="Loading notifications">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-100 bg-slate-100 sm:h-32"
            />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <section className="rounded-3xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm sm:px-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Inbox size={30} />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            {filter === "UNREAD"
              ? "You're all caught up"
              : filter === "READ"
                ? "No read notifications yet"
                : error
                  ? "Notifications couldn't be loaded"
                  : "No notifications yet"}
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {filter === "UNREAD"
              ? "You have no unread notifications right now."
              : filter === "READ"
                ? "Notifications you mark as read will appear here."
                : error
                  ? "Try refreshing to load your latest outpass updates."
                  : "Updates about your outpass requests will appear here."}
          </p>
        </section>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((item, index) => {
            const { Icon, icon, accent } = getNotificationTheme(item.type);
            const isUnread = !item.isRead;

            return (
              <article
                key={item._id || index}
                className={`relative min-w-0 overflow-hidden rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
                  isUnread
                    ? "border-emerald-200 shadow-emerald-50"
                    : "border-slate-200"
                }`}
              >
                {isUnread && (
                  <div className={`absolute inset-y-0 left-0 w-1 ${accent}`} />
                )}
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${icon}`}
                    >
                      <Icon size={21} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <h3 className="min-w-0 break-words text-sm font-bold text-slate-900 [overflow-wrap:anywhere] sm:text-base">
                          {item.title || "Notification"}
                        </h3>
                        {isUnread && (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-2 min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                        {item.message || "No message provided."}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <Clock3 size={13} />
                        <time dateTime={item.createdAt || undefined}>
                          {formatDateTime(item.createdAt)}
                        </time>
                        {item.type && (
                          <span className="max-w-full break-words rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-500 [overflow-wrap:anywhere]">
                            {String(item.type).replace(/_/g, " ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isUnread && (
                    <button
                      type="button"
                      onClick={() => markAsRead(item._id)}
                      disabled={
                        markingId === item._id ||
                        markingAll ||
                        Boolean(markingId)
                      }
                      className="inline-flex w-full shrink-0 items-center justify-center gap-2 self-end rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:self-start"
                    >
                      <CheckCircle2 size={15} />
                      {markingId === item._id ? "Updating..." : "Mark Read"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck size={15} /> AMIOUT Secure Campus Notifications
      </div>
    </div>
  );
};

export default Notifications;
