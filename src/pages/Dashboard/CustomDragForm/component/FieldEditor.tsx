import React from 'react';

interface FieldEditorProps {
  field: {
    id: string;
    type: string;
    label: string;
    placeholder?: string;
    required?: boolean;
    min?: number;
    max?: number;
    value: string;
  };
  onUpdate: (updatedField: any) => void;
}

const FieldEditor: React.FC<FieldEditorProps> = ({ field, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } : any= e.target;
    onUpdate({ ...field, [name]: type === 'checkbox' ? checked : value });
  };

  return (
    <div className="field-editor">
      <label>
        {field.label}
        <input
          type={field.type}
          name="value"
          placeholder={field.placeholder}
          required={field.required}
          min={field.min}
          max={field.max}
          value={field.value}
          onChange={handleChange}
        />
      </label>
      <div className="field-settings">
        <input
          type="text"
          name="label"
          placeholder="Label"
          value={field.label}
          onChange={handleChange}
        />
        <input
          type="text"
          name="placeholder"
          placeholder="Placeholder"
          value={field.placeholder || ''}
          onChange={handleChange}
        />
        <input
          type="number"
          name="min"
          placeholder="Min"
          value={field.min !== undefined ? field.min : ''}
          onChange={handleChange}
        />
        <input
          type="number"
          name="max"
          placeholder="Max"
          value={field.max !== undefined ? field.max : ''}
          onChange={handleChange}
        />
        <label>
          Required
          <input
            type="checkbox"
            name="required"
            checked={field.required || false}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default FieldEditor;
