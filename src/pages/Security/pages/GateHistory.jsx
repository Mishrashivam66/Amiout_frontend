import { useCallback, useEffect, useMemo, useState } from "react";

import {
  History,
  Search,
  RefreshCw,
  LogOut,
  LogIn,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import api from "../../../services/api";

// Confirm this URL against your backend route.
const HISTORY_API = "/outpass/security/history";

const formatDate = (value) => {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
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

const getName = (value) => {
  if (!value) return "Not available";

  if (typeof value === "object") {
    return value.name || value.studentName || "Not available";
  }

  return String(value);
};

// Supports both event-based and outpass-based responses.
function normalizeHistory(records) {
  return records.flatMap((item, index) => {
    const base = {
      id: item._id || item.id || `${item.outpassId || "pass"}-${index}`,

      studentName: item.studentName || item.student?.name || "Not available",

      enrollment:
        item.enrollmentNumber ||
        item.student?.enrollmentNumber ||
        "Not available",

      outpassNumber:
        item.outpassId ||
        item.outpassNumber ||
        item.outpass?.outpassId ||
        "Not available",

      guardName: getName(item.securityGuard || item.verifiedBy || item.guard),
    };

    // Backend returns individual movement logs.
    const movement = String(
      item.movement || item.type || item.eventType || "",
    ).toUpperCase();

    if (movement === "EXIT" || movement === "ENTRY") {
      return [
        {
          ...base,
          key: `${base.id}-${movement}`,
          movement,
          verifiedAt: item.verifiedAt || item.timestamp || item.createdAt,
        },
      ];
    }

    // Backend returns outpass records.
    const events = [];

    if (item.exitVerified === true && item.exitVerifiedAt) {
      events.push({
        ...base,
        key: `${base.id}-EXIT`,
        movement: "EXIT",
        verifiedAt: item.exitVerifiedAt,
        guardName: getName(item.exitVerifiedBy || item.securityGuard),
      });
    }

    if (item.entryVerified === true && item.entryVerifiedAt) {
      events.push({
        ...base,
        key: `${base.id}-ENTRY`,
        movement: "ENTRY",
        verifiedAt: item.entryVerifiedAt,
        guardName: getName(item.entryVerifiedBy || item.securityGuard),
      });
    }

    return events;
  });
}

export default function GateHistory() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchHistory = useCallback(async (signal) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(HISTORY_API, {
        signal,
      });

      const payload = response.data?.data ?? response.data;

      const list = Array.isArray(payload)
        ? payload
        : payload?.records ||
          payload?.logs ||
          payload?.history ||
          payload?.outpasses ||
          payload?.items ||
          [];

      if (!Array.isArray(list)) {
        throw new Error("Unexpected gate history response.");
      }

      if (!signal.aborted) {
        setRecords(normalizeHistory(list));
      }
    } catch (err) {
      if (signal.aborted || err.code === "ERR_CANCELED") {
        return;
      }

      setRecords([]);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load gate history.",
      );
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    void fetchHistory(controller.signal);

    return () => controller.abort();
  }, [fetchHistory, refreshKey]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return records
      .filter((record) => filter === "ALL" || record.movement === filter)
      .filter((record) => {
        if (!term) return true;

        return [
          record.studentName,
          record.enrollment,
          record.outpassNumber,
        ].some((value) => String(value).toLowerCase().includes(term));
      })
      .sort(
        (a, b) =>
          new Date(b.verifiedAt).getTime() - new Date(a.verifiedAt).getTime(),
      );
  }, [records, search, filter]);

  const totalExits = records.filter((item) => item.movement === "EXIT").length;

  const totalEntries = records.filter(
    (item) => item.movement === "ENTRY",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-2xl font-extrabold text-white">
            <History className="text-amber-400" />
            Gate History
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            View recorded student EXIT and ENTRY movements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setRefreshKey((value) => value + 1)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-bold text-slate-950 disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Loaded Movements",
            value: records.length,
            icon: ShieldCheck,
            color: "text-amber-400",
          },
          {
            label: "Verified EXIT",
            value: totalExits,
            icon: LogOut,
            color: "text-cyan-400",
          },
          {
            label: "Verified ENTRY",
            value: totalEntries,
            icon: LogIn,
            color: "text-emerald-400",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <Icon size={24} className={item.color} />

              <p className="mt-3 text-sm text-slate-400">{item.label}</p>

              <p className="mt-2 text-3xl font-bold text-white">
                {loading ? "..." : item.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search + filters */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, enrollment, outpass..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="ALL">All Movements</option>

            <option value="EXIT">EXIT Only</option>

            <option value="ENTRY">ENTRY Only</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-800 bg-slate-900 p-12 text-slate-300">
          <Loader2 size={23} className="animate-spin text-amber-400" />
          Loading gate history...
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-800 bg-rose-950/50 p-5 text-rose-200">
          <AlertCircle size={22} />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
          <History size={48} className="mx-auto text-slate-600" />

          <h3 className="mt-4 text-lg font-bold text-white">
            No gate movements found
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Verified EXIT and ENTRY records will appear here.
          </p>
        </div>
      )}

      {/* Desktop table */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900 md:block">
            <table className="w-full min-w-175 text-left">
              <thead className="bg-slate-800/80 text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Outpass</th>
                  <th className="px-5 py-4">Movement</th>
                  <th className="px-5 py-4">Verified At</th>
                  <th className="px-5 py-4">Verified By</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((record) => (
                  <tr
                    key={record.key}
                    className="border-t border-slate-800 text-sm"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-white">
                        {record.studentName}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {record.enrollment}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {record.outpassNumber}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                          record.movement === "EXIT"
                            ? "bg-cyan-500/15 text-cyan-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`}
                      >
                        {record.movement}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {formatDate(record.verifiedAt)}
                    </td>

                    <td className="px-5 py-4 text-slate-300">
                      {record.guardName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {filtered.map((record) => (
              <div
                key={record.key}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-white">{record.studentName}</h3>

                  <span
                    className={`rounded-lg px-3 py-1 text-xs font-bold ${
                      record.movement === "EXIT"
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "bg-emerald-500/15 text-emerald-300"
                    }`}
                  >
                    {record.movement}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {record.enrollment}
                </p>

                <div className="mt-4 space-y-2 text-sm text-slate-300">
                  <p>Outpass: {record.outpassNumber}</p>

                  <p>Time: {formatDate(record.verifiedAt)}</p>

                  <p>Guard: {record.guardName}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
