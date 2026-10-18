import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaInfoCircle,
  FaClipboardList,
} from "react-icons/fa";

// ============================================================
// HELPERS
// ============================================================

const clean = (value) => String(value ?? "").trim();

const normalizeErrors = (errors = []) => {
  if (!Array.isArray(errors)) {
    return [];
  }

  return errors.map((item, index) => ({
    id: index,

    row: item?.row ?? item?.rowNumber ?? "—",

    field: item?.field ?? "Record",

    value: item?.value ?? item?.facultyId ?? "",

    message: item?.message ?? item?.reason ?? "Validation failed.",
  }));
};

// ============================================================
// COMPONENT
// ============================================================

const ValidationTable = ({ validationErrors = [], summary = {} }) => {
  const errors = normalizeErrors(validationErrors);

  const total = Number(summary?.total) || 0;

  const hasResults = total > 0;

  const hasErrors = errors.length > 0;

  const affectedRows = new Set(
    errors.map((item) => String(item.row)).filter((value) => value !== "—"),
  ).size;

  // ==========================================================
  // INITIAL STATE
  // ==========================================================

  if (!hasResults && !hasErrors) {
    return (
      <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
            <FaClipboardList className="text-2xl text-blue-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Import Validation
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              Import results and row validation errors will appear here after
              processing a file.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // NO VALIDATION ERRORS
  // ==========================================================

  if (!hasErrors) {
    return (
      <section className="rounded-3xl border border-green-500/20 bg-[#122131] p-5 sm:p-8">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
            <FaCheckCircle className="text-2xl text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              No Row Validation Errors
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              The import response did not report any row-level validation
              errors.
            </p>

            <p className="mt-3 text-xs leading-5 text-slate-500">
              Check the Import Summary for duplicate records, import status and
              any other processing failures.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================================
  // VALIDATION ERRORS UI
  // ==========================================================

  return (
    <section className="rounded-3xl border border-red-500/20 bg-[#122131] p-5 sm:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col flex-wrap items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
            <FaExclamationTriangle className="text-2xl text-red-400" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white sm:text-2xl">
              Import Validation Errors
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Review the failed rows and correct the relevant Excel values.
            </p>
          </div>
        </div>

        <span className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">
          {errors.length} Error(s)
        </span>
      </div>

      {/* ERROR SUMMARY */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#223447] bg-[#0F172A] p-4">
          <p className="text-sm text-slate-400">Total Errors</p>

          <p className="mt-2 text-2xl font-bold text-red-400">
            {errors.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#223447] bg-[#0F172A] p-4">
          <p className="text-sm text-slate-400">Rows With Reported Errors</p>

          <p className="mt-2 text-2xl font-bold text-orange-400">
            {affectedRows}
          </p>
        </div>
      </div>

      {/* ERROR TABLE */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-full text-left">
          <thead className="bg-[#0F172A]">
            <tr>
              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase text-slate-400">
                Row
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase text-slate-400">
                Field
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase text-slate-400">
                Value / ID
              </th>

              <th className="px-5 py-4 text-xs font-semibold uppercase text-slate-400">
                Error Description
              </th>

              <th className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase text-slate-400">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {errors.map((item) => (
              <tr
                key={item.id}
                className="border-t border-[#223447] transition-colors hover:bg-[#1A2A3D]"
              >
                <td className="px-5 py-4 text-sm font-semibold text-white">
                  {item.row}
                </td>

                <td className="px-5 py-4 text-sm text-slate-300">
                  {clean(item.field) || "Record"}
                </td>

                <td className="max-w-[220px] break-words px-5 py-4 text-sm text-slate-400">
                  {clean(item.value) || "—"}
                </td>

                <td className="min-w-[230px] max-w-[500px] px-5 py-4 text-sm leading-6 text-red-300">
                  {item.message}
                </td>

                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400">
                    <FaTimesCircle />
                    Failed
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* GUIDANCE */}

      <div className="mt-6 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5">
        <div className="flex items-start gap-3">
          <FaInfoCircle className="mt-1 shrink-0 text-yellow-400" />

          <div>
            <h3 className="font-semibold text-yellow-300">
              How to fix these records
            </h3>

            <p className="mt-2 text-sm leading-6 text-yellow-100/80">
              Check the row numbers and correct the indicated Excel fields. Only
              re-import corrected or authorized records after reviewing the
              import results. Records successfully saved during a partial import
              do not need to be recreated.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValidationTable;
