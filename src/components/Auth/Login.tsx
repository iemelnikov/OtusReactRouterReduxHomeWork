import { loginUser } from "../../store/features/auth/authSlice";
import { type AuthFormConfig, createAuthForm } from "../factories/authFormFactory";
import withAuthLogic from "./withAuthLogic";

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
const Login = withAuthLogic<LoginFormData>({
  submitAction: loginUser, // Действие при отправке формы
  validateForm: () => [], // Кастомная валидация отсутствует
  successRedirect: '/', // Перенаправление после успеха
  requiredFields: { // Обязательные поля с метками для ошибок
    email: "Электронная почта",
    password: "Пароль"
  }
})(LoginForm);

export default Login;