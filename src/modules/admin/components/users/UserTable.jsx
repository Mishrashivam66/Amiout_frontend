"use client";

import { FaUserCheck, FaUserSlash, FaEye } from "react-icons/fa";

import { activateUser, deactivateUser } from "../../services/user.service";
import Swal from "sweetalert2";
const UserTable = ({ users = [], loading = false, refresh }) => {
  const handleToggleStatus = async (user) => {
    const result = await Swal.fire({
      title: user.isActive ? "Deactivate Student?" : "Activate Student?",
      text: user.isActive
        ? "This student will not be able to use the system."
        : "This student will be able to use the system again.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#ef4444",
      background: "#17212b",
      color: "#ffffff",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      if (user.isActive) {
        await deactivateUser(user._id);
      } else {
        await activateUser(user._id);
      }

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: user.isActive
          ? "Student deactivated successfully."
          : "Student activated successfully.",
        timer: 1800,
        showConfirmButton: false,
        background: "#17212b",
        color: "#ffffff",
      });

      refresh();
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error?.response?.data?.message || "Unable to update student status.",
        confirmButtonColor: "#ef4444",
        background: "#17212b",
        color: "#ffffff",
      });
    }
  };
  if (loading) {
    return (
      <div className="rounded-2xl bg-[#132232] p-8 text-center text-slate-300">
        Loading students...
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="rounded-2xl bg-[#132232] p-8 text-center text-slate-300">
        No student records found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#223447] bg-[#132232]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#1b2b3d]">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                #
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Student
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Enrollment
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Roll No
              </th>

              <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                Program
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Semester
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Section
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Batch
              </th>

              <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                Registration
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
            {users.map((user, index) => (
              <tr
                key={user._id}
                className="border-t border-[#223447] hover:bg-[#0d1825]"
              >
                <td className="px-6 py-4 text-white">{index + 1}</td>

                <td className="px-6 py-4">
                  <div>
                    <h4 className="font-semibold text-white">{user.name}</h4>

                    <p className="text-xs text-slate-400">
                      {user.institute?.name || "-"}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4 text-slate-300">
                  {user.enrollmentNo || "-"}
                </td>

                <td className="px-6 py-4 text-slate-300">{user.rollNumber}</td>

                <td className="px-6 py-4 text-slate-300">
                  {user.course || "-"}
                </td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {user.semester}
                </td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {user.section}
                </td>

                <td className="px-6 py-4 text-center text-slate-300">
                  {user.batch}
                </td>

                <td className="px-6 py-4 text-center">
                  {user.isRegistered ? (
                    <span className="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                      Registered
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-400">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 text-center">
                  {user.isVerified ? (
                    <span className="inline-flex rounded-full bg-green-500/20 px-3 py-1 text-sm font-semibold text-green-400">
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-semibold text-yellow-400">
                      Pending
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
                      title="View Student"
                    >
                      <FaEye />
                    </button>

                    <button
                      onClick={() => handleToggleStatus(user)}
                      className={`rounded-lg p-2 text-white transition ${
                        user.isActive
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                      title={
                        user.isActive
                          ? "Deactivate Student"
                          : "Activate Student"
                      }
                    >
                      {user.isActive ? <FaUserSlash /> : <FaUserCheck />}
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

export default UserTable;
