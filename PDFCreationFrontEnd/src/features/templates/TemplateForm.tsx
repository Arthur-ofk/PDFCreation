import React, { useState, useCallback } from 'react';
import type { TemplateDto } from './templateSlice';
import { createTemplate, updateTemplate } from './templateSlice';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../app/store';
import Ajv from 'ajv';
import '../styles/main.css';

interface Props {
  template?: TemplateDto | null;
  onClose: () => void;
  onSaved: () => void;
}

const ajv = new Ajv();

const TemplateForm: React.FC<Props> = ({ template, onClose, onSaved }) => {
  const [name, setName] = useState(template?.name || '');
  const [htmlContent, setHtmlContent] = useState(template?.content || '');
  const [jsonSchema, setJsonSchema] = useState(template?.jsonSchema || '');
  const [showHtmlExample, setShowHtmlExample] = useState(false);
  const [showSchemaExample, setShowSchemaExample] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
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
        jsonSchema: jsonSchema.trim() || undefined
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
    <div className="card">
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
          <div className="form-header">
            <label htmlFor="html">HTML Content:</label>
            <button
              type="button"
              className="button-link"
              onClick={() => setShowHtmlExample(prev => !prev)}
            >
              {showHtmlExample ? 'Hide Example' : 'Show Example'}
            </button>
          </div>
          {showHtmlExample && (
            <div className="code-example">
              <pre>
                {'<h1>{{title}}</h1>\n<p>Hello {{name}},</p>\n<p>Your email: {{email}}</p>'}
              </pre>
            </div>
          )}
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
          <div className="form-header">
            <label htmlFor="schema">JSON Schema (optional):</label>
            <button
              type="button"
              className="button-link"
              onClick={() => setShowSchemaExample(prev => !prev)}
            >
              {showSchemaExample ? 'Hide Example' : 'Show Example'}
            </button>
          </div>
          {showSchemaExample && (
            <div className="code-example">
              <pre>
                {JSON.stringify({
                  "type": "object",
                  "properties": {
                    "title": { "type": "string" },
                    "name": { "type": "string" },
                    "email": { "type": "string", "format": "email" }
                  },
                  "required": ["title", "name", "email"]
                }, null, 2)}
              </pre>
            </div>
          )}
          <textarea
            id="schema"
            className="form-control code-editor"
            value={jsonSchema}
            onChange={e => setJsonSchema(e.target.value)}
            rows={6}
            placeholder="Enter JSON Schema for template validation"
          />
          {schemaError && <div className="error-message">{schemaError}</div>}
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="form-actions">
          <button type="button" className="button secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button">Save</button>
        </div>
      </form>
    </div>
  );
};

export default TemplateForm;