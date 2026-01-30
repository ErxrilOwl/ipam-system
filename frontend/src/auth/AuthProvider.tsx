import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./AuthContext";
import { me } from '../api/auth.api';
import { router } from "../routes/Router";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const hasToken = !!localStorage.getItem('access_token');
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(hasToken);

    const auth = (access_token: string, refresh_token: string, user: User) => {
        if (!access_token || !refresh_token) {
            throw new Error("Invalid auth tokens");
        }

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        setUser(user);
    }

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    }

    useEffect(() => {
        if (!hasToken) return;

        me()
            .then(user => {
                setUser(user);
            })
            .catch(() => {
                router.navigate('/login');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [hasToken]);


    if (isLoading) {
        return null;
    }

    return (
        <AuthContext.Provider value={{ user, auth, logout, isLoading }}>
            { children }
        </AuthContext.Provider>
    )
}