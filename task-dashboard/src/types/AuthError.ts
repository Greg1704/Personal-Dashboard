// src/types/AuthError.ts

// C�digos de error comunes de Firebase Auth
export type AuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/operation-not-allowed'
  | 'auth/weak-password'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/invalid-credential'
  | 'auth/too-many-requests'
  | 'auth/network-request-failed'
  | 'auth/popup-closed-by-user'
  | 'auth/cancelled-popup-request'
  | 'unknown';

export interface AuthError {
  code: AuthErrorCode;
  message: string;
}

// Funci�n helper para convertir errores de Firebase a mensajes amigables
export const getAuthErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado.',
        'auth/invalid-email': 'El correo electrónico no es válido.',
        'auth/operation-not-allowed': 'Esta operación no está permitida.',
        'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
        'auth/user-not-found': 'No existe una cuenta con este correo electrónico.',
        'auth/wrong-password': 'Contraseña incorrecta.',
        'auth/invalid-credential': 'Las credenciales son inválidas o han expirado.',
        'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde.',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
        'auth/popup-closed-by-user': 'La ventana de autenticación fue cerrada.',
        'auth/cancelled-popup-request': 'Operación cancelada.',
    };

    return errorMessages[errorCode] || 'Ha ocurrido un error. Intenta de nuevo.';
};