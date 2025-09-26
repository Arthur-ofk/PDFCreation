
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { TemplateDto } from './features/templates/templateSlice';
import { fetchTemplates, deleteTemplate } from './features/templates/templateSlice';
import type { AppDispatch, RootState } from './app/store';
import TemplateForm from './features/templates/NewTemplateForm';
import PdfGenerateModal from './features/templates/PdfGenerateModal';
import './styles/main.css';

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { templates, loading } = useSelector((state: RootState) => state.templates);
  const [editingTemplate, setEditingTemplate] = useState<TemplateDto | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    dispatch(fetchTemplates());

    const handleEditTemplate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.template) {
        setEditingTemplate(customEvent.detail.template);
        setShowForm(true);
      }
    };

    window.addEventListener('editTemplate', handleEditTemplate);
    return () => {
      window.removeEventListener('editTemplate', handleEditTemplate);
    };
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Видалити темплейт?')) {
      await dispatch(deleteTemplate(id));
      dispatch(fetchTemplates());
    }
  };

  return (
    <div className="container">
      <h1 className="title">HTML Templates for PDF</h1>
      <button 
        className="button"
        onClick={() => { setEditingTemplate(null); setShowForm(true); }}
      >
        Create New Template
      </button>

      {showForm && (
        <div className="modal-overlay">
          <TemplateForm
            template={editingTemplate}
            onClose={() => { setShowForm(false); setEditingTemplate(null); }}
            onSaved={() => { 
              setShowForm(false); 
              setEditingTemplate(null); 
              dispatch(fetchTemplates()); 
            }}
          />
        </div>
      )}

      {showPdfModal && (
        <div className="modal-overlay">
          <PdfGenerateModal
            templateId={showPdfModal.id}
            templateName={showPdfModal.name}
            onClose={() => setShowPdfModal(null)}
          />
        </div>
      )}

      <div className="template-list">
        {loading ? (
          <p>Loading...</p>
        ) : (
          templates.map((template) => (
            <div key={template.id} className="template-item">
              <div className="template-header">
                <h2 className="template-title">{template.name}</h2>
                <div className="template-actions">
                  <button
                    className="button secondary"
                    onClick={() => { setEditingTemplate(template); setShowForm(true); }}
                  >
                    Edit
                  </button>
                  <button
                    className="button danger"
                    onClick={() => handleDelete(template.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="button success"
                    onClick={() => setShowPdfModal({ id: template.id, name: template.name })}
                  >
                    Generate PDF
                  </button>
                </div>
              </div>
              <div className="template-content collapsed">
                <pre className="template-html">{template.content}</pre>
                {template.jsonSchema && (
                  <pre className="template-schema">{template.jsonSchema}</pre>
                )}
                <button 
                  className="template-expand"
                  onClick={(e) => {
                    const content = e.currentTarget.parentElement;
                    if (content) {
                      content.classList.toggle('collapsed');
                      e.currentTarget.textContent = content.classList.contains('collapsed') ? 'Show More' : 'Show Less';
                    }
                  }}
                >
                  Show More
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
    

