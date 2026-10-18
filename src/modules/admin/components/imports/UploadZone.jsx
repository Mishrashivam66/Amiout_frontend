import { useEffect, useRef, useState } from "react";

import {
  FaCloudUploadAlt,
  FaDownload,
  FaFileExcel,
  FaFilePdf,
  FaSpinner,
  FaTimes,
  FaUpload,
  FaUsers,
  FaGraduationCap,
  FaBuilding,
  FaCheckCircle,
} from "react-icons/fa";

import { toast } from "react-hot-toast";

import {
  downloadGroupTemplate,
  downloadMentorTemplate,
  downloadStudentTemplate,
  getImportHistory,
  importGroups,
  importMentors,
  importStudents,
  importStudentsPDF,
} from "../../services/import.service";

// ============================================================
// CONFIGURATION
// ============================================================

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const EMPTY_SUMMARY = {
  total: 0,
  imported: 0,
  updated: 0,
  failed: 0,
  duplicates: 0,
  processingTime: "0 sec",
};

const TAB_CONFIG = {
  students: {
    title: "Student Import",
    description: "Import student academic records using Excel or PDF.",
  },

  mentors: {
    title: "Faculty Import",
    description:
      "Import Mentor, Coordinator, HOD and HOI faculty records using one Excel file.",
  },

  groups: {
    title: "Group Import",
    description: "Import academic groups using an Excel file.",
  },
};

// ============================================================
// HELPERS
// ============================================================

const getExtension = (filename = "") => {
  return filename.split(".").pop()?.toLowerCase();
};

const getFileSize = (size = 0) => {
  if (size >= 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }

  return `${(size / 1024).toFixed(2)} KB`;
};

const asArray = (value) => {
  return Array.isArray(value) ? value : [];
};

const getNumber = (...values) => {
  for (const value of values) {
    if (value !== undefined && value !== null) {
      const number = Number(value);

      if (Number.isFinite(number)) {
        return number;
      }
    }
  }

  return 0;
};

// ============================================================
// NORMALIZE API RESPONSE
// ============================================================

const normalizeImportResult = (response) => {
  // Supports plain response bodies and nested data objects.

  const outer = response?.data?.data ? response.data : response;

  const result = outer?.data ?? outer ?? {};

  const summary = result.summary ?? outer?.summary ?? {};

  const failedMentors = asArray(result.failedMentors);

  const failedStudents = asArray(result.failedStudents);

  const validationErrors = [
    ...asArray(result.validationErrors),
    ...asArray(outer?.validationErrors),

    ...failedMentors.map((item) => ({
      row: item.rowNumber ?? item.row ?? "-",

      field: "Faculty Record",

      value: item.facultyId ?? "",

      message: item.reason ?? "Faculty import failed.",
    })),

    ...failedStudents.map((item) => ({
      row: item.rowNumber ?? item.row ?? "-",

      field: "Student Record",

      value: item.enrollmentNumber ?? item.enrollmentNo ?? "",

      message: item.reason ?? item.message ?? "Student import failed.",
    })),
  ];

  const imported = getNumber(
    summary.importedRecords,
    summary.imported,
    result.imported,
  );

  const updated = getNumber(
    summary.updatedRecords,
    summary.updated,
    result.updated,
  );

  const failed = getNumber(
    summary.failedRecords,
    summary.failed,
    result.failed,
  );

  const duplicates = getNumber(
    summary.duplicateRecords,
    summary.duplicates,
    result.duplicates,
  );

  const total = getNumber(
    summary.totalRecords,
    summary.total,
    summary.totalRows,
    result.totalRows,
    imported + updated + failed + duplicates,
  );

  const rawProcessingTime = result.processingTime ?? outer?.processingTime;

  const processingTime =
    rawProcessingTime !== undefined && rawProcessingTime !== null
      ? `${rawProcessingTime} sec`
      : "0 sec";

  return {
    success: outer?.success !== false && result?.success !== false,

    message: result.message ?? outer?.message ?? "",

    preview: asArray(result.preview ?? outer?.preview),

    validationErrors,

    summary: {
      total,
      imported,
      updated,
      failed,
      duplicates,
      processingTime,
    },
  };
};

