import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { FaTrashAlt, FaEdit, FaCog } from "react-icons/fa";
import "./Dnd.css";

const DropZone = ({ droppedFields, setDroppedFields }) => {
  const [formFields, setFormFields] = useState([]);
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
      const updatedField = {
        ...field,
        value: field.initialValue || "",
        placeholder: field.placeholder || "Enter text...",
        options: field.options || [],
        position: formFields.length + 1,
      };
      setFormFields((prev) => [...prev, updatedField]);
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

  const resetForm = () => {
    setFormFields([]);
    setDroppedFields(new Set());
  };

  const updateFieldOptions = (index, updatedOptions) => {
    const updatedFields = [...formFields];
    updatedFields[index].options = updatedOptions;
    setFormFields(updatedFields);
  };

  const handleDeleteOption = (fieldIndex, optionIndex) => {
    const updatedFields = [...formFields];
    const updatedOptions = updatedFields[fieldIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    updatedFields[fieldIndex].options = updatedOptions;
    setFormFields(updatedFields);
  };

  const handleEditOption = (fieldIndex, optionIndex, newValue) => {
    const updatedFields = [...formFields];
    updatedFields[fieldIndex].options[optionIndex] = newValue;
    setFormFields(updatedFields);
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
                      const updatedFields = [...formFields];
                      updatedFields[index].label = e.target.value;
                      setFormFields(updatedFields);
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
                    className ="tooltip"
                    style={{
                      cursor: "pointer",
                      textDecoration: "underline",
                      color: "#007BFF",
                    }}
                  >
               {field.label}
               <span className="tooltiptext">  change label </span>
                  </label>
                )}
                <FaTrashAlt
                  onClick={() => {
                    const updatedFields = formFields.filter((_, i) => i !== index);
                    setFormFields(updatedFields);
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
                      const updatedFields = [...formFields];
                      updatedFields[index].value = e.target.value;
                      setFormFields(updatedFields);
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
                        const updatedFields = [...formFields];
                        updatedFields[index].placeholder = e.target.value;
                        setFormFields(updatedFields);
                      }}
                      onBlur={() => setEditPlaceholderIndex(null)}
                      style={{
                        marginBottom: "10px",
                        display: "inline-block",
                        flex: 1,
                      }}
                    />
                  ) : (
                   <>
                <span className="tooltip">
                      <FaCog
                      onClick={() => setEditPlaceholderIndex(index)}
                      style={{
                        cursor: "pointer",
                        color: "#007BFF",
                        marginLeft: "10px",
                      }}
                    /><span className="tooltiptext">change placeholder</span>

                </span>
                
                   </>


                  )}
                </div>
              )}

{field.type === "dropdown" && (
  <div style={{ display: "flex", flexDirection: "column" }}>
    {/* Dropdown options */}
    <select
      value={field.value}
      onChange={(e) => {
        const updatedFields = [...formFields];
        updatedFields[index].value = e.target.value;
        setFormFields(updatedFields);
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

    {/* Editable dropdown options */}
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

    {/* Add new dropdown option */}
    <input
      type="text"
      placeholder="Add option"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          const updatedOptions = [...field.options, e.target.value.trim()];
          updateFieldOptions(index, updatedOptions);
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
    {/* Radio button options */}
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
            const updatedFields = [...formFields];
            updatedFields[index].value = opt;
            setFormFields(updatedFields);
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

    {/* Add new radio button option */}
    <input
      type="text"
      placeholder="Add option"
      onKeyDown={(e) => {
        if (e.key === "Enter" && e.target.value.trim()) {
          const updatedOptions = [...field.options, e.target.value.trim()];
          updateFieldOptions(index, updatedOptions);
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

      <div style={{ marginTop: "20px" }}>
        <button onClick={saveForm} style={{ marginRight: "10px" }}>
          Save
        </button>
        <button
          onClick={resetForm}
          style={{ backgroundColor: "#f44336", color: "#fff" }}
        >
          Reset
        </button>
      </div>
    </>
  );
};

export default DropZone;