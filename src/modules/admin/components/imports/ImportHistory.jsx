
import {
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaFileImport,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";

const ImportHistory = ({ history = [] }) => {
  return (
    <section
      className="
        rounded-3xl
        border
        border-[#223447]
        bg-[#122131]
        p-8
      "
    >
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-white">Import History</h2>

          <p className="mt-2 text-slate-400">
            View previous Student and Mentor import operations.
          </p>
        </div>

        <div className="relative w-full lg:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

          <input
            type="text"
            placeholder="Search imports..."
            className="
              w-full
              rounded-xl
              border
              border-[#223447]
              bg-[#0F172A]
              py-3
              pl-11
              pr-4
              text-white
              outline-none
              transition
              focus:border-green-500
            "
          />
        </div>
      </div>

      {/* ====================================================== */}
      {/* Table */}
      {/* ====================================================== */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-full">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Type
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Imported By
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Date
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Total
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Success
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Failed
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Duration
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Status
              </th>

              <th className="px-5 py-4 text-center text-sm text-slate-300">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-500">
                  No Import History Available
                </td>
              </tr>
            ) : (
              history.map((item) => (
                <tr
                  key={item._id}
                  className="
                    border-t
                    border-[#223447]
                    transition-all
                    hover:bg-[#1A2A3D]
                  "
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FaFileImport className="text-green-400" />

                      <span className="text-white">{item.type}</span>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-300">{item.admin}</td>

                  <td className="px-5 py-4 text-slate-300">{item.date}</td>

                  <td className="px-5 py-4 text-white">{item.total}</td>

                  <td className="px-5 py-4 text-green-400 font-semibold">
                    {item.success}
                  </td>

                  <td className="px-5 py-4 text-red-400 font-semibold">
                    {item.failed}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <FaClock />

                      {item.duration}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    {item.status === "SUCCESS" ? (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-green-500/10
                          px-3
                          py-1
                          text-sm
                          text-green-400
                        "
                      >
                        <FaCheckCircle />
                        Success
                      </span>
                    ) : (
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          bg-red-500/10
                          px-3
                          py-1
                          text-sm
                          text-red-400
                        "
                      >
                        <FaTimesCircle />
                        Failed
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-center">
                    <button
                      className="
                        rounded-xl
                        bg-blue-500/10
                        p-3
                        text-blue-400
                        transition
                        hover:bg-blue-500/20
                      "
                    >
                      <FaDownload />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ====================================================== */}
      {/* Footer */}
      {/* ====================================================== */}

      <div
        className="
          mt-6
          flex
          flex-col
          gap-3
          text-sm
          text-slate-400
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <span>Import history is stored for auditing and reporting.</span>

        <span>Showing last {history.length} imports</span>
      </div>
    </section>
  );
};

export default ImportHistory;
