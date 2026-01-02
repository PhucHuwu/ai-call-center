"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, AuthState } from "@/types";
import { login as loginApi, logout as logoutApi, getCurrentUser, getToken } from "@/services/auth";

interface AuthContextType extends AuthState {
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = getToken();
            if (token) {
                const userData = await getCurrentUser();
                if (userData) {
                    setUser(userData as User);
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, []);

    const login = async (username: string, password: string) => {
        const response = await loginApi(username, password);
        setUser(response.user as User);
    };

    const logout = () => {
        logoutApi();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        token: getToken() || null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        isLoading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
