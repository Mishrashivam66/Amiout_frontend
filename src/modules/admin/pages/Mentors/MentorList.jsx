import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

import { getMentors } from "../../services/mentor.service";

import MentorTable from "../../components/mentors/MentorTable";
import MentorSearch from "../../components/mentors/MentorSearch";
import MentorFilter from "../../components/mentors/MentorFilter";
import MentorPagination from "../../components/mentors/MentorPagination";
import AddMentorModal from "../../components/mentors/AddMentorModal";
import EditMentorModal from "../../components/mentors/EditMentorModal";
import DeleteMentorModal from "../../components/mentors/DeleteMentorModal";

const MentorList = () => {
  const [mentors, setMentors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [semester, setSemester] = useState("");

  const [status, setStatus] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedMentor, setSelectedMentor] = useState(null);

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      setLoading(true);

      const response = await getMentors();

      setMentors(response.data || []);
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Unable to load mentors.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMentors = useMemo(() => {
    return mentors.filter((mentor) => {
      const matchesSearch =
        mentor.name?.toLowerCase().includes(search.toLowerCase()) ||
        mentor.course?.toLowerCase().includes(search.toLowerCase()) ||
        mentor.group?.toLowerCase().includes(search.toLowerCase()) ||
        mentor.coordinator?.toLowerCase().includes(search.toLowerCase());

      const matchesSemester =
        semester === "" || Number(mentor.semester) === Number(semester);

      const matchesStatus =
        status === "" ||
        (status === "ACTIVE" && mentor.isActive) ||
        (status === "INACTIVE" && !mentor.isActive);

      return matchesSearch && matchesSemester && matchesStatus;
    });
  }, [mentors, search, semester, status]);

  const totalPages = Math.ceil(filteredMentors.length / rowsPerPage);

  const currentData = filteredMentors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, semester, status, rowsPerPage]);

  if (loading) {
    return (
      <div className="p-10 text-center text-white">Loading mentors...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Mentor Management</h1>

          <p className="mt-2 text-slate-400">
            View and manage imported mentors.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          + Add Mentor
        </button>
      </div>

      {/* ====================================================== */}
      {/* Search */}
      {/* ====================================================== */}

      <MentorSearch value={search} onChange={setSearch} />

      {/* ====================================================== */}
      {/* Filters */}
      {/* ====================================================== */}

      <MentorFilter
        semester={semester}
        setSemester={setSemester}
        status={status}
        setStatus={setStatus}
      />

      {/* ====================================================== */}
      {/* Table */}
      {/* ====================================================== */}

      <MentorTable
        mentors={currentData}
        onRefresh={loadMentors}
        onEdit={(mentor) => {
          setSelectedMentor(mentor);
          setShowEditModal(true);
        }}
        onDelete={(mentor) => {
          setSelectedMentor(mentor);
          setShowDeleteModal(true);
        }}
      />

      {/* ====================================================== */}
      {/* Pagination */}
      {/* ====================================================== */}

      <MentorPagination
        currentPage={currentPage}
        totalPages={totalPages || 1}
        totalRecords={filteredMentors.length}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* ====================================================== */}
      {/* Add Mentor Modal */}
      {/* ====================================================== */}

      <AddMentorModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadMentors}
      />

      {/* ====================================================== */}
      {/* Edit Mentor Modal */}
      {/* ====================================================== */}

      <EditMentorModal
        open={showEditModal}
        mentorId={selectedMentor?._id}
        onClose={() => {
          setShowEditModal(false);
          setSelectedMentor(null);
        }}
        onSuccess={loadMentors}
      />

      {/* ====================================================== */}
      {/* Delete Mentor Modal */}
      {/* ====================================================== */}

      <DeleteMentorModal
        open={showDeleteModal}
        mentorId={selectedMentor?._id}
        mentorName={selectedMentor?.name}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedMentor(null);
        }}
        onSuccess={loadMentors}
      />
    </div>
  );
};

export default MentorList;
