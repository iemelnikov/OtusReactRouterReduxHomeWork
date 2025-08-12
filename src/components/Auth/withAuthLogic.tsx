import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AsyncThunkAction } from '@reduxjs/toolkit';
import { type AppDispatch } from "../../store/store";
import type { RootState } from "../../store/types";
import type { AuthFormProps } from "./types";
import { clearError } from "../../store/features/auth/authSlice";
import { Alert, AlertTitle } from "@mui/material";

// Интерфейс конфигурации для HOC
interface AuthConfig<T extends Record<string, string>> {
  submitAction: (data: T) => AsyncThunkAction<any, T, any>;
  validateForm: (formData: T) => string[];
  successRedirect: string;
  requiredFields: Record<keyof T, string>;
}

function withAuthLogic<T extends Record<string, string>>(
  config: AuthConfig<T>
) {
  return function (WrappedComponent: React.ComponentType<AuthFormProps<T>>) {
    return function EnhancedAuthForm() {
      const dispatch = useDispatch<AppDispatch>();
      const navigate = useNavigate();
      const { loading, error } = useSelector((state: RootState) => state.auth);
      
      const [formData, setFormData] = useState<Partial<T>>({});
      const [validationErrors, setValidationErrors] = useState<string[]>([]);
 
      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        setValidationErrors(prev => prev.filter(err => !err.includes(id)));
        dispatch(clearError());
      }, [dispatch]);
 
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Валидация обязательных полей
        const requiredErrors = Object.entries(config.requiredFields)
          .filter(([fieldId]) => !formData[fieldId as keyof T]?.trim())
          .map(([_, label]) => `Поле "${label}" обязательно для заполнения!`);
 
        if (requiredErrors.length > 0) {
          setValidationErrors(requiredErrors);
          return;
        }
 
        // Пользовательская валидация
        const customErrors = config.validateForm(formData as T);
        if (customErrors.length > 0) {
          setValidationErrors(customErrors);
          return;
        }
 
        try {
          const resultAction = await dispatch(config.submitAction(formData as T));
          if (resultAction.meta.requestStatus === 'fulfilled') {
            navigate(config.successRedirect);
          }
        } catch (error) {
          // Ошибка обрабатывается Redux стором
        }
      };
 
      return (
        <>
          <WrappedComponent
            formData={formData as T}
            validationErrors={validationErrors}
            error={error}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
          {/* Рендеринг ошибок */}
          {error && (  
            <Alert severity="error" sx={{ mb: 2 }}>  
              {error}
            </Alert>
          )}
          {validationErrors && validationErrors.length > 0 && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Ошибки валидации</AlertTitle>
              <ul>
                {validationErrors.map((err, index) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </Alert>
          )}       
        </>
      );
    };
  };
}
 
export default withAuthLogic;