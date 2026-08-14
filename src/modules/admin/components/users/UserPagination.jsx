"use client";

import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UserPagination = ({
  currentPage,
  totalPages,
  totalRecords,
  rowsPerPage,
  setRowsPerPage,
  onPageChange,
}) => {
  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#223447] bg-[#122131] p-5 md:flex-row">
      {/* Total Records */}

      <div className="text-sm text-slate-400">
        Total Students :
        <span className="ml-2 font-semibold text-white">{totalRecords}</span>
      </div>

      {/* Rows Per Page */}

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-400">Rows per page</span>

        <select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(Number(e.target.value))}
          className="rounded-lg border border-[#223447] bg-[#0d1825] px-3 py-2 text-white outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Pagination */}

      <div className="flex items-center gap-4">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg bg-[#223447] p-3 text-white transition hover:bg-[#2e4359] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        <span className="font-medium text-white">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg bg-[#223447] p-3 text-white transition hover:bg-[#2e4359] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default UserPagination;
