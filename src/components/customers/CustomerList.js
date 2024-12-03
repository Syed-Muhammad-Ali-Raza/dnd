import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { deleteField } from '../redux/FormSlice'; 
import { useNavigate } from 'react-router-dom';
import './CustomerList.css';

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
    localStorage.setItem('formsData', JSON.stringify(customerData));
  }, [customerData]);

  const handleDelete = (formId) => {
    dispatch(deleteField({ formId }));
    setCustomerData((prev) => prev.filter((form) => form.id !== formId));
    localStorage.setItem('formsData', JSON.stringify(customerData));
  };

  const handleEdit = (formId) => {
    navigate(`/edit/${formId}`);
  };

  return (
    <div className="customer-list-container">
      <h1 className="customer-list-title">Customer List</h1>
      <div className="customer-list">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Form Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerData.length > 0 ? (
              customerData.map((form, formIndex) => (
                <tr key={form.id}>
                  <td>{formIndex + 1}</td> {/* Display the index */}
                  <td>{form.formName}</td> {/* Display formName */}
                  <td>
                    <FaEdit
                      className="action-icon"
                      onClick={() => handleEdit(form.id)}  
                    />
                    <FaTrashAlt
                      className="action-icon"
                      onClick={() => handleDelete(form.id)}  
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No data available
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
