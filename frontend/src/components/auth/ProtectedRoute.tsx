import type { JSX } from "react/jsx-runtime";
import { useAuth } from "../../hooks/auth/useAuthHook";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) return <div>Učitavanje...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return children;
};