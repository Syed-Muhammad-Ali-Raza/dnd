import React, { useState, useEffect } from "react";
import { useDrop } from "react-dnd";
import { FaTrashAlt, FaEdit, FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addField, updateField, resetForm, setFormFields } from "../../redux/FormSlice"; // Adjust path as needed
import "./DropZone.css";

import { useNavigate, useParams } from "react-router-dom";

const DropZone = ({ droppedFields, setDroppedFields }) => {
  const dispatch = useDispatch();
  const formFields = useSelector((state) => state.form.formFields);
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [editPlaceholderIndex, setEditPlaceholderIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingFormId, setEditingFormId] = useState(null);

  const { formId } = useParams(); 
  console.log(formId,"formId")
  const navigate = useNavigate();

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_FIELD",
    drop: (item) => addFieldToForm(item.field),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  useEffect(() => {
    if (formId) {
      const existingForms = JSON.parse(localStorage.getItem("formsData") || "[]");
      const formToEdit = existingForms.find(form => form.id.toString() === formId);
      
      if (formToEdit) {
        setIsEditMode(true);
        setEditingFormId(formToEdit.id);
        setFormName(formToEdit.formName);
        
        const fieldsArray = Object.entries(formToEdit.data).map(([id, fieldData]) => ({
          id,
          ...fieldData
        }));

        dispatch(setFormFields(fieldsArray));
        
        const droppedFieldsSet = new Set(fieldsArray.map(field => field.id));
        setDroppedFields(droppedFieldsSet);
      }
    }
  }, [formId, dispatch]);

  const addFieldToForm = (field) => {
    if (!droppedFields.has(field.id)) {
      dispatch(addField(field)); 
      setDroppedFields((prev) => new Set(prev).add(field.id));
    }
  };

  const saveForm = () => {
    if (!formName.trim()) {
      alert("Please enter a form name.");
      return;
    }

    const formData = formFields.reduce((acc, field) => {
      acc[field.id] = {
        label: field.label,
        type: field.type,
        position: field.position,
        value: field.value,
        initialValue: field.initialValue || "",
        placeholder: field.placeholder,
        options: field.options || [],
      };
      return acc;
    }, {});

    const existingForms = JSON.parse(localStorage.getItem("formsData") || "[]");

    if (isEditMode && editingFormId) {
      const updatedForms = existingForms.map(form => 
        form.id === editingFormId 
          ? { id: editingFormId, formName, data: formData }
          : form
      );

      localStorage.setItem("formsData", JSON.stringify(updatedForms));
      console.log("Updated Form Data:", { id: editingFormId, formName, data: formData });
    } else {

      const newFormId = Date.now();
      const updatedForms = [
        ...existingForms,
        { id: newFormId, formName, data: formData },
      ];

      localStorage.setItem("formsData", JSON.stringify(updatedForms));
      console.log("Saved Form Data:", { id: newFormId, formName, data: formData });
    }

    setIsModalOpen(false);
    setFormName("");
    navigate("/customer");
  };

  const handleDeleteOption = (fieldIndex, optionIndex) => {
    const updatedOptions = formFields[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    dispatch(updateField({ id: formFields[fieldIndex].id, name: "options", value: updatedOptions }));
  };

  const handleEditOption = (fieldIndex, optionIndex, newValue) => {
    const updatedOptions = [...formFields[fieldIndex].options];
    updatedOptions[optionIndex] = newValue;
    dispatch(updateField({ id: formFields[fieldIndex].id, name: "options", value: updatedOptions }));
  };

  const resetFormState = () => {
    dispatch(resetForm());
    setDroppedFields(new Set());
    setFormName("");
    setIsEditMode(false);
    setEditingFormId(null);
  };

  return (
    <>
      <div
        ref={drop}
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          height: "500px",
          background: isOver ? "#f0f8ff" : "#fafafa",
          overflowY: "auto"
        }}
      >
        {formFields.length === 0 ? (
          <p className="noDataDrag">Drag fields here...</p>
        ) : (
          formFields.map((field, index) => (
            <div
              key={index}
              style={{
                marginBottom: "20px",
                border: "1px solid #ccc",
                padding: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {editLabelIndex === index ? (
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => {
                      dispatch(updateField({ id: field.id, name: "label", value: e.target.value }));
                    }}
                    onBlur={() => setEditLabelIndex(null)}
                    style={{
                      marginBottom: "10px",
                      flex: 1,
                    }}
                  />
                ) : (
                  <label
                    onClick={() => setEditLabelIndex(index)}
                    className="tooltip"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#007BFF",
                    }}
                  >
                    {field.label}
                    <span className="tooltiptext">change label</span>
                  </label>
                )}
                <FaTrashAlt
                  onClick={() => {
                    const updatedFields = formFields.filter((_, i) => i !== index);
                    dispatch(resetForm()); 
                  }}
                  style={{
                    cursor: "pointer",
                    color: "#FF5733",
                  }}
                />
              </div>

              {["text", "email", "textarea"].includes(field.type) && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type={field.type === "textarea" ? "textarea" : "text"}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => {
                      dispatch(updateField({ id: field.id, name: "value", value: e.target.value }));
                    }}
                    style={{
                      marginBottom: "10px",
                      display: "inline-block",
                      marginRight: "10px",
                      flex: 1,
                    }}
                  />
                  {editPlaceholderIndex === index ? (
                    <input
                      type="text"
                      placeholder="Edit placeholder"
                      value={field.placeholder}
                      onChange={(e) => {
                        dispatch(updateField({ id: field.id, name: "placeholder", value: e.target.value }));
                      }}
                      onBlur={() => setEditPlaceholderIndex(null)}
                      style={{
                        marginBottom: "10px",
                        display: "inline-block",
                        flex: 1,
                      }}
                    />
                  ) : (
                    <FaCog
                      onClick={() => setEditPlaceholderIndex(index)}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        marginLeft: "10px",
                      }}
                    />
                  )}
                </div>
              )}

              {field.type === "dropdown" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <select
                    value={field.value}
                    onChange={(e) => {
                      dispatch(updateField({ id: field.id, name: "value", value: e.target.value }));
                    }}
                    style={{
                      marginBottom: "10px",
                      padding: "8px",
                      flex: 1,
                    }}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    {field.options.map((opt, i) => (
                      <option key={i} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>

                  {field.options.map((opt, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                      }}
                    >
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleEditOption(index, i, e.target.value)}
                        style={{
                          flex: 1,
                          marginRight: "10px",
                          padding: "5px",
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => handleDeleteOption(index, i)}
                        style={{
                          cursor: "pointer",
                          color: "#FF5733",
                        }}
                      />
                    </div>
                  ))}

                  <input
                    type="text"
                    placeholder="Add option"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        const updatedOptions = [...field.options, e.target.value.trim()];
                        dispatch(updateField({ id: field.id, name: "options", value: updatedOptions }));
                        e.target.value = "";
                      }
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "8px",
                      flex: 1,
                    }}
                  />
                </div>
              )}

              {field.type === "radio" && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {field.options.map((opt, i) => (
                    <label
                      key={i}
                      style={{
                        marginBottom: "5px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        type="radio"
                        name={`radio-${index}`}
                        checked={field.value === opt}
                        onChange={() => {
                          dispatch(updateField({ id: field.id, name: "value", value: opt }));
                        }}
                        style={{
                          marginRight: "5px",
                        }}
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => handleEditOption(index, i, e.target.value)}
                        style={{
                          flex: 1,
                          padding: "5px",
                          marginRight: "10px",
                        }}
                      />
                      <FaTrashAlt
                        onClick={() => handleDeleteOption(index, i)}
                        style={{
                          cursor: "pointer",
                          color: "#FF5733",
                        }}
                      />
                    </label>
                  ))}

                  <input
                    type="text"
                    placeholder="Add option"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        const updatedOptions = [...field.options, e.target.value.trim()];
                        dispatch(updateField({ id: field.id, name: "options", value: updatedOptions }));
                        e.target.value = "";
                      }
                    }}
                    style={{
                      marginTop: "10px",
                      padding: "8px",
                      flex: 1,
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="formBuilderBtn">
        <button
          onClick={() => setIsModalOpen(true)} className="UpdateSaveBtn"
         
        >
          {isEditMode ? "Update Form" : "Save Form"}
        </button>
        <button 
          onClick={resetFormState}  className="ResetBtn"
        >
          Reset Form
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-container"
       
        >
          <h3>{isEditMode ? "Update Form Name" : "Enter Form Name"}</h3>
          <input
            type="text"
            className="InputFieldModal"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="Form Name"
            
          />
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button  onClick={saveForm}  className="saveBtnModal"
             
            >
              {isEditMode ? "Update" : "Save"}
            </button>
            <button  onClick={() => setIsModalOpen(false)} className="cancelBtnModal"
            
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DropZone;