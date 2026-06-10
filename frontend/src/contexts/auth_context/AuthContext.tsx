import { createContext, useState, useEffect, type ReactNode } from "react";
import { readItem, saveItem } from "../../helpers/local_storage";
import type { User } from "../../models/users/User";
import type { JwtTokenClaims } from "../../types/auth/JwtTokenClaims";
import type { AuthContextType } from "../../types/auth/AuthContext";
import { jwtDecode } from "jwt-decode";
import { authService } from "../../api_services/authApi/AuthApiService";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState({
        user: null as User | null,
        token: null as string | null,
        isLoading: true,
    });

    const parseToken = (token: string): User | null => {
        try {
            const decoded = jwtDecode<JwtTokenClaims>(token);

            if (decoded.exp * 1000 < Date.now()) {
                return null;
            }

            return {
                id: decoded.sub,
                firstName: "", // Token ne vraća ime/prezime
                lastName: "",
                email: decoded.email,
                role: decoded.role,
            };
        } catch {
            return null;
        }
    };

    useEffect(() => {
        const token = readItem<string>("token");
        if (token) {
            const user = parseToken(token);

            if (!user) {
                authService.logout();

                setState({
                    user: null,
                    token: null,
                    isLoading: false,
                });

                return;
            }

            setState({ user, token, isLoading: false });
        } else {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    const login = (token: string) => {
        saveItem("token", token);
        const user = parseToken(token);
        setState({ user, token, isLoading: false });
    };

    const logout = () => {
        authService.logout();
        setState({ user: null, token: null, isLoading: false });
    };

    const value: AuthContextType = {
        user: state.user,
        token: state.token,
        login,
        logout,
        isAuthenticated: !!state.token,
        isLoading: state.isLoading
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
