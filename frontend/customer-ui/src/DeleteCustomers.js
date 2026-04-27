import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./CustomerActions.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faTriangleExclamation, faSpinner, faTrashCan, faArrowRotateRight, faXmark, faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

function DeleteCustomers({ onBack, selectedCustomer }) {
  const [customers, setCustomers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      setQuery(selectedCustomer.name || "");
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

  const handleDelete = (customer) => {
    setCustomerToDelete(customer);
  };

  const confirmDelete = () => {
    if (!customerToDelete) {
      return;
    }

    setMessage({ type: "", text: "" });
    setDeleting(true);

    axios
      .delete(`http://localhost:8080/api/customers/${customerToDelete.id}`)
      .then(() => {
        setMessage({ type: "success", text: "Customer deleted successfully." });
        setCustomers((current) => current.filter((item) => item.id !== customerToDelete.id));
        setCustomerToDelete(null);
      })
      .catch((err) => {
        console.log("Error deleting customer", err);
        setMessage({ type: "error", text: "Delete failed. Please verify backend DELETE support." });
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div className="actions-page">
      <div className="actions-shell">
        <div className="actions-header">
          <div>
            <p className="actions-kicker">Delete Customers</p>
            <h2>Manual Deletion</h2>
            <p className="actions-subtitle">Search by customer name, NIC, or ID and remove the correct record.</p>
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

        {selectedCustomer && (
          <div className="selected-customer-banner">
            Ready to delete: <strong>{selectedCustomer.name}</strong> (ID: {selectedCustomer.id})
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
          <div className="table-wrap">
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
                        className="danger-btn"
                        onClick={() => handleDelete(customer)}
                      >
                        <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {customerToDelete && (
        <div className="delete-modal-backdrop" onClick={() => !deleting && setCustomerToDelete(null)}>
          <div
            className="delete-modal-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-modal-header">
              <div className="delete-modal-title-wrap">
                <div className="delete-modal-icon">
                  <FontAwesomeIcon icon={faCircleExclamation} />
                </div>
                <div>
                  <h3 id="delete-modal-title">Confirm deletion</h3>
                  <p>Delete this customer from the system?</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !deleting && setCustomerToDelete(null)}
                aria-label="Close confirmation dialog"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="delete-modal-body">
              <p className="mb-2"><strong>Name:</strong> {customerToDelete.name}</p>
              <p className="mb-0"><strong>NIC:</strong> {customerToDelete.nic}</p>
            </div>

            <div className="delete-modal-footer">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setCustomerToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="me-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                    Delete Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteCustomers;
