import React, { useState, useEffect } from 'react';
import { RawJsonForm } from './RawJsonForm';
import '../../styles/main.css';

interface Props {
  templateId: string;
  templateName: string;
  onClose: () => void;
}

interface Template {
  id: string;
  name: string;
  content: string;
  jsonSchema?: string;
}

const baseUrl = import.meta.env.PROD ? 'https://localhost:7156' : '';

const PdfGenerateModal: React.FC<Props> = ({ templateId, templateName, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [template, setTemplate] = useState<Template | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(true);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/Template/${templateId}`);
        const data = await response.json();
        setTemplate(data);
      } catch (error) {
        console.error('Failed to fetch template:', error);
      } finally {
        setIsLoadingTemplate(false);
      }
    };

    fetchTemplate();
  }, [templateId]);

  const handleGenerate = async (data: any) => {
    try {
      setIsLoading(true);
      
      
      if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
        throw new Error('Invalid data for PDF generation');
      }

      const response = await fetch(`${baseUrl}/api/Template/${templateId}/render-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/pdf'
        },
        body: JSON.stringify({ data })  
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error('Generated PDF is empty');
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${templateName}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      onClose();
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('Failed to generate PDF. Please check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingTemplate) {
    return (
      <div className="modal">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="modal">
        <div className="modal-header">
          <h2 className="title">Generate PDF for "{templateName}"</h2>
        </div>
        
        <div className="modal-content">
          <div className="preview-section">
            <div className="preview-header">
              <h3 className="preview-title">HTML Template</h3>
            </div>
            <pre className="preview-content">{template?.content || ''}</pre>
          </div>
          
          <div className="preview-section">
            <div className="preview-header">
              <h3 className="preview-title">JSON Schema</h3>
              {!template?.jsonSchema && (
                <button 
                  className="button success"
                  onClick={() => {
                    onClose();
                    window.dispatchEvent(new CustomEvent('editTemplate', { 
                      detail: { template }
                    }));
                  }}
                >
                  Add Schema
                </button>
              )}
            </div>
            {template?.jsonSchema ? (
              <pre className="preview-content">{template.jsonSchema}</pre>
            ) : (
              <div className="preview-content schema-empty">
                <p>No schema defined. Adding a schema will help validate the input data.</p>
              </div>
            )}
          </div>

          <RawJsonForm
            onSubmit={handleGenerate}
            templateContent={template?.content || ''}
            jsonSchema={template?.jsonSchema}
            isLoading={isLoading}
            onClose={onClose}
          />
        </div>
    </div>
  );
};

export default PdfGenerateModal;
