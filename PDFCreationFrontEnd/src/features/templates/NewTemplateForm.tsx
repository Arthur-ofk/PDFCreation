import React, { useState, useCallback } from 'react';
import type { TemplateDto } from './templateSlice';
import { createTemplate, updateTemplate } from './templateSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import Ajv from 'ajv';
import addFormats from "ajv-formats"
import '../../styles/main.css';

interface Props {
  template?: TemplateDto | null;
  onClose: () => void;
  onSaved: () => void;
}

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const NewTemplateForm: React.FC<Props> = ({ template, onClose, onSaved }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(template?.name || '');
  const [htmlContent, setHtmlContent] = useState(template?.content || '');
  const [jsonSchema, setJsonSchema] = useState(template?.jsonSchema || '');
  const [error, setError] = useState('');
  const [schemaError, setSchemaError] = useState('');
  const isEdit = !!template;

  const validateJsonSchema = useCallback((schema: string): boolean => {
    if (!schema.trim()) return true;
    try {
      const parsed = JSON.parse(schema);
      const validate = ajv.compile(parsed);
      
      validate({});
      setSchemaError('');
      return true;
    } catch (err) {
      setSchemaError(err instanceof Error ? err.message : 'Invalid JSON Schema');
      return false;
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSchemaError('');

    if (!name.trim() || !htmlContent.trim()) {
      setError('All fields are required');
      return;
    }

    if (!validateJsonSchema(jsonSchema)) {
      return;
    }

    try {
      const templateData = {
        name,
        content: htmlContent,
        jsonschema: jsonSchema.trim() || undefined
      };

      if (isEdit && template) {
        await dispatch(updateTemplate({ id: template.id, template: templateData }));
      } else {
        await dispatch(createTemplate(templateData));
      }
      onSaved();
    } catch {
      setError('Error saving the template');
    }
  };

  return (
    <div className="modal">
      <h2 className="title">{isEdit ? 'Edit Template' : 'New Template'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="html">HTML Content:</label>
          <textarea
            id="html"
            className="form-control code-editor"
            value={htmlContent}
            onChange={e => setHtmlContent(e.target.value)}
            rows={8}
            placeholder="Enter HTML template"
          />
        </div>
        <div className="form-group">
          <label htmlFor="schema">JSON Schema (optional):</label>
          <textarea
            id="schema"
            className="form-control code-editor"
            value={jsonSchema}
            onChange={e => setJsonSchema(e.target.value)}
            rows={6}
            placeholder="Enter JSON Schema for template validation"
          />
          {schemaError && <div className="error-message">{schemaError}</div>}
          <small className="help-text">
            Enter a JSON Schema to validate the data used when rendering this template.
            This ensures that the provided data matches the expected structure.
          </small>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="actions">
          <button type="submit" className="button">Save</button>
          <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
export default NewTemplateForm;