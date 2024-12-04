import React from 'react';
import { useDrag } from 'react-dnd';
import './DragItem.css'
const DragItem = ({ field, droppedFields }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FORM_FIELD',
    item: { field },
    canDrag: !droppedFields.has(field.id), 
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className='drag-item'>
      {field.label}
    </div>
  );
};

export default DragItem;
