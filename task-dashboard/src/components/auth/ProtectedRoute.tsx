import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthStore();

    // Mostrar loading mientras verifica la sesión
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    <p className="text-white mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Si está autenticado, mostrar el contenido
    return <>{children}</>;
}

export default ProtectedRoute;