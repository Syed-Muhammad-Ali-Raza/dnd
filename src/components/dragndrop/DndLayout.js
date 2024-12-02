import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DropZone from './DropZone';
import DragItem from './DragItem';
import formFields from '../redux/data/DragDrop.json';
import './Dnd.css'

const DndLayout = () => {
  const [droppedFields, setDroppedFields] = useState(new Set()); // Track dropped fields

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {/* Left column: Drag items */}
      <div>
          <h3> Fields</h3>
        <div style={{  border: '1px solid #ddd', padding: '20px' }}>
        
          {formFields.map((field) => (
            <DragItem key={field.id} field={field} droppedFields={droppedFields} />
          ))}
        </div>
      </div>
      


        {/* Right column: Drop zone */}
        <div style={{ flex: 0 , minWidth: '40%'}}>
          <h3>Form Builder</h3>
          <DropZone droppedFields={droppedFields} setDroppedFields={setDroppedFields} />
        </div>
      </div>
    </DndProvider>
  );
};

export default DndLayout;
