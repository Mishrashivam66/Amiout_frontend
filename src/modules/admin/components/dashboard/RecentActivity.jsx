import { useEffect, useState } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  RefreshCw,
  UserRound,
  XCircle,
  Loader2,
} from "lucide-react";

import toast from "react-hot-toast";

import dashboardService from "../../../../services/dashboard.service";

// ============================================================
// REAL ADMIN RECENT ACTIVITY
//
// GET /admin/dashboard/recent-activities
//
// No hardcoded student names.
// No fake timestamps.
// No fabricated activity records.
// ============================================================

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load recent activities.";

const formatTime = (value) => {
  if (!value) return "Time unavailable";

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
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

const extractActivities = (payload) => {
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload?.activities,
    payload?.recentActivities,
    payload?.records,
    payload?.items,
    payload?.results,
    payload?.data,
  ];

  return candidates.find(Array.isArray) || [];
};

const normalizeStatus = (value) => {
  const status = String(value ?? "")
    .trim()
    .toUpperCase();

  if (status.includes("APPROV")) return "APPROVED";
  if (status.includes("PENDING")) return "PENDING";
  if (status.includes("REJECT")) return "REJECTED";
  if (status.includes("RETURN") || status.includes("COMPLETED")) {
    return "COMPLETED";
  }
  if (status.includes("EXIT")) return "EXITED";

  return status || "ACTIVITY";
};

const statusThemes = {
  APPROVED: {
    icon: CheckCircle2,
    classes: "bg-emerald-400/10 text-emerald-400",
  },
  PENDING: {
    icon: Clock3,
    classes: "bg-amber-400/10 text-amber-400",
  },
  REJECTED: {
    icon: XCircle,
    classes: "bg-rose-400/10 text-rose-400",
  },
  COMPLETED: {
    icon: CheckCircle2,
    classes: "bg-blue-400/10 text-blue-400",
  },
  EXITED: {
    icon: Activity,
    classes: "bg-cyan-400/10 text-cyan-400",
  },
};

function ActivityRow({ item, index }) {
  const student =
    item.studentName ||
    item.student?.name ||
    item.user?.name ||
    item.student?.studentName ||
    item.name ||
    "";

  const enrollment =
    item.enrollmentNumber ||
    item.student?.enrollmentNumber ||
    item.outpass?.enrollmentNumber ||
    "";

  const action =
    item.action ||
    item.title ||
    item.description ||
    item.type ||
    "Activity recorded";

  const status = normalizeStatus(
    item.status || item.outpassStatus || item.outpass?.status || item.type,
  );

  const theme = statusThemes[status] || {
    icon: Activity,
    classes: "bg-slate-400/10 text-slate-300",
  };

  const StatusIcon = theme.icon;

  const timestamp =
    item.createdAt ||
    item.timestamp ||
    item.occurredAt ||
    item.updatedAt ||
    item.time;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-[#223447] bg-[#081629] p-4 transition hover:border-amber-400/30 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
          <UserRound size={21} />
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-white">
            {student || "System Activity"}
          </h3>

          <p className="mt-1 truncate text-xs text-slate-400">
            {enrollment || action}
          </p>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold text-slate-200">
          {action}
        </p>

        <p className="mt-1 text-xs text-slate-500">{formatTime(timestamp)}</p>
      </div>

      <div className="flex justify-start sm:justify-end">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-black ${theme.classes}`}
        >
          <StatusIcon size={14} />
          {status}
        </span>
      </div>
    </article>
  );
}

export default function RecentActivity({ refreshKey = 0 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [manualRefresh, setManualRefresh] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await dashboardService.getRecentActivities();

        if (response.data?.success === false) {
          throw new Error(
            response.data.message || "Recent activity request failed.",
          );
        }

        const payload = response.data?.data ?? response.data;

        const records = extractActivities(payload);

        if (active) {
          setActivities(records);
        }
      } catch (err) {
        if (active) {
          setActivities([]);
          setError(getError(err));
        }
      } finally {
        if (active) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [refreshKey, manualRefresh]);

  const refresh = () => {
    if (loading || refreshing) return;

    setRefreshing(true);
    setManualRefresh((value) => value + 1);

    toast.success("Refreshing activity", {
      duration: 1000,
    });
  };

  return (
    <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Recent Activities</h2>

          <p className="mt-2 text-sm text-slate-400">
            Latest records from AMIOUT backend
          </p>
        </div>

        <button
          type="button"
          onClick={refresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-400/20 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <RefreshCw size={16} />
          )}
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center gap-3 text-sm text-slate-400">
          <Loader2 size={21} className="animate-spin" />
          Loading activities...
        </div>
      ) : error ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/10 p-5">
          <AlertTriangle size={20} className="shrink-0 text-red-400" />

          <div>
            <p className="font-semibold text-red-300">
              Unable to load activities
            </p>

            <p className="mt-2 break-words text-xs leading-6 text-red-200">
              {error}
            </p>
          </div>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <Activity size={37} className="text-slate-600" />

          <h3 className="mt-4 text-sm font-bold text-white">
            No recent activities available
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            The backend has not returned activity records.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.slice(0, 8).map((item, index) => (
            <ActivityRow
              key={item._id || item.id || index}
              item={item}
              index={index}
            />
          ))}
        </div>
      )}
    </section>
  );
}
