import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateField } from '../redux/FormSlice'; // Adjust the path to your slice

const EditCustomer = () => {
  const { formId } = useParams(); // Get the formId from URL parameters
  const dispatch = useDispatch();

  const [formValues, setFormValues] = useState({});
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    const lsData = localStorage.getItem('formsData');
    if (lsData) {
      const forms = JSON.parse(lsData);
      const form = forms.find((form) => form.id === parseInt(formId));
      if (form) {
        setFormData(form);
        setFormValues(form.data || {}); // Initialize form values from localStorage data
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

    dispatch(updateField({ id: formId, name, value })); // Update the field in Redux store
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update localStorage with the new values
    const lsData = localStorage.getItem('formsData');
    if (lsData) {
      const forms = JSON.parse(lsData);
      const updatedForms = forms.map((form) =>
        form.id === parseInt(formId) ? { ...form, data: formValues } : form
      );
      localStorage.setItem('formsData', JSON.stringify(updatedForms));
    }

    console.log('Form saved:', formValues);
  };

  if (!formData) return <div>Form not found</div>;

  return (
    <div>
      <h2>Edit Customer Form</h2>
      <form onSubmit={handleSubmit}>
        {Object.entries(formData.data).map(([key, value]) => (
          <div key={key}>
            <label>{value.label}</label>

            {/* Handle radio buttons */}
            {value.type === 'radio' && value.options ? (
              value.options.map((option, index) => (
                <div key={index}>
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
              // Handle other input types (e.g., text)
              <input
                type={value.type}
                name={key}
                value={formValues[key]?.value || ''}
                onChange={handleChange}
                placeholder={value.placeholder}
              />
            )}
          </div>
        ))}
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCustomer;
