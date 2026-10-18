import { useCallback, useEffect, useState } from "react";

import { RefreshCw, Download, FileSpreadsheet, Loader2 } from "lucide-react";

import { toast } from "react-hot-toast";

import {
  getOutpasses,
  getOutpassDetails,
  downloadOutpassExcel,
} from "../services/outpass.service";

import OutpassFilters from "../components/outpasses/OutpassFilters";
import OutpassTable from "../components/outpasses/OutpassTable";
import OutpassDetailsModal from "../components/outpasses/OutpassDetailsModal";

// ============================================================
// DATE HELPERS - IST
// ============================================================

const todayIST = () =>
  new Date(Date.now() + 330 * 60000).toISOString().slice(0, 10);

// ============================================================
// COMPONENT
// ============================================================

const Outpasses = () => {
  const [loading, setLoading] = useState(true);
  const [outpasses, setOutpasses] = useState([]);
  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [selectedOutpass, setSelectedOutpass] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);

  const [detailsLoading, setDetailsLoading] = useState(false);

  const [exporting, setExporting] = useState(false);

  // REPORT FILTERS
  const [reportType, setReportType] = useState("day");

  const [reportDate, setReportDate] = useState(todayIST());

  const [reportMonth, setReportMonth] = useState(todayIST().slice(0, 7));

  const [reportYear, setReportYear] = useState(todayIST().slice(0, 4));

  const [startDate, setStartDate] = useState(todayIST());

  const [endDate, setEndDate] = useState(todayIST());

  const [reportStatus, setReportStatus] = useState("ALL");

  // ==========================================================
  // FETCH OUTPASSES
  // ==========================================================

  const loadOutpasses = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getOutpasses({
        page,
        limit: 10,
        search,
        status,
      });

      setOutpasses(Array.isArray(response.data) ? response.data : []);

      setPagination(response.pagination || {});
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load outpasses.",
      );
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    loadOutpasses();
  }, [loadOutpasses]);

  // ==========================================================
  // VIEW FULL DETAILS
  // ==========================================================

  const handleViewDetails = async (item) => {
    const id = item?._id;

    if (!id) {
      toast.error("Outpass ID not found.");
      return;
    }

    setSelectedOutpass(null);
    setOpenDetails(true);
    setDetailsLoading(true);

    try {
      const response = await getOutpassDetails(id);

      if (response?.success !== true || !response?.data) {
        throw new Error(response?.message || "Unable to load details.");
      }

      setSelectedOutpass(response.data);
    } catch (error) {
      setOpenDetails(false);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load outpass details.",
      );
    } finally {
      setDetailsLoading(false);
    }
  };

  // ==========================================================
  // EXPORT EXCEL
  // ==========================================================

  const handleDownloadExcel = async () => {
    if (exporting) return;

    const params = {
      type: reportType,
      status: reportStatus,
    };

    if (reportType === "day") {
      params.date = reportDate;
    }

    if (reportType === "month") {
      params.month = reportMonth;
    }

    if (reportType === "year") {
      params.year = reportYear;
    }

    if (reportType === "custom") {
      if (startDate > endDate) {
        toast.error("Start date must be before end date.");
        return;
      }

      params.startDate = startDate;
      params.endDate = endDate;
    }

    try {
      setExporting(true);

      await downloadOutpassExcel(params);

      toast.success("Excel report downloaded successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Report download failed.",
      );
    } finally {
      setExporting(false);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-white">Outpass Management</h1>

        <p className="mt-2 text-slate-400">
          Monitor university outpasses, view full details and download Excel
          reports.
        </p>
      </div>

      {/* STATISTICS */}
      <div className="flex flex-col gap-5 rounded-3xl border border-[#223447] bg-gradient-to-r from-[#0F172A] via-[#122131] to-[#163525] p-8 shadow-2xl lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">
            Total Outpasses
          </p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            {pagination.total || 0}
          </h2>

          <p className="mt-2 text-green-400">Live Records</p>
        </div>

        <button
          type="button"
          onClick={loadOutpasses}
          disabled={loading}
          className="flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* REPORT PANEL */}
      <div className="rounded-3xl border border-[#223447] bg-[#0F172A] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-green-500/10 p-3">
            <FileSpreadsheet size={25} className="text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">Excel Reports</h2>

            <p className="mt-1 text-sm text-slate-400">
              Export matching outpasses using IST outpass dates.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Report Type
            </label>

            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
            >
              <option value="day">Day-wise</option>
              <option value="month">Month-wise</option>
              <option value="year">Year-wise</option>
              <option value="custom">Custom Date Range</option>
            </select>
          </div>

          {reportType === "day" && (
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Select Date
              </label>

              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
              />
            </div>
          )}

          {reportType === "month" && (
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Select Month
              </label>

              <input
                type="month"
                value={reportMonth}
                onChange={(e) => setReportMonth(e.target.value)}
                className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
              />
            </div>
          )}

          {reportType === "year" && (
            <div>
              <label className="mb-2 block text-sm text-slate-400">
                Report Year
              </label>

              <input
                type="number"
                min="2000"
                max="2100"
                value={reportYear}
                onChange={(e) => setReportYear(e.target.value)}
                className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
              />
            </div>
          )}

          {reportType === "custom" && (
            <>
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Start Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  End Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-2 block text-sm text-slate-400">
              Outpass Status
            </label>

            <select
              value={reportStatus}
              onChange={(e) => setReportStatus(e.target.value)}
              className="w-full rounded-xl border border-[#223447] bg-[#081018] px-4 py-3 text-white"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="EXITED">Exited</option>
              <option value="RETURNED">Returned</option>
              <option value="COMPLETED">Completed</option>
              <option value="EXPIRED">Expired</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleDownloadExcel}
            disabled={exporting}
            className="inline-flex items-center gap-3 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            {exporting ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Download size={19} />
            )}

            {exporting ? "Generating Excel..." : "Download Excel Report"}
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <OutpassFilters
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        status={status}
        setStatus={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {/* TABLE */}
      <OutpassTable
        loading={loading}
        outpasses={outpasses}
        onView={handleViewDetails}
      />

      {/* PAGINATION */}
      <div className="flex flex-col gap-5 rounded-2xl border border-[#223447] bg-[#111827] p-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="text-slate-300">
          Showing Page <span className="font-bold text-white">{page}</span>
          {" / "}
          <span className="font-bold text-white">
            {pagination.totalPages || 1}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-xl bg-slate-700 px-6 py-3 text-white hover:bg-slate-600 disabled:opacity-40"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={loading || page >= (pagination.totalPages || 1)}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* LOADING FULL DETAILS */}
      {openDetails && detailsLoading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/75">
          <div className="flex items-center gap-3 rounded-2xl border border-[#223447] bg-[#0F172A] p-8 text-white">
            <Loader2 className="animate-spin text-green-400" size={25} />
            Loading full outpass details...
          </div>
        </div>
      )}

      {/* FULL DETAILS MODAL */}
      <OutpassDetailsModal
        open={openDetails && !detailsLoading && !!selectedOutpass}
        outpass={selectedOutpass}
        onClose={() => {
          setOpenDetails(false);
          setSelectedOutpass(null);
        }}
      />
    </div>
  );
};

export default Outpasses;
