import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { FaTrashAlt, FaEdit, FaCog } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { addField, updateField, resetForm } from "../redux/FormSlice"; // Adjust path as needed
import "./Dnd.css";

const DropZone = ({ droppedFields, setDroppedFields }) => {
  const dispatch = useDispatch();
  const formFields = useSelector((state) => state.form.formFields);
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [editPlaceholderIndex, setEditPlaceholderIndex] = useState(null);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FORM_FIELD",
    drop: (item) => addFieldToForm(item.field),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addFieldToForm = (field) => {
    if (!droppedFields.has(field.id)) {
      dispatch(addField(field)); 
      setDroppedFields((prev) => new Set(prev).add(field.id));
    }
  };

  const saveForm = () => {
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

    console.log("Saved Form Data:", formData);
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
    dispatch(resetForm()); // Dispatch resetForm action
    setDroppedFields(new Set());
  };

  return (
    <>
      <div
        ref={drop}
        style={{
          border: "2px dashed #aaa",
          padding: "20px",
          minHeight: "300px",
          background: isOver ? "#f0f8ff" : "#fafafa",
        }}
      >
        {formFields.length === 0 ? (
          <p>Drag fields here...</p>
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
                    dispatch(resetForm()); // Remove the field via Redux
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
      <div>
        <button onClick={saveForm} style={{ padding: "10px", backgroundColor: "#28a745", color: "white" }}>
          Save Form
        </button>
        <button onClick={resetFormState} style={{ padding: "10px", backgroundColor: "#dc3545", color: "white" }}>
          Reset Form
        </button>
      </div>
    </>
  );
};

export default DropZone;
