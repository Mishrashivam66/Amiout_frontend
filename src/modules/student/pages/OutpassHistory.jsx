// ============================================================================
// Project : AMIOUT - Smart Outpass Management System
// Module  : Student
// File    : OutpassHistory.jsx
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Search, Eye, CalendarDays, Filter, FileText } from "lucide-react";

import api from "../../../services/api";

import PageHeader from "../components/layout/PageHeader";

const OutpassHistory = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  // ==========================================================
  // Load History
  // ==========================================================

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const response = await api.get("/outpass/history");

      setHistory(response?.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load outpass history.",
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ==========================================================
  // Filter Records
  // ==========================================================

  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        item.destination?.toLowerCase().includes(search.toLowerCase()) ||
        item.reason?.toLowerCase().includes(search.toLowerCase());

      const matchStatus = status === "ALL" || item.status === status;

      return matchSearch && matchStatus;
    });
  }, [history, search, status]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outpass History"
        subtitle="View all your previous outpass requests"
      />

      {/* Remaining UI continues in Part 2 */}
      {/* ========================================================== */}
      {/* Search & Filter */}
      {/* ========================================================== */}

      <div className="rounded-3xl bg-white p-6 shadow-lg border border-slate-200">
        <div className="grid gap-4 md:grid-cols-3">
          {/* Search */}

          <div className="relative md:col-span-2">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search by destination or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
            />
          </div>

          {/* Status Filter */}

          <div className="relative">
            <Filter
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-300 pl-11 pr-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXITED">Exited</option>
              <option value="RETURNED">Returned</option>
            </select>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* Statistics */}
      {/* ========================================================== */}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Total Requests</p>

              <h2 className="mt-2 text-4xl font-bold text-slate-900">
                {filteredHistory.length}
              </h2>
            </div>

            <div className="rounded-2xl bg-green-100 p-4">
              <FileText className="text-green-700" size={28} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Approved</p>

              <h2 className="mt-2 text-4xl font-bold text-green-600">
                {
                  filteredHistory.filter((item) => item.status === "APPROVED")
                    .length
                }
              </h2>
            </div>

            <div className="rounded-2xl bg-green-100 p-4">
              <CalendarDays className="text-green-700" size={28} />
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm">Pending</p>

              <h2 className="mt-2 text-4xl font-bold text-amber-600">
                {
                  filteredHistory.filter((item) => item.status === "PENDING")
                    .length
                }
              </h2>
            </div>

            <div className="rounded-2xl bg-amber-100 p-4">
              <CalendarDays className="text-amber-700" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Table starts in Part 3 */}
      {/* ========================================================== */}
      {/* History Table */}
      {/* ========================================================== */}

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  #
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Destination
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Out Date
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Return
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    Loading history...
                  </td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5 font-semibold">{index + 1}</td>

                    <td className="px-6 py-5">{item.destination}</td>

                    <td className="px-6 py-5">
                      {new Date(item.outDate).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-5">
                      {item.expectedReturn
                        ? new Date(item.expectedReturn).toLocaleString()
                        : "-"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-4 py-1 text-xs font-semibold

                        ${
                          item.status === "APPROVED"
                            ? "bg-green-100 text-green-700"
                            : item.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : item.status === "REJECTED"
                                ? "bg-red-100 text-red-700"
                                : item.status === "EXITED"
                                  ? "bg-blue-100 text-blue-700"
                                  : item.status === "RETURNED"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-center">
                      <button
                        onClick={() => navigate(`/student/outpass/${item._id}`)}
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No outpass history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 4 continues... */}
    </div>
  );
};

export default OutpassHistory;
