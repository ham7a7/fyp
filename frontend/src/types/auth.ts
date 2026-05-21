export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileCredentials {
  name: string;
  email: string;
}

export interface UpdatePasswordCredentials {
  currentPassword: string;
  newPassword: string;
}

export interface AuthResponse {
  message: string;
  user?: User;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (credentials: UpdateProfileCredentials) => Promise<AuthResponse>;
  updatePassword: (credentials: UpdatePasswordCredentials) => Promise<AuthResponse>;
  isAuthenticated: boolean;
}
