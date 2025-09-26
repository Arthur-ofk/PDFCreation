import React, { useState } from 'react';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, TextField, Typography } from '@mui/material';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

interface Props {
  onSubmit: (data: any) => Promise<void>;
  templateContent: string;
  jsonSchema?: string;
  isLoading: boolean;
  onClose: () => void;
}

export const RawJsonForm: React.FC<Props> = ({ onSubmit, isLoading, onClose, jsonSchema }) => {
  const [rawJson, setRawJson] = useState('');
  const [error, setError] = useState('');
  const [validateWithSchema, setValidateWithSchema] = useState(false);

  const validateJsonAgainstSchema = (data: any, schema: string): boolean => {
    try {
      const ajv = new Ajv({
        allErrors: true,
        strict: false
      });
      addFormats(ajv);
      
      const validate = ajv.compile(JSON.parse(schema));
      if (!validate(data)) {
        const errors = validate.errors?.map(err => {
          const path = err.instancePath.replace('/', '') || 'root';
          return `${path}: ${err.message}`;
        }).join('; ');
        throw new Error(errors || 'Failed to validate against schema');
      }
      return true;
    } catch (err) {
      throw new Error(`Schema validation error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!rawJson.trim()) {
        throw new Error('Please provide JSON data');
      }
      
      const data = JSON.parse(rawJson);
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        throw new Error('JSON must be an object (not an array)');
      }

      if (Object.keys(data).length === 0) {
        throw new Error('JSON object cannot be empty');
      }

     
      if (validateWithSchema && jsonSchema) {
        validateJsonAgainstSchema(data, jsonSchema);
      }

      await onSubmit(data);
    } catch (err) {
      console.error('Error submitting data:', err);
      setError(err instanceof Error ? err.message : 'Invalid JSON format. Please provide a valid JSON object.');
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3, pt: 3, borderTop: '1px solid #e0e0e0' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Enter JSON Data</Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
            control={
              <Checkbox
                checked={validateWithSchema}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValidateWithSchema(e.target.checked)}
                color="primary"
                disabled={!jsonSchema}
              />
            }
            label={
              <Box>
                <Typography variant="body1" color={jsonSchema ? "textPrimary" : "text.disabled"}>
                  Validate against JSON schema
                </Typography>
                {!jsonSchema && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Add a JSON schema to the template to enable validation
                  </Typography>
                )}
              </Box>
            }
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            multiline
            rows={8}
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            error={!!error}
            helperText={error || 'Enter a valid JSON object'}
            sx={{ 
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
                fontSize: '0.875rem'
              },
              '& .MuiOutlinedInput-input': {
                padding: '0.75rem'
              }
            }}
          />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ minWidth: 100 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          variant="contained"
          color="primary"
          sx={{ minWidth: 100 }}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Submit'}
        </Button>
      </Box>
    </Box>
  );
};

export default RawJsonForm;