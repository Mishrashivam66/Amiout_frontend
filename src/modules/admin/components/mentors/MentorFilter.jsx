import { FaFilter } from "react-icons/fa";

const MentorFilter = ({ semester, setSemester, status, setStatus }) => {
  return (
    <div
      className="
        flex
        flex-wrap
        items-center
        gap-4
        rounded-2xl
        border
        border-[#223447]
        bg-[#122131]
        p-5
      "
    >
      <div className="flex items-center gap-2 text-green-400">
        <FaFilter />
        <span className="font-semibold">Filters</span>
      </div>

      <select
        value={semester}
        onChange={(e) => setSemester(e.target.value)}
        className="
          rounded-lg
          border
          border-[#223447]
          bg-[#081018]
          px-4
          py-2
          text-white
          outline-none
        "
      >
        <option value="">All Semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
        <option value="3">Semester 3</option>
        <option value="4">Semester 4</option>
        <option value="5">Semester 5</option>
        <option value="6">Semester 6</option>
        <option value="7">Semester 7</option>
        <option value="8">Semester 8</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="
          rounded-lg
          border
          border-[#223447]
          bg-[#081018]
          px-4
          py-2
          text-white
          outline-none
        "
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="INACTIVE">Inactive</option>
      </select>
    </div>
  );
};

export default MentorFilter;
