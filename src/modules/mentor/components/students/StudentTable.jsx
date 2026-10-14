import { useState } from "react";
import {
  Search,
  Users,
  GraduationCap,
  CheckCircle2,
  Clock3,
  BookOpen,
} from "lucide-react";

import { motion } from "framer-motion";

const display = (value) => {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    return value.name || value.code || "-";
  }

  return String(value);
};

const StudentTable = ({ students = [], loading = false, role = "MENTOR" }) => {
  const [search, setSearch] = useState("");

  const filteredStudents = students.filter((student) => {
    const value = [
      student.name,
      student.enrollmentNumber,
      student.rollNumber,
      student.email,
      student.section,
      student.group,
    ]
      .map((item) => String(item || "").toLowerCase())
      .join(" ");

    return value.includes(search.toLowerCase().trim());
  });

  const registeredCount = students.filter(
    (student) => student.isRegistered === true,
  ).length;

  const roleLabel = role === "COORDINATOR" ? "Coordinator" : "Mentor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
    >
      {/* HEADER */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 px-6 py-8 text-white sm:px-8">
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <GraduationCap size={29} />
            </div>

            <div>
              <h1 className="text-2xl font-extrabold sm:text-3xl">
                My Students
              </h1>

              <p className="mt-2 text-sm text-blue-100">
                Official StudentMaster records
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-xs text-blue-200">Total Students</p>

              <p className="mt-1 text-2xl font-extrabold">{students.length}</p>
            </div>

            <div className="rounded-2xl bg-white/10 px-5 py-3">
              <p className="text-xs text-blue-200">Registered</p>

              <p className="mt-1 text-2xl font-extrabold">{registeredCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-5">
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, enrollment, group..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <span className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-700">
          {roleLabel} View
        </span>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-[960px] w-full text-left">
          <thead>
            <tr className="border-b bg-slate-50">
              {[
                "Student",
                "Enrollment",
                "Roll Number",
                "Program",
                "Semester",
                "Section",
                "Group",
                "Registration",
              ].map((heading) => (
                <th
                  key={heading}
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-600"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  <p className="mt-3 text-sm text-slate-500">
                    Loading students...
                  </p>
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-16 text-center">
                  <Users size={42} className="mx-auto text-slate-300" />

                  <h3 className="mt-4 font-bold text-slate-700">
                    No Students Found
                  </h3>

                  <p className="mt-2 text-sm text-slate-500">
                    No matching students in your authorized academic scope.
                  </p>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student._id || student.enrollmentNumber}
                  className="border-b border-slate-100 transition-colors hover:bg-blue-50/50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 font-bold text-white">
                        {student.name?.charAt(0)?.toUpperCase() || "S"}
                      </div>

                      <div className="min-w-[150px]">
                        <p className="font-bold text-slate-800">
                          {display(student.name)}
                        </p>

                        <p className="mt-1 break-all text-xs text-slate-500">
                          {display(student.email)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-700">
                    {display(student.enrollmentNumber)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {display(student.rollNumber)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <BookOpen size={15} className="text-blue-500" />
                      {display(student.program)}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {display(student.semester)}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {display(student.section)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                      {display(student.group)}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    {student.isRegistered ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={14} />
                        Registered
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700">
                        <Clock3 size={14} />
                        Not Registered
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 px-6 py-4">
        <p className="text-xs text-slate-500">
          Showing {filteredStudents.length} of {students.length} students
        </p>

        <p className="text-xs font-semibold text-slate-500">
          Read-only university records
        </p>
      </div>
    </motion.div>
  );
};

export default StudentTable;
