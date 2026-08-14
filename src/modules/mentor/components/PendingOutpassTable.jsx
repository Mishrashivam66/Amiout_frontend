
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
  Download,
  Clock3,
  Users,
  ClipboardList,
} from "lucide-react";

import { toast } from "react-hot-toast";

import mentorService from "../services/mentor.service";

const PendingOutpassTable = ({ onRefresh }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [selectedRows, setSelectedRows] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // =====================================================
  // Load Pending Requests
  // =====================================================

  const loadPendingRequests = async () => {
    try {
      setLoading(true);

      const response = await mentorService.getPendingRequests(page, 10, search);

      setRequests(response.data || []);

      setPagination(
        response.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error(error);

      toast.error("Unable to load pending requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingRequests();
  }, [page, search]);

  // =====================================================
  // Approve
  // =====================================================

  const handleApprove = async (id) => {
    try {
      await mentorService.approveOutpass(id);

      toast.success("Outpass Approved");

      loadPendingRequests();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Approval Failed");
    }
  };

  // =====================================================
  // Reject
  // =====================================================

  const handleReject = async (id) => {
    try {
      await mentorService.rejectOutpass(id);

      toast.success("Outpass Rejected");

      loadPendingRequests();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reject Failed");
    }
  };

  // =====================================================
  // Select Row
  // =====================================================

  const handleSelect = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((item) => item !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === requests.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(requests.map((item) => item._id));
    }
  };
  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">
      <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/90 backdrop-blur-xl shadow-[0_25px_80px_rgba(15,23,42,0.15)]">
        {/* ================= Header ================= */}

        <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-8">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Pending Outpass Requests
              </h1>

              <p className="mt-2 text-blue-100">
                Review, approve or reject student outpass requests.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search Student..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="
                w-72
                rounded-2xl
                border
                border-white/20
                bg-white
                py-3
                pl-11
                pr-4
                text-sm
                shadow-md
                outline-none
                transition-all
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-200
                "
                />
              </div>

              <button
                className="
              flex items-center gap-2
              rounded-2xl
              bg-white
              px-5
              py-3
              text-sm
              font-semibold
              text-slate-700
              shadow-md
              transition-all
              hover:-translate-y-0.5
              hover:bg-slate-100
              "
              >
                <Filter size={18} />
                Filter
              </button>

              <button
                onClick={loadPendingRequests}
                className="
              flex items-center gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-blue-500/30
              transition-all
              hover:scale-105
              "
              >
                <RefreshCw size={18} />
                Refresh
              </button>

              <button
                className="
              flex items-center gap-2
              rounded-2xl
              bg-gradient-to-r
              from-emerald-600
              to-green-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-lg
              shadow-emerald-500/30
              transition-all
              hover:scale-105
              "
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* ================= Dashboard Stats ================= */}

        <div className="grid grid-cols-1 gap-6 bg-slate-50 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Pending</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {pagination.total}
                </h2>
              </div>

              <div className="rounded-2xl bg-blue-100 p-4">
                <ClipboardList className="text-blue-700" size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Showing</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {requests.length}
                </h2>
              </div>

              <div className="rounded-2xl bg-indigo-100 p-4">
                <Users className="text-indigo-700" size={28} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Current Page</p>

                <h2 className="mt-2 text-3xl font-bold text-slate-800">
                  {page}
                </h2>
              </div>

              <div className="rounded-2xl bg-amber-100 p-4">
                <Clock3 className="text-amber-700" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* ================= Bulk Actions ================= */}

        {selectedRows.length > 0 && (
          <div className="mx-6 mb-6 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="font-semibold text-blue-700">
                {selectedRows.length} Request(s) Selected
              </span>

              <div className="flex gap-3">
                <button className="rounded-xl bg-emerald-600 px-5 py-2.5 font-semibold text-white transition hover:bg-emerald-700">
                  Bulk Approve
                </button>

                <button className="rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white transition hover:bg-red-700">
                  Bulk Reject
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= Table Starts Here ================= */}
        {/* ================================================= */}
        {/* Premium Table */}
        {/* ================================================= */}

        <div className="overflow-x-auto px-6 pb-6">
          <table className="min-w-full overflow-hidden rounded-2xl">
            <thead className="bg-gradient-to-r from-slate-800 to-slate-900">
              <tr>
                <th className="px-5 py-4">
                  <input
                    type="checkbox"
                    checked={
                      requests.length > 0 &&
                      selectedRows.length === requests.length
                    }
                    onChange={handleSelectAll}
                    className="h-4 w-4 accent-blue-600"
                  />
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-200">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-200">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-200">
                  Destination
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-200">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest text-slate-200">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-widest text-slate-200">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-20 text-center text-lg text-slate-500"
                  >
                    Loading Pending Requests...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-20 text-center text-lg text-slate-500"
                  >
                    No Pending Requests Found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr
                    key={request._id}
                    className="transition-all duration-300 hover:bg-blue-50"
                  >
                    {/* Checkbox */}

                    <td className="px-5 py-5">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(request._id)}
                        onChange={() => handleSelect(request._id)}
                        className="h-4 w-4 accent-blue-600"
                      />
                    </td>

                    {/* Student */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div
                          className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-gradient-to-br
                  from-blue-600
                  to-indigo-700
                  text-xl
                  font-bold
                  text-white
                  shadow-lg
                  shadow-blue-300/50
                  "
                        >
                          {request.student?.name?.charAt(0)?.toUpperCase() ||
                            "S"}
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-800">
                            {request.student?.name}
                          </h4>

                          <p className="text-sm text-slate-500">
                            {request.student?.enrollmentNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Reason */}

                    <td className="px-6 py-5">
                      <div className="max-w-xs">
                        <p className="line-clamp-2 text-sm leading-6 text-slate-700">
                          {request.reason}
                        </p>
                      </div>
                    </td>

                    {/* Destination */}

                    <td className="px-6 py-5">
                      <span
                        className="
                rounded-full
                border
                border-indigo-200
                bg-indigo-50
                px-4
                py-1.5
                text-xs
                font-semibold
                text-indigo-700
                "
                      >
                        {request.destination}
                      </span>
                    </td>

                    {/* Date */}

                    <td className="px-6 py-5">
                      <div className="font-semibold text-slate-700">
                        {new Date(request.outDate).toLocaleDateString()}
                      </div>

                      <div className="text-xs text-slate-500">
                        {request.outTime}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5">
                      <span
                        className="
                inline-flex
                items-center
                rounded-full
                border
                border-amber-200
                bg-gradient-to-r
                from-yellow-100
                to-orange-100
                px-4
                py-1.5
                text-xs
                font-bold
                text-orange-700
                "
                      >
                        Pending
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            navigate(`/mentor/outpass/${request._id}`)
                          }
                          className="
                  rounded-xl
                  bg-blue-50
                  p-3
                  transition-all
                  hover:scale-110
                  hover:bg-blue-600
                  "
                        >
                          <Eye
                            size={18}
                            className="text-blue-700 hover:text-white"
                          />
                        </button>

                        <button
                          onClick={() => handleApprove(request._id)}
                          className="
                  rounded-xl
                  bg-emerald-50
                  p-3
                  transition-all
                  hover:scale-110
                  hover:bg-emerald-600
                  "
                        >
                          <CheckCircle2
                            size={18}
                            className="text-emerald-700 hover:text-white"
                          />
                        </button>

                        <button
                          onClick={() => handleReject(request._id)}
                          className="
                  rounded-xl
                  bg-red-50
                  p-3
                  transition-all
                  hover:scale-110
                  hover:bg-red-600
                  "
                        >
                          <XCircle
                            size={18}
                            className="text-red-700 hover:text-white"
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* ================================================= */}
        {/* Premium Footer / Pagination */}
        {/* ================================================= */}

        {!loading && requests.length > 0 && (
          <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white px-8 py-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              {/* Left */}

              <div>
                <p className="text-sm text-slate-500">
                  Showing
                  <span className="mx-1 font-bold text-blue-700">
                    {requests.length}
                  </span>
                  of
                  <span className="mx-1 font-bold text-blue-700">
                    {pagination.total}
                  </span>
                  Pending Requests
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Page {page} of {pagination.totalPages}
                </p>
              </div>

              {/* Pagination */}

              <div className="flex items-center gap-3">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="
            rounded-xl
            border
            border-slate-300
            bg-white
            px-5
            py-2.5
            text-sm
            font-semibold
            text-slate-700
            shadow-sm
            transition-all
            hover:border-blue-500
            hover:bg-blue-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                >
                  ← Previous
                </button>

                <div
                  className="
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            px-5
            py-2.5
            text-sm
            font-bold
            text-white
            shadow-lg
            shadow-blue-400/30
          "
                >
                  {page}
                </div>

                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="
            rounded-xl
            bg-gradient-to-r
            from-blue-600
            to-indigo-700
            px-5
            py-2.5
            text-sm
            font-semibold
            text-white
            shadow-lg
            shadow-blue-400/30
            transition-all
            hover:scale-105
            hover:from-blue-700
            hover:to-indigo-800
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingOutpassTable;