// ============================================================
// COMPONENT
// ============================================================

const UploadZone = ({
  activeTab,
  selectedFile,
  setSelectedFile,
  setPreviewData,
  setValidationErrors,
  setSummary,
  setHistory,
}) => {
  // ==========================================================
  // REFS
  // ==========================================================

  const inputRef = useRef(null);

  // ==========================================================
  // STATES
  // ==========================================================

  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  const config = TAB_CONFIG[activeTab] ?? TAB_CONFIG.students;

  const isFacultyTab = activeTab === "mentors";

  const isStudentTab = activeTab === "students";

  const isPDF = getExtension(selectedFile?.name) === "pdf";

  // ==========================================================
  // CLEAR ON TAB CHANGE
  // ==========================================================

  useEffect(() => {
    setSelectedFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setSummary({ ...EMPTY_SUMMARY });

    setDragActive(false);
    setProgress(0);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [
    activeTab,
    setSelectedFile,
    setPreviewData,
    setValidationErrors,
    setSummary,
  ]);

  // ==========================================================
  // VALIDATE FILE
  // ==========================================================

  const validateFile = (file) => {
    if (!file) {
      toast.error("Please select a file.");
      return false;
    }

    const extension = getExtension(file.name);

    const allowedExtensions = isStudentTab
      ? ["xlsx", "xls", "pdf"]
      : ["xlsx", "xls"];

    if (!allowedExtensions.includes(extension)) {
      toast.error(
        isStudentTab
          ? "Only Excel or PDF files are allowed."
          : "Only Excel (.xlsx/.xls) files are allowed.",
      );

      return false;
    }

    if (file.size === 0) {
      toast.error("Selected file is empty.");
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Maximum file size is 10 MB.");

      return false;
    }

    return true;
  };

  // ==========================================================
  // HANDLE SELECTED FILE
  // ==========================================================

  const handleFile = (file) => {
    if (loading) return;

    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    setPreviewData([]);
    setValidationErrors([]);
    setSummary({ ...EMPTY_SUMMARY });

    toast.success("File selected successfully.");
  };

  // ==========================================================
  // BROWSE FILE
  // ==========================================================

  const handleChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    handleFile(file);
  };

  // ==========================================================
  // DRAG AND DROP
  // ==========================================================

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setDragActive(false);

    if (loading) return;

    const file = event.dataTransfer.files?.[0];

    if (!file) return;

    handleFile(file);
  };

  // ==========================================================
  // REMOVE FILE
  // ==========================================================

  const removeFile = () => {
    if (loading) return;

    setSelectedFile(null);
    setPreviewData([]);
    setValidationErrors([]);
    setSummary({ ...EMPTY_SUMMARY });

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    toast.success("File removed.");
  };

  // ==========================================================
  // DOWNLOAD TEMPLATE
  // ==========================================================

  const handleDownloadTemplate = async () => {
    if (loading) return;

    try {
      let response;

      if (activeTab === "students") {
        response = await downloadStudentTemplate();
      } else if (activeTab === "mentors") {
        response = await downloadMentorTemplate();
      } else {
        response = await downloadGroupTemplate();
      }

      const blob = response?.data;

      if (!(blob instanceof Blob)) {
        throw new Error("Invalid template response.");
      }

      // Current backend template endpoints may
      // return JSON placeholders rather than XLSX.

      if (blob.type.includes("json") || blob.type.includes("text/html")) {
        throw new Error(
          "Excel template is not available from the backend yet.",
        );
      }

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `${activeTab}_template.xlsx`;

      document.body.appendChild(link);

      link.click();
      link.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      toast.success("Template downloaded successfully.");
    } catch (error) {
      toast.error(error?.message || "Unable to download template.");
    }
  };

  // ==========================================================
  // REFRESH IMPORT HISTORY
  // ==========================================================

  const refreshHistory = async () => {
    try {
      const response = await getImportHistory();

      const historyData = response?.data?.data ?? response?.data ?? [];

      setHistory(asArray(historyData));
    } catch {
      // Import is already complete.
      // A history refresh failure must not
      // make the import look unsuccessful.
    }
  };

  // ==========================================================
  // START IMPORT
  // ==========================================================

  const handleImport = async () => {
    if (loading) return;

    if (!selectedFile || !validateFile(selectedFile)) {
      return;
    }

    setLoading(true);
    setProgress(10);

    setPreviewData([]);
    setValidationErrors([]);
    setSummary({ ...EMPTY_SUMMARY });

    try {
      let response;

      // ======================================================
      // STUDENT IMPORT
      // ======================================================

      if (activeTab === "students") {
        if (getExtension(selectedFile.name) === "pdf") {
          response = await importStudentsPDF(selectedFile);
        } else {
          response = await importStudents(selectedFile);
        }
      }

      // ======================================================
      // FACULTY IMPORT
      // ======================================================
      else if (activeTab === "mentors") {
        response = await importMentors(selectedFile);
      }

      // ======================================================
      // GROUP IMPORT
      // ======================================================
      else if (activeTab === "groups") {
        response = await importGroups(selectedFile);
      } else {
        throw new Error("Invalid import category.");
      }

      setProgress(60);

      // ======================================================
      // NORMALIZE RESULT
      // ======================================================

      const result = normalizeImportResult(response);

      // ======================================================
      // PREVIEW
      // ======================================================

      setPreviewData(result.preview);

      // ======================================================
      // VALIDATION ERRORS
      // ======================================================

      setValidationErrors(result.validationErrors);

      // ======================================================
      // SUMMARY
      // ======================================================

      setSummary(result.summary);

      setProgress(90);

      // ======================================================
      // IMPORT STATUS
      // ======================================================

      const { imported, updated, duplicates, failed } = result.summary;

      if (result.success && failed === 0) {
        toast.success(
          result.message ||
            `Import completed. ${imported} imported, ${updated} updated, ${duplicates} duplicates.`,
        );
      } else {
        toast.error(
          result.message || `Import completed with ${failed} failed records.`,
        );
      }

      // ======================================================
      // REFRESH HISTORY
      // ======================================================

      await refreshHistory();

      setProgress(100);
    } catch (error) {
      const errorBody = error?.response?.data;

      const errorData = errorBody?.data ?? {};

      const failedRecords = asArray(errorData.failedMentors);

      const apiErrors = [
        ...asArray(errorData.validationErrors),

        ...failedRecords.map((item) => ({
          row: item.rowNumber ?? item.row ?? "-",

          field: "Faculty Record",

          value: item.facultyId ?? "",

          message: item.reason ?? "Faculty import failed.",
        })),
      ];

      setValidationErrors(apiErrors);

      if (errorData.summary) {
        const failedResult = normalizeImportResult(errorBody);

        setSummary(failedResult.summary);

        setPreviewData(failedResult.preview);
      }

      toast.error(
        errorBody?.message ||
          error?.message ||
          "Import failed. Please try again.",
      );
    } finally {
      setLoading(false);

      window.setTimeout(() => {
        setProgress(0);
      }, 800);
    }
  };

  // ==========================================================
  // COMPONENT UI
  // ==========================================================

  return (
    <section className="rounded-3xl border border-[#223447] bg-[#122131] p-5 sm:p-8">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
            {isFacultyTab ? (
              <FaGraduationCap size={22} />
            ) : (
              <FaUsers size={20} />
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{config.title}</h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              {config.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownloadTemplate}
          disabled={loading}
          className="inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaDownload />
          Download Template
        </button>
      </div>

      {/* ======================================================
          FACULTY ROLES
      ====================================================== */}

      {isFacultyTab && (
        <div className="mb-8 rounded-2xl border border-blue-500/20 bg-[#0F172A] p-5">
          <div className="mb-4 flex items-center gap-3">
            <FaCheckCircle className="text-green-400" />

            <h3 className="font-semibold text-white">
              Supported Faculty Roles
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {["MENTOR", "COORDINATOR", "HOD", "HOI"].map((role) => (
              <span
                key={role}
                className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-2 text-xs font-semibold tracking-wide text-blue-300"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[#223447] p-4">
              <p className="text-sm font-semibold text-white">
                Mentor / Coordinator
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                Requires appropriate Program, Semester, Section and Group
                mapping.
              </p>
            </div>

            <div className="rounded-xl border border-[#223447] p-4">
              <p className="text-sm font-semibold text-white">HOD / HOI</p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                HOD requires Institute and Department. HOI requires Institute
                only.
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3">
            <FaBuilding className="mt-1 shrink-0 text-emerald-400" />

            <p className="text-xs leading-5 text-slate-300">
              One Faculty Excel can contain multiple roles. Semester IX and X
              are supported for Law and other applicable programs. Faculty ID
              and official email are required for every record.
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          UPLOAD AREA
      ====================================================== */}

      <div
        role="button"
        tabIndex={loading ? -1 : 0}
        aria-label={`Select file for ${config.title}`}
        onDragEnter={(event) => {
          event.preventDefault();

          if (!loading) {
            setDragActive(true);
          }
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragActive(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={handleDrop}
        onClick={() => {
          if (!loading) {
            inputRef.current?.click();
          }
        }}
        onKeyDown={(event) => {
          if (!loading && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`
          rounded-3xl
          border-2
          border-dashed
          p-8
          text-center
          transition-all
          duration-300
          sm:p-12
          ${loading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${
            dragActive
              ? "border-green-500 bg-green-500/10"
              : "border-[#223447] hover:border-green-500"
          }
        `}
      >
        <FaCloudUploadAlt className="mx-auto text-6xl text-green-400 sm:text-7xl" />

        <h3 className="mt-6 text-xl font-bold text-white sm:text-2xl">
          Drag & Drop File
        </h3>

        <p className="mt-3 text-sm text-slate-400">
          Or click here to browse your computer
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
            .xlsx
          </span>

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
            .xls
          </span>

          {isStudentTab && (
            <span className="rounded-full bg-red-500/10 px-4 py-2 text-sm text-red-400">
              .pdf
            </span>
          )}

          <span className="rounded-full bg-orange-500/10 px-4 py-2 text-sm text-orange-400">
            Max 10 MB
          </span>
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept={isStudentTab ? ".xlsx,.xls,.pdf" : ".xlsx,.xls"}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {/* ======================================================
          UPLOAD PROGRESS
      ====================================================== */}

      {loading && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-white">Processing Import...</span>

            <span className="text-green-400">{progress}%</span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-[#223447]">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-slate-500">
            This progress indicator shows processing stages, not actual bytes
            uploaded.
          </p>
        </div>
      )}

      {/* ======================================================
          SELECTED FILE
      ====================================================== */}

      {selectedFile && (
        <div className="mt-8 rounded-2xl border border-green-500/30 bg-[#0F172A] p-5 sm:p-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-green-500/10">
                {isPDF ? (
                  <FaFilePdf className="text-3xl text-red-400" />
                ) : (
                  <FaFileExcel className="text-3xl text-green-400" />
                )}
              </div>

              <div className="min-w-0">
                <h3 className="break-all text-base font-semibold text-white sm:text-lg">
                  {selectedFile.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {getFileSize(selectedFile.size)}
                </p>

                <p className="mt-1 text-xs text-slate-500">{config.title}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTimes />
                Remove
              </button>

              <button
                type="button"
                onClick={handleImport}
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FaUpload />
                    Start Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default UploadZone;
