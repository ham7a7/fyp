'use client';

import { authService } from '@/services/auth.service';
import type {
  AuthContextType,
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdatePasswordCredentials,
  UpdateProfileCredentials,
  User,
} from '@/types/auth';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await authService.login(credentials);
        if (response.user) {
          setUser(response.user);
          router.push('/dashboard');
        }
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      try {
        const response = await authService.register(credentials);
        if (response.user) {
          setUser(response.user);
          router.push('/dashboard');
        }
      } catch (error) {
        throw error;
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push('/login');
    } catch (error) {
      // Still clear local state even if the API call fails
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const updateProfile = useCallback(
    async (credentials: UpdateProfileCredentials):Promise<AuthResponse> => {
      
      const res = await authService.updateProfile(credentials);
      setUser(res.user || null);
      return res;
  
    },
    []
  );

  const updatePassword = useCallback(
    async (credentials: UpdatePasswordCredentials):Promise<AuthResponse> =>  {
     
      const res = await authService.updatePassword(credentials);
      return res

    },
    []
  );

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
