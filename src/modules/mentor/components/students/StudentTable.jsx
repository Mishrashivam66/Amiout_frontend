import { Eye, Unlock, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const StudentTable = ({ students = [], loading, onUnlock }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "LOCKED":
        return "bg-blue-100 text-blue-700";

      case "INCOMPLETE":
        return "bg-amber-100 text-amber-700";

      case "COMPLETED":
        return "bg-emerald-100 text-emerald-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="
        overflow-hidden
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-lg
      "
    >
      {/* Header */}

      {/* ================= Hero Header ================= */}

      <div
        className="
    relative
    overflow-hidden
    rounded-t-3xl
    bg-gradient-to-r
    from-blue-700
    via-indigo-600
    to-purple-700
    px-8
    py-8
    text-white
  "
      >
        {/* Background Glow */}

        <div className="absolute -top-20 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Left */}

          <div>
            <div className="flex items-center gap-4">
              <div
                className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-white/15
            backdrop-blur-xl
            shadow-lg
          "
              >
                <span className="text-3xl">🎓</span>
              </div>

              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  My Students
                </h1>

                <p className="mt-2 text-base text-blue-100">
                  Manage assigned students, unlock profiles and monitor academic
                  activity.
                </p>
              </div>
            </div>

            {/* Mini Stats */}

            <div className="mt-8 flex flex-wrap gap-4">
              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase text-blue-100">
                  Total Students
                </p>

                <h2 className="mt-1 text-3xl font-bold">{students.length}</h2>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase text-blue-100">Locked</p>

                <h2 className="mt-1 text-3xl font-bold">
                  {students.filter((s) => s.profileStatus === "LOCKED").length}
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase text-blue-100">Completed</p>

                <h2 className="mt-1 text-3xl font-bold">
                  {
                    students.filter((s) => s.profileStatus === "COMPLETED")
                      .length
                  }
                </h2>
              </div>

              <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase text-blue-100">Incomplete</p>

                <h2 className="mt-1 text-3xl font-bold">
                  {
                    students.filter((s) => s.profileStatus === "INCOMPLETE")
                      .length
                  }
                </h2>
              </div>
            </div>
          </div>

          {/* Right Summary */}

          <div
            className="
        rounded-3xl
        border
        border-white/20
        bg-white/10
        p-6
        backdrop-blur-xl
        shadow-xl
      "
          >
            <p className="text-sm uppercase tracking-widest text-blue-100">
              Mentor Panel
            </p>

            <h2 className="mt-2 text-6xl font-bold">{students.length}</h2>

            <p className="mt-2 text-blue-100">Assigned Students</p>
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50">
              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Student
              </th>

              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Enrollment
              </th>

              <th className="px-8 py-5 text-left text-sm font-bold uppercase tracking-wider text-slate-600">
                Email
              </th>

              <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wider text-slate-600">
                Group
              </th>

              <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wider text-slate-600">
                Status
              </th>

              <th className="px-8 py-5 text-center text-sm font-bold uppercase tracking-wider text-slate-600">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-100 text-5xl">
                      🎓
                    </div>

                    <h3 className="text-2xl font-bold text-slate-700">
                      No Students Assigned
                    </h3>

                    <p className="mt-2 text-slate-500">
                      Students assigned to you will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <motion.tr
                  key={student._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{
                    backgroundColor: "#eff6ff",
                  }}
                  className="
                    border-b
                    transition-all
                    duration-300
                  "
                >
                  {/* Student */}

                  <td className="px-8 py-5">
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
                          text-lg
                          font-bold
                          text-white
                          shadow-md
                        "
                      >
                        {student.user?.name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-slate-800">
                          {student.user?.name}
                        </h3>

                        <p className="text-sm text-slate-500">
                          Assigned Student
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Enrollment */}

                  <td className="px-8 py-5">
                    <span className="font-medium text-slate-700">
                      {student.user?.enrollmentNo || "-"}
                    </span>
                  </td>

                  {/* Email */}

                  <td className="px-8 py-5">
                    <span className="text-slate-600">
                      {student.user?.email}
                    </span>
                  </td>

                  {/* Group */}

                  <td className="px-8 py-5 text-center">
                    <span
                      className="
                        rounded-full
                        bg-indigo-100
                        px-3
                        py-1
                        text-sm
                        font-semibold
                        text-indigo-700
                      "
                    >
                      {student.group || "N/A"}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="px-8 py-5 text-center">
                    <span
                      className={`
      inline-flex
      items-center
      gap-2
      rounded-full
      px-4
      py-2
      text-xs
      font-semibold
      ${getStatusBadge(student.profileStatus)}
    `}
                    >
                      {student.profileStatus === "LOCKED" && <Lock size={14} />}

                      {student.profileStatus === "COMPLETED" && (
                        <CheckCircle size={14} />
                      )}

                      {student.profileStatus === "INCOMPLETE" && (
                        <AlertCircle size={14} />
                      )}

                      {student.profileStatus}
                    </span>
                  </td>

                  {/* Action */}

                  <td className="px-8 py-5 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        to={`/mentor/students/${student.user?._id}`}
                        className="
        inline-flex
        items-center
        gap-2
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        px-5
        py-2.5
        text-sm
        font-semibold
        text-white
        shadow-md
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-xl
      "
                      >
                        <Eye size={18} />
                        View
                      </Link>

                      {student.profileStatus === "LOCKED" && (
                        <button
                          onClick={() => onUnlock(student.user?._id)}
                          className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gradient-to-r
          from-emerald-600
          to-green-700
          px-5
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-md
          transition-all
          duration-300
          hover:scale-105
          hover:shadow-xl
        "
                        >
                          <Unlock size={18} />
                          Unlock
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          bg-slate-50
          px-8
          py-5
        "
      >
        <p className="text-sm text-slate-500">
          Showing
          <span className="mx-1 font-semibold text-slate-700">
            {students.length}
          </span>
          assigned students
        </p>

        <div className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
          Mentor Panel
        </div>
      </div>
    </motion.div>
  );
};

export default StudentTable;
