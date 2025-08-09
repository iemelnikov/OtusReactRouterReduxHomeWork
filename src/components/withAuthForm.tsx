import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type AsyncThunkAction } from '@reduxjs/toolkit';
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  AlertTitle,
  CircularProgress
} from '@mui/material';
import { clearError, type AppDispatch, type RootState } from "../store";

// Конфигурация формы аутентификации
type AuthFormConfig<TData extends Record<string, string>> = {
  title: string;
  buttonText: string;
  fields: Array<{
    id: keyof TData;
    type: string;
    label: string;
    placeholder: string;
    required?: boolean;
  }>;
  submitAction: (data: TData) => AsyncThunkAction<any, TData, any>;
  validateForm: (formData: TData) => string[];
  successRedirect: string;
};

// Проверка на пустое поле
const isFieldEmpty = (value: string): boolean => value.trim() === "";

// HOC для форм аутентификации
export const withAuthForm = <TData extends Record<string, string>>(config: AuthFormConfig<TData>) => {
  return () => {
    // Инициализация состояния формы
    const [formData, setFormData] = useState<TData>(
      Object.fromEntries(config.fields.map(field => [field.id, ''])) as TData
    );
    
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const error = useSelector((state: RootState) => state.auth.error);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading } = useSelector((state: RootState) => state.auth);
    
    // Обработчик изменения полей формы
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
      setValidationErrors([]);
      dispatch(clearError());
    }, [dispatch]);

    // Обработчик отправки формы
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      // Сбор всех ошибок
      const errors: string[] = [];
      
      // Проверка обязательных полей
      for (const field of config.fields) {
        if (field.required && isFieldEmpty(formData[field.id])) {
          errors.push(`Поле "${field.label}" обязательно для заполнения!`);
        }
      }
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      // Валидация формы
      const customErrors = config.validateForm(formData);
      if (customErrors.length > 0) {
        setValidationErrors(customErrors);
        return;
      }
      
      const result = await dispatch(config.submitAction(formData));
      if (result.meta.requestStatus === "fulfilled") {
        navigate(config.successRedirect);
      }
    };

    // Рендеринг формы
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="flex-start" 
        minHeight="70vh"
      >
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
          
          {config.fields.map(field => (
            <TextField
              key={field.id as string}
              margin="normal"
              required={field.required !== false}
              fullWidth
              type={field.type}
              label={field.label}
              placeholder={field.placeholder}
              id={field.id as string}
              value={formData[field.id] || ""}
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
              config.buttonText
            )}
          </Button>
        </Box>
      </Box>
    );
  };
};

export default withAuthForm;
