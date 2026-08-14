import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const ValidationTable = ({ validationErrors = [] }) => {
  if (!validationErrors.length) {
    return (
      <section
        className="
          rounded-3xl
          border
          border-green-500/30
          bg-[#122131]
          p-8
        "
      >
        <div className="flex items-center gap-5">
          <div
            className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-green-500/10
            "
          >
            <FaCheckCircle className="text-3xl text-green-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Validation Passed</h2>

            <p className="mt-2 text-slate-400">
              No validation errors found. Your Excel file is ready to import.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="
        rounded-3xl
        border
        border-red-500/20
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
          items-center
          justify-between
          gap-4
          flex-wrap
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
              bg-red-500/10
            "
          >
            <FaExclamationTriangle className="text-2xl text-red-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Validation Errors</h2>

            <p className="mt-1 text-slate-400">
              Resolve these issues before importing.
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            bg-red-500/10
            px-5
            py-2
            font-semibold
            text-red-400
          "
        >
          {validationErrors.length} Error(s)
        </span>
      </div>

      {/* ====================================================== */}
      {/* Table */}
      {/* ====================================================== */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-full">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Row
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Field
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Error
              </th>

              <th className="px-5 py-4 text-left text-sm text-slate-300">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {validationErrors.map((item, index) => (
              <tr
                key={index}
                className="
                  border-t
                  border-[#223447]
                  hover:bg-[#1A2A3D]
                "
              >
                <td className="px-5 py-4 text-white">{item.row}</td>

                <td className="px-5 py-4 text-slate-300">{item.field}</td>

                <td className="px-5 py-4 text-red-300">{item.message}</td>

                <td className="px-5 py-4">
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
                    Invalid
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================================================== */}
      {/* Footer */}
      {/* ====================================================== */}

      <div
        className="
          mt-6
          rounded-2xl
          border
          border-yellow-500/20
          bg-yellow-500/10
          p-4
        "
      >
        <p className="text-sm text-yellow-300">
          Fix all validation errors before clicking
          <span className="font-semibold"> Import Records</span>.
        </p>
      </div>
    </section>
  );
};

export default ValidationTable;
