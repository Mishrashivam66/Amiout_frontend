import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getOutpasses } from "../services/outpass.service";
import OutpassFilters from "../components/outpasses/OutpassFilters";
import OutpassTable from "../components/outpasses/OutpassTable";
import OutpassDetailsModal from "../components/outpasses/OutpassDetailsModal";

import { toast } from "react-hot-toast";
const Outpasses = () => {
  // ==========================================================
  // State
  // ==========================================================

  const [loading, setLoading] = useState(true);

  const [outpasses, setOutpasses] = useState([]);

  const [pagination, setPagination] = useState({});

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");
  const [selectedOutpass, setSelectedOutpass] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);

  // ==========================================================
  // Fetch
  // ==========================================================

  const loadOutpasses = async () => {
    try {
      setLoading(true);

      const response = await getOutpasses({
        page,
        limit: 10,
        search,
        status,
      });

      setOutpasses(response.data || []);
      setPagination(response.pagination || {});
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load outpasses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOutpasses();
  }, [page, search, status]);

  // ==========================================================

  return (
    <div className="space-y-8">
      {/* ===================================================== */}
      {/* Header */}
      {/* ===================================================== */}

      <div>
        <h1 className="text-4xl font-bold text-white">Outpass Management</h1>

        <p className="mt-2 text-slate-400">
          View, monitor and manage all student outpasses.
        </p>
      </div>

      {/* ===================================================== */}
      {/* Statistics */}
      {/* ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          rounded-3xl
          border
          border-[#223447]
          bg-gradient-to-r
          from-[#0F172A]
          via-[#122131]
          to-[#163525]
          p-8
          shadow-2xl
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">
            Total Outpasses
          </p>

          <h2 className="mt-2 text-5xl font-bold text-white">
            {pagination.total || 0}
          </h2>

          <p className="mt-2 text-green-400">Live Records</p>
        </div>

        <button
          onClick={loadOutpasses}
          className="
            flex
            items-center
            gap-3
            rounded-xl
            bg-green-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-green-700
          "
        >
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      {/* ===================================================== */}
      {/* Filters */}
      {/* ===================================================== */}

      <OutpassFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
      />

      {/* ===================================================== */}
      {/* Table */}
      {/* ===================================================== */}

      <OutpassTable
        loading={loading}
        outpasses={outpasses}
        onView={(item) => {
          setSelectedOutpass(item);
          setOpenDetails(true);
        }}
      />

      {/* ===================================================== */}
      {/* Pagination */}
      {/* ===================================================== */}

      <div
        className="
          flex
          flex-col
          gap-5
          rounded-2xl
          border
          border-[#223447]
          bg-[#111827]
          p-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="text-slate-300">
          Showing Page
          <span className="ml-2 font-bold text-white">{page}</span>
          <span className="mx-2 text-slate-500">/</span>
          <span className="font-bold text-white">
            {pagination.totalPages || 1}
          </span>
        </div>

        <div className="flex gap-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="
              rounded-xl
              bg-slate-700
              px-6
              py-3
              text-white
              transition
              disabled:opacity-40
              hover:bg-slate-600
            "
          >
            Previous
          </button>

          <button
            disabled={page >= (pagination.totalPages || 1)}
            onClick={() => setPage(page + 1)}
            className="
              rounded-xl
              bg-blue-600
              px-6
              py-3
              text-white
              transition
              disabled:opacity-40
              hover:bg-blue-700
            "
          >
            Next
          </button>
        </div>
      </div>
      <OutpassDetailsModal
        open={openDetails}
        outpass={selectedOutpass}
        onClose={() => {
          setOpenDetails(false);
          setSelectedOutpass(null);
        }}
      />
    </div>
  );
};

export default Outpasses;
