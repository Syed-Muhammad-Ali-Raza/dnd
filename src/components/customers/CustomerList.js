import React, { useState, useEffect } from 'react';
import './CustomerList.css';

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
            </tr>
          </thead>
          <tbody>
            {customerData.length > 0 ? (
              customerData.map((form) => (
                <React.Fragment key={form.id}>
                  <tr>
                    <td rowSpan={Object.entries(form.data).length + 1}>
                      {form.id}
                    </td>
                  </tr>
                  {Object.entries(form.data).map(([key, value], index) => (
                    <tr key={key}>
                      <td>{value.label}</td>
                      <td>{value.type}</td>
                      <td>{value.value}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
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
