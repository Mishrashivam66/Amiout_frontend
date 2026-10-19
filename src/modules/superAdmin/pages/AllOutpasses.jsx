import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileDown,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import superAdminService from "../services/superAdmin.service";

const PAGE_SIZE = 10;

const initialFilters = {
  search: "",
  from: "",
  to: "",
  status: "",
  parentStatus: "",
  bypass: "",
  pendingBypass: "",
  approvalRole: "",
  academicInstitute: "",
  academicProgram: "",
  guardId: "",
};

const emptySummary = null;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load outpasses.";

const fmt = (value) => {
  if (!value) return "Not Recorded";

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return "Not Recorded";
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

const show = (value) =>
  value === undefined || value === null || value === ""
    ? "Not Recorded"
    : String(value);

const person = (value) => value?.name || value?.id || "Not Recorded";

const shortStatus = (status) => String(status || "UNKNOWN").toUpperCase();

const statusClass = (status) => {
  const value = shortStatus(status);

  if (value === "RETURNED" || value === "APPROVED") {
    return "bg-emerald-400/10 text-emerald-300";
  }

  if (value === "REJECTED") {
    return "bg-rose-400/10 text-rose-300";
  }

  if (value === "PENDING") {
    return "bg-amber-400/10 text-amber-300";
  }

  return "bg-blue-400/10 text-blue-300";
};

function Status({ value }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(value)}`}
    >
      {shortStatus(value)}
    </span>
  );
}

function Metric({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-[#283a51] bg-[#112138] p-4 sm:p-5">
      <Icon size={22} className={color} />
      <p className="mt-3 text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-3xl font-black text-white">{value ?? "—"}</p>
    </div>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-xs font-semibold text-slate-400">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-3 py-3 text-sm text-white outline-none focus:border-amber-400"
      >
        <option value="">All</option>
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function Detail({ label, value }) {
  return (
    <div className="border-b border-white/5 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-200">
        {show(value)}
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-2xl border border-[#283a51] bg-[#091629] p-4 sm:p-5">
      <h3 className="text-sm font-black uppercase tracking-wide text-amber-300">
        {title}
      </h3>

      <div className="mt-3 grid gap-x-6 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function OutpassDetails({ selected, loading, error, onClose }) {
  if (!selected && !loading && !error) return null;

  const o = selected;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Outpass audit details"
        className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-[#33465e] bg-[#112138]"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#0b1a2d] p-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-amber-300">
              University Outpass Audit
            </p>
            <h2 className="mt-2 text-xl font-black text-white">
              {o?.outpassId || "Outpass Details"}
            </h2>
            {o && <Status value={o.status} />}
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto p-4 sm:p-6">
          {loading && (
            <p className="flex items-center gap-3 text-sm text-slate-300">
              <Loader2 className="animate-spin" />
              Loading latest audit record...
            </p>
          )}

          {error && (
            <p className="rounded-xl bg-rose-400/10 p-4 text-sm text-rose-300">
              {error}
            </p>
          )}

          {o && (
            <>
              {o.parent.status === "PENDING" && (
                <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4">
                  <div className="flex items-center gap-2 font-black text-amber-300">
                    <ShieldAlert size={20} />
                    Parent Consent: PENDING
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {o.bypass.parentPendingBypass
                      ? "Faculty acknowledgement and bypass are recorded. Parent SMS status remains PENDING."
                      : "No matching parent-pending faculty override is recorded."}
                  </p>
                </div>
              )}

              {o.anomalies.length > 0 && (
                <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 p-4">
                  <p className="font-bold text-rose-300">
                    Audit Consistency Review
                  </p>
                  <p className="mt-2 text-xs text-rose-200">
                    {o.anomalies.join(", ")}
                  </p>
                </div>
              )}

              <Section title="Student & Academic Details">
                <Detail label="Student" value={o.student.name} />
                <Detail label="Enrollment" value={o.student.enrollmentNumber} />
                <Detail label="Institute" value={o.academic.institute?.name} />
                <Detail label="Program" value={o.academic.program?.name} />
                <Detail label="Course" value={o.student.course} />
                <Detail label="Branch" value={o.student.branch} />
                <Detail label="Semester" value={o.student.semester} />
                <Detail
                  label="Section / Group"
                  value={`${o.student.section} / ${o.student.group}`}
                />
                <Detail label="Department" value={o.academic.department} />
                <Detail label="Batch" value={o.academic.batch} />
              </Section>

              <Section title="Student Outpass Request">
                <Detail label="Outpass Number" value={o.outpassId} />
                <Detail label="Applied At (IST)" value={fmt(o.createdAt)} />
                <Detail label="Out Date" value={fmt(o.request.outDate)} />
                <Detail label="Requested OUT Time" value={o.request.outTime} />
                <Detail label="Expected IN Time" value={o.request.inTime} />
                <Detail label="Destination" value={o.request.destination} />
                <Detail label="Reason" value={o.request.reason} />
                <Detail
                  label="Daily Trip Number"
                  value={o.request.dailyTripNumber}
                />
              </Section>

              <Section title="Parent Consent & SMS/Phone Verification">
                <Detail label="Parent Name" value={o.parent.name} />
                <Detail label="Parent Contact" value={o.parent.mobileMasked} />
                <Detail label="Parent Status" value={o.parent.status} />
                <Detail label="Approval Method" value={o.parent.method} />
                <Detail
                  label="Parent Decision Time"
                  value={fmt(o.parent.decidedAt)}
                />
                <Detail label="SMS Status" value={o.parent.smsStatus} />
                <Detail label="Phone Outcome" value={o.parent.callOutcome} />
                <Detail
                  label="Phone Verified At"
                  value={fmt(o.parent.callVerifiedAt)}
                />
                <Detail
                  label="Phone Verified By"
                  value={person(o.parent.verifiedBy)}
                />
                <Detail label="Phone Remarks" value={o.parent.callRemarks} />
              </Section>

              <Section title="Faculty Approval">
                <Detail label="Assigned Role" value={o.faculty.assignedRole} />
                <Detail
                  label="Assigned Faculty"
                  value={person(o.faculty.assignedTo)}
                />
                <Detail
                  label="Approved By"
                  value={person(o.faculty.approvedBy)}
                />
                <Detail
                  label="Approved Authority"
                  value={o.faculty.approvedRole}
                />
                <Detail label="Approved At" value={fmt(o.faculty.approvedAt)} />
                <Detail
                  label="Approval Remark"
                  value={o.faculty.approvalRemark}
                />
                <Detail
                  label="Rejected By"
                  value={person(o.faculty.rejectedBy)}
                />
                <Detail label="Rejected At" value={fmt(o.faculty.rejectedAt)} />
              </Section>

              <Section title="Faculty Bypass & Acknowledgement">
                <Detail
                  label="Bypass Used"
                  value={o.bypass.used ? "YES" : "NO"}
                />
                <Detail
                  label="Parent Pending Bypass"
                  value={o.bypass.parentPendingBypass ? "RECORDED" : "NO"}
                />
                <Detail
                  label="Bypass Authority"
                  value={o.bypass.authorityRole}
                />
                <Detail
                  label="Performed By"
                  value={person(o.bypass.performedBy)}
                />
                <Detail
                  label="Performed At"
                  value={fmt(o.bypass.performedAt)}
                />
                <Detail
                  label="Bypassed Roles"
                  value={o.bypass.bypassedRoles.join(", ")}
                />
                <Detail label="Reason" value={o.bypass.reason} />
                <Detail
                  label="Acknowledged By"
                  value={person(o.bypass.acknowledgedBy)}
                />
                <Detail
                  label="Acknowledged Role"
                  value={o.bypass.acknowledgedRole}
                />
                <Detail
                  label="Acknowledgement Remark"
                  value={o.bypass.acknowledgementRemark}
                />
                <Detail
                  label="Acknowledged At"
                  value={fmt(o.bypass.acknowledgedAt)}
                />
              </Section>

              <Section title="QR & Security Gate Verification">
                <Detail
                  label="QR Generated"
                  value={o.qr.generated ? "YES" : "NO"}
                />
                <Detail label="QR Generated At" value={fmt(o.qr.generatedAt)} />
                <Detail label="Valid From" value={fmt(o.qr.validFrom)} />
                <Detail label="Expires At" value={fmt(o.qr.expiresAt)} />
                <Detail
                  label="EXIT Verified"
                  value={o.security.exitVerified ? "YES" : "NO"}
                />
                <Detail
                  label="EXIT At"
                  value={fmt(o.security.exitVerifiedAt)}
                />
                <Detail
                  label="EXIT Guard"
                  value={person(o.security.exitGuard)}
                />
                <Detail
                  label="EXIT Guard ID"
                  value={o.security.exitGuard?.id}
                />
                <Detail
                  label="ENTRY Verified"
                  value={o.security.entryVerified ? "YES" : "NO"}
                />
                <Detail
                  label="ENTRY At"
                  value={fmt(o.security.entryVerifiedAt)}
                />
                <Detail
                  label="ENTRY Guard"
                  value={person(o.security.entryGuard)}
                />
                <Detail
                  label="ENTRY Guard ID"
                  value={o.security.entryGuard?.id}
                />
                <Detail label="Gate At Scan" value="Not Recorded in Outpass" />
              </Section>

              <section className="rounded-2xl border border-[#283a51] bg-[#091629] p-5">
                <h3 className="font-black text-amber-300">
                  Faculty Assignment History
                </h3>

                {o.assignmentHistory.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">
                    No reassignment history recorded.
                  </p>
                ) : (
                  o.assignmentHistory.map((h, index) => (
                    <div
                      key={index}
                      className="mt-3 border-l-2 border-amber-400/30 pl-4"
                    >
                      <p className="text-sm font-bold text-white">
                        {show(h.fromRole)} → {show(h.toRole)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {fmt(h.transferredAt)} · {h.reason}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        From {person(h.fromFaculty)} to {person(h.toFaculty)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{h.remarks}</p>
                    </div>
                  ))
                )}
              </section>

              <section className="rounded-2xl border border-[#283a51] bg-[#091629] p-5">
                <h3 className="font-black text-amber-300">
                  Complete Outpass Timeline
                </h3>

                {o.timeline.length === 0 ? (
                  <p className="mt-3 text-sm text-slate-400">
                    No timeline events recorded.
                  </p>
                ) : (
                  o.timeline.map((t, index) => (
                    <div
                      key={index}
                      className="mt-4 border-l-2 border-emerald-400/30 pl-4"
                    >
                      <p className="text-sm font-bold text-white">{t.title}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {fmt(t.performedAt)} · {person(t.performedBy)}
                      </p>
                      <p className="mt-1 text-xs leading-6 text-slate-300">
                        {t.description}
                      </p>
                    </div>
                  ))
                )}
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AllOutpasses() {
  const [filters, setFilters] = useState(initialFilters);
  const [searchInput, setSearchInput] = useState("");
  const [options, setOptions] = useState({
    statuses: [],
    authorityRoles: [],
    institutes: [],
    programs: [],
  });

  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  useEffect(() => {
    let active = true;

    superAdminService
      .getOutpassFilters()
      .then((result) => {
        if (active) setOptions(result);
      })
      .catch(() => {
        // Filters remain optional; list can still load.
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((current) => ({
        ...current,
        search: searchInput.trim(),
      }));
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await superAdminService.getOutpasses({
          ...filters,
          page,
          limit: PAGE_SIZE,
        });

        if (active) setData(result);
      } catch (err) {
        if (active) {
          setData(null);
          setError(getError(err));
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [filters, page, refreshKey]);

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === "academicInstitute" ? { academicProgram: "" } : {}),
    }));

    setPage(1);
  };

  const openDetails = async (id) => {
    setSelected(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const result = await superAdminService.getOutpassDetails(id);
      setSelected(result);
    } catch (err) {
      setDetailError(getError(err));
    } finally {
      setDetailLoading(false);
    }
  };

  const reportQuery = new URLSearchParams(
    Object.entries(filters).filter(([, value]) => value),
  ).toString();

  const summary = data?.summary || emptySummary;
  const pagination = data?.pagination;
  const records = data?.outpasses || [];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-amber-400/20 bg-gradient-to-r from-[#11233d] to-[#153b2f] p-6 sm:p-8">
        <p className="text-xs font-black uppercase tracking-widest text-amber-300">
          AMIOUT Enterprise · Super Admin
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white sm:text-3xl">
              Outpass Command Center
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              University-wide requests, parent consent, faculty approvals and
              Security EXIT/ENTRY audit.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-300"
            >
              <RefreshCw size={18} />
              Refresh
            </button>

            <Link
              to={`/super-admin/reports${reportQuery ? `?${reportQuery}` : ""}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-black text-[#091629]"
            >
              <FileDown size={19} />
              Download Reports
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        <Metric
          label="Total Requests"
          value={summary?.total}
          icon={Users}
          color="text-amber-300"
        />
        <Metric
          label="Currently Outside"
          value={summary?.outside}
          icon={LogOut}
          color="text-blue-300"
        />
        <Metric
          label="Returned"
          value={summary?.returned}
          icon={CheckCircle2}
          color="text-emerald-300"
        />
        <Metric
          label="Pending Approval"
          value={summary?.pending}
          icon={Clock3}
          color="text-amber-300"
        />
        <Metric
          label="Parent Pending"
          value={summary?.parentPending}
          icon={ShieldAlert}
          color="text-orange-300"
        />
        <Metric
          label="Bypass Recorded"
          value={summary?.bypassUsed}
          icon={ShieldCheck}
          color="text-violet-300"
        />
      </div>

      <section className="rounded-3xl border border-[#283a51] bg-[#112138] p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-black text-white">
          <Search size={19} className="text-amber-300" />
          Search & Filters
        </h2>

        <input
          type="search"
          placeholder="Search outpass number, student, enrollment or destination"
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="mt-5 w-full rounded-xl border border-[#33465e] bg-[#091629] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SelectFilter
            label="Outpass Status"
            value={filters.status}
            options={options.statuses || []}
            onChange={(v) => updateFilter("status", v)}
          />
          <SelectFilter
            label="Parent Consent"
            value={filters.parentStatus}
            options={["PENDING", "APPROVED", "REJECTED"]}
            onChange={(v) => updateFilter("parentStatus", v)}
          />
          <SelectFilter
            label="Faculty Role"
            value={filters.approvalRole}
            options={options.authorityRoles || []}
            onChange={(v) => updateFilter("approvalRole", v)}
          />
          <SelectFilter
            label="Bypass Used"
            value={filters.bypass}
            options={[
              { value: "YES", label: "Yes" },
              { value: "NO", label: "No" },
            ]}
            onChange={(v) => updateFilter("bypass", v)}
          />
          <SelectFilter
            label="Institute"
            value={filters.academicInstitute}
            options={options.institutes || []}
            onChange={(v) => updateFilter("academicInstitute", v)}
          />
          <SelectFilter
            label="Program"
            value={filters.academicProgram}
            options={options.programs || []}
            onChange={(v) => updateFilter("academicProgram", v)}
          />
          <label>
            <span className="mb-2 block text-xs text-slate-400">
              Out Date From
            </span>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => updateFilter("from", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-3 py-3 text-sm text-white"
            />
          </label>
          <label>
            <span className="mb-2 block text-xs text-slate-400">
              Out Date To
            </span>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => updateFilter("to", e.target.value)}
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-3 py-3 text-sm text-white"
            />
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <input
              type="checkbox"
              checked={filters.pendingBypass === "YES"}
              onChange={(e) => {
                setFilters((current) => ({
                  ...current,
                  pendingBypass: e.target.checked ? "YES" : "",
                  ...(e.target.checked
                    ? { parentStatus: "PENDING", bypass: "YES" }
                    : {}),
                }));
                setPage(1);
              }}
              className="accent-amber-400"
            />
            Only Parent Pending + Bypass Recorded
          </label>

          <button
            type="button"
            onClick={() => {
              setFilters(initialFilters);
              setSearchInput("");
              setPage(1);
            }}
            className="text-xs font-bold text-amber-300 hover:text-amber-200"
          >
            Clear All Filters
          </button>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Date range filters the requested outpass date in IST. Applied,
          approved, EXIT and ENTRY timestamps are shown separately.
        </p>
      </section>

      <section className="overflow-hidden rounded-3xl border border-[#283a51] bg-[#112138]">
        <div className="flex items-center justify-between border-b border-white/10 p-5">
          <h2 className="font-black text-white">University Outpass Records</h2>
          <span className="text-sm font-bold text-amber-300">
            {pagination?.total ?? "—"} records
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-52 items-center justify-center gap-3 text-slate-400">
            <Loader2 className="animate-spin" />
            Loading outpass records...
          </div>
        ) : error ? (
          <div className="m-5 rounded-xl bg-rose-400/10 p-5 text-sm text-rose-300">
            <AlertTriangle className="mb-3" />
            {error}
          </div>
        ) : records.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            No outpasses match these filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1170px] text-left text-sm">
              <thead className="bg-[#091629] text-xs uppercase text-slate-400">
                <tr>
                  <th className="px-4 py-4">Outpass / Student</th>
                  <th className="px-4 py-4">Applied / Destination</th>
                  <th className="px-4 py-4">Parent</th>
                  <th className="px-4 py-4">Faculty Approval</th>
                  <th className="px-4 py-4">EXIT</th>
                  <th className="px-4 py-4">ENTRY</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Details</th>
                </tr>
              </thead>

              <tbody>
                {records.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-white/5 align-top hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-bold text-amber-300">{o.outpassId}</p>
                      <p className="mt-1 font-semibold text-white">
                        {o.student.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {o.student.enrollmentNumber}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-200">{fmt(o.createdAt)}</p>
                      <p className="mt-1 text-xs text-slate-400">
                        {o.request.destination}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Status value={o.parent.status} />
                      {o.bypass.parentPendingBypass && (
                        <p className="mt-2 text-xs font-bold text-amber-300">
                          Bypass Recorded
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <p className="font-semibold text-white">
                        {person(o.faculty.approvedBy)}
                      </p>
                      <p className="mt-1 text-xs text-amber-300">
                        {show(o.faculty.approvedRole)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {fmt(o.faculty.approvedAt)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-200">
                        {fmt(o.security.exitVerifiedAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {person(o.security.exitGuard)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-slate-200">
                        {fmt(o.security.entryVerifiedAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {person(o.security.entryGuard)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <Status value={o.status} />
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => openDetails(o.id)}
                        className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/20"
                      >
                        View Audit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && pagination && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-5">
            <p className="text-xs text-slate-400">
              Page {pagination.page} of {Math.max(1, pagination.totalPages)}
              {" · "}
              {pagination.total} records
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 rounded-lg border border-[#33465e] px-3 py-2 text-xs text-white disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 rounded-lg border border-[#33465e] px-3 py-2 text-xs text-white disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      {(selected || detailLoading || detailError) && (
        <OutpassDetails
          selected={selected}
          loading={detailLoading}
          error={detailError}
          onClose={() => {
            setSelected(null);
            setDetailError("");
            setDetailLoading(false);
          }}
        />
      )}
    </div>
  );
}
