import React from 'react';
import { useDrag } from 'react-dnd';

interface DraggableFieldProps {
  field: {
    id: string;
    label: string;
  };
}

const DraggableField: React.FC<DraggableFieldProps> = ({ field }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'field',
    item: { id: field.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className="draggable-field" style={{ opacity: isDragging ? 0.5 : 1 }}>
      {field.label}
    </div>
  );
};

export default DraggableField;
