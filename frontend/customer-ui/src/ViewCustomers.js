import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewCustomers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation, faSpinner, faArrowRotateRight, faHome } from "@fortawesome/free-solid-svg-icons";

function CustomerTable({ onBack, onEditCustomer, onDeleteCustomer }) {

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

 
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    setLoading(true);
    setError("");
    axios.get("http://localhost:8080/api/customers")
      .then((res) => {
        setCustomers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("Error loading customers", err);
        setError("Unable to load customers. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="customers-page">
      <div className="customers-shell">
        <div className="customers-header">
          <div>
            <p className="customers-kicker">Customer Data</p>
            <h2>All Customers</h2>
            <p className="customers-subtitle">View and review all saved customer records.</p>
          </div>

          <div className="customers-actions">
            <button type="button" className="secondary-btn" onClick={loadCustomers}>
              <FontAwesomeIcon icon={faArrowRotateRight} className="me-2" />
              Refresh
            </button>
            {onBack && (
              <button type="button" className="back-btn" onClick={onBack}>
                <FontAwesomeIcon icon={faHome} className="me-2" />
                ← Home
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="customers-state d-flex align-items-center justify-content-center gap-2">
            <FontAwesomeIcon icon={faSpinner} spin />
            Loading customers...
          </div>
        )}

        {!loading && error && (
          <div className="customers-state error d-flex align-items-center justify-content-center gap-2">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {error}
          </div>
        )}

        {!loading && !error && customers.length === 0 && (
          <div className="customers-state d-flex align-items-center justify-content-center gap-2">
            <FontAwesomeIcon icon={faCircleCheck} />
            No customers found.
          </div>
        )}

        {!loading && !error && customers.length > 0 && (
          <div className="table-wrap">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>NIC</th>
                  <th>Mobile Numbers</th>
                  <th>Addresses</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.dob}</td>
                    <td>{c.nic}</td>
                    <td>
                      {c.mobileNumbers && c.mobileNumbers.length > 0
                        ? c.mobileNumbers.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      {c.addresses && c.addresses.length > 0
                        ? c.addresses.join(", ")
                        : "N/A"}
                    </td>
                    <td>
                      <div className="row-actions">
                        {onEditCustomer && (
                          <button
                            type="button"
                            className="secondary-btn"
                            onClick={() => onEditCustomer(c)}
                          >
                            Edit
                          </button>
                        )}
                        {onDeleteCustomer && (
                          <button
                            type="button"
                            className="danger-btn"
                            onClick={() => onDeleteCustomer(c)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerTable;