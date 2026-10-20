import { useEffect, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import { toast } from "sonner";

import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import superAdminService from "../services/superAdmin.service";

const filterFields = [
  "search",
  "from",
  "to",
  "status",
  "parentStatus",
  "bypass",
  "pendingBypass",
  "approvalRole",
  "academicInstitute",
  "academicProgram",
  "guardId",
];

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to generate report.";

export default function Reports() {
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState(() =>
    Object.fromEntries(
      filterFields.map((field) => [field, searchParams.get(field) || ""]),
    ),
  );

  const [summary, setSummary] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [previewError, setPreviewError] = useState("");

  const [downloading, setDownloading] = useState("");

  const update = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setPreviewLoading(true);
      setPreviewError("");

      try {
        const result = await superAdminService.getOutpasses({
          ...filters,
          page: 1,
          limit: 1,
        });

        if (active) {
          setSummary(result.summary);
        }
      } catch (error) {
        if (active) {
          setSummary(null);
          setPreviewError(getError(error));
        }
      } finally {
        if (active) {
          setPreviewLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [filters]);

  const download = async (format) => {
    if (downloading || previewError || previewLoading) return;

    if (format === "pdf" && Number(summary?.total || 0) > 100) {
      toast.error("PDF limit is 100 outpasses. Narrow your filters.", {
        duration: 1000,
      });
      return;
    }

    if (format === "xlsx" && Number(summary?.total || 0) > 2500) {
      toast.error("Excel limit is 2500 outpasses. Narrow your filters.", {
        duration: 1000,
      });
      return;
    }

    setDownloading(format);

    try {
      await superAdminService.downloadOutpassReport(format, filters);

      toast.success(`${format.toUpperCase()} report downloaded`, {
        duration: 1000,
      });
    } catch (err) {
      toast.error(getError(err), {
        duration: 1000,
      });
    } finally {
      setDownloading("");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Link
        to="/super-admin/outpasses"
        className="inline-flex items-center gap-2 text-sm font-bold text-amber-300"
      >
        <ArrowLeft size={18} />
        Back to Outpass Monitoring
      </Link>

      <section className="rounded-3xl border border-amber-400/20 bg-gradient-to-r from-[#11233d] to-[#173b30] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">
          AMIOUT Enterprise · Super Admin
        </p>

        <h1 className="mt-3 flex items-center gap-3 text-2xl font-black text-white sm:text-3xl">
          <FileText size={30} className="text-amber-300" />
          University Outpass Reports
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          Download detailed parent-consent, faculty-approval, Security
          EXIT/ENTRY and outpass history reports directly from MongoDB. All
          timestamps use IST.
        </p>
      </section>

      <section className="rounded-3xl border border-[#283a51] bg-[#112138] p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays size={22} className="text-amber-300" />

          <div>
            <h2 className="font-black text-white">Report Filters</h2>
            <p className="mt-1 text-xs text-slate-400">
              The same filters are applied to preview and exports.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-xs text-slate-400">
              Outpass Date From
            </span>

            <input
              type="date"
              value={filters.from}
              onChange={(e) => update("from", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs text-slate-400">
              Outpass Date To
            </span>

            <input
              type="date"
              value={filters.to}
              onChange={(e) => update("to", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs text-slate-400">
              Outpass Number / Student
            </span>

            <input
              type="search"
              value={filters.search}
              onChange={(e) => update("search", e.target.value)}
              placeholder="Search records"
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white placeholder:text-slate-500"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs text-slate-400">
              Outpass Status
            </span>

            <select
              value={filters.status}
              onChange={(e) => update("status", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white"
            >
              <option value="">All Statuses</option>
              {["PENDING", "APPROVED", "REJECTED", "EXITED", "RETURNED"].map(
                (status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ),
              )}
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs text-slate-400">
              Parent Consent
            </span>

            <select
              value={filters.parentStatus}
              onChange={(e) => update("parentStatus", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white"
            >
              <option value="">All Parent Statuses</option>
              <option value="APPROVED">Approved</option>
              <option value="PENDING">Pending</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </label>

          <label>
            <span className="mb-2 block text-xs text-slate-400">
              Faculty Bypass Recorded
            </span>

            <select
              value={filters.bypass}
              onChange={(e) => update("bypass", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white"
            >
              <option value="">All</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </label>
        </div>

        <label className="mt-5 flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={filters.pendingBypass === "YES"}
            onChange={(e) =>
              setFilters((current) => ({
                ...current,
                pendingBypass: e.target.checked ? "YES" : "",
                ...(e.target.checked
                  ? {
                      parentStatus: "PENDING",
                      bypass: "YES",
                    }
                  : {}),
              }))
            }
            className="accent-amber-400"
          />
          Include only Parent PENDING + Bypass Recorded
        </label>

        <button
          type="button"
          onClick={() =>
            setFilters(Object.fromEntries(filterFields.map((key) => [key, ""])))
          }
          className="mt-5 text-xs font-bold text-amber-300"
        >
          Clear All Report Filters
        </button>
      </section>

      <section className="rounded-3xl border border-[#283a51] bg-[#112138] p-5 sm:p-7">
        <h2 className="font-black text-white">Report Preview</h2>

        {previewLoading ? (
          <p className="mt-5 flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={17} className="animate-spin" />
            Checking matching records...
          </p>
        ) : previewError ? (
          <p className="mt-5 flex items-center gap-2 text-sm text-rose-300">
            <AlertTriangle size={18} />
            {previewError}
          </p>
        ) : (
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-[#091629] p-5">
              <p className="text-xs text-slate-400">Matching Outpasses</p>
              <p className="mt-2 text-3xl font-black text-white">
                {summary?.total ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-[#091629] p-5">
              <p className="text-xs text-slate-400">Parent Pending</p>
              <p className="mt-2 text-3xl font-black text-amber-300">
                {summary?.parentPending ?? 0}
              </p>
            </div>

            <div className="rounded-xl bg-[#091629] p-5">
              <p className="text-xs text-slate-400">
                Pending + Bypass Recorded
              </p>
              <p className="mt-2 text-3xl font-black text-emerald-300">
                {summary?.pendingBypass ?? 0}
              </p>
            </div>
          </div>
        )}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section className="rounded-3xl border border-emerald-400/20 bg-[#112138] p-6">
          <FileSpreadsheet size={34} className="text-emerald-300" />

          <h2 className="mt-5 text-xl font-black text-white">
            Excel Detailed Report
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Complete spreadsheet with approval timestamps, faculty bypass
            records, parent consent, Security Guard identities and audit
            timeline.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Maximum 2,500 records per export.
          </p>

          <button
            type="button"
            disabled={
              Boolean(downloading) || previewLoading || Boolean(previewError)
            }
            onClick={() => download("xlsx")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-black text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            {downloading === "xlsx" ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Download size={19} />
            )}
            Download Excel (.xlsx)
          </button>
        </section>

        <section className="rounded-3xl border border-amber-400/20 bg-[#112138] p-6">
          <FileText size={34} className="text-amber-300" />

          <h2 className="mt-5 text-xl font-black text-white">
            PDF University Audit Report
          </h2>

          <p className="mt-3 text-sm leading-7 text-slate-400">
            Detailed printable document with outpass information, faculty
            approval, parent status, security verification and audit history.
          </p>

          <p className="mt-3 text-xs text-slate-500">
            Maximum 100 detailed outpasses per PDF.
          </p>

          <button
            type="button"
            disabled={
              Boolean(downloading) || previewLoading || Boolean(previewError)
            }
            onClick={() => download("pdf")}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3.5 text-sm font-black text-[#091629] hover:bg-amber-300 disabled:opacity-50"
          >
            {downloading === "pdf" ? (
              <Loader2 size={19} className="animate-spin" />
            ) : (
              <Download size={19} />
            )}
            Download PDF
          </button>
        </section>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-[#283a51] bg-[#112138] p-5">
        <ShieldCheck size={22} className="shrink-0 text-emerald-300" />

        <p className="text-xs leading-6 text-slate-400">
          Reports are available only through the authenticated Super Admin
          backend. Parent PENDING is never mislabeled as APPROVED. Missing gate
          or guard information is identified as Not Recorded. Export files
          should be stored securely.
        </p>
      </div>
    </div>
  );
}
