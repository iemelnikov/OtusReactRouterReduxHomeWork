import { configureStore, createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
}

interface AuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

// Упрощённая хэш-функция для паролей
function passwordHash(password: string): string {
  // Простое преобразование в base64
  return btoa(encodeURIComponent(password));
}

// Начальное состояние аутентификации
const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Создание thunk для аутентификации пользователя
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserState) => u.email === email);
    if (!user)
      throw new Error('Пользователь не зарегистрирован');
    if (user.passwordHash !== passwordHash(password))
      throw new Error('Неверный пароль');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
);

// Создание thunk для регистрации пользователя
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ userName, email, password }: { userName: string; email: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some((u: UserState) => u.email === email)) {
      throw new Error('Пользователь с таким email уже существует');
    }
    const user: UserState = {
      id: crypto.randomUUID(),
      name: userName,
      email: email,
      passwordHash: passwordHash(password)
    };

    const updatedUsers = [...users, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  }
);

// Slice для авторизации пользователя
const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message || 'Регистрация пользователя не удалась';
        state.loading = false;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserState>) => {
        state.user = action.payload;
        state.loading = false;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.error.message || 'Аутентификация пользователя не удалась';
        state.loading = false;
      });
  },  
});

// Экспорт actions
export const { logout, clearError } = authSlice.actions;

// Создание store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
  },
});

// Типы для использования в компонентах
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;