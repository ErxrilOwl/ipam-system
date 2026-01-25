import { useState } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const auth = (access_token: string, refresh_token: string, user: User) => {
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, auth, logout }}>
            { children }
        </AuthContext.Provider>
    )
}