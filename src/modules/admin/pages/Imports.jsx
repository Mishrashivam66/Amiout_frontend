import { useEffect, useState } from "react";

import ImportHeader from "../components/imports/ImportHeader";
import ImportTabs from "../components/imports/ImportTabs";
import UploadZone from "../components/imports/UploadZone";
import FilePreview from "../components/imports/FilePreview";
import ValidationTable from "../components/imports/ValidationTable";
import ImportSummary from "../components/imports/ImportSummary";
import ImportHistory from "../components/imports/ImportHistory";

import { getImportHistory } from "../services/import.service";

// ============================================================
// INITIAL SUMMARY
// ============================================================

const INITIAL_SUMMARY = {
  total: 0,
  imported: 0,
  updated: 0,
  failed: 0,
  duplicates: 0,
  processingTime: "0 sec",
};

// ============================================================
// IMPORTS PAGE
// ============================================================

const Imports = () => {
  // ==========================================================
  // STATES
  // ==========================================================

  const [activeTab, setActiveTab] = useState("students");

  const [selectedFile, setSelectedFile] = useState(null);

  const [previewData, setPreviewData] = useState([]);

  const [validationErrors, setValidationErrors] = useState([]);

  const [summary, setSummary] = useState({ ...INITIAL_SUMMARY });

  const [history, setHistory] = useState([]);

  // ==========================================================
  // LOAD IMPORT HISTORY ON PAGE OPEN
  // ==========================================================

  useEffect(() => {
    let mounted = true;

    const loadHistory = async () => {
      try {
        const response = await getImportHistory();

        const records = response?.data?.data ?? response?.data ?? [];

        if (mounted) {
          setHistory(Array.isArray(records) ? records : []);
        }
      } catch (error) {
        // History loading failure must not
        // block the import page.

        if (import.meta.env.DEV) {
          console.error("Unable to load import history:", error);
        }
      }
    };

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}

      <ImportHeader />

      {/* STUDENT / FACULTY TABS */}

      <ImportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* UPLOAD SECTION */}

      <UploadZone
        activeTab={activeTab}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setPreviewData={setPreviewData}
        setValidationErrors={setValidationErrors}
        setSummary={setSummary}
        setHistory={setHistory}
      />

      {/* FILE PREVIEW */}

      <FilePreview activeTab={activeTab} previewData={previewData} />

      {/* VALIDATION RESULTS */}

      <ValidationTable validationErrors={validationErrors} summary={summary} />

      {/* IMPORT SUMMARY */}

      <ImportSummary summary={summary} />

      {/* IMPORT HISTORY */}

      <ImportHistory history={history} />
    </div>
  );
};

export default Imports;
