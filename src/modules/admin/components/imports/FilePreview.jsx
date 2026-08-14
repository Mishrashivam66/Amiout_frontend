
import { FaCheckCircle, FaTable } from "react-icons/fa";

const FilePreview = ({ activeTab, previewData = [] }) => {
  if (!previewData.length) return null;

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
        <div className="flex items-center gap-4">
          <div
            className="
              flex
              h-14
              w-14
              items-center
              justify-center
              rounded-2xl
              bg-green-500/10
            "
          >
            <FaTable className="text-2xl text-green-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Excel Preview</h2>

            <p className="mt-1 text-slate-400">
              Showing first 10 records before import.
            </p>
          </div>
        </div>

        <div
          className="
            rounded-2xl
            bg-green-500/10
            px-5
            py-3
            text-green-400
            font-semibold
          "
        >
          Total Records : {previewData.length}
        </div>
      </div>

      {/* ====================================================== */}
      {/* Table */}
      {/* ====================================================== */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-full">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="px-5 py-4 text-left text-sm text-slate-300">#</th>

              {activeTab === "students" ? (
                <>
                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Roll No
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Name
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Mentor
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Status
                  </th>
                </>
              ) : (
                <>
                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Employee ID
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Name
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Email
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Department
                  </th>

                  <th className="px-5 py-4 text-left text-sm text-slate-300">
                    Status
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {previewData.slice(0, 10).map((row, index) => (
              <tr
                key={index}
                className="
                  border-t
                  border-[#223447]
                  transition-all
                  hover:bg-[#1A2A3D]
                "
              >
                <td className="px-5 py-4 text-slate-400">{index + 1}</td>

                {activeTab === "students" ? (
                  <>
                    <td className="px-5 py-4 text-white">{row.rollNo}</td>

                    <td className="px-5 py-4 text-white">{row.name}</td>

                    <td className="px-5 py-4 text-slate-300">{row.email}</td>

                    <td className="px-5 py-4 text-slate-300">{row.mentor}</td>

                    <td className="px-5 py-4">
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
                        Ready
                      </span>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-5 py-4 text-white">{row.employeeId}</td>

                    <td className="px-5 py-4 text-white">{row.name}</td>

                    <td className="px-5 py-4 text-slate-300">{row.email}</td>

                    <td className="px-5 py-4 text-slate-300">
                      {row.department}
                    </td>

                    <td className="px-5 py-4">
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
                        Ready
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================== */}
      {/* Footer */}
      {/* ====================================================== */}

      <div className="mt-5 text-sm text-slate-400">
        Only first <span className="font-semibold text-white">10</span> records
        are displayed. Complete data will be validated before import.
      </div>
    </section>
  );
};

export default FilePreview;
