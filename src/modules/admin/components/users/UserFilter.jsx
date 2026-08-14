"use client";

const UserFilter = ({ semester, setSemester, status, setStatus }) => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* Semester Filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Semester
        </label>

        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full rounded-xl border border-[#223447] bg-[#122131] px-4 py-3 text-white outline-none transition-all focus:border-green-500"
        >
          <option value="">All Semesters</option>

          {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-300">
          Status
        </label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full rounded-xl border border-[#223447] bg-[#122131] px-4 py-3 text-white outline-none transition-all focus:border-green-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>
    </div>
  );
};

export default UserFilter;
