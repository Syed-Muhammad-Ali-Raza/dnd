import React, { useState, useEffect } from 'react';
import './CustomerList.css';
import { FaTrashAlt, FaEdit } from "react-icons/fa";

function CustomerList() {
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    const ls = localStorage.getItem('formsData');
    if (ls) {
      setCustomerData(JSON.parse(ls));
    }
  }, []);

  return (
    <div className="customer-list-container">
      <h1 className="customer-list-title">Customer List</h1>
      <div className="customer-list">
        <table className="table">
          <thead>
            <tr>
              <th>Form ID</th>
              <th>Label</th>
              <th>Type</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerData.length > 0 ? (
              customerData.map((form) => {
                // Calculate the number of rows for the current form
                const rowCount = Object.entries(form.data).length;

                return (
                  <React.Fragment key={form.id}>
                    {/* Render Form ID only for the first row of this Form */}
                    {Object.entries(form.data).map(([key, value], index) => (
                      <tr key={key}>
                        {index === 0 && (
                          <td rowSpan={rowCount}>{form.id}</td>
                        )}
                        <td>{value.label}</td>
                        <td>{value.type}</td>
                        <td>{value.value}</td>
                        {/* Show Edit/Delete buttons only once per form ID */}
                        {index === 0 && (
                          <td rowSpan={rowCount}>
                            <FaEdit
                              className="action-icon"
                              onClick={() => { console.log('Edit clicked') }}
                            />
                            <FaTrashAlt
                              className="action-icon"
                              onClick={() => { console.log('Delete clicked') }}
                            />
                          </td>
                        )}
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No customer data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerList;
