import { Search, X } from "lucide-react";

const StudentSearch = ({
  value,
  onChange,
  placeholder = "Search by name, enrollment or email...",
}) => {
  return (
    <div className="relative w-full md:w-96">
      {/* Search Icon */}

      <Search
        size={20}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-400
        "
      />

      {/* Input */}

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          h-12
          w-full
          rounded-2xl
          border
          border-slate-200
          bg-white
          pl-12
          pr-12
          text-sm
          shadow-sm
          outline-none
          transition-all
          duration-300
          focus:border-blue-500
          focus:ring-4
          focus:ring-blue-100
        "
      />

      {/* Clear */}

      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            rounded-full
            p-1
            text-slate-400
            transition
            hover:bg-slate-100
            hover:text-red-500
          "
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default StudentSearch;
