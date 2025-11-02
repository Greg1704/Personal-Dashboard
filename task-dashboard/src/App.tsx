import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'react';

// Configurar QueryClient con opciones globales
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos - datos considerados frescos
      gcTime: 10 * 60 * 1000, // 10 minutos - tiempo en caché (antes cacheTime)
      refetchOnWindowFocus: true, // Refetch al volver al tab
      retry: 2, // Reintentar 2 veces si falla
      refetchOnReconnect: true // Refetch al reconectar internet
    },
    mutations: {
      retry: 1 // Reintentar 1 vez las mutaciones si fallan
    }
  }
});

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Rutas públicas (sin Layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Rutas protegidas (con Layout) */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
      </Routes>

      {/* React Query DevTools - solo visible en desarrollo */}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}

export default App;