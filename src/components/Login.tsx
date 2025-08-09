import { withAuthForm } from './withAuthForm';
import { loginUser } from '../store';

const Login = withAuthForm({
  title: "Вход",
  buttonText: "Войти",
  fields: [
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
  validateForm: () => [],
  submitAction: loginUser,
  successRedirect: '/'
});

export default Login;