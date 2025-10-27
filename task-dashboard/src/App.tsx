import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { useAuthStore } from './stores/useAuthStore';
import { useEffect } from 'react';

function App() {
  const { initAuth } = useAuthStore();

  useEffect(() => {
    initAuth();
  }, []);

  return (
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
  );
}

export default App;