const MentorPagination = ({
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  setRowsPerPage,
  onPageChange,
}) => {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-2xl
        border
        border-[#223447]
        bg-[#122131]
        p-5
        md:flex-row
        md:items-center
        md:justify-between
      "
    >
      {/* ====================================================== */}
      {/* Total Records */}
      {/* ====================================================== */}

      <div className="text-sm text-slate-300">
        Total Mentors :
        <span className="ml-2 font-semibold text-green-400">
          {totalRecords}
        </span>
      </div>

      {/* ====================================================== */}
      {/* Rows Per Page */}
      {/* ====================================================== */}

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-300">Rows Per Page</span>

        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="
            rounded-lg
            border
            border-[#223447]
            bg-[#081018]
            px-3
            py-2
            text-white
            outline-none
          "
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      {/* ====================================================== */}
      {/* Pagination */}
      {/* ====================================================== */}

      <div className="flex items-center gap-3">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="
            rounded-lg
            bg-slate-700
            px-4
            py-2
            text-white
            transition
            hover:bg-slate-600
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Previous
        </button>

        <span className="text-white">
          Page <span className="font-bold text-green-400">{currentPage}</span>{" "}
          of <span className="font-bold">{totalPages}</span>
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="
            rounded-lg
            bg-green-600
            px-4
            py-2
            text-white
            transition
            hover:bg-green-700
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MentorPagination;
