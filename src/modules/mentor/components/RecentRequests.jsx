import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Filter,
} from "lucide-react";

import { toast } from "react-hot-toast";

import mentorService from "../services/mentor.service";

const RecentRequests = ({ onRefresh }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
    limit: 10,
  });

  // =====================================================
  // Load Pending Requests
  // =====================================================

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await mentorService.getPendingRequests(page, 5, search);

      setRequests(response.data || []);

      setPagination(
        response.pagination || {
          total: 0,
          totalPages: 1,
          limit: 5,
        },
      );
    } catch (error) {
      console.error(error);

      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, [page, search]);

  // =====================================================
  // Approve
  // =====================================================

  const handleApprove = async (id) => {
    try {
      await mentorService.approveOutpass(id);

      toast.success("Outpass Approved");

      loadRequests();

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

      loadRequests();

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Reject Failed");
    }
  };
  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="flex flex-col gap-5 border-b border-slate-200 p-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Recent Outpass Requests
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Review and manage recently submitted outpass requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}

          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="
                w-64
                rounded-xl
                border
                border-slate-300
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-200
              "
            />
          </div>

          {/* Filter */}

          <button
            className="
              flex
              items-center
              gap-2
              rounded-xl
              border
              border-slate-300
              px-4
              py-2.5
              text-sm
              font-medium
              transition
              hover:bg-slate-100
            "
          >
            <Filter size={18} />
            Filter
          </button>

          {/* Refresh */}

          <button
            onClick={loadRequests}
            className="
              flex
              items-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-blue-700
            "
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* Table */}
      {/* ================================================= */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Student
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Reason
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Destination
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Date
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-500">
                  No pending requests found.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr key={request._id} className="transition hover:bg-slate-50">
                  {/* ================= Student ================= */}

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
                        {request.student?.name?.charAt(0) || "S"}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {request.student?.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {request.student?.enrollmentNo}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ================= Reason ================= */}

                  <td className="px-6 py-5">
                    <span className="text-sm text-slate-700">
                      {request.reason}
                    </span>
                  </td>

                  {/* ================= Destination ================= */}

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                      {request.destination}
                    </span>
                  </td>

                  {/* ================= Date ================= */}

                  <td className="px-6 py-5">
                    <div className="text-sm text-slate-700">
                      {new Date(request.outDate).toLocaleDateString()}
                    </div>

                    <div className="text-xs text-slate-500">
                      {request.outTime}
                    </div>
                  </td>

                  {/* ================= Status ================= */}

                  <td className="px-6 py-5">
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                      Pending
                    </span>
                  </td>

                  {/* ================= Actions ================= */}

                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() =>
                          navigate(`/mentor/outpass/${request._id}`)
                        }
                        className="rounded-lg bg-slate-100 p-2 transition hover:bg-slate-200"
                      >
                        <Eye size={18} className="text-slate-700" />
                      </button>

                      <button
                        onClick={() => handleApprove(request._id)}
                        className="rounded-lg bg-emerald-100 p-2 transition hover:bg-emerald-200"
                      >
                        <CheckCircle2 size={18} className="text-emerald-700" />
                      </button>

                      <button
                        onClick={() => handleReject(request._id)}
                        className="rounded-lg bg-red-100 p-2 transition hover:bg-red-200"
                      >
                        <XCircle size={18} className="text-red-700" />
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
      {/* Pagination */}
      {/* ================================================= */}

      {!loading && requests.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 p-6 md:flex-row">
          <div className="text-sm text-slate-500">
            Showing page{" "}
            <span className="font-semibold text-slate-700">{page}</span> of{" "}
            <span className="font-semibold text-slate-700">
              {pagination.totalPages}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="
                rounded-xl
                border
                border-slate-300
                px-4
                py-2
                text-sm
                font-medium
                transition
                hover:bg-slate-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Previous
            </button>

            <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
              {page}
            </span>

            <button
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              className="
                rounded-xl
                bg-blue-600
                px-4
                py-2
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentRequests;
