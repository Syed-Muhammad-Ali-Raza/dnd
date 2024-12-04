import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useDispatch } from 'react-redux';
import { deleteField } from '../redux/FormSlice'; 
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './CustomerList.css';

function CustomerList() {
  const [customerData, setCustomerData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notify = () => toast("Deleted Successfully");

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
    setFormToDelete(formId);
    setShowModal(true);
  };

  const confirmDelete = () => {
    dispatch(deleteField({ formId: formToDelete }));
    setCustomerData((prev) => prev.filter((form) => form.id !== formToDelete));
    localStorage.setItem('formsData', JSON.stringify(customerData));
    setShowModal(false);
    notify();
  };

  const cancelDelete = () => {
    setShowModal(false);
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
                <div className="img-card"></div>
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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <p>Are you sure you want to delete this form?</p>
            <div className="modal-actions">
              <button className='btnYes' onClick={confirmDelete}>Yes</button>
              <button className='btnYes' onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CustomerList;
