// Field.js
import React, { useState } from "react";
import { FaTrashAlt, FaCog } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateField } from "../redux/FormSlice";

const Field = ({ field, index, onDeleteOption, onEditOption }) => {
  const dispatch = useDispatch();
  const [editLabelIndex, setEditLabelIndex] = useState(null);
  const [editPlaceholderIndex, setEditPlaceholderIndex] = useState(null);

  const handleLabelChange = (e) => {
    dispatch(updateField({ id: field.id, name: "label", value: e.target.value }));
  };

  const handleValueChange = (e) => {
    dispatch(updateField({ id: field.id, name: "value", value: e.target.value }));
  };

  const handlePlaceholderChange = (e) => {
    dispatch(updateField({ id: field.id, name: "placeholder", value: e.target.value }));
  };

  return (
    <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {editLabelIndex === index ? (
          <input
            type="text"
            value={field.label}
            onChange={handleLabelChange}
            onBlur={() => setEditLabelIndex(null)}
            style={{ marginBottom: "10px", flex: 1 }}
          />
        ) : (
          <label
            onClick={() => setEditLabelIndex(index)}
            className="tooltip"
            style={{ cursor: "pointer", textDecoration: "underline", color: "#007BFF" }}
          >
            {field.label}
            <span className="tooltiptext">change label</span>
          </label>
        )}

        <FaTrashAlt
          onClick={() => onDeleteOption(index)}
          style={{ cursor: "pointer", color: "#FF5733" }}
        />
      </div>

      {/* Handle different input types like text, email, etc. */}
      <input
        type={field.type === "textarea" ? "textarea" : "text"}
        placeholder={field.placeholder}
        value={field.value}
        onChange={handleValueChange}
        style={{ marginBottom: "10px", flex: 1 }}
      />

      {editPlaceholderIndex === index ? (
        <input
          type="text"
          placeholder="Edit placeholder"
          value={field.placeholder}
          onChange={handlePlaceholderChange}
          onBlur={() => setEditPlaceholderIndex(null)}
          style={{ marginBottom: "10px", flex: 1 }}
        />
      ) : (
        <FaCog
          onClick={() => setEditPlaceholderIndex(index)}
          style={{ cursor: "pointer", color: "#007BFF", marginLeft: "10px" }}
        />
      )}
    </div>
  );
};

export default Field;
