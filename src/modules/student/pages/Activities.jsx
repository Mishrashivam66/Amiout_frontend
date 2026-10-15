import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Filter,
  LogIn,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import api from "../../../services/api";

// Activities currently uses the existing notifications endpoint.
// No new backend route or response format is required.
const getActivityList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data?.notifications)) {
    return payload.data.notifications;
  }
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.notifications)) return payload.notifications;
  return [];
};

const readable = (value, fallback = "Not available") => {
  if (value === undefined || value === null) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

const getType = (item) =>
  String(item?.type || "GENERAL")
    .trim()
    .toUpperCase();

const formatTimestamp = (value) => {
  if (!value) return "Date unavailable";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

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

const configByType = {
  APPROVED: {
    icon: CheckCircle2,
    label: "Approved",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    iconBox: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    icon: XCircle,
    label: "Rejected",
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    iconBox: "bg-rose-50 text-rose-600",
    dot: "bg-rose-500",
  },
  PENDING: {
    icon: Clock3,
    label: "Pending",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    iconBox: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },
  EXITED: {
    icon: LogOut,
    label: "Exited",
    badge: "border-violet-200 bg-violet-50 text-violet-700",
    iconBox: "bg-violet-50 text-violet-600",
    dot: "bg-violet-500",
  },
  RETURNED: {
    icon: LogIn,
    label: "Returned",
    badge: "border-sky-200 bg-sky-50 text-sky-700",
    iconBox: "bg-sky-50 text-sky-600",
    dot: "bg-sky-500",
  },
};

const defaultConfig = {
  icon: Bell,
  label: "Update",
  badge: "border-slate-200 bg-slate-100 text-slate-600",
  iconBox: "bg-slate-100 text-slate-600",
  dot: "bg-slate-400",
};

const FILTERS = [
  { value: "ALL", label: "All updates" },
  { value: "APPROVALS", label: "Decisions" },
  { value: "MOVEMENT", label: "Gate movement" },
  { value: "PENDING", label: "Pending" },
];

const matchesFilter = (item, filter) => {
  const type = getType(item);
  if (filter === "APPROVALS") return ["APPROVED", "REJECTED"].includes(type);
  if (filter === "MOVEMENT") return ["EXITED", "RETURNED"].includes(type);
  if (filter === "PENDING") return type === "PENDING";
  return true;
};

const SummaryCard = ({ title, value, Icon, styleClass, description }) => (
  <div className="min-w-0 rounded-[22px] border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
          {title}
        </p>
        <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950">
          {value}
        </p>
        <p className="mt-1 text-xs text-slate-400">{description}</p>
      </div>
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styleClass}`}
      >
        <Icon size={21} />
      </div>
    </div>
  </div>
);

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const loadActivities = useCallback(
    async ({ initial = false, signal } = {}) => {
      if (initial) setLoading(true);
      else setRefreshing(true);
      setError("");

      try {
        const { data } = await api.get("/notifications", { signal });
        if (signal?.aborted) return;
        if (data?.success === false) {
          throw new Error(data.message || "Unable to load activities.");
        }
        setActivities(getActivityList(data));
      } catch (requestError) {
        if (signal?.aborted || requestError?.code === "ERR_CANCELED") return;
        console.error("[STUDENT ACTIVITIES]", requestError);
        setError(
          requestError?.response?.data?.message ||
            requestError?.message ||
            "Unable to load activities. Please try again.",
        );
        // Preserve the previous feed if a manual refresh fails.
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    const controller = new AbortController();
    loadActivities({ initial: true, signal: controller.signal });
    return () => controller.abort();
  }, [loadActivities]);

  const counts = useMemo(() => {
    return activities.reduce(
      (summary, item) => {
        const type = getType(item);
        summary.total += 1;
        if (["APPROVED", "REJECTED"].includes(type)) summary.decisions += 1;
        if (["EXITED", "RETURNED"].includes(type)) summary.movement += 1;
        if (item?.isRead === false) summary.unread += 1;
        return summary;
      },
      { total: 0, decisions: 0, movement: 0, unread: 0 },
    );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();
    return activities
      .filter((item) => {
        const matchesSearch =
          !query ||
          [item?.title, item?.message, item?.description, item?.type].some(
            (value) =>
              String(value ?? "")
                .toLowerCase()
                .includes(query),
          );
        return matchesSearch && matchesFilter(item, filter);
      })
      .sort((a, b) => {
        const first = new Date(a?.createdAt || 0).getTime() || 0;
        const second = new Date(b?.createdAt || 0).getTime() || 0;
        return second - first;
      });
  }, [activities, search, filter]);

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl space-y-6 pb-8 sm:space-y-7">
      {/* PREMIUM HERO */}
      <section className="relative isolate overflow-hidden rounded-[26px] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 px-5 py-7 text-white shadow-xl sm:rounded-[30px] sm:px-8 sm:py-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-1/3 h-28 w-40 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
              <Sparkles size={14} /> AMIOUT · Student Portal
            </span>
            <h1 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Activity Center
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Explore your latest outpass notifications, approval updates and
              gate movement alerts in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => loadActivities()}
            disabled={loading || refreshing}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh Activity"}
          </button>
        </div>
      </section>

      {/* STATISTICS */}
      <section
        className="grid min-w-0 grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4"
        aria-label="Activity summary"
      >
        <SummaryCard
          title="Total updates"
          value={counts.total}
          Icon={Activity}
          styleClass="bg-emerald-50 text-emerald-700"
          description="Notifications received"
        />
        <SummaryCard
          title="Decisions"
          value={counts.decisions}
          Icon={CheckCircle2}
          styleClass="bg-sky-50 text-sky-700"
          description="Approved or rejected"
        />
        <SummaryCard
          title="Gate movement"
          value={counts.movement}
          Icon={LogOut}
          styleClass="bg-violet-50 text-violet-700"
          description="Exit and return alerts"
        />
        <SummaryCard
          title="Unread"
          value={counts.unread}
          Icon={Bell}
          styleClass="bg-amber-50 text-amber-700"
          description="Need your attention"
        />
      </section>

      {/* SEARCH & FILTER */}
      <section className="min-w-0 rounded-[24px] border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <div className="rounded-xl bg-emerald-50 p-2 text-emerald-700">
              <Filter size={17} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Browse Activities</h2>
              <p className="text-xs text-slate-500">
                Find updates and filter by event type
              </p>
            </div>
          </div>
          {!loading && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredActivities.length} result
              {filteredActivities.length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="relative mt-5">
          <Search
            size={19}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            aria-label="Search activities"
            placeholder="Search by title, message or activity type..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full min-w-0 rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
          />
        </div>
        <div
          className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1"
          role="group"
          aria-label="Filter activity type"
        >
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              aria-pressed={filter === option.value}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                filter === option.value
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <div
          role="alert"
          className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4"
        >
          <p className="min-w-0 break-words text-sm font-medium text-rose-700 [overflow-wrap:anywhere]">
            {error}
          </p>
          <button
            type="button"
            onClick={() => loadActivities()}
            disabled={refreshing}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
          >
            Try Again
          </button>
        </div>
      )}

      {/* DYNAMIC ACTIVITY FEED */}
      <section className="min-w-0 overflow-hidden rounded-[26px] border border-slate-200/80 bg-white px-4 py-5 shadow-sm sm:px-7 sm:py-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarClock size={21} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Activity Timeline
              </h2>
              <p className="text-xs text-slate-500">Newest updates first</p>
            </div>
          </div>
          <ShieldCheck
            size={22}
            className="text-emerald-600"
            aria-hidden="true"
          />
        </div>

        {loading ? (
          <div className="space-y-4" aria-label="Loading activities">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="flex animate-pulse gap-4 rounded-2xl border border-slate-100 p-4"
              >
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                  <div className="h-3 w-1/4 rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-5 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <Activity size={31} />
            </div>
            <h3 className="mt-5 text-lg font-bold text-slate-900">
              {activities.length === 0
                ? "No activities yet"
                : "No matching activities"}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {activities.length === 0
                ? "When new notifications arrive, they will appear in your activity timeline."
                : "Try a different search or change your activity filter."}
            </p>
            {activities.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("ALL");
                }}
                className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <ol className="relative ml-1 min-w-0 space-y-4 border-l-2 border-slate-100 pl-5 sm:ml-3 sm:pl-7">
            {filteredActivities.map((item, index) => {
              const type = getType(item);
              const config = configByType[type] || defaultConfig;
              const Icon = config.icon;
              return (
                <li
                  key={item?._id || item?.id || `activity-${index}`}
                  className="relative min-w-0"
                >
                  <span
                    className={`absolute -left-[29px] top-6 h-3 w-3 rounded-full border-2 border-white ring-2 ring-slate-100 sm:-left-[37px] ${config.dot}`}
                  />
                  <article
                    className={`min-w-0 rounded-[20px] border p-4 transition-all hover:border-emerald-200 hover:shadow-md sm:p-5 ${
                      item?.isRead === false
                        ? "border-emerald-200 bg-emerald-50/30"
                        : "border-slate-200/80 bg-white"
                    }`}
                  >
                    <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.iconBox}`}
                      >
                        <Icon size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="min-w-0 flex-1 break-words text-sm font-bold leading-6 text-slate-900 [overflow-wrap:anywhere] sm:text-base">
                            {readable(
                              item?.title,
                              readable(item?.type, "Activity update"),
                            )}
                          </h3>
                          <span
                            className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${config.badge}`}
                          >
                            {config.label}
                          </span>
                        </div>
                        <p className="mt-2 min-w-0 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600 [overflow-wrap:anywhere]">
                          {readable(
                            item?.message || item?.description,
                            "No additional details provided.",
                          )}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400">
                          <span className="inline-flex items-center gap-1.5">
                            <Clock3 size={14} />{" "}
                            {formatTimestamp(item?.createdAt)}
                          </span>
                          {typeof item?.isRead === "boolean" && (
                            <span
                              className={`font-semibold ${item.isRead ? "text-slate-400" : "text-emerald-700"}`}
                            >
                              {item.isRead ? "Read" : "Unread"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      <p className="text-center text-xs text-slate-400">
        <ShieldCheck size={14} className="mr-1 inline align-text-bottom" />
        AMIOUT · Secure Campus Movement
      </p>
    </div>
  );
};

export default Activities;
