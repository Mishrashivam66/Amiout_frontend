import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Eye,
  GraduationCap,
  Hash,
  Loader2,
  Mail,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import api from "../../../services/api";

const PAGE_SIZE = 10;
const TOAST_DURATION = 1000;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load department students.";

const display = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

const mentorName = (mentor) => mentor?.name || "Not mapped";

function InfoField({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-white p-2.5 text-amber-600 shadow-sm">
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-xs text-slate-500">{label}</p>

          <p className="mt-1 break-words text-sm font-bold text-slate-900">
            {display(value)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentStudents() {
  const versionRef = useRef(0);

  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);

  const [departments, setDepartments] = useState([]);

  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [semester, setSemester] = useState("ALL");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detailsLoadingId, setDetailsLoadingId] = useState(null);

  // ==========================================================
  // SEARCH DEBOUNCE
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setSearchQuery(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================================
  // FETCH AUTHORIZED STUDENTS
  // ==========================================================

  const loadStudents = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      const currentVersion = ++versionRef.current;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await api.get("/hod/students", {
          params: {
            page,
            limit: PAGE_SIZE,
            ...(searchQuery ? { search: searchQuery } : {}),
            ...(semester !== "ALL" ? { semester } : {}),
          },
        });

        if (currentVersion !== versionRef.current) {
          return;
        }

        const payload = response.data;

        if (payload?.success === false) {
          throw new Error(
            payload.message || "Unable to fetch department students.",
          );
        }

        const data = payload?.data;

        if (!Array.isArray(data?.students)) {
          throw new Error("Invalid student list response.");
        }

        setStudents(data.students);

        setTotalStudents(Number(data.totalStudents) || 0);

        setDepartments(Array.isArray(data.departments) ? data.departments : []);

        setPagination(payload.pagination || {});

        if (notify) {
          toast.success("Students refreshed", {
            duration: TOAST_DURATION,
            id: "hod-student-refresh",
          });
        }
      } catch (err) {
        if (currentVersion !== versionRef.current) {
          return;
        }

        const message = getError(err);

        setStudents([]);
        setTotalStudents(0);
        setPagination({});
        setError(message);

        if (notify) {
          toast.error(message, {
            duration: TOAST_DURATION,
            id: "hod-student-refresh",
          });
        }
      } finally {
        if (currentVersion === versionRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, searchQuery, semester],
  );

  useEffect(() => {
    void loadStudents();

    return () => {
      versionRef.current += 1;
    };
  }, [loadStudents]);

  // ==========================================================
  // VIEW STUDENT DETAILS
  // ==========================================================

  const openDetails = async (studentId) => {
    if (!studentId || detailsLoadingId) return;

    setDetailsLoadingId(studentId);

    try {
      const response = await api.get(
        `/hod/students/${encodeURIComponent(studentId)}`,
      );

      if (response.data?.success === false) {
        throw new Error(
          response.data.message || "Unable to load student details.",
        );
      }

      if (!response.data?.data) {
        throw new Error("Student details not found.");
      }

      setSelected(response.data.data);
    } catch (err) {
      toast.error(getError(err), {
        duration: TOAST_DURATION,
      });
    } finally {
      setDetailsLoadingId(null);
    }
  };

  const totalPages = Math.max(1, Number(pagination.totalPages) || 1);

  return (
    <div className="space-y-6 pb-8">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-400/10 px-3 py-2 text-xs font-bold text-amber-300">
              <GraduationCap size={16} />
              AMIOUT · HOD DEPARTMENT
            </span>

            <div className="mt-6 flex items-center gap-4">
              <div className="rounded-2xl bg-amber-400 p-3 text-slate-950">
                <Users size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-black sm:text-3xl">
                  Department Students
                </h1>

                <p className="mt-1 text-xs font-semibold text-amber-300">
                  Authorized Student Directory
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              View all active students in your assigned department, including
              academic details, semester, group and Mentor mapping.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              void loadStudents({
                silent: true,
                notify: true,
              })
            }
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-amber-400 px-5 py-3 text-sm font-extrabold text-[#091b31] hover:bg-amber-300 disabled:opacity-50"
          >
            {refreshing ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <RefreshCw size={18} />
            )}
            Refresh Students
          </button>
        </div>
      </section>

      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Users size={23} />
            </div>
            <ShieldCheck size={19} className="text-emerald-500" />
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-500">
            Total Active Department Students
          </p>

          <h2 className="mt-1 text-4xl font-black text-slate-950">
            {loading ? "..." : totalStudents}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Across all mapped batches and semesters
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
            <ClipboardList size={23} />
          </div>

          <p className="mt-5 text-sm font-semibold text-slate-500">
            Matching Search Results
          </p>

          <h2 className="mt-1 text-4xl font-black text-slate-950">
            {loading ? "..." : Number(pagination.total) || 0}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Based on the active search and filters
          </p>
        </div>
      </div>

      {/* ======================================================
          STUDENT DIRECTORY
      ====================================================== */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
            <div>
              <h2 className="text-lg font-black text-slate-950">
                Student Directory
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {departments.join(", ") || "Authorized department"}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3.5 top-3 text-slate-400"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Name, enrollment, roll, email..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-amber-400 sm:w-72"
                />
              </div>

              <select
                value={semester}
                onChange={(event) => {
                  setSemester(event.target.value);
                  setPage(1);
                }}
                aria-label="Filter by semester"
                className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-amber-400"
              >
                <option value="ALL">All Semesters</option>

                {Array.from({ length: 12 }, (_, index) => index + 1).map(
                  (value) => (
                    <option key={value} value={value}>
                      Semester {value}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* DESKTOP TABLE */}
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Enrollment / Roll</th>
                <th className="px-5 py-4">Program</th>
                <th className="px-5 py-4">Semester / Group</th>
                <th className="px-5 py-4">Mentor</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {!loading &&
                !error &&
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-amber-50/30">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <UserRound size={20} />
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-extrabold text-slate-900">
                            {display(student.name)}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {display(student.email)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-bold text-slate-800">
                        {display(student.enrollmentNumber)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Roll: {display(student.rollNumber)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                      {display(student.program?.code)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-900">
                        Sem {display(student.semester)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {display(student.section)} / {display(student.group)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                      {mentorName(student.primaryMentor)}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void openDetails(student._id)}
                        disabled={detailsLoadingId !== null}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#091b31] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50"
                      >
                        {detailsLoadingId === student._id ? (
                          <Loader2 size={15} className="animate-spin" />
                        ) : (
                          <Eye size={15} />
                        )}
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE / TABLET CARDS */}
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
          {!loading &&
            !error &&
            students.map((student) => (
              <article
                key={student._id}
                className="rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                    <UserRound size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">
                      {display(student.name)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {display(student.enrollmentNumber)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs">
                  <p>
                    <strong>Program:</strong> {display(student.program?.code)}
                  </p>
                  <p>
                    <strong>Semester:</strong> {display(student.semester)}
                  </p>
                  <p>
                    <strong>Section / Group:</strong> {display(student.section)}{" "}
                    / {display(student.group)}
                  </p>
                  <p>
                    <strong>Mentor:</strong> {mentorName(student.primaryMentor)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => void openDetails(student._id)}
                  disabled={detailsLoadingId !== null}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#091b31] px-4 py-3 text-xs font-bold text-white disabled:opacity-50"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </article>
            ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 p-14 text-slate-500">
            <Loader2 size={21} className="animate-spin" />
            Loading department students...
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="px-6 py-16 text-center">
            <Users size={38} className="mx-auto text-slate-300" />
            <h3 className="mt-4 font-extrabold text-slate-900">
              No Matching Students
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              No active students match your current filters.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-xs text-slate-500">
            Page {page} · {pagination.total ?? 0} matching students
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous page"
              disabled={loading || page <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-xs font-bold text-slate-700">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={loading || page >= totalPages}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* ======================================================
          STUDENT DETAILS MODAL
      ====================================================== */}

      {selected && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-3 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="hod-student-details-title"
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#091b31] p-5 text-white sm:p-6">
              <div>
                <p className="text-xs font-bold text-amber-300">
                  DEPARTMENT STUDENT
                </p>

                <h2
                  id="hod-student-details-title"
                  className="mt-1 text-xl font-black"
                >
                  Student Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-2xl bg-amber-50 p-5">
                <h3 className="text-lg font-black text-slate-950">
                  {display(selected.name)}
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  {display(selected.enrollmentNumber)}
                </p>

                <span className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 size={15} />
                  Active Student
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoField
                  icon={Hash}
                  label="Roll Number"
                  value={selected.rollNumber}
                />

                <InfoField
                  icon={Mail}
                  label="Student Email"
                  value={selected.email}
                />

                <InfoField
                  icon={Phone}
                  label="Mobile Number"
                  value={selected.mobileNumber}
                />

                <InfoField
                  icon={GraduationCap}
                  label="Institute"
                  value={selected.institute?.name || selected.institute?.code}
                />

                <InfoField
                  icon={BookOpen}
                  label="Program"
                  value={selected.program?.name || selected.program?.code}
                />

                <InfoField
                  icon={CalendarDays}
                  label="Batch"
                  value={selected.batch}
                />

                <InfoField
                  icon={ClipboardList}
                  label="Semester"
                  value={selected.semester}
                />

                <InfoField
                  icon={Users}
                  label="Section / Group"
                  value={`${display(selected.section)} / ${display(selected.group)}`}
                />

                <InfoField
                  icon={UserRound}
                  label="Primary Mentor"
                  value={mentorName(selected.primaryMentor)}
                />

                <InfoField
                  icon={UserRound}
                  label="Backup Mentor"
                  value={mentorName(selected.backupMentor)}
                />
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
