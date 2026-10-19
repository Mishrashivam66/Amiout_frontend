import { useEffect, useMemo, useState } from "react";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  AlertTriangle,
  BarChart3,
  Loader2,
  PieChart as PieIcon,
} from "lucide-react";

import dashboardService from "../../../../services/dashboard.service";

// ============================================================
// LIVE ANALYTICS
//
// GET /admin/dashboard/analytics
//
// Monthly data is never generated locally.
// Missing API data is shown as unavailable.
// ============================================================

const COLORS = {
  approved: "#34D399",
  pending: "#FBBF24",
  rejected: "#FB7185",
  returned: "#60A5FA",
  exited: "#A78BFA",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const validNumber = (value) =>
  value !== null &&
  value !== undefined &&
  value !== "" &&
  Number.isFinite(Number(value));

const toCount = (value) =>
  validNumber(value) ? Math.max(0, Number(value)) : null;

const monthLabel = (item) => {
  const raw =
    item.month ??
    item.label ??
    item.period ??
    item.date ??
    item._id?.month ??
    item._id;

  if (raw === null || raw === undefined) {
    return null;
  }

  if (
    typeof raw === "number" ||
    (/^\d{1,2}$/.test(String(raw)) && Number(raw) >= 1 && Number(raw) <= 12)
  ) {
    const index = Number(raw) - 1;
    const year = item.year ?? item._id?.year;

    return `${MONTHS[index]}${year ? ` ${year}` : ""}`;
  }

  if (typeof raw === "object") {
    return null;
  }

  return String(raw);
};

const readMonthlyRows = (payload) => {
  if (Array.isArray(payload)) return payload;

  const possible = [
    payload?.monthly,
    payload?.monthlyData,
    payload?.monthlyAnalytics,
    payload?.monthlyStats,
    payload?.trends,
    payload?.outpassTrends,
    payload?.charts?.monthly,
    payload?.analytics?.monthly,
  ];

  return possible.find(Array.isArray) || [];
};

const normalizeMonthly = (payload) => {
  const rows = readMonthlyRows(payload);

  return rows
    .map((item) => {
      if (!item || typeof item !== "object") return null;

      const month = monthLabel(item);

      if (!month) return null;

      const values = {
        approved: toCount(item.approved ?? item.APPROVED),
        pending: toCount(item.pending ?? item.PENDING),
        rejected: toCount(item.rejected ?? item.REJECTED),
      };

      if (Object.values(values).every((value) => value === null)) {
        return null;
      }

      return {
        month,
        approved: values.approved,
        pending: values.pending,
        rejected: values.rejected,
      };
    })
    .filter(Boolean);
};

const readStatusData = (dashboard) => {
  const outpasses = dashboard?.outpasses;

  if (!outpasses || typeof outpasses !== "object") {
    return [];
  }

  const statuses = [
    ["Approved", "approved", COLORS.approved],
    ["Pending", "pending", COLORS.pending],
    ["Rejected", "rejected", COLORS.rejected],
    ["Returned", "returned", COLORS.returned],
    ["Exited", "exited", COLORS.exited],
  ];

  return statuses
    .map(([name, field, color]) => {
      const value = toCount(outpasses[field]);

      return value === null ? null : { name, value, color };
    })
    .filter(Boolean);
};

const formatCount = (value) => Number(value).toLocaleString("en-IN");

export default function DashboardChart({ dashboard, refreshKey = 0 }) {
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await dashboardService.getAnalytics();

        if (response.data?.success === false) {
          throw new Error(response.data.message || "Analytics request failed.");
        }

        const payload = response.data?.data ?? response.data;

        const records = normalizeMonthly(payload);

        if (active) {
          setMonthly(records);
        }
      } catch (err) {
        if (active) {
          setMonthly([]);

          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Unable to load monthly analytics.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [refreshKey]);

  const statusData = useMemo(() => readStatusData(dashboard), [dashboard]);

  const totalStatusCount = statusData.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  return (
    <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* MONTHLY ANALYTICS */}

      <article className="min-w-0 rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-7 xl:col-span-2">
        <div className="mb-7 flex items-center gap-3">
          <div className="rounded-xl bg-amber-400/10 p-3 text-amber-400">
            <BarChart3 size={23} />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Monthly Outpass Analytics
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Historical records returned by the analytics API
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex h-[330px] items-center justify-center gap-3 text-sm text-slate-400">
            <Loader2 size={22} className="animate-spin" />
            Loading analytics...
          </div>
        ) : error ? (
          <div className="flex min-h-[330px] items-center justify-center">
            <div className="max-w-md text-center">
              <AlertTriangle size={30} className="mx-auto text-amber-400" />

              <p className="mt-4 text-sm font-semibold text-white">
                Monthly analytics unavailable
              </p>

              <p className="mt-2 break-words text-xs leading-6 text-slate-400">
                {error}
              </p>
            </div>
          </div>
        ) : monthly.length === 0 ? (
          <div className="flex h-[330px] flex-col items-center justify-center text-center">
            <BarChart3 size={36} className="text-slate-600" />

            <p className="mt-4 font-semibold text-white">
              No monthly analytics available
            </p>

            <p className="mt-2 max-w-sm text-xs leading-6 text-slate-400">
              The analytics response did not contain a recognized monthly
              series. No demo values are displayed.
            </p>
          </div>
        ) : (
          <div className="h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthly}
                margin={{
                  top: 12,
                  right: 14,
                  left: -18,
                  bottom: 8,
                }}
              >
                <CartesianGrid stroke="#28384C" strokeDasharray="3 3" />

                <XAxis
                  dataKey="month"
                  stroke="#94A3B8"
                  tick={{ fontSize: 11 }}
                />

                <YAxis
                  stroke="#94A3B8"
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  contentStyle={{
                    background: "#081629",
                    border: "1px solid #334155",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                  formatter={formatCount}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                  }}
                />

                <Line
                  name="Approved"
                  type="monotone"
                  dataKey="approved"
                  stroke={COLORS.approved}
                  strokeWidth={3}
                  connectNulls={false}
                  dot={{ r: 3 }}
                />

                <Line
                  name="Pending"
                  type="monotone"
                  dataKey="pending"
                  stroke={COLORS.pending}
                  strokeWidth={3}
                  connectNulls={false}
                  dot={{ r: 3 }}
                />

                <Line
                  name="Rejected"
                  type="monotone"
                  dataKey="rejected"
                  stroke={COLORS.rejected}
                  strokeWidth={3}
                  connectNulls={false}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </article>

      {/* STATUS DISTRIBUTION */}

      <article className="min-w-0 rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-xl bg-blue-400/10 p-3 text-blue-400">
            <PieIcon size={23} />
          </div>

          <div>
            <h2 className="text-lg font-black text-white">
              Status Distribution
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Database-backed outpass status counts
            </p>
          </div>
        </div>

        {totalStatusCount > 0 ? (
          <div className="h-[245px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData.filter((item) => item.value > 0)}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {statusData
                    .filter((item) => item.value > 0)
                    .map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#081629",
                    border: "1px solid #334155",
                    borderRadius: 12,
                    color: "#fff",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[245px] items-center justify-center text-center text-sm text-slate-400">
            No status distribution data available
          </div>
        )}

        <div className="mt-4 space-y-2">
          {statusData.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between rounded-xl border border-[#223447] bg-[#081629] px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />

                <span className="text-sm text-slate-300">{item.name}</span>
              </div>

              <span className="font-bold text-white">
                {formatCount(item.value)}
              </span>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
