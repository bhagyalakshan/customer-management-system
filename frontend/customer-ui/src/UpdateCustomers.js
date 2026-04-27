import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./CustomerActions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation, faSpinner, faPenToSquare, faArrowRotateRight, faEraser } from "@fortawesome/free-solid-svg-icons";

const initialFormState = {
  id: "",
  name: "",
  dob: "",
  nic: "",
  mobileNumbers: "",
  addresses: ""
};

function UpdateCustomers({ onBack, selectedCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState(initialFormState);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      handleSelectCustomer(selectedCustomer);
    }
  }, [selectedCustomer]);

  const loadCustomers = () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    axios
      .get("http://localhost:8080/api/customers")
      .then((res) => {
        setCustomers(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading customers", err);
        setMessage({ type: "error", text: "Unable to load customers." });
        setLoading(false);
      });
  };

  const filteredCustomers = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) {
      return customers;
    }

    return customers.filter((customer) => {
      const name = String(customer.name || "").toLowerCase();
      const nic = String(customer.nic || "").toLowerCase();
      const id = String(customer.id || "").toLowerCase();
      return name.includes(search) || nic.includes(search) || id.includes(search);
    });
  }, [customers, query]);

  const handleSelectCustomer = (customer) => {
    setForm({
      id: customer.id,
      name: customer.name || "",
      dob: customer.dob || "",
      nic: customer.nic || "",
      mobileNumbers: customer.mobileNumbers ? customer.mobileNumbers.join(", ") : "",
      addresses: customer.addresses ? customer.addresses.join(", ") : ""
    });
    setMessage({ type: "success", text: `Loaded ${customer.name} for editing.` });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.id) {
      setMessage({ type: "error", text: "Please select a customer from the table first." });
      return;
    }

    const payload = {
      name: form.name,
      dob: form.dob,
      nic: form.nic,
      mobileNumbers: form.mobileNumbers ? form.mobileNumbers.split(",") : [],
      addresses: form.addresses ? form.addresses.split(",") : [],
      familyMemberIds: []
    };

    setMessage({ type: "", text: "" });

    axios
      .put(`http://localhost:8080/api/customers/${form.id}`, payload)
      .then(() => {
        setMessage({ type: "success", text: "Customer updated successfully." });
        setForm(initialFormState);
        loadCustomers();
      })
      .catch((err) => {
        console.log("Error updating customer", err);
        setMessage({ type: "error", text: "Update failed. Please verify backend PUT support." });
      });
  };

  return (
    <div className="actions-page">
      <div className="actions-shell">
        <div className="actions-header">
          <div>
            <p className="actions-kicker">Update Customers</p>
            <h2>Search and Autofill</h2>
            <p className="actions-subtitle">Search by name, NIC, or ID, then edit the loaded customer details.</p>
          </div>

          <div className="actions-header-buttons">
            <button type="button" className="secondary-btn" onClick={loadCustomers}>
              <FontAwesomeIcon icon={faArrowRotateRight} className="me-2" />
              Refresh
            </button>
            {onBack && (
              <button type="button" className="back-btn" onClick={onBack}>
                ← Home
              </button>
            )}
          </div>
        </div>

        {message.text && (
          <div className={`actions-message alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
            <FontAwesomeIcon icon={message.type === "success" ? faCircleCheck : faTriangleExclamation} className="me-2" />
            {message.text}
          </div>
        )}

        {form.id && (
          <div className="selected-customer-banner">
            Editing: <strong>{form.name}</strong> (ID: {form.id})
          </div>
        )}

        <div className="search-row">
          <input
            className="search-input"
            type="text"
            placeholder="Search customer by name, NIC, or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="actions-state d-flex align-items-center justify-content-center gap-2">
            <FontAwesomeIcon icon={faSpinner} spin />
            Loading customers...
          </div>
        )}

        {!loading && filteredCustomers.length === 0 && (
          <div className="actions-state">No matching customers found.</div>
        )}

        {!loading && filteredCustomers.length > 0 && (
          <div className="table-wrap table-space-bottom">
            <table className="actions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>NIC</th>
                  <th>Mobile Numbers</th>
                  <th>Addresses</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>{customer.id}</td>
                    <td>{customer.name}</td>
                    <td>{customer.dob}</td>
                    <td>{customer.nic}</td>
                    <td>
                      {customer.mobileNumbers && customer.mobileNumbers.length > 0
                        ? customer.mobileNumbers.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      {customer.addresses && customer.addresses.length > 0
                        ? customer.addresses.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="secondary-btn"
                        onClick={() => handleSelectCustomer(customer)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="edit-form-header">
            <h3>Update Customer</h3>
            <p>Selected customer details appear here for manual editing.</p>
          </div>

          <div className="alert alert-info border-0 d-flex align-items-center gap-2 mb-0">
            <FontAwesomeIcon icon={faPenToSquare} />
            <span>Select a record above, review the autofilled details, then save your changes.</span>
          </div>

          <div className="edit-grid">
            <div className="form-group">
              <label htmlFor="edit-name">Full Name</label>
              <input
                id="edit-name"
                name="name"
                type="text"
                placeholder="Customer name"
                value={form.name}
                onChange={handleChange}
                disabled={!form.id}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-dob">Date of Birth</label>
              <input
                id="edit-dob"
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                disabled={!form.id}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-nic">NIC</label>
              <input
                id="edit-nic"
                name="nic"
                type="text"
                placeholder="NIC number"
                value={form.nic}
                onChange={handleChange}
                disabled={!form.id}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="edit-mobileNumbers">Mobile Numbers</label>
              <input
                id="edit-mobileNumbers"
                name="mobileNumbers"
                type="text"
                placeholder="Comma separated mobile numbers"
                value={form.mobileNumbers}
                onChange={handleChange}
                disabled={!form.id}
              />
            </div>

            <div className="form-group form-group-full">
              <label htmlFor="edit-addresses">Addresses</label>
              <input
                id="edit-addresses"
                name="addresses"
                type="text"
                placeholder="Comma separated addresses"
                value={form.addresses}
                onChange={handleChange}
                disabled={!form.id}
              />
            </div>
          </div>

          <div className="edit-actions">
            <button type="submit" className="submit-btn" disabled={!form.id}>
              Save Changes
            </button>
            <button
              type="button"
              className="secondary-btn"
              disabled={!form.id}
              onClick={() => setForm(initialFormState)}
            >
              <FontAwesomeIcon icon={faEraser} className="me-2" />
              Clear Selection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateCustomers;
