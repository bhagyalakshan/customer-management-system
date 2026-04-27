import React, { useState } from "react";
import './App.css';
import CustomerForm from './CustomerInsertion';
import CustomerTable from './ViewCustomers';
import DeleteCustomers from './DeleteCustomers';
import UpdateCustomers from './UpdateCustomers';

function App() {
  const [activePage, setActivePage] = useState("home");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const navItems = [
    {
      key: "add",
      title: "Add Customers",
      description: "Register new customers with all required details securely."
    },
    {
      key: "delete",
      title: "Delete Customers",
      description: "Remove outdated or invalid customer records safely."
    },
    {
      key: "update",
      title: "Update Customers",
      description: "Edit customer information and keep records up to date."
    },
    {
      key: "view",
      title: "View Customers",
      description: "Browse and review customer details in one place."
    }
  ];

  const renderPlaceholder = (title, text) => (
    <div className="placeholder-page">
      <div className="placeholder-card">
        <h2>{title}</h2>
        <p>{text}</p>
        <p className="placeholder-note">You can connect this page to your backend endpoints later.</p>
        <button className="back-btn" onClick={() => setActivePage("home")}>Back to Home</button>
      </div>
    </div>
  );

  const renderPage = () => {
    if (activePage === "home") {
      return (
        <main className="home-page">
          <section className="hero-section">
            <h1>Customer Management Dashboard</h1>
            <p>Select an action to manage customer data efficiently.</p>
          </section>

          <section className="nav-grid" aria-label="Customer management navigation">
            {navItems.map((item) => (
              <button
                key={item.key}
                className="nav-card"
                onClick={() => setActivePage(item.key)}
              >
                <span className="nav-card-title">{item.title}</span>
                <span className="nav-card-text">{item.description}</span>
              </button>
            ))}
          </section>
        </main>
      );
    }

    if (activePage === "add") {
      return (
        <CustomerForm />
      );
    }

    if (activePage === "delete") {
      return (
        <DeleteCustomers
          selectedCustomer={selectedCustomer}
        />
      );
    }

    if (activePage === "update") {
      return (
        <UpdateCustomers
          selectedCustomer={selectedCustomer}
        />
      );
    }

    if (activePage === "view") {
      return (
        <CustomerTable
          onEditCustomer={(customer) => {
            setSelectedCustomer(customer);
            setActivePage("update");
          }}
          onDeleteCustomer={(customer) => {
            setSelectedCustomer(customer);
            setActivePage("delete");
          }}
        />
      );
    }

    return renderPlaceholder(
      "View Customers",
      "Use this section to list and inspect all customers."
    );
  };

  return (
    <div className="App">
      {activePage !== "home" && (
        <div className="top-back-wrap">
          <button className="back-btn" onClick={() => setActivePage("home")}>← Home</button>
        </div>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
