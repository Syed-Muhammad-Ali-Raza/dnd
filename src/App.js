import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Initial fields (draggable items)
const initialFields = [
  { id: 1, type: "radio", label: "Radio", options: ["option 1", "option 2", "option 3"], initialValue: "", value: "", position: 0 },
  { id: 2, type: "textarea", label: "Textarea", initialValue: "", value: "", position: 0 },
  { id: 3, type: "text", label: "Text", initialValue: "", value: "", position: 0 },
  { id: 4, type: "dropdown", label: "Dropdown", options: ["Opt 1", "Opt 2", "Opt 3"], initialValue: "", value: "", position: 0 },
  { id: 5, type: "email", label: "Email", initialValue: "", value: "", position: 0 },
];

// Initial layouts (draggable columns)
const initialLayouts = [
  { id: 6, type: "column", label: "1 Column", columns: 1, fields: [], position: 0 },
  { id: 7, type: "column", label: "2 Column", columns: 2, fields: [[], []], position: 0 },
  { id: 8, type: "column", label: "3 Column", columns: 3, fields: [[], [], []], position: 0 },
];

const Field = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "FIELD",
    item: field,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        padding: "8px",
        margin: "4px",
        border: "1px solid gray",
        backgroundColor: isDragging ? "lightgreen" : "white",
        cursor: "grab",
      }}
    >
      {field.label}
    </div>
  );
};

const ColumnDropZone = ({ column, columnIndex, handleDropField }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "FIELD",
    drop: (item) => handleDropField(item, column.id, columnIndex),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        flex: 1,
        minHeight: "50px",
        margin: "4px",
        padding: "8px",
        border: "1px dashed gray",
        backgroundColor: isOver ? "lightblue" : "white",
      }}
    >
      {column.fields[columnIndex]?.map((field, idx) => (
        <div key={idx} style={{ padding: "4px", border: "1px solid lightgray" }}>
          {field.label}
        </div>
      ))}
    </div>
  );
};

const Layout = ({ layout, handleDropField }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", margin: "16px 0" }}>
      <h4>{layout.label}</h4>
      <div style={{ display: "flex" }}>
        {Array.from({ length: layout.columns }).map((_, columnIndex) => (
          <ColumnDropZone
            key={columnIndex}
            column={layout}
            columnIndex={columnIndex}
            handleDropField={handleDropField}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [layouts, setLayouts] = useState(initialLayouts);
  const handleDropField = (field, layoutId, columnIndex) => {
    setLayouts((prevLayouts) =>
      prevLayouts.map((layout) => {
        if (layout.id === layoutId) {
          const updatedFields = [...layout.fields];
  
          // Ensure that the column is initialized properly if it doesn't exist
          if (!updatedFields[columnIndex]) {
            updatedFields[columnIndex] = []; // Initialize the column if it's undefined
          }
  
          updatedFields[columnIndex].push(field); // Now push the field
          return { ...layout, fields: updatedFields };
        }
        return layout;
      })
    );
  };
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
    

        {/* Field Dragging Area (fields to be dragged) */}
        <div style={{ width: "200px", border: "1px solid gray", padding: "8px" }}>
          <h3>Fields</h3>
          {initialFields.map((field) => (
            <Field key={field.id} field={field} />
          ))}
        </div>


            {/* Layouts List (draggable column items) */}
            <div style={{ width: "200px", border: "1px solid gray", padding: "8px" }}>
          <h3>Layouts</h3>
          {layouts.map((layout) => (
            <div key={layout.id} style={{ marginBottom: "10px" }}>
              <Layout layout={layout} handleDropField={handleDropField} />
            </div>
          ))}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
