import type { FC } from 'react';
import { TextField, Button, Typography, CircularProgress, Box } from '@mui/material';
import type { AuthFormProps } from '../Auth/types';

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
): FC<AuthFormProps<T>> => {
  return (props) => {
    return (
      <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="70vh">
        <Box 
          component="form" 
          onSubmit={props.handleSubmit}
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
              value={props.formData ? props.formData[id] || "" : ""}
              onChange={props.handleChange}
              variant="outlined"
            />
          ))}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={props.loading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {props.loading ? (
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
