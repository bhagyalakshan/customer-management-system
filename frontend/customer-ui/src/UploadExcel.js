import React, { useState } from "react";
import axios from "axios";
import "./CustomerInsertion.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faUpload, faSpinner, faCircleCheck, faTriangleExclamation, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function UploadExcel() {

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [uploading, setUploading] = useState(false);
  const fileInputId = "customer-excel-upload";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {

    if (!file) {
      setMessage({ type: "error", text: "Please select an Excel file first." });
      return;
    }

    setMessage({ type: "", text: "" });
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    axios.post("http://localhost:8080/api/customers/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
      .then(() => {
        setMessage({ type: "success", text: "Upload successful. Bulk import started." });
        setFile(null);
      })
      .catch((err) => {
        console.log(err);
        setMessage({ type: "error", text: "Upload failed. Please check the file format and backend endpoint." });
      })
      .finally(() => {
        setUploading(false);
      });
  };

  return (
    <div className="upload-panel bg-light rounded-4 border p-3 p-md-4 mt-3 mt-md-4">
      <div className="upload-panel-header d-flex align-items-center gap-3 mb-3">
        <div className="customer-icon-badge upload-badge">
          <FontAwesomeIcon icon={faFileExcel} />
        </div>
        <div>
          <h3 className="mb-1">Bulk Customer Upload</h3>
          <p className="mb-0">Upload an Excel file to create customers in bulk.</p>
        </div>
      </div>

      {message.text && (
        <div className={`form-message alert ${message.type === "success" ? "alert-success" : "alert-danger"} mb-3`} role="alert" aria-live="polite">
          <FontAwesomeIcon icon={message.type === "success" ? faCircleCheck : faTriangleExclamation} className="me-2" />
          {message.text}
        </div>
      )}

      <div className="alert alert-info border-0 d-flex align-items-start gap-2 mb-0">
        <FontAwesomeIcon icon={faCircleInfo} className="mt-1" />
        <span>
          Upload .xlsx or .xls files with the required customer fields only. For large files, the backend should process the data in batches.
        </span>
      </div>

      <div className="upload-box d-grid gap-3">
        <div className="upload-file-picker">
          <label className="file-input-label" htmlFor={fileInputId}>
            Choose Excel File
          </label>
          <input
            id={fileInputId}
            className="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
          />
          <p className="upload-file-meta" aria-live="polite">
            {file ? file.name : "No file selected yet"}
          </p>
        </div>

        <button className="submit-btn upload-cta" type="button" onClick={handleUpload} disabled={uploading || !file}>
          {uploading ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
              Uploading...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faUpload} className="me-2" />
              Upload Excel
            </>
          )}
        </button>
      </div>

      {uploading && (
        <div className="alert alert-secondary border-0 d-flex align-items-center gap-2 mb-0">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Uploading file and waiting for the server response...</span>
        </div>
      )}

      <p className="upload-note">
        Use only the mandatory fields for bulk creation. Large files should be processed on the backend in batches.
      </p>
    </div>
  );
}

export default UploadExcel;