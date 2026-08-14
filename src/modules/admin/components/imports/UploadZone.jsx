
import { useRef, useState } from "react";
import { importStudentsPDF } from "../../services/import.service";
import {
  FaCloudUploadAlt,
  FaDownload,
  FaFileExcel,
  FaSpinner,
  FaTimes,
  FaUpload,
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
} from "../../services/import.service";

const UploadZone = ({
  activeTab,

  selectedFile,
  setSelectedFile,

  setPreviewData,
  setValidationErrors,
  setSummary,
  setHistory,
}) => {
  // ============================================================================
// Refs
// ============================================================================

  const inputRef = useRef(null);

  // ============================================================================
// States
// ============================================================================

  const [dragActive, setDragActive] = useState(false);

  const [loading, setLoading] = useState(false);

  const [progress, setProgress] = useState(0);

  // ============================================================================
// Validate File
// ============================================================================

  const validateFile = (file) => {
    if (!file) return false;

    const extension = file.name.split(".").pop().toLowerCase();

    if (!["xlsx", "xls", "pdf"].includes(extension)) {
      toast.error("Only Excel (.xlsx/.xls) or PDF files are allowed.");
      return false;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Maximum file size is 10 MB.");

      return false;
    }

    return true;
  };

  // ============================================================================
// Handle Selected File
// ============================================================================

  const handleFile = (file) => {
    if (!validateFile(file)) return;

    setSelectedFile(file);

    toast.success("File selected successfully.");
  };
  // ============================================================================
// Browse File
// ============================================================================

  const handleChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    handleFile(file);
  };

  // ============================================================================
// Drag & Drop
// ============================================================================

  const handleDrop = (e) => {
    e.preventDefault();

    setDragActive(false);

    const file = e.dataTransfer.files?.[0];

    if (!file) return;

    handleFile(file);
  };

  // ============================================================================
// Remove File
// ============================================================================

  const removeFile = () => {
    setSelectedFile(null);

    setPreviewData([]);

    setValidationErrors([]);

    setSummary({
      total: 0,
      imported: 0,
      failed: 0,
      duplicates: 0,
      processingTime: "0 sec",
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    toast.success("File removed successfully.");
  };

  // ============================================================================
// Download Template
// ============================================================================

  const handleDownloadTemplate = async () => {
    try {
      let response;

      if (activeTab === "students") {
        response = await downloadStudentTemplate();
      } else if (activeTab === "mentors") {
        response = await downloadMentorTemplate();
      } else {
        response = await downloadGroupTemplate();
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.download = `${activeTab}_template.xlsx`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Template downloaded successfully.");
    } catch (error) {
      console.error(error);

      toast.error("Unable to download template.");
    }
  };

  // ============================================================================
// Start Import
// ============================================================================
  const handleImport = async () => {
    if (!selectedFile) {
      toast.error("Please select a file.");

      return;
    }

    setLoading(true);

    setProgress(10);

    try {
      let response;

      if (activeTab === "students") {
        if (selectedFile.name.toLowerCase().endsWith(".pdf")) {
          response = await importStudentsPDF(selectedFile);
        } else {
          response = await importStudents(selectedFile);
        }
      } else if (activeTab === "mentors") {
        response = await importMentors(selectedFile);
      } else {
        response = await importGroups(selectedFile);
      }

      setProgress(60);

      const result = response;

    
      // ============================================================================
// Update Preview
// ============================================================================

      setPreviewData(result.preview || []);

      // ============================================================================
// Validation Errors
// ============================================================================

      setValidationErrors(result.validationErrors || []);

      // ============================================================================
// Summary
// ============================================================================

      setSummary({
        total:
          result.summary?.total ||
          result.summary?.totalRows ||
          result.totalRows ||
          0,

        imported: result.imported || result.summary?.imported || 0,

        failed: result.failed || result.summary?.failed || 0,

        duplicates: result.duplicates || result.summary?.duplicates || 0,

        processingTime: result.processingTime
          ? `${result.processingTime} sec`
          : "0 sec",
      });

      setProgress(90);

      // ============================================================================
// Refresh Import History
// ============================================================================

      try {
        const historyResponse = await getImportHistory();

        setHistory(historyResponse.data.data || []);
      } catch (historyError) {
        console.error(historyError);
      }

      setProgress(100);

      toast.success("Import completed successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || "Import failed. Please try again.",
      );
    } finally {
      setLoading(false);

      setTimeout(() => {
        setProgress(0);
      }, 800);
    }
  };

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
          gap-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div>
          <h2 className="text-2xl font-bold text-white">
            {activeTab === "students"
              ? "Student Import"
              : activeTab === "mentors"
                ? "Mentor Import"
                : "Group Import"}
          </h2>

          <p className="mt-2 text-slate-400">
            Upload an Excel or PDF file for bulk import.
          </p>
        </div>

        <button
          onClick={handleDownloadTemplate}
          className="
            inline-flex
            items-center
            gap-3
            rounded-xl
            bg-blue-600
            px-6
            py-3
            font-semibold
            text-white
            transition
            hover:bg-blue-700
          "
        >
          <FaDownload />
          Download Template
        </button>
      </div>

      {/* ====================================================== */}
      {/* Upload Area */}
      {/* ====================================================== */}

      <div
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        className={`
          cursor-pointer
          rounded-3xl
          border-2
          border-dashed
          p-12
          text-center
          transition-all
          duration-300

          ${
            dragActive
              ? "border-green-500 bg-green-500/10"
              : "border-[#223447] hover:border-green-500"
          }
        `}
      >
        <FaCloudUploadAlt className="mx-auto text-7xl text-green-400" />

        <h3 className="mt-6 text-2xl font-bold text-white">Drag & Drop File</h3>

        <p className="mt-3 text-slate-400">
          or click here to browse your computer
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-green-500/10 px-4 py-2 text-green-400">
            .xlsx
          </span>

          <span className="rounded-full bg-blue-500/10 px-4 py-2 text-blue-400">
            .xls
          </span>
          <span className="rounded-full bg-red-500/10 px-4 py-2 text-red-400">
            .pdf
          </span>

          <span className="rounded-full bg-orange-500/10 px-4 py-2 text-orange-400">
            Max 10 MB
          </span>
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept=".xlsx,.xls,.pdf"
          onChange={handleChange}
        />
      </div>

      {/* ====================================================== */}
      {/* Upload Progress */}
      {/* ====================================================== */}

      {loading && (
        <div className="mt-8">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-medium text-white">Uploading...</span>

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
        </div>
      )}
      {/* ====================================================== */}
      {/* Selected File */}
      {/* ====================================================== */}

      {selectedFile && (
        <div
          className="
            mt-8
            rounded-2xl
            border
            border-green-500/30
            bg-[#0F172A]
            p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            {/* File Info */}

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
                <FaFileExcel className="text-3xl text-green-400" />
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  {selectedFile.name}
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>

            {/* Buttons */}

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={removeFile}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-red-600
                  px-5
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <FaTimes />
                Remove
              </button>

              <button
                type="button"
                onClick={handleImport}
                disabled={loading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-green-600
                  px-6
                  py-3
                  font-semibold
                  text-white
                  transition
                  hover:bg-green-700
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
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
