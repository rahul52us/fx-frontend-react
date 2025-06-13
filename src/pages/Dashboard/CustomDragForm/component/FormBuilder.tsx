import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import FieldEditor from './FieldEditor';

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  min?: number;
  max?: number;
  value: string;
}

const FormBuilder: React.FC = () => {
  const [fields, setFields] = useState<FormField[]>([]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'field',
    drop: (item: { id: string }) => addFieldToForm(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const addFieldToForm = (fieldId: string) => {
    const newField: FormField = {
      id: `${fieldId}-${fields.length}`,
      type: fieldId,
      label: fieldId.charAt(0).toUpperCase() + fieldId.slice(1) + ' Field',
      value: '',
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const updateField = (index: number, updatedField: FormField) => {
    setFields(fields.map((field, i) => (i === index ? updatedField : field)));
  };

  return (
    <div className="form-builder-container">
      <div ref={drop} className="form-builder" style={{ background: isOver ? '#f0f0f0' : '#fff' }}>
        {fields.map((field, index) => (
          <FieldEditor key={index} field={field} onUpdate={(updatedField : any) => updateField(index, updatedField)} />
        ))}
      </div>
    </div>
  );
};

export default FormBuilder;
