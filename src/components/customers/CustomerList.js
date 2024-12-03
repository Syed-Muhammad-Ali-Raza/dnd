import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { deleteField } from '../redux/FormSlice'; 
import { useNavigate } from 'react-router-dom';

function CustomerList() {
  const [customerData, setCustomerData] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const ls = localStorage.getItem('formsData');
    if (ls) {
      setCustomerData(JSON.parse(ls));
    }
  }, []);
  
  useEffect(() => {
    localStorage.getItem('formsData', JSON.stringify(customerData));
  }, [customerData]);

  const handleDelete = (formId) => {
    dispatch(deleteField({ formId }));
    setCustomerData((prev) => prev.filter((form) => form.id !== formId));
    localStorage.setItem('formsData', JSON.stringify(customerData));
  };

  const handleEdit = (formId) => {
    // Navigate to the edit page with the formId
    navigate(`/edit/${formId}`);
  };

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
                if (!form.data) return null;  // Ensure form.data is not undefined or null

                const rowCount = Object.entries(form.data).length;
                return (
                  <React.Fragment key={form.id}>
                    {Object.entries(form.data).map(([key, value], index) => (
                      <tr key={key}>
                        {index === 0 && (
                          <td rowSpan={rowCount}>{form.id}</td>
                        )}
                        <td>{value.label}</td>
                        <td>{value.type}</td>
                        <td>{value.value}</td>
                        {index === 0 && (
                          <td rowSpan={rowCount}>
                            <FaEdit
                              className="action-icon"
                              onClick={() => handleEdit(form.id)}  // Navigate to edit page
                            />
                            <FaTrashAlt
                              className="action-icon"
                              onClick={() => handleDelete(form.id)}  // Call handleDelete with formId
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
