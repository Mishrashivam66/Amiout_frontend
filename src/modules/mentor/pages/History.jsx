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
      {/* ================= Header ================= */}

      <div
        className="
        rounded-3xl
        bg-gradient-to-r
        from-slate-900
        via-blue-900
        to-indigo-900
        p-5
        md:p-8
        shadow-xl
      "
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white md:text-3xl">
              Outpass History
            </h1>

            <p className="mt-2 text-sm text-blue-100 md:text-base">
              Approved • Rejected • Returned • Exited Requests
            </p>
          </div>

          <button
            onClick={loadHistory}
            className="
            w-full
            md:w-auto
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-600
            px-6
            py-3
            font-semibold
            text-white
            shadow-lg
            transition-all
            duration-300
            hover:scale-[1.02]
            hover:shadow-xl
          "
          >
            Refresh
          </button>
        </div>
      </div>

      {/* ================= Search ================= */}

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
        transition-all
        focus-within:border-blue-500
        focus-within:shadow-lg
      "
      >
        <Search size={20} className="text-slate-400" />

        <input
          type="text"
          placeholder="Search by student, destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              loadHistory();
            }
          }}
          className="
          ml-3
          flex-1
          bg-transparent
          text-sm
          md:text-base
          placeholder:text-slate-400
          outline-none
        "
        />
      </div>

      {/* ================= Desktop Table ================= */}

      <div
        className="
        hidden
        md:block
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-xl
      "
      >
        <table className="min-w-full">
          <thead className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
            <tr>
              <th className="px-5 py-4 text-left font-semibold">Outpass ID</th>

              <th className="px-5 py-4 text-left font-semibold">Student</th>

              <th className="px-5 py-4 text-left font-semibold">Destination</th>

              <th className="px-5 py-4 text-left font-semibold">Reason</th>

              <th className="px-5 py-4 text-left font-semibold">Status</th>

              <th className="px-5 py-4 text-left font-semibold">Date</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <p className="text-slate-500">Loading history...</p>
                  </div>
                </td>
              </tr>
            ) : history.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center">
                    <div className="mb-4 text-6xl">📄</div>

                    <h3 className="text-xl font-semibold text-slate-700">
                      No History Found
                    </h3>

                    <p className="mt-2 text-slate-500">
                      No outpass history available yet.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item._id}
                  className="border-t transition-all duration-300 hover:bg-blue-50"
                >
                  <td className="px-5 py-5 font-semibold text-slate-700">
                    {item.outpassId}
                  </td>

                  <td className="px-5 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        {item.student?.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {item.student?.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-5">{item.destination}</td>

                  <td className="max-w-xs px-5 py-5">
                    <p className="line-clamp-2">{item.reason}</p>
                  </td>

                  <td className="px-5 py-5">
                    <span
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm ${
                        item.status === "APPROVED"
                          ? "bg-emerald-100 text-emerald-700"
                          : item.status === "REJECTED"
                            ? "bg-rose-100 text-rose-700"
                            : item.status === "RETURNED"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "EXITED"
                                ? "bg-yellow-100 text-yellow-700"
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

                  <td className="px-5 py-5 whitespace-nowrap">
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

      {/* ================= Mobile Cards ================= */}

      <div className="space-y-5 md:hidden">
        {loading ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

            <p className="text-slate-500">Loading history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-md">
            <div className="text-6xl">📄</div>

            <h3 className="mt-4 text-lg font-bold text-slate-700">
              No History Found
            </h3>

            <p className="mt-2 text-slate-500">
              No outpass history available yet.
            </p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item._id}
              className="
          rounded-3xl
          border
          border-slate-200
          bg-white
          p-6
          shadow-md
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
        "
            >
              {/* Card Header */}

              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    Outpass ID
                  </p>

                  <h3 className="mt-1 break-all font-bold text-slate-900">
                    {item.outpassId}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold shadow-sm ${
                    item.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700"
                      : item.status === "REJECTED"
                        ? "bg-rose-100 text-rose-700"
                        : item.status === "RETURNED"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "EXITED"
                            ? "bg-yellow-100 text-yellow-700"
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

              {/* Student */}

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Student
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                    {item.student?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <p className="font-semibold text-slate-800">
                      {item.student?.name}
                    </p>
                  </div>
                </div>
              </div>

              {/* Destination */}

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Destination
                </p>

                <p className="mt-1 break-words text-slate-700">
                  {item.destination}
                </p>
              </div>

              {/* Reason */}

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Reason
                </p>

                <p className="mt-1 break-words text-slate-700">{item.reason}</p>
              </div>

              {/* Date */}

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  Date
                </p>

                <p className="mt-1 text-slate-700">
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
          ))
        )}
      </div>
    </div>
  );
};

export default History;
