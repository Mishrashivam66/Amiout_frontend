
import { useState } from "react";

import ImportHeader from "../components/imports/ImportHeader";
import ImportTabs from "../components/imports/ImportTabs";
import UploadZone from "../components/imports/UploadZone";
import FilePreview from "../components/imports/FilePreview";
import ValidationTable from "../components/imports/ValidationTable";
import ImportSummary from "../components/imports/ImportSummary";
import ImportHistory from "../components/imports/ImportHistory";

import { useEffect } from "react";
const Imports = () => {
  // ============================================================================
// States
// ============================================================================

  const [activeTab, setActiveTab] = useState("students");
  useEffect(() => {

  }, [activeTab]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    imported: 0,
    failed: 0,
    duplicates: 0,
    processingTime: "0 sec",
  });

  const [history, setHistory] = useState([]);

  return (
    <div className="space-y-8">
      {/* ====================================================== */}
      {/* Header */}
      {/* ====================================================== */}

      <ImportHeader />

      {/* ====================================================== */}
      {/* Tabs */}
      {/* ====================================================== */}

      <ImportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ====================================================== */}
      {/* Upload */}
      {/* ====================================================== */}

      <UploadZone
        activeTab={activeTab}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        setPreviewData={setPreviewData}
        setValidationErrors={setValidationErrors}
        setSummary={setSummary}
        setHistory={setHistory}
      />
      <FilePreview activeTab={activeTab} previewData={previewData} />

      <ValidationTable validationErrors={validationErrors} />
      <ImportSummary summary={summary} />

      <ImportHistory history={history} />
    </div>
  );
};

export default Imports;
