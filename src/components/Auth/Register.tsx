import { registerUser } from "../../store/features/auth/authSlice";
import { type AuthFormConfig, createAuthForm } from "./authFormFactory";
import withAuthLogic from "./withAuthLogic";
// Тип данных для формы регистрации
type RegisterFormData = {
  userName: string;
  email: string;
  password: string;
};

// Проверка пароля
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("минимум 8 символов");
  }
  
  if (!/\d/.test(password)) {
    errors.push("цифры");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("заглавные буквы");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("строчные буквы");
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("специальные символы (!@#$%^&*)");
  }  

  return errors;
};

// Конфигурация формы
const registerConfig: AuthFormConfig<RegisterFormData> = {
  title: "Регистрация",
  fields: [
    { id: 'userName', label: "Имя", placeholder: "Введите ваше имя" },
    { id: 'email', label: "Электронная почта", placeholder: "Введите ваш email", type: "email" },
    { id: 'password', label: "Пароль", placeholder: "Введите ваш пароль", type: "password" }
  ],
  submitButtonText: "Зарегистрироваться"
};

const RegisterForm = createAuthForm(registerConfig)

// Обертываем форму в HOC
const Register = withAuthLogic<RegisterFormData>({
  submitAction: registerUser, // Действие при отправке формы
  validateForm: (formData) => { // Кастомная валидация
    const errors: string[] = [];
    const passwordErrors = validatePassword(formData.password);
    
    if (passwordErrors.length > 0) {
      errors.push('Пароль должен содержать:');
      errors.push(...passwordErrors);
    }
    
    return errors;
  },
  successRedirect: '/login', // Перенаправление после успеха
  requiredFields: { // Обязательные поля с метками для ошибок
    userName: "Имя",
    email: "Электронная почта",
    password: "Пароль"
  }
})(RegisterForm);


export default Register;