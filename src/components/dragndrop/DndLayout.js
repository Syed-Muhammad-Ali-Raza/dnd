import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import DragItem from './dragitem/DragItem';
import DropZone from './dropzone/DropZone';
import formFields from '../redux/data/DragDrop.json';

import './DndLayout.css'

const DndLayout = () => {
  const [droppedFields, setDroppedFields] = useState(new Set()); 

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
     
      <div>
          <h3> Fields</h3>
        <div style={{  border: '1px solid #ddd', padding: '20px' }}>
        
          {formFields.map((field) => (
            <DragItem key={field.id} field={field} droppedFields={droppedFields} />
          ))}
        </div>
      </div>
      

        <div style={{ flex: 0 , minWidth: '80%',  height:"20px"}}>
          <h3>Form Builder</h3>
          <DropZone droppedFields={droppedFields} setDroppedFields={setDroppedFields} />
        </div>
      </div>
    </DndProvider>
  );
};

export default DndLayout;
