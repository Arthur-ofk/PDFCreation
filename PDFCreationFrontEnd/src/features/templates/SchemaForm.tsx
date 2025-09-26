import React, { useState, useEffect } from 'react';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface SchemaField {
  type: string;
  title?: string;
  format?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: SchemaField;
}

interface Props {
  schema: string;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  onClose: () => void;
}

const ajv = new Ajv();
addFormats(ajv);

const SchemaForm: React.FC<Props> = ({ schema, onSubmit, isLoading, onClose }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [schemaProperties, setSchemaProperties] = useState<Record<string, SchemaField>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsedSchema = JSON.parse(schema);
      if (parsedSchema.type === 'object' && parsedSchema.properties) {
        setSchemaProperties(parsedSchema.properties);
        const initialData = Object.keys(parsedSchema.properties).reduce((acc, key) => {
          acc[key] = '';
          return acc;
        }, {} as Record<string, any>);
        setFormData(initialData);
      }
    } catch (err) {
      setError('Invalid schema format');
    }
  }, [schema]);

  const parseArrayValue = (value: string) => {
    return value ? value.split(',').map(item => item.trim()) : [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
  
      if (!formData || Object.keys(formData).length === 0) {
        throw new Error('Please fill in the form data');
      }

      const parsedSchema = JSON.parse(schema);
      const validate = ajv.compile(parsedSchema);

      
      const processedData = Object.entries(formData).reduce((acc, [key, value]) => {
        const fieldSchema = parsedSchema.properties[key];
        if (!fieldSchema) return acc;

        if (fieldSchema.type === 'array' && typeof value === 'string') {
          acc[key] = parseArrayValue(value);
        } else if (fieldSchema.type === 'number' && typeof value === 'string') {
          acc[key] = Number(value);
        } else if (fieldSchema.type === 'boolean' && typeof value === 'string') {
          acc[key] = value.toLowerCase() === 'true';
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      console.log('Processed form data:', processedData);

      if (!validate(processedData)) {
        console.error('Validation errors:', validate.errors);
        const errorMessages = validate.errors?.map(err => 
          `${err.instancePath.replace('/', '')} ${err.message}`
        ).join('; ');
        setError(`Validation failed: ${errorMessages || 'Please check all fields'}`);
        return;
      }

      await onSubmit(processedData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : 'Validation error');
    }
  };

  const renderField = (name: string, field: SchemaField) => {
    const value = formData[name]?.toString() || '';
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData(prev => ({ ...prev, [name]: e.target.value }));
    };

    if (field.type === 'array') {
      return (
        <textarea
          className="form-control"
          value={value}
          onChange={handleChange}
          rows={3}
        />
      );
    }

    if (field.type === 'string') {
      if (field.format === 'date') {
        return (
          <input
            type="date"
            className="form-control"
            value={value}
            onChange={handleChange}
          />
        );
      }

      if (field.format === 'date-time') {
        return (
          <input
            type="datetime-local"
            className="form-control"
            value={value}
            onChange={handleChange}
          />
        );
      }

      if (field.enum) {
        return (
          <select className="form-control" value={value} onChange={handleChange}>
            <option value="">Select</option>
            {field.enum.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      }
    }

    if (field.type === 'number' || field.type === 'integer') {
      return (
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={handleChange}
          min={field.minimum}
          max={field.maximum}
        />
      );
    }

    if (field.type === 'boolean') {
      return (
        <select className="form-control" value={value} onChange={handleChange}>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      );
    }

    return (
      <input
        type="text"
        className="form-control"
        value={value}
        onChange={handleChange}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      {Object.entries(schemaProperties).map(([name, field]) => (
        <div key={name} className="form-group">
          <label htmlFor={name}>{field.title || name}</label>
          {renderField(name, field)}
        </div>
      ))}
      {error && <div className="error-message">{error}</div>}
      <div className="actions">
        <button type="submit" className="button" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate PDF'}
        </button>
        <button type="button" className="button secondary" onClick={onClose}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SchemaForm;