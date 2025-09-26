import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface TemplateDto {
  id: string;
  name: string;
  content: string;
  jsonSchema?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: TemplateDto[];
  currentTemplate: TemplateDto | null;
  loading: boolean;
  error: string | null;
}

const initialState: TemplateState = {
  templates: [],
  currentTemplate: null,
  loading: false,
  error: null
};

const baseUrl = import.meta.env.PROD ? 'https://localhost:7156' : '';

export const fetchTemplate = createAsyncThunk(
  'templates/fetchOne',
  async (id: string) => {
    const response = await fetch(`${baseUrl}/api/Template/${id}`);
    if (!response.ok) throw new Error('Failed to fetch template');
    return response.json();
  }
);

export const fetchTemplates = createAsyncThunk(
  'templates/fetchAll',
  async () => {
    const response = await fetch(`${baseUrl}/api/Template`);
    if (!response.ok) throw new Error('Failed to fetch templates');
    return response.json();
  }
);

export const deleteTemplate = createAsyncThunk(
  'templates/delete',
  async (id: string) => {
    const response = await fetch(`${baseUrl}/api/Template/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete template');
    return id;
  }
);

export const createTemplate = createAsyncThunk(
  'templates/create',
  async (template: { name: string; content: string; jsonSchema?: string }) => {
    const response = await fetch(`${baseUrl}/api/Template`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });
    if (!response.ok) throw new Error('Failed to create template');
    return response.json();
  }
);

export const updateTemplate = createAsyncThunk(
  'templates/update',
  async ({ id, template }: { id: string; template: { name: string; content: string; jsonSchema?: string } }) => {
    const response = await fetch(`${baseUrl}/api/Template/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(template)
    });
    if (!response.ok) throw new Error('Failed to update template');
    return response.json();
  }
);

// PDF generation utility function - kept separate since it returns a Blob
export const generatePdf = async (id: string, data: object): Promise<Blob> => {
  const response = await fetch(`${baseUrl}/api/Template/${id}/render-pdf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/pdf'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  return response.blob();
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.templates = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch templates';
      })
      .addCase(fetchTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplate.fulfilled, (state, action) => {
        state.currentTemplate = action.payload;
        state.loading = false;
      })
      .addCase(fetchTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch template';
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.templates.push(action.payload);
        state.loading = false;
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create template';
      })
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        const index = state.templates.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
        if (state.currentTemplate?.id === action.payload.id) {
          state.currentTemplate = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update template';
      })
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.templates = state.templates.filter(t => t.id !== action.payload);
        if (state.currentTemplate?.id === action.payload) {
          state.currentTemplate = null;
        }
        state.loading = false;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete template';
      });
  }
});

export const { clearError } = templateSlice.actions;
export default templateSlice.reducer;