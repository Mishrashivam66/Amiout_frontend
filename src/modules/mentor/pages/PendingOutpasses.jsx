import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getPendingRequests,
  approveOutpass,
  rejectOutpass,
} from "../services/mentor.service";

const PendingOutpasses = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRequests = async () => {
    try {
      setLoading(true);

      const response = await getPendingRequests();

      setRequests(response.data || []);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load pending requests.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const response = await approveOutpass(id);

      toast.success(response?.message || "Outpass approved successfully.");

      loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to approve outpass.");
    }
  };
  const handleReject = async (id) => {
    const remark = prompt("Enter rejection remark");

    if (!remark) {
      toast.error("Rejection remark is required.");
      return;
    }

    try {
      const response = await rejectOutpass(id, remark);

      toast.success(response?.message || "Outpass rejected successfully.");

      loadRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject outpass.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Pending Outpasses
          </h1>

          <p className="mt-2 text-slate-500">
            Review and manage all pending outpass requests.
          </p>
        </div>

        <div className="rounded-xl bg-amber-100 px-5 py-3">
          <p className="text-sm text-amber-700 font-medium">Pending</p>

          <p className="text-3xl font-bold text-amber-800">{requests.length}</p>
        </div>
      </div>

      {/* Table Card */}

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg border border-slate-200">
        {/* Header */}

        <div className="flex items-center justify-between border-b bg-slate-50 px-6 py-5">
          <h2 className="text-xl font-semibold">Pending Requests</h2>

          <button
            onClick={loadRequests}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
          >
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Student</th>

                <th className="px-6 py-4 text-left font-semibold">
                  Destination
                </th>

                <th className="px-6 py-4 text-left font-semibold">Reason</th>

                <th className="px-6 py-4 text-left font-semibold">
                  Applied On
                </th>

                <th className="px-6 py-4 text-center font-semibold">Status</th>

                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {requests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-4xl">
                        📭
                      </div>

                      <h3 className="text-xl font-semibold">
                        No Pending Requests
                      </h3>

                      <p className="mt-2 text-slate-500">
                        You're all caught up.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((item) => (
                  <tr
                    key={item._id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    {/* Student */}

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white">
                          {item.studentName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-semibold">{item.studentName}</p>
                        </div>
                      </div>
                    </td>

                    {/* Destination */}

                    <td className="px-6 py-5">{item.destination}</td>

                    {/* Reason */}

                    <td className="px-6 py-5 max-w-xs truncate">
                      {item.reason}
                    </td>

                    {/* Date */}

                    <td className="px-6 py-5">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    {/* Status */}

                    <td className="px-6 py-5 text-center">
                      <span className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-700">
                        Pending
                      </span>
                    </td>

                    {/* Actions */}

                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/mentor/outpass/${item._id}`}
                          className="rounded-lg bg-slate-700 px-4 py-2 text-white hover:bg-slate-800 transition"
                        >
                          Details
                        </Link>

                        <button
                          onClick={() => handleApprove(item._id)}
                          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(item._id)}
                          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PendingOutpasses;
