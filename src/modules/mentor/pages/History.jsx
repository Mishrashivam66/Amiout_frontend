import { toast } from "react-toastify";
import { useEffect, useState, useCallback } from "react";
import { Search, CheckCircle2, XCircle, RotateCcw, Clock3 } from "lucide-react";
import { getHistory } from "../services/mentor.service";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getHistory(1, 20, search);

      setHistory(response.data || []);
    } catch {
      toast.error("Failed to load outpass history.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const fetchHistory = async () => {
      await loadHistory();
    };

    fetchHistory();
  }, [loadHistory]);

  return (
    <div className="space-y-6">
      {/* Header */}

      <div
        className="
      flex
      flex-col
      gap-5
      md:flex-row
      md:items-center
      md:justify-between
      rounded-3xl
      bg-linear-to-r
      from-slate-900
      via-blue-900
      to-indigo-900
      p-5
      md:px-8
      md:py-8
      shadow-xl
    "
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Outpass History
          </h1>

          <p className="mt-2 text-sm md:text-base text-blue-100">
            Approved • Rejected • Returned Requests
          </p>
        </div>

        <button
          onClick={loadHistory}
          className="
        w-full
        md:w-auto
        rounded-xl
        bg-blue-600
        px-5
        py-3
        text-white
        hover:bg-blue-700
        transition
      "
        >
          Refresh
        </button>
      </div>

      {/* Search */}

      <div
        className="
      flex
      items-center
      rounded-2xl
      border
      border-slate-200
      bg-white
      px-5
      py-4
      shadow-sm
      focus-within:border-blue-500
      focus-within:shadow-lg
      transition-all
    "
      >
        <Search size={18} className="text-slate-500" />

        <input
          type="text"
          placeholder="Search..."
          className="ml-3 flex-1 bg-transparent outline-none text-sm md:text-base"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") loadHistory();
          }}
        />
      </div>

      {/* ================= Desktop ================= */}

      <div className="hidden md:block overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <table className="min-w-full">
          <thead className="bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50">
            <tr>
              <th className="px-5 py-4 text-left">Outpass ID</th>
              <th className="px-5 py-4 text-left">Student</th>
              <th className="px-5 py-4 text-left">Destination</th>
              <th className="px-5 py-4 text-left">Reason</th>
              <th className="px-5 py-4 text-left">Status</th>
              <th className="px-5 py-4 text-left">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  Loading...
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  No history found.
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item._id}
                  className="border-t transition-all duration-300 hover:bg-blue-50"
                >
                  <td className="px-5 py-4">{item.outpassId}</td>

                  <td className="px-5 py-4">{item.student?.name}</td>

                  <td className="px-5 py-4">{item.destination}</td>

                  <td className="px-5 py-4">{item.reason}</td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold ${
                        item.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-700"
                            : item.status === "RETURNED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {item.status === "APPROVED" && <CheckCircle2 size={15} />}
                      {item.status === "REJECTED" && <XCircle size={15} />}
                      {item.status === "RETURNED" && <RotateCcw size={15} />}
                      {item.status === "PENDING" && <Clock3 size={15} />}
                      {item.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {new Date(item.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= Mobile ================= */}

      <div className="space-y-4 md:hidden">
        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow">
            Loading...
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center text-slate-500 shadow">
            No history found.
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Outpass ID</p>
                  <h3 className="font-bold break-all">{item.outpassId}</h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-xs font-semibold ${
                    item.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "REJECTED"
                        ? "bg-rose-100 text-rose-700"
                        : item.status === "RETURNED"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status === "APPROVED" && <CheckCircle2 size={14} />}
                  {item.status === "REJECTED" && <XCircle size={14} />}
                  {item.status === "RETURNED" && <RotateCcw size={14} />}
                  {item.status === "PENDING" && <Clock3 size={14} />}
                  {item.status}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Student</p>
                  <p className="font-medium">{item.student?.name}</p>
                </div>

                <div>
                  <p className="text-slate-500">Destination</p>
                  <p>{item.destination}</p>
                </div>

                <div>
                  <p className="text-slate-500">Reason</p>
                  <p>{item.reason}</p>
                </div>

                <div>
                  <p className="text-slate-500">Date</p>
                  <p>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
