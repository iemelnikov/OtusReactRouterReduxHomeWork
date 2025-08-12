import { useState, useCallback, type FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AsyncThunkAction } from '@reduxjs/toolkit';
import { type AppDispatch } from "../../store/store";
import type { RootState } from "../../store/types";
import type { AuthFormProps } from "./types";
import { clearError } from "../../store/features/auth/authSlice";

// Проверка на пустое поле
const isFieldEmpty = (value: string): boolean => value.trim() === "";

export const withAuthLogic = <T extends Record<string, string>>(
  submitAction: (data: T) => AsyncThunkAction<any, T, any>,
  validateForm: (formData: T) => string[],
  successRedirect: string,
  requiredFields: Record<string, string>
) => {
  return (Component: FC<AuthFormProps<T>>) => {
    const EnhancedComponent: FC = () => {
      const dispatch = useDispatch<AppDispatch>();
      const navigate = useNavigate();
      const { loading, error } = useSelector((state: RootState) => state.auth);
      
      // Инициализация состояния формы
      const [formData, setFormData] = useState<T>({} as T);
      const [validationErrors, setValidationErrors] = useState<string[]>([]);

      // Обработчик изменения полей формы
      const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value } as T));
        setValidationErrors([]);
        dispatch(clearError());
      }, [dispatch]);

      // Обработчик отправки формы
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Проверка обязательных полей
        const requiredErrors: string[] = [];
        for (const [fieldId, fieldLabel] of Object.entries(requiredFields)) {
          if (isFieldEmpty(formData[fieldId] || "")) {
            requiredErrors.push(`Поле "${fieldLabel}" обязательно для заполнения!`);
          }
        }
        
        if (requiredErrors.length > 0) {
          setValidationErrors(requiredErrors);
          return;
        }

        // Специфичная валидация формы
        const customErrors = validateForm(formData);
        if (customErrors.length > 0) {
          setValidationErrors(customErrors);
          return;
        }
        
        // Выполнение действия отправки
        const result = await dispatch(submitAction(formData));
        
        // Переход при успешном выполнении
        if (result.meta.requestStatus === "fulfilled") {
          navigate(successRedirect);
        }
      };

      // Передаем пропсы в оборачиваемый компонент
      return (
        <Component
          formData={formData}
          validationErrors={validationErrors}
          error={error}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      );
    };
    return EnhancedComponent;
  };
};