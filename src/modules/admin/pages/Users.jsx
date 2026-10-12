import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { getStudentMasterRecords } from "../services/studentMaster.service";

import UserTable from "../components/users/UserTable";
import UserSearch from "../components/users/UserSearch";
import UserFilter from "../components/users/UserFilter";
import UserPagination from "../components/users/UserPagination";

const normalizeStudent = (student) => {
  const rawStatus = String(student.status ?? "").toUpperCase();

  return {
    ...student,

    _id: student._id,

    name: student.name || student.studentName || student.fullName || "",

    email: student.email || student.studentEmail || student.officialEmail || "",

    enrollmentNo:
      student.enrollmentNo ||
      student.enrollmentNumber ||
      student.enrollment ||
      "",

    semester: student.semester ?? "",

    isActive:
      typeof student.isActive === "boolean"
        ? student.isActive
        : rawStatus === "ACTIVE",
  };
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ======================================
  // FETCH STUDENT MASTER RECORDS
  // ======================================

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getStudentMasterRecords();

      const payload = response.data;

      const records = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : Array.isArray(payload?.data?.students)
            ? payload.data.students
            : Array.isArray(payload?.students)
              ? payload.students
              : [];

      setUsers(records.map(normalizeStudent));
    } catch (error) {
      console.error("Student Master fetch error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load Student Master records.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // ======================================
  // SEARCH AND FILTER
  // ======================================

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        String(user.name ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.email ?? "")
          .toLowerCase()
          .includes(keyword) ||
        String(user.enrollmentNo ?? "")
          .toLowerCase()
          .includes(keyword);

      const matchesSemester =
        semester === "" || Number(user.semester) === Number(semester);

      const matchesStatus =
        status === "" ||
        (status === "ACTIVE" && user.isActive) ||
        (status === "INACTIVE" && !user.isActive);

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [users, search, semester, status]);

  // ======================================
  // PAGINATION
  // ======================================

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const currentData = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, semester, status, rowsPerPage]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center text-lg text-slate-300">
        Loading students...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div>
        <h1 className="text-3xl font-bold text-white">Student Management</h1>

        <p className="mt-2 text-slate-400">
          View all students imported into Student Master.
        </p>
      </div>

      {/* SEARCH */}

      <UserSearch value={search} onChange={setSearch} />

      {/* FILTERS */}

      <UserFilter
        semester={semester}
        setSemester={setSemester}
        status={status}
        setStatus={setStatus}
      />

      {/* TABLE */}

      <UserTable users={currentData} loading={loading} refresh={loadUsers} />

      {/* PAGINATION */}

      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        totalRecords={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Users;
