import { useMemo, useState } from "react";

import {
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaEye,
  FaFileImport,
  FaSearch,
  FaTimesCircle,
  FaExclamationTriangle,
  FaHistory,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

// ============================================================
// HELPERS
// ============================================================

const clean = (value) => String(value ?? "").trim();

const safeNumber = (value) => {
  const number = Number(value);

  return Number.isFinite(number) ? Math.max(0, number) : 0;
};

const getImporter = (item) => {
  const importer = item?.importedBy;

  if (importer && typeof importer === "object") {
    return importer.name || importer.email || "Administrator";
  }

  return item?.admin || "Administrator";
};

const getImportType = (type) => {
  const normalized = clean(type).toUpperCase();

  if (normalized === "MENTOR" || normalized === "FACULTY") {
    return "Faculty Import";
  }

  if (normalized === "STUDENT") {
    return "Student Import";
  }

  if (normalized === "GROUP") {
    return "Group Import";
  }

  return normalized || "Unknown Import";
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
};

const formatDuration = (value) => {
  if (value === null || value === undefined) {
    return "—";
  }

  if (typeof value === "number") {
    return `${value.toFixed(2)} sec`;
  }

  const text = clean(value);

  return text || "—";
};

// ============================================================
// STATUS CONFIGURATION
// ============================================================

const STATUS_CONFIG = {
  COMPLETED: {
    label: "Completed",
    icon: FaCheckCircle,
    className: "border-green-500/20 bg-green-500/10 text-green-400",
  },

  SUCCESS: {
    label: "Completed",
    icon: FaCheckCircle,
    className: "border-green-500/20 bg-green-500/10 text-green-400",
  },

  PARTIAL_SUCCESS: {
    label: "Partial Success",
    icon: FaExclamationTriangle,
    className: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  FAILED: {
    label: "Failed",
    icon: FaTimesCircle,
    className: "border-red-500/20 bg-red-500/10 text-red-400",
  },
};

const getStatus = (value) => {
  const status = clean(value).toUpperCase();

  return (
    STATUS_CONFIG[status] || {
      label: status || "Unknown",
      icon: FaClock,
      className: "border-slate-500/20 bg-slate-500/10 text-slate-400",
    }
  );
};

// ============================================================
// CSV HELPERS
// ============================================================

const csvCell = (value) => {
  let text = String(value ?? "");

  // Prevent spreadsheet formula interpretation
  // when opening downloaded CSV files.

  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
};

const exportHistoryCsv = (records) => {
  if (!records.length) return;

  const headers = [
    "Import Type",
    "File Name",
    "Imported By",
    "Date",
    "Total Rows",
    "Validated Rows",
    "Failed Rows",
    "Duplicates",
    "Processing Time",
    "Status",
  ];

  const rows = records.map((item) => [
    getImportType(item.type),
    item.fileName || "",
    getImporter(item),
    formatDate(item.createdAt || item.date),
    safeNumber(item.totalRecords ?? item.total),
    safeNumber(item.importedRecords ?? item.success),
    safeNumber(item.failedRecords ?? item.failed),
    safeNumber(item.duplicateRecords ?? item.duplicates),
    formatDuration(item.processingTime ?? item.duration),
    getStatus(item.status).label,
  ]);

  const csv = [
    headers.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = "AMIOUT_Import_History.csv";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
};

// ============================================================
// ERROR DETAILS
// ============================================================

const ImportDetails = ({ item }) => {
  const errors = Array.isArray(item.validationErrors)
    ? item.validationErrors
    : [];

  const duplicates = Array.isArray(item.duplicates) ? item.duplicates : [];

  return (
    <div className="space-y-5 bg-[#0C1928] p-5 sm:p-6">
      {/* FILE DETAILS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-xs text-slate-500">File Name</p>

          <p className="mt-1 break-all text-sm font-medium text-white">
            {item.fileName || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Import Type</p>

          <p className="mt-1 text-sm font-medium text-white">
            {getImportType(item.type)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Imported By</p>

          <p className="mt-1 text-sm font-medium text-white">
            {getImporter(item)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-500">Import Date</p>

          <p className="mt-1 text-sm font-medium text-white">
            {formatDate(item.createdAt || item.date)}
          </p>
        </div>
      </div>

      {/* VALIDATION ERRORS */}

      <div className="rounded-xl border border-[#223447] bg-[#0F172A] p-4">
        <h4 className="mb-3 flex items-center gap-2 font-semibold text-white">
          <FaExclamationTriangle className="text-amber-400" />
          Validation Errors ({errors.length})
        </h4>

        {errors.length === 0 ? (
          <p className="text-sm text-slate-400">
            No Excel validation errors recorded.
          </p>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {errors.map((error, index) => (
              <div
                key={index}
                className="rounded-lg border border-red-500/10 bg-red-500/5 p-3"
              >
                <p className="text-sm text-red-300">
                  Row {error.row ?? error.rowNumber ?? "—"}
                  {" · "}
                  {error.field || "Record"}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {error.message || error.reason || "Validation error"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DUPLICATE DETAILS */}

      <div className="rounded-xl border border-[#223447] bg-[#0F172A] p-4">
        <h4 className="mb-3 font-semibold text-white">
          Duplicate Records ({duplicates.length})
        </h4>

        {duplicates.length === 0 ? (
          <p className="text-sm text-slate-400">
            No Excel duplicate details recorded.
          </p>
        ) : (
          <div className="max-h-64 space-y-2 overflow-y-auto">
            {duplicates.map((duplicate, index) => (
              <div
                key={index}
                className="rounded-lg border border-amber-500/10 bg-amber-500/5 p-3"
              >
                <p className="text-sm text-amber-300">
                  Row {duplicate.row ?? "—"}
                  {" · "}
                  {duplicate.identifier || "Unknown"}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {duplicate.reason || "Duplicate record"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// IMPORT HISTORY
// ============================================================

const ImportHistory = ({ history = [] }) => {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const records = useMemo(
    () => (Array.isArray(history) ? history : []),
    [history],
  );

  // ==========================================================
  // SEARCH FILTER
  // ==========================================================

  const filteredHistory = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return records;
    }

    return records.filter((item) => {
      const searchableText = [
        item.type,
        getImportType(item.type),
        item.fileName,
        getImporter(item),
        item.importedBy?.email,
        item.status,
        getStatus(item.status).label,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [records, search]);

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
            <FaHistory className="text-2xl text-blue-400" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">Import History</h2>

            <p className="mt-2 text-sm text-slate-400">
              Review Student, Faculty and Group import operations.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* SEARCH */}

          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search imports..."
              aria-label="Search import history"
              className="w-full rounded-xl border border-[#223447] bg-[#0F172A] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-blue-500 sm:w-64"
            />
          </div>

          {/* WORKING CSV EXPORT */}

          <button
            type="button"
            disabled={filteredHistory.length === 0}
            onClick={() => exportHistoryCsv(filteredHistory)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaDownload />
            Export CSV
          </button>
        </div>
      </div>

      {/* COUNTS */}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-lg border border-[#223447] bg-[#0F172A] px-4 py-2 text-xs font-medium text-slate-300">
          {filteredHistory.length} import(s) shown
        </span>

        <span className="text-xs text-slate-500">Dates displayed in IST</span>
      </div>

      {/* HISTORY TABLE */}

      <div className="overflow-x-auto rounded-2xl border border-[#223447]">
        <table className="min-w-full text-left">
          <thead className="bg-[#0F172A]">
            <tr>
              {[
                "Type / File",
                "Imported By",
                "Date",
                "Total",
                "Validated",
                "Failed",
                "Duplicates",
                "Duration",
                "Status",
                "Action",
              ].map((heading) => (
                <th
                  key={heading}
                  className="whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wide text-slate-400"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-16 text-center text-slate-500">
                  {search
                    ? "No matching import records found."
                    : "No Import History Available"}
                </td>
              </tr>
            ) : (
              filteredHistory.map((item, index) => {
                const id = item._id || item.id || `history-${index}`;

                const status = getStatus(item.status);
                const StatusIcon = status.icon;

                const expanded = expandedId === id;

                return (
                  <FragmentRow
                    key={id}
                    item={item}
                    id={id}
                    expanded={expanded}
                    setExpandedId={setExpandedId}
                    status={status}
                    StatusIcon={StatusIcon}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* IMPORTANT HISTORY NOTE */}

      <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <p className="text-xs leading-6 text-slate-300">
          <strong className="text-amber-300">Reporting note:</strong> Current
          import history records Excel validation counts before the database
          import finishes. "Validated" does not necessarily mean that records
          were inserted successfully. Database insertion counts will require a
          backend history update after import completion.
        </p>
      </div>

      {/* FOOTER */}

      <div className="mt-5 flex flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:justify-between">
        <span>Import history is retained for auditing.</span>

        <span>
          Showing {filteredHistory.length} of {records.length} loaded imports
        </span>
      </div>
    </section>
  );
};

// ============================================================
// EXPANDABLE HISTORY ROW
// ============================================================

const FragmentRow = ({
  item,
  id,
  expanded,
  setExpandedId,
  status,
  StatusIcon,
}) => {
  const total = safeNumber(item.totalRecords ?? item.total);

  const validated = safeNumber(item.importedRecords ?? item.success);

  const failed = safeNumber(item.failedRecords ?? item.failed);

  const duplicates = safeNumber(item.duplicateRecords ?? item.duplicates);

  return (
    <>
      <tr className="border-t border-[#223447] transition-colors hover:bg-[#1A2A3D]">
        <td className="min-w-[220px] px-5 py-4">
          <div className="flex items-start gap-3">
            <FaFileImport className="mt-1 shrink-0 text-blue-400" />

            <div className="min-w-0">
              <p className="whitespace-nowrap text-sm font-semibold text-white">
                {getImportType(item.type)}
              </p>

              <p
                className="mt-1 max-w-[230px] truncate text-xs text-slate-500"
                title={item.fileName || ""}
              >
                {item.fileName || "Unknown file"}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-4 text-sm text-slate-300">
          {getImporter(item)}
        </td>

        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-300">
          {formatDate(item.createdAt || item.date)}
        </td>

        <td className="px-5 py-4 text-sm font-semibold text-white">{total}</td>

        <td className="px-5 py-4 text-sm font-semibold text-green-400">
          {validated}
        </td>

        <td className="px-5 py-4 text-sm font-semibold text-red-400">
          {failed}
        </td>

        <td className="px-5 py-4 text-sm font-semibold text-amber-400">
          {duplicates}
        </td>

        <td className="whitespace-nowrap px-5 py-4">
          <span className="inline-flex items-center gap-2 text-sm text-cyan-400">
            <FaClock />
            {formatDuration(item.processingTime ?? item.duration)}
          </span>
        </td>

        <td className="px-5 py-4">
          <span
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${status.className}`}
          >
            <StatusIcon />
            {status.label}
          </span>
        </td>

        <td className="px-5 py-4">
          <button
            type="button"
            aria-expanded={expanded}
            aria-label={`View details for ${getImportType(item.type)}`}
            onClick={() => setExpandedId(expanded ? null : id)}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold text-blue-400 transition hover:bg-blue-500/20"
          >
            <FaEye />
            Details
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr className="border-t border-[#223447]">
          <td colSpan={10} className="p-0">
            <ImportDetails item={item} />
          </td>
        </tr>
      )}
    </>
  );
};

export default ImportHistory;
