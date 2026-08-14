import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { getUsers } from "../services/user.service";

import UserTable from "../components/users/UserTable";
import UserSearch from "../components/users/UserSearch";
import UserFilter from "../components/users/UserFilter";
import UserPagination from "../components/users/UserPagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [semester, setSemester] = useState("");
  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        user.name?.toLowerCase().includes(keyword) ||
        user.email?.toLowerCase().includes(keyword) ||
        user.enrollmentNo?.toLowerCase().includes(keyword);

      const matchesSemester =
        semester === "" || Number(user.semester) === Number(semester);

      const matchesStatus =
        status === "" ||
        (status === "ACTIVE" && user.isActive) ||
        (status === "INACTIVE" && !user.isActive);

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [users, search, semester, status]);

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
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">Student Management</h1>

        <p className="mt-2 text-slate-400">
          View and manage all registered students.
        </p>
      </div>

      {/* Search */}

      <UserSearch value={search} onChange={setSearch} />

      {/* Filters */}

      <UserFilter
        semester={semester}
        setSemester={setSemester}
        status={status}
        setStatus={setStatus}
      />

      {/* Table */}

      <UserTable users={currentData} loading={loading} refresh={loadUsers} />

      {/* Pagination */}

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
