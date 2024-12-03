import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateField } from '../redux/FormSlice'; 
import { useNavigate } from 'react-router-dom';
import './EditCustomer.css';

const EditCustomer = () => {
  const { formId } = useParams(); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({});
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const lsData = localStorage.getItem('formsData');
    if (lsData) {
      const forms = JSON.parse(lsData);
      const form = forms.find((form) => form.id === parseInt(formId));
      if (form) {
        setFormData(form);
        setFormValues(form.data || {}); 
      }
    }
  }, [formId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        value: type === 'radio' ? value : value,
      },
    }));

    dispatch(updateField({ id: formId, name, value })); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const lsData = localStorage.getItem('formsData');
    if (lsData) {
      const forms = JSON.parse(lsData);
      const updatedForms = forms.map((form) =>
        form.id === parseInt(formId) ? { ...form, data: formValues } : form
      );
      localStorage.setItem('formsData', JSON.stringify(updatedForms));
      navigate(`/customer`);
    }

    console.log('Form saved:', formValues);
  };

  if (!formData) return <div>Form not found</div>;

  return (
    <>
    <h1>Edit Customer</h1>
  <div className="form-container">
      <form onSubmit={handleSubmit} className="form">
        {Object.entries(formData.data).map(([key, value]) => (
          <div className="form-field" key={key}>
            <label className="label">{value.label}</label>

            {value.type === 'radio' && value.options ? (
              value.options.map((option, index) => (
                <div key={index} className="radio-option">
                  <label>
                    <input
                      type="radio"
                      name={key}
                      value={option}
                      checked={formValues[key]?.value === option}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <input
                type={value.type}
                name={key}
                value={formValues[key]?.value || ''}
                onChange={handleChange}
                placeholder={value.placeholder}
                className="input-field"
              />
            )}
          </div>
        ))}
        <button type="submit" className="submit-button">Save Changes</button>
      </form>
    </div>    
    </>
  
  );
};

export default EditCustomer;
