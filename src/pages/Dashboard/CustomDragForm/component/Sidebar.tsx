import React from 'react';
import DraggableField from './DraggableField';

interface Field {
  id: string;
  label: string;
}

const fields: Field[] = [
  { id: 'text', label: 'Text Field' },
  { id: 'number', label: 'Number Field' },
  { id: 'email', label: 'Email Field' },
  { id: 'date', label: 'Date Field' },
  // Add more fields as needed
];

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      {fields.map((field) => (
        <DraggableField key={field.id} field={field} />
      ))}
    </div>
  );
};

export default Sidebar;
