import React from 'react';
import { useDrag } from 'react-dnd';
// import '../../dragndrop/Dnd.css'
const DragItem = ({ field, droppedFields }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_FIELD',
    item: { field },
    canDrag: !droppedFields.has(field.id), // Prevent dragging if the field is already dropped
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        margin: '5px',
        background: isDragging ? '#ddd' : '#fff',
        cursor: 'move', 
      }}
    >
      {field.label}
    </div>
  );
};

export default DragItem;
