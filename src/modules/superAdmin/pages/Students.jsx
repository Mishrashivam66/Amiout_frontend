import { useEffect, useState } from "react";

import { toast } from "sonner";
import {
  // Existing icons...
  Download,
} from "lucide-react";
import {
  AlertTriangle,
  BookOpen,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Loader2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import superAdminService from "../services/superAdmin.service";

// ============================================================
// AMIOUT - SUPER ADMIN STUDENT MONITORING
//
// Read-only university-wide StudentMaster records.
// Search and filtering are performed by MongoDB.
// ============================================================

const PAGE_SIZE = 10;

const initialFilters = {
  search: "",
  institute: "",
  program: "",
  batch: "",
  semester: "",
  section: "",
  isActive: "",
  isRegistered: "",
};

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to fetch student records.";

const display = (value) =>
  value === undefined || value === null || value === "" ? "—" : String(value);

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (!Number.isFinite(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

function Metric({ label, value, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-[#26384e] bg-[#112138] p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-400">{label}</p>

        <div className={`rounded-xl bg-white/5 p-2.5 ${color}`}>
          <Icon size={21} />
        </div>
      </div>

      <h3 className="mt-4 text-3xl font-black text-white">{value ?? "—"}</h3>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = "All",
}) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-xs font-semibold text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-[#33465e] bg-[#091629] px-3 py-3 text-sm text-white outline-none focus:border-amber-400"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={String(option.value)} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-white/5 py-3">
      <p className="text-xs text-slate-500">{label}</p>

      <p className="mt-1 break-words text-sm font-semibold text-white">
        {display(value)}
      </p>
    </div>
  );
}

function StudentDetails({ student, onClose }) {
  if (!student) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-details-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#33465e] bg-[#112138] shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/10 bg-[#0c1c31] p-5 sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-300">
              StudentMaster Record
            </p>

            <h2
              id="student-details-title"
              className="mt-2 text-xl font-black text-white sm:text-2xl"
            >
              {student.name}
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              {student.enrollmentNumber}
            </p>
          </div>

          <button
            type="button"
            aria-label="Close student details"
            onClick={onClose}
            className="rounded-xl border border-white/10 p-2 text-slate-300 hover:bg-white/5"
          >
            <X size={21} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-amber-300">
                <UserRound size={18} />
                Student Identity
              </h3>

              <div className="mt-3">
                <DetailRow label="Full Name" value={student.name} />
                <DetailRow
                  label="Enrollment Number"
                  value={student.enrollmentNumber}
                />
                <DetailRow label="Roll Number" value={student.rollNumber} />
                <DetailRow label="Official Email" value={student.email} />
                <DetailRow label="Mobile Number" value={student.mobileNumber} />
              </div>
            </div>

            <div>
              <h3 className="flex items-center gap-2 text-sm font-black text-amber-300">
                <GraduationCap size={18} />
                Academic Details
              </h3>

              <div className="mt-3">
                <DetailRow label="Institute" value={student.institute?.name} />
                <DetailRow label="Program" value={student.program?.name} />
                <DetailRow label="Batch" value={student.batch} />
                <DetailRow label="Semester" value={student.semester} />
                <DetailRow label="Section" value={student.section} />
                <DetailRow label="Group" value={student.group} />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-amber-400/15 bg-[#091629] p-5">
            <h3 className="flex items-center gap-2 text-sm font-black text-amber-300">
              <UserCheck size={18} />
              Student–Mentor Mapping
            </h3>

            <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
              <DetailRow
                label="Mentor Group"
                value={student.mentorGroup?.name}
              />
              <DetailRow
                label="Primary Mentor"
                value={student.primaryMentor?.name}
              />
              <DetailRow
                label="Mentor Email"
                value={student.primaryMentor?.email}
              />
              <DetailRow
                label="Mapping Status"
                value={student.primaryMentor ? "Mapped" : "Not Mapped"}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
            <DetailRow
              label="Account Status"
              value={student.isActive ? "Active" : "Inactive"}
            />
            <DetailRow
              label="Registration Status"
              value={student.isRegistered ? "Registered" : "Not Registered"}
            />
            <DetailRow
              label="Imported / Created"
              value={formatDate(student.createdAt)}
            />
            <DetailRow
              label="Last Updated"
              value={formatDate(student.updatedAt)}
            />
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Read-only monitoring. Changes to student records must use authorized
            management workflows.
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Students() {
  const [filters, setFilters] = useState(initialFilters);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    institutes: [],
    programs: [],
    semesters: [],
    sections: [],
    batches: [],
  });

  const [loading, setLoading] = useState(true);
  const [filtersError, setFiltersError] = useState("");
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // ==========================================================
  // LOAD REAL FILTER OPTIONS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadFilterOptions = async () => {
      try {
        const data = await superAdminService.getStudentFilters();

        if (!mounted) return;

        setFilterOptions({
          institutes: data.institutes || [],
          programs: data.programs || [],
          semesters: data.semesters || [],
          sections: data.sections || [],
          batches: data.batches || [],
        });

        setFiltersError("");
      } catch (err) {
        if (!mounted) return;

        setFiltersError(getError(err));
      }
    };

    void loadFilterOptions();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  // ==========================================================
  // DEBOUNCE SEARCH
  // ==========================================================

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilters((current) => ({
        ...current,
        search: searchValue.trim(),
      }));

      setPage(1);
    }, 350);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  // ==========================================================
  // FETCH SERVER-SIDE PAGINATED STUDENTS
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadStudents = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await superAdminService.getStudents({
          page,
          limit: PAGE_SIZE,
          search: filters.search || undefined,
          institute: filters.institute || undefined,
          program: filters.program || undefined,
          batch: filters.batch || undefined,
          semester: filters.semester || undefined,
          section: filters.section || undefined,
          isActive: filters.isActive || undefined,
          isRegistered: filters.isRegistered || undefined,
        });

        if (!mounted) return;

        if (
          !Array.isArray(data.students) ||
          !data.pagination ||
          !data.statistics
        ) {
          throw new Error("Student API returned an invalid response.");
        }

        setStudents(data.students);
        setStatistics(data.statistics);
        setPagination(data.pagination);
      } catch (err) {
        if (!mounted) return;

        setError(getError(err));
        setStudents([]);
        setStatistics(null);
        setPagination(null);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadStudents();

    return () => {
      mounted = false;
    };
  }, [
    page,
    refreshKey,
    filters.search,
    filters.institute,
    filters.program,
    filters.batch,
    filters.semester,
    filters.section,
    filters.isActive,
    filters.isRegistered,
  ]);

  // ==========================================================
  // UPDATE FILTER
  // ==========================================================

  const updateFilter = (key, value) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));

    setPage(1);
  };

  const resetFilters = () => {
    setSearchValue("");
    setFilters(initialFilters);
    setPage(1);
  };

  const refresh = () => {
    setRefreshKey((value) => value + 1);

    toast.success("Refreshing student records", {
      duration: 1000,
    });
  };

  // ==========================================================
  // NORMALIZED SELECT OPTIONS
  // ==========================================================

  const instituteOptions = filterOptions.institutes;
  const programOptions = filterOptions.programs;

  const semesterOptions = filterOptions.semesters.map((value) => ({
    value: String(value),
    label: `Semester ${value}`,
  }));

  const sectionOptions = filterOptions.sections.map((value) => ({
    value,
    label: `Section ${value}`,
  }));

  const batchOptions = filterOptions.batches.map((value) => ({
    value,
    label: value,
  }));

  const handleDownloadExcel = async () => {
    if (downloadingExcel) return;

    setDownloadingExcel(true);

    try {
      // Pass the exact filters selected on the Students page.
      // No page or limit here: backend exports all matches.
      const currentFilters = {
        search: searchValue.trim(),
        institute: filters.institute || undefined,
        program: filters.program || undefined,
        batch: filters.batch || undefined,
        semester: filters.semester || undefined,
        section: filters.section || undefined,
        group: filters.group || undefined,
        isActive: filters.isActive || undefined,
        isRegistered: filters.isRegistered || undefined,
      };

      await superAdminService.downloadStudentsExcel(currentFilters);

      toast.success("Student Excel downloaded", {
        duration: 1000,
      });
    } catch (error) {
      let message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to download student Excel.";

      // Axios may return backend errors as Blob.
      const errorBlob = error?.response?.data;

      if (errorBlob instanceof Blob) {
        try {
          const body = JSON.parse(await errorBlob.text());

          message = body?.message || message;
        } catch {
          // Preserve original message.
        }
      }

      toast.error(message, {
        duration: 1000,
      });
    } finally {
      setDownloadingExcel(false);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}

      {/* ============================================================
    UNIVERSITY STUDENTS - PAGE HEADER
    REFRESH + FILTERED EXCEL DOWNLOAD
============================================================ */}

      <section className="relative overflow-hidden rounded-3xl border border-amber-400/15 bg-gradient-to-r from-[#102138] to-[#17392f] p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          {/* LEFT SIDE - HEADING */}

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">
              AMIOUT Enterprise · Super Admin
            </p>

            <h1 className="mt-3 flex items-center gap-3 text-2xl font-black text-white sm:text-3xl">
              <GraduationCap size={30} className="text-amber-300" />
              University Students
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Monitor imported student records, academic assignments and mentor
              mapping across the university.
            </p>

            <p className="mt-3 text-xs text-emerald-300">
              Excel export includes all students matching the selected filters,
              not just the current page.
            </p>
          </div>

          {/* RIGHT SIDE - ACTION BUTTONS */}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* REFRESH DATA */}

            <button
              type="button"
              onClick={refresh}
              disabled={loading || downloadingExcel}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-5 py-3 text-sm font-bold text-amber-300 transition-all duration-300 hover:border-amber-400/50 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Refresh Data
            </button>

            {/* DOWNLOAD FILTERED STUDENTS EXCEL */}

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={downloadingExcel || loading || Boolean(error)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-black text-white shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadingExcel ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}

              {downloadingExcel ? "Generating Excel..." : "Download Excel"}
            </button>
          </div>
        </div>
      </section>

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <Metric
          label="Students"
          value={statistics?.total}
          icon={Users}
          color="text-amber-300"
        />
        <Metric
          label="Active"
          value={statistics?.active}
          icon={CheckCircle2}
          color="text-emerald-300"
        />
        <Metric
          label="Inactive"
          value={statistics?.inactive}
          icon={AlertTriangle}
          color="text-rose-300"
        />
        <Metric
          label="Registered"
          value={statistics?.registered}
          icon={ClipboardList}
          color="text-cyan-300"
        />
        <Metric
          label="Mentor Mapped"
          value={statistics?.mapped}
          icon={UserCheck}
          color="text-violet-300"
        />
      </div>

      {/* FILTERS */}

      <section className="overflow-hidden rounded-3xl border border-[#26384e] bg-[#112138]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <SlidersHorizontal size={20} className="text-amber-300" />
              Student Search & Filters
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Filters apply to all StudentMaster records, not just the current
              page.
            </p>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/5"
          >
            Clear Filters
          </button>
        </div>

        <div className="space-y-5 p-5 sm:p-6">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Search name, enrollment, roll number or email"
              className="w-full rounded-xl border border-[#33465e] bg-[#091629] py-3.5 pl-12 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
            />
          </div>

          {filtersError && (
            <p className="flex items-start gap-2 text-xs leading-6 text-amber-300">
              <AlertTriangle size={16} className="mt-1 shrink-0" />
              Filter options unavailable: {filtersError}
            </p>
          )}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <FilterSelect
              label="Institute"
              value={filters.institute}
              options={instituteOptions}
              onChange={(value) => updateFilter("institute", value)}
              placeholder="All Institutes"
            />

            <FilterSelect
              label="Program"
              value={filters.program}
              options={programOptions}
              onChange={(value) => updateFilter("program", value)}
              placeholder="All Programs"
            />

            <FilterSelect
              label="Batch"
              value={filters.batch}
              options={batchOptions}
              onChange={(value) => updateFilter("batch", value)}
              placeholder="All Batches"
            />

            <FilterSelect
              label="Semester"
              value={filters.semester}
              options={semesterOptions}
              onChange={(value) => updateFilter("semester", value)}
              placeholder="All Semesters"
            />

            <FilterSelect
              label="Section"
              value={filters.section}
              options={sectionOptions}
              onChange={(value) => updateFilter("section", value)}
              placeholder="All Sections"
            />

            <FilterSelect
              label="Account Status"
              value={filters.isActive}
              onChange={(value) => updateFilter("isActive", value)}
              options={[
                { label: "Active", value: "TRUE" },
                { label: "Inactive", value: "FALSE" },
              ]}
              placeholder="All Statuses"
            />

            <FilterSelect
              label="Registration"
              value={filters.isRegistered}
              onChange={(value) => updateFilter("isRegistered", value)}
              options={[
                { label: "Registered", value: "TRUE" },
                { label: "Not Registered", value: "FALSE" },
              ]}
              placeholder="All Registration"
            />
          </div>
        </div>
      </section>

      {/* STUDENT TABLE */}

      <section className="overflow-hidden rounded-3xl border border-[#26384e] bg-[#112138]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5 sm:p-6">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-black text-white">
              <BookOpen size={21} className="text-amber-300" />
              Student Records
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Read-only · Real MongoDB data
            </p>
          </div>

          <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300">
            {pagination?.total ?? "—"} records
          </span>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-slate-400">
            <Loader2 size={23} className="animate-spin text-amber-400" />
            Loading students...
          </div>
        ) : error ? (
          <div className="m-5 rounded-xl border border-rose-400/20 bg-rose-400/10 p-5">
            <div className="flex items-center gap-2 text-rose-300">
              <AlertTriangle size={20} />
              <p className="font-bold">Unable to load students</p>
            </div>

            <p className="mt-2 break-words text-sm text-rose-200">{error}</p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-5 text-center">
            <Users size={40} className="text-slate-600" />

            <h3 className="mt-4 font-bold text-white">
              No student records found
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Try adjusting the search or academic filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left">
              <thead className="bg-[#091629]">
                <tr className="text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Academic Details</th>
                  <th className="px-5 py-4">Mentor</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t border-white/5 text-sm transition hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-4">
                      <p className="font-bold text-white">{student.name}</p>

                      <p className="mt-1 font-mono text-xs text-amber-300">
                        {student.enrollmentNumber}
                      </p>

                      <p className="mt-1 max-w-56 truncate text-xs text-slate-500">
                        {display(student.email)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="flex items-center gap-2 text-slate-200">
                        <Building2 size={14} className="text-amber-300" />
                        {display(student.institute?.name)}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {display(student.program?.name)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Sem {display(student.semester)}
                        {" · "}Section {display(student.section)}
                        {" · "}Group {display(student.group)}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-200">
                        {display(student.primaryMentor?.name)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {student.primaryMentor ? "Mapped" : "Not Mapped"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                          student.isActive
                            ? "bg-emerald-400/10 text-emerald-300"
                            : "bg-rose-400/10 text-rose-300"
                        }`}
                      >
                        {student.isActive ? "Active" : "Inactive"}
                      </span>

                      <p className="mt-2 text-xs text-slate-500">
                        {student.isRegistered ? "Registered" : "Not Registered"}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudent(student)}
                        className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/20"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SERVER PAGINATION */}

        {!loading && !error && pagination && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 p-5 sm:flex-row">
            <p className="text-xs text-slate-400">
              Showing{" "}
              {pagination.total === 0
                ? 0
                : (pagination.page - 1) * pagination.limit + 1}
              {"–"}
              {Math.min(pagination.page * pagination.limit, pagination.total)}
              {" of "}
              {pagination.total} records
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((value) => Math.max(1, value - 1))}
                className="inline-flex items-center gap-1 rounded-xl border border-[#33465e] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <span className="text-xs font-semibold text-white">
                Page {pagination.page} / {Math.max(1, pagination.totalPages)}
              </span>

              <button
                type="button"
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((value) => value + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-[#33465e] px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}
      </section>

      <StudentDetails
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
      />
    </div>
  );
}
