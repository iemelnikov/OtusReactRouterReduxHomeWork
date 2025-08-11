import type { FC } from 'react';
import type { WithAuthFormProps } from '../components/withAuthForm';
import { TextField, Button, Typography, Alert, CircularProgress, AlertTitle, Box } from '@mui/material';

// Типизация конфигурации формы
export type AuthFormConfig<T extends Record<string, string>> = {
  title: string;
  fields: Array<{
    id: keyof T;
    label: string;
    placeholder?: string;
    type?: string;
  }>;
  submitButtonText: string;
};

// Фабричная функция для создания формы
export const createAuthForm = <T extends Record<string, string>>(
  config: AuthFormConfig<T>
): FC<WithAuthFormProps<T>> => {
  return ({ 
    formData, 
    validationErrors, 
    error, 
    loading, 
    handleChange, 
    handleSubmit
  }) => {
    return (
      <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
        <Box 
          component="form" 
          onSubmit={handleSubmit}
          sx={{
            width: '100%',
            maxWidth: 400,
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper'
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom align="center">
            {config.title}
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {validationErrors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Ошибки валидации</AlertTitle>
              <ul>
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}

          {/* Динамический рендеринг полей формы */}
          {config.fields.map(({ id, label, placeholder, type = 'text' }) => (
            <TextField
              key={String(id)}
              margin="normal"
              required
              fullWidth
              type={type}
              label={label}
              placeholder={placeholder}
              id={String(id)}
              value={formData[id] || ""}
              onChange={handleChange}
              variant="outlined"
            />
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              config.submitButtonText
            )}
          </Button>
        </Box>
      </Box>
    );
  };
};
