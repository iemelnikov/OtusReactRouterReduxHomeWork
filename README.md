# Домашнее задание курса OTUS C# ASP.NET Core: Роутинг и управление стейтом с React

В React-проект были добавлены react-router, react-redux, @reduxjs/toolkit и mui/material.
Были созданы отдельные компоненты страниц - Login / Register / Home / NotFound.
Добавлен стейт-менеджмент с Redux.
Также было устранено дублирование кода между Login и Register, используя фабричный метод (createAuthForm) и HOC паттерн для общей логики формы аутентификации (withAuthForm): состояние формы, обработчики изменения и отправки, базовая валидация обязательных полей, dispatch, навигация.
Использованные UI-компоненты из библиотеки Material UI: Box, Container, Typography, TextField, Button, Paper, Alert, CircularProgress.