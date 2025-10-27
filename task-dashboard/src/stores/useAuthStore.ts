import {type User} from '../types/User';
import { authService } from '../services/authService';
import { create } from 'zustand';
import {getAuthErrorMessage} from '../types/AuthError';

interface AuthStore {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    signUp: (email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
    initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,  // true al inicio mientras verifica sesión
    error: null,

    signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await authService.signUpWithEmail(email, password);
        } catch (error: any) {
            set({ error: getAuthErrorMessage(error.code) });
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            await authService.loginWithEmail(email, password);
        } catch (error: any) {
            set({ error: getAuthErrorMessage(error.code) });
        } finally {
            set({ isLoading: false });
        }
    },

    loginWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
            await authService.loginWithGoogle();
        } catch (error: any) {
            set({ error: getAuthErrorMessage(error.code)});
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            await authService.logout();
        } catch (error: any) {
            set({ error: getAuthErrorMessage(error.code)});
        } finally {
            set({ isLoading: false });
        }
    },

    clearError: () => {
        set({ error: null });
    },

    initAuth: () => {
        set({ isLoading: true });
        authService.onAuthStateChanged((user) => {
            set({
                user,
                isAuthenticated: !!user,
                isLoading: false  // Termina de cargar después de verificar sesión
            });
        });
    }

}));