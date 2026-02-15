import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Vitrine from './pages/Vitrine';
import Objections from './pages/Objections';
import Admin from './pages/Admin';

import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import ErrorBoundary from './components/ErrorBoundary';

// Guard: shows spinner while auth loads, redirects if not logged in
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{
            minHeight: '100vh',
            background: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px'
        }}>
            <div style={{
                width: 48, height: 48,
                border: '4px solid #f59e0b',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ fontWeight: 'bold', fontSize: 18 }}>Carregando...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

const AdminRoute = ({ children }) => {
    const { user, loading, isAdmin } = useAuth();
    if (loading) return null;
    if (!user || !isAdmin) return <Navigate to="/" replace />;
    return children;
};

function AppRoutes() {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <StoreProvider>
                        <Layout />
                    </StoreProvider>
                </ProtectedRoute>
            }>
                <Route index element={<Dashboard />} />
                <Route path="vitrine" element={<Vitrine />} />
                <Route path="objections" element={<Objections />} />
                <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}


function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <BrowserRouter>
                    <AppRoutes />
                </BrowserRouter>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;
