import { configureStore } from '@reduxjs/toolkit';
import authReducer  from './features/auth/authSlice';
import type { RootState } from './types';

// Инициализация пользователя из localStorage
const preloadedState: RootState = {
  auth: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  }
};

// Создание store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState
});

export type AppDispatch = typeof store.dispatch;
export default store;