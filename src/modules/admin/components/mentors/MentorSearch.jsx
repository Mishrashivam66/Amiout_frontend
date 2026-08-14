import { FaSearch } from "react-icons/fa";

const MentorSearch = ({ value, onChange }) => {
  return (
    <div className="relative w-full">
      <FaSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by mentor, course, group or coordinator..."
        className="
          w-full
          rounded-xl
          border
          border-[#223447]
          bg-[#122131]
          py-3
          pl-12
          pr-4
          text-white
          outline-none
          transition
          focus:border-green-500
        "
      />
    </div>
  );
};

export default MentorSearch;
