import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, UserState } from '../../types';


async function passwordHash(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(encodeURIComponent(password));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Начальное состояние аутентификации
const initialAuthState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

// Асинхронные thunk
// thunk для аутентификации пользователя
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: UserState) => u.email === email);
    if (!user)
      throw new Error('Пользователь не зарегистрирован');
    if (user.passwordHash !== await passwordHash(password))
      throw new Error('Неверный пароль');
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
);

// thunk для регистрации пользователя
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
      passwordHash: await passwordHash(password)
    };

    const updatedUsers = [...users, user];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return user;
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

      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
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

// Экспорты
export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
