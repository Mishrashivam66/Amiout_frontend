import { useCallback, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import toast from "react-hot-toast";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { getStudents } from "../services/mentor.service";

import StudentTable from "../components/students/StudentTable";

import api from "../../../services/api";

const getList = (response) => {
  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.students)) {
    return response.data.students;
  }

  return [];
};

export default function Students() {
  const location = useLocation();

  const role = location.pathname.startsWith("/coordinator")
    ? "COORDINATOR"
    : "MENTOR";

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(
    async (showLoader = true) => {
      if (showLoader) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      setError("");

      try {
        let response;

        if (role === "COORDINATOR") {
          const result = await api.get("/coordinator/students");

          response = result.data;
        } else {
          response = await getStudents();
        }

        if (response?.success === false) {
          throw new Error(response.message || "Unable to fetch students.");
        }

        setStudents(getList(response));
      } catch (err) {
        console.error("My Students Error:", err);

        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load students.";

        setStudents([]);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [role],
  );

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            {role === "COORDINATOR"
              ? "Coordinator · Section View"
              : "Mentor · Group View"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Students from authorized university records.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || refreshing}
          onClick={() => fetchStudents(false)}
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <RefreshCw size={18} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <AlertTriangle size={20} className="text-rose-600" />

          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

      <StudentTable students={students} loading={loading} role={role} />
    </div>
  );
}
