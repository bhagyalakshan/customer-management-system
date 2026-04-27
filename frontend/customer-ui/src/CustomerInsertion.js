import React, { useState } from "react";
import axios from "axios";
import "./CustomerInsertion.css";
import UploadExcel from "./UploadExcel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExcel, faUserPen, faCircleCheck, faTriangleExclamation, faSpinner, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

function CustomerForm() {

  const [mode, setMode] = useState("manual");
  const [saving, setSaving] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    dob: "",
    nic: "",
    mobileNumbers: "",
    addresses: ""
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setSaving(true);


    const payload = {
      name: customer.name,
      dob: customer.dob,
      nic: customer.nic,
      mobileNumbers: customer.mobileNumbers
        ? customer.mobileNumbers.split(",")
        : [],
      addresses: customer.addresses
        ? customer.addresses.split(",")
        : [],
      familyMemberIds: []
    };

    axios.post("http://localhost:8080/api/customers", payload)
      .then(() => {
        setMessage({ type: "success", text: "Customer saved successfully!" });
        setCustomer({
          name: "",
          dob: "",
          nic: "",
          mobileNumbers: "",
          addresses: ""
        });
      })
      .catch((err) => {
        console.log(err);
        setMessage({ type: "error", text: "Error saving customer. Please try again." });
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <div className="customer-page container py-4 py-md-5">
      <div className="customer-card card border-0 shadow-lg">
        <div className="customer-card-header card-header bg-white border-0">
          <div className="d-flex align-items-center gap-3">
            <div className="customer-icon-badge">
              <FontAwesomeIcon icon={mode === "manual" ? faUserPen : faFileExcel} />
            </div>
            <div>
              <h2 className="mb-1">Create Customer</h2>
              <p className="mb-0">Add manually or upload a bulk Excel file.</p>
            </div>
          </div>
        </div>

        <div className="mode-switch px-3 px-md-4 pt-3" role="tablist" aria-label="Customer entry modes">
          <button
            type="button"
            className={`mode-btn ${mode === "manual" ? "active" : ""}`}
            onClick={() => setMode("manual")}
          >
            <FontAwesomeIcon icon={faUserPen} className="me-2" />
            Manual Entry
          </button>
          <button
            type="button"
            className={`mode-btn ${mode === "excel" ? "active" : ""}`}
            onClick={() => setMode("excel")}
          >
            <FontAwesomeIcon icon={faFileExcel} className="me-2" />
            Upload Excel
          </button>
        </div>

        {mode === "manual" ? (
          <>
            {message.text && (
              <div className={`form-message alert ${message.type === "success" ? "alert-success" : "alert-danger"} mx-3 mx-md-4 mt-3 mb-0`} role="alert" aria-live="polite">
                <FontAwesomeIcon icon={message.type === "success" ? faCircleCheck : faTriangleExclamation} className="me-2" />
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="customer-form px-3 px-md-4 pb-4 pt-3">
              <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-0">
                <FontAwesomeIcon icon={faCircleInfo} />
                <span>Required fields: Name, Date of Birth and NIC. Mobile numbers and addresses are optional.</span>
              </div>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter customer name"
                  value={customer.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dob">Date of Birth</label>
                <input
                  id="dob"
                  type="date"
                  name="dob"
                  value={customer.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="nic">NIC</label>
                <input
                  id="nic"
                  type="text"
                  name="nic"
                  placeholder="Enter NIC number"
                  value={customer.nic}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="mobileNumbers">Mobile Numbers</label>
                <input
                  id="mobileNumbers"
                  type="text"
                  name="mobileNumbers"
                  placeholder="Comma separated (e.g. 0711111111,0722222222)"
                  value={customer.mobileNumbers}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="addresses">Addresses</label>
                <input
                  id="addresses"
                  type="text"
                  name="addresses"
                  placeholder="Comma separated addresses"
                  value={customer.addresses}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn btn btn-primary btn-lg" disabled={saving}>
                {saving ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCircleCheck} className="me-2" />
                    Save Customer
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <UploadExcel />
        )}
      </div>
    </div>
  );
}

export default CustomerForm;