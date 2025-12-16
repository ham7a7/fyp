import { apiClient } from '@/lib/api-client';
import type {
    AuthResponse,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '@/types/auth';

export const authService = {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', credentials);
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', credentials);
  },

  async logout(): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>('/api/auth/logout');
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>('/api/auth/me');
      return response.user;
    } catch (error) {
      return null;
    }
  },
};
