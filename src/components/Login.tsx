import { type AuthFormConfig, createAuthForm } from "../factories/authFormFactory";
import { loginUser } from "../store/features/auth/authSlice";
import { withAuthForm } from "./withAuthForm";

// Тип данных для формы входа
type LoginFormData = {
  email: string;
  password: string;
};

// Конфигурация формы
const loginConfig: AuthFormConfig<LoginFormData> = {
  title: "Вход",
  fields: [
    { id: 'email', label: "Электронная почта", placeholder: "Введите ваш email", type: "email" },
    { id: 'password', label: "Пароль", placeholder: "Введите ваш пароль", type: "password" }
  ],
  submitButtonText: "Войти"
};

const LoginForm = createAuthForm(loginConfig);

// Обертываем компонент формы в HOC
const Login = withAuthForm(
  loginUser,
  () => [], // Кастомная валидация отсутствует
  '/', // Перенаправление после успеха
  { // Обязательные поля с метками для ошибок
    email: "Электронная почта",
    password: "Пароль"
  }
)(LoginForm);

export default Login;