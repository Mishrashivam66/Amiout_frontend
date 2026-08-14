"use client";

import { FaEdit, FaTrash, FaUserCheck } from "react-icons/fa";

const MentorTable = ({ mentors = [], loading = false, onEdit, onDelete }) => {
  // ============================================================================
// Loading
// ============================================================================

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#223447] bg-[#122131] p-8 text-center text-slate-300">
        Loading mentors...
      </div>
    );
  }

  // ============================================================================
// Empty
// ============================================================================

  if (!mentors.length) {
    return (
      <div className="rounded-2xl border border-[#223447] bg-[#122131] p-8 text-center text-slate-300">
        No mentor records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#223447] bg-[#122131]">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#1A2C3E]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                #
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Mentor Name
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Course
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Semester
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Group
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Coordinator
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Students
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Status
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {mentors.map((mentor, index) => (
              <tr
                key={mentor._id}
                className="border-t border-[#223447] hover:bg-[#0d1825]"
              >
                <td className="px-6 py-4 text-white">{index + 1}</td>

                <td className="px-6 py-4 font-medium text-white">
                  {mentor.name}
                </td>

                <td className="px-6 py-4 text-slate-300">{mentor.course}</td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {mentor.semester}
                </td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {mentor.group}
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {mentor.coordinator}
                </td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {mentor.totalStudents}
                </td>

                <td className="px-6 py-4 text-center">
                  {mentor.isActive ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                      <FaUserCheck />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-500/20 px-3 py-1 text-sm font-semibold text-red-400">
                      Inactive
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(mentor)}
                      className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                      title="Edit Mentor"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(mentor)}
                      className="rounded-lg bg-red-600 p-2 text-white transition hover:bg-red-700"
                      title="Delete Mentor"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MentorTable;
