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
    navigate(`/formBuilder/${formId}`);
  };

  return (
    <div className="customer-list-container">
      <h1 className="customer-list-title">Form List</h1>
      <div className="customer-list">
        {customerData.length > 0 ? (
          customerData.map((form) => (
            <div key={form.id} className="customer-card">
              <div className="card-content">
                <h3 className="form-name">{form.formName}</h3>
              </div>
              <div className="card-actions">
                <FaEdit
                  className="action-icon"
                  onClick={() => handleEdit(form.id)}  
                />
                <FaTrashAlt
                  className="action-icon"
                  onClick={() => handleDelete(form.id)}  
                />
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">
            No data available
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerList;
