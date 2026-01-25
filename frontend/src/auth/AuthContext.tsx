import { createContext, useContext } from "react";
import type { User } from "../types/user";

interface AuthContextType {
    user: User | null;
    auth: (access_token: string, refresh_token: string, user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}