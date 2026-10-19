import { useCallback, useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";

import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Eye,
  GraduationCap,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
} from "lucide-react";

import api from "../../../services/api";

const PAGE_SIZE = 10;

const getError = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Unable to load institute students.";

const show = (value) =>
  value === null || value === undefined || value === "" ? "—" : String(value);

function Detail({ title, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500">{title}</p>

      <p className="mt-2 break-words text-sm font-bold text-slate-900">
        {show(value)}
      </p>
    </div>
  );
}

export default function InstituteStudents() {
  const requestIdRef = useRef(0);

  const [students, setStudents] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [institutes, setInstitutes] = useState([]);

  const [totalStudents, setTotalStudents] = useState(0);
  const [pagination, setPagination] = useState({});

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [semester, setSemester] = useState("ALL");
  const [program, setProgram] = useState("ALL");
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [selected, setSelected] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // ==========================================================
  // DEBOUNCED SEARCH
  // ==========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // ==========================================================
  // LOAD INSTITUTE STUDENTS
  // ==========================================================

  const loadStudents = useCallback(
    async ({ silent = false, notify = false } = {}) => {
      const requestId = ++requestIdRef.current;

      if (silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const response = await api.get("/hoi/students", {
          params: {
            page,
            limit: PAGE_SIZE,
            ...(debouncedSearch ? { search: debouncedSearch } : {}),
            ...(semester !== "ALL" ? { semester } : {}),
            ...(program !== "ALL" ? { program } : {}),
          },
        });

        if (requestId !== requestIdRef.current) return;

        const payload = response.data;

        if (
          payload?.success === false ||
          !Array.isArray(payload?.data?.students)
        ) {
          throw new Error(
            payload?.message || "Invalid student directory response.",
          );
        }

        setStudents(payload.data.students);
        setPrograms(payload.data.programs || []);
        setInstitutes(payload.data.institutes || []);
        setTotalStudents(Number(payload.data.totalStudents) || 0);
        setPagination(payload.pagination || {});

        if (notify) {
          toast.success("Students refreshed", {
            duration: 1000,
          });
        }
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        setStudents([]);
        setError(getError(err));

        if (notify) {
          toast.error(getError(err), {
            duration: 1000,
          });
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [page, debouncedSearch, semester, program],
  );

  useEffect(() => {
    void loadStudents();

    return () => {
      requestIdRef.current += 1;
    };
  }, [loadStudents]);

  // ==========================================================
  // STUDENT DETAILS
  // ==========================================================

  const openStudent = async (studentId) => {
    if (!studentId || detailsLoading) return;

    setDetailsLoading(true);

    try {
      const response = await api.get(
        `/hoi/students/${encodeURIComponent(studentId)}`,
      );

      if (response.data?.success === false || !response.data?.data) {
        throw new Error(response.data?.message || "Student not found.");
      }

      setSelected(response.data.data);
    } catch (err) {
      toast.error(getError(err), {
        duration: 1000,
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  const totalPages = Math.max(1, Number(pagination.totalPages) || 1);

  return (
    <div className="space-y-6 pb-8">
      {/* HERO */}

      <section className="relative overflow-hidden rounded-[28px] bg-[#091b31] p-6 text-white shadow-xl sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-xs font-bold text-amber-300">
              <ShieldCheck size={15} />
              HOI · INSTITUTE ACCESS
            </p>

            <h1 className="mt-6 flex items-center gap-3 text-2xl font-black sm:text-3xl">
              <GraduationCap className="text-amber-400" size={31} />
              Institute Students
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-300">
              Academic directory of students across your authorized institute,
              programs, sections and groups.
            </p>
          </div>

          <button
            type="button"
            disabled={loading || refreshing}
            onClick={() =>
              void loadStudents({
                silent: true,
                notify: true,
              })
            }
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

      {/* SUMMARY */}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-blue-50 p-3 text-blue-700">
            <Users size={24} />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Total Active Institute Students
          </p>

          <h2 className="mt-2 text-4xl font-black text-[#091b31]">
            {loading ? "..." : totalStudents}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            {institutes.map((item) => item.code).join(", ") ||
              "Authorized institute"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 inline-flex rounded-xl bg-amber-50 p-3 text-amber-700">
            <BookOpen size={24} />
          </div>

          <p className="text-sm font-semibold text-slate-500">
            Matching Students
          </p>

          <h2 className="mt-2 text-4xl font-black text-[#091b31]">
            {loading ? "..." : Number(pagination.total) || 0}
          </h2>

          <p className="mt-2 text-xs text-slate-400">
            Search and program filters applied
          </p>
        </div>
      </div>

      {/* DIRECTORY */}

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 xl:flex-row xl:items-center">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              Institute Student Directory
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Read-only academic monitoring
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-slate-400"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, enrollment, email..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-amber-400 sm:w-56"
              />
            </div>

            <select
              aria-label="Program filter"
              value={program}
              onChange={(event) => {
                setProgram(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold"
            >
              <option value="ALL">All Programs</option>
              {programs.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.code}
                </option>
              ))}
            </select>

            <select
              aria-label="Semester filter"
              value={semester}
              onChange={(event) => {
                setSemester(event.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold"
            >
              <option value="ALL">All Semesters</option>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((number) => (
                <option key={number} value={number}>
                  Semester {number}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="m-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {/* DESKTOP TABLE */}

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[900px] text-left">
            <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">Student</th>
                <th className="px-5 py-4">Enrollment</th>
                <th className="px-5 py-4">Program</th>
                <th className="px-5 py-4">Academic Group</th>
                <th className="px-5 py-4">Mentor</th>
                <th className="px-5 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!loading &&
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-amber-50/30">
                    <td className="px-5 py-4">
                      <p className="text-sm font-extrabold text-slate-900">
                        {show(student.name)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {show(student.email)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-700">
                      {show(student.enrollmentNumber)}
                    </td>
                    <td className="px-5 py-4 text-xs font-bold text-slate-700">
                      {show(student.program?.code)}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-700">
                      Sem {show(student.semester)}
                      <p className="mt-1 text-slate-500">
                        {show(student.section)} / {show(student.group)}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-xs font-semibold text-slate-700">
                      {show(student.primaryMentor?.name)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => void openStudent(student._id)}
                        disabled={detailsLoading}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#091b31] px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-700 disabled:opacity-50"
                      >
                        <Eye size={16} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}

        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:hidden">
          {!loading &&
            students.map((student) => (
              <article
                key={student._id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <p className="text-sm font-extrabold text-slate-900">
                  {show(student.name)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {show(student.enrollmentNumber)}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <p>Program: {show(student.program?.code)}</p>
                  <p>Semester: {show(student.semester)}</p>
                  <p>
                    Section / Group: {show(student.section)} /{" "}
                    {show(student.group)}
                  </p>
                  <p>Mentor: {show(student.primaryMentor?.name)}</p>
                </div>

                <button
                  type="button"
                  onClick={() => void openStudent(student._id)}
                  disabled={detailsLoading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#091b31] py-3 text-xs font-bold text-white"
                >
                  <Eye size={16} />
                  View Details
                </button>
              </article>
            ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-3 py-14 text-sm text-slate-500">
            <Loader2 size={20} className="animate-spin" />
            Loading institute students...
          </div>
        )}

        {!loading && !error && students.length === 0 && (
          <div className="py-14 text-center text-sm text-slate-500">
            No students match the current filters.
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-4">
          <p className="text-xs text-slate-500">
            {pagination.total ?? 0} matching students
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page <= 1 || loading}
              onClick={() => setPage((v) => Math.max(1, v - 1))}
              className="rounded-xl border border-slate-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-xs font-bold">
              {page} / {totalPages}
            </span>

            <button
              type="button"
              aria-label="Next page"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((v) => v + 1)}
              className="rounded-xl border border-slate-200 bg-white p-2 disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* STUDENT DETAILS MODAL */}

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
            aria-labelledby="hoi-student-heading"
            className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[#091b31] p-6 text-white">
              <div>
                <p className="text-xs font-bold text-amber-300">
                  HOI · STUDENT RECORD
                </p>
                <h2
                  id="hoi-student-heading"
                  className="mt-1 text-xl font-black"
                >
                  Student Details
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close student details"
                onClick={() => setSelected(null)}
                className="rounded-xl p-2 hover:bg-white/10"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-xl bg-amber-50 p-5">
                <div className="flex items-center gap-3">
                  <UserRound className="text-amber-600" />
                  <div>
                    <p className="text-lg font-black text-slate-900">
                      {show(selected.name)}
                    </p>
                    <p className="text-xs text-slate-600">
                      {show(selected.enrollmentNumber)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Detail title="Roll Number" value={selected.rollNumber} />
                <Detail title="Official Email" value={selected.email} />
                <Detail title="Mobile Number" value={selected.mobileNumber} />
                <Detail title="Institute" value={selected.institute?.name} />
                <Detail
                  title="Program"
                  value={selected.program?.name || selected.program?.code}
                />
                <Detail
                  title="Department"
                  value={selected.program?.department}
                />
                <Detail title="Batch" value={selected.batch} />
                <Detail title="Semester" value={selected.semester} />
                <Detail title="Section" value={selected.section} />
                <Detail title="Group" value={selected.group} />
                <Detail
                  title="Primary Mentor"
                  value={selected.primaryMentor?.name}
                />
                <Detail
                  title="Backup Mentor"
                  value={selected.backupMentor?.name}
                />
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
