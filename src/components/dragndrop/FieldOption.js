// FieldOptions.js
import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const FieldOptions = ({ field, index, onDeleteOption, onEditOption }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {field.options.map((opt, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
          <input
            type="text"
            value={opt}
            onChange={(e) => onEditOption(index, i, e.target.value)}
            style={{ flex: 1, marginRight: "10px", padding: "5px" }}
          />
          <FaTrashAlt
            onClick={() => onDeleteOption(index, i)}
            style={{ cursor: "pointer", color: "#FF5733" }}
          />
        </div>
      ))}
      <input
        type="text"
        placeholder="Add option"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target.value.trim()) {
            onEditOption(index, field.options.length, e.target.value.trim());
            e.target.value = "";
          }
        }}
        style={{ marginTop: "10px", padding: "8px", flex: 1 }}
      />
    </div>
  );
};

export default FieldOptions;
