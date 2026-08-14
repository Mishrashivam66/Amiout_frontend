import { Search, Filter, X } from "lucide-react";

const OutpassFilters = ({ search, setSearch, status, setStatus }) => {
  const clearFilters = () => {
    setSearch("");
    setStatus("");
  };

  return (
    <div
      className="
        rounded-3xl
        border
        border-[#223447]
        bg-[#0F172A]
        p-6
        shadow-xl
      "
    >
      {/* Header */}

      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Search & Filters</h2>

          <p className="mt-1 text-sm text-slate-400">
            Find outpasses quickly using filters.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-2 text-cyan-400">
          <Filter size={18} />
          <span className="text-sm font-medium">Smart Filters</span>
        </div>
      </div>

      {/* Filters */}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Search */}

        <div className="relative lg:col-span-2">
          <Search
            size={20}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-500
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email or enrollment..."
            className="
              w-full
              rounded-2xl
              border
              border-[#223447]
              bg-[#081018]
              py-3
              pl-12
              pr-4
              text-white
              placeholder:text-slate-500
              outline-none
              transition-all
              duration-300
              focus:border-cyan-500
              focus:ring-2
              focus:ring-cyan-500/30
            "
          />
        </div>

        {/* Status */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="
            rounded-2xl
            border
            border-[#223447]
            bg-[#081018]
            px-4
            py-3
            text-white
            outline-none
            transition-all
            duration-300
            focus:border-green-500
            focus:ring-2
            focus:ring-green-500/30
          "
        >
          <option value="">All Status</option>
          <option value="PENDING">🟡 Pending</option>
          <option value="APPROVED">🟢 Approved</option>
          <option value="REJECTED">🔴 Rejected</option>
          <option value="CANCELLED">⚫ Cancelled</option>
          <option value="EXITED">🔵 Exited</option>
          <option value="RETURNED">🟣 Returned</option>
        </select>
      </div>

      {/* Bottom */}

      <div className="mt-6 flex flex-col gap-4 border-t border-[#223447] pt-5 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-slate-400">
          Search student details or filter outpasses by current status.
        </div>

        <button
          onClick={clearFilters}
          className="
            flex
            items-center
            gap-2
            rounded-xl
            bg-red-500/10
            px-5
            py-2.5
            text-red-400
            transition
            hover:bg-red-500
            hover:text-white
          "
        >
          <X size={18} />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default OutpassFilters;
