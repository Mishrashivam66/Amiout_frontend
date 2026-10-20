import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "react-hot-toast";

import { Loader2, Plus, RefreshCw } from "lucide-react";

import { getMentors } from "../../services/mentor.service";

import MentorTable from "../../components/mentors/MentorTable";
import MentorSearch from "../../components/mentors/MentorSearch";
import MentorFilter from "../../components/mentors/MentorFilter";
import MentorPagination from "../../components/mentors/MentorPagination";
import AddMentorModal from "../../components/mentors/AddMentorModal";
import EditMentorModal from "../../components/mentors/EditMentorModal";
import DeleteMentorModal from "../../components/mentors/DeleteMentorModal";

// ==========================================
// HELPERS
// ==========================================

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Unable to load mentors.";

const normalizeMentors = (response) => {
  const payload = response?.data ?? response;

  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.mentors)) {
    return payload.mentors;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  if (Array.isArray(payload?.data?.mentors)) {
    return payload.data.mentors;
  }

  return [];
};

const getSearchText = (value) => {
  if (value == null) return "";

  if (typeof value === "string") {
    return value.toLowerCase();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object") {
    return String(
      value.name || value.fullName || value.email || "",
    ).toLowerCase();
  }

  return "";
};

// ==========================================
// MENTOR MANAGEMENT PAGE
// ==========================================

const MentorList = () => {
  // ========================================
  // DATA STATES
  // ========================================

  const [mentors, setMentors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [semester, setSemester] = useState("");

  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // ========================================
  // MODAL STATES
  // ========================================

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMentor, setSelectedMentor] = useState(null);

  // ========================================
  // REQUEST MANAGEMENT
  // ========================================

  const mountedRef = useRef(false);
  const requestIdRef = useRef(0);

  // ========================================
  // LOAD MENTORS
  // ========================================

  const loadMentors = useCallback(async ({ silent = false } = {}) => {
    const requestId = ++requestIdRef.current;

    try {
      if (mountedRef.current) {
        if (silent) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
      }

      const response = await getMentors();

      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      const mentorRecords = normalizeMentors(response);

      setMentors(mentorRecords);

      if (silent) {
        toast.success("Mentor list refreshed.", {
          duration: 2000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (!mountedRef.current || requestId !== requestIdRef.current) {
        return;
      }

      toast.error(getErrorMessage(error), {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      if (mountedRef.current && requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  // ========================================
  // INITIAL DATA FETCH
  // ========================================

  useEffect(() => {
    mountedRef.current = true;

    // Schedule fetch after effect setup.
    // This avoids synchronous setState in the effect.
    const startRequest = Promise.resolve().then(() => {
      if (mountedRef.current) {
        loadMentors();
      }
    });

    void startRequest;

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, [loadMentors]);

  // ========================================
  // FILTER MENTORS
  // ========================================

  const filteredMentors = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return mentors.filter((mentor) => {
      const matchesSearch =
        !searchTerm ||
        [mentor.name, mentor.course, mentor.group, mentor.coordinator].some(
          (value) => getSearchText(value).includes(searchTerm),
        );

      const matchesSemester =
        semester === "" || Number(mentor.semester) === Number(semester);

      const matchesStatus =
        status === "" ||
        (status === "ACTIVE" && mentor.isActive) ||
        (status === "INACTIVE" && !mentor.isActive);

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [mentors, search, semester, status]);

  // ========================================
  // PAGINATION
  // ========================================

  const safeRowsPerPage = Math.max(1, Number(rowsPerPage) || 10);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMentors.length / safeRowsPerPage),
  );

  // Keep page number valid after data changes.
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const currentData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * safeRowsPerPage;

    return filteredMentors.slice(startIndex, startIndex + safeRowsPerPage);
  }, [filteredMentors, safeCurrentPage, safeRowsPerPage]);

  // ========================================
  // FILTER HANDLERS
  // ========================================

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSemesterChange = (value) => {
    setSemester(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  // ========================================
  // MODAL HANDLERS
  // ========================================

  const handleEditMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowEditModal(true);
  };

  const handleDeleteMentor = (mentor) => {
    setSelectedMentor(mentor);
    setShowDeleteModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedMentor(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedMentor(null);
  };

  // ========================================
  // REFRESH HANDLER
  // ========================================

  const handleRefresh = () => {
    return loadMentors({ silent: true });
  };

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="space-y-6">
      {/* =====================================
          HEADER
      ====================================== */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mentor Management</h1>

          <p className="mt-2 text-slate-400">
            View and manage imported mentors.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />

            {refreshing ? "Refreshing..." : "Refresh"}
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <Plus size={18} />
            Add Mentor
          </button>
        </div>
      </div>

      {/* =====================================
          SEARCH
      ====================================== */}

      <MentorSearch value={search} onChange={handleSearchChange} />

      {/* =====================================
          FILTERS
      ====================================== */}

      <MentorFilter
        semester={semester}
        setSemester={handleSemesterChange}
        status={status}
        setStatus={handleStatusChange}
      />

      {/* =====================================
          TABLE
      ====================================== */}

      {loading ? (
        <div
          role="status"
          className="flex min-h-[250px] flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-slate-900/50"
        >
          <Loader2 size={32} className="animate-spin text-cyan-400" />

          <p className="text-sm text-slate-400">Loading mentors...</p>
        </div>
      ) : (
        <div className="relative">
          {refreshing && (
            <div className="pointer-events-none absolute right-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs text-cyan-300 shadow-lg">
              <Loader2 size={14} className="animate-spin" />
              Updating list...
            </div>
          )}

          <MentorTable
            mentors={currentData}
            onRefresh={handleRefresh}
            onEdit={handleEditMentor}
            onDelete={handleDeleteMentor}
          />
        </div>
      )}

      {/* =====================================
          PAGINATION
      ====================================== */}

      <MentorPagination
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        totalRecords={filteredMentors.length}
        rowsPerPage={safeRowsPerPage}
        setRowsPerPage={handleRowsPerPageChange}
        onPageChange={setCurrentPage}
      />

      {/* =====================================
          ADD MENTOR MODAL
      ====================================== */}

      <AddMentorModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleRefresh}
      />

      {/* =====================================
          EDIT MENTOR MODAL
      ====================================== */}

      <EditMentorModal
        open={showEditModal}
        mentorId={selectedMentor?._id}
        onClose={closeEditModal}
        onSuccess={handleRefresh}
      />

      {/* =====================================
          DELETE MENTOR MODAL
      ====================================== */}

      <DeleteMentorModal
        open={showDeleteModal}
        mentorId={selectedMentor?._id}
        mentorName={selectedMentor?.name}
        onClose={closeDeleteModal}
        onSuccess={handleRefresh}
      />
    </div>
  );
};

export default MentorList;
