export type AuthFormProps<T extends Record<string, string>> = {
  formData: T;
  validationErrors: string[];
  error: string | null;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};