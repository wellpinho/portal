// Tipos para a rota de login

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token?: string;
  token?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: string;
    [key: string]: any;
  };
  message?: string;
  [key: string]: any;
}

export interface LoginError {
  message?: string;
  errors?: {
    email?: string[];
    password?: string[];
    [key: string]: string[] | undefined;
  };
  retryAfter?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  message?: string;
  retryAfter?: number;
}

export interface LoginAttempt {
  count: number;
  lastAttempt: number;
  blocked: boolean;
  blockUntil?: number;
}

export interface UseLoginReturn {
  getLogin: (
    formData: LoginRequest,
  ) => Promise<LoginResponse | LoginError | void>;
  state: {
    password: string;
    email: string;
    message: string;
    errors: {
      email: string;
      password: string;
    };
  };
  isLoading: boolean;
}
