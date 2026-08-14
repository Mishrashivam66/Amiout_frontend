"use client";

import { FaSearch } from "react-icons/fa";

const UserSearch = ({ value, onChange }) => {
  return (
    <div className="relative">
      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by Name, Enrollment No or Email..."
        className="w-full rounded-xl border border-[#223447] bg-[#122131] py-3 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none transition-all focus:border-green-500"
      />
    </div>
  );
};

export default UserSearch;
