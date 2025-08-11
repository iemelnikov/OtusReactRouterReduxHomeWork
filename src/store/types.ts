// Типы и интерфейсы
export interface UserState {
  id: string;
  name: string;
  email: string;    
  passwordHash: string;
}

export interface AuthState {
  user: UserState | null;
  loading: boolean;
  error: string | null;
}

export type RootState = {
  auth : AuthState;
};