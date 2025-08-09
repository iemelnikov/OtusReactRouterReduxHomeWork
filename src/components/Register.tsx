import { withAuthForm } from './withAuthForm';
import { registerUser } from "../store";

// Проверка пароля и сбор ошибок
const validatePassword = (password: string): string[] => {
  const errors = [];
  
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
  
  return errors;
};

const Register = withAuthForm({
  title: "Регистрация",
  buttonText: "Зарегистрироваться",
  fields: [
    {
      id: "userName",
      type: "text",
      label: "Имя:",
      placeholder: "Введите ваше имя",
      required: true
    },
    {
      id: "email",
      type: "email",
      label: "Электронная почта:",
      placeholder: "Введите ваш email",
      required: true
    },
    {
      id: "password",
      type: "password",
      label: "Пароль:",
      placeholder: "Введите ваш пароль",
      required: true
    }
  ],
  validateForm: (formData) => {
    const errors: string[] = [];
    const passwordErrors = validatePassword(formData.password);
    
    if (passwordErrors.length > 0) {
      errors.push('Пароль должен содержать:');
      errors.push(...passwordErrors);
    }
    
    return errors;
  },
  submitAction: registerUser,
  successRedirect: '/login'
});

export default Register;